import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IPayout {
  _id: string;
  Vendor_id: number;
  amount: number;
  paymentType?: string;
  bank_branch_details?: any;
  event_details?: any;
  vendor_details?: any;
  CreateAt?: string;
  Vendor_Payout_id?: number;
  PendingAmount?: number;
  Status?: boolean;
}

export async function fetchPayouts(page = 1, limit = 10) {
  const url = `/api/master/vendor-payout/all?page=${page}&limit=${limit}`;
  return axiosInstance.get<IResponseList<IPayout>>(url);
}

export function usePayouts(page = 1, limit = 10) {
  const key = [
    `/api/master/vendor-payout/all?page=${page}&limit=${limit}`,
    page,
    limit,
  ];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchPayouts(page, limit),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 1,
  });
}
