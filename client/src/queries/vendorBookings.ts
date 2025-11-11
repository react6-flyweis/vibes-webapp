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

// New type for the vendor bookings from /api/vendor/bookings/getByAuth
export type VendorBookingDetails = {
  _id: string;
  Year: number;
  Month: number;
  Date_start: string;
  End_date: string;
  User_availabil: string;
  Start_time: string;
  End_time: string;
  user_id: number;
  Vendor_Category_id: number[];
  Event_id: number | null;
  vender_booking_status: string;
  Status: boolean;
  CreateBy: number;
  CreateAt: string;
  UpdatedBy: number | null;
  UpdatedAt: string;
  Vendor_Booking_id: number;
  vendor_category_details: Array<{
    _id: string;
    category_name: string;
    emozi: string;
    status: boolean;
    created_by: number;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    category_id: number;
  }>;
  created_by_details: {
    _id: string;
    name: string;
    email: string;
    user_id: number;
  };
  event_details?: {
    Event_type: string;
    EntryPrice: number;
    _id: string;
    name_title: string;
    event_type_id: number;
    ticketed_events: boolean;
    description: string;
    venue_name: string;
    street_address: string;
    country_id: number;
    state_id: number;
    city_id: number;
    event_category_tags_id: number;
    tags: string[];
    date: string;
    time: string;
    max_capacity: number;
    event_image: string;
    status: boolean;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    event_id: number;
    venue_details_id: number;
  };
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

// Fetch vendor bookings with pagination for authenticated vendor
export const fetchVendorBookingsByAuth = async (
  page: number = 1,
  limit: number = 10
) => {
  const res = await axiosInstance.get<IResponseList<VendorBookingDetails>>(
    `/api/vendor/bookings/getByAuth?page=${page}&limit=${limit}`
  );
  return res.data;
};

export function useVendorBookingsByAuth(page: number = 1, limit: number = 10) {
  return useQuery<IResponseList<VendorBookingDetails>, Error>({
    queryKey: ["/api/vendor/bookings/getByAuth", page, limit],
    queryFn: () => fetchVendorBookingsByAuth(page, limit),
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

// Cancel vendor booking mutation
export function useCancelVendorBooking(options?: {
  onSuccess?: (data: IResponse<any>) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationFn: (bookingId: number) =>
      axiosInstance
        .patch<IResponse<any>>(`/api/vendor/bookings/${bookingId}/cancel`)
        .then((res) => res.data),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
