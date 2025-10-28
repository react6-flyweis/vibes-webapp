import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface VendorOnboardingPayload {
  Vendor_id?: number;
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
  Payment_Setup_HolderName?: string;
  Payment_Setup_BankName?: string;
  Payment_Setup_BranchName?: string;
  Payment_Setup_AccountNo?: string;
  Payment_Setup_Ifsc?: string;
  Payment_Setup_UPI?: string;
  ifConfirm?: boolean;
  Status?: boolean;
  [k: string]: any;
}

export interface VendorOnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export function useVendorOnboarding() {
  return useMutation<
    VendorOnboardingResponse,
    unknown,
    VendorOnboardingPayload
  >({
    mutationFn: async (payload: VendorOnboardingPayload) => {
      const res = await axiosInstance.post<VendorOnboardingResponse>(
        "/api/vendor/onboarding-portal/create",
        payload
      );
      return res.data;
    },
  });
}
