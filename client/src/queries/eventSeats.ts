import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

// Types for the /api/master/event-tickets-seats/all response
export interface EventTicketSeat {
  _id: string;
  event_entry_tickets_id: number;
  event_entry_userget_tickets_id: number;
  event_id: number;
  seat_no: string;
  capacity: number;
  status: boolean;
  createdBy: number;
  updatedBy?: number | null;
  createdAt: string;
  updatedAt?: string;
  event_tickets_seats_id: number;
}

/**
 * Fetch all booked event ticket seats. If eventId is provided, it will be added
 * as a query param: /api/master/event-tickets-seats/all?event_id=1
 */
export const fetchAllEventTicketSeats = async (eventId?: number | null) => {
  const url = `/api/master/event-tickets-seats/all`;
  //   const url = eventId
  //     ? `/api/master/event-tickets-seats/all?event_id=${eventId}`
  //     : `/api/master/event-tickets-seats/all`;

  const res = await axiosInstance.get<IResponseList<EventTicketSeat>>(url);
  return res.data;
};

/**
 * React Query hook returning the booked seats array (data).
 * Select returns the inner `data` array for convenience.
 */
export function useEventTicketSeatsQuery(eventId?: number | null) {
  const key = ["/api/master/event-tickets-seats/all", eventId];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchAllEventTicketSeats(eventId),
    // if caller wants to fetch for a specific eventId, enable only when provided
    enabled: typeof eventId === "undefined" ? true : !!eventId,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Utility to get a Set of booked seat numbers (strings) from the seats array.
 */
export function getBookedSeatNumbers(seats: EventTicketSeat[] | undefined) {
  if (!seats) return new Set<string>();
  return new Set(seats.map((s) => String(s.seat_no)));
}
