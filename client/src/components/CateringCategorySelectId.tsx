import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCateringCategoriesQuery } from "@/queries/cateringCategories";

type Props = {
  value: number | string | undefined;
  onChange: (val: number | string) => void;
  placeholder?: string;
  className?: string;
};

export default function CateringCategorySelectId({
  value,
  onChange,
  placeholder = "Category",
  className = "w-48",
}: Props) {
  const { data: categories = [], isLoading } = useCateringCategoriesQuery();

  // internal value must be string for Select component
  const internalValue =
    value !== undefined && value !== null ? String(value) : undefined;

  return (
    <Select
      value={internalValue}
      onValueChange={(v) => {
        // try to return number when possible (catering_marketplace_category_id)
        const parsed = Number(v);
        if (!Number.isNaN(parsed)) onChange(parsed);
        else onChange(v);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : (
          categories.map((c: any) => (
            // prefer numeric catering_marketplace_category_id if present
            <SelectItem
              key={c._id}
              value={String(c.catering_marketplace_category_id ?? c._id)}
            >
              {c.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
