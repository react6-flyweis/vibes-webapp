import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IEmailTemplate {
  _id: string;
  vendor_id: number;
  Title: string;
  subTitle?: string;
  Subject?: string;
  Preview?: string;
  defultTemplate?: boolean;
  image?: string;
  Status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  EmailTemplate_id?: number;
}

export async function fetchVendorEmailTemplates() {
  const url = "/api/vendor/email-template/getAll";
  return axiosInstance
    .get<IResponseList<IEmailTemplate>>(url)
    .then((r) => r.data);
}

export function useVendorEmailTemplates() {
  const key = ["/api/vendor/email-template/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorEmailTemplates(),
    // select the array of templates directly for convenience
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
