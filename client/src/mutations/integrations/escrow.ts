import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import {
  EscrowTransactionRequest,
  EscrowTransactionResponse,
} from "@/types/escrow";
import { IResponse } from "@/types";

export async function createEscrowTransaction(
  payload: EscrowTransactionRequest
) {
  const url = `/api/integrations/escrow/transactions`;
  const res: AxiosResponse = await axiosInstance.post<
    IResponse<EscrowTransactionResponse>
  >(url, payload);
  return res.data;
}

export function useCreateEscrowTransaction(options?: {
  onSuccess?: (data: IResponse<EscrowTransactionResponse>) => void;
  onError?: (err: any) => void;
}) {
  return useMutation({
    mutationFn: (payload: EscrowTransactionRequest) =>
      createEscrowTransaction(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
