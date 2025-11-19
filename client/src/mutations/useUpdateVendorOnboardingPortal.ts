import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { axiosInstance } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

/**
 * Request payload for updating vendor onboarding portal
 */
export interface UpdateVendorOnboardingPortalInput {
  Vendor_Onboarding_Portal_id: number;
  Vendor_id?: number;
  business_information_id?: number | null;
  bank_branch_name_id?: number | null;
  categories_fees_id?: number[];
  initial_payment_required?: boolean;
  ifConfirm?: boolean;
  Status?: boolean;

  // Legacy fields for backward compatibility
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
  }>;
  Payment_Setup_HolderName?: string;
  Payment_Setup_BankName?: string;
  Payment_Setup_BranchName?: string;
  Payment_Setup_AccountNo?: string;
  Payment_Setup_Ifsc?: string;
  Payment_Setup_UPI?: string;
  // optional cancellation charges percentage (0-30)
  CancellationCharges?: number;
  EscrowPayment?: boolean;

  [key: string]: any;
}

/**
 * API response shape for the update vendor onboarding portal endpoint
 */
export interface UpdateVendorOnboardingPortalResponse {
  success: boolean;
  message?: string;
  data?: any;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Hook: useUpdateVendorOnboardingPortalMutation
 * Calls PUT/POST /api/vendor/onboarding-portal/update with the provided payload
 */
export function useUpdateVendorOnboardingPortalMutation(
  options?: UseMutationOptions<
    AxiosResponse<UpdateVendorOnboardingPortalResponse>,
    unknown,
    UpdateVendorOnboardingPortalInput
  >
) {
  return useMutation<
    AxiosResponse<UpdateVendorOnboardingPortalResponse>,
    unknown,
    UpdateVendorOnboardingPortalInput
  >({
    mutationFn: (data: UpdateVendorOnboardingPortalInput) =>
      axiosInstance.put<UpdateVendorOnboardingPortalResponse>(
        "/api/vendor/onboarding-portal/update",
        data
      ),
    onSuccess: (res, variables) => {
      // Invalidate vendor onboarding portal queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["vendor-onboarding-portal"],
      });

      // If there's a specific portal ID, invalidate its detail query
      if (variables.Vendor_Onboarding_Portal_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "vendor-onboarding-portal",
            "detail",
            variables.Vendor_Onboarding_Portal_id,
          ],
        });
      }

      // If there's a vendor ID, invalidate the list query
      if (variables.Vendor_id) {
        queryClient.invalidateQueries({
          queryKey: ["vendor-onboarding-portal", "list"],
        });
      }
    },
    ...options,
  });
}

export default useUpdateVendorOnboardingPortalMutation;
