import React from "react";
import { useCategoriesQuery } from "@/queries/categories";
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

export default function CategorySelector({
  value,
  onChange,
  className,
  placeholder = "Select category",
}: Props) {
  const { data: categories, isLoading, isError } = useCategoriesQuery();

  return (
    <Select
      onValueChange={(val) => {
        // Ignore sentinel values used for UI-only states
        if (typeof val === "string" && val.startsWith("__vibes_cat_")) return;
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
            placeholder={isLoading ? "Loading categories..." : placeholder}
          />
        </SelectTrigger>
      </FormControl>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_cat_loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__vibes_cat_error" disabled>
            Error loading categories
          </SelectItem>
        )}
        {!isLoading && !isError && categories?.length === 0 && (
          <SelectItem value="__vibes_cat_none" disabled>
            No categories found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          categories?.map((c) => (
            <SelectItem key={c.category_id} value={String(c.category_id)}>
              {c.emozi ? `${c.emozi} ` : ""}
              {c.category_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
