import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type CateringMarketplace = {
  _id: string;
  catering_marketplace_category_id?: number;
  name: string;
  image?: string;
  review_count?: number;
  address?: string;
  mobile_no?: string;
  status?: boolean;
  created_by?: number;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string | null;
  catering_marketplace_id?: number;
};

export const fetchCateringMarketplaces = async () => {
  const res = await axiosInstance.get<IResponseList<CateringMarketplace>>(
    "/api/master/catering-marketplace/getAll"
  );
  return res.data?.data || [];
};

export function useCateringMarketplacesQuery() {
  return useQuery({
    queryKey: ["/api/master/catering-marketplace/getAll"],
    queryFn: fetchCateringMarketplaces,
    staleTime: 1000 * 60 * 5,
  });
}
