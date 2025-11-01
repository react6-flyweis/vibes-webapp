import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type ContactVendorPayload = {
  vendor_id: number;
  user_id: number;
  event_id?: number | null;
  topic: string;
  description: string;
};

async function contactVendor(payload: ContactVendorPayload) {
  const res = await axiosInstance.post(
    "/api/master/contact-vendor/create",
    payload
  );
  return res.data;
}

export function useContactVendor(
  options?: UseMutationOptions<unknown, unknown, ContactVendorPayload>
) {
  return useMutation({
    mutationFn: contactVendor,
    ...options,
  });
}
