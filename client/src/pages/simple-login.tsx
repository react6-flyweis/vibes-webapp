import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router";

export default function SimpleLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      id: 1,
      username: loginData.username || "demo_user",
      email: (loginData.username || "demo") + "@vibes.com",
      fullName: loginData.username || "Demo User",
      subscriptionTier: "free",
    };
    localStorage.setItem("vibes_user", JSON.stringify(userData));

    toast({
      title: "Welcome back!",
      description: "You're now logged in to your event planning dashboard!",
    });
    navigate("/");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const userData = {
      id: 1,
      username: signupData.username,
      email: signupData.email,
      fullName: signupData.fullName,
      subscriptionTier: "free",
    };
    localStorage.setItem("vibes_user", JSON.stringify(userData));

    toast({
      title: "Account Created!",
      description:
        "Welcome to Vibes! Your account has been created successfully.",
    });
    navigate("/");
  };

  const quickDemo = () => {
    const userData = {
      id: 1,
      username: "demo_user",
      email: "demo@vibes.com",
      fullName: "Demo User",
      subscriptionTier: "free",
    };
    localStorage.setItem("vibes_user", JSON.stringify(userData));

    toast({
      title: "Demo Access Granted!",
      description: "Explore all the revolutionary features of Vibes.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Vibes</h1>
          <p className="text-gray-600 mt-2">
            Your ultimate event planning companion
          </p>
        </div>

        {/* Quick Demo Access */}
        <div className="mb-6">
          <Button
            onClick={quickDemo}
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Try Demo (Instant Access)
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-center text-sm text-gray-500 mt-2">
            Explore all features including AI Vibe Curator, Virtual Party Twin,
            and more!
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-500">
              Or continue with account
            </span>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xs">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">
                  Sign in to your account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username or Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        className="pl-10"
                        value={loginData.username}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            username: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">
                  Create your account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={signupData.fullName}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            fullName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newUsername">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newUsername"
                        type="text"
                        placeholder="Choose a username"
                        className="pl-10"
                        value={signupData.username}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Create Account
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
