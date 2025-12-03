import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MasterBudgetItem } from "@/queries/masterBudgetItems";

type CreateBudgetPayload = {
  items: {
    item_id: number;
    category_id: number;
    price: number; // price in dollars
  }[];
  status: boolean;
};

type UpdateBudgetPayload = CreateBudgetPayload & {
  id: number | string;
};

export function useCreateMasterBudgetItems(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateBudgetPayload) => {
      const res = await axiosInstance.post(
        "/api/master/budget-items/create",
        payload
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/master/budget-items/all"],
      });
      toast({ title: "Budget template created successfully" });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create budget template",
        description: error?.message || String(error),
        variant: "destructive",
      });
      options?.onError?.(error);
    },
  });
}

export function useUpdateMasterBudgetItems(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: UpdateBudgetPayload) => {
      const res = await axiosInstance.put(
        "/api/master/budget-items/update",
        payload
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate all budget queries
      queryClient.invalidateQueries({
        queryKey: ["/api/master/budget-items/all"],
      });
      // Invalidate the specific template query
      queryClient.invalidateQueries({
        queryKey: [`/api/master/budget-items/get/${variables.id}`],
      });
      toast({ title: "Budget template updated successfully" });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update budget template",
        description: error?.message || String(error),
        variant: "destructive",
      });
      options?.onError?.(error);
    },
  });
}
