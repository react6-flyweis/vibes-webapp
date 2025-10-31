import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type CreateSubscriptionPayload = {
  user_id: number;
  plan_id: number;
  payment_method_id: number;
  start_plan_date: string;
  end_plan_date: string;
  status: boolean;
};

export interface CreateSubscriptionResponseData {
  user_id: number;
  plan_id: number;
  transaction_id: number;
  transaction_status: string;
  start_plan_date: string;
  end_plan_date: string;
  status: boolean;
  createdBy?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  vibe_business_plan_subscribed_id?: number;
  [k: string]: any;
}

export type CreateSubscriptionResponse =
  IResponse<CreateSubscriptionResponseData>;

async function createSubscription(payload: CreateSubscriptionPayload) {
  const res = await axiosInstance.post<CreateSubscriptionResponse>(
    "/api/master/vibe-business-plan-subscribed/create",
    payload
  );
  return res.data;
}

export function useCreateSubscription(options?: {
  onSuccess?: (data: CreateSubscriptionResponse) => void;
  onError?: (err: unknown) => void;
}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      createSubscription(payload),
    onSuccess(data) {
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
      options?.onSuccess?.(data);
    },
    onError(err) {
      options?.onError?.(err);
    },
  });
}

// CreateSubscriptionPayload is exported above via `export type CreateSubscriptionPayload = ...`
