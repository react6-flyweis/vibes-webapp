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
  // indicates that payment has been confirmed and tickets are ready to download
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [step, setStep] = useState<
    "tickets" | "seats" | "checkout" | "confirmation"
  >("tickets");

  // shared payment mutation used by dialogs/pages
  const createEntryTicketsPaymentMutation = useCreateEntryTicketsPayment();

  // Fetch event details using centralized query
  const { data: event, isLoading: eventLoading } = useEventByIdQuery(eventId);

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
    const orderId = order.event_entry_tickets_order_id ?? order._id ?? "-";
    const finalAmount = order.final_amount ?? calc.final_amount ?? 0;

    const styles = `
      body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #0f172a; }
      .ticket { max-width: 720px; margin: 24px auto; padding: 20px; border-radius: 12px; background: linear-gradient(135deg,#0ea5e9,#7c3aed); color: #fff; }
      .ticket h1 { margin: 0 0 8px 0; font-size: 22px; }
      .meta { display:flex; justify-content:space-between; margin-bottom:12px; }
      .section { background: rgba(255,255,255,0.06); padding:12px; border-radius:8px; margin-top:8px }
      table { width:100%; border-collapse:collapse; }
      td, th { padding:8px; text-align:left; }
      .right { text-align:right; }
      .actions { margin-top:16px; display:flex; gap:8px; }
      button { background:#fff; color:#0f172a; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; }
    `;

    const ticketsHtml = breakdown
      .map(
        (t: any) => `
          <div class="section">
            <strong>${t.ticket_title || t.title || "Ticket"}</strong>
            <div>Quantity: ${t.quantity}</div>
            <div>Price per ticket: ${t.price_per_ticket ?? t.price ?? "-"}</div>
            <div>Subtotal: ${t.item_subtotal ?? "-"}</div>
          </div>`
      )
      .join("");

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Tickets - ${eventTitle}</title>
        <style>${styles}</style>
      </head>
      <body>
        <div class="ticket">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <h1>${eventTitle}</h1>
              <div>Order: <strong>${orderId}</strong></div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;font-size:18px">Total</div>
              <div style="font-size:20px">${finalAmount}</div>
            </div>
          </div>

          <div style="margin-top:12px">
            ${ticketsHtml}
          </div>

          <div class="section">
            <table>
              <tbody>
                <tr><td>Subtotal</td><td class="right">${
                  calc.subtotal ?? order.subtotal ?? "-"
                }</td></tr>
                <tr><td>Tax (${
                  calc.tax_percentage ?? "-"
                }%)</td><td class="right">${
      calc.tax_amount ?? order.tax ?? "-"
    }</td></tr>
                <tr><td><strong>Final</strong></td><td class="right"><strong>${finalAmount}</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div class="actions">
            <button id="printBtn">Print / Save as PDF</button>
            <button id="closeBtn">Close</button>
          </div>
        </div>

        <script>
          document.getElementById('printBtn').addEventListener('click', function(){ window.print(); });
          document.getElementById('closeBtn').addEventListener('click', function(){ window.close(); });
        </script>
      </body>
    </html>`;

    // Try a few strategies to reliably open the printable ticket view.
    // 1) window.open without features (some blockers disallow feature strings)
    // 2) fall back to a data: URL via programmatic anchor click
    // Only show the "popup blocked" toast if all methods fail.
    let opened = false;

    try {
      const w = window.open("", "_blank");
      if (w) {
        try {
          w.document.open();
          w.document.write(html);
          w.document.close();
          opened = true;
        } catch (e) {
          // Some browsers may refuse write on a newly opened window. Try navigating it to a data URL instead.
          try {
            w.location.href =
              "data:text/html;charset=utf-8," + encodeURIComponent(html);
            opened = true;
          } catch (err) {
            // give up on this window handle
            try {
              w.close();
            } catch {}
          }
        }
      }
    } catch (e) {
      // ignore and try anchor fallback
    }

    if (!opened) {
      try {
        const a = document.createElement("a");
        a.href = "data:text/html;charset=utf-8," + encodeURIComponent(html);
        a.target = "_blank";
        // Safari requires the element to be in the document
        document.body.appendChild(a);
        a.click();
        a.remove();
        opened = true;
      } catch (e) {
        opened = false;
      }
    }

    if (!opened) {
      toast({
        title: "Popup blocked",
        description:
          "Please allow popups to download tickets or use the browser's print to save.",
        variant: "destructive",
      });
    }
  };
  // category color helper was moved into TicketItem component

  if (eventLoading) {
    // Skeleton loading state: mimic page layout so content doesn't jump
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Header skeleton */}
              <div className="bg-white/6 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-28 h-28 bg-white/10 rounded-md animate-pulse" />
                  <div className="flex-1">
                    <div className="h-6 bg-white/10 rounded w-3/4 mb-3 animate-pulse" />
                    <div className="h-4 bg-white/8 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Tickets selection skeletons */}
              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-md p-4">
                <div className="mb-4">
                  <div className="h-5 bg-white/10 rounded w-1/3 mb-2 animate-pulse" />
                  <div className="h-4 bg-white/8 rounded w-1/4 animate-pulse" />
                </div>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 p-3 bg-white/6 rounded-md"
                    >
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-2/3 mb-2 animate-pulse" />
                        <div className="h-3 bg-white/8 rounded w-1/3 animate-pulse" />
                      </div>

                      <div className="w-24 h-8 bg-white/8 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="h-10 w-48 bg-blue-600/70 rounded-md animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div>
              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-md p-4 sticky top-4">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/8 rounded w-full animate-pulse" />
                  <div className="h-4 bg-white/8 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-white/8 rounded w-3/4 animate-pulse" />
                </div>

                <div className="mt-6 h-10 bg-blue-600/70 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
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
