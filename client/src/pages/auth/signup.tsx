import { Link, useSearchParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { VendorRegisterForm } from "@/components/auth/VendorRegisterForm";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const isVendor = searchParams.get("role") === "vendor" || false;

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mb-2">
          <Link to="/get-started">
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Vibes
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 underline">
              Log in
            </Link>
          </p>
        </div>

        {isVendor ? <VendorRegisterForm /> : <RegisterForm />}

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login">
            <Button variant="link">Sign in here</Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
