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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: any | null;
  onSubmit: (data: FormValues) => Promise<void>;
};

const staffShiftSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
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
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(staffShiftSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      eventType: "",
      eventName: "",
      eventAddress: "",
      guestCount: undefined,
      specialRequests: "",
    },
  });

  const { handleSubmit, reset, control, setValue } = form;

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const submit = async (values: FormValues) => {
    try {
      await onSubmit(values);
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
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End time</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
