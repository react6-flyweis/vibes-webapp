import { useBankAccountsQuery } from "@/queries/bankAccounts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface BankAccountSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function BankAccountSelector({
  value,
  onChange,
  className,
  placeholder = "Select a bank account",
}: BankAccountSelectorProps) {
  const { data: bankAccounts, isLoading, error } = useBankAccountsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2 text-sm">Loading bank accounts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Failed to load bank accounts. Please try again.
      </div>
    );
  }

  // Filter only active bank accounts
  const activeBankAccounts =
    bankAccounts?.filter((account) => account.status) || [];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white/20 text-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {activeBankAccounts.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            No active bank accounts found
          </div>
        ) : (
          activeBankAccounts.map((account) => (
            <SelectItem
              key={account._id}
              value={String(account.bank_branch_name_id)}
            >
              <div className="flex items-center gap-2">
                <span>{account.emoji || "🏦"}</span>
                <div className="flex flex-col justify-start">
                  <span className="font-medium">
                    {account.bank_branch_name}
                  </span>
                  <span className="text-xs ">
                    {account.holderName} - ****{account.accountNo.slice(-4)}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
