import { Link, useSearchParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { VendorRegisterForm } from "@/components/auth/VendorRegisterForm";
import { StaffRegisterForm } from "@/components/auth/StaffRegisterForm";
import { Button } from "@/components/ui/button";

const ROLE_FORMS = {
  user: {
    component: RegisterForm,
    title: "Create Your Account",
    description: "Join Vibes and start planning amazing events!",
  },
  vendor: {
    component: VendorRegisterForm,
    title: "Vendor Registration",
    description: "Join our vendor marketplace and grow your business!",
  },
  staff: {
    component: StaffRegisterForm,
    title: "Staff Registration",
    description: "Join our team and help create amazing experiences!",
  },
} as const;

type RoleType = keyof typeof ROLE_FORMS;

export default function Signup() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") || "user") as RoleType;

  // Get the form configuration based on role, default to user
  const formConfig = ROLE_FORMS[role] || ROLE_FORMS.user;
  const FormComponent = formConfig.component;

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
          <p className="text-sm text-gray-500 mt-2">{formConfig.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-500 underline">
              Log in
            </Link>
          </p>
          {role === "user" && (
            <p className="text-sm text-gray-500 mt-1">
              Are you a vendor or staff?{" "}
              <Link to="/get-started" className="text-purple-500 underline">
                Register here
              </Link>
            </p>
          )}
        </div>

        <FormComponent />

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
