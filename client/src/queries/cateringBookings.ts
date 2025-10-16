import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type CreateCateringBookingPayload = {
  event_name: string;
  event_address: string;
  event_type_id: number;
  catering_marketplace_id: number;
  event_to_date: string;
  event_from_date: string;
  event_to_time: string;
  event_from_time: string;
  guest_count: number;
  amount: number;
};

export function useCreateCateringBooking(options?: {
  onSuccess?: (data: any) => void;
  onError?: (err: unknown) => void;
}): UseMutationResult<any, unknown, CreateCateringBookingPayload, unknown> {
  const mutation = useMutation<any, unknown, CreateCateringBookingPayload>({
    mutationFn: (payload: CreateCateringBookingPayload) =>
      apiRequest(
        "/api/master/catering-marketplace-booking/create",
        "POST",
        payload
      ),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  } as any);

  return mutation;
}
