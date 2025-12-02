import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IBankName {
  _id?: string;
  bank_name: string;
  emoji?: string | null;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  bank_name_id: number;
}

export async function fetchBankNames() {
  const url = "/api/admin/bank-names/getAll";
  return axiosInstance.get<IResponseList<IBankName>>(url);
}

export function useBankNames() {
  const key = ["/api/admin/bank-names/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchBankNames(),
    select: (data) => data.data.data,
  });
}
