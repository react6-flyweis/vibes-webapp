import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceEstimate: number;
  onConfirm: (payment: any) => void;
  onPrevious: () => void;
  staffLabel?: string;
};

export default function PriceConfirmationDialog({
  open,
  onOpenChange,
  priceEstimate,
  onConfirm,
  onPrevious,
  staffLabel,
}: Props) {
  const [method, setMethod] = React.useState<string>("card");
  const [upiId, setUpiId] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiry, setCardExpiry] = React.useState("");
  const [cardCvv, setCardCvv] = React.useState("");
  const [accountNumber, setAccountNumber] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setMethod("card");
      setUpiId("");
      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
      setAccountNumber("");
    }
  }, [open]);

  const isPayDisabled = React.useMemo(() => {
    if (method === "upi") return upiId.trim() === "";
    if (method === "card")
      return !(
        cardNumber.trim().length >= 12 &&
        cardExpiry.trim() &&
        cardCvv.trim()
      );
    if (method === "netbanking") return accountNumber.trim() === "";
    return false;
  }, [method, upiId, cardNumber, cardExpiry, cardCvv, accountNumber]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex items-start justify-between">
          <DialogTitle className="text-lg font-semibold">
            Price & Confirmation
          </DialogTitle>
          {staffLabel && (
            <div className="text-sm text-gray-700 mt-1">{staffLabel}</div>
          )}
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <div className="text-sm text-gray-700">Price Estimation:</div>
            <div className="text-2xl font-bold">{priceEstimate}$</div>
          </div>

          <div className="mb-4">
            <div className="text-sm mb-3">Payment Options:</div>
            <div className="flex gap-4">
              <button
                className={`flex-1 p-4 border rounded ${
                  method === "card" ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setMethod("card")}
              >
                Card
              </button>
              <button
                className={`flex-1 p-4 border rounded ${
                  method === "upi" ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setMethod("upi")}
              >
                UPI
              </button>
              <button
                className={`flex-1 p-4 border rounded ${
                  method === "netbanking"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setMethod("netbanking")}
              >
                Net Banking
              </button>
            </div>
          </div>

          {method === "card" && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Input
                placeholder="Card number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
              <Input
                placeholder="mm/yy"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
              <Input
                placeholder="CVV"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
            </div>
          )}

          {method === "upi" && (
            <div className="mb-6">
              <Input
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {method === "netbanking" && (
            <div className="mb-6">
              <Input
                placeholder="Enter Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                onPrevious();
                onOpenChange(false);
              }}
            >
              ← Previous
            </Button>
            <Button
              disabled={isPayDisabled}
              onClick={() => {
                const payment: any = { method };
                if (method === "upi") payment.upiId = upiId;
                if (method === "card")
                  payment.card = {
                    number: cardNumber,
                    expiry: cardExpiry,
                    cvv: cardCvv,
                  };
                if (method === "netbanking")
                  payment.accountNumber = accountNumber;
                onConfirm(payment);
                onOpenChange(false);
              }}
            >
              Pay →
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
