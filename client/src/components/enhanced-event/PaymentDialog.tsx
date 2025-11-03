import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount?: number | string;
  title?: string;
  description?: React.ReactNode;
  onPay?: () => void;
};

export default function PaymentDialog({
  open,
  onOpenChange,
  amount = 99.99,
  title,
  description,
  onPay,
}: PaymentDialogProps) {
  const { toast } = useToast();

  const displayAmount = typeof amount === "number" ? amount.toFixed(2) : amount;

  const handlePay = () => {
    try {
      if (onPay) onPay();
    } catch (err) {
      toast({
        title: "Payment error",
        description: "Failed to start payment.",
        variant: "destructive",
      });
    } finally {
      // close dialog after initiating
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? `Pay $${displayAmount}`}</DialogTitle>
          <DialogDescription>
            {description ?? (
              <>
                To proceed with sending your invitation, please complete a
                one-time platform fee of
                <span className="mx-1 font-medium">${displayAmount} USD</span>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground max-w-prose mx-auto">
            This fee helps us maintain a secure, high-quality experience for you
            and your guests. Once your payment is confirmed, you'll be able to
            send your invitation without any further charges.
          </p>
          <p className="mt-4 font-medium">
            🔒 One-time only. No hidden costs. Immediate access.
          </p>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={handlePay}>
            Pay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
