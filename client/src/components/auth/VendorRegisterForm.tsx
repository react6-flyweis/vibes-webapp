import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const vendorSchema = z.object({
  businessName: z.string().min(1, "Please enter your business name"),
  contactPersonName: z.string().min(1, "Please enter contact person name"),
  businessCategory: z.string().min(1, "Please select a business category"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  agreeToTerms: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must agree to the terms and conditions"
    ),
  subscribeNewsletter: z.boolean().optional(),
});

type VendorForm = z.infer<typeof vendorSchema>;

export function VendorRegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      businessName: "",
      contactPersonName: "",
      businessCategory: "",
      email: "",
      password: "",
      agreeToTerms: false,
      subscribeNewsletter: true,
    },
  });

  // Use the centralized hook which posts to /api/users/create
  const createUserMutation = useCreateUserMutation();

  const onSubmit = async (data: VendorForm) => {
    // Map vendor form fields to API payload
    const payload = {
      name: data.contactPersonName,
      email: data.email,
      password: data.password,
      agreePrivacyPolicy: !!data.agreeToTerms,
      business_name: data.businessName,
      business_category_id: getCategoryId(data.businessCategory),
      role_id: 3, // Vendor role
    };

    try {
      // Await the mutation so we can handle success inline
      await createUserMutation.mutateAsync(payload);

      toast({
        title: "Vendor Account Created!",
        description:
          "Welcome to Vibes! Please check your email to verify your vendor account.",
      });
      navigate("/login?redirect=/vendor-onboarding");
    } catch (error: any) {
      console.error("Vendor signup error:", error);
      const message = extractApiErrorMessage(error);
      toast({
        title: "Registration Failed",
        description: message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to map category name to ID
  const getCategoryId = (category: string): number => {
    const categoryMap: Record<string, number> = {
      "Beverage & Liquor": 1,
      Catering: 2,
      Entertainment: 3,
      Venue: 4,
      Decor: 5,
      Other: 6,
    };
    return categoryMap[category] || 6; // Default to "Other"
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

  // Small categories list — keep it short and easy to extend later
  const categories = [
    "Beverage & Liquor",
    "Catering",
    "Entertainment",
    "Venue",
    "Decor",
    "Other",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-lg"
      >
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Business Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome Company"
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
          name="contactPersonName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Contact Person Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Jane Doe"
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
          name="businessCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-600">
                Business Category
              </FormLabel>
              <FormControl>
                <select
                  {...field}
                  disabled={createUserMutation.isPending}
                  className="w-full rounded-xl border border-gray-200 h-10 px-4 text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
              <FormLabel className="text-sm text-gray-600">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@business.com"
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
              <FormLabel className="text-sm text-gray-600">Password</FormLabel>
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

        <div className="space-y-3">
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="agreeToTermsVendor"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded border-gray-300 mt-1"
                  />
                </FormControl>
                <div className="space-y-1">
                  <Label
                    htmlFor="agreeToTermsVendor"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    I want to receive emails about the product, feature updates,
                    events, and marketing promotions.
                  </Label>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscribeNewsletter"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="subscribeNewsletterVendor"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </FormControl>
                <Label
                  htmlFor="subscribeNewsletterVendor"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Subscribe to our newsletter for vendor tips and platform
                  updates
                </Label>
              </FormItem>
            )}
          />
        </div>

        <LoadingButton
          type="submit"
          className="w-full rounded bg-gradient-cta text-white text-xl py-3 shadow-2xl "
          isLoading={createUserMutation.isPending}
        >
          Sign up as vendor
        </LoadingButton>
      </form>
    </Form>
  );
}
