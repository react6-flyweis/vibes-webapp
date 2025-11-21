import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import EventTypeSelector from "@/components/event-type-select";
import EventSelector from "./event-select";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "./ui/loading-button";
import { ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { AvailabilityTimeSlotSelector } from "./AvailabilityTimeSlotSelector";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  useAvailability,
  isDateBooked,
  isDateRangeBooked,
} from "@/hooks/useAvailability";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: any | null;
  onSubmit: (data: FormValues) => Promise<void>;
};

const staffShiftSchema = z.object({
  timingMode: z.enum(["hourly", "fullday", "multiday"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timeSlot: z.string().optional(), // For hourly mode
  eventType: z.string().min(1, "Event type is required"),
  eventId: z.string().optional(), // Optional - not required for submission
  eventName: z.string().min(1, "Event name is required"),
  eventAddress: z.string().min(1, "Event address is required"),
  guestCount: z.preprocess((val) => {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") return undefined;
      const n = Number(trimmed);
      return Number.isNaN(n) ? val : n;
    }
    return val;
  }, z.number().int().nonnegative().optional()),
  specialRequests: z.string().optional(),
});
type FormValues = z.infer<typeof staffShiftSchema>;

export default function StaffShiftDialog({
  open,
  onOpenChange,
  staff,
  onSubmit,
}: Props) {
  const [timingMode, setTimingMode] = useState<
    "hourly" | "fullday" | "multiday"
  >("hourly");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTimeSlot, setStartTimeSlot] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(staffShiftSchema),
    defaultValues: {
      timingMode: "hourly",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      timeSlot: "",
      eventType: "",
      eventId: "",
      eventName: "",
      eventAddress: "",
      guestCount: undefined,
      specialRequests: "",
    },
  });

  const { handleSubmit, reset, control, setValue, watch } = form;

  // Fetch availability data
  const { data: availabilityBookings = [], isLoading: loadingAvailability } =
    useAvailability(staff?.id, { enabled: open });

  // Check if selected dates have conflicts
  const hasDateConflict =
    timingMode === "fullday" &&
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

  React.useEffect(() => {
    if (!open) {
      reset();
      setTimingMode("hourly");
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTimeSlot("");
    }
  }, [open, reset]);

  // Sync form values with local state
  useEffect(() => {
    setValue("timingMode", timingMode, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [timingMode, setValue]);

  useEffect(() => {
    if (startDate) {
      const dateStr = format(startDate, "yyyy-MM-dd");
      setValue("startDate", dateStr, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("startDate", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [startDate, setValue]);

  useEffect(() => {
    if (endDate) {
      const dateStr = format(endDate, "yyyy-MM-dd");
      setValue("endDate", dateStr, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setValue("endDate", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [endDate, setValue]);

  // Handle timing mode changes
  useEffect(() => {
    if (timingMode === "hourly") {
      // For hourly mode, set times from time slot
      if (startTimeSlot) {
        const [start, end] = startTimeSlot.split("-");
        setValue("startTime", start);
        setValue("endTime", end);
        setValue("timeSlot", startTimeSlot);
        if (startDate) {
          setValue("endDate", format(startDate, "yyyy-MM-dd"));
        }
      }
    } else if (timingMode === "fullday") {
      // For full day, set times to full day (00:00 - 23:59)
      setValue("startTime", "00:00");
      setValue("endTime", "23:59");
      if (startDate) {
        setValue("endDate", format(startDate, "yyyy-MM-dd"));
      }
    } else if (timingMode === "multiday") {
      // For multiday, set default times to full day (00:00 - 23:59)
      setValue("startTime", "00:00");
      setValue("endTime", "23:59");
    }
  }, [timingMode, startTimeSlot, startDate, setValue]);

  const submit = async (values: FormValues) => {
    try {
      // Remove timeSlot and timingMode before submitting to API
      const { timeSlot, timingMode, ...apiData } = values;
      await onSubmit(apiData as any);
    } catch (error) {
      const errorMessage = extractApiErrorMessage(error);
      form.setError("root", {
        type: "server",
        message: errorMessage || "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Staff Member</DialogTitle>
          <DialogDescription>
            Fill in the details to book {staff?.name || "this staff member"} for
            your event. Available time slots are shown based on staff
            availability.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(submit)} className="space-y-6">
            {/* Timing Mode Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">Booking Schedule Type</h3>
              </div>
              <div className="space-y-2">
                <Label>Select how you want to book this staff member *</Label>
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
                    "Book the staff member for a specific time slot"}
                  {timingMode === "fullday" &&
                    "Book the staff member for a full day (00:00 - 23:59)"}
                  {timingMode === "multiday" &&
                    "Book the staff member for multiple consecutive days"}
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
              {loadingAvailability && (
                <p className="text-xs text-muted-foreground">
                  Checking staff availability...
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
                        disabled={(date) => {
                          // Disable past dates
                          if (date < new Date()) return true;

                          // For full day mode, disable dates that are fully booked
                          if (timingMode === "fullday") {
                            return isDateBooked(
                              availabilityBookings,
                              format(date, "yyyy-MM-dd")
                            );
                          }

                          return false;
                        }}
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
                          disabled={(date) => {
                            // Disable dates before start date
                            if (date < (startDate || new Date())) return true;

                            // For multiday mode, disable dates that are booked
                            return isDateBooked(
                              availabilityBookings,
                              format(date, "yyyy-MM-dd")
                            );
                          }}
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
                    userId={staff?.id}
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

            {/* Section 3: Event Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">
                  {timingMode === "hourly" ? "3." : "2."} Event Details
                </h3>
              </div>

              <FormField
                control={control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event type *</FormLabel>
                    <FormControl>
                      <EventTypeSelector
                        value={field.value as string}
                        onChange={(val) => field.onChange(val)}
                        placeholder="Select event type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose existing event (optional)</FormLabel>
                    <FormControl>
                      <EventSelector
                        value={(field.value as any) ?? null}
                        onChange={(val, item) => {
                          field.onChange(val);
                          if (item) {
                            // Auto-fill all event-related fields from selected event
                            try {
                              // Fill event name
                              if (item.name_title) {
                                setValue("eventName", item.name_title);
                              }

                              // Fill event address (combine venue name and street address)
                              const addressParts = [
                                item.venue_name,
                                item.street_address,
                              ].filter(Boolean);
                              if (addressParts.length > 0) {
                                setValue(
                                  "eventAddress",
                                  addressParts.join(", ")
                                );
                              }

                              // Fill event type
                              if (item.event_type_id) {
                                setValue(
                                  "eventType",
                                  String(item.event_type_id)
                                );
                              }

                              // Fill guest count from max capacity
                              if (item.max_capacity) {
                                setValue("guestCount", item.max_capacity);
                              }

                              // Auto-fill date if available and not already set
                              if (item.date && !startDate) {
                                try {
                                  const eventDate = new Date(item.date);
                                  if (!isNaN(eventDate.getTime())) {
                                    setStartDate(eventDate);
                                  }
                                } catch (dateError) {
                                  console.warn(
                                    "Could not parse event date",
                                    dateError
                                  );
                                }
                              }

                              // Auto-fill time slot if available (for hourly mode)
                              if (
                                item.time &&
                                timingMode === "hourly" &&
                                !startTimeSlot
                              ) {
                                try {
                                  // Convert time like "18:00" to slot format "18:00-19:00"
                                  const [hour] = item.time.split(":");
                                  const hourNum = parseInt(hour, 10);
                                  if (
                                    !isNaN(hourNum) &&
                                    hourNum >= 0 &&
                                    hourNum < 24
                                  ) {
                                    const nextHour = (hourNum + 1) % 24;
                                    const timeSlot = `${hour.padStart(
                                      2,
                                      "0"
                                    )}:00-${String(nextHour).padStart(
                                      2,
                                      "0"
                                    )}:00`;
                                    setStartTimeSlot(timeSlot);
                                  }
                                } catch (timeError) {
                                  console.warn(
                                    "Could not parse event time",
                                    timeError
                                  );
                                }
                              }
                            } catch (e) {
                              console.warn(
                                "Couldn't auto-fill event fields",
                                e
                              );
                            }
                          }
                        }}
                        placeholder="Select an event to prefill"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter event name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="eventAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event address *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter event address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of guests</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter guest count"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="specialRequests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special requests (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Any special requirements?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setStartTimeSlot("");
                  setTimingMode("hourly");
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting}
                type="submit"
                disabled={
                  (timingMode === "fullday" && hasDateConflict) ||
                  (timingMode === "multiday" && hasRangeConflict)
                }
              >
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
