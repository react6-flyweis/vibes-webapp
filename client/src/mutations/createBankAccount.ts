import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateBankAccountData = {
  emoji?: string;
  bank_name_id: number;
  holderName: string;
  accountNo: string;
  routing: string;
  status?: boolean;
  // bank_branch_name: string;
  // zipcode: string;
  // address: string;
  // upi?: string;
  // cardNo?: string;
};

export default function useCreateBankAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankAccountData) =>
      axiosInstance.post("/api/admin/bank-branch-names/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/bank-branch-names/getAll"],
      });
    },
  });
}
