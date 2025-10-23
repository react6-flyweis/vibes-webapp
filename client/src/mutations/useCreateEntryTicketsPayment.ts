import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

// Request payload for creating an entry tickets payment
export interface CreateEntryTicketsPaymentPayload {
  order_id: number;
  payment_method_id: number;
  billingDetails: string;
}

// Shapes for the API response (a subset based on the example response)
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface Transaction {
  user_id: number;
  amount: number;
  status: string;
  payment_method_id: number | null;
  transactionType?: string;
  reference_number?: string;
  transaction_id?: number;
  [k: string]: any;
}

export interface Order {
  _id: string;
  event_entry_userget_tickets_id?: number;
  event_id?: number;
  quantity?: number;
  price?: number;
  subtotal?: number;
  tax?: number;
  total?: number;
  final_amount?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  promo_code?: string | null;
  [k: string]: any;
}

export interface PaymentSummary {
  order_id: number;
  subtotal: number;
  tax: number;
  total_before_discount: number;
  discount_amount: number;
  final_amount: number;
  amount_paid: number;
  transaction_id: number;
  transaction_type: string;
  payment_status: string;
  reference_number: string;
  stripe_payment_intent_id?: string;
}

export interface CreateEntryData {
  paymentIntent: PaymentIntent;
  transaction: Transaction;
  order: Order;
  customer_id?: string;
  payment_summary?: PaymentSummary;
  [k: string]: any;
}

export function useCreateEntryTicketsPayment() {
  return useMutation({
    mutationFn: async (payload: CreateEntryTicketsPaymentPayload) => {
      return await axiosInstance.post<IResponse<CreateEntryData>>(
        "/api/master/event-entry-tickets-order/EntryTicketsPayments",
        payload
      );
    },
  });
}
