import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type CreateStaffBookingPayload = {
  event_id?: string | number;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  event_type_id?: number | string;
  staff_id?: number | string;
  event_name?: string;
  event_address?: string;
  no_of_guests?: number | string;
  special_instruction?: string;
  transaction_status?: string;
  transaction_id?: string | null;
  status?: boolean;
  // optional: raw payment info
  payment?: any;
};

export interface StaffEventBooking {
  event_id?: number;
  dateTo?: string;
  dateFrom?: string;
  timeTo?: string;
  timeFrom?: string;
  event_type_id?: number;
  staff_id?: number | string;
  event_name?: string;
  event_address?: string;
  no_of_guests?: number | string;
  special_instruction?: string;
  transaction_status?: string;
  transaction_id?: string | null;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  _id?: string;
  created_at?: string;
  updated_at?: string;
  staff_event_book_id?: number;
  staff_price?: number;
}

export type CreateStaffBookingResponse = IResponse<StaffEventBooking>;

export async function createStaffBooking(
  payload: CreateStaffBookingPayload
): Promise<CreateStaffBookingResponse> {
  const res = await axiosInstance.post<CreateStaffBookingResponse>(
    "/api/master/staff-event-book/create",
    payload
  );
  return res.data;
}

export function useCreateStaffBookingMutation(options?: {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStaffBookingPayload) =>
      createStaffBooking(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/staffing/members"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
}
