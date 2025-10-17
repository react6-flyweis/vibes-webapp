import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IVibeBusinessPlan {
  _id: string;
  planDuration: string;
  plan_name: string;
  price: number;
  description?: string;
  line_one?: string;
  line_two?: string;
  line_three?: string;
  line_four?: string;
  line_five?: string;
  line_six?: string;
  status?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
  plan_id?: number;
}

export interface IVibeBusinessResponse {
  success: boolean;
  message?: string;
  data: IVibeBusinessPlan[];
  pagination?: any;
  timestamp?: string;
}

export async function fetchVibeBusinessSubscriptions() {
  const url = "/api/master/vibe-business-subscription/all";
  return axiosInstance.get<IVibeBusinessResponse>(url);
}

export function useVibeBusinessSubscriptions() {
  const key = ["/api/master/vibe-business-subscription/all"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVibeBusinessSubscriptions(),
    select: (res) => res.data.data,
  });
}
