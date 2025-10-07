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

export type Food = {
  _id?: string;
  food_name: string;
  food_price?: number;
  food_color?: string;
  food_type?: string;
  brand_name?: string;
  status?: boolean;
  food_id?: number;
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

export function useFoodQuery() {
  return useQuery({
    queryKey: ["/api/master/food/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<Food>>("/api/master/food/getAll")
        .then((res) => res.data),
  });
}
