import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export default function useCreateEventMutation() {
  // Keep this hook minimal: expose mutate/mutateAsync and let callers handle
  // success/error side effects so they can react in the component where
  // navigation and toasts live.
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => axiosInstance.post("/api/events/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
  });
}
