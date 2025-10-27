import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateStaffPayload = {
  name: string;
  email?: string;
  password: string;
  agreePrivacyPolicy: boolean;
  business_name: string;
  business_category_id: number;
  staff_category_id: number;
  price: number;
  review_count: number;
  status: boolean;
};

async function createStaff(payload: CreateStaffPayload) {
  const res = await axiosInstance.post("/api/master/staff/create", payload);
  return res.data;
}

export function useCreateStaff(
  options?: Parameters<typeof useMutation<typeof createStaff>>[1]
) {
  return useMutation({
    mutationFn: createStaff,
    ...options,
  });
}
