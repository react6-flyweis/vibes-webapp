import { Button } from "../ui/button";
import UserMenu from "../UserMenu";
import LogoHeart from "./LogoHeart";
import { Link } from "wouter";
import { useAuthStore } from "@/store/auth-store";
import { LogOutIcon } from "lucide-react";

const Topbar: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-full h-12 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow p-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto h-full">
        <LogoHeart />

        <div className="flex gap-5 items-center">
          {!isAuthenticated ? (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-cta">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOutIcon />
                Logout
              </Button>
              <UserMenu />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
