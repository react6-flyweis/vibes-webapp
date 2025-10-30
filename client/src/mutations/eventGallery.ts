import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { EventGallery } from "@/queries/eventGallery";

type UseOptions = {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export function useCreateEventGallery({ onSuccess, onError }: UseOptions = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form: FormData) => {
      try {
        const res = await axiosInstance.post<{ data: EventGallery }>(
          "/api/master/event-gallery/create",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      // invalidate gallery list/cache as needed
      const newId =
        data?.data?.event_gallery_id ?? data?.data?._id ?? undefined;
      if (newId) {
        qc.invalidateQueries({
          queryKey: [`/api/master/event-gallery/getEventGalleryById/${newId}`],
        });
      }
      qc.invalidateQueries({ queryKey: ["/api/master/plan-event-map/event/"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}

export function useUpdateEventGallery({ onSuccess, onError }: UseOptions = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form: FormData) => {
      try {
        const res = await axiosInstance.post<{ data: EventGallery }>(
          "/api/master/event-gallery/updateEventGalleryById",
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      const id = data?.data?.event_gallery_id ?? data?.data?._id ?? undefined;
      if (id)
        qc.invalidateQueries({
          queryKey: [`/api/master/event-gallery/getEventGalleryById/${id}`],
        });
      qc.invalidateQueries({ queryKey: ["/api/master/plan-event-map/event/"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
