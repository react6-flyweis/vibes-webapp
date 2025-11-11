import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCreateBankAccountMutation, {
  CreateBankAccountData,
} from "@/mutations/createBankAccount";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";

const createBankAccountSchema = z.object({
  bank_branch_name: z.string().min(1, "Branch name is required"),
  emoji: z.string().optional(),
  bank_name_id: z.number().min(1, "Bank name ID is required"),
  holderName: z.string().min(1, "Account holder name is required"),
  ifsc: z.string().min(1, "IFSC code is required"),
  accountNo: z.string().min(1, "Account number is required"),
  zipcode: z.string().min(1, "Zipcode is required"),
  address: z.string().min(1, "Address is required"),
  upi: z.string().optional(),
  cardNo: z.string().optional(),
});

type CreateBankAccountForm = z.infer<typeof createBankAccountSchema>;

export default function AddBankAccountDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateBankAccountMutation();
  const { toast } = useToast();

  const form = useForm<CreateBankAccountForm>({
    resolver: zodResolver(createBankAccountSchema),
    defaultValues: {
      bank_branch_name: "",
      emoji: "🏦",
      bank_name_id: 1,
      holderName: "",
      ifsc: "",
      accountNo: "",
      zipcode: "",
      address: "",
      upi: "",
      cardNo: "",
    },
  });

  const onSubmit = async (data: CreateBankAccountForm) => {
    try {
      const payload: CreateBankAccountData = {
        ...data,
        status: true,
      };

      await createMutation.mutateAsync(payload);

      toast({
        title: "Success",
        description: "Bank account added successfully",
      });

      form.reset();
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to add bank account",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Bank Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Enter your bank account details to receive payments from ticket
            sales.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bank_branch_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Branch" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emoji (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="🏦" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="holderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_name_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="IBIB00000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="upi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UPI ID (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="user@bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank branch address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
