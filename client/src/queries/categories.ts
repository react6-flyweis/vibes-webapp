import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type Category = {
  _id: string;
  category_name: string;
  emozi?: string;
  category_id?: number;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const resp = await apiRequest("/api/master/category/getAll", "GET");
  return (resp && resp.data) || [];
};

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
}
