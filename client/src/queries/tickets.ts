import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse, IResponseList } from "@/types";

export type TicketFacility = {
  name: string;
  included: boolean;
};

export type EventEntryTicket = {
  _id: string;
  event_id: number;
  title: string;
  price: number;
  total_seats: number;
  facility: TicketFacility[];
  tag: string;
  status: boolean;
  createdBy: number;
  updatedBy?: number | null;
  createdAt: string;
  updatedAt?: string;
  event_entry_tickets_id: string;
  // allow extra fields
  //   [key: string]: unknown;
};

// Fetch all event entry tickets
export const fetchAllEventEntryTickets = async () => {
  const res = await axiosInstance.get<IResponseList<EventEntryTicket>>(
    "/api/master/event-entry-tickets/all"
  );
  return res.data;
};

// Hook: get all tickets
export function useAllEventEntryTicketsQuery() {
  return useQuery({
    queryKey: ["/api/master/event-entry-tickets/all"],
    queryFn: fetchAllEventEntryTickets,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// Optional: fetch tickets filtered by event id if the API supports it
export const fetchEventEntryTicketsByEventId = async (
  eventId?: number | null
) => {
  if (!eventId) return null;
  const res = await axiosInstance.get<IResponse<EventEntryTicket[]>>(
    `/api/master/event-entry-tickets/all?event_id=${eventId}`
  );
  return res.data;
};

export function useEventEntryTicketsByEventIdQuery(eventId?: number | null) {
  return useQuery({
    queryKey: ["/api/master/event-entry-tickets/all", eventId],
    queryFn: () => fetchEventEntryTicketsByEventId(eventId),
    enabled: !!eventId,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
