import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: any | null;
  onSubmit: (data: any) => void;
};

export default function StaffShiftDialog({
  open,
  onOpenChange,
  staff,
  onSubmit,
}: Props) {
  type FormValues = {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    eventType: string;
    eventName: string;
    eventAddress: string;
    guestCount: string;
    specialRequests: string;
  };

  const { control, register, handleSubmit, reset, formState } =
    useForm<FormValues>({
      defaultValues: {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        eventType: "",
        eventName: "",
        eventAddress: "",
        guestCount: "",
        specialRequests: "",
      },
    });

  const { errors } = formState;

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const submit = (values: FormValues) => {
    onSubmit(values);
    // do not reset here in case parent wants to show success while dialog closes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Shift Details
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label>Start date</Label>
            <Input
              {...register("startDate", { required: "Start date is required" })}
              type="date"
            />
            {errors.startDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>End date</Label>
            <Input {...register("endDate")} type="date" />
            {errors.endDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div>
            <Label>Start time</Label>
            <Input
              {...register("startTime", { required: "Start time is required" })}
              type="time"
            />
            {errors.startTime && (
              <p className="text-sm text-red-500 mt-1">
                {errors.startTime.message}
              </p>
            )}
          </div>

          <div>
            <Label>End time</Label>
            <Input
              {...register("endTime", { required: "End time is required" })}
              type="time"
            />
            {errors.endTime && (
              <p className="text-sm text-red-500 mt-1">
                {errors.endTime.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Event type</Label>
            <Controller
              control={control}
              name="eventType"
              rules={{ required: "Event type is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.eventType && (
              <p className="text-sm text-red-500 mt-1">
                {errors.eventType.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Event name</Label>
            <Input
              {...register("eventName", { required: "Event name is required" })}
            />
            {errors.eventName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.eventName.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>Event address</Label>
            <Input
              {...register("eventAddress", {
                required: "Event address is required",
              })}
            />
            {errors.eventAddress && (
              <p className="text-sm text-red-500 mt-1">
                {errors.eventAddress.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label>No of guests</Label>
            <Input
              {...register("guestCount", {
                pattern: { value: /^[0-9]+$/, message: "Enter a valid number" },
              })}
              type="number"
            />
            {errors.guestCount && (
              <p className="text-sm text-red-500 mt-1">
                {errors.guestCount.message}
              </p>
            )}
          </div>

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
            <Button type="submit">Next &rarr;</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
