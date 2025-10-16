import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateStaffBookingPayload = {
  event_id?: number;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  event_type_id?: number;
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

export async function createStaffBooking(payload: CreateStaffBookingPayload) {
  const res = await axiosInstance.post(
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
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/staffing/members"] });
      options?.onSuccess?.(data);
    },
    onError: (err: any) => {
      options?.onError?.(err);
    },
  });
}
