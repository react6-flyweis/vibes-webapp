import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  cancellationReason: string;
  setCancellationReason: (v: string) => void;
  processRefund: boolean;
  setProcessRefund: (v: boolean) => void;
  selectedBookingForCancel: any | null;
  onConfirm: () => void;
  formatMoney: (value: number | string | undefined | null) => string;
  getCancellationBreakdown: (booking: any) => {
    original: number | null;
    fee: number | null;
    refund: number | null;
  };
  getCancellationRefundEstimate: (booking: any) => string | null;
}

export default function CancelConfirmationDialog({
  open,
  onOpenChange,
  isPending,
  cancellationReason,
  setCancellationReason,
  processRefund,
  setProcessRefund,
  selectedBookingForCancel,
  onConfirm,
  formatMoney,
  getCancellationBreakdown,
  getCancellationRefundEstimate,
}: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(openState) => {
        onOpenChange(openState);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="px-4">
          <div className="mb-3">
            <label className="text-sm font-medium">Cancellation reason</label>
            <Textarea
              placeholder="Optional: provide a reason for cancellation"
              value={cancellationReason}
              onChange={(e: any) => setCancellationReason(e.target.value)}
              rows={3}
            />
          </div>

          {selectedBookingForCancel && (
            <div className="px-4 pt-2 pb-3">
              {processRefund ? (
                <div className="text-sm space-y-1">
                  {(() => {
                    // Prefer explicit Cancellation_Charge on the booking when present.
                    // Fall back to the generic breakdown helper otherwise.
                    const breakdown = getCancellationBreakdown(
                      selectedBookingForCancel
                    );
                    const original =
                      breakdown.original ??
                      Number(
                        selectedBookingForCancel.amount ??
                          selectedBookingForCancel.vendor_price ??
                          selectedBookingForCancel.vendor_amount ??
                          selectedBookingForCancel.transaction_amount ??
                          null
                      );

                    const explicitCharge =
                      selectedBookingForCancel?.Cancellation_Charge ??
                      selectedBookingForCancel?.cancellation_charge ??
                      null;

                    const fee =
                      explicitCharge !== null && explicitCharge !== undefined
                        ? Number(explicitCharge)
                        : breakdown.fee;

                    const refund =
                      original != null && fee != null ? original - fee : null;

                    return (
                      <>
                        <div>
                          <strong>Original amount:</strong>{" "}
                          {formatMoney(original)}
                        </div>
                        <div>
                          <strong>Cancellation fee:</strong>{" "}
                          {fee !== null && fee !== undefined
                            ? formatMoney(fee)
                            : "Unknown"}
                        </div>
                        <div>
                          <strong>Estimated refund:</strong>{" "}
                          {(refund !== null &&
                            refund !== undefined &&
                            formatMoney(refund)) ||
                            getCancellationRefundEstimate(
                              selectedBookingForCancel
                            )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-sm">Refund will not be processed</div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox
              id="process-refund"
              checked={processRefund}
              onCheckedChange={(v: any) => setProcessRefund(Boolean(v))}
            />
            <label htmlFor="process-refund" className="text-sm">
              Process refund (if applicable)
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            No, keep it
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Cancelling..." : "Yes, cancel booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
