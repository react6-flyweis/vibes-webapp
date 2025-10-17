import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import PaymentSuccessDialog from "./PaymentSuccessDialog";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      bank: "Ziraat Bankası",
      last4: "1234",
      owner: "Hızır Kocaman",
      exp: "12/34",
    },
    {
      id: 2,
      bank: "T. İş Bankası",
      last4: "1234",
      owner: "Jane Cooper",
      exp: "12/34",
    },
  ] as Array<any>);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    number: "",
    owner: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    // crude last4 extraction and simple append
    const last4 = newCard.number.slice(-4);
    const id = cards.length + 1;
    setCards([
      ...cards,
      {
        id,
        bank: "Card",
        last4,
        owner: newCard.owner,
        exp: `${newCard.expMonth}/${newCard.expYear}`,
      },
    ]);
    setNewCard({ number: "", owner: "", expMonth: "", expYear: "", cvv: "" });
    setShowAddForm(false);
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState({
    amount: "$35.00",
    ref: "",
    time: "",
  });

  const handlePayNow = () => {
    // simulate payment processing and produce ref/time
    const ref = Math.floor(Math.random() * 1e12)
      .toString()
      .padStart(12, "0");
    const now = new Date();
    const time = now.toLocaleString();
    setSuccessData({ amount: "$35.00", ref, time });
    onOpenChange(false); // close checkout
    setTimeout(() => setShowSuccess(true), 300); // open success after a short delay
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Select a payment method and confirm your purchase.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-12 gap-6 mt-4">
            <div className="col-span-8 bg-card p-4 rounded-lg border">
              <h3 className="font-semibold mb-3">Registered cards</h3>
              <div className="space-y-3">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-800 text-white rounded-full flex items-center justify-center">
                        {c.id === 1 ? "✓" : "○"}
                      </div>
                      <div>
                        <div className="font-medium">{c.bank}</div>
                        <div className="text-sm text-muted-foreground">
                          Son dört hane {c.last4} • {c.owner}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">{c.exp}</div>
                  </div>
                ))}

                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full text-left p-3 rounded border"
                  >
                    + Add new card
                  </button>
                )}

                {showAddForm && (
                  <form
                    onSubmit={handleAddCard}
                    className="space-y-2 p-3 border rounded"
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <label className="col-span-12 text-sm">Card number</label>
                      <input
                        value={newCard.number}
                        onChange={(e) =>
                          setNewCard({ ...newCard, number: e.target.value })
                        }
                        className="col-span-12 p-2 border rounded"
                        placeholder="Enter the 16-digit card number"
                      />

                      <label className="col-span-6 text-sm">Card owner</label>
                      <label className="col-span-6 text-sm">Expiry date</label>

                      <input
                        value={newCard.owner}
                        onChange={(e) =>
                          setNewCard({ ...newCard, owner: e.target.value })
                        }
                        className="col-span-6 p-2 border rounded"
                        placeholder="Enter the name on the card"
                      />
                      <div className="col-span-6 grid grid-cols-12 gap-2">
                        <input
                          value={newCard.expMonth}
                          onChange={(e) =>
                            setNewCard({ ...newCard, expMonth: e.target.value })
                          }
                          className="col-span-4 p-2 border rounded"
                          placeholder="MM"
                        />
                        <input
                          value={newCard.expYear}
                          onChange={(e) =>
                            setNewCard({ ...newCard, expYear: e.target.value })
                          }
                          className="col-span-4 p-2 border rounded"
                          placeholder="YY"
                        />
                        <input
                          value={newCard.cvv}
                          onChange={(e) =>
                            setNewCard({ ...newCard, cvv: e.target.value })
                          }
                          className="col-span-4 p-2 border rounded"
                          placeholder="CVV"
                        />
                      </div>

                      <div className="col-span-12 flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-3 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 text-white rounded"
                        >
                          Add card
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <aside className="col-span-4">
              <div className="border rounded-lg p-4 bg-card">
                <h4 className="font-semibold mb-2">Alışveriş Özeti</h4>
                <div className="text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Pro(Monthly)</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between mt-2 font-bold">
                    <span>Total:</span>
                    <span>$35.00</span>
                  </div>
                </div>
                <button
                  onClick={handlePayNow}
                  className="w-full bg-emerald-500 text-white py-2 rounded"
                >
                  Pay Now
                </button>
              </div>
            </aside>
          </div>

          <DialogFooter className="mt-4">
            <button onClick={() => onOpenChange(false)} className="px-4 py-2">
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PaymentSuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        amount={successData.amount}
        refNumber={successData.ref}
        time={successData.time}
      />
    </>
  );
};

export default CheckoutDialog;
