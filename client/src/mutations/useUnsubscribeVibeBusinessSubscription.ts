import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export function useUnsubscribeVibeBusinessSubscription(options?: {
  onSuccess?: (data: any) => void;
  onError?: (err: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const url = `/api/master/vibe-business-plan-subscribed/delete/${id}`;
      const res = await axiosInstance.delete(url);
      return res.data;
    },
    onSuccess(data) {
      // invalidate the active subscription query so UI refreshes
      queryClient.invalidateQueries({
        queryKey: ["/api/master/vibe-business-plan-subscribed/getByAuth"],
      });
      options?.onSuccess?.(data);
    },
    onError(err) {
      options?.onError?.(err);
    },
  });
}
