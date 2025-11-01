import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type StaffBooking = {
  _id: string;
  event_id?: number;
  dateTo?: string;
  dateFrom?: string;
  timeTo?: string;
  timeFrom?: string;
  event_type_id?: number;
  staff_id?: number;
  event_name: string;
  event_address?: string;
  no_of_guests?: number;
  special_instruction?: string;
  transaction_status?: string | null;
  transaction_id?: number | null;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
  staff_event_book_id?: number;
};

export function useStaffBookings() {
  return useQuery({
    queryKey: ["/api/master/staff-event-book/getByAuth"],
    queryFn: async () => {
      const res = await axiosInstance.get<IResponseList<StaffBooking>>(
        "/api/master/staff-event-book/getByAuth"
      );
      return res.data;
    },
    select: (data) => {
      return data?.data;
    },
  });
}

export default useStaffBookings;
