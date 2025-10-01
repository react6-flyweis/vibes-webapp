import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, LogIn, Shield, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      return await apiRequest("/api/auth/login", "POST", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged into Vibes.",
      });
      // Redirect to main dashboard
      setLocation("/");
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome to <span className="text-purple-600">Vibes</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The ultimate event planning and community platform powered by AI, blockchain, and immersive experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Events</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Users className="w-8 h-8 text-pink-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <Shield className="w-8 h-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Secure</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          disabled={loginMutation.isPending}
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
                            placeholder="Enter your password"
                            {...field}
                            disabled={loginMutation.isPending}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
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
                        <Label htmlFor="rememberMe" className="text-sm text-gray-600 dark:text-gray-400">
                          Remember me
                        </Label>
                      </FormItem>
                    )}
                  />
                  
                  <Link href="/auth/forgot-password">
                    <Button variant="link" className="text-sm text-purple-600 hover:text-purple-700 p-0">
                      Forgot password?
                    </Button>
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/signup">
                    <Button variant="link" className="text-purple-600 hover:text-purple-700 p-0">
                      Sign up here
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