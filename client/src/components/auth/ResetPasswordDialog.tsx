import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResetPasswordMutation } from "@/hooks/useAuthMutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoadingButton } from "../ui/loading-button";

type Props = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  email?: string;
  otp?: string;
  onSuccess?: () => void;
};

export default function ResetPasswordDialog({
  open,
  onOpenChange,
  email,
  otp,
  onSuccess,
}: Props) {
  const { toast } = useToast();
  const mutation = useResetPasswordMutation();

  const form = useForm<{ password: string; confirm: string }>({
    defaultValues: { password: "", confirm: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (open) {
      form.reset({ password: "", confirm: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = async (values: { password: string; confirm: string }) => {
    if (values.password.length < 8) {
      toast({
        title: "Invalid",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    if (values.password !== values.confirm) {
      toast({
        title: "Invalid",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await mutation.mutateAsync({ email, otp, newPassword: values.password });
      toast({
        title: "Password updated",
        description: "You can now log in with your new password.",
      });
      onOpenChange && onOpenChange(false);
      onSuccess && onSuccess();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Could not update password",
        variant: "destructive",
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="text-center">
              <DialogTitle className="text-3xl font-bold">
                New Password
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Set the new password for your account so you can login and
                access all features.
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Enter new password
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="8 symbols at least"
                          className="rounded-xl border-gray-200 h-12 px-4 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm"
                rules={{ required: "Please confirm password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <Input
                          {...field}
                          type={showConfirm ? "text" : "password"}
                          placeholder="8 symbols at least"
                          className="rounded-xl border-gray-200 h-12 px-4 pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                        >
                          {showConfirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <LoadingButton
                type="submit"
                size="lg"
                className="w-full rounded bg-gradient-cta text-white "
                isLoading={form.formState.isSubmitting || mutation.isPending}
              >
                UPDATE PASSWORD
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
