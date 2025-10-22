import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IRecentActivity {
  id: string | number;
  title: string;
  channel?: string;
  date?: string;
  status?: string;
}

export interface IVendorRecentActivitiesResponse {
  success: boolean;
  message: string;
  data: IRecentActivity[];
  timestamp?: string;
}

export async function fetchVendorRecentActivities() {
  const url = `/api/vendor/overview/recent-activities`;
  return axiosInstance.get<IVendorRecentActivitiesResponse>(url);
}

export function useVendorRecentActivities() {
  const key = ["/api/vendor/overview/recent-activities"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorRecentActivities(),
    select: (res) => res.data.data as IRecentActivity[],
    staleTime: 1000 * 60 * 1,
  });
}
