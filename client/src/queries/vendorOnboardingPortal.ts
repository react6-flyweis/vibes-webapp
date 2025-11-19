import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

// Type definitions based on the API response
export type VendorOnboardingPortal = {
  _id: string;
  Vendor_id: number;
  business_information_id?: number | null;
  bank_branch_name_id?: number | null;
  categories_fees_id?: number[];
  initial_payment_required?: boolean;
  ifConfirm?: boolean;
  Status?: boolean;
  CreateBy?: number;
  CreateAt?: string;
  UpdatedBy?: number | null;
  UpdatedAt?: string;
  Vendor_Onboarding_Portal_id: number;

  // Legacy fields (for older records)
  Basic_information_business_name?: string;
  Basic_information_LegalName?: string;
  Basic_information_Email?: string;
  Basic_information_phone?: string;
  Basic_information_Business_Description?: string;
  Basic_information_BusinessAddress?: string;
  Basic_information_City_id?: number;
  Basic_information_State_id?: number;
  Basic_information_ZipCode?: string;
  Basic_information_Country_id?: number;
  Document_Business_Regis_Certificate?: string;
  Document_GSTTaxCertificate?: string;
  Document_Pan?: string;
  Document_bankbook?: string;
  Document_IDproofOwner?: string;
  Document_TradeLicense?: string;
  KYC_fullname?: string;
  KYC_DoB?: string;
  KYC_GovtIdtype?: string;
  KYC_Idno?: string;
  KYC_Business_PanCard?: string;
  KYC_GSTNo?: string;
  KYC_UploadIdDocument?: string;
  KYC_photo?: string;
  service_areas_locaiton?: string;
  service_areas_Regions?: string;
  service_areas_pincode?: string;
  service_areas_workingHoures?: string;
  service_categories?: Array<{
    category_id: number;
    category_name?: string;
    pricing?: number;
    pricing_currency?: string;
    _id?: string;
  }>;
  Payment_Setup_HolderName?: string;
  Payment_Setup_BankName?: string;
  Payment_Setup_BranchName?: string;
  Payment_Setup_AccountNo?: string;
  Payment_Setup_Ifsc?: string;
  Payment_Setup_UPI?: string;
  CancellationCharges?: number;
  EscrowPayment?: boolean;

  // Populated details
  vendor_details?: {
    user_id: number;
    name: string;
    email: string;
    role_id: number;
  };
  created_by_details?: {
    user_id: number;
    name: string;
    email: string;
  };
  updated_by_details?: {
    user_id: number;
    name: string;
    email: string;
  };
  bank_branch_details?: {
    _id: string;
    bank_branch_name: string;
    bank_name_id: number;
    holderName: string;
    upi?: string | null;
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
  };
  business_information_details?: {
    _id: string;
    vendor_id: number;
    business_name: string;
    Basic_information_LegalName?: string;
    business_email: string;
    description?: string;
    Basic_information_Business_Description?: string;
    business_phone: string;
    Basic_information_BusinessAddress: string;
    Basic_information_City_id?: number;
    Basic_information_State_id?: number;
    Basic_information_ZipCode: string;
    Basic_information_Country_id?: number;
    Document_Business_Regis_Certificate?: string;
    Document_GSTTaxCertificate?: string;
    Document_Pan?: string;
    Document_bankbook?: string;
    Document_IDproofOwner?: string;
    Document_TradeLicense?: string;
    KYC_fullname?: string;
    KYC_DoB?: string;
    KYC_GovtIdtype?: string;
    KYC_Idno?: string;
    KYC_Business_PanCard?: string;
    KYC_GSTNo?: string;
    KYC_UploadIdDocument?: string;
    KYC_photo?: string;
    vendor_categories?: any[];
    service_areas_locaiton: string;
    service_areas_Regions?: string;
    service_areas_pincode: string;
    service_areas_workingHoures: string;
    willing_to_travel?: boolean;
    service_days?: any[];
    deposit_required_for_bookings?: boolean;
    payment_methods?: any[];
    approval_by_admin?: boolean;
    status: boolean;
    created_by: number;
    updated_by?: number | null;
    term_verification?: any[];
    created_at: string;
    updated_at: string;
    business_information_id: number;
  };
  categories_fees_details?: Array<{
    _id: string;
    category_id: number;
    pricing_currency: string;
    PlatformFee: number;
    Price: number;
    MinFee: number;
    status: boolean;
    created_by: number;
    updated_by?: number | null;
    created_at: string;
    updated_at: string;
    categories_fees_id: number;
    category_details?: {
      category_id: number;
      category_name: string;
      emozi: string;
      status: boolean;
    };
  }>;
};

export type VendorOnboardingPortalListResponse =
  IResponseList<VendorOnboardingPortal>;

export interface VendorOnboardingPortalParams {
  page?: number;
  limit?: number;
  Vendor_id?: number;
}

/**
 * Hook: useVendorOnboardingPortalList
 * Fetches vendor onboarding portal entries for a vendor
 */
export function useVendorOnboardingPortalList(
  params: VendorOnboardingPortalParams = {},
  enabled = true
) {
  const { page = 1, limit = 10, Vendor_id } = params;

  return useQuery<VendorOnboardingPortalListResponse>({
    queryKey: ["vendor-onboarding-portal", "list", { page, limit, Vendor_id }],
    queryFn: async () => {
      const response =
        await axiosInstance.get<VendorOnboardingPortalListResponse>(
          "/api/vendor/onboarding-portal/getAll",
          {
            params: {
              page,
              limit,
              Vendor_id,
            },
          }
        );
      return response.data;
    },
    enabled: enabled && !!Vendor_id,
  });
}

/**
 * Hook: useVendorOnboardingPortalById
 * Fetches a single vendor onboarding portal entry by Vendor_Onboarding_Portal_id
 */
export function useVendorOnboardingPortalById(
  portalId?: number,
  enabled = true
) {
  return useQuery<VendorOnboardingPortal>({
    queryKey: ["vendor-onboarding-portal", "detail", portalId],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        data: VendorOnboardingPortal;
      }>(`/api/vendor/onboarding-portal/${portalId}`);
      return response.data.data;
    },
    enabled: enabled && !!portalId,
  });
}
