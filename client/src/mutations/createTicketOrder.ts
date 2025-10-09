import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type CreateTicketOrderPayload = {
  event_id: number | string;
  tax_percentage?: number;
  coupon_code?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  promo_code?: string | null;
  loyalty_points?: boolean | number;
  // optionally include tickets and other fields if backend expects them
  tickets?: Array<{
    event_entry_tickets_id: number | string;
    quantity: number;
  }>;
};

export type TicketBreakdownItem = {
  ticket_type_id: number;
  ticket_title: string;
  quantity: number;
  price_per_ticket: number;
  item_subtotal: number;
};

export type CouponApplied = {
  code: string;
  name: string; // e.g. 'percentage' or 'fixed'
  discount_value: number;
  applied_discount: number;
};

export type CalculationDetails = {
  total_quantity: number;
  ticket_breakdown: TicketBreakdownItem[];
  subtotal: number;
  tax_percentage: number;
  tax_amount: number;
  total_before_discount: number;
  coupon_applied?: CouponApplied | null;
  discount_amount: number;
  final_amount: number;
};

export type CreatedTicketOrderResponse = {
  event_entry_userget_tickets_id: number;
  event_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  tax: number;
  total: number;
  coupon_code_id?: number | null;
  discount_amount: number;
  final_amount: number;
  status: boolean;
  createdBy: number;
  updatedBy?: number | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  event_entry_tickets_order_id: number;
  calculation_details: CalculationDetails;
};

type UseCreateTicketOrderOptions = {
  onSuccess?: (data: CreatedTicketOrderResponse) => void;
  onError?: (err: any) => void;
};

export function useCreateTicketOrder({
  onSuccess,
  onError,
}: UseCreateTicketOrderOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTicketOrderPayload) => {
      try {
        const res = await axiosInstance.post<
          IResponse<CreatedTicketOrderResponse>
        >("/api/master/event-entry-tickets-order/create", payload);
        return res.data.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate event-related queries so UI refreshes if needed
      if (variables && (variables as any).event_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "/api/master/event-entry-tickets/all",
            (variables as any).event_id,
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["/api/master/event-entry-tickets/all"],
        });
      }
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
