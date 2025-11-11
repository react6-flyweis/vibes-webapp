import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type CreateBankAccountData = {
  bank_branch_name: string;
  emoji?: string;
  bank_name_id: number;
  status?: boolean;
  holderName: string;
  ifsc: string;
  accountNo: string;
  zipcode: string;
  address: string;
  upi?: string;
  cardNo?: string;
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
