import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface ICorporateClientItem {
  _id: string;
  CompanyName: string;
  industry: string;
  EmployeeCount: number;
  ContactEmail: string;
  Plan_id: number;
  Status: boolean;
  CreateBy?: number;
  CreateAt?: string;
  UpdatedBy?: number | null;
  UpdatedAt?: string | null;
  Client_id?: number;
  created_by_details?: {
    user_id: number;
    name: string;
    email: string;
  };
  plan_details?: any;
}

export async function fetchCorporateClients() {
  const url = `/api/vendor/corporate-dashboard-client/getAll`;
  return axiosInstance.get<IResponseList<ICorporateClientItem>>(url);
}

export function useCorporateClients(options?: { enabled?: boolean }) {
  const key = ["/api/vendor/corporate-dashboard-client/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchCorporateClients(),
    enabled: options?.enabled ?? true,
    select: (res) => res.data.data,
  });
}
