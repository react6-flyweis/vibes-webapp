import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import type { VibeFundCampaign } from "./vibeFundCampaigns";
import { IResponseList } from "@/types";

const fetchMyVibeFundCampaigns = async () => {
  const res = await axiosInstance.get<IResponseList<VibeFundCampaign>>(
    "/api/master/vibe-fund-campaign/getVibeFundCampaignByAuth"
  );
  return res.data;
};

export function useMyVibeFundCampaigns() {
  return useQuery({
    queryKey: ["/api/master/vibe-fund-campaign/getVibeFundCampaignByAuth"],
    queryFn: fetchMyVibeFundCampaigns,
    select: (d) => d?.data,
    staleTime: 1000 * 60 * 2,
  });
}
