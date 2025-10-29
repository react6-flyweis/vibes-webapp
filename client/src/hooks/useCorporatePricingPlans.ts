import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IPricingPlanItem {
  _id: string;
  MinBookingFee: number;
  PriceRangeMin: number;
  PriceRangeMax: number;
  isDeposit: boolean;
  PaymentMethods: number[];
  Status: boolean;
  CreateBy?: number;
  CreateAt?: string;
  UpdatedBy?: number | null;
  UpdatedAt?: string | null;
  PricingPlans_id?: number;
  created_by_details?: any;
  payment_methods_details?: any[];
}

export interface ICorporatePricingPlansResponse {
  success: boolean;
  message: any;
  data: IPricingPlanItem[];
  pagination?: any;
  timestamp?: string;
}

export async function fetchCorporatePricingPlans() {
  const url = `/api/vendor/corporate-dashboard-pricing-plans/getAll`;
  return axiosInstance.get<ICorporatePricingPlansResponse>(url);
}

export function useCorporatePricingPlans() {
  const key = ["/api/vendor/corporate-dashboard-pricing-plans/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchCorporatePricingPlans(),
    select: (res) => res.data.data as IPricingPlanItem[],
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}
