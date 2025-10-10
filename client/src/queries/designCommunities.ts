import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

// DesignCommunity represents the items returned by the design communities API.
// Fields are typed from the provided sample response and kept optional to be
// resilient to future backend changes.
export type DesignCommunity = {
  _id: string;
  event_id?: number;
  invited_user_id?: number;
  approval?: string;
  emoji?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  design_community_id?: number;
  // allow extra fields
  [key: string]: unknown;
};

/**
 * Fetches design communities from the master endpoint.
 *
 * Accepts optional query params (e.g., page, limit) which will be forwarded to
 * the request as query string parameters.
 */
export const fetchDesignCommunities = async (
  params?: Record<string, unknown>
) => {
  const res = await axiosInstance.get<IResponseList<DesignCommunity>>(
    "/api/master/design-communities/getAll",
    { params }
  );
  return res.data;
};

export function useDesignCommunitiesQuery(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["/api/master/design-communities/getAll", params],
    queryFn: () => fetchDesignCommunities(params),
    // by default enabled — callers can provide params or disable via options
    enabled: true,
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 2, // 2 minutes like events
  });
}
