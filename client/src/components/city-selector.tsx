import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCitiesQuery,
  useCitiesByStateQuery,
  useCitiesByCountryQuery,
} from "@/queries/cities";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  stateId?: number | string | null;
  countryId?: number | string | null;
};

export default function CitySelector({
  value,
  onChange,
  placeholder = "Select city",
  className = "",
  stateId = null,
  countryId = null,
}: Props) {
  // Preference: if stateId provided, fetch by state; else if countryId provided, fetch by country; else fetch all
  const query =
    stateId != null
      ? useCitiesByStateQuery(stateId)
      : countryId != null
      ? useCitiesByCountryQuery(countryId)
      : useCitiesQuery();

  const { data: cities = [], isLoading, isError } = query;

  return (
    <Select
      onValueChange={(val) => {
        if (val && val.startsWith("__")) return;
        onChange?.(val);
      }}
      defaultValue={value}
      value={value}
    >
      <SelectTrigger
        className={"bg-white/10 border-white/20 text-white " + className}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="max-h-80 overflow-y-auto">
        {isLoading && (
          <SelectItem value="__loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__error" disabled>
            Error loading cities
          </SelectItem>
        )}
        {!isLoading && !isError && cities.length === 0 && (
          <SelectItem value="__none" disabled>
            No cities available
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          cities.map((c) => (
            <SelectItem key={c._id} value={String(c.city_id ?? c._id)}>
              {c.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
