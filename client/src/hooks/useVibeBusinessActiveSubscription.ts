import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IVibeBusinessActiveSubscription {
  user_id?: number;
  plan_id?: number;
  transaction_id?: number;
  transaction_status?: string;
  start_plan_date?: string;
  end_plan_date?: string;
  status?: boolean;
  createdBy?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  vibe_business_plan_subscribed_id?: number;
  plan_details?: {
    plan_id?: number;
    plan_name?: string;
    description?: string;
    price?: number;
    status?: boolean;
  } | null;
  transaction_details?: {
    transaction_id?: number | string;
    amount?: number;
    status?: string;
    transaction_date?: string;
    reference_number?: string;
    payment_method_id?: number;
  } | null;
}

export async function fetchVibeBusinessActiveSubscription() {
  const url = "/api/master/vibe-business-plan-subscribed/getByAuth";
  return axiosInstance.get<IResponseList<IVibeBusinessActiveSubscription>>(url);
}

export function useVibeBusinessActiveSubscription() {
  const key = ["/api/master/vibe-business-plan-subscribed/getByAuth"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVibeBusinessActiveSubscription(),
    // return the data field (or null) to consumers
    select: (res) => res.data.data,
    // active subscription changes rarely during a session
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
