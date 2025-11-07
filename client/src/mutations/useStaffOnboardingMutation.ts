import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type StaffOnboardingPayload = {
  mobile: string;
  address: string;
  country_id: number;
  state_id: number;
  city_id: number;
  zip_code: string;
  Authorized_Person_Name: string;
  DOB: string;
  Govt_id_type: string;
  ID_Number: string;
  id_proof_owner_img?: string;
  user_img?: string;
};

export function useStaffOnboardingMutation(
  options?: UseMutationOptions<unknown, unknown, StaffOnboardingPayload>
) {
  return useMutation<unknown, unknown, StaffOnboardingPayload>({
    mutationFn: async (data: StaffOnboardingPayload) =>
      await axiosInstance.put("/api/user/updateStaffProfile", data),
    ...options,
  });
}
