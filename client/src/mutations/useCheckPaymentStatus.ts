import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export interface CheckPaymentStatusPayload {
  payment_intent_id: string;
}

export interface CheckPaymentStatusData {
  // keep flexible — backend may return shape like { status: 'succeeded', ... }
  status?: string;
  [k: string]: any;
}

/**
 * Polls the backend for payment status every 1 second when enabled.
 *
 * Usage: const q = useCheckPaymentStatus(paymentIntentId, { enabled: !!paymentIntentId });
 */
export function useCheckPaymentStatus(
  payment_intent_id?: string | null,
  enabled = false
) {
  return useQuery({
    queryKey: ["checkPaymentStatus", payment_intent_id],
    queryFn: async () => {
      if (!payment_intent_id) throw new Error("payment_intent_id is required");
      const payload: CheckPaymentStatusPayload = { payment_intent_id };
      return await axiosInstance.post<IResponse<CheckPaymentStatusData>>(
        "/api/master/event-entry-tickets-order/check-payment-status",
        payload
      );
    },
    enabled: !!payment_intent_id && enabled,
    // Poll every 1000ms (1 second)
    refetchInterval: enabled ? 1000 : false,
    // Do not retry failed requests; let caller handle errors
    retry: false,
  });
}
