import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

// Types based on the API sample provided
export type CountryDetails = {
  _id: string;
  name: string;
  status: boolean;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  country_id?: number;
};

export type StateDetails = {
  _id: string;
  name: string;
  country_id?: number;
  status?: boolean;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  state_id?: number;
};

export type CityDetails = {
  _id: string;
  name: string;
  state_id?: number;
  country_id?: number;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  city_id?: number;
};

export type RoleDetails = {
  _id: string;
  name: string;
  emoji?: string;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  role_id?: number;
};

export type StaffWorkingPrice = {
  _id: string;
  staff_id: number;
  staff_category_id: number;
  price: number;
  review_count?: number;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  staff_working_price_id?: number;
  category_details?: {
    _id: string;
    name: string;
    status?: boolean;
    created_by?: number | null;
    updated_by?: number | null;
    created_at?: string;
    updated_at?: string;
    staff_category_id?: number;
  } | null;
};

export type StaffDetails = {
  working_prices: StaffWorkingPrice[];
  recent_bookings: any[];
  total_working_prices: number;
  total_bookings: number;
};

export type StaffUser = {
  _id: string;
  name: string;
  mobile?: string;
  email?: string;
  agreePrivacyPolicy?: boolean;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  role_id?: number;
  Fixed_role_id?: number;
  online_status?: boolean;
  gender?: string;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_on?: string;
  updated_on?: string;
  user_id?: number;
  country_details?: CountryDetails | null;
  state_details?: StateDetails | null;
  city_details?: CityDetails | null;
  role_details?: RoleDetails | null;
  fixed_role_details?: RoleDetails | null;
  staff_details?: StaffDetails | null;
};

export const fetchStaffByRole = async (roleId = 4) => {
  const res = await axiosInstance.get<IResponseList<StaffUser>>(
    `/api/users/getByRoleId/${roleId}`
  );
  return res.data;
};

export function useStaffByRoleQuery(roleId = 4) {
  return useQuery<IResponseList<StaffUser>, Error, StaffUser[]>({
    queryKey: [`/api/users/getByRoleId/${roleId}`],
    queryFn: () => fetchStaffByRole(roleId),
    // res.data is IResponseList<StaffUser> so select to return the StaffUser[]
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// New: fetch staff by vendor id
export const fetchStaffByVendorId = async (vendorId: number) => {
  const res = await axiosInstance.get<IResponseList<StaffUser>>(
    `/api/master/staff-event-book/getStaffByVendorId?vendorId=${vendorId}`
  );
  return res.data;
};

export function useStaffByVendorQuery(vendorId: number | null) {
  return useQuery<IResponseList<StaffUser>, Error, StaffUser[]>({
    queryKey: vendorId
      ? [`/api/master/staff-event-book/getStaffByVendorId`, vendorId]
      : [`/api/master/staff-event-book/getStaffByVendorId`, "null"],
    queryFn: () => fetchStaffByVendorId(vendorId ?? 0),
    enabled: !!vendorId,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
