/**
 * Availability Components
 *
 * Reusable components for checking and displaying user/staff availability
 * All components accept a userId prop and automatically fetch bookings
 */

export {
  AvailabilityTimeSlotSelector,
  TIME_SLOTS,
} from "../AvailabilityTimeSlotSelector";

export { AvailabilityDateSelector } from "../AvailabilityDateSelector";

export { AvailabilityDateRangeSelector } from "../AvailabilityDateRangeSelector";

// Re-export hooks and utilities for convenience
export {
  useAvailability,
  isTimeSlotBooked,
  isDateBooked,
  isDateRangeBooked,
  type AvailabilityBooking,
} from "@/hooks/useAvailability";
