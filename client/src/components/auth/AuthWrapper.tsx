import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "react-router";

export const AuthWrapper = ({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) => {
  const navigate = useNavigate();
  // In a real app, you would check for authentication status as well
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If we're requiring authentication and the user isn't authenticated, redirect to login
  if (requireAuth && !isAuthenticated()) {
    navigate("/get-started");
    return null; // or a loading spinner
  }

  // If we don't know their preference yet, go to personalize
  // return <Navigate to="/choose" replace />;
  return <>{children}</>;
};
