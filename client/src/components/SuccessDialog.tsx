import React from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export type SuccessDialogDetail = {
  label?: string;
  value?: React.ReactNode;
};

export default function SuccessDialog({
  open,
  onOpenChange,
  title = "Success",
  description,
  details,
  onDone,
  icon,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
  details?: SuccessDialogDetail[] | React.ReactNode;
  onDone?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-primary p-4">
            {icon ?? <CheckCircle className="h-8 w-8 text-white" />}
          </div>

          <DialogHeader className="text-center">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {Array.isArray(details) ? (
            <div className="space-y-2 text-sm text-gray-700 w-full text-center">
              {details.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  {d.label && <div className="font-medium">{d.label}</div>}
                  <div>{d.value ?? "-"}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center">{details ?? null}</div>
          )}

          <DialogFooter className="w-full mt-4">
            <Button
              onClick={() => {
                onDone && onDone();
                onOpenChange && onOpenChange(false);
              }}
              className="bg-gradient-cta w-full"
            >
              Done
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
