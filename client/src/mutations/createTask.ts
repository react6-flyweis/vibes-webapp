import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { tasksQueryKey } from "@/queries/tasks";

type TaskPayload = {
  event_id?: string | number;
  taskTitle?: string;
  title?: string; // accept either key if callers use different naming
  description?: string;
  status?: boolean;
  // [key: string]: any;
};

type UseCreateTaskOptions = {
  event_id?: string | number; // align with project's snake_case convention
  eventId?: string | number; // keep camelCase for convenience
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export function useCreateTask({
  event_id,
  eventId,
  onSuccess,
  onError,
}: UseCreateTaskOptions = {}) {
  const resolvedEventId = event_id ?? eventId;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: TaskPayload) =>
      axiosInstance.post("/api/master/event-tasks/create", taskData),
    onSuccess: (data) => {
      if (resolvedEventId) {
        queryClient.invalidateQueries({
          queryKey: [`/api/events/${resolvedEventId}/tasks`],
        });
        // also invalidate the event-tasks query used by useEventTasks
        queryClient.invalidateQueries({
          queryKey: tasksQueryKey(String(resolvedEventId)),
        });
      }

      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
