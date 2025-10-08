import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type DressCode = {
  _id: string;
  dress_code_name: string;
  status: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  dress_code_id?: number;
};

export function useDressCodesQuery() {
  return useQuery({
    queryKey: ["dressCodes"],
    queryFn: () =>
      axiosInstance.get<IResponseList<DressCode>>(
        "/api/master/dress-code/getAll"
      ),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 5,
  });
}
