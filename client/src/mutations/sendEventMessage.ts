import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

type SendMessagePayload = {
  message: string;
  event_id?: string | number;
  status?: boolean;
  [key: string]: any;
};

type UseSendEventMessageOptions = {
  event_id?: string | number;
  eventId?: string | number;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export function useSendEventMessage({
  event_id,
  eventId,
  onSuccess,
  onError,
}: UseSendEventMessageOptions = {}) {
  const resolvedEventId = event_id ?? eventId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendMessagePayload) =>
      axiosInstance.post(`/api/master/event-discussion-chat/create`, payload),
    onSuccess: (data) => {
      if (resolvedEventId) {
        queryClient.invalidateQueries({
          queryKey: [
            `/api/master/event-discussion-chat/event/${resolvedEventId}`,
          ],
        });
      }
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
