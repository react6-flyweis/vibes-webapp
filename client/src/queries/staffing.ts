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
export const fetchStaffByVendorId = async () => {
  const res = await axiosInstance.get<IResponseList<StaffUser>>(
    `/api/master/staff-event-book/getStaffByVendorId`
  );
  return res.data;
};

export function useStaffByVendorQuery(vendorId: number | null) {
  return useQuery<IResponseList<StaffUser>, Error, StaffUser[]>({
    queryKey: ["/api/master/staff-event-book/getStaffByVendorId"],
    queryFn: fetchStaffByVendorId,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}

// New: fetch all staff from master endpoint and normalize to StaffUser[]
export type RawMasterStaffItem = {
  staff_working_price_id: number;
  staff_id: number;
  staff_category_id: number | null;
  price: number;
  review_count: number;
  status: boolean;
  staff_info: {
    user_id: number;
    name: string;
    email?: string;
    mobile?: string;
    online_status?: boolean;
    status?: boolean;
    country_id?: number;
    state_id?: number;
    city_id?: number;
    business_name?: string;
    created_on?: string;
    updated_on?: string;
  };
  staff_category_info?: {
    staff_category_id: number;
    name: string;
  } | null;
};

export const fetchAllStaff = async () => {
  const res = await axiosInstance.get<{
    success: boolean;
    message: any;
    data: RawMasterStaffItem[];
    pagination?: any;
    timestamp?: string;
  }>(`/api/master/staff/getAll`);

  // normalize each item into StaffUser shape expected by UI
  const normalized: StaffUser[] = (res.data.data || []).map((item) => {
    const user = item.staff_info || ({} as any);
    const category = item.staff_category_info;

    const workingPrice: StaffWorkingPrice = {
      _id: String(item.staff_working_price_id),
      staff_id: item.staff_id,
      staff_category_id: item.staff_category_id ?? 0,
      price: item.price,
      review_count: item.review_count ?? 0,
      staff_working_price_id: item.staff_working_price_id,
      category_details: category
        ? {
            _id: String(category.staff_category_id),
            name: category.name,
            staff_category_id: category.staff_category_id,
          }
        : null,
    };

    const staffDetails: StaffDetails = {
      working_prices: [workingPrice],
      recent_bookings: [],
      total_working_prices: 1,
      total_bookings: 0,
    };

    const staffUser: StaffUser = {
      _id: String(user.user_id ?? item.staff_id),
      user_id: user.user_id ?? item.staff_id,
      name: user.name || "",
      email: user.email,
      mobile: user.mobile,
      online_status: user.online_status,
      status: user.status,
      country_id: user.country_id,
      state_id: user.state_id,
      city_id: user.city_id,
      staff_details: staffDetails,
    };

    return staffUser;
  });

  return {
    success: res.data.success,
    message: res.data.message,
    data: normalized,
    pagination: res.data.pagination,
    timestamp: res.data.timestamp,
  } as IResponseList<StaffUser>;
};

export function useAllStaffQuery() {
  return useQuery<IResponseList<StaffUser>, Error, StaffUser[]>({
    queryKey: [`/api/master/staff/getAll`],
    queryFn: fetchAllStaff,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
