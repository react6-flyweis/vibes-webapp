import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type State = {
  _id: string;
  name: string;
  country_id?: number;
  status?: boolean;
  state_id?: number;
  created_at?: string;
  updated_at?: string | null;
};

/**
 * Hook to fetch all states. Returns an array of State objects in `data`.
 */
export function useStatesQuery() {
  return useQuery<State[], Error>({
    queryKey: ["/api/states/getAll"],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: State[];
      }>("/api/states/getAll");

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}

/**
 * Fetch states for a specific country using the server endpoint
 * GET /api/states/getByCountryId/:countryId
 */
export function useStatesByCountryQuery(countryId?: string | number | null) {
  // If no countryId provided, fall back to fetching all states
  if (countryId == null || countryId === "") {
    return useStatesQuery();
  }

  return useQuery<State[], Error>({
    queryKey: ["/api/states/getByCountryId", String(countryId)],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: State[];
      }>(`/api/states/getByCountryId/${countryId}`);

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}
