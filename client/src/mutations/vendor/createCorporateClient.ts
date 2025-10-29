import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface CreateCorporateClientPayload {
  CompanyName: string;
  industry?: string;
  EmployeeCount: number;
  ContactEmail: string;
  Plan_id: number | string;
  Status: boolean;
}

export interface CorporateClient {
  id?: number;
  CompanyName: string;
  industry?: string;
  EmployeeCount: number;
  ContactEmail: string;
  Plan_id: number;
  Status: boolean;
  createdAt?: string;
}

export async function createCorporateClient(
  payload: CreateCorporateClientPayload
): Promise<CorporateClient> {
  const res = await axiosInstance.post(
    "/api/vendor/corporate-dashboard-client/create",
    payload
  );
  return res.data;
}

/**
 * React Query mutation hook for creating corporate clients.
 * It invalidates the clients list on success by default, but callers
 * can override handlers via the options parameter.
 */
export function useCreateCorporateClient(options?: {
  onSuccess?: (
    data: CorporateClient,
    variables: CreateCorporateClientPayload,
    context: unknown
  ) => void;
  onError?: (
    error: Error,
    variables: CreateCorporateClientPayload,
    context: unknown
  ) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCorporateClient,
    onSuccess: (data, variables, context) => {
      // invalidate list so UI updates
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/corporate-dashboard-client/getAll"],
      });
      // call user's onSuccess if provided
      options?.onSuccess?.(data, variables, context as any);
    },
    onError: (err, variables, context) => {
      options?.onError?.(err as Error, variables, context as any);
    },
    ...options,
  });
}
