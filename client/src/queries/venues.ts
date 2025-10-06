import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type Venue = {
  _id?: string | number;
  venue_details_id?: string | number;
  name?: string;
  capacity?: number;
  [k: string]: any;
};

export const fetchVenues = async (): Promise<Venue[]> => {
  const resp = await apiRequest("/api/master/venue-details/all", "GET");
  return (resp && resp.data) || resp || [];
};

export function useVenuesQuery() {
  return useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: fetchVenues,
    staleTime: 1000 * 60 * 5,
  });
}
