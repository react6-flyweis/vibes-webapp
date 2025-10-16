import React from "react";
import { useForm } from "react-hook-form";
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

type FormValues = {
  startDate: string;
  endDate: string;
  eventName: string;
  eventAddress: string;
  eventType: string;
  guestCount: string;
};

type Props = {
  open: boolean;
  vendorName?: string;
  vendorPhone?: string;
  onClose: () => void;
  onSubmit: (payload: any) => void;
};

export default function EventDetailsDialog({
  open,
  vendorName,
  vendorPhone,
  onClose,
  onSubmit,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      startDate: "",
      endDate: "",
      eventName: "",
      eventAddress: "",
      eventType: "Birthday",
      guestCount: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        if (!openState) onClose();
      }}
    >
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
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button type="submit">Request Booking</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
