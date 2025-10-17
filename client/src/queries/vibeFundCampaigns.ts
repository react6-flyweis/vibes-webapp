import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type VibeFundCampaign = {
  _id: string;
  title: string;
  campaign_description?: string;
  campaign_story?: string;
  business_category_id?: number;
  compaign_type_id?: number;
  funding_goal?: number;
  campaign_duration?: string;
  funding_model?: string;
  cover_image?: string;
  campaign_video?: string;
  reward_tiers?: string[];
  milestones?: string[];
  approved_status?: boolean;
  emozi?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  vibe_fund_campaign_id?: number;
  business_category?: Record<string, unknown>;
  compaign_type?: Record<string, unknown>;
};

type VibeFundResponse = {
  success: boolean;
  message: string;
  data: VibeFundCampaign[];
  pagination?: Record<string, unknown>;
  timestamp?: string;
};

const fetchVibeFundCampaigns = async () => {
  const res = await axiosInstance.get<VibeFundResponse>(
    "/api/master/vibe-fund-campaign/getAll"
  );
  return res.data;
};

export function useVibeFundCampaigns() {
  return useQuery({
    queryKey: ["/api/master/vibe-fund-campaign/getAll"],
    queryFn: fetchVibeFundCampaigns,
    select: (d) => d?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
