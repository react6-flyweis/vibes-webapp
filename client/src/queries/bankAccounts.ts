import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export type BankAccount = {
  _id: string;
  bank_branch_name: string;
  bank_name_id: number;
  holderName: string;
  upi?: string;
  ifsc: string;
  accountNo: string;
  address: string;
  cardNo?: string;
  zipcode: string;
  emoji?: string;
  status: boolean;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  bank_branch_name_id: number;
};

export type BankAccountsResponse = {
  success: boolean;
  message: string;
  data: BankAccount[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
};

/**
 * Returns a react-query result whose `data` is an array of BankAccount objects.
 */
export function useBankAccountsQuery() {
  return useQuery<BankAccount[], Error>({
    queryKey: ["/api/admin/bank-branch-names/getByAuth"],
    queryFn: async () => {
      const res = await apiRequest<BankAccountsResponse>(
        "/api/admin/bank-branch-names/getAll"
      );
      return Array.isArray(res?.data) ? res.data : [];
    },
  });
}
