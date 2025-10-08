import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type EventAmenity = {
  _id: string;
  name: string;
  image?: string | null;
  emoji?: string | null;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  event_amenities_id?: number | null;
};

export const fetchEventAmenities = async () => {
  const res = await axiosInstance.get<IResponseList<EventAmenity>>(
    "/api/admin/event-amenities/getAll"
  );
  return res.data;
};

export function useEventAmenitiesQuery() {
  return useQuery({
    queryKey: ["/api/admin/event-amenities/getAll"],
    queryFn: fetchEventAmenities,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}
