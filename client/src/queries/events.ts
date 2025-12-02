import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse, IResponseList } from "@/types";
import { IEvent } from "@/hooks/useEvents";

// EventData represents the shape returned by the events API.
// Fields are typed based on a sample API response; many fields are optional
// to remain resilient to minor backend changes.
export type EventData = {
  _id: string;
  name_title: string;
  event_type_id: number;
  ticketed_events: boolean;
  description?: string;
  venue_name?: string;
  street_address?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  event_category_tags_id?: number;
  tags?: string[];
  date?: string; // ISO date string
  time?: string; // e.g. "18:00"
  max_capacity?: number;
  event_image?: string;
  live_vibes_invite_videos?: string[];
  live_vibes_invite_venue_tour?: string[];
  live_vibes_invite_music_preview?: string[];
  live_vibes_invite_vip_perks?: string[];
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  event_id?: number;
  // allow extra fields without breaking the type
  //   [key: string]: unknown;
};

export const fetchEventById = async (eventId?: string | null) => {
  if (!eventId) return null;
  const res = await axiosInstance.get<IResponse<IEvent>>(
    `/api/events/getById/${eventId}`
  );
  return res.data;
};

export function useEventByIdQuery(eventId?: string | null) {
  return useQuery({
    queryKey: [`/api/events/getById/${eventId}`],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId,
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Fetch events the current user can plan/manage (by auth)
export const fetchEventsByAuth = async () => {
  const res = await axiosInstance.get<IResponseList<EventData>>(
    "/api/events/getByAuth"
  );
  return res.data;
};

export function useEventsByAuthQuery() {
  return useQuery({
    queryKey: ["/api/events/getByAuth"],
    queryFn: fetchEventsByAuth,
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 2,
  });
}
