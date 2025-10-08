import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type Category = {
  _id: string;
  categorytxt?: string;
  category_name?: string;
  emozi?: string | null;
  status?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedBy?: number | null;
  updatedAt?: string | null;
  item_category_id?: number;
  category_id?: number;
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axiosInstance.get<IResponseList<Category>>("/api/master/category/getAll"),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  });
}
