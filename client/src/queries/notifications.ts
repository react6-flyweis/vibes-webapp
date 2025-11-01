import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type NotificationItem = {
  _id: string;
  notification_type_id: number;
  notification_txt: string;
  user_id: number;
  is_read: boolean;
  status: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  notification_id: number;
};

export const fetchNotifications = async () => {
  const res = await axiosInstance.get<IResponseList<NotificationItem>>(
    "/api/admin/notifications/getByAuth"
  );
  return res.data;
};

export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: ["/api/admin/notifications/getByAuth"],
    queryFn: () => fetchNotifications(),
    enabled,
  });
}
