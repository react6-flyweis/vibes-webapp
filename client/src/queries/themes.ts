import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type EventTheme = {
  _id: string;
  event_theme_name: string;
  status: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  event_theme_id?: number;
};

export function useThemesQuery() {
  return useQuery({
    queryKey: ["eventThemes"],
    queryFn: () =>
      axiosInstance.get<IResponseList<EventTheme>>(
        "/api/master/event-theme/getAll"
      ),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  });
}
