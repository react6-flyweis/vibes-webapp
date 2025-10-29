import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export interface IClientByIndustry {
  _id: string;
  count: number;
  avgEmployeeCount?: number;
}

export interface IPricingPlansStats {
  _id?: any;
  totalPlans: number;
  avgMinBookingFee: number;
  avgPriceRangeMin: number;
  avgPriceRangeMax: number;
}

export interface IRecentTransaction {
  _id: string;
  user_id: number;
  amount: number;
  transactionType: string;
  transaction_date: string;
  reference_number?: string;
}

export interface IRevenueByType {
  _id: string;
  totalRevenue: number;
  transactionCount: number;
}

export interface ICorporateDashboardData {
  totalClients: number;
  monthlyRevenue: number;
  eventsThisMonth: number;
  growthRate: number;
  clientStats: {
    byIndustry: IClientByIndustry[];
    totalClients: number;
  };
  pricingPlansStats: IPricingPlansStats;
  recentTransactions: IRecentTransaction[];
  revenueByType: IRevenueByType[];
  period?: any;
}

export async function fetchCorporateDashboard() {
  const url = `/api/vendor/corporate-dashboard/`;
  return axiosInstance.get<IResponse<ICorporateDashboardData>>(url);
}

export function useCorporateDashboard() {
  const key = ["/api/vendor/corporate-dashboard/"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchCorporateDashboard(),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 1,
  });
}
