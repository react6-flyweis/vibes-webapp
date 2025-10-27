import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

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
}

export interface IVibeBusinessActiveSubscriptionResponse {
  success: boolean;
  message?: string;
  data: IVibeBusinessActiveSubscription | null;
}

export async function fetchVibeBusinessActiveSubscription() {
  const url = "/api/master/vibe-business-plan-subscribed/getByAuth";
  return axiosInstance.get<IVibeBusinessActiveSubscriptionResponse>(url);
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
