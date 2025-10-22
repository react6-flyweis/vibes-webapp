import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IVendorOverviewData {
  totalLeadsLastMonth: number;
  activeLeads: number;
  conversionRate: number;
  avgTimeToConvert: number;
}

export interface IVendorOverviewResponse {
  success: boolean;
  message: string;
  data: IVendorOverviewData;
  timestamp?: string;
}

export async function fetchVendorOverview() {
  const url = `/api/vendor/overview/overview`;
  return axiosInstance.get<IVendorOverviewResponse>(url);
}

export function useVendorOverview() {
  const key = ["/api/vendor/overview/overview"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorOverview(),
    // select to return the inner data for easier consumption
    select: (res) => res.data.data as IVendorOverviewData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
