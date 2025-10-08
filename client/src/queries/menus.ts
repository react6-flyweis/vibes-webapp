import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type IDrink = {
  _id: string;
  drinks_name: string;
  drinks_price: number;
  drinks_color: string;
  brand_name: string;
  status: boolean;
  drinks_id: number;
  created_at: string;
  updated_at: string | null;
};

export type IFood = {
  _id: string;
  food_name: string;
  food_price: number;
  food_color: string;
  food_type: string;
  brand_name: string;
  status: boolean;
  food_id: number;
};

export type IEntertainment = {
  _id: string;
  entertainment_name: string;
  entertainment_price: number;
  entertainment_type: string;
  brand_name: string;
  status: boolean;
  entertainment_id: number;
};

export type IDecorations = {
  _id: string;
  decorations_name: string;
  decorations_price: number;
  decorations_type: string;
  brand_name: string;
  status: boolean;
  decorations_id: number;
};

export function useDrinksQuery() {
  return useQuery({
    queryKey: ["/api/master/drinks/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<IDrink>>("/api/master/drinks/getAll")
        .then((res) => res.data),
  });
}

export function useFoodQuery() {
  return useQuery({
    queryKey: ["/api/master/food/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<IFood>>("/api/master/food/getAll")
        .then((res) => res.data),
  });
}

export function useEntertainmentQuery() {
  return useQuery({
    queryKey: ["/api/master/entertainment/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<IEntertainment>>("/api/master/entertainment/getAll")
        .then((res) => res.data),
  });
}

export function useDecorationsQuery() {
  return useQuery({
    queryKey: ["/api/master/decorations/getAll"],
    queryFn: () =>
      axiosInstance
        .get<IResponseList<IDecorations>>("/api/master/decorations/getAll")
        .then((res) => res.data),
  });
}
