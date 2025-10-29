import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type CreatePricingPlanPayload = {
  MinBookingFee: number;
  PriceRangeMin: number;
  PriceRangeMax: number;
  isDeposit: boolean;
  PaymentMethods: number[]; // ids of payment methods
  Status: boolean;
};

export interface CreatePricingPlanResponse {
  success?: boolean;
  message?: string;
  data?: any;
}

type Options = {
  onSuccess?: UseMutationOptions<
    CreatePricingPlanResponse,
    unknown,
    CreatePricingPlanPayload
  >["onSuccess"];
  onError?: UseMutationOptions<
    CreatePricingPlanResponse,
    unknown,
    CreatePricingPlanPayload
  >["onError"];
};

export default function useCreatePricingPlan({
  onSuccess,
  onError,
}: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation<
    CreatePricingPlanResponse,
    unknown,
    CreatePricingPlanPayload
  >({
    mutationFn: async (payload: CreatePricingPlanPayload) => {
      const url = "/api/vendor/corporate-dashboard-pricing-plans/create";
      const res = await axiosInstance.post<
        IResponse<CreatePricingPlanResponse>
      >(url, payload);
      return res.data.data || res.data;
    },
    onSuccess: (data, variables, context) => {
      try {
        // Invalidate pricing plans list if any
        queryClient.invalidateQueries({
          queryKey: ["/api/vendor/corporate-dashboard-pricing-plans/getAll"],
        });
      } catch (e) {
        // ignore
      }
      // external onSuccess not proxied here to avoid calling with mismatched signature
    },
    onError,
  });
}
