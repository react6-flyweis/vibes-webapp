import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";
import {
  PaymentIntent,
  Transaction,
  Order,
} from "@/mutations/useCreateEntryTicketsPayment";

export interface CreateVendorBookingPaymentPayload {
  vendor_booking_id: number;
  payment_method_id?: number;
  billingDetails?: string;
  // optional fields used by callers
  payment_intent_id?: string | number;
  payment?: any;
  finalize?: boolean;
}

export interface CreateVendorBookingPaymentData {
  paymentIntent: PaymentIntent;
  transaction?: Transaction;
  order?: Order;
  [k: string]: any;
}

export function useCreateVendorBookingPayment() {
  return useMutation({
    mutationFn: async (payload: CreateVendorBookingPaymentPayload) => {
      return await axiosInstance.post<
        IResponse<CreateVendorBookingPaymentData>
      >("/api/vendor/bookings/payment", payload);
    },
  });
}
