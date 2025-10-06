import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type EventCategoryTag = {
  _id: string;
  name: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  event_category_tags_id?: number;
};

export const fetchEventCategoryTags = async (): Promise<EventCategoryTag[]> => {
  const resp = await apiRequest("/api/event-category-tags/getAll", "GET");
  // API returns { success, message, data: [...] }
  return (resp && resp.data) || [];
};

export function useEventCategoryTagsQuery() {
  return useQuery<EventCategoryTag[]>({
    queryKey: ["eventCategoryTags"],
    queryFn: fetchEventCategoryTags,
    staleTime: 1000 * 60 * 5,
  });
}
