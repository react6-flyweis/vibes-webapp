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

// Category details interface
export interface CategoryDetails {
  category_id: number;
  category_name: string;
  emozi?: string;
  status: boolean;
}

// Categories fees details interface
export interface CategoriesFeesDetails {
  _id: string;
  category_id: number;
  pricing_currency: string;
  PlatformFee: number;
  Price: number;
  MinFee: number;
  status: boolean;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  categories_fees_id: number;
  category_details: CategoryDetails;
}

// Bank branch details interface
export interface BankBranchDetails {
  _id: string;
  bank_branch_name: string;
  bank_name_id: number;
  holderName: string;
  upi: string | null;
  ifsc: string;
  accountNo: string;
  address: string;
  zipcode: string;
  status: boolean;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  bank_branch_name_id: number;
}

// Business information details interface
export interface BusinessInformationDetails {
  _id: string;
  vendor_id: number;
  business_name: string;
  Basic_information_LegalName: string;
  business_email: string;
  description: string;
  Basic_information_Business_Description: string;
  business_phone: string;
  Basic_information_BusinessAddress: string;
  Basic_information_ZipCode: string;
  vendor_categories: any[];
  service_areas_locaiton: string;
  service_areas_Regions: string;
  service_areas_pincode: string;
  service_areas_workingHoures: string;
  willing_to_travel: boolean;
  service_days: any[];
  deposit_required_for_bookings: boolean;
  payment_methods: any[];
  approval_by_admin: boolean;
  status: boolean;
  created_by: number;
  updated_by: number | null;
  term_verification: any[];
  created_at: string;
  updated_at: string;
  business_information_id: number;
}

// Vendor details interface (user info)
export interface VendorDetails {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
}

// New vendor interface from onboarding portal API (updated structure)
export interface IVendorOnboarding {
  _id: string;
  Vendor_id: number;
  business_information_id: number;
  bank_branch_name_id: number;
  categories_fees_id: number[];
  initial_payment_required: boolean;
  ifConfirm: boolean;
  Status: boolean;
  CreateBy: number;
  CreateAt: string;
  UpdatedBy: number | null;
  UpdatedAt: string;
  Vendor_Onboarding_Portal_id: number;
  vendor_details: VendorDetails;
  created_by_details: VendorDetails;
  bank_branch_details: BankBranchDetails;
  business_information_details: BusinessInformationDetails;
  categories_fees_details: CategoriesFeesDetails[];

  // Computed properties for backward compatibility
  Basic_information_business_name?: string;
  Basic_information_LegalName?: string;
  Basic_information_Email?: string;
  Basic_information_phone?: string;
  Basic_information_Business_Description?: string;
  Basic_information_BusinessAddress?: string;
  Basic_information_ZipCode?: string;
  service_areas_locaiton?: string;
  service_areas_Regions?: string;
  service_areas_pincode?: string;
  service_areas_workingHoures?: string;
  service_categories?: Array<{
    category_id: number;
    category_name: string;
    pricing: number;
    pricing_currency: string;
    _id: string;
  }>;
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

// Transform nested vendor data to flat structure for backward compatibility
function transformVendorData(vendor: IVendorOnboarding): IVendorOnboarding {
  const business = vendor.business_information_details;
  const categories = vendor.categories_fees_details;

  return {
    ...vendor,
    // Flatten business information for easier access
    Basic_information_business_name: business.business_name,
    Basic_information_LegalName: business.Basic_information_LegalName,
    Basic_information_Email: business.business_email,
    Basic_information_phone: business.business_phone,
    Basic_information_Business_Description:
      business.Basic_information_Business_Description,
    Basic_information_BusinessAddress:
      business.Basic_information_BusinessAddress,
    Basic_information_ZipCode: business.Basic_information_ZipCode,
    service_areas_locaiton: business.service_areas_locaiton,
    service_areas_Regions: business.service_areas_Regions,
    service_areas_pincode: business.service_areas_pincode,
    service_areas_workingHoures: business.service_areas_workingHoures,
    // Transform categories_fees_details to service_categories format
    service_categories: categories.map((cat) => ({
      _id: cat._id,
      category_id: cat.category_id,
      category_name: cat.category_details.category_name,
      pricing: cat.Price,
      pricing_currency: cat.pricing_currency,
    })),
  };
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
    select: (res) => {
      // Transform each vendor to flatten the nested structure
      return res.data.data.map(transformVendorData);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
