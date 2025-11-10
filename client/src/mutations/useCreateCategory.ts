import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export type CreateCategoryPayload = {
  category_name: string;
  emozi?: string | null;
  status?: boolean;
};

export type CreateCategoryResponse = {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
};

export function useCreateCategory() {
  return useMutation<CreateCategoryResponse, Error, CreateCategoryPayload>({
    mutationFn: async (payload: CreateCategoryPayload) => {
      const res = await axiosInstance.post<CreateCategoryResponse>(
        "/api/master/category/create",
        payload
      );
      return res.data;
    },
    onSuccess: (data: CreateCategoryResponse) => {
      // Invalidate categories query so list refreshes
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
