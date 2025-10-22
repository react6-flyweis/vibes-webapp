import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";
import type { IEmailTemplate } from "@/queries/vendorTemplates";

export type CreateVendorEmailTemplatePayload = Partial<{
  vendor_id: number;
  Title: string;
  subTitle: string;
  Subject: string;
  Preview: string;
  defultTemplate: boolean;
  image: string;
  Status: boolean;
}>;

export function useCreateVendorEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVendorEmailTemplatePayload) => {
      const res = await axiosInstance.post<IResponse<IEmailTemplate>>(
        "/api/vendor/email-template/create",
        payload
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      // refresh templates list
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/email-template/getAll"],
      });
    },
  });
}
