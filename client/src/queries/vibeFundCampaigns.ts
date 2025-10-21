import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

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

export type VibeFundQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean | string;
  approved_status?: boolean | string;
  business_category_id?: string | number;
  compaign_type_id?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const fetchVibeFundCampaigns = async (params?: VibeFundQueryParams) => {
  const queryParams: Record<string, unknown> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    search: params?.search ?? "",
    status: params?.status ?? "",
    approved_status: params?.approved_status ?? "",
    sortBy: params?.sortBy ?? "created_at",
    sortOrder: params?.sortOrder ?? "desc",
  };

  // Only include these filters when explicitly provided and not the 'all' token
  if (
    params?.business_category_id !== undefined &&
    params?.business_category_id !== "all" &&
    params?.business_category_id !== ""
  ) {
    queryParams.business_category_id = params.business_category_id;
  }

  if (
    params?.compaign_type_id !== undefined &&
    params?.compaign_type_id !== "all" &&
    params?.compaign_type_id !== ""
  ) {
    queryParams.compaign_type_id = params.compaign_type_id;
  }

  const res = await axiosInstance.get<IResponseList<VibeFundCampaign>>(
    "/api/master/vibe-fund-campaign/getAll",
    {
      params: queryParams,
    }
  );
  return res.data;
};

export function useVibeFundCampaigns(params?: VibeFundQueryParams) {
  return useQuery({
    queryKey: ["/api/master/vibe-fund-campaign/getAll", params ?? {}],
    queryFn: () => fetchVibeFundCampaigns(params),
    select: (d) => d?.data ?? [],
    staleTime: 1000 * 60 * 2,
  });
}
