import { IVibeBusinessActiveSubscription } from "@/hooks/useVibeBusinessActiveSubscription";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUnsubscribeVibeBusinessSubscription } from "@/mutations/useUnsubscribeVibeBusinessSubscription";

type Props = {
  subscription: IVibeBusinessActiveSubscription;
};

const formatDate = (d?: string | null) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

const ActiveSubscriptionCard: React.FC<Props> = ({ subscription }) => {
  const [error, setError] = useState<string | null>(null);
  const unsubscribeMutation = useUnsubscribeVibeBusinessSubscription({
    onError(err) {
      setError((err as any)?.message || "Failed to unsubscribe");
    },
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const plan = subscription.plan_details;
  const tx = subscription.transaction_details;

  const now = new Date();
  const ends = subscription.end_plan_date
    ? new Date(subscription.end_plan_date)
    : null;
  const daysLeft = ends
    ? Math.ceil((ends.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="card bg-gray-900 bg-opacity-70 rounded-xl p-6 shadow-2xl text-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm opacity-90">Active Subscription</div>
          <div className="text-2xl font-bold mt-1">
            {plan?.plan_name || "Your Plan"}
          </div>
          <div className="text-sm opacity-80 mt-2">{plan?.description}</div>
        </div>

        <div className="text-right">
          <div className="text-sm opacity-80">Status</div>
          <div className="text-lg font-semibold mt-1">
            {subscription.transaction_status ||
              (subscription.status ? "Active" : "Inactive")}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-90">
        <div>
          <div className="text-xs opacity-70">Start</div>
          <div className="font-medium">
            {formatDate(subscription.start_plan_date)}
          </div>
        </div>

        <div>
          <div className="text-xs opacity-70">End</div>
          <div className="font-medium">
            {formatDate(subscription.end_plan_date)}
          </div>
          {daysLeft !== null && (
            <div className="text-xs opacity-80 mt-1">
              {daysLeft >= 0
                ? `${daysLeft} day(s) left`
                : `expired ${Math.abs(daysLeft)} day(s) ago`}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs opacity-70">Amount</div>
          <div className="font-medium">
            ${tx?.amount ?? plan?.price ?? "0.00"}
          </div>
          <div className="text-xs opacity-80 mt-1">
            Ref: {tx?.reference_number || subscription.transaction_id || "—"}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm opacity-85">
        <div>
          Transaction status:{" "}
          <span className="font-medium">
            {tx?.status || subscription.transaction_status || "—"}
          </span>
        </div>
        <div className="mt-2">
          Transaction date:{" "}
          <span className="font-medium">
            {tx?.transaction_date
              ? new Date(tx.transaction_date).toLocaleString()
              : "—"}
          </span>
        </div>
      </div>
      {error && <div className="mt-3 text-sm text-red-400">Error: {error}</div>}

      <div className="mt-4 flex items-center justify-end">
        <button
          className="btn bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 text-sm"
          onClick={() => {
            setError(null);
            setConfirmText("");
            setConfirmOpen(true);
          }}
          disabled={unsubscribeMutation.status === "pending"}
        >
          {unsubscribeMutation.status === "pending"
            ? "Unsubscribing..."
            : "Unsubscribe"}
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Unsubscribe</DialogTitle>
          </DialogHeader>

          <div className="mt-2 text-sm">
            To confirm unsubscribing, type{" "}
            <span className="font-mono">unsubscribe</span> below then click
            Confirm.
          </div>

          <div className="mt-4">
            <input
              className="w-full rounded border px-3 py-2 text-black"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type 'unsubscribe' to confirm"
            />
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </div>

          <DialogFooter>
            <div className="mt-4 flex w-full justify-end space-x-2">
              <button
                className="btn bg-gray-600 hover:bg-gray-700 text-white rounded-full px-4 py-2 text-sm"
                onClick={() => {
                  setConfirmOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                className="btn bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 text-sm"
                onClick={() => {
                  setError(null);
                  if (confirmText.trim().toLowerCase() !== "unsubscribe") {
                    setError("You must type 'unsubscribe' to confirm.");
                    return;
                  }
                  const id =
                    subscription.vibe_business_plan_subscribed_id ||
                    subscription._id;
                  if (!id) {
                    setError("No subscription id");
                    return;
                  }
                  unsubscribeMutation.mutate(id as any);
                  setConfirmOpen(false);
                }}
                disabled={unsubscribeMutation.status === "pending"}
              >
                Confirm
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveSubscriptionCard;
