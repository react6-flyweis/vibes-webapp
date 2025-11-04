import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";
import { IEvent } from "./useEvents";

export interface FetchMyEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function fetchMyEvents(params: FetchMyEventsParams = {}) {
  const query = new URLSearchParams();
  const {
    page = 1,
    limit = 20,
    search = "",
    sortBy = "created_at",
    sortOrder = "desc",
  } = params;

  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("search", String(search ?? ""));
  if (sortBy) query.set("sortBy", sortBy);
  if (sortOrder) query.set("sortOrder", sortOrder);

  const url = `/api/events/getByAuth?${query.toString()}`;
  return axiosInstance.get<IResponseList<IEvent>>(url);
}

export function useMyEvents(params: FetchMyEventsParams = {}) {
  const key = ["/api/events/getByAuth", params];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchMyEvents(params),
    select: (data) => data.data.data,
  });
}
