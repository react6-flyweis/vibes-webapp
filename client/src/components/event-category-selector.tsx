import React from "react";
import {
  useEventCategoryTagsQuery,
  EventCategoryTag,
} from "@/queries/eventCategoryTags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export default function EventCategorySelector({
  value,
  onChange,
  className,
  placeholder = "Select event category",
}: Props) {
  const { data, isLoading, isError } = useEventCategoryTagsQuery();

  const tags: EventCategoryTag[] = Array.isArray(data) ? data : [];

  return (
    <Select
      onValueChange={(val) => {
        if (typeof val === "string" && val.startsWith("__vibes_evtcat_"))
          return;
        onChange(val);
      }}
      defaultValue={value}
      value={value}
    >
      <FormControl>
        <SelectTrigger
          className={className || "bg-white/10 border-white/20 text-white"}
        >
          <SelectValue
            placeholder={
              isLoading ? "Loading event categories..." : placeholder
            }
          />
        </SelectTrigger>
      </FormControl>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_evtcat_loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__vibes_evtcat_error" disabled>
            Error loading event categories
          </SelectItem>
        )}
        {!isLoading && !isError && tags.length === 0 && (
          <SelectItem value="__vibes_evtcat_none" disabled>
            No event categories found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          tags.map((t) => (
            <SelectItem
              key={t.event_category_tags_id ?? t._id}
              value={String(t.event_category_tags_id ?? t._id)}
            >
              {t.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
