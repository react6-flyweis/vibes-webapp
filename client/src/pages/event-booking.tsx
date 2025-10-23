import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useParams } from "react-router";
import { CheckCircle, AlertTriangle, Download, Smartphone } from "lucide-react";
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
  const [step, setStep] = useState<
    "tickets" | "seats" | "checkout" | "confirmation"
  >("tickets");

  // shared payment mutation used by dialogs/pages
  const createEntryTicketsPaymentMutation = useCreateEntryTicketsPayment();

  // Fetch event details using centralized query
  const { data: event, isLoading: eventLoading } = useEventByIdQuery(eventId);

  const { data: userProfile } = useQuery<{ loyaltyPoints?: number }>({
    queryKey: ["/api/user/profile"],
  });

  // mutation to create userget tickets (reserve / register tickets for the user)
  const createUserGetTickets = useCreateEventEntryUserTickets({
    onSuccess: (data) => {
      toast({
        title: "Tickets reserved",
        description: `Reserved ${data.tickets?.length ?? 0} ticket types.`,
      });
      // proceed to checkout after successful reservation
      setStep("checkout");
    },
    onError: (err) => {
      toast({
        title: "Could not reserve tickets",
        description: (err && (err as any).message) || String(err),
        variant: "destructive",
      });
    },
  });

  // Create ticket order mutation (checkout)
  const ticketOrderMutation = useCreateTicketOrder({
    onSuccess: (data) => {
      toast({
        title: "Order created",
        description:
          "Your order was created. Please complete payment to confirm your booking.",
      });
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

  // Apply promo code mutation
  const promoMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/promo/validate", { code, eventId });
    },
    onSuccess: (data) => {
      toast({
        title: "Promo Code Applied",
        description: `${data.discount}% discount applied!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Promo Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTicketQuantityChange = (
    ticket: EventEntryTicket,
    quantity: number
  ) => {
    const ticketId = ticket.event_entry_tickets_id;
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));

    // also store/remove full ticket details using event data if available

    setSelectedTicketDetails((prev) => {
      const next = { ...prev };
      if (quantity > 0 && ticket) {
        next[ticketId] = ticket;
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

  // Extracted handler to reserve/book seats (calls createUserGetTickets mutation)
  const handleBookSeats = () => {
    // prepare payload from selectedTickets and call reservation mutation
    const ticketsPayload = Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        event_entry_tickets_id: Number(typeId),
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

  // Step 1: create order on server which returns calculation details + order id
  const createOrderOnServer = () => {
    const tickets = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        event_entry_tickets_id: Number(typeId),
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
      loyalty_points: usePoints ? userProfile?.loyaltyPoints ?? false : false,
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

  // category color helper was moved into TicketItem component

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
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
                  />

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setStep("seats")}
                      disabled={getTotalTickets() === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Seat Selection
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
                    onBack={() => setStep("tickets")}
                    onContinue={handleBookSeats}
                    reserving={createUserGetTickets.isPending}
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
                    onApplyPromo={(code) => promoMutation.mutate(code)}
                    usePoints={usePoints}
                    setUsePoints={setUsePoints}
                    userProfile={userProfile}
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
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Tickets
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Add to Wallet
                    </Button>
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
                  promo={
                    promoMutation.data
                      ? { discount: promoMutation.data.discount }
                      : null
                  }
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
          // payment confirmed in UI; call pay endpoint with created order id
          const created = pendingPayment?.orderResponse;
          const orderId =
            created?.event_entry_tickets_order_id ??
            created?.event_entry_tickets_order_id;
          if (!orderId) {
            toast({
              title: "Missing order",
              description: "Cannot process payment: order id missing.",
              variant: "destructive",
            });
            return;
          }

          // call pay mutation
          // payOrderMutation.mutate({
          //   event_entry_tickets_order_id: orderId,
          //   payment,
          // });
          // close dialog
          setPriceDialogOpen(false);
        }}
        orderResponse={pendingPayment?.orderResponse}
        paymentIntent={pendingPayment?.paymentIntent}
        onMethodSelect={handleMethodSelect}
      />
    </div>
  );
}
