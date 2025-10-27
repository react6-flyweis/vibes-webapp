import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type MasterDecoration = {
  _id: string;
  decorations_name: string;
  decorations_price?: number;
  decorations_type?: string;
  brand_name?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  decorations_id?: number;
};

/**
 * Fetch all decorations from the master decorations endpoint.
 * API: GET /api/master/decorations/getAll
 * Returns the `data` array from the API response (or an empty array).
 */
export async function fetchAllDecorations() {
  const res = await axiosInstance.get<
    IResponseList<IResponseList<MasterDecoration>>
  >("/api/master/decorations/getAll");
  // API shape: { success, message, data: [...], pagination, timestamp }
  return res.data?.data || [];
}

export function useDecorationsQuery() {
  return useQuery({
    queryKey: ["master", "decorations", "all"],
    queryFn: fetchAllDecorations,
    // keep consistent with other queries in the repo
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
