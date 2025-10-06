import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OtpVerificationDialog from "./OtpVerificationDialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
// ...existing code...
import {
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "@/hooks/useAuthMutations";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useLoginMutation();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // ensure the store knows whether to persist to localStorage (remember) or sessionStorage
      try {
        useAuthStore.getState().setRemember(!!data.rememberMe);
      } catch (e) {
        // ignore storage errors
      }
      const res = await loginMutation.mutateAsync(data);

      // Backend returns OTP sent response with nextStep verify-otp
      if (
        res &&
        res.data &&
        (res.data.nextStep === "verify-otp" || res.data.otp)
      ) {
        setOtpEmail(
          (res.data && (res.data.email || form.getValues("email"))) || undefined
        );
        setShowOtp(true);
        toast({
          title: "Enter verification code",
          description: "A one-time code was sent to your email.",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully logged into Vibes.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error?.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const verifyMutation = useVerifyOtpMutation();

  const resendMutation = useResendOtpMutation();

  const handleVerify = async (code: string) => {
    try {
      await verifyMutation.mutateAsync({ email: otpEmail, otp: code });
      toast({ title: "Logged in", description: "Verification successful." });
      setShowOtp(false);
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Verification failed",
        description: err?.message || "Invalid code",
        variant: "destructive",
      });
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ email: otpEmail });
      toast({
        title: "Sent",
        description: "A new code was sent to your email.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Could not resend code",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-lg"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder=""
                  {...field}
                  disabled={loginMutation.isPending}
                  className="rounded-xl border-gray-200 h-12 px-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    {...field}
                    disabled={loginMutation.isPending}
                    className="rounded-xl border-gray-200 h-12 px-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span className="uppercase text-xs">
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </FormControl>
              <Label
                htmlFor="rememberMe"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Remember me
              </Label>
            </FormItem>
          )}
        />

        <Link to="/auth/forgot-password">
          <Button
            variant="link"
            className="text-sm text-purple-600 hover:text-purple-700 p-0"
          >
            Forgot password?
          </Button>
        </Link>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded bg-gradient-cta text-white text-xl py-3 shadow-2xl"
          disabled={form.formState.isSubmitting}
        >
          login
        </Button>
      </form>
      <OtpVerificationDialog
        open={showOtp}
        onOpenChange={setShowOtp}
        email={otpEmail}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </Form>
  );
}
