import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export interface ConfirmPaymentPayload {
  payment_intent_id: string;
  payment_method_id: string;
}

export interface ConfirmPaymentData {
  // shape depends on backend response; keep flexible
  [k: string]: any;
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async (payload: ConfirmPaymentPayload) => {
      return await axiosInstance.post<IResponse<ConfirmPaymentData>>(
        "/api/master/event-entry-tickets-order/confirm-payment",
        payload
      );
    },
  });
}
