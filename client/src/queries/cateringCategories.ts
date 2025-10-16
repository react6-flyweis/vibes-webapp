import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type CateringCategory = {
  _id: string;
  name: string;
  dish?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
  catering_marketplace_category_id?: number;
};

export const fetchCateringCategories = async () => {
  const res = await axiosInstance.get<IResponseList<CateringCategory>>(
    "/api/master/catering-marketplace-category/getAll"
  );
  return res.data?.data;
};

export function useCateringCategoriesQuery() {
  return useQuery({
    queryKey: ["/api/master/catering-marketplace-category/getAll"],
    queryFn: fetchCateringCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
