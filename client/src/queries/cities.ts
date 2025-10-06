import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type City = {
  _id: string;
  name: string;
  state_id?: number;
  country_id?: number;
  status?: boolean;
  city_id?: number;
  created_at?: string;
  updated_at?: string | null;
};

export function useCitiesQuery() {
  return useQuery<City[], Error>({
    queryKey: ["/api/cities/getAll"],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: City[];
      }>("/api/cities/getAll");

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}

export function useCitiesByStateQuery(stateId?: string | number | null) {
  if (stateId == null || stateId === "") return useCitiesQuery();

  return useQuery<City[], Error>({
    queryKey: ["/api/cities/getByStateId", String(stateId)],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: City[];
      }>(`/api/cities/getByStateId/${stateId}`);

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}

export function useCitiesByCountryQuery(countryId?: string | number | null) {
  if (countryId == null || countryId === "") return useCitiesQuery();

  return useQuery<City[], Error>({
    queryKey: ["/api/cities/getByCountryId", String(countryId)],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: City[];
      }>(`/api/cities/getByCountryId/${countryId}`);

      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}
