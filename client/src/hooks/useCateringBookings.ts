import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type CateringBooking = {
  _id: string;
  catering_marketplace_id?: number;
  event_id?: number;
  event_to_date?: string;
  event_from_date?: string;
  event_to_time?: string;
  event_from_time?: string;
  guest_count?: number;
  total_amount?: number;
  transaction_id?: number | null;
  transaction_status?: string | null;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
  catering_marketplace_booking_id?: number;
};

export function useCateringBookings() {
  return useQuery({
    queryKey: [
      "/api/master/catering-marketplace-booking/CateringBookingsByAuth",
    ],
    queryFn: async () => {
      const res = await axiosInstance.get<IResponseList<CateringBooking>>(
        "/api/master/catering-marketplace-booking/CateringBookingsByAuth"
      );
      return res.data;
    },
    select: (data) => {
      return data?.data;
    },
  });
}

export default useCateringBookings;
