import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface ICorporatePricingPlanItem {
  _id: string;
  MinBookingFee: number;
  PriceRangeMin: number;
  PriceRangeMax: number;
  isDeposit: boolean;
  PaymentMethods: number[];
  Status: boolean;
  CreateBy: number;
  CreateAt: string;
  UpdatedBy: number | null;
  UpdatedAt: string | null;
  PricingPlans_id: number;
  created_by_details?: {
    user_id: number;
    name: string;
    email: string;
  };
  payment_methods_details?: Array<{
    payment_methods_id: number;
    payment_method: string;
    emoji?: string;
    status: boolean;
  }>;
}

export async function fetchCorporatePricingPlans() {
  const url = `/api/vendor/corporate-dashboard-pricing-plans/getAll`;
  return axiosInstance.get(url);
}

export function useCorporatePricingPlans(options?: { enabled?: boolean }) {
  const key = ["/api/vendor/corporate-dashboard-pricing-plans/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchCorporatePricingPlans(),
    enabled: options?.enabled ?? true,
    select: (res: any) => res.data.data as ICorporatePricingPlanItem[],
  });
}
