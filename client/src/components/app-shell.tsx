import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchActions from "./SearchActions";
import { Bell, Sparkles, Sun, Moon } from "lucide-react";

// Swiper Imports
import DesktopNav from "./DesktopNav";
import MobileNavSheet from "./MobileNavSheet";
import { navigationItems } from "./app-shell-data";

import TopBar from "./Topbar/TopBar";
import Footer from "./HomPage/Footer";

interface AppShellProps {
  children: React.ReactNode;
}

// navigationItems and quickActions are now imported from app-shell-data

export function AppShell({ children }: AppShellProps) {
  const [location, setLocation] = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            setIsCommandOpen(true);
            break;
          case "n":
            e.preventDefault();
            setLocation("/create-event");
            break;
          case "d":
            e.preventDefault();
            setLocation("/vibescard-studio");
            break;
          case "v":
            e.preventDefault();
            setLocation("/natural-venue-showcase");
            break;
          case "a":
            e.preventDefault();
            setLocation("/vibebot-assistant");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <TopBar />

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md dark:bg-black/80 dark:border-gray-800">
          <div className="container mx-auto h-16 flex items-center justify-between max-w-7xl p-1">
            {/* Logo and Brand */}
            <div className="flex gap-5">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Vibes
                  </span>
                </Link>
              </div>

              <DesktopNav categories={navigationItems} />
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <SearchActions />

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
              </Button>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <MobileNavSheet categories={navigationItems} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Quick Action Fab */}
        {/* <div className="fixed bottom-6 right-6 z-40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {quickActions.map((action) => (
                <DropdownMenuItem key={action.name} asChild>
                  <Link href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    <span>{action.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {action.shortcut}
                    </Badge>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}

        {location !== "/" && <Footer />}
      </div>
    </>
  );
}
