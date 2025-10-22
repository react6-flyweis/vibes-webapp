import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForgotPasswordMutation } from "@/hooks/useAuthMutations";

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  initialEmail?: string;
  onOpenReset?: (email?: string) => void;
};

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
  initialEmail,
  onOpenReset,
}: Props) {
  const [email, setEmail] = useState(initialEmail || "");
  const { toast } = useToast();
  const mutation = useForgotPasswordMutation();

  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setEmail(initialEmail || "");
  }, [open, initialEmail]);

  const validateEmail = (value: string) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(value);
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(null);

    try {
      await mutation.mutateAsync({ email });
      toast({
        title: "Sent",
        description:
          "If an account with that email exists, we've sent password reset instructions.",
      });
      // Close forgot password dialog
      onOpenChange && onOpenChange(false);
      // Open reset password dialog in parent and pass the email to prefill if desired
      onOpenReset && onOpenReset(email);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Could not send reset email",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">
            Forgot password
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email for the verification process, we will send 4 digits
            code to your email.
          </p>
        </DialogHeader>

        <div className="mt-6">
          <Label className="text-sm text-gray-600">E mail</Label>
          <Input
            type="email"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-gray-200 h-12 px-4 mt-2"
          />
        </div>

        <DialogFooter className="mt-6">
          <Button
            size="lg"
            className="w-full rounded bg-gradient-cta text-white text-xl py-3 shadow-2xl"
            onClick={handleSubmit}
            // disabled={mutation.isPending || !email}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
