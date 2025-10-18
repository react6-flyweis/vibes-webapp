import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface ICampaignType {
  _id: string;
  name: string;
  status?: boolean;
  compaign_type_id?: number;
}

export async function fetchCampaignTypes() {
  const url = "/api/admin/compaign-types/getAll";
  return axiosInstance
    .get<IResponseList<ICampaignType>>(url)
    .then((r) => r.data);
}

export function useCampaignTypes() {
  const key = ["/api/admin/compaign-types/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchCampaignTypes(),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5,
  });
}
