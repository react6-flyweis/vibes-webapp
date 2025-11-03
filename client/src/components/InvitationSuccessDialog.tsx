import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import checkGif from "@/assets/images/check.gif";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: React.ReactNode;
};

export default function InvitationSuccessDialog({
  open,
  onOpenChange,
  title = "Invitation Sent",
  description = "You have successfully completed the payment, and your invitation will be sent to your guests.",
}: Props) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <div className="flex flex-col items-center gap-4 py-6">
          <img
            src={checkGif}
            alt="success"
            className="size-72 object-contain rounded-md "
          />

          <DialogHeader className="text-center mt-2">
            <DialogTitle className="text-2xl font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-700">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="w-full">
            <Button
              className="w-full bg-purple-600 text-white"
              onClick={() => {
                onOpenChange(false);
                // navigate back to home/dash
                navigate("/");
              }}
            >
              Go Back to Home
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
