import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateDesignPayload = {
  categories_id: number;
  image: string;
  title: string;
  sub_title?: string;
  image_type?: string;
  image_sell_type?: string;
  hash_tag?: string[];
  status?: boolean;
};

export async function createDesign(payload: CreateDesignPayload) {
  const url = `/api/master/community-designs/create`;
  const res: AxiosResponse = await axiosInstance.post(url, payload);
  return res.data;
}

export function useCreateDesign(options?: {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
}) {
  return useMutation({
    mutationFn: (payload: CreateDesignPayload) => createDesign(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
