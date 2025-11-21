import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

/**
 * Unified type for availability bookings (works for both vendors and staff)
 * Maps various booking fields to a consistent availability booking format
 */
export type AvailabilityBooking = {
  _id?: string;
  Availability_Calender_id?: number | null;
  Vendor_Booking_id?: number;
  user_id?: number;
  vendor_id?: number;
  staff_id?: number;
  dateFrom?: string; // Date_start mapped to dateFrom
  dateTo?: string; // End_date mapped to dateTo
  timeFrom?: string; // Start_time mapped to timeFrom
  timeTo?: string; // End_time mapped to timeTo
  Event_id?: number | null;
  event_type_id?: number;
  event_name?: string;
  event_address?: string;
  no_of_guests?: number;
  special_instruction?: string;
  User_availabil?: string;
  Status?: boolean;
  status?: boolean;
  source?: string;
  booking_status?: string;
  booking_amount?: number;
  CreateAt?: string;
  created_at?: string;
  UpdatedAt?: string;
  updated_at?: string | null;
};

export type AvailabilityOptions = {
  /** Whether to enable the query (default: true) */
  enabled?: boolean;
  /** Time in milliseconds to consider data stale (default: 30 seconds) */
  staleTime?: number;
  /** Whether to refetch when window regains focus (default: true) */
  refetchOnWindowFocus?: boolean;
};

/**
 * Generic hook to fetch availability from the availability calendar API
 * This API aggregates bookings and shows what slots are already booked
 * Can be used for both vendors and staff
 *
 * @param userId - The user ID (vendor or staff) to check availability for
 * @param options - Query options
 */
export function useAvailability(
  userId: string | number | null | undefined,
  options: AvailabilityOptions = {}
) {
  const {
    enabled = true,
    staleTime = 1000 * 30, // 30 seconds default for real-time availability
    refetchOnWindowFocus = true,
  } = options;

  const numericUserId = userId ? Number(userId) : null;

  return useQuery({
    queryKey: ["/api/master/availability-calender/getAll", numericUserId],
    queryFn: async () => {
      if (!numericUserId) {
        throw new Error("User ID is required");
      }

      // Fetch availability calendar entries for the user (vendor or staff)
      const res = await axiosInstance.get<IResponseList<any>>(
        `/api/master/availability-calender/getAll?user_id=${numericUserId}`
      );

      return res.data;
    },
    select: (data) => {
      const bookings = data?.data || [];

      // Transform availability calendar entries to standardized format
      return bookings.map(
        (booking: any): AvailabilityBooking => ({
          _id: booking._id,
          Availability_Calender_id: booking.Availability_Calender_id,
          Vendor_Booking_id: booking.Vendor_Booking_id,
          user_id: booking.user_id,
          vendor_id: booking.user_id, // user_id is the vendor ID in vendor context
          staff_id: booking.user_id, // user_id is the staff ID in staff context
          // Map availability calendar fields to consistent format
          dateFrom: booking.Date_start || booking.dateFrom,
          dateTo: booking.End_date || booking.dateTo,
          timeFrom: booking.Start_time || booking.timeFrom,
          timeTo: booking.End_time || booking.timeTo,
          Event_id: booking.Event_id || booking.event_id,
          event_type_id: booking.event_type_id,
          event_name: booking.event_name,
          event_address: booking.event_address,
          no_of_guests: booking.no_of_guests,
          special_instruction: booking.special_instruction,
          User_availabil: booking.User_availabil,
          Status: booking.Status,
          status: booking.Status ?? booking.status,
          source: booking.source,
          booking_status: booking.booking_status,
          booking_amount: booking.booking_amount,
          CreateAt: booking.CreateAt,
          created_at: booking.CreateAt || booking.created_at,
          UpdatedAt: booking.UpdatedAt,
          updated_at: booking.UpdatedAt || booking.updated_at,
        })
      );
    },
    enabled: enabled && !!numericUserId,
    staleTime,
    refetchOnWindowFocus,
  });
}

/**
 * Helper function to check if a specific date is fully booked
 * @param bookings - Array of existing bookings
 * @param date - Date to check (YYYY-MM-DD format or Date string)
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
 * @param bookings - Array of existing bookings
 * @param startDate - Start date of the range (YYYY-MM-DD format)
 * @param endDate - End date of the range (YYYY-MM-DD format)
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

/**
 * Helper function to get all bookings for a specific date
 * @param bookings - Array of existing bookings
 * @param date - Date to check (YYYY-MM-DD format)
 */
export function getBookingsForDate(
  bookings: AvailabilityBooking[],
  date: string
): AvailabilityBooking[] {
  if (!bookings || !date) return [];

  const targetDate = new Date(date).toISOString().split("T")[0];

  return bookings.filter((booking) => {
    if (!booking.dateFrom) return false;

    const bookingStartDate = new Date(booking.dateFrom)
      .toISOString()
      .split("T")[0];
    const bookingEndDate = booking.dateTo
      ? new Date(booking.dateTo).toISOString().split("T")[0]
      : bookingStartDate;

    return targetDate >= bookingStartDate && targetDate <= bookingEndDate;
  });
}

/**
 * Helper function to get available time slots for a specific date
 * @param bookings - Array of existing bookings
 * @param date - Date to check (YYYY-MM-DD format)
 * @param allTimeSlots - Array of all possible time slots in "HH:MM-HH:MM" format
 */
export function getAvailableTimeSlots(
  bookings: AvailabilityBooking[],
  date: string,
  allTimeSlots: string[]
): string[] {
  if (!bookings || !date || !allTimeSlots) return allTimeSlots;

  return allTimeSlots.filter((slot) => !isTimeSlotBooked(bookings, date, slot));
}

export default useAvailability;
