import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

// Request payload for creating an event payment
export interface CreateEventPaymentPayload {
  amount: number;
  payment_method_id: number;
  billingDetails: string;
  event_id: number;
}

export interface PaymentIntent {
  id: string;
  clientSecret?: string | null;
  amount?: number;
  currency?: string;
  status?: string;
  [k: string]: any;
}

export interface CreateEventPaymentData {
  transaction_id?: number;
  payment_intent_id?: string;
  client_secret?: string;
  amount?: number;
  currency?: string;
  status?: string;
  paymentIntent?: PaymentIntent;
  [k: string]: any;
}

export function useCreateEventPayment() {
  return useMutation({
    mutationFn: async (payload: CreateEventPaymentPayload) => {
      return await axiosInstance.post<IResponse<CreateEventPaymentData>>(
        "/api/events/EventPayment",
        payload
      );
    },
  });
}

export default useCreateEventPayment;
