import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ArrowRight } from "lucide-react";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { AvailabilityTimeSlotSelector } from "./AvailabilityTimeSlotSelector";
import { AvailabilityDateSelector } from "./AvailabilityDateSelector";
import { AvailabilityDateRangeSelector } from "./AvailabilityDateRangeSelector";

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
  eventId: z.string().min(1, "Event ID is required"),
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
      eventName: "",
      eventAddress: "",
      guestCount: undefined,
      specialRequests: "",
    },
  });

  const { handleSubmit, reset, control, setValue, watch } = form;
  const timingMode = watch("timingMode");
  const selectedDate = watch("startDate");
  const selectedEndDate = watch("endDate");

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  // Handle timing mode changes
  React.useEffect(() => {
    if (timingMode === "hourly") {
      // For hourly mode, set times from time slot
      const timeSlot = watch("timeSlot");
      if (timeSlot) {
        const [start, end] = timeSlot.split("-");
        setValue("startTime", start);
        setValue("endTime", end);
        setValue("endDate", watch("startDate")); // Same day
      }
    } else if (timingMode === "fullday") {
      // For full day, set times to full day (00:00 - 23:59)
      setValue("startTime", "00:00");
      setValue("endTime", "23:59");
      setValue("endDate", watch("startDate")); // Same day
    } else if (timingMode === "multiday") {
      // For multiday, set default times to full day (00:00 - 23:59)
      setValue("startTime", "00:00");
      setValue("endTime", "23:59");
    }
  }, [timingMode, watch("timeSlot"), watch("startDate")]);

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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Shift Details
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(submit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Timing Mode Selection (single inline segmented control) */}
            <div className="md:col-span-2">
              <FormField
                control={control}
                name="timingMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift schedule</FormLabel>
                    <div className="text-xs text-muted-foreground mt-1">
                      Select schedule type
                    </div>
                    <FormControl>
                      <div className="inline-flex rounded-md shadow-sm bg-transparent border divide-x">
                        <button
                          type="button"
                          onClick={() => field.onChange("hourly")}
                          aria-pressed={field.value === "hourly"}
                          className={`px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            field.value === "hourly"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-muted-foreground hover:bg-muted"
                          } rounded-l-md`}
                        >
                          Hourly
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("fullday")}
                          aria-pressed={field.value === "fullday"}
                          className={`px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            field.value === "fullday"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          Full Day
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("multiday")}
                          aria-pressed={field.value === "multiday"}
                          className={`px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            field.value === "multiday"
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent text-muted-foreground hover:bg-muted"
                          } rounded-r-md`}
                        >
                          Multiple Days
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date and Time Fields based on Mode */}
            {timingMode === "hourly" && (
              <>
                <FormField
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="timeSlot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <FormControl>
                        <AvailabilityTimeSlotSelector
                          userId={staff?.id}
                          selectedDate={selectedDate}
                          value={field.value || ""}
                          onChange={field.onChange}
                          enabled={open}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {timingMode === "fullday" && (
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <AvailabilityDateSelector
                        userId={staff?.id}
                        value={field.value || ""}
                        onChange={field.onChange}
                        enabled={open}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {timingMode === "multiday" && (
              <>
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name="startDate"
                    render={({ field: startField }) => (
                      <FormField
                        control={control}
                        name="endDate"
                        render={({ field: endField }) => (
                          <FormItem>
                            <FormLabel>Date Range</FormLabel>
                            <FormControl>
                              <AvailabilityDateRangeSelector
                                userId={staff?.id}
                                startDate={startField.value || ""}
                                endDate={endField.value || ""}
                                onStartDateChange={startField.onChange}
                                onEndDateChange={endField.onChange}
                                enabled={open}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <FormField
                control={control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event type</FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <EventTypeSelector
                          value={field.value as string}
                          onChange={(val) => field.onChange(val)}
                          placeholder="Select event type"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose existing event (optional)</FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <EventSelector
                          value={(field.value as any) ?? null}
                          onChange={(val, item) => {
                            field.onChange(val);
                            if (item) {
                              // populate name and address fields from selected event
                              try {
                                setValue("eventName", item.name_title ?? "");
                                setValue(
                                  "eventAddress",
                                  item.street_address ?? ""
                                );
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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="eventName"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Event name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="eventAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Event address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="guestCount"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>No of guests</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting}
                type="submit"
              >
                Next <ArrowRight />
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
