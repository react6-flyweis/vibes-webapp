import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

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

// Response shapes based on API response
export type CateringBookingItem = {
  _id?: string;
  catering_marketplace_id?: number;
  event_id?: number;
  event_to_date?: string;
  event_from_date?: string;
  event_to_time?: string;
  event_from_time?: string;
  guest_count?: number;
  transaction_id?: number | null;
  transaction_status?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
  catering_marketplace_booking_id?: number;
};

export type CateringBookingEvent = {
  name_title?: string;
  event_type_id?: number;
  ticketed_events?: boolean;
  description?: string;
  venue_details_id?: number;
  street_address?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  event_category_tags_id?: number;
  tags?: any[];
  date?: string;
  time?: string;
  max_capacity?: number;
  event_image?: string | null;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  _id?: string;
  created_at?: string;
  updated_at?: string | null;
  event_id?: number;
};

export type CateringBookingTransaction = {
  user_id?: number;
  amount?: number;
  status?: string;
  payment_method_id?: number;
  transactionType?: string;
  staff_event_book_id?: number | null;
  CGST?: number;
  SGST?: number;
  TotalGST?: number;
  metadata?: any;
  isDownloaded?: boolean;
  fileDownlodedPath?: string | null;
  created_by?: number;
  updated_by?: number | null;
  _id?: string;
  transaction_date?: string;
  created_at?: string;
  updated_at?: string | null;
  transaction_id?: number;
};

export type CreateCateringBookingResponse = IResponse<{
  booking: CateringBookingItem;
  event: CateringBookingEvent;
  transaction: CateringBookingTransaction;
}>;

export function useCreateCateringBooking(options?: {
  onSuccess?: (data: CreateCateringBookingResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const mutation = useMutation({
    mutationFn: (payload: CreateCateringBookingPayload) =>
      axiosInstance
        .post<CreateCateringBookingResponse>(
          "/api/master/catering-marketplace-booking/create",
          payload
        )
        .then((res) => res.data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return mutation;
}
