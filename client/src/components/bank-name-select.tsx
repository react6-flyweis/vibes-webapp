import React from "react";
import { useBankNames } from "@/hooks/useBankNames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BankNameSelectProps = {
  value?: number | string;
  onChange: (val: number) => void;
  className?: string;
};

export default function BankNameSelect({
  value,
  onChange,
  className,
}: BankNameSelectProps) {
  const { data: banks, isLoading, isError, error } = useBankNames();

  if (isLoading) {
    return <div className={className}>Loading banks...</div>;
  }

  if (isError) {
    return (
      <div className={className} style={{ color: "var(--red, #ef4444)" }}>
        {(error as any)?.message || "Failed to load banks"}
      </div>
    );
  }

  const stringValue =
    value !== undefined && value !== null ? String(value) : "";

  return (
    <Select value={stringValue} onValueChange={(v) => onChange(Number(v) || 0)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select bank" />
      </SelectTrigger>
      <SelectContent>
        {(banks ?? []).map((b) => (
          <SelectItem key={b.bank_name_id} value={String(b.bank_name_id)}>
            {(b.emoji ? `${b.emoji} ` : "") + b.bank_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
