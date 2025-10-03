import { useAuthStore } from "@/store/auth-store";
import { useLocation } from "wouter";

export const AuthWrapper = ({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) => {
  const [_, setLocation] = useLocation();
  // In a real app, you would check for authentication status as well
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If we're requiring authentication and the user isn't authenticated, redirect to login
  if (requireAuth && !isAuthenticated()) {
    setLocation("/get-started");
    return null; // or a loading spinner
  }

  // If we don't know their preference yet, go to personalize
  // return <Navigate to="/choose" replace />;
  return <>{children}</>;
};
