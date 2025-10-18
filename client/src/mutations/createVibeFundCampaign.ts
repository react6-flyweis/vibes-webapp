import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

// Request payload shape sent to the backend
export interface VibeFundCampaignPayload {
  title: string;
  campaign_description: string;
  campaign_story: string;
  business_category_id?: number;
  compaign_type_id?: number;
  funding_goal: number;
  campaign_duration: string;
  funding_model: string;
  cover_image?: string;
  campaign_video?: string;
  reward_tiers?: string[];
  milestones?: string[];
  approved_status?: boolean;
  emozi?: string;
  status?: boolean;
}

// Minimal response shape (extend if backend returns more fields)
export interface VibeFundCampaignResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Standalone API call exported so it can be reused outside of the hook
export const createVibeFundCampaign = (data: VibeFundCampaignPayload) =>
  axiosInstance
    .post<VibeFundCampaignResponse>(
      "/api/master/vibe-fund-campaign/create",
      data
    )
    .then((res) => res.data);

export function useCreateVibeFundCampaign() {
  const queryClient = useQueryClient();

  return useMutation<
    VibeFundCampaignResponse,
    unknown,
    VibeFundCampaignPayload
  >({
    mutationFn: createVibeFundCampaign,
    onSuccess: () => {
      // Invalidate any vibe fund campaign related lists so UI can refresh
      queryClient.invalidateQueries({
        queryKey: ["/api/master/vibe-fund-campaign/getAll"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vibe-fund-campaigns"] });
    },
  });
}
