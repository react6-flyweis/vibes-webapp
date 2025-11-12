import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { useCreateUserMutation } from "@/hooks/useAuthMutations";
import { LoadingButton } from "@/components/ui/loading-button";
import { extractApiErrorMessage } from "@/lib/apiErrors";
import { useNavigate } from "react-router";

const staffSchema = z.object({
  name: z.string().min(1, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  agreePrivacyPolicy: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must agree to the privacy policy and terms"
    ),
});

type StaffForm = z.infer<typeof staffSchema>;

export function StaffRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agreePrivacyPolicy: false,
    },
  });

  const createUserMutation = useCreateUserMutation();

  const onSubmit = async (data: StaffForm) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      agreePrivacyPolicy: data.agreePrivacyPolicy,
      role_id: 4, // Staff role
    };

    try {
      const response = await createUserMutation.mutateAsync(payload as any);

      toast({
        title: "Account Created!",
        description:
          "Welcome to Vibes! Please complete your onboarding to get started.",
      });

      navigate("/login?redirect=/staff-onboarding");
    } catch (error: any) {
      console.error("Staff signup error:", error);
      const message = extractApiErrorMessage(error);
      toast({
        title: "Registration Failed",
        description: message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[a-z]/, text: "One lowercase character" },
      { regex: /[A-Z]/, text: "One Uppercase character" },
      { regex: /\d/, text: "One number" },
      { regex: /[@$!%*?&]/, text: "One special character" },
    ];

    const passed = requirements.map((req) => ({
      ...req,
      passed: req.regex.test(password),
    }));

    score = passed.filter((r) => r.passed).length;

    return {
      score,
      requirements: passed,
      strength: score < 2 ? "weak" : score < 4 ? "medium" : "strong",
    };
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-2xl"
      >
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Your Account
          </h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={createUserMutation.isPending}
                    className="rounded-xl border-gray-200 h-10 px-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    disabled={createUserMutation.isPending}
                    className="rounded-xl border-gray-200 h-10 px-4"
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
                <FormLabel className="text-sm text-gray-600">
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      {...field}
                      disabled={createUserMutation.isPending}
                      className="rounded-xl border-gray-200 h-10 px-4"
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
                    </button>
                  </div>
                </FormControl>

                {field.value && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 w-full rounded ${
                            level <= passwordStrength.score
                              ? passwordStrength.strength === "weak"
                                ? "bg-red-500"
                                : passwordStrength.strength === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="space-y-1">
                      {passwordStrength.requirements.map((req, index) => (
                        <div
                          key={index}
                          className="flex items-center text-xs gap-2"
                        >
                          {req.passed ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={
                              req.passed
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Privacy Policy Agreement */}
        <div className="space-y-3 pt-4 border-t">
          <FormField
            control={form.control}
            name="agreePrivacyPolicy"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="agreePrivacyPolicy"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded border-gray-300 mt-1"
                  />
                </FormControl>
                <div className="space-y-1">
                  <Label
                    htmlFor="agreePrivacyPolicy"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    I agree to the{" "}
                    <a href="/privacy" className="text-pink-500 underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/terms" className="text-pink-500 underline">
                      Terms of Service
                    </a>
                    <span className="text-red-500"> *</span>
                  </Label>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all"
          isLoading={createUserMutation.isPending}
        >
          Create Account
        </LoadingButton>
      </form>
    </Form>
  );
}
