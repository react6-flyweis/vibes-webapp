import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";
import { EscrowTransactionResponse } from "@/types/escrow";

export const fetchEscrowTransactions = async (
  page: number = 1,
  limit: number = 25
) => {
  const url = `/api/integrations/escrow/transactions?page=${page}&limit=${limit}`;
  const res = await axiosInstance.get<IResponseList<EscrowTransactionResponse>>(
    url
  );
  return res.data;
};

export function useEscrowTransactions({
  page = 1,
  limit = 25,
  enabled = true,
}: {
  page?: number;
  limit?: number;
  enabled?: boolean;
} = {}) {
  const key = ["/api/integrations/escrow/transactions", page, limit];
  return useQuery<
    IResponseList<EscrowTransactionResponse>,
    Error,
    EscrowTransactionResponse[]
  >({
    queryKey: key,
    queryFn: () => fetchEscrowTransactions(page, limit),
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export default {} as const;
