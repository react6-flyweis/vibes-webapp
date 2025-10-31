import { Button } from "../ui/button";
import { Link } from "react-router";
import { useAuthStore, User } from "@/store/auth-store";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMemo } from "react";

import vibesLogo from "@/assets/icons/vibes-logo.png";

export default function Topbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);

  const user = useAuthStore((s) => s.user) as User | null;

  const initials = useMemo(() => {
    const name = user?.name || "";
    const parts = name.split(" ").filter(Boolean);

    // Handle empty name
    if (parts.length === 0) return "U";

    // Single word name
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

    // Multiple words - first and last initial
    return (
      (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")
    ).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    // Ensure we wait for logout if it returns a promise, then redirect to /login
    await Promise.resolve(logout());
    window.location.href = "/login";
  };

  return (
    <nav className="w-full h-12 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow p-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
        <img src={vibesLogo} alt="Vibes Logo" className="h-10 w-10" />

        <div className="flex gap-5 items-center">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-cta">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOutIcon />
                Logout
              </Button>
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.name} alt={user?.name || "User"} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
