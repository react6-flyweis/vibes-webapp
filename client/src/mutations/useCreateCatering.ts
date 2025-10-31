import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateCateringPayload = {
  catering_marketplace_category_id: number | string;
  name: string;
  image?: string;
  address?: string;
  mobile_no?: string;
};

export function useCreateCatering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCateringPayload) => {
      // backend expects numeric id; try to coerce if it's a string
      const payload = {
        ...data,
        catering_marketplace_category_id: Number(
          data.catering_marketplace_category_id
        ),
      };

      return axiosInstance.post(
        "/api/master/catering-marketplace/create",
        payload
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/master/catering-marketplace/getAll"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/master/catering-marketplace/getByAuth"],
      });
    },
  });
}
