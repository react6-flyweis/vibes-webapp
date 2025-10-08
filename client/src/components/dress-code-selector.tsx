import React from "react";
import { useDressCodesQuery } from "@/queries/dressCodes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export default function DressCodeSelector({
  value,
  onChange,
  className,
  placeholder = "Select dress code",
}: Props) {
  const { data: dressCodes, isLoading, isError } = useDressCodesQuery();

  return (
    <Select
      onValueChange={(val) => {
        if (typeof val === "string" && val.startsWith("__vibes_dc_")) return;
        onChange(val);
      }}
      defaultValue={value}
      value={value}
    >
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={isLoading ? "Loading dress codes..." : placeholder}
        />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_dc_loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__vibes_dc_error" disabled>
            Error loading dress codes
          </SelectItem>
        )}
        {!isLoading && !isError && dressCodes?.length === 0 && (
          <SelectItem value="__vibes_dc_none" disabled>
            No dress codes found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          dressCodes?.map((d) => (
            <SelectItem
              key={d.dress_code_id ?? d._id}
              value={String(d.dress_code_id ?? d._id)}
            >
              {d.dress_code_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
