import React, { useEffect, useRef, useState } from "react";
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

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  email?: string;
  onVerify?: (code: string) => Promise<void> | void;
  onResend?: () => Promise<void> | void;
};

export default function OtpVerificationDialog({
  open,
  onOpenChange,
  email,
  onVerify,
  onResend,
}: Props) {
  const [values, setValues] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    setValues(["", "", "", ""]);
    setSecondsLeft(30);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, open]);

  const focusNext = (index: number) => {
    const next = inputsRef.current[index + 1];
    if (next) next.focus();
  };

  const focusPrev = (index: number) => {
    const prev = inputsRef.current[index - 1];
    if (prev) prev.focus();
  };

  const handleChange = (v: string, i: number) => {
    if (!/^[0-9]?$/.test(v)) return;
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v !== "") focusNext(i);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number
  ) => {
    if (e.key === "Backspace" && values[i] === "") {
      focusPrev(i);
    }
  };

  const code = values.join("");

  const handleVerify = async () => {
    if (code.length < 4) return;
    try {
      setIsVerifying(true);
      await onVerify?.(code);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResend?.();
      setSecondsLeft(30);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">Verification</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your 4 digits code that you received on your email.
          </p>
        </DialogHeader>

        <div className="mt-6 flex justify-center gap-4">
          {values.map((v, i) => (
            <Input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              onChange={(e) => handleChange(e.target.value.trim(), i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-20 h-20 text-center text-2xl rounded-xl border-gray-200"
              inputMode="numeric"
              autoFocus={i === 0}
              maxLength={1}
            />
          ))}
        </div>

        <div className="mt-4 text-center">
          <span className="text-orange-500 font-medium">
            {secondsLeft.toString().padStart(2, "0")
              ? `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "00:00"}
          </span>
        </div>

        <DialogFooter className="mt-6">
          <Button
            size="lg"
            className="w-full rounded bg-gradient-cta text-white text-xl py-3 shadow-2xl"
            onClick={handleVerify}
            disabled={isVerifying || code.length < 4}
          >
            Continue
          </Button>
        </DialogFooter>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            If you didn't receive a code!{" "}
            <button
              className="text-orange-500 underline font-medium disabled:opacity-50"
              onClick={handleResend}
              disabled={secondsLeft > 0 || isResending}
            >
              Resend
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
