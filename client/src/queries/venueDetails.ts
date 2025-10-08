import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type VenueDetails = {
  _id: string;
  name: string;
  address?: string;
  capacity?: number;
  type?: string;
  map?: string;
  status?: boolean;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  venue_details_id?: number;
  //   [k: string]: any;
};

export const fetchVenueDetails = async (eventId?: string | number | null) => {
  if (!eventId) return null;
  const res = await axiosInstance.get<IResponse<VenueDetails>>(
    `/api/master/venue-details/event/${eventId}`
  );
  return res.data;
};

export function useVenueDetailsQuery(eventId?: string | number | null) {
  return useQuery({
    queryKey: [`/api/master/venue-details/event/${eventId}`],
    queryFn: () => fetchVenueDetails(eventId),
    enabled: !!eventId,
    select: (data) => data?.data ?? null,
    staleTime: 1000 * 60 * 5,
  });
}
