import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type EventType = {
  _id: string;
  name?: string;
  code?: string; // e.g. 'public_event' or 'private_planning'
  event_type_id?: number;
  emozi?: string;
};

export const fetchEventTypes = async (): Promise<EventType[]> => {
  const resp = await apiRequest("/api/event-types/getAll", "GET");
  return (resp && resp.data) || [];
};

export function useEventTypesQuery() {
  return useQuery<EventType[]>({
    queryKey: ["event-types"],
    queryFn: fetchEventTypes,
    staleTime: 1000 * 60 * 5,
  });
}
