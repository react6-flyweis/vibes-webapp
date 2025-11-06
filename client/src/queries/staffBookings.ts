import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type StaffBooking = {
  _id: string;
  staff_event_book_id?: number;
  event_id?: number;
  staff_id: number;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  event_type_id?: number;
  event_name?: string;
  event_address?: string;
  no_of_guests?: number;
  special_instruction?: string;
  transaction_status?: string;
  transaction_id?: string | null;
  staff_price?: number;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
};

// Fetch staff bookings for the current logged-in staff member
export const fetchMyStaffBookings = async () => {
  const res = await axiosInstance.get<IResponseList<StaffBooking>>(
    `/api/master/staff-event-book/getByAuth`
  );
  return res.data;
};

export function useMyStaffBookingsQuery() {
  return useQuery<IResponseList<StaffBooking>, Error, StaffBooking[]>({
    queryKey: ["/api/master/staff-event-book/getByAuth"],
    queryFn: fetchMyStaffBookings,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// Fetch all staff bookings (for vendor/admin view)
export const fetchAllStaffBookings = async () => {
  const res = await axiosInstance.get<IResponseList<StaffBooking>>(
    `/api/master/staff-event-book/getAll`
  );
  return res.data;
};

export function useAllStaffBookingsQuery() {
  return useQuery<IResponseList<StaffBooking>, Error, StaffBooking[]>({
    queryKey: ["/api/master/staff-event-book/getAll"],
    queryFn: fetchAllStaffBookings,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
