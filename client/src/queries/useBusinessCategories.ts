import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IBusinessCategory {
  _id: string;
  business_category: string;
  business_type_id?: number;
  emoji?: string;
  status?: boolean;
  business_category_id?: number;
}

export async function fetchBusinessCategories() {
  const url = "/api/admin/business-categories/getAll";
  return axiosInstance
    .get<IResponseList<IBusinessCategory>>(url)
    .then((r) => r.data);
}

export function useBusinessCategories() {
  const key = ["/api/admin/business-categories/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchBusinessCategories(),
    // select to return the raw categories array for convenience
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
