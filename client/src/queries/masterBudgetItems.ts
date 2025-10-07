import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type MasterBudgetItem = {
  item_id: number;
  category_id: number;
  price: number; // price in dollars (e.g. 150.5)
  _id: string;
};

export type MasterBudgetTemplate = {
  _id: string;
  items: MasterBudgetItem[];
  status: boolean;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  budget_items_id?: number;
};

export const fetchMasterBudgetItems = async () => {
  const res = await axiosInstance.get<IResponseList<MasterBudgetTemplate>>(
    "/api/master/budget-items/all"
  );
  return res.data;
};

export function useMasterBudgetItems() {
  return useQuery({
    queryKey: ["/api/master/budget-items/all"],
    queryFn: () => fetchMasterBudgetItems(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5,
  });
}
