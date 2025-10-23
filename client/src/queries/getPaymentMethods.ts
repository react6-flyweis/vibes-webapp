import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IPaymentMethodItem {
  _id: string;
  payment_method: string;
  emoji?: string;
  status: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  payment_methods_id: number;
}

export async function fetchPaymentMethods() {
  const url = `/api/admin/payment-methods/getAll`;
  return axiosInstance.get<IResponseList<IPaymentMethodItem>>(url);
}

export function usePaymentMethods() {
  const key = ["/api/admin/payment-methods/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchPaymentMethods(),
    select: (res) => res.data.data,
  });
}
