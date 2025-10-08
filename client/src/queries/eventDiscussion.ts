import { axiosInstance } from "@/lib/queryClient";

export type ChatMessage = {
  _id: string;
  event_id: number;
  user_id: number;
  message: string;
  message_type: string;
  reply_to: string | null;
  is_edited: boolean;
  edited_at: string | null;
  status: boolean;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  id: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

/**
 * Fetch event discussion messages for an event.
 * Returns messages sorted newest -> oldest (descending by createdAt).
 */
export async function fetchEventDiscussionMessages(
  eventId?: string | number
): Promise<ChatMessage[]> {
  if (!eventId) return [];

  const res = await axiosInstance.get<ApiResponse<ChatMessage[]>>(
    `/api/master/event-discussion-chat/event/${eventId}`
  );

  const messages = res.data?.data || [];

  // ensure newest first (descending by createdAt)
  messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return messages;
}
