import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRescheduleVendorBooking } from "@/queries/vendorBookings";
import { useCreateVendorBookingPayment } from "@/mutations/useCreateVendorBookingPayment";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvailabilityTimeSlotSelector } from "@/components/AvailabilityTimeSlotSelector";
import {
  useStaffAvailability,
  isDateBooked,
  isDateRangeBooked,
} from "@/hooks/useStaffAvailability";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";

export default function RescheduleBookingDialog({
  open,
  onOpenChange,
  booking,
  feeCents = 500,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: any | null;
  feeCents?: number;
  onSuccess?: (data?: any) => void;
}) {
  const [timingMode, setTimingMode] = useState<
    "hourly" | "fullday" | "multiday"
  >("hourly");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startTimeSlot, setStartTimeSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (booking) {
      try {
        // Try to parse existing booking dates
        const existingDate = booking.dateFrom || booking.Date_start;
        if (existingDate) {
          setStartDate(new Date(existingDate));
        }
        const existingEndDate = booking.dateTo || booking.End_date;
        if (existingEndDate && existingEndDate !== existingDate) {
          setEndDate(new Date(existingEndDate));
          setTimingMode("multiday");
        }

        // Parse time slot
        const existingStartTime = booking.timeFrom || booking.Start_time;
        const existingEndTime = booking.timeTo || booking.End_time;

        if (existingStartTime === "00:00" && existingEndTime === "23:59") {
          setTimingMode(
            existingEndDate && existingEndDate !== existingDate
              ? "multiday"
              : "fullday"
          );
          setStartTimeSlot("");
        } else if (existingStartTime && existingEndTime) {
          setTimingMode("hourly");
          setStartTimeSlot(`${existingStartTime}-${existingEndTime}`);
        }

        setReason("");
      } catch (e) {
        console.error("Error parsing booking dates:", e);
        setStartDate(undefined);
        setEndDate(undefined);
        setStartTimeSlot("");
        setTimingMode("hourly");
        setReason("");
      }
    }
  }, [open, booking]);

  const mutation = useRescheduleVendorBooking({
    onSuccess: (data) => {
      setLoading(false);
      onOpenChange(false);
      onSuccess?.(data?.data ?? data);
    },
    onError: () => setLoading(false),
  });

  // Payment hooks and state
  const createVendorBookingPaymentMutation = useCreateVendorBookingPayment();
  const [showPriceDialog, setShowPriceDialog] = useState<boolean>(false);
  const [pendingReschedulePayload, setPendingReschedulePayload] = useState<
    any | null
  >(null);

  // Extract vendor ID (must be called before any conditional returns)
  const getVendorId = () =>
    Number(booking?.vendor_id ?? booking?.Vendor_id ?? booking?.vendorId);

  const vendorId = booking ? getVendorId() : null;

  // Always call hooks - control with enabled flag
  const { data: availabilityBookings = [], isLoading: loadingAvailability } =
    useStaffAvailability(vendorId, open && !!vendorId);

  // Check if selected dates have conflicts
  const hasDateConflict =
    startDate &&
    isDateBooked(availabilityBookings, format(startDate, "yyyy-MM-dd"));
  const hasRangeConflict =
    timingMode === "multiday" &&
    startDate &&
    endDate &&
    isDateRangeBooked(
      availabilityBookings,
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd")
    );

  // Conditional return after all hooks
  if (!booking) return null;

  const getBookingId = () =>
    Number(
      booking?.Vendor_Booking_id ??
        booking?.vendor_event_book_id ??
        booking?.vendor_booking_id ??
        booking?._id
    );

  const handleReschedule = async () => {
    // Validation
    if (!startDate) {
      return alert("Please select a start date");
    }

    if (timingMode === "multiday" && !endDate) {
      return alert("Please select an end date for multi-day booking");
    }

    if (timingMode === "hourly" && !startTimeSlot) {
      return alert("Please select a time slot for hourly booking");
    }

    const vendor_booking_id = getBookingId();

    // Set times based on timing mode
    let startTime: string;
    let endTime: string;
    let finalEndDate: Date;

    if (timingMode === "hourly") {
      const [slotStart, slotEnd] = startTimeSlot.split("-");
      startTime = slotStart || "00:00";
      endTime = slotEnd || "23:59";
      finalEndDate = startDate;
    } else if (timingMode === "fullday") {
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = startDate;
    } else {
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = endDate || startDate;
    }

    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;

    const payload: any = {
      vendor_booking_id,
      Date_start: startDate.toISOString(),
      End_date: finalEndDate.toISOString(),
      Start_time: startTime,
      End_time: endTime,
      Year: year,
      Month: month,
      reschedule_reason: reason,
    };

    // If there's a fee, trigger the payment flow instead of calling reschedule
    if (feeCents && feeCents > 0) {
      setPendingReschedulePayload(payload);
      // Open the payment dialog and defer rescheduling until payment confirmed
      setShowPriceDialog(true);
      return;
    }

    setLoading(true);
    try {
      await mutation.mutateAsync(payload as any);
    } catch (err) {
      setLoading(false);
      console.error("Reschedule failed", err);
      alert("Rescheduling failed, please try again");
    }
  };

  const handleMethodSelectForReschedule = async (method: number) => {
    try {
      const vendorBookingId = getBookingId();
      if (!vendorBookingId) throw new Error("Missing vendor booking id");

      const vendorId = getVendorId();
      if (!vendorId) {
        throw new Error("Missing vendor id on booking");
      }

      const res = await createVendorBookingPaymentMutation.mutateAsync({
        vendor_booking_id: Number(vendorBookingId),
        vendor_id: Number(vendorId),
        payment_method_id: method,
        billingDetails: "RescheduleBooking",
      });
      return res.data.data.paymentIntent;
    } catch (err: any) {
      console.error("Failed to create vendor booking payment intent:", err);
      throw err;
    }
  };

  const handleReschedulePaymentConfirmed = async (payment: any) => {
    // After confirmed payment, finalize the reschedule using pending payload
    if (!pendingReschedulePayload) {
      setShowPriceDialog(false);
      setPendingReschedulePayload(null);
      setLoading(false);
      return;
    }

    // Optionally attach payment details (if available) to the reschedule payload
    if (payment?.paymentIntent?.id) {
      pendingReschedulePayload.payment_intent_id = payment.paymentIntent.id;
    } else if (payment?.id) {
      pendingReschedulePayload.payment_intent_id = payment.id;
    }

    try {
      setLoading(true);
      await mutation.mutateAsync(pendingReschedulePayload as any);
      // The mutation onSuccess will close the dialog and reset state
      setShowPriceDialog(false);
      setPendingReschedulePayload(null);
    } catch (err) {
      console.error("Reschedule failed after payment", err);
      alert("Rescheduling failed, please contact support");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Timing Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">Booking Schedule Type</h3>
              </div>
              <div className="space-y-2">
                <Label>Select how you want to reschedule this booking *</Label>
                <div className="inline-flex rounded-md shadow-sm bg-transparent border divide-x w-full">
                  <button
                    type="button"
                    onClick={() => setTimingMode("hourly")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      timingMode === "hourly"
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                    } rounded-l-md`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Hourly</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingMode("fullday")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      timingMode === "fullday"
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Full Day</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimingMode("multiday")}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      timingMode === "multiday"
                        ? "bg-primary text-primary-foreground"
                        : "bg-transparent text-muted-foreground hover:bg-muted"
                    } rounded-r-md`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Multiple Days</span>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {timingMode === "hourly" &&
                    "Reschedule for a specific time slot"}
                  {timingMode === "fullday" &&
                    "Reschedule for a full day (00:00 - 23:59)"}
                  {timingMode === "multiday" &&
                    "Reschedule for multiple consecutive days"}
                </p>
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">
                  {timingMode === "multiday"
                    ? "Select Date Range"
                    : "Select Date"}
                </h3>
              </div>
              {loadingAvailability && (
                <p className="text-xs text-muted-foreground">
                  Checking vendor availability...
                </p>
              )}
              <div
                className={cn(
                  "grid gap-4",
                  timingMode === "multiday"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                )}
              >
                <div className="space-y-2">
                  <Label>
                    {timingMode === "multiday" ? "Start Date *" : "Date *"}
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {timingMode === "multiday" && (
                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) => date < (startDate || new Date())}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Show availability warning for full day and multiday modes */}
              {timingMode === "fullday" && hasDateConflict && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This date has existing bookings. Please choose another date
                    or select hourly mode for available time slots.
                  </AlertDescription>
                </Alert>
              )}
              {timingMode === "multiday" && hasRangeConflict && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This date range has existing bookings. Please choose
                    different dates.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Time Slot Selection (Only for Hourly) */}
            {timingMode === "hourly" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">Choose Time Slot</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Already booked slots will be disabled
                </p>
                <div className="space-y-2">
                  <Label>
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Slot *
                  </Label>
                  <AvailabilityTimeSlotSelector
                    userId={getVendorId()}
                    selectedDate={
                      startDate ? format(startDate, "yyyy-MM-dd") : ""
                    }
                    value={startTimeSlot}
                    onChange={setStartTimeSlot}
                    placeholder="Select time slot"
                    enabled={!!startDate}
                  />
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 rounded border bg-background min-h-[80px]"
                placeholder="Why are you rescheduling this booking?"
              />
            </div>

            {/* Summary */}
            {startDate && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  📋 Reschedule Summary
                </h4>
                <div className="text-xs space-y-1">
                  <div>
                    <span className="font-medium">Booking Type:</span>{" "}
                    <span className="capitalize">
                      {timingMode === "hourly"
                        ? "Hourly"
                        : timingMode === "fullday"
                        ? "Full Day"
                        : "Multiple Days"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">
                      {timingMode === "multiday" ? "Start Date:" : "Date:"}
                    </span>{" "}
                    {format(startDate, "PPP")}
                    {timingMode === "hourly" &&
                      startTimeSlot &&
                      ` (${startTimeSlot})`}
                    {(timingMode === "fullday" || timingMode === "multiday") &&
                      " (Full Day)"}
                  </div>
                  {timingMode === "multiday" && endDate && (
                    <div>
                      <span className="font-medium">End Date:</span>{" "}
                      {format(endDate, "PPP")} (Full Day)
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Reschedule Fee:</span> $
                    {(feeCents / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={
                  loading ||
                  (timingMode === "fullday" && hasDateConflict) ||
                  (timingMode === "multiday" && hasRangeConflict)
                }
              >
                {loading ? "Processing..." : "Pay & Reschedule"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Payment Price Confirmation (for reschedule fees) */}
      <PriceConfirmationDialog
        open={showPriceDialog}
        onOpenChange={(open) => {
          setShowPriceDialog(open);
          if (!open) {
            setPendingReschedulePayload(null);
            // ensure reset of selected payment UI state
          }
        }}
        priceEstimate={Number((feeCents || 0) / 100)}
        onPrevious={() => setShowPriceDialog(false)}
        onConfirm={handleReschedulePaymentConfirmed}
        onMethodSelect={handleMethodSelectForReschedule}
      />
    </>
  );
}
