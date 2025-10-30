import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type EventGalleryPhoto = {
  name?: string;
  photo?: string;
  _id?: string;
};

export type EventGallery = {
  _id?: string;
  event_gallery_name?: string;
  event_gallery_photo?: EventGalleryPhoto[];
  event_gallery_id?: number;
};

export const fetchEventGalleryById = async (id?: string | number | null) => {
  if (!id) return null;
  const res = await axiosInstance.get<IResponse<EventGallery>>(
    `/api/master/event-gallery/getEventGalleryById/${id}`
  );
  return res.data;
};

export function useEventGalleryByIdQuery(id?: string | number | null) {
  return useQuery({
    queryKey: [`/api/master/event-gallery/getEventGalleryById/${id}`],
    queryFn: () => fetchEventGalleryById(id),
    enabled: !!id,
    select: (data) => data?.data,
  });
}
