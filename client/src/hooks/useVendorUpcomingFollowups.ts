import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IUpcomingFollowup {
  id: string | number;
  name: string;
  category?: string;
  priority?: string;
}

export interface IVendorUpcomingFollowupsResponse {
  success: boolean;
  message: string;
  data: IUpcomingFollowup[];
  timestamp?: string;
}

export async function fetchVendorUpcomingFollowups() {
  const url = `/api/vendor/overview/upcoming-followups`;
  return axiosInstance.get<IVendorUpcomingFollowupsResponse>(url);
}

export function useVendorUpcomingFollowups() {
  const key = ["/api/vendor/overview/upcoming-followups"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorUpcomingFollowups(),
    select: (res) => res.data.data as IUpcomingFollowup[],
    staleTime: 1000 * 60 * 1,
  });
}
