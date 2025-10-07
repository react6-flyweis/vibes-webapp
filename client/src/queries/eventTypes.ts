import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type EventType = {
  _id: string;
  name: string;
  emoji?: string;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  event_type_id?: number;
};

export function useEventTypesQuery() {
  return useQuery({
    queryKey: ["eventTypes"],
    queryFn: () =>
      axiosInstance.get<IResponseList<EventType>>("/api/event-types/getAll"),
    staleTime: 1000 * 60 * 5,
  });
}
