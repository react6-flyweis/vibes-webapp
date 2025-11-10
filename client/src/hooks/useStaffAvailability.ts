import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type AvailabilityBooking = {
  _id?: string;
  staff_id?: number;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  event_id?: number;
  event_type_id?: number;
  event_name?: string;
  event_address?: string;
  no_of_guests?: number;
  special_instruction?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string | null;
};

/**
 * Hook to fetch staff availability/bookings from the calendar API
 * @param staffId - The staff user ID to check availability for
 * @param enabled - Whether to enable the query (default: true)
 */
export function useStaffAvailability(
  staffId: string | number | null | undefined,
  enabled = true
) {
  const numericStaffId = staffId ? Number(staffId) : null;

  return useQuery({
    queryKey: ["/api/master/availability-calender/getAll", numericStaffId],
    queryFn: async () => {
      if (!numericStaffId) {
        throw new Error("Staff ID is required");
      }

      const res = await axiosInstance.get<IResponseList<AvailabilityBooking>>(
        `/api/master/availability-calender/getAll?user_id=${numericStaffId}`
      );
      return res.data;
    },
    select: (data) => {
      return data?.data || [];
    },
    enabled: enabled && !!numericStaffId,
    staleTime: 1000 * 60 * 2, // Consider data stale after 2 minutes
  });
}

/**
 * Helper function to check if a specific date is fully booked (any booking exists for that date)
 */
export function isDateBooked(
  bookings: AvailabilityBooking[],
  date: string
): boolean {
  if (!bookings || !date) return false;

  const targetDate = new Date(date).toISOString().split("T")[0];

  return bookings.some((booking) => {
    if (!booking.dateFrom) return false;

    const bookingStartDate = new Date(booking.dateFrom)
      .toISOString()
      .split("T")[0];
    const bookingEndDate = booking.dateTo
      ? new Date(booking.dateTo).toISOString().split("T")[0]
      : bookingStartDate;

    // Check if target date falls within the booking range
    return targetDate >= bookingStartDate && targetDate <= bookingEndDate;
  });
}

/**
 * Helper function to check if a specific time slot is booked on a given date
 * @param bookings - Array of existing bookings
 * @param date - Date to check (YYYY-MM-DD format)
 * @param timeSlot - Time slot in format "HH:MM-HH:MM" (e.g., "10:00-11:00")
 */
export function isTimeSlotBooked(
  bookings: AvailabilityBooking[],
  date: string,
  timeSlot: string
): boolean {
  if (!bookings || !date || !timeSlot) return false;

  const targetDate = new Date(date).toISOString().split("T")[0];
  const [slotStart, slotEnd] = timeSlot.split("-");

  return bookings.some((booking) => {
    if (!booking.dateFrom || !booking.timeFrom || !booking.timeTo) return false;

    const bookingDate = new Date(booking.dateFrom).toISOString().split("T")[0];

    // Only check bookings on the same date
    if (bookingDate !== targetDate) return false;

    // Check if time ranges overlap
    const bookingStart = booking.timeFrom;
    const bookingEnd = booking.timeTo;

    // Convert times to minutes for easier comparison
    const toMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const slotStartMin = toMinutes(slotStart);
    const slotEndMin = toMinutes(slotEnd);
    const bookingStartMin = toMinutes(bookingStart);
    const bookingEndMin = toMinutes(bookingEnd);

    // Check for overlap: slot overlaps with booking if:
    // - slot starts before booking ends AND
    // - slot ends after booking starts
    return slotStartMin < bookingEndMin && slotEndMin > bookingStartMin;
  });
}

/**
 * Helper function to check if a date range has any bookings
 * Used for multi-day booking mode
 */
export function isDateRangeBooked(
  bookings: AvailabilityBooking[],
  startDate: string,
  endDate: string
): boolean {
  if (!bookings || !startDate || !endDate) return false;

  const rangeStart = new Date(startDate).toISOString().split("T")[0];
  const rangeEnd = new Date(endDate).toISOString().split("T")[0];

  return bookings.some((booking) => {
    if (!booking.dateFrom) return false;

    const bookingStart = new Date(booking.dateFrom).toISOString().split("T")[0];
    const bookingEnd = booking.dateTo
      ? new Date(booking.dateTo).toISOString().split("T")[0]
      : bookingStart;

    // Check if date ranges overlap
    return rangeStart <= bookingEnd && rangeEnd >= bookingStart;
  });
}

export default useStaffAvailability;
