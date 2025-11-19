import React, { useState } from "react";
import {
  useVendorBookingsByAuth,
  useVendorBookingCancellation,
} from "@/queries/vendorBookings";
import { useCreateVendorBookingPayment } from "@/mutations/useCreateVendorBookingPayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CancelConfirmationDialog from "@/components/vendor/CancelConfirmationDialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  CalendarDays,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import SuccessDialog from "@/components/SuccessDialog";
import RescheduleBookingDialog from "@/components/RescheduleBookingDialog";
import { useQueryClient } from "@tanstack/react-query";

export function VendorBookings() {
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<
    any | null
  >(null);

  const { data, isLoading, error } = useVendorBookingsByAuth(page, limit);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // The original cancel hook is deprecated for this component; we use the
  // `vendorBookingCancellationMutation` (below) that supports full payloads.

  // The new cancellation endpoint that accepts reason and refund option
  const vendorBookingCancellationMutation = useVendorBookingCancellation({
    onSuccess: (data) => {
      // If cancellation triggers a refund or repayment, show full success dialog
      setCancellationSuccessData(data?.data ?? data);
      setCancellationSuccessOpen(true);
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/bookings/getByAuth"],
      });
      setCancelBookingId(null);
      setCancellationReason("");
      setProcessRefund(true);
    },
    onError: (err: any) => {
      toast({
        title: "Cancellation Failed",
        description:
          err?.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
      setCancelBookingId(null);
    },
  });

  const createVendorBookingPaymentMutation = useCreateVendorBookingPayment();
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [processRefund, setProcessRefund] = useState<boolean>(true);
  const [showPriceDialog, setShowPriceDialog] = useState<boolean>(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<
    any | null
  >(null);
  const [rescheduleOpen, setRescheduleOpen] = useState<boolean>(false);
  const [selectedBookingForReschedule, setSelectedBookingForReschedule] =
    useState<any | null>(null);
  const [rescheduleSuccessOpen, setRescheduleSuccessOpen] = useState(false);
  const [rescheduleSuccessData, setRescheduleSuccessData] = useState<
    any | null
  >(null);
  const [cancellationSuccessOpen, setCancellationSuccessOpen] = useState(false);
  const [cancellationSuccessData, setCancellationSuccessData] = useState<
    any | null
  >(null);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(
    null
  );

  const bookings = data?.data || [];
  const pagination = data?.pagination;

  const handleCancelClick = (booking: any) => {
    setCancelBookingId(
      Number(
        booking?.Vendor_Booking_id ?? booking?.vendor_booking_id ?? booking?._id
      )
    );
    setSelectedBookingForCancel(booking);
  };

  const handleConfirmCancel = () => {
    if (cancelBookingId || selectedBookingForCancel) {
      // prefer the new cancellation API which supports reasons and refund flags
      vendorBookingCancellationMutation.mutate({
        vendor_booking_id:
          cancelBookingId ||
          Number(
            selectedBookingForCancel?.Vendor_Booking_id ||
              selectedBookingForCancel?.vendor_booking_id ||
              selectedBookingForCancel?._id
          ),
        cancellation_reason: cancellationReason,
        process_refund: processRefund,
      });
      // fallback for any other cleanup is handled in mutation `onSuccess` / `onError`
    }
  };

  const formatMoney = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return "-";
    const v = Number(value);
    if (isNaN(v)) return "-";
    // If value looks like cents (greater than 1000), convert else assume already dollars
    // const amount = v > 1000 ? v / 100 : v;
    return `$${v.toFixed(2)}`;
  };

  const getCancellationRefundEstimate = (booking: any) => {
    if (!booking) return null;
    // If booking already contains refund amount field use it
    const refundAmt =
      booking?.refund_amount ??
      booking?.refund_amount_cents ??
      booking?.refund?.amount ??
      null;
    if (refundAmt !== null && refundAmt !== undefined)
      return formatMoney(refundAmt);

    // Look for cancellation fee / policy on booking
    const original =
      booking?.amount ??
      booking?.vendor_price ??
      booking?.vendor_amount ??
      booking?.transaction_amount ??
      null;
    const cancellationFee =
      booking?.cancellation_fee ??
      booking?.cancellation_charges_fee ??
      booking?.cancellation_charges ??
      null;
    const cancellationPercent =
      booking?.cancellation_charges_percentage ??
      booking?.cancellation_charges ??
      null;

    let originalNum = Number(original);
    if (isNaN(originalNum)) return "-";

    let fee = null;
    if (typeof cancellationFee === "number") fee = Number(cancellationFee);
    else if (
      typeof cancellationPercent === "number" &&
      !isNaN(cancellationPercent)
    )
      fee = Math.round((originalNum * cancellationPercent) / 100);

    if (fee !== null) {
      const refund = originalNum - Number(fee);
      return formatMoney(refund);
    }

    // No detailed info—assume full refund or unknown
    return "Unknown";
  };

  const getCancellationBreakdown = (booking: any) => {
    if (!booking) return { original: null, fee: null, refund: null };
    const original =
      booking?.amount ??
      booking?.vendor_price ??
      booking?.vendor_amount ??
      booking?.transaction_amount ??
      null;
    let originalNum: number | null = Number(original);
    if (isNaN(originalNum)) originalNum = null;

    let fee = null;
    const cancellationFee =
      booking?.cancellation_fee ??
      booking?.cancellation_charges_fee ??
      booking?.cancellation_charges ??
      null;
    const cancellationPercent =
      booking?.cancellation_charges_percentage ??
      booking?.cancellation_charges ??
      null;
    if (typeof cancellationFee === "number") fee = Number(cancellationFee);
    else if (
      typeof cancellationPercent === "number" &&
      !isNaN(cancellationPercent) &&
      originalNum !== null
    )
      fee = Math.round((originalNum * cancellationPercent) / 100);

    const refund =
      originalNum != null && fee != null ? originalNum - fee : null;
    return { original: originalNum, fee, refund } as {
      original: number | null;
      fee: number | null;
      refund: number | null;
    };
  };

  const handleOpenPaymentForBooking = (booking: any) => {
    // Make sure there is a vendor id present on the booking; otherwise we cannot
    // create a payment for it. The backend sometimes requires vendor_id in the
    // booking or may infer it from the authenticated vendor; defensively check
    // multiple possible fields for vendor id.
    const vendorId =
      booking?.vendor_id ??
      booking?.Vendor_id ??
      booking?.vendorId ??
      booking?.vendorId;
    if (!vendorId) {
      toast({
        title: "Missing Vendor ID",
        description: "Vendor ID is missing from booking",
        variant: "destructive",
      });
      return;
    }

    setSelectedBookingForPayment(booking);
    setShowPriceDialog(true);
  };

  const handleMethodSelectForBooking = async (method: number) => {
    try {
      const created =
        selectedBookingForPayment?.bookingResponse ?? selectedBookingForPayment;
      const vendorBookingId =
        created?.Vendor_Booking_id ??
        created?.vendor_booking_id ??
        created?._id;
      if (!vendorBookingId) throw new Error("Missing vendor booking id");

      const vendorId =
        created?.vendor_id ?? created?.Vendor_id ?? created?.vendorId ?? null;
      if (!vendorId) {
        toast({
          title: "Missing Vendor ID",
          description: "Vendor ID is missing from booking",
          variant: "destructive",
        });
        throw new Error("Missing vendor id on booking");
      }

      const res = await createVendorBookingPaymentMutation.mutateAsync({
        vendor_booking_id: Number(vendorBookingId),
        vendor_id: Number(vendorId),
        payment_method_id: method,
        billingDetails: "VendorBooking",
      });
      return res.data.data.paymentIntent;
    } catch (err: any) {
      console.error("Failed to create vendor booking payment intent:", err);
      throw err;
    }
  };

  const handlePaymentConfirmed = (payment: any) => {
    // Use success dialog to present payment receipt details
    const payload = payment?.data ?? payment;
    const transaction =
      payload?.reschedule_transaction ??
      payload?.transaction ??
      payload?.data?.transaction ??
      payload?.paymentIntent ??
      payload?.payment_intent ??
      payload;

    setPaymentSuccessData({
      booking: selectedBookingForPayment ?? null,
      transaction,
    });
    setPaymentSuccessOpen(true);
    setShowPriceDialog(false);
    setSelectedBookingForPayment(null);
    queryClient.invalidateQueries({
      queryKey: ["/api/vendor/bookings/getByAuth"],
    });
  };

  const handleRescheduleClick = (booking: any) => {
    setSelectedBookingForReschedule(booking);
    setRescheduleOpen(true);
  };

  const handleRescheduleSuccess = (data?: any) => {
    // When the reschedule API returns, show a success dialog instead of a toast
    setRescheduleSuccessData(data ?? null);
    setRescheduleSuccessOpen(true);
    setRescheduleOpen(false);
    setSelectedBookingForReschedule(null);
    queryClient.invalidateQueries({
      queryKey: ["/api/vendor/bookings/getByAuth"],
    });
  };

  const isBookingCompleted = (booking: any) =>
    !!booking?.transaction_status &&
    ["completed", "confirmed", "paid"].includes(
      booking.transaction_status.toString().toLowerCase()
    );

  const RESCHEDULE_FEE_CENTS = 500;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Vendor Bookings</CardTitle>
          {pagination && pagination.totalItems > 0 && (
            <div className="text-sm text-muted-foreground">
              Total: {pagination.totalItems}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading bookings...
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">
              Failed to load bookings
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No vendor bookings found.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left side - booking info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold">
                              {booking.event_details?.name_title || "Booking"}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {booking.vendor_category_details.map((cat) => (
                                <Badge
                                  key={cat._id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {cat.emozi} {cat.category_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(
                              booking.vender_booking_status
                            )}
                          >
                            {booking.vender_booking_status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(booking.Date_start)}
                              {booking.Date_start !== booking.End_date && (
                                <> - {formatDate(booking.End_date)}</>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.Start_time} - {booking.End_time}
                            </span>
                          </div>
                          {booking.event_details?.venue_name && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">
                                {booking.event_details.venue_name}
                              </span>
                            </div>
                          )}
                          {booking.event_details?.max_capacity && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {booking.event_details.max_capacity} capacity
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>
                            <strong>Booked by:</strong>{" "}
                            {booking.created_by_details.name} (
                            {booking.created_by_details.email})
                          </div>
                          <div>
                            <strong>Created:</strong>{" "}
                            {formatDate(booking.CreateAt)}
                          </div>
                        </div>
                      </div>

                      {/* Right side - actions */}
                      <div className="flex flex-row md:flex-col gap-2">
                        {booking.vender_booking_status.toLowerCase() ===
                        "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleOpenPaymentForBooking(booking)}
                          >
                            Pay
                          </Button>
                        ) : booking.vender_booking_status.toLowerCase() ===
                          "confirmed" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => handleRescheduleClick(booking)}
                            >
                              <CalendarDays className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleCancelClick(booking)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrevPage || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNextPage || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CancelConfirmationDialog
        open={cancelBookingId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCancelBookingId(null);
            setCancellationReason("");
            setProcessRefund(true);
            setSelectedBookingForCancel(null);
          }
        }}
        isPending={vendorBookingCancellationMutation.isPending}
        cancellationReason={cancellationReason}
        setCancellationReason={setCancellationReason}
        processRefund={processRefund}
        setProcessRefund={setProcessRefund}
        selectedBookingForCancel={selectedBookingForCancel}
        onConfirm={handleConfirmCancel}
        formatMoney={formatMoney}
        getCancellationBreakdown={getCancellationBreakdown}
        getCancellationRefundEstimate={getCancellationRefundEstimate}
      />

      {/* Payment Price Confirmation (for pending bookings) */}
      <PriceConfirmationDialog
        open={showPriceDialog}
        onOpenChange={(open) => {
          setShowPriceDialog(open);
          if (!open) {
            setSelectedBookingForPayment(null);
          }
        }}
        priceEstimate={Number(selectedBookingForPayment?.amount)}
        onPrevious={() => setShowPriceDialog(false)}
        onConfirm={handlePaymentConfirmed}
        onMethodSelect={handleMethodSelectForBooking}
      />

      {/* Reschedule Booking Dialog */}
      <RescheduleBookingDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        booking={selectedBookingForReschedule}
        feeCents={RESCHEDULE_FEE_CENTS}
        onSuccess={handleRescheduleSuccess}
      />

      {/* Success dialog shown after reschedule */}
      <SuccessDialog
        open={rescheduleSuccessOpen}
        onOpenChange={(open) => {
          setRescheduleSuccessOpen(open);
          if (!open) setRescheduleSuccessData(null);
        }}
        title={
          rescheduleSuccessData?.booking ? "Booking Rescheduled" : "Success"
        }
        description={"The booking has been rescheduled successfully."}
        details={
          rescheduleSuccessData
            ? [
                {
                  label: "Amount",
                  value: rescheduleSuccessData.reschedule_transaction?.amount
                    ? `$${(
                        rescheduleSuccessData.reschedule_transaction.amount /
                        100
                      ).toFixed(2)}`
                    : "-",
                },
                {
                  label: "Reference",
                  value:
                    rescheduleSuccessData.reschedule_transaction
                      ?.reference_number ||
                    rescheduleSuccessData.reschedule_transaction
                      ?.transaction_id ||
                    "-",
                },
                {
                  label: "Booking Date",
                  value: rescheduleSuccessData.booking?.Date_start
                    ? format(
                        parseISO(rescheduleSuccessData.booking?.Date_start),
                        "PPP"
                      )
                    : "-",
                },
              ]
            : null
        }
        onDone={() => setRescheduleSuccessOpen(false)}
      />
      {/* Success dialog shown after cancellation/refund */}
      <SuccessDialog
        open={cancellationSuccessOpen}
        onOpenChange={(open) => {
          setCancellationSuccessOpen(open);
          if (!open) setCancellationSuccessData(null);
        }}
        title={
          cancellationSuccessData?.booking ? "Booking Cancelled" : "Success"
        }
        description={"The booking has been cancelled successfully."}
        details={
          cancellationSuccessData
            ? [
                {
                  label: "Refund Amount",
                  value: cancellationSuccessData.refund_amount
                    ? `$${(cancellationSuccessData.refund_amount / 100).toFixed(
                        2
                      )}`
                    : cancellationSuccessData.data?.refund_amount
                    ? `$${(
                        cancellationSuccessData.data.refund_amount / 100
                      ).toFixed(2)}`
                    : "-",
                },
                {
                  label: "Refund Status",
                  value:
                    cancellationSuccessData.refund_status ||
                    cancellationSuccessData.data?.refund_status ||
                    "-",
                },
                {
                  label: "Reference",
                  value:
                    cancellationSuccessData.refund_transaction_id ||
                    cancellationSuccessData.data?.refund_transaction_id ||
                    cancellationSuccessData.refund_transaction
                      ?.reference_number ||
                    cancellationSuccessData.data?.refund_transaction
                      ?.reference_number ||
                    "-",
                },
              ]
            : null
        }
        onDone={() => setCancellationSuccessOpen(false)}
      />

      {/* Success dialog shown after booking payment */}
      <SuccessDialog
        open={paymentSuccessOpen}
        onOpenChange={(open) => {
          setPaymentSuccessOpen(open);
          if (!open) setPaymentSuccessData(null);
        }}
        title={paymentSuccessData?.booking ? "Payment Received" : "Success"}
        description={"Your payment was received. The booking is now confirmed."}
        details={
          paymentSuccessData
            ? [
                {
                  label: "Amount",
                  value:
                    paymentSuccessData.transaction?.amount ||
                    paymentSuccessData.transaction?.value ||
                    paymentSuccessData.transaction?.payment_amount
                      ? `$${(
                          (paymentSuccessData.transaction?.amount ||
                            paymentSuccessData.transaction?.value ||
                            paymentSuccessData.transaction?.payment_amount) /
                          100
                        ).toFixed(2)}`
                      : "-",
                },
                {
                  label: "Reference",
                  value:
                    paymentSuccessData.transaction?.reference_number ||
                    paymentSuccessData.transaction?.id ||
                    paymentSuccessData.transaction?.payment_intent_id ||
                    paymentSuccessData.transaction?.paymentIntent?.id ||
                    paymentSuccessData.transaction?.paymentIntent
                      ?.client_secret ||
                    "-",
                },
                {
                  label: "Booking Date",
                  value: paymentSuccessData.booking?.Date_start
                    ? format(
                        parseISO(paymentSuccessData.booking.Date_start),
                        "PPP"
                      )
                    : paymentSuccessData.booking?.Date
                    ? format(parseISO(paymentSuccessData.booking.Date), "PPP")
                    : "-",
                },
              ]
            : null
        }
        onDone={() => setPaymentSuccessOpen(false)}
      />
    </>
  );
}

export default VendorBookings;
