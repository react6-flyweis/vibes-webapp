import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface BookedInfo {
  vendorName?: string | null;
  menuName?: string | null;
  guestCount?: number | string | null;
  pricePerPerson?: number | null;
  totalAmount?: number | null;
  date?: string | null;
  time?: string | null;
}

export default function BookedSuccessDialog({
  open,
  onOpenChange,
  info,
  onDone,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  info: BookedInfo | null;
  onDone: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-emerald-500 p-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl">Booked</DialogTitle>
            <DialogDescription className="text-lg font-medium">
              {info?.vendorName ?? "Vendor"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1 text-sm text-gray-700 w-full text-left">
            <div>
              <span className="font-medium">Service:</span>{" "}
              {info?.menuName ?? "-"}
            </div>
            <div>
              <span className="font-medium">Guests / Hours:</span>{" "}
              {info?.guestCount ?? "-"}
            </div>
            <div>
              <span className="font-medium">Price:</span>{" "}
              {info?.pricePerPerson != null
                ? `$${Number(info.pricePerPerson).toFixed(2)}`
                : "-"}
            </div>
            <div className="font-semibold">
              Total:{" "}
              {info?.totalAmount != null
                ? `$${Number(info.totalAmount).toFixed(2)}`
                : "-"}
            </div>
            <div className="text-sm text-gray-600">{info?.date ?? "-"}</div>
            <div className="text-sm text-gray-600">{info?.time ?? "-"}</div>
          </div>

          <DialogFooter className="w-full mt-4">
            <Button
              onClick={() => {
                onDone();
                onOpenChange && onOpenChange(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
