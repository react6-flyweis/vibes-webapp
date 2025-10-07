import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// API response wrapper used by the server

export type EventTask = {
  _id: string;
  taskTitle: string;
  description?: string;
  image?: string;
  emozi?: string;
  confirmFinalGuestCount: boolean;
  confirmFinalGuestCount_date?: string | null;
  finalizeMusicPlaylist: boolean;
  finalizeMusicPlaylist_date?: string | null;
  setupDecorations: boolean;
  setupDecorations_date?: string | null;
  status: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  event_tasks_id?: number;
};

export const tasksQueryKey = (eventId: string | number) =>
  [`/api/events/${eventId}/tasks`] as const;

async function fetchEventTasks(eventId: string | number) {
  const res = await axiosInstance.get<IResponseList<EventTask>>(
    `/api/events/${eventId}/tasks`
  );
  return res.data.data;
}

export function useEventTasks(eventId?: string | number) {
  return useQuery({
    queryKey: tasksQueryKey(eventId ?? ""),
    queryFn: async () => fetchEventTasks(eventId as string | number),
    enabled: !!eventId,
  });
}
