import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

type CreateLeadPayload = {
  Vendor_name: string;
  platform: string;
  shop_Profile_url?: string;
  product_serviceType?: string;
  ContactEmail?: string;
  ContactPhone?: string;
  DiscoverySource?: string;
  ContactMobile?: string;
  EstimetedValuePrice?: number | null;
  Tags?: string[];
  Notes?: string;
  LeadStatus?: string;
};

export default function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) =>
      axiosInstance.post("/api/vendor/crm-outreach-dashboard/create", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/crm-outreach-dashboard"],
      });
    },
  });
}
