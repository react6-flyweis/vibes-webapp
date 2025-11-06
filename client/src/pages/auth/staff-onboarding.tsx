import { Link, useSearchParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { StaffOnboardingForm } from "@/components/auth/StaffOnboardingForm";
import { Button } from "@/components/ui/button";

export default function StaffOnboarding() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  if (!userId) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Invalid Access
          </h1>
          <p className="text-gray-600 mb-4">
            User ID is required to complete onboarding.
          </p>
          <Link to="/staff-register">
            <Button>Back to Registration</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mb-2">
          <Link to="/staff-register">
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
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Almost there! Fill in the details below to complete your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold">
              Vibes
            </span>{" "}
            staff onboarding.
          </p>
        </div>

        <StaffOnboardingForm userId={userId} />

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Need help?{" "}
          <Link to="/support">
            <Button
              variant="link"
              className="text-purple-600 hover:text-purple-700 p-0"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
