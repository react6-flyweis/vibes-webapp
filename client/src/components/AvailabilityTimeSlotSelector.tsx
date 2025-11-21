import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAvailability, isTimeSlotBooked } from "@/hooks/useAvailability";

// Generate hourly time slots (24-hour format)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const start = i.toString().padStart(2, "0") + ":00";
    const end = ((i + 1) % 24).toString().padStart(2, "0") + ":00";
    slots.push({ value: `${start}-${end}`, label: `${start} - ${end}` });
  }
  return slots;
};

export const TIME_SLOTS = generateTimeSlots();

interface AvailabilityTimeSlotSelectorProps {
  userId: string | number | null | undefined;
  selectedDate: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showLoadingIndicator?: boolean;
  enabled?: boolean; // Whether to fetch availability data
}

/**
 * Reusable time slot selector with availability checking
 * Fetches user's bookings and disables already-booked slots
 */
export function AvailabilityTimeSlotSelector({
  userId,
  selectedDate,
  value,
  onChange,
  disabled = false,
  placeholder = "Select time slot",
  className,
  showLoadingIndicator = true,
  enabled = true,
}: AvailabilityTimeSlotSelectorProps) {
  // Fetch availability data
  const { data: bookings = [], isLoading: loadingAvailability } =
    useAvailability(userId, { enabled });

  const dateSelected = !!selectedDate;
  const isDisabled = disabled || !dateSelected;

  return (
    <div className={className}>
      {showLoadingIndicator && loadingAvailability && (
        <p className="text-xs text-muted-foreground mb-1">
          Checking availability...
        </p>
      )}
      <Select onValueChange={onChange} value={value} disabled={isDisabled}>
        <SelectTrigger>
          <SelectValue
            placeholder={dateSelected ? placeholder : "Select a date first"}
          />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {TIME_SLOTS.map((slot) => {
            const isBooked =
              dateSelected &&
              isTimeSlotBooked(bookings, selectedDate, slot.value);
            return (
              <SelectItem
                key={slot.value}
                value={slot.value}
                disabled={isBooked}
                className={isBooked ? "opacity-50 cursor-not-allowed" : ""}
              >
                {slot.label}
                {isBooked && (
                  <span className="ml-2 text-xs text-destructive">
                    (Booked)
                  </span>
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default AvailabilityTimeSlotSelector;
