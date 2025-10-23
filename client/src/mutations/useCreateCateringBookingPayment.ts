import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export interface CreateCateringBookingPaymentPayload {
  catering_marketplace_booking_id: number;
  payment_method_id: number;
  billingDetails: string;
}

export interface CreateCateringBookingPaymentData {
  paymentIntent: any;
  transaction?: any;
  order?: any;
  [k: string]: any;
}

export function useCreateCateringBookingPayment() {
  return useMutation({
    mutationFn: async (payload: CreateCateringBookingPaymentPayload) => {
      return await axiosInstance.post<
        IResponse<CreateCateringBookingPaymentData>
      >(
        "/api/master/catering-marketplace-booking/CateringBookingPayment",
        payload
      );
    },
  });
}
