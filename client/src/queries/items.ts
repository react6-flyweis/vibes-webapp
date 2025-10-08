import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type MasterItem = {
  _id: string;
  item_Category_id?: number;
  item_name: string;
  item_price?: number;
  item_brand?: string;
  item_color?: string;
  status?: boolean;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  items_id?: number;
};

export function useItemsQuery() {
  return useQuery<MasterItem[], Error>({
    queryKey: ["master", "items", "all"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/master/items/all");
      // API returns { success, message, data: [...] }
      return res.data?.data || [];
    },
  });
}
