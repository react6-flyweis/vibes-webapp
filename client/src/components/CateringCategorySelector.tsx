import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useCateringCategoriesQuery } from "@/queries/cateringCategories";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
};

export default function CateringCategorySelector({
  value,
  onChange,
  placeholder = "Category",
  className = "w-48",
}: Props) {
  const { data: categories = [], isLoading } = useCateringCategoriesQuery();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {isLoading ? (
          <SelectItem value="loading">Loading...</SelectItem>
        ) : (
          categories.map((c: any) => (
            <SelectItem key={c._id} value={c._id}>
              {c.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
