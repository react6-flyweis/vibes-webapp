import React from "react";
import { Input } from "@/components/ui/input";
import {
  useStaffAvailability,
  isDateBooked,
} from "@/hooks/useStaffAvailability";

interface AvailabilityDateSelectorProps {
  userId: string | number | null | undefined;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showWarning?: boolean;
  warningMessage?: string;
  showLoadingIndicator?: boolean;
  className?: string;
  enabled?: boolean; // Whether to fetch availability data
}

/**
 * Reusable date input with availability checking
 * Shows warning if the selected date has existing bookings
 */
export function AvailabilityDateSelector({
  userId,
  value,
  onChange,
  disabled = false,
  showWarning = true,
  warningMessage = "⚠️ This date has existing bookings. Staff may not be available.",
  showLoadingIndicator = true,
  className,
  enabled = true,
}: AvailabilityDateSelectorProps) {
  // Fetch availability data
  const { data: bookings = [], isLoading: loadingAvailability } =
    useStaffAvailability(userId, enabled);

  const dateIsBooked = value && isDateBooked(bookings, value);

  return (
    <div className={className}>
      {showLoadingIndicator && loadingAvailability && (
        <p className="text-xs text-muted-foreground mb-1">
          Checking availability...
        </p>
      )}
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {showWarning && dateIsBooked && (
        <p className="text-sm text-destructive mt-1">{warningMessage}</p>
      )}
    </div>
  );
}

export default AvailabilityDateSelector;
