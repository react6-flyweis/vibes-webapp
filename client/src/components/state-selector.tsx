import React from "react";
import { useStatesQuery, useStatesByCountryQuery } from "@/queries/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  countryId?: number | string | null; // optional: allow filtering states by country
};

export default function StateSelector({
  value,
  onChange,
  placeholder = "Select state",
  className = "",
  countryId = null,
}: Props) {
  const query =
    countryId == null ? useStatesQuery() : useStatesByCountryQuery(countryId);

  const { data: states = [], isLoading, isError } = query;

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
            Error loading states
          </SelectItem>
        )}
        {!isLoading && !isError && states.length === 0 && (
          <SelectItem value="__none" disabled>
            No states available
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          states.map((s) => (
            <SelectItem key={s._id} value={String(s.state_id ?? s._id)}>
              {s.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
