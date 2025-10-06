import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export interface ServerEvent {
  _id: string;
  name_title: string;
  description?: string;
  venue_name?: string;
  street_address?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  event_category_tags_id?: number;
  tags?: string[];
  date?: string;
  time?: string;
  max_capacity?: number;
  event_image?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  ticketed_events?: boolean;
  event_id?: number;
}

export interface EventsResponse {
  success: boolean;
  message?: string;
  data: ServerEvent[];
}

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<EventsResponse> {
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
  return apiRequest<EventsResponse>(url, "GET");
}

export function useEvents(params: FetchEventsParams = {}) {
  const key = ["/api/events/getAll", params];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchEvents(params),
  });
}
