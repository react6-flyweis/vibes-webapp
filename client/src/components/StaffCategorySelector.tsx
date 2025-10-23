import React from "react";
import { useStaffCategoriesQuery } from "@/queries/staffCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export default function StaffCategorySelector({
  value,
  onChange,
  className,
  placeholder = "Category",
}: Props) {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useStaffCategoriesQuery();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className || "w-48"}>
        <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {isLoading && (
          <SelectItem value="__loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__error" disabled>
            Error loading categories
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          categories.map((c: any) => (
            <SelectItem
              key={c._id ?? c.staff_category_id ?? c.staff_category_id}
              value={String(
                c.staff_category_id ?? c.staff_category_id ?? c._id
              )}
            >
              {c.name ?? c.category_name ?? c.categorytxt}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
