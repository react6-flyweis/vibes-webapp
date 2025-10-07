import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

type UseCreateTaskOptions = {
  eventId?: string | number;
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export function useCreateTask({
  eventId,
  onSuccess,
  onError,
}: UseCreateTaskOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: any) =>
      axiosInstance.post("/api/master/event-tasks/create", taskData),
    onSuccess: (data) => {
      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${eventId}/tasks`],
        });
      }

      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
