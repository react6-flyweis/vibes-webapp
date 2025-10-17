import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SuccessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  refNumber: string;
  paymentMethod?: string;
  senderName?: string;
  time?: string;
}

export const PaymentSuccessDialog: React.FC<SuccessProps> = ({
  open,
  onOpenChange,
  amount,
  refNumber,
  paymentMethod = "Card",
  senderName = "You",
  time,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                ✓
              </div>
            </div>
            <DialogTitle className="text-center">Payment Success!</DialogTitle>
            <DialogDescription className="text-center mt-2">
              {amount}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>Ref Number</div>
            <div className="text-right">{refNumber}</div>
            <div>Payment Time</div>
            <div className="text-right">{time}</div>
            <div>Payment Method</div>
            <div className="text-right">{paymentMethod}</div>
            <div>Sender Name</div>
            <div className="text-right">{senderName}</div>
          </div>

          <div className="border-t my-4" />

          <div className="flex justify-between items-center font-bold">
            <div>Amount</div>
            <div>{amount}</div>
          </div>
          <div className="flex justify-between items-center">
            <div>Admin Fee</div>
            <div>$0</div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-emerald-500 text-white py-2 rounded"
          >
            Done
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
