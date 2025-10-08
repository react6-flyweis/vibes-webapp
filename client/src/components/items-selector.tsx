import React from "react";
import { useItemsQuery } from "@/queries/items";
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

export default function ItemsSelector({
  value,
  onChange,
  className,
  placeholder = "Select item",
}: Props) {
  const { data: items, isLoading, isError } = useItemsQuery();

  return (
    <Select
      onValueChange={(val) => onChange(val)}
      defaultValue={value}
      value={value}
    >
      <FormControl>
        <SelectTrigger
          className={className || "bg-white/10 border-white/20 text-white"}
        >
          <SelectValue
            placeholder={isLoading ? "Loading items..." : placeholder}
          />
        </SelectTrigger>
      </FormControl>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_item_loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__vibes_item_error" disabled>
            Error loading items
          </SelectItem>
        )}
        {!isLoading && !isError && items?.length === 0 && (
          <SelectItem value="__vibes_item_none" disabled>
            No items found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          items?.map((it) => (
            <SelectItem key={it._id} value={String(it.items_id)}>
              {it.item_brand ? `${it.item_brand} — ` : ""}
              {it.item_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
