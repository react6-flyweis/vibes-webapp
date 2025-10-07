import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type Drink = {
  _id?: string;
  drinks_name: string;
  drinks_price?: number;
  drinks_color?: string;
  brand_name?: string;
  status?: boolean;
  drinks_id?: number;
  created_at?: string;
  updated_at?: string | null;
};

export function useDrinksQuery() {
  return useQuery({
    queryKey: ["/api/master/drinks/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<Drink>>("/api/master/drinks/getAll")
        .then((res) => res.data),
  });
}
