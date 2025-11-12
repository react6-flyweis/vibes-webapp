import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateVendorBooking } from "@/queries/vendorBookings";
import { useVendorServiceTypes } from "@/queries/vendorServiceTypes";
import { useCreateVendorBookingPayment } from "@/mutations/useCreateVendorBookingPayment";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AvailabilityTimeSlotSelector,
  TIME_SLOTS,
} from "@/components/AvailabilityTimeSlotSelector";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { LoadingButton } from "./ui/loading-button";
import { useAuthStore } from "@/store/auth-store";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";

interface BookVendorDialogProps {
  vendorId: number;
  userId: number;
  eventId?: number;
  trigger?: React.ReactNode;
  onBooked?: (info: {
    vendorName?: string | null;
    menuName?: string | null;
    guestCount?: number | string | null;
    pricePerPerson?: number | null;
    totalAmount?: number | null;
    date?: string | null;
    time?: string | null;
  }) => void;
  vendorName?: string;
}

export default function BookVendorDialog({
  vendorId,
  userId,
  eventId,
  trigger,
  onBooked,
  vendorName,
}: BookVendorDialogProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Payment dialog state
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [pendingBookingPayload, setPendingBookingPayload] = useState<any>(null);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [timingMode, setTimingMode] = useState<
    "hourly" | "fullday" | "multiday"
  >("hourly");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTimeSlot, setStartTimeSlot] = useState<string>("");
  const [endTimeSlot, setEndTimeSlot] = useState<string>("");
  const { toast } = useToast();

  const { data: serviceTypes = [] } = useVendorServiceTypes();
  const createBooking = useCreateVendorBooking();
  const createVendorBookingPaymentMutation = useCreateVendorBookingPayment();

  const handleReset = () => {
    form.reset();
    setTimingMode("hourly");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTimeSlot("");
    setEndTimeSlot("");
  };

  const handleTriggerClick = (e?: React.MouseEvent) => {
    // prevent default behavior from any wrapped element
    e?.preventDefault?.();
    if (isAuthenticated()) {
      setOpen(true);
    } else {
      navigate("/login?redirect=/vendor-marketplace/");
    }
  };

  // Zod schema for booking form
  const bookingSchema = z
    .object({
      timingMode: z.enum(["hourly", "fullday", "multiday"]).default("hourly"),
      startDate: z.string().optional().nullable(),
      endDate: z.string().optional().nullable(),
      startTimeSlot: z.string().optional().nullable(),
      selectedCategories: z.array(z.number()).optional(),
    })
    .superRefine((val, ctx) => {
      if (!val.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a start date",
          path: ["startDate"],
        });
      }
      if (val.timingMode === "multiday" && !val.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select an end date for multi-day booking",
          path: ["endDate"],
        });
      }
      if (val.timingMode === "hourly" && !val.startTimeSlot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a time slot for hourly booking",
          path: ["startTimeSlot"],
        });
      }
      if (!val.selectedCategories || val.selectedCategories.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one service category",
          path: ["selectedCategories"],
        });
      }
    });

  type BookingForm = z.infer<typeof bookingSchema>;

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      timingMode: "hourly",
      startDate: undefined,
      endDate: undefined,
      startTimeSlot: undefined,
      selectedCategories: [],
    },
  });

  // Use watch to get live selected categories from the form (keep UI in sync)
  const watchedSelectedCategories = form.watch("selectedCategories") || [];

  // Keep local UI state in sync with react-hook-form values so validation sees them
  useEffect(() => {
    form.setValue("timingMode", timingMode, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timingMode]);

  useEffect(() => {
    if (startDate) {
      form.setValue("startDate", startDate.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      form.setValue("startDate", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      form.setValue("endDate", endDate.toISOString(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      form.setValue("endDate", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);

  useEffect(() => {
    form.setValue("startTimeSlot", startTimeSlot || undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTimeSlot]);

  // NOTE: Removed debug logging helper to avoid emitting console logs in production.

  const onSubmit = async (data: BookingForm) => {
    // parse dates
    const sDate = data.startDate ? new Date(data.startDate) : undefined;
    const eDate = data.endDate ? new Date(data.endDate) : undefined;

    if (!sDate) {
      toast({
        title: "Missing Start Date",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    // set times based on timing mode
    let startTime: string;
    let endTime: string;
    let finalEndDate: Date;

    if (data.timingMode === "hourly") {
      const [slotStart, slotEnd] = (data.startTimeSlot || "").split("-");
      startTime = slotStart || "00:00";
      endTime = slotEnd || "23:59";
      finalEndDate = sDate;
    } else if (data.timingMode === "fullday") {
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = sDate;
    } else {
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = eDate || sDate;
    }

    const payload = {
      vendor_id: vendorId,
      Year: sDate.getFullYear(),
      Month: sDate.getMonth() + 1,
      Date_start: sDate.toISOString(),
      End_date: finalEndDate.toISOString(),
      Start_time: startTime,
      End_time: endTime,
      User_availabil: "Book",
      user_id: userId,
      Vendor_Category_id: data.selectedCategories || [],
      Event_id: eventId,
      Status: true,
    };

    try {
      // Create booking first
      const res = await createBooking.mutateAsync(payload);

      // Store booking response for payment flow
      const bookingResponse = res?.data;
      setPendingPayment({ bookingResponse });
      setPendingBookingPayload(payload);

      // Calculate price estimate from booking response
      const estimate =
        bookingResponse?.vendor_price || bookingResponse?.price || 0;
      setPriceEstimate(estimate);

      // Close booking dialog and show payment dialog
      setOpen(false);
      setShowPriceDialog(true);

      toast({
        title: "Booking Created — Complete Payment to Confirm",
        description: "Please complete payment to confirm the booking.",
      });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      form.setError("root", {
        type: "server",
        message: errorMessage || "Failed to create booking",
      });
    }
  };

  const toggleCategory = (categoryId: number) => {
    const current = form.getValues("selectedCategories") || [];
    const next = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    form.setValue("selectedCategories", next, { shouldValidate: true });
  };

  const removeCategory = (categoryId: number) => {
    const current = form.getValues("selectedCategories") || [];
    const next = current.filter((id) => id !== categoryId);
    form.setValue("selectedCategories", next, { shouldValidate: true });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        // if trying to open while unauthenticated redirect instead
        if (val && !isAuthenticated) {
          navigate("/login");
          return;
        }
        setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        {React.isValidElement(trigger) ? (
          React.cloneElement(trigger as React.ReactElement, {
            onClick: handleTriggerClick,
          })
        ) : (
          <Button onClick={handleTriggerClick}>
            {typeof trigger === "string" ? trigger : "Book Vendor"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Vendor</DialogTitle>
          <DialogDescription>
            Fill in the details to book this vendor for your event. Available
            time slots are shown based on vendor availability.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Timing Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">Booking Schedule Type</h3>
              </div>
              <div className="space-y-2">
                <Label>Select how you want to book this vendor *</Label>
                <div className="inline-flex rounded-md shadow-sm bg-transparent border divide-x w-full">
                  <button
                    type="button"
                    onClick={() => setTimingMode("hourly")}
                    aria-pressed={timingMode === "hourly"}
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
                    aria-pressed={timingMode === "fullday"}
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
                    aria-pressed={timingMode === "multiday"}
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
                    "Book the vendor for a specific time slot"}
                  {timingMode === "fullday" &&
                    "Book the vendor for a full day (00:00 - 23:59)"}
                  {timingMode === "multiday" &&
                    "Book the vendor for multiple consecutive days"}
                </p>
              </div>
            </div>

            {/* Section 1: Date Range Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">
                  {timingMode === "multiday"
                    ? "1. Select Date Range"
                    : "1. Select Event Date"}
                </h3>
              </div>
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
            </div>

            {/* Section 2: Time Slot Selection (Only for Hourly) */}
            {timingMode === "hourly" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-sm">2. Choose Time Slot</h3>
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
                    userId={vendorId}
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

            {/* Time Display for Full Day and Multi-Day */}
            {/* {(timingMode === "fullday" || timingMode === "multiday") && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
                <span className="text-muted-foreground">
                  Full day (00:00 - 23:59)
                </span>
              </div>
            </div>
          )} */}

            {/* Section 3: Service Categories Multi-Select */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Badge className="w-5 h-5 p-0 flex items-center justify-center bg-primary">
                  {timingMode === "hourly" ? "3" : "2"}
                </Badge>
                <h3 className="font-semibold text-sm">
                  {timingMode === "hourly" ? "3" : "2"}. Select Service
                  Categories
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Choose one or more service categories you need
              </p>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="selectedCategories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Categories *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            toggleCategory(Number(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select service categories..." />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTypes.map((serviceType) => (
                              <SelectItem
                                key={serviceType.vendor_service_type_id}
                                value={String(
                                  serviceType.vendor_service_type_id
                                )}
                              >
                                {serviceType.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />

                      {/* Selected Categories Display */}
                      {(form.getValues("selectedCategories") || []).length >
                        0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(form.getValues("selectedCategories") || []).map(
                            (categoryId) => {
                              const category = serviceTypes.find(
                                (st) => st.vendor_service_type_id === categoryId
                              );
                              return (
                                <Badge
                                  key={categoryId}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {category?.name}
                                  <button
                                    type="button"
                                    onClick={() => removeCategory(categoryId)}
                                    className="ml-1 hover:bg-gray-300 rounded-full"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            }
                          )}
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Summary */}
            {(startDate || watchedSelectedCategories.length > 0) && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  📋 Booking Summary
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
                  {startDate && (
                    <div>
                      <span className="font-medium">
                        {timingMode === "multiday" ? "Start Date:" : "Date:"}
                      </span>{" "}
                      {format(startDate, "PPP")}
                      {timingMode === "hourly" &&
                        startTimeSlot &&
                        ` (${startTimeSlot})`}
                      {(timingMode === "fullday" ||
                        timingMode === "multiday") &&
                        " (Full Day)"}
                    </div>
                  )}
                  {timingMode === "multiday" && endDate && (
                    <div>
                      <span className="font-medium">End Date:</span>{" "}
                      {format(endDate, "PPP")} (Full Day)
                    </div>
                  )}
                  {watchedSelectedCategories.length > 0 && (
                    <div>
                      <span className="font-medium">Services:</span>{" "}
                      {watchedSelectedCategories
                        .map((id: number) => {
                          const cat = serviceTypes.find(
                            (st) => st.vendor_service_type_id === id
                          );
                          return cat?.name;
                        })
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  handleReset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                {createBooking.isPending ? "Booking..." : "Create Booking"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {/* Payment Confirmation Dialog */}
      <PriceConfirmationDialog
        open={showPriceDialog}
        onOpenChange={(open) => {
          setShowPriceDialog(open);
          if (!open) {
            // Reset on close
            setPendingBookingPayload(null);
            setPendingPayment(null);
          }
        }}
        priceEstimate={priceEstimate}
        onPrevious={() => {
          // Go back to booking dialog
          setShowPriceDialog(false);
          setOpen(true);
        }}
        onConfirm={async (payment) => {
          const created = pendingPayment?.bookingResponse;
          if (!created) {
            toast({
              title: "Missing booking",
              description: "Cannot finalize payment: booking missing.",
              variant: "destructive",
            });
            return;
          }

          // Successful payment - show booked dialog with details
          const serviceName = pendingBookingPayload?.Vendor_Category_id?.map(
            (id: number) => {
              const cat = serviceTypes.find(
                (st) => st.vendor_service_type_id === id
              );
              return cat?.name;
            }
          )
            .filter(Boolean)
            .join(", ");

          const info = {
            vendorName: vendorName || undefined,
            menuName: serviceName || "Vendor Services",
            guestCount: undefined,
            pricePerPerson: priceEstimate,
            totalAmount: priceEstimate,
            date: startDate ? format(startDate, "PPP") : undefined,
            time:
              timingMode === "hourly"
                ? startTimeSlot
                : timingMode === "fullday"
                ? "Full day (00:00 - 23:59)"
                : startDate && endDate
                ? `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
                : undefined,
          };

          // Notify parent to show success dialog
          if (typeof onBooked === "function") {
            onBooked(info);
          }

          // Reset state
          setShowPriceDialog(false);
          setPendingBookingPayload(null);
          setPendingPayment(null);
          handleReset();

          toast({
            title: "Payment Received",
            description:
              "Your payment was received. The booking is now confirmed.",
          });
        }}
        onMethodSelect={async (method: number) => {
          try {
            const created = pendingPayment?.bookingResponse;
            const vendorBookingId =
              created?.Vendor_Booking_id ??
              created?.vendor_booking_id ??
              created?._id;

            if (!vendorBookingId) {
              throw new Error("Missing vendor booking id");
            }

            const res = await createVendorBookingPaymentMutation.mutateAsync({
              vendor_booking_id: Number(vendorBookingId),
              payment_method_id: method,
              billingDetails: "VendorBooking",
            });

            const paymentIntent = res.data.data.paymentIntent;
            return paymentIntent;
          } catch (err) {
            console.error(
              "Failed to create vendor booking payment intent:",
              err
            );
            throw err;
          }
        }}
      />
    </Dialog>
  );
}
