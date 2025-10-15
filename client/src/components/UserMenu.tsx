import React from "react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, Crown, Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuthStore, User } from "@/store/auth-store";

export default function UserMenu() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user) as User | null;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const initials = React.useMemo(() => {
    const name = user?.name || "";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (
      (parts[0][0] || "") + (parts[parts.length - 1][0] || "")
    ).toUpperCase();
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full bg-transparent focus:outline-hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.name} alt={user?.name || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.name || (user as any)?.fullName || "Vibe User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || "user@vibes.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/premium">
                <Crown className="mr-2 h-4 w-4" />
                <span>Upgrade to Premium</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/signin">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Sign in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/signup">
                <Crown className="mr-2 h-4 w-4" />
                <span>Sign up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem asChild>
            <button
              onClick={() => logout()}
              className="w-full text-left flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
