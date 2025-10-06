import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type Country = {
  _id: string;
  name: string;
  status?: boolean;
  country_id?: number;
};

/**
 * Returns a react-query result whose `data` is an array of Country objects.
 * The hook centralizes the API request so UI components don't inline query logic.
 */
export function useCountriesQuery() {
  return useQuery<Country[], Error>({
    queryKey: ["/api/countries/getAll"],
    queryFn: async () => {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        data: Country[];
      }>("/api/countries/getAll");
      // return the raw data array (or empty array as a defensive default)
      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}
