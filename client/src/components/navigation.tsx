import { Link, NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Calendar,
  Users,
  Sparkles,
  Store,
  Crown,
  Building2,
  User,
  Menu,
  X,
  Monitor,
  ChevronDown,
  Brain,
  Music,
  Video,
  Leaf,
  Trophy,
  Clock,
  PartyPopper,
  CalendarPlus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const coreNavigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/plan-event/", label: "Plan My Event", icon: CalendarPlus },
    { path: "/event-discovery", label: "My Events", icon: Calendar },
    { path: "/vendors", label: "Vendors", icon: Store },
  ];

  // const aiFeatures = [
  //   { path: "/ai-party-designer", label: "AI Party Designer", icon: Sparkles },
  //   {
  //     path: "/ai-theme-generator",
  //     label: "AI Theme Generator",
  //     icon: Sparkles,
  //   },
  //   { path: "/ai-vibe-analyzer", label: "AI Vibe Analyzer", icon: Brain },
  //   { path: "/ai-vibe-modeling", label: "AI Vibe Modeling", icon: Brain },
  //   { path: "/smart-scheduling", label: "Smart Scheduling", icon: Clock },
  //   { path: "/vibebot-assistant", label: "VibeBots Assistant", icon: Brain },
  //   {
  //     path: "/voice-activated-assistant",
  //     label: "Voice Assistant",
  //     icon: Brain,
  //   },
  // ];

  // const experienceFeatures = [
  //   {
  //     path: "/nightclub-experience",
  //     label: "Nightclub Experience",
  //     icon: PartyPopper,
  //   },
  //   { path: "/live-music-voting", label: "Live Music Voting", icon: Music },
  //   {
  //     path: "/livestream-companion",
  //     label: "Livestream Companion",
  //     icon: Video,
  //   },
  //   { path: "/ar-space-planner", label: "3D/AR Space Planner", icon: Monitor },
  //   { path: "/ar-preview", label: "AR Preview", icon: Monitor },
  //   { path: "/ar-vr-immersive", label: "VR Immersive", icon: Monitor },
  //   { path: "/guest-matchmaking", label: "Guest Matchmaking", icon: Users },
  //   {
  //     path: "/interactive-design-generator",
  //     label: "Design Generator",
  //     icon: Sparkles,
  //   },
  //   {
  //     path: "/interactive-mood-visualizer",
  //     label: "Mood Visualizer",
  //     icon: Brain,
  //   },
  //   {
  //     path: "/adaptive-environment",
  //     label: "Adaptive Environment",
  //     icon: PartyPopper,
  //   },
  // ];

  // const platformFeatures = [
  //   {
  //     path: "/virtual-meeting-platform",
  //     label: "Virtual Meetings",
  //     icon: Monitor,
  //   },
  //   { path: "/social-groups", label: "Social Groups", icon: Users },
  //   { path: "/vibescard-studio", label: "Vibes Card Studio", icon: Sparkles },
  //   { path: "/vibeledger-dashboard", label: "Vibe Ledger", icon: Crown },
  //   { path: "/smart-contract-escrow", label: "Smart Contracts", icon: Crown },
  //   {
  //     path: "/sustainability-tracker",
  //     label: "Sustainability Tracker",
  //     icon: Leaf,
  //   },
  //   { path: "/host-achievements", label: "Host Achievements", icon: Trophy },
  //   { path: "/premium", label: "Premium Dashboard", icon: Crown },
  // ];

  // const businessItems = [
  //   { path: "/vendor-onboarding", label: "Join as Vendor", icon: Building2 },
  //   { path: "/business-promotion", label: "Advertise", icon: Store },
  //   { path: "/vendor-marketplace", label: "Vendor Hub", icon: Store },
  //   { path: "/system-overview", label: "System Overview", icon: Monitor },
  // ];
  const businessItems = [
    { path: "/vendor-onboarding", label: "Join as Vendor", icon: Building2 },
    { path: "#", label: "Advertise", icon: Store },
    { path: "#", label: "Vendor Hub", icon: Store },
    { path: "#", label: "System Overview", icon: Monitor },
  ];

  // active state is now determined by NavLink from react-router

  return (
    <>
            {/* Desktop Navigation */}     
      <nav className="hidden md:flex items-center justify-between p-4 bg-[#111827] text-black dark:bg-gray-900 border-b border-[#111827] dark:border-gray-700 sticky top-0 z-40 backdrop-blur-xs max-w-full overflow-x-scroll">
           
        <div className="flex items-center space-x-8">
          <Link to="/">
             
            <div className="flex items-center space-x-2">
               
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />     
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vibes    
              </span>
            </div>
             
          </Link>

          <div className="flex items-center space-x-1">
             
            {coreNavigationItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === "/"}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      "bg-white text-gray-800",
                      "hover:bg-blue-600 hover:text-white",
                      isActive && "bg-blue-600 text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                )}
              </NavLink>
            ))}
            {/* AI Features Dropdown */}           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-white"
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Features</span>
                  <ChevronDown className="w-3 h-3" />               
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent>
                {aiFeatures.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className="flex items-center space-x-2 w-full"
                    >
                      <item.icon className="w-4 h-4" />     {" "}
                      <span>{item.label}</span>                   
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent> */}
            </DropdownMenu>
            {/* Experience Features Dropdown */}           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-white"
                >
                  <PartyPopper className="w-4 h-4" />
                  <span>Experiences</span>
                  <ChevronDown className="w-3 h-3" />               
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent>
                {experienceFeatures.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className="flex items-center space-x-2 w-full"
                    >
                      <item.icon className="w-4 h-4" />     {" "}
                      <span>{item.label}</span>                   
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent> */}
            </DropdownMenu>
            {/* Platform Features Dropdown */}           
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-white"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Platform</span>
                  <ChevronDown className="w-3 h-3" />               
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent>
                {platformFeatures.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className="flex items-center space-x-2 w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent> */}
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {businessItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* <NavLink to="/profile">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
            )}
          </NavLink> */}
        </div>
      </nav>
      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />             
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vibes              
              </span>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
        {/* Mobile Menu */}       
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="p-4 space-y-2">
              {coreNavigationItems.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.path === "/"}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  )}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                {businessItems.map((item) => (
                  // <Link key={item.path} to={item.path}>
                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
                {/* </Link> */} 
                {/* <NavLink to="/profile">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" /> <span>Profile</span>
                    </Button>
                  )}
                </NavLink> */}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
