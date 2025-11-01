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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "./ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";

const eventDetailsSchema = z.object({
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().optional(),
  eventName: z.string().min(3, "Event name must be at least 3 characters"),
  eventAddress: z
    .string()
    .min(3, "Event address must be at least 3 characters"),
  eventType: z.enum(["Birthday", "Wedding", "Corporate"]),
  // coerce to number so the input can be a numeric string
  guestCount: z.coerce.number().min(1, "Please enter at least 1 guest"),
  // amount: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof eventDetailsSchema>;

type Props = {
  open: boolean;
  vendorName?: string;
  vendorPhone?: string;
  onClose: () => void;
  onSubmit: (payload: any) => void | Promise<void>;
};

export default function EventDetailsDialog({
  open,
  vendorName,
  vendorPhone,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      eventName: "",
      eventAddress: "",
      eventType: "Birthday",
      guestCount: 0,
      // amount: 0,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err);
      form.setError("root", {
        type: "server",
        message: errorMessage || "An unexpected error occurred",
      });
    }
  };

  const handleOpenChange = (openState: boolean) => {
    // dont close if form is dirty/submitting
    if (form.formState.isDirty || form.formState.isSubmitting) return;
    if (!openState) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Organiser: {vendorName} • {vendorPhone}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event End</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Birthday">Birthday</SelectItem>
                          <SelectItem value="Wedding">Wedding</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>No of Guests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Number"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (INR)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter total amount"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            {form.formState.errors.root && (
              <div className="text-red-600 text-sm">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
              >
                Request Booking
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
