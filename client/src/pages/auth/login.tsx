import { ChevronLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <AuthLayout>
      {/* Top back link */}
      <div className="mb-2">
        <Link to="/">
          <Button
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Heading */}
      <div className="mb-1">
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Vibes
          </span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-500 underline">
            Sign Up
          </Link>
        </p>
      </div>
      {/* Right Side - Login Form */}
      <LoginForm />
      <div className="mt-5 text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup">
          <Button
            variant="link"
            className="text-purple-600 hover:text-purple-700 p-0"
          >
            Sign up here
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}
