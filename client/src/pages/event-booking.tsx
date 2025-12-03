import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router";
import { CheckCircle, AlertTriangle, Download } from "lucide-react";
import useTicketDownloader from "@/hooks/useTicketDownloader";
import TicketList from "@/components/EventBooking/TicketList";
import Stepper from "@/components/EventBooking/Stepper";
import { useEventByIdQuery } from "@/queries/events";
import SeatSelection from "@/components/EventBooking/SeatSelection";
import { useCreateEventEntryUserTickets } from "@/mutations/createEventEntryUserTickets";
import { useCreateTicketOrder } from "@/mutations/createTicketOrder";
import CheckoutForm from "@/components/EventBooking/CheckoutForm";
import OrderSummary from "@/components/EventBooking/OrderSummary";
import EventHeader from "@/components/EventBooking/EventHeader";
import { EventEntryTicket } from "@/queries/tickets";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import { useCreateEntryTicketsPayment } from "@/mutations/useCreateEntryTicketsPayment";
import { useCreateEventTicketSeats } from "@/mutations/createEventTicketSeats";

export default function EventBooking() {
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});
  // store full ticket details keyed by ticket id
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<
    Record<string, EventEntryTicket>
  >({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  // indicates that payment has been confirmed and tickets are ready to download
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [step, setStep] = useState<
    "tickets" | "seats" | "checkout" | "confirmation"
  >("tickets");
  // store created userget tickets data for seat assignment
  const [userGetTicketsData, setUserGetTicketsData] = useState<any>(null);

  // shared payment mutation used by dialogs/pages
  const createEntryTicketsPaymentMutation = useCreateEntryTicketsPayment();

  // ticket downloader helper
  const { openPrintable } = useTicketDownloader();

  // Fetch event details using centralized query
  const { data: event, isLoading: eventLoading } = useEventByIdQuery(eventId);

  // mutation to create userget tickets (reserve / register tickets for the user)
  const createUserGetTickets = useCreateEventEntryUserTickets({
    onSuccess: (data) => {
      toast({
        title: "Tickets reserved",
        description: `Reserved ${data.tickets?.length ?? 0} ticket types.`,
      });
      // store the userget tickets data for seat assignment
      setUserGetTicketsData(data);
      // proceed to seat selection after successful reservation
      setStep("seats");
    },
    onError: (err) => {
      toast({
        title: "Could not reserve tickets",
        description: (err && (err as any).message) || String(err),
        variant: "destructive",
      });
    },
  });

  // mutation to create seat assignments
  const createTicketSeats = useCreateEventTicketSeats({
    onSuccess: (data) => {
      toast({
        title: "Seats assigned",
        description: "Your seats have been successfully assigned.",
      });
      // proceed to checkout after seat assignment
      setStep("checkout");
    },
    onError: (err) => {
      toast({
        title: "Seat assignment failed",
        description: (err && (err as any).message) || String(err),
        variant: "destructive",
      });
    },
  });

  // Create ticket order mutation (checkout)
  const ticketOrderMutation = useCreateTicketOrder({
    onSuccess: (data) => {
      // toast({
      //   title: "Order created",
      //   description:
      //     "Your order was created. Please complete payment to confirm your booking.",
      // });
      // Do not move to confirmation until payment is completed.
      // The payment dialog will be opened by the createOrderOnServer onSuccess handler.
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookings"] });
    },
    onError: (err) => {
      toast({
        title: "Booking Failed",
        description: (err && (err as any).message) || String(err),
        variant: "destructive",
      });
    },
  });

  const handleTicketQuantityChange = (ticket: any, quantity: number) => {
    const ticketId = ticket.ticket_id || ticket.event_entry_tickets_id;
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));

    // also store/remove full ticket details using event data if available
    setSelectedTicketDetails((prev) => {
      const next = { ...prev };
      if (quantity > 0 && ticket) {
        // Merge the ticket with its details (same as TicketList/TicketItem)
        const mergedTicket = { ...ticket, ...ticket.ticketDateils?.[0] };
        next[ticketId] = mergedTicket;
      } else {
        // remove if quantity is zero
        delete next[ticketId];
      }
      return next;
    });
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  // Handler to reserve tickets (Step 2: after selecting ticket counts)
  const handleReserveTickets = () => {
    const ticketsPayload = Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        ticket_id: Number(typeId),
        quantity,
      }));

    if (!eventId) {
      toast({
        title: "Missing event id",
        description: "Cannot reserve tickets without an event id.",
        variant: "destructive",
      });
      return;
    }

    if (ticketsPayload.length === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive",
      });
      return;
    }

    createUserGetTickets.mutate({
      event_id: Number(eventId),
      tickets: ticketsPayload,
    });
  };

  // Handler to assign seats (Step 3: after selecting seats)
  const handleBookSeats = async () => {
    if (!userGetTicketsData) {
      toast({
        title: "Tickets not reserved",
        description: "Please go back and reserve tickets first.",
        variant: "destructive",
      });
      return;
    }

    if (!eventId) {
      toast({
        title: "Missing event id",
        description: "Cannot assign seats without an event id.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSeats.length !== getTotalTickets()) {
      toast({
        title: "Seat selection incomplete",
        description: `Please select ${getTotalTickets()} seat(s).`,
        variant: "destructive",
      });
      return;
    }

    const ticketsPayload = Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        ticket_id: Number(typeId),
        quantity,
      }));

    try {
      // Assign seats for each ticket type
      let seatIndex = 0;
      for (const ticketPayload of ticketsPayload) {
        const seatsForThisTicket = selectedSeats.slice(
          seatIndex,
          seatIndex + ticketPayload.quantity
        );
        seatIndex += ticketPayload.quantity;

        // Create seat assignment
        await createTicketSeats.mutateAsync({
          event_entry_tickets_id: Number(ticketPayload.ticket_id),
          event_entry_userget_tickets_id:
            userGetTicketsData.event_entry_userget_tickets_id,
          event_id: Number(eventId),
          seat_no: seatsForThisTicket,
          capacity: ticketPayload.quantity,
          status: true,
        });
      }
    } catch (err) {
      // Error handling is done in mutation callbacks
      console.error("Error during seat assignment:", err);
    }
  };

  // Step 1: create order on server which returns calculation details + order id
  const createOrderOnServer = () => {
    const tickets = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        ticket_id: Number(typeId),
        quantity,
      }));

    if (!eventId) {
      toast({
        title: "Missing event id",
        description: "Cannot create order without event id.",
        variant: "destructive",
      });
      return;
    }

    if (tickets.length === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      event_id: Number(eventId),
      tax_percentage: 10,
      coupon_code: promoCode || null,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phoneNo: personalInfo.phone,
      promo_code: promoCode || null,
      loyalty_points: usePoints ?? false,
      tickets,
    };

    // create an order on the server; onSuccess we'll open the payment dialog
    ticketOrderMutation.mutate(payload, {
      onSuccess: (orderResponse) => {
        const finalAmount =
          orderResponse?.final_amount ??
          orderResponse?.calculation_details?.final_amount ??
          0;
        setPriceEstimate(finalAmount);
        setPendingPayment({ orderResponse });
        setPriceDialogOpen(true);
      },
    });
  };

  const handleMethodSelect = async (method: number) => {
    // create intent and return payment intent data

    const res = await createEntryTicketsPaymentMutation.mutateAsync({
      order_id: pendingPayment.orderResponse.event_entry_tickets_order_id,
      payment_method_id: method,
      billingDetails: "Ticket Booking",
    });

    const paymentIntent = res.data.data.paymentIntent;

    return paymentIntent;
  };

  // Open a printable ticket view using the order response stored in state.
  const handleDownloadTickets = () => {
    if (!pendingPayment?.orderResponse) {
      toast({
        title: "No tickets available",
        description: "We couldn't find an order to generate tickets from.",
        variant: "destructive",
      });
      return;
    }

    const order = pendingPayment.orderResponse;
    const calc = order.calculation_details || {};
    const breakdown = calc.ticket_breakdown || [];

    const eventTitle = (event && (event.name_title || "Event")) || "Event";
    const venueDetails = event?.venue_details_id;
    const eventDate = event?.date;
    const eventTime = event?.time;

    openPrintable({
      eventTitle,
      order,
      breakdown,
      toast,
      venueDetails,
      eventDate,
      eventTime,
    });
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center items-center w-full mb-4">
              <div className=" animate-spin h-12 w-12 border-4 border-t-transparent rounded-full border-white/40"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading event...</h2>
            <p className="text-gray-300">
              Fetching event details, please wait.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-gray-300">
              The event you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <Stepper current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <EventHeader event={event} />

            {/* Step Content */}
            {step === "tickets" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Select Your Tickets
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Choose the ticket type and quantity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TicketList
                    selectedTickets={selectedTickets}
                    onChange={handleTicketQuantityChange}
                    tickets={event?.EventTicketsData || []}
                  />

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleReserveTickets}
                      disabled={
                        getTotalTickets() === 0 ||
                        createUserGetTickets.isPending
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createUserGetTickets.isPending
                        ? "Reserving..."
                        : "Reserve Tickets"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "seats" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Choose Your Seats
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Select {getTotalTickets()} seat(s) for your tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SeatSelection
                    selectedSeats={selectedSeats}
                    onChange={setSelectedSeats}
                    requiredCount={getTotalTickets()}
                    eventId={eventId}
                    onBack={() => setStep("tickets")}
                    onContinue={handleBookSeats}
                    reserving={createTicketSeats.isPending}
                    bookedSeats={event?.ticket_details}
                  />
                </CardContent>
              </Card>
            )}

            {step === "checkout" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Checkout</CardTitle>
                  <CardDescription className="text-blue-100">
                    Complete your booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckoutForm
                    personalInfo={personalInfo}
                    setPersonalInfo={setPersonalInfo}
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    usePoints={usePoints}
                    setUsePoints={setUsePoints}
                    onBack={() => setStep("seats")}
                    onComplete={createOrderOnServer}
                    isLoading={ticketOrderMutation.isPending}
                  />
                </CardContent>
              </Card>
            )}

            {step === "confirmation" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Your tickets have been booked successfully. You'll receive a
                    confirmation email shortly.
                  </p>

                  <div className="flex justify-center gap-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleDownloadTickets()}
                      disabled={!isPaid || !pendingPayment}
                      title={
                        !isPaid
                          ? "Tickets will be available after payment confirmation"
                          : "Download your tickets"
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isPaid ? "Download Tickets" : "Preparing Tickets..."}
                    </Button>
                    {/* <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Add to Wallet
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderSummary
                  selectedTickets={selectedTickets}
                  selectedTicketDetails={selectedTicketDetails}
                  selectedSeats={selectedSeats}
                  // promo={
                  //   promoMutation.data
                  //     ? { discount: promoMutation.data.discount }
                  //     : null
                  // }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Price confirmation dialog wired to checkout */}
      <PriceConfirmationDialog
        open={priceDialogOpen}
        onOpenChange={(open) => setPriceDialogOpen(open)}
        priceEstimate={priceEstimate}
        onPrevious={() => {
          // go back to checkout step
          setPriceDialogOpen(false);
          setStep("checkout");
        }}
        onConfirm={(payment) => {
          // mark payment as successful and keep the pendingPayment order data
          toast({
            title: "Payment Successful",
            description: "Your payment was processed successfully.",
          });
          setPriceDialogOpen(false);
          // mark as paid so downloads become available
          setIsPaid(true);
          // move to confirmation step
          setStep("confirmation");
        }}
        orderResponse={pendingPayment?.orderResponse}
        paymentIntent={pendingPayment?.paymentIntent}
        onMethodSelect={handleMethodSelect}
      />
    </div>
  );
}
