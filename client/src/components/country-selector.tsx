import React from "react";
import { useCountriesQuery } from "@/queries/countries";
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
};

export default function CountrySelector({
  value,
  onChange,
  placeholder = "Select country",
  className = "",
}: Props) {
  const { data: countries = [], isLoading, isError } = useCountriesQuery();

  return (
    <Select
      onValueChange={(val) => {
        // sentinel values (prefixed with __) are status/placeholders and should not
        // be written into the form value. Treat them as a clear/no-op and send empty string.
        if (val && val.startsWith("__")) {
          return;
        }

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
            Error loading countries
          </SelectItem>
        )}
        {!isLoading && !isError && countries.length === 0 && (
          <SelectItem value="__none" disabled>
            No countries available
          </SelectItem>
        )}
        {!isLoading &&
          !isError &&
          countries.map((c) => (
            <SelectItem key={c._id} value={String(c.country_id)}>
              {c.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
