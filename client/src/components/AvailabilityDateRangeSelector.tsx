import React from "react";
import { Input } from "@/components/ui/input";
import {
  useStaffAvailability,
  isDateRangeBooked,
} from "@/hooks/useStaffAvailability";

interface AvailabilityDateRangeSelectorProps {
  userId: string | number | null | undefined;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  disabled?: boolean;
  showWarning?: boolean;
  warningMessage?: string;
  showLoadingIndicator?: boolean;
  className?: string;
  enabled?: boolean; // Whether to fetch availability data
}

/**
 * Reusable date range selector with availability checking
 * Shows warning if the date range overlaps with existing bookings
 */
export function AvailabilityDateRangeSelector({
  userId,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  disabled = false,
  showWarning = true,
  warningMessage = "⚠️ Warning: This date range has existing bookings. Staff may not be available for the entire duration.",
  showLoadingIndicator = true,
  className,
  enabled = true,
}: AvailabilityDateRangeSelectorProps) {
  // Fetch availability data
  const { data: bookings = [], isLoading: loadingAvailability } =
    useStaffAvailability(userId, enabled);

  const hasConflict = React.useMemo(() => {
    if (!startDate || !endDate) return false;
    return isDateRangeBooked(bookings, startDate, endDate);
  }, [startDate, endDate, bookings]);

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {showLoadingIndicator && loadingAvailability && (
            <p className="text-xs text-muted-foreground mb-1">
              Checking availability...
            </p>
          )}
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            disabled={disabled}
            placeholder="Start date"
          />
        </div>
        <div>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={disabled}
            placeholder="End date"
          />
        </div>
      </div>
      {showWarning && hasConflict && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{warningMessage}</p>
        </div>
      )}
    </div>
  );
}

export default AvailabilityDateRangeSelector;
