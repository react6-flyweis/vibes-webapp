import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Home,
  Calendar,
  Users,
  Palette,
  MapPin,
  Armchair,
  Mail,
  Sparkles,
  Settings,
  FileText,
  Search,
  Bell,
  Menu,
  Plus,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Globe,
  Shield,
  Crown,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
  Moon,
  Sun,
  Share2,
  ShoppingBag,
  Blocks,
  Briefcase,
  Brain,
  Code2,
  LineChart,
  Layout,
  Megaphone,
  UserCheck,
  Database,
} from "lucide-react";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import TopBar from './Topbar/TopBar';
import Footer from './HomPage/Footer';

interface AppShellProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: 'Events',
    items: [
      { name: 'Home', href: '/', icon: Home, description: 'Your event dashboard' },
      { name: 'List New Event', href: '/create-event', icon: Plus, description: 'Start planning your event' },
      { name: 'Search Event', href: '/event-discovery', icon: Search, description: 'Find events to attend' },
      { name: 'Play My Event', href: '/enhanced-event/1', icon: Calendar, description: 'Book and manage tickets' },
    ]
  },
  {
    title: 'Design Studio',
    items: [
      { name: 'VibesCard Studio', href: '/vibescard-studio', icon: Palette, description: 'Create stunning invitations' },
      { name: 'Complete Invite Workflow', href: '/complete-invite-workflow', icon: Mail, description: 'Full invitation system demo' },
      { name: 'Evite Templates', href: '/evite-templates', icon: FileText, description: 'Professional invitation templates' },
      { name: 'Design Generator', href: '/interactive-design-generator', icon: Sparkles, description: 'AI-powered design creation' },
      { name: 'Social Design Studio', href: '/social-design-studio', icon: Users, description: 'Collaborative design workspace' },
      { name: 'Design Community', href: '/collaborative-design-sharing', icon: Share2, description: 'Share and remix designs' },
      { name: 'Party Hall Decorator', href: '/party-hall-decorator', icon: Armchair, description: '3D venue decoration' },
    ]
  },
  {
    title: 'Venues & Spaces',
    items: [
      { name: 'Venue Showcase', href: '/natural-venue-showcase', icon: MapPin, description: 'Immersive venue tours' },
      { name: 'Seat Tracker', href: '/interactive-seat-tracker', icon: Armchair, description: 'Smart seating management' },
      { name: 'AR Space Planner', href: '/ar-space-planner', icon: Zap, description: 'Augmented reality planning' },
      { name: 'Virtual Party Twin', href: '/virtual-party-twin', icon: Globe, description: 'Digital event replica' },
    ]
  },
  {
    title: 'Marketplace',
    items: [
      { name: 'Vendor Marketplace', href: '/vendor-marketplace', icon: Star, description: 'Find event vendors' },
      { name: 'Staffing Marketplace', href: '/staffing-marketplace', icon: Users, description: 'Hire event staff' },
      { name: 'Catering Services', href: '/catering-marketplace', icon: Heart, description: 'Food and beverage options' },
    ]
  },
  {
    title: 'AI Features',
    items: [
      { name: 'AI Theme Generator', href: '/ai-theme-generator', icon: Sparkles, description: 'Intelligent theme suggestions' },
      { name: 'AI Party Designer', href: '/ai-party-designer', icon: Palette, description: 'Complete party planning' },
      { name: 'AI Vibe Analyzer', href: '/ai-vibe-analyzer', icon: TrendingUp, description: 'Event mood analysis' },
      { name: 'VibeBot Assistant', href: '/vibebot-assistant', icon: Zap, description: 'Your AI event assistant' },
    ]
  },
  {
    title: 'Community',
    items: [
      { name: 'Global Vibe Passport', href: '/global-vibe-passport', icon: Globe, description: 'Your loyalty passport and rewards' },
      { name: 'AI Media Suite', href: '/ai-party-media-suite', icon: Sparkles, description: 'Post-event content creation' },
      { name: 'Event DAO', href: '/event-dao', icon: Shield, description: 'Decentralized event governance' },
      { name: 'Vibe Control', href: '/vibe-control', icon: Zap, description: 'Real-time party interaction' },
      { name: 'In-Event Commerce', href: '/in-event-commerce', icon: ShoppingBag, description: 'Real-time party shopping' },
      { name: 'Cultural DNA Layer', href: '/cultural-dna-layer', icon: Globe, description: 'Cultural storytelling and education' },
    ]
  },
  {
    title: 'Premium',
    items: [
      { name: 'Premium Dashboard', href: '/premium-dashboard', icon: Crown, description: 'Premium features access' },
      { name: 'Enterprise Suite', href: '/enterprise-suite', icon: Shield, description: 'Business solutions' },
      { name: 'Corporate Dashboard', href: '/corporate-dashboard', icon: TrendingUp, description: 'Corporate event management' },
    ]
  },
  {
  title: 'Business Tools',
  items: [
    { name: 'Business Tools Integration', href: '/business-tools', icon: Blocks, description: 'Unified platform management and cross system synchronization' },
    { name: 'Vibes Business', href: '/vibes-business', icon: Briefcase, description: 'Business subscription plan' },
    { name: 'AI CRM Intelligence', href: '/ai-crm', icon: Brain, description: 'AI-powered CRM with predictive analytics' },
    { name: 'Premium Dashboard', href: '/premium-dashboard', icon: Crown, description: 'Premium features access' },
    { name: 'Enterprise API', href: '/enterprise-api', icon: Code2, description: 'API keys, webhooks, and SDK documentation' },
    { name: 'Vibes HR Platform', href: '/vibes-hr', icon: Users, description: 'Standalone HR management with culture focus' },
    { name: 'Corporate Dashboard', href: '/corporate-dashboard', icon: TrendingUp, description: 'Corporate event management' },
    { name: 'Advanced Business Intelligence', href: '/advanced-bi', icon: LineChart, description: 'Sophisticated analytical algorithms powering intelligent business' },
    { name: 'CRM Dashboard', href: '/crm-dashboard', icon: Layout, description: 'Customer relationship management' },
    { name: 'Marketing Automation', href: '/marketing-automation', icon: Megaphone, description: 'AI-powered marketing automation for Vibes Platform' },
    { name: 'Enterprise Suite', href: '/enterprise-suite', icon: Shield, description: 'Business solutions' },
    { name: 'HR Platform Integration', href: '/hr-platform-integration', icon: UserCheck, description: 'Workplace culture, attendance tracking, and wellness credits' },
    { name: 'VIBES ERP', href: '/vibes-erp', icon: Database, description: 'Comprehensive Enterprise Resource Planning Platform' },
  ]
},
{
  title: 'Political Campaign',
  items: [
    { name: 'Campaign Dashboard', href: '/campaign-dashboard', icon: TrendingUp, description: 'Complete campaign management platform' },
    { name: 'AI Volunteer Motivation', href: '/ai-volunteer-motivation', icon: Users, description: 'AI-powered volunteer engagement' },
    { name: 'Supporter Journey', href: '/supporter-journey', icon: TrendingUp, description: 'Interactive supporter engagement journey' },
    { name: 'Gamified Milestones', href: '/gamified-milestones', icon: Star, description: 'Achievement system with celebration animations' },
  ]
}
];

const quickActions = [
  { name: 'Create Event', href: '/create-event', icon: Plus, shortcut: 'Ctrl+N' },
  { name: 'Design Invitation', href: '/vibescard-studio', icon: Palette, shortcut: 'Ctrl+D' },
  { name: 'Find Venues', href: '/natural-venue-showcase', icon: MapPin, shortcut: 'Ctrl+V' },
  { name: 'AI Assistant', href: '/vibebot-assistant', icon: Sparkles, shortcut: 'Ctrl+A' },
];

export function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsCommandOpen(true);
            break;
          case 'n':
            e.preventDefault();
            window.location.href = '/create-event';
            break;
          case 'd':
            e.preventDefault();
            window.location.href = '/vibescard-studio';
            break;
          case 'v':
            e.preventDefault();
            window.location.href = '/natural-venue-showcase';
            break;
          case 'a':
            e.preventDefault();
            window.location.href = '/vibebot-assistant';
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <TopBar/>

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md dark:bg-black/80 dark:border-gray-800">
          <div className="container mx-auto h-16 flex items-center justify-between max-w-7xl p-1">
            
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Vibes
                </span>
              </Link>
            </div>

            {/* Desktop Navigation with Swiper */}
            <NavigationMenu className="hidden lg:flex flex-grow justify-center mx-4 min-w-0">
              <Swiper
                slidesPerView={'auto'}
                spaceBetween={10}
                className="w-full"
              >
                {navigationItems.map((category) => (
                  <SwiperSlide key={category.title} style={{ width: 'auto' }}>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {category.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                          {category.items.map((item) => (
                            <NavigationMenuLink key={item.name} asChild>
                              <Link href={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                <div className="flex items-center space-x-2">
                                  <item.icon className="w-4 h-4" />
                                  <div className="text-sm font-medium leading-none">{item.name}</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </SwiperSlide>
                ))}
              </Swiper>
            </NavigationMenu>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Command Palette */}
              <Popover open={isCommandOpen} onOpenChange={setIsCommandOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span className="text-sm text-muted-foreground">Search...</span>
                    <Badge variant="secondary" className="ml-2">⌘K</Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search features, events, or venues..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Quick Actions">
                        {quickActions.map((action) => (
                          <CommandItem key={action.name} onSelect={() => {
                            window.location.href = action.href;
                            setIsCommandOpen(false);
                          }}>
                            <action.icon className="mr-2 h-4 w-4" />
                            <span>{action.name}</span>
                            <Badge variant="outline" className="ml-auto">
                              {action.shortcut}
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandGroup heading="Navigation">
                        {navigationItems.flatMap(category => category.items).map((item) => (
                          <CommandItem key={item.name} onSelect={() => {
                            window.location.href = item.href;
                            setIsCommandOpen(false);
                          }}>
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
              </Button>

              {/* Theme Toggle */}
              {/* <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button> */}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="User" />
                      <AvatarFallback>VU</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Vibe User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@vibes.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/premium">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade to Premium</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>
                      Access all Vibes features and tools
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {navigationItems.map((category) => (
                      <div key={category.title} className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                          {category.title}
                        </h3>
                        <div className="space-y-1">
                          {category.items.map((item) => (
                            <Link key={item.name} href={item.href}>
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-auto p-3"
                              >
                                <item.icon className="mr-3 h-4 w-4" />
                                <div className="text-left">
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.description}
                                  </div>
                                </div>
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Quick Action Fab */}
        {/* <div className="fixed bottom-6 right-6 z-40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="lg" className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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