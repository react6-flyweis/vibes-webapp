import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type StaffCategory = {
  _id: string;
  name?: string;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  staff_category_id?: number;
};

export function useStaffCategoriesQuery() {
  return useQuery({
    queryKey: ["/api/master/staff-category/getAll"],
    queryFn: async () => {
      const res = await axiosInstance.get<IResponseList<StaffCategory>>(
        "/api/master/staff-category/getAll"
      );
      return res.data;
    },
    // select to return array of StaffCategory directly
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}
