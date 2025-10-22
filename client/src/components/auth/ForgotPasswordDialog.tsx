import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForgotPasswordMutation } from "@/hooks/useAuthMutations";
import { useForm } from "react-hook-form";
import { LoadingButton } from "../ui/loading-button";

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
  const { toast } = useToast();
  const mutation = useForgotPasswordMutation();

  const form = useForm<{ email: string }>({
    defaultValues: { email: initialEmail || "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      form.reset({ email: initialEmail || "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialEmail]);

  const onSubmit = async (values: { email: string }) => {
    try {
      await mutation.mutateAsync({ email: values.email });
      toast({
        title: "Sent",
        description:
          "If an account with that email exists, we've sent password reset instructions.",
      });
      onOpenChange && onOpenChange(false);
      onOpenReset && onOpenReset(values.email);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="text-center">
              <DialogTitle className="text-3xl font-bold">
                Forgot password
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your email for the verification process, we will send 4
                digits code to your email.
              </p>
            </DialogHeader>

            <div className="mt-6">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      E mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder=""
                        className="rounded-xl border-gray-200 h-12 px-4 mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <LoadingButton
                size="lg"
                className="w-full rounded bg-gradient-cta text-white text-xl py-3 shadow-2xl"
                isLoading={form.formState.isSubmitting}
              >
                Continue
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
