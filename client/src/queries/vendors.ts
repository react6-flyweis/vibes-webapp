import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface CountryDetails {
  _id: string;
  name: string;
  status: boolean;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  country_id: number;
}

export interface StateDetails {
  _id: string;
  name: string;
  country_id: number;
  status: boolean;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  state_id: number;
}

export interface CityDetails {
  _id: string;
  name: string;
  state_id: number;
  country_id: number;
  status: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  city_id: number;
}

export interface RoleDetails {
  _id: string;
  name: string;
  emoji?: string;
  status: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  role_id: number;
}

export interface BusinessCategoryDetails {
  _id: string;
  business_category: string;
  business_type_id: number;
  emoji?: string;
  status: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  business_category_id: number;
}

export interface BusinessTypeDetails {
  _id: string;
  business_type?: string;
  business_type_id?: number;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface BankDetails {
  _id: string;
  name?: string;
  branch?: string;
  status?: boolean;
}

export interface UserSummary {
  _id: string;
  name?: string;
  email?: string;
  user_id?: number;
}

export interface IVendor {
  _id: string;
  name: string;
  email: string;
  agreePrivacyPolicy: boolean;
  country_id: number;
  state_id: number;
  city_id: number;
  role_id: number;
  Fixed_role_id: number;
  online_status: boolean;
  business_name?: string | null;
  business_category_id?: number | null;
  status: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_on: string;
  updated_on: string;
  user_id: number;
  country_details?: CountryDetails | null;
  state_details?: StateDetails | null;
  city_details?: CityDetails | null;
  role_details?: RoleDetails | null;
  fixed_role_details?: RoleDetails | null;
  business_category_details?: BusinessCategoryDetails | null;
  business_type_details?: BusinessTypeDetails | null;
  bank_name_details?: BankDetails | null;
  bank_branch_details?: BankDetails | null;
  created_by_user?: UserSummary | null;
  updated_by_user?: UserSummary | null;
}

// New vendor interface from onboarding portal API
export interface IVendorOnboarding {
  _id: string;
  Vendor_id: number;
  Basic_information_business_name: string;
  Basic_information_LegalName: string;
  Basic_information_Email: string;
  Basic_information_phone: string;
  Basic_information_Business_Description: string;
  Basic_information_BusinessAddress: string;
  Basic_information_ZipCode: string;
  service_areas_locaiton: string;
  service_areas_Regions: string;
  service_areas_pincode: string;
  service_areas_workingHoures: string;
  service_categories: Array<{
    category_id: number;
    category_name: string;
    pricing: number;
    pricing_currency: string;
    _id: string;
  }>;
  bank_branch_name_id: number | null;
  initial_payment_required: boolean;
  ifConfirm: boolean;
  Status: boolean;
  CreateBy: number;
  CreateAt: string;
  UpdatedBy: number | null;
  UpdatedAt: string;
  Vendor_Onboarding_Portal_id: number;
  vendor_details: {
    user_id: number;
    name: string;
    email: string;
    role_id: number;
  };
  created_by_details: {
    user_id: number;
    name: string;
    email: string;
  };
}

export async function fetchVendors(roleId: number = 3) {
  const url = `/api/users/getByRoleId/${roleId}`;
  return axiosInstance.get<IResponseList<IVendor>>(url);
}

export function useVendors(roleId: number = 3) {
  const key = ["/api/users/getByRoleId", roleId];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendors(roleId),
    // select the inner array for easier consumption in components
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// New function to fetch vendors from onboarding portal
export async function fetchPublicVendors() {
  const url = `/api/vendor/onboarding-portal/public/vendors`;
  return axiosInstance.get<{
    success: boolean;
    message: string;
    data: IVendorOnboarding[];
    timestamp: string;
  }>(url);
}

export function usePublicVendors() {
  const key = ["/api/vendor/onboarding-portal/public/vendors"];
  return useQuery({
    queryKey: key,
    queryFn: fetchPublicVendors,
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
