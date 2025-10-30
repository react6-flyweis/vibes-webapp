import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";
import {
  PaymentIntent,
  Transaction,
  Order,
} from "@/mutations/useCreateEntryTicketsPayment";

export interface CreateStaffBookingPaymentPayload {
  staff_event_book_id: number;
  payment_method_id?: number;
  billingDetails?: string;
  // optional fields used by callers
  payment_intent_id?: string | number;
  payment?: any;
  finalize?: boolean;
}

export interface CreateStaffBookingPaymentData {
  paymentIntent: PaymentIntent;
  transaction?: Transaction;
  order?: Order;
  [k: string]: any;
}

export function useCreateStaffBookingPayment() {
  return useMutation({
    mutationFn: async (payload: CreateStaffBookingPaymentPayload) => {
      return await axiosInstance.post<IResponse<CreateStaffBookingPaymentData>>(
        "/api/master/staff-event-book/StaffBookingPayment",
        payload
      );
    },
  });
}
