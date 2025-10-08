import React from "react";
import { useThemesQuery } from "@/queries/themes";
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

export default function ThemeSelector({
  value,
  onChange,
  className,
  placeholder = "Select theme",
}: Props) {
  const { data: themes, isLoading, isError } = useThemesQuery();

  return (
    <Select
      onValueChange={(val) => {
        if (typeof val === "string" && val.startsWith("__vibes_theme_")) return;
        onChange(val);
      }}
      defaultValue={value}
      value={value}
    >
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={isLoading ? "Loading themes..." : placeholder}
        />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="__vibes_theme_loading" disabled>
            Loading...
          </SelectItem>
        )}
        {isError && (
          <SelectItem value="__vibes_theme_error" disabled>
            Error loading themes
          </SelectItem>
        )}
        {!isLoading && !isError && themes?.length === 0 && (
          <SelectItem value="__vibes_theme_none" disabled>
            No themes found
          </SelectItem>
        )}

        {!isLoading &&
          !isError &&
          themes?.map((t) => (
            <SelectItem
              key={t.event_theme_id ?? t._id}
              value={String(t.event_theme_id ?? t._id)}
            >
              {t.event_theme_name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
