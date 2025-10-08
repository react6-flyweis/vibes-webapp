import React from "react";
import { useEventTypesQuery, EventType } from "@/queries/eventTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onChange?: (value: string, item?: EventType) => void;
  className?: string;
  placeholder?: string;
  event?: any;
};

export default function EventTypeSelector({
  value,
  onChange,
  className,
  placeholder = "Select event type",
}: Props) {
  const { data: types, isLoading, isError } = useEventTypesQuery();

  return (
    <Select
      value={value}
      onValueChange={(val) => {
        if (typeof val !== "string") return;
        const found = types?.find(
          (t) => String(t.event_type_id ?? t._id) === String(val)
        );
        onChange?.(val, found);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_event_type_loading" disabled>
            Loading...
          </SelectItem>
        )}

        {isError && (
          <SelectItem value="__vibes_event_type_error" disabled>
            Error loading event types
          </SelectItem>
        )}

        {!isLoading && !isError && types?.length === 0 && (
          <SelectItem value="__vibes_event_type_none" disabled>
            No event types found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          types?.map((t) => (
            <SelectItem
              key={t._id ?? t.event_type_id}
              value={String(t.event_type_id ?? t._id)}
            >
              {t.name} {t.emoji ? ` ${t.emoji}` : ""}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
