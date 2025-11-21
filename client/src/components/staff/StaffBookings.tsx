import React, { useState } from "react";
import useStaffBookings from "@/hooks/useStaffBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useCreateStaffBookingPayment } from "@/mutations/useCreateStaffBookingPayment";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import SuccessDialog from "@/components/SuccessDialog";
import BookingDetailsDialog from "@/components/staff/BookingDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

export function StaffBookings() {
  const { data: bookings, isLoading, error } = useStaffBookings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<
    any | null
  >(null);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(
    null
  );

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<
    any | null
  >(null);

  const createStaffBookingPaymentMutation = useCreateStaffBookingPayment();

  const getStatusColor = (status: string | null | undefined) => {
    if (!status) return "bg-gray-500/10 text-gray-600 border-gray-500/20";

    switch (status.toLowerCase()) {
      case "pending":
      case "requires_payment_method":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
      case "completed":
      case "succeeded":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
      case "failed":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "-";
    }
  };

  const isPaymentRequired = (booking: any) => {
    const status = booking?.transaction_status?.toLowerCase();
    return (
      !status ||
      status === "pending" ||
      status === "requires_payment_method" ||
      status === "failed"
    );
  };

  const handlePayClick = (booking: any) => {
    setSelectedBookingForPayment(booking);
    setShowPaymentDialog(true);
  };

  const handleMethodSelectForBooking = async (method: number) => {
    try {
      const bookingId =
        selectedBookingForPayment?.staff_event_book_id ??
        selectedBookingForPayment?._id;

      if (!bookingId) throw new Error("Missing booking id");

      const res = await createStaffBookingPaymentMutation.mutateAsync({
        staff_event_book_id: Number(bookingId),
        payment_method_id: method,
        billingDetails: "Staff Booking Payment",
      });

      return res.data.data.paymentIntent;
    } catch (err: any) {
      console.error("Failed to create staff booking payment intent:", err);
      throw err;
    }
  };

  const handlePaymentConfirmed = (payment: any) => {
    const payload = payment?.data ?? payment;
    const transaction =
      payload?.transaction ??
      payload?.data?.transaction ??
      payload?.paymentIntent ??
      payload?.payment_intent ??
      payload;

    setPaymentSuccessData({
      booking: selectedBookingForPayment,
      transaction,
    });
    setPaymentSuccessOpen(true);
    setShowPaymentDialog(false);
    setSelectedBookingForPayment(null);

    queryClient.invalidateQueries({
      queryKey: ["/api/master/staff-event-book/getByAuth"],
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Staff Bookings</CardTitle>
          {bookings && bookings.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Total: {bookings.length}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Loading bookings...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Failed to load bookings
              </div>
            </div>
          ) : bookings?.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                No staff bookings found.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings?.map((booking) => {
                const requiresPayment = isPaymentRequired(booking);

                return (
                  <div
                    key={booking._id}
                    className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left side - booking info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">
                              {booking.event_name}
                            </h3>
                            {booking.event_type_id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Event Type ID: {booking.event_type_id}
                              </p>
                            )}
                          </div>
                          <Badge
                            className={`${getStatusColor(
                              booking.transaction_status
                            )} border`}
                            variant="outline"
                          >
                            {requiresPayment ? (
                              <span className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Payment Required
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {booking.transaction_status || "Confirmed"}
                              </span>
                            )}
                          </Badge>
                        </div>

                        {booking.event_address && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{booking.event_address}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-muted-foreground">
                                Date:{" "}
                              </span>
                              <span className="font-medium">
                                {formatDate(booking.dateFrom)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <span className="text-muted-foreground">
                                Time:{" "}
                              </span>
                              <span className="font-medium">
                                {booking.timeFrom || "-"} -{" "}
                                {booking.timeTo || "-"}
                              </span>
                            </div>
                          </div>

                          {booking.no_of_guests && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="text-muted-foreground">
                                  Guests:{" "}
                                </span>
                                <span className="font-medium">
                                  {booking.no_of_guests}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {booking.special_instruction && (
                          <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
                            <strong>Special Instructions:</strong>{" "}
                            {booking.special_instruction}
                          </div>
                        )}
                      </div>

                      {/* Right side - actions */}
                      <div className="flex flex-row md:flex-col gap-2">
                        {requiresPayment && (
                          <Button
                            size="sm"
                            className="bg-gradient-cta hover:opacity-90 transition-opacity"
                            onClick={() => handlePayClick(booking)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Now
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-gray-50"
                          onClick={() => {
                            setSelectedBookingForDetails(booking);
                            setShowDetailsDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <PriceConfirmationDialog
        open={showPaymentDialog}
        onOpenChange={(open) => {
          setShowPaymentDialog(open);
          if (!open) {
            setSelectedBookingForPayment(null);
          }
        }}
        priceEstimate={Number(selectedBookingForPayment?.amount ?? 0)}
        onPrevious={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentConfirmed}
        onMethodSelect={handleMethodSelectForBooking}
      />

      {/* Small Details Dialog */}
      <BookingDetailsDialog
        open={showDetailsDialog}
        onOpenChange={(open) => {
          setShowDetailsDialog(open);
          if (!open) setSelectedBookingForDetails(null);
        }}
        booking={selectedBookingForDetails}
      />

      {/* Payment Success Dialog */}
      <SuccessDialog
        open={paymentSuccessOpen}
        onOpenChange={(open) => {
          setPaymentSuccessOpen(open);
          if (!open) setPaymentSuccessData(null);
        }}
        title="Payment Successful"
        description="Your staff booking payment has been processed successfully."
        details={
          paymentSuccessData
            ? [
                {
                  label: "Amount",
                  value: paymentSuccessData.transaction?.amount
                    ? `$${(paymentSuccessData.transaction.amount / 100).toFixed(
                        2
                      )}`
                    : "-",
                },
                {
                  label: "Reference",
                  value:
                    paymentSuccessData.transaction?.reference_number ||
                    paymentSuccessData.transaction?.id ||
                    paymentSuccessData.transaction?.transaction_id ||
                    "-",
                },
                {
                  label: "Event",
                  value: paymentSuccessData.booking?.event_name || "-",
                },
                {
                  label: "Date",
                  value: formatDate(paymentSuccessData.booking?.dateFrom),
                },
              ]
            : null
        }
        onDone={() => setPaymentSuccessOpen(false)}
      />
    </>
  );
}

export default StaffBookings;
