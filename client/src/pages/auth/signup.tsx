import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, UserPlus, Shield, Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           "Password must contain uppercase, lowercase, number, and special character"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  subscribeNewsletter: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
      subscribeNewsletter: true,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      return await apiRequest("/api/auth/signup", "POST", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created!",
        description: "Welcome to Vibes! Please check your email to verify your account.",
      });
      // Redirect to login page after successful signup
      setLocation("/auth/login");
    },
    onError: (error: any) => {
      console.error("Signup error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[a-z]/, text: "Lowercase letter" },
      { regex: /[A-Z]/, text: "Uppercase letter" },
      { regex: /\d/, text: "Number" },
      { regex: /[@$!%*?&]/, text: "Special character" },
    ];

    const passed = requirements.map(req => ({
      ...req,
      passed: req.regex.test(password)
    }));

    score = passed.filter(req => req.passed).length;

    return {
      score,
      requirements: passed,
      strength: score < 2 ? "weak" : score < 4 ? "medium" : "strong"
    };
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Join <span className="text-purple-600">Vibes</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create unforgettable events with AI-powered planning, blockchain security, and immersive experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-xs">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Events</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-xs">
              <Users className="w-8 h-8 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-xs">
              <Shield className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure</span>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Join thousands of event creators on Vibes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            disabled={signupMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            disabled={signupMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={signupMutation.isPending}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...field}
                            disabled={signupMutation.isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      
                      {/* Password strength indicator */}
                      {field.value && (
                        <div className="mt-2 space-y-2">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((level) => (
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
                              <div key={index} className="flex items-center text-xs gap-2">
                                {req.passed ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-red-500" />
                                )}
                                <span className={req.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            disabled={signupMutation.isPending}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
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
                            id="agreeToTerms"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 rounded border-gray-300 mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 dark:text-gray-400">
                            I agree to the{" "}
                            <Link href="/terms">
                              <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 h-auto text-sm underline">
                                Terms of Service
                              </Button>
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy">
                              <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0 h-auto text-sm underline">
                                Privacy Policy
                              </Button>
                            </Link>
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
                            id="subscribeNewsletter"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </FormControl>
                        <Label htmlFor="subscribeNewsletter" className="text-sm text-gray-600 dark:text-gray-400">
                          Subscribe to our newsletter for event tips and platform updates
                        </Label>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/auth/login">
                    <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0">
                      Sign in here
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}