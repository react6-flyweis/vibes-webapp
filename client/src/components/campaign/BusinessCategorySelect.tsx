import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useBusinessCategories } from "@/queries/useBusinessCategories";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export const BusinessCategorySelect: React.FC<Props> = ({
  value,
  onChange,
}) => {
  const { data: categories, isLoading, error } = useBusinessCategories();

  if (isLoading)
    return <div className="text-sm text-gray-500">Loading categories...</div>;
  if (error)
    return (
      <div className="text-sm text-red-500">Failed to load categories</div>
    );

  return (
    <Select value={value} onValueChange={(v) => onChange(String(v))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {(categories || []).map((c: any) => {
          const val = c.business_category_id ?? c.business_category;
          return (
            <SelectItem key={String(val)} value={String(val)}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{c.emoji ?? "🔖"}</span>
                <span>{c.business_category}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default BusinessCategorySelect;
