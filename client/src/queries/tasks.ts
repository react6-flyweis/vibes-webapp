import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";
import { useQuery } from "@tanstack/react-query";

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

export const tasksQueryKey = (eventId: string) =>
  [`/api/master/event-tasks/event/${eventId}`] as const;

async function fetchEventTasks(eventId: string) {
  const res = await axiosInstance.get<IResponseList<EventTask>>(
    `/api/master/event-tasks/event/${eventId}`
  );
  return res.data.data;
}

export function useEventTasks(eventId: string) {
  return useQuery({
    queryKey: tasksQueryKey(eventId),
    queryFn: () => fetchEventTasks(eventId),
    enabled: !!eventId,
  });
}
