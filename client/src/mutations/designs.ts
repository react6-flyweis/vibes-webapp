import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";
import { CommunityDesignApiItem } from "@/queries/communityDesigns";

export type CreateDesignPayload = {
  categories_id: number;
  image: string;
  title: string;
  sub_title?: string;
  image_type?: string;
  image_sell_type?: string;
  hash_tag?: string[];
  design_json_data?: string;
  status?: boolean;
};

export async function createDesign(payload: CreateDesignPayload) {
  const url = `/api/master/community-designs/create`;
  const res: AxiosResponse = await axiosInstance.post<
    IResponse<CommunityDesignApiItem>
  >(url, payload);
  return res.data;
}

export async function updateDesign(id: number, payload: CreateDesignPayload) {
  const url = `/api/master/community-designs/updateCommunityDesignById`;
  const body = { id, ...payload };
  const res: AxiosResponse = await axiosInstance.put<
    IResponse<CommunityDesignApiItem>
  >(url, body);
  return res.data;
}

export type CreateDesignTabMapPayload = {
  tabs_id: number;
  community_designs_id: number;
  status: boolean;
};

export async function createDesignTabMap(payload: CreateDesignTabMapPayload) {
  const url = `/api/master/design-tabs-map/create`;
  const res: AxiosResponse = await axiosInstance.post(url, payload);
  return res.data;
}

export function useCreateDesign(options?: {
  onSuccess?: (data: IResponse<CommunityDesignApiItem>) => void;
  onError?: (err: any) => void;
}) {
  return useMutation({
    mutationFn: (payload: CreateDesignPayload) => createDesign(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

export function useUpdateDesign(options?: {
  onSuccess?: (data: IResponse<CommunityDesignApiItem>) => void;
  onError?: (err: any) => void;
}) {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CreateDesignPayload;
    }) => updateDesign(id, payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
