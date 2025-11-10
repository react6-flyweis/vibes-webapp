import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList, IResponse } from "@/types";

export type VendorBooking = {
  _id: string;
  vendor_event_book_id?: number;
  event_id?: number;
  vendor_id: number;
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
  vendor_price?: number;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateVendorBookingPayload = {
  Year: number;
  Month: number;
  Date_start: string;
  End_date: string;
  Start_time: string;
  End_time: string;
  User_availabil: string;
  user_id: number;
  Vendor_Category_id: number[];
  Event_id?: number;
  Status: boolean;
};

// Fetch vendor bookings for the current logged-in vendor
export const fetchMyVendorBookings = async () => {
  const res = await axiosInstance.get<IResponseList<VendorBooking>>(
    `/api/master/vendor-event-book/getByAuth`
  );
  return res.data;
};

export function useMyVendorBookingsQuery() {
  return useQuery<IResponseList<VendorBooking>, Error, VendorBooking[]>({
    queryKey: ["/api/master/vendor-event-book/getByAuth"],
    queryFn: fetchMyVendorBookings,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// Fetch all vendor bookings (for admin view)
export const fetchAllVendorBookings = async () => {
  const res = await axiosInstance.get<IResponseList<VendorBooking>>(
    `/api/master/vendor-event-book/getAll`
  );
  return res.data;
};

export function useAllVendorBookingsQuery() {
  return useQuery<IResponseList<VendorBooking>, Error, VendorBooking[]>({
    queryKey: ["/api/master/vendor-event-book/getAll"],
    queryFn: fetchAllVendorBookings,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// Create vendor booking
export function useCreateVendorBooking(options?: {
  onSuccess?: (data: IResponse<any>) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: (payload: CreateVendorBookingPayload) =>
      axiosInstance
        .post<IResponse<any>>("/api/vendor/bookings/create", payload)
        .then((res) => res.data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
