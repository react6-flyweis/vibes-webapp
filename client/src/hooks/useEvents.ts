import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface FetchEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean | string;
  event_type_id?: string | number;
  country_id?: string | number;
  state_id?: string | number;
  city_id?: string | number;
  event_category_tags_id?: string | number;
  ticketed_events?: boolean | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ICategoryTag {
  _id: string;
  name: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  country_id: number;
}

export interface IEvent {
  _id: string;
  name_title: string;
  event_type_id?: number;
  description?: string;
  venue_name?: string;
  street_address?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  event_category_tags_id?: ICategoryTag;
  tags?: string[];
  date?: string;
  time?: string;
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
  ticketed_events?: boolean;
  event_id?: number;
  venue_details_id?: number;
  venue_details?: {
    _id: string;
    name: string;
    address?: string;
    capacity?: number;
    type?: string;
    map?: string;
    venue_details_id?: number;
  };
}

export async function fetchEvents(params: FetchEventsParams = {}) {
  const query = new URLSearchParams();
  const {
    page = 1,
    limit = 10,
    search = "",
    status = true,
    event_type_id = "",
    country_id = "",
    state_id = "",
    city_id = "",
    event_category_tags_id = "",
    ticketed_events = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("search", String(search ?? ""));
  query.set("status", String(status ?? "true"));
  if (event_type_id !== "" && event_type_id !== undefined)
    query.set("event_type_id", String(event_type_id));
  if (country_id !== "" && country_id !== undefined)
    query.set("country_id", String(country_id));
  if (state_id !== "" && state_id !== undefined)
    query.set("state_id", String(state_id));
  if (city_id !== "" && city_id !== undefined)
    query.set("city_id", String(city_id));
  if (event_category_tags_id !== "" && event_category_tags_id !== undefined)
    query.set("event_category_tags_id", String(event_category_tags_id));
  if (ticketed_events !== "" && ticketed_events !== undefined)
    query.set("ticketed_events", String(ticketed_events));
  if (sortBy) query.set("sortBy", sortBy);
  if (sortOrder) query.set("sortOrder", sortOrder);

  const url = `/api/events/getAll?${query.toString()}`;
  return axiosInstance.get<IResponseList<IEvent>>(url);
}

export function useEvents(params: FetchEventsParams = {}) {
  const key = ["/api/events/getAll", params];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchEvents(params),
    select: (data) => data.data.data,
  });
}
