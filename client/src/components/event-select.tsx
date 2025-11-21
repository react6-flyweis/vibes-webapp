import React from "react";
import { useEventsByAuthQuery, EventData } from "@/queries/events";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string | null;
  onChange?: (value: string, item?: EventData) => void;
  className?: string;
  placeholder?: string;
};

export default function EventSelector({
  value,
  onChange,
  className,
  placeholder = "Select an event",
}: Props) {
  const { data: events, isLoading, isError } = useEventsByAuthQuery();

  return (
    <Select
      value={value ?? ""}
      onValueChange={(val) => {
        if (typeof val !== "string") return;
        const found = events?.find(
          (e) =>
            String(e.event_id) === String(val) || String(e._id) === String(val)
        );
        onChange?.(val, found);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_event_loading" disabled>
            Loading...
          </SelectItem>
        )}

        {isError && (
          <SelectItem value="__vibes_event_error" disabled>
            Error loading events
          </SelectItem>
        )}

        {!isLoading && !isError && events?.length === 0 && (
          <SelectItem value="__vibes_event_none" disabled>
            No events found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          events?.map((e) => (
            <SelectItem key={e._id} value={String(e.event_id)}>
              {e.name_title}{" "}
              {e.date ? ` — ${new Date(e.date).toLocaleDateString()}` : ""}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
