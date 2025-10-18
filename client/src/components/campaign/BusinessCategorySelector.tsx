import React from "react";
import { useBusinessCategories } from "@/queries/useBusinessCategories";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export function BusinessCategorySelector({ value, onChange }: Props) {
  const { data: categories, isLoading, error } = useBusinessCategories();

  return (
    <div className="mt-2">
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading categories...</div>
      ) : error ? (
        <div className="text-sm text-red-500">Failed to load categories</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {(categories || []).map((c: any) => {
            const selected = value === c.business_category;
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => onChange(c.business_category)}
                className={cn(
                  "w-full text-left p-4 border   bg-white flex flex-col gap-2 transition-colors",
                  selected
                    ? "border-blue-400 ring-1 ring-blue-300 shadow-sm"
                    : "border-gray-500 hover:border-gray-300"
                )}
              >
                <div className="text-2xl">{c.emoji || "🔖"}</div>
                <div className="flex-1">
                  <div
                    className={cn(
                      "font-medium text-base text-gray-800",
                      selected && "text-blue-600"
                    )}
                  >
                    {c.business_category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
