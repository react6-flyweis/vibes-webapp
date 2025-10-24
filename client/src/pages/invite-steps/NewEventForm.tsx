import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().optional(),
  category: z.string().optional(),
  capacity: z.number().min(1).optional(),
  ticketPrice: z.number().min(0).optional(),
});

export type NewEventFormValues = z.infer<typeof EventSchema>;

interface Props {
  defaultValues?: Partial<NewEventFormValues>;
  isLoading?: boolean;
  onCreate: (data: NewEventFormValues) => void;
}

export default function NewEventForm({
  defaultValues = {},
  isLoading = false,
  onCreate,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewEventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: defaultValues as any,
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onCreate(data))}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={3} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input id="time" type="time" {...register("time")} />
          {errors.time && (
            <p className="text-sm text-red-500">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="venue">Venue *</Label>
        <Input id="venue" {...register("venue")} />
        {errors.venue && (
          <p className="text-sm text-red-500">{errors.venue.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          defaultValue={(defaultValues.category as string) || "party"}
          onValueChange={(v) => setValue("category", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="wedding">Wedding</SelectItem>
            <SelectItem value="corporate">Corporate</SelectItem>
            <SelectItem value="party">Party</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="nightclub">Nightclub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            {...register("capacity", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
          <Input
            id="ticketPrice"
            type="number"
            {...register("ticketPrice", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? "Creating..." : "Create Event & Continue"}
        </Button>
      </div>
    </form>
  );
}
