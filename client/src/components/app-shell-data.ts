import {
  Home,
  Calendar,
  Users,
  Palette,
  // MapPin,
  Armchair,
  // Mail,
  Sparkles,
  FileText,
  Search,
  Plus,
  Heart,
  Star,
  TrendingUp,
  Crown,
  Briefcase,
  Layout,
  Shield,
  Share,
  Box,
  // Zap,
  // Settings,
  // Bell,
  // Menu,
  // Globe,
  // Shield,
  // LogOut,
  // User,
  // HelpCircle,
  // ShoppingBag,
  // Blocks,
  // Brain,
  // Code2,
  // LineChart,
  // Megaphone,
  // UserCheck,
  // Database,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon?: any;
  description?: string;
};

export type NavCategory = {
  title: string;
  items: NavItem[];
};

export const navigationItems: NavCategory[] = [
  // {
  //   title: "Home",
  //   href: "/",
  // },
  {
    title: "Events",
    items: [
      {
        name: "Home",
        href: "/",
        icon: Home,
        description: "Your event dashboard",
      },
      {
        name: "List New Event",
        href: "/create-event",
        icon: Plus,
        description: "Start planning your event",
      },
      {
        name: "Search Event",
        href: "/event-discovery",
        icon: Search,
        description: "Find events to attend",
      },
      {
        name: "Play My Event",
        href: "/my-events/",
        icon: Calendar,
        description: "Book and manage tickets",
      },
    ],
  },
  {
    title: "Design Studio",
    items: [
      {
        name: "VibesCard Studio",
        href: "/vibescard-studio",
        icon: Palette,
        description: "Create stunning invitations",
      },
      // {
      //   name: "Complete Invite Workflow",
      //   href: "/complete-invite-workflow",
      //   icon: Mail,
      //   description: "Full invitation system demo",
      // },
      {
        name: "Evibes Templates",
        href: "/evite-templates",
        icon: FileText,
        description: "Professional invitation templates",
      },
      {
        name: "Design Generator",
        href: "/interactive-design-generator",
        icon: Sparkles,
        description: "AI-powered design creation",
      },
      {
        name: "Social Design Studio",
        href: "/social-design-studio",
        icon: Users,
        description: "Collaborative design workspace",
      },
      {
        name: "Design Community",
        href: "/collaborative-design-sharing",
        icon: Users,
        description: "Share and remix designs",
      },
      {
        name: "Party Hall Decorator",
        href: "/party-hall-decorator",
        icon: Armchair,
        description: "3D venue decoration",
      },
    ],
  },
];

export const userNavigationItems: NavCategory[] = [
  {
    title: "Marketplace",
    items: [
      {
        name: "Vendor Marketplace",
        href: "/vendor-marketplace",
        icon: Star,
        description: "Find event vendors",
      },
      {
        name: "Staffing Marketplace",
        href: "/staffing-marketplace",
        icon: Users,
        description: "Hire event staff",
      },
      {
        name: "Catering Services",
        href: "/catering-marketplace",
        icon: Heart,
        description: "Food and beverage options",
      },
    ],
  },
];

export const staffNavigationItems: NavCategory[] = [
  {
    title: "Staff Tools",
    items: [
      {
        name: "Staff Dashboard",
        href: "/staff-dashboard",
        icon: Layout,
        description: "Manage your staffing assignments",
      },
      {
        name: "My Bookings",
        href: "/staff-bookings",
        icon: Calendar,
        description: "View your bookings in calendar",
      },
    ],
  },
];
export const vendorNavigationItems: NavCategory[] = [
  {
    title: "Marketplace",
    items: [
      {
        name: "Staffings",
        href: "/staffings",
        icon: Users,
      },
      {
        name: "Catering Services",
        href: "/caterings",
        icon: Heart,
      },
    ],
  },
  // Vibes fund
  //  vibesfund
  // fundraising
  //  crowdfunding
  // Social media outreach
  {
    title: "Vibes Fund",
    items: [
      {
        name: "vibesfund",
        href: "/vibes-fund",
        icon: Heart,
      },
      {
        name: "Fundraising",
        href: "/vibes-fund",
        icon: Heart,
      },
      {
        name: "Crowdfunding",
        href: "/vibes-fund",
        icon: Heart,
      },
      {
        name: "Social Media Outreach",
        href: "/vibes-fund",
        icon: Share,
      },
    ],
  },
  //   {
  //     title: "Venues & Spaces",
  //     items: [
  //       { name: "Venue Showcase", href: "/natural-venue-showcase", icon: MapPin, description: "Immersive venue tours" },
  //       { name: "Seat Tracker", href: "/interactive-seat-tracker", icon: Armchair, description: "Smart seating management" },
  //       { name: "AR Space Planner", href: "/ar-space-planner", icon: Zap, description: "Augmented reality planning" },
  //       { name: "Virtual Party Twin", href: "/virtual-party-twin", icon: Globe, description: "Digital event replica" },
  //     ],
  //   },

  // {
  //   title: "AI Features",
  //   items: [
  //     {
  //       name: "AI Theme Generator",
  //       href: "/ai-theme-generator",
  //       icon: Sparkles,
  //       description: "Intelligent theme suggestions",
  //     },
  //     {
  //       name: "AI Party Designer",
  //       href: "/ai-party-designer",
  //       icon: Palette,
  //       description: "Complete party planning",
  //     },
  //     {
  //       name: "AI Vibe Analyzer",
  //       href: "/ai-vibe-analyzer",
  //       icon: TrendingUp,
  //       description: "Event mood analysis",
  //     },
  //     {
  //       name: "VibeBot Assistant",
  //       href: "/vibebot-assistant",
  //       icon: Zap,
  //       description: "Your AI event assistant",
  //     },
  //   ],
  // },
  //   {
  //     title: "Community",
  //     items: [
  //       { name: "Global Vibe Passport", href: "/global-vibe-passport", icon: Globe, description: "Your loyalty passport and rewards" },
  //       { name: "AI Media Suite", href: "/ai-party-media-suite", icon: Sparkles, description: "Post-event content creation" },
  //       { name: "Event DAO", href: "/event-dao", icon: Shield, description: "Decentralized event governance" },
  //       { name: "Vibe Control", href: "/vibe-control", icon: Zap, description: "Real-time party interaction" },
  //       { name: "In-Event Commerce", href: "/in-event-commerce", icon: ShoppingBag, description: "Real-time party shopping" },
  //       { name: "Cultural DNA Layer", href: "/cultural-dna-layer", icon: Globe, description: "Cultural storytelling and education" },
  //     ],
  //   },
  //   {
  //     title: "Premium",
  //     items: [
  //       { name: "Premium Dashboard", href: "/premium-dashboard", icon: Crown, description: "Premium features access" },
  //       { name: "Enterprise Suite", href: "/enterprise-suite", icon: Shield, description: "Business solutions" },
  //       { name: "Corporate Dashboard", href: "/corporate-dashboard", icon: TrendingUp, description: "Corporate event management" },
  //     ],
  //   },
  {
    title: "Business Tools",
    items: [
      // {
      //   name: "Business Tools Integration",
      //   href: "/business-tools",
      //   icon: Blocks,
      //   description:
      //     "Unified platform management and cross system synchronization",
      // },
      {
        name: "Vibes Business",
        href: "/vibes-business",
        icon: Briefcase,
        description: "Business subscription plan",
      },
      // {
      //   name: "AI CRM Intelligence",
      //   href: "/ai-crm",
      //   icon: Brain,
      //   description: "AI-powered CRM with predictive analytics",
      // },
      {
        name: "CRM Dashboard",
        href: "/crm-dashboard",
        icon: Layout,
        description: "Customer relationship management",
      },
      {
        name: "Premium Dashboard",
        href: "/premium-dashboard",
        icon: Crown,
        description: "Premium features access",
      },
      // {
      //   name: "Enterprise API",
      //   href: "/enterprise-api",
      //   icon: Code2,
      //   description: "API keys, webhooks, and SDK documentation",
      // },
      // {
      //   name: "Vibes HR Platform",
      //   href: "/vibes-hr",
      //   icon: Users,
      //   description: "Standalone HR management with culture focus",
      // },
      {
        name: "Corporate Dashboard",
        href: "/corporate-dashboard",
        icon: TrendingUp,
        description: "Corporate event management",
      },
      {
        name: "Vendor migration hub",
        href: "/vendor-migration",
        icon: Box,
        description:
          "Migrate your store from Etsy, Aliexpress, Temu, Amazon in one click",
      },
      // {
      //   name: "Advanced Business Intelligence",
      //   href: "/advanced-bi",
      //   icon: LineChart,
      //   description:
      //     "Sophisticated analytical algorithms powering intelligent business",
      // },

      // {
      //   name: "Marketing Automation",
      //   href: "/marketing-automation",
      //   icon: Megaphone,
      //   description: "AI-powered marketing automation for Vibes Platform",
      // },
      // {
      //   name: "Enterprise Suite",
      //   href: "/enterprise-suite",
      //   icon: Shield,
      //   description: "Business solutions",
      // },
      // {
      //   name: "HR Platform Integration",
      //   href: "/hr-platform-integration",
      //   icon: UserCheck,
      //   description:
      //     "Workplace culture, attendance tracking, and wellness credits",
      // },
      // {
      //   name: "VIBES ERP",
      //   href: "/vibes-erp",
      //   icon: Database,
      //   description: "Comprehensive Enterprise Resource Planning Platform",
      // },
    ],
  },
  // Vibes launchfund
  // - Financial management
  //  - security trus
  // - Backer experience
  //  - Campaign management
  // {
  //   title: "Vibes LaunchFund",
  //   items: [
  //     {
  //       name: "Financial Management",
  //       href: "/financial-management",
  //       icon: Star,
  //     },
  //     {
  //       name: "Security Trust",
  //       href: "/security-trust",
  //       icon: Shield,
  //     },
  //     {
  //       name: "Backer Experience",
  //       href: "/backer-experience",
  //       icon: Users,
  //     },
  //     {
  //       name: "Campaign Management",
  //       href: "/vibes-fund",
  //       icon: TrendingUp,
  //     },
  //   ],
  // },
  //   {
  //     title: "Political Campaign",
  //     items: [
  //       { name: "Campaign Dashboard", href: "/campaign-dashboard", icon: TrendingUp, description: "Complete campaign management platform" },
  //       { name: "AI Volunteer Motivation", href: "/ai-volunteer-motivation", icon: Users, description: "AI-powered volunteer engagement" },
  //       { name: "Supporter Journey", href: "/supporter-journey", icon: TrendingUp, description: "Interactive supporter engagement journey" },
  //       { name: "Gamified Milestones", href: "/gamified-milestones", icon: Star, description: "Achievement system with celebration animations" },
  //     ],
  //   },
];

export const quickActions = [
  {
    name: "Create Event",
    href: "/create-event",
    icon: Plus,
    shortcut: "Ctrl+N",
  },
  {
    name: "Design Invitation",
    href: "/vibescard-studio",
    icon: Palette,
    shortcut: "Ctrl+D",
  },
  // {
  //   name: "Find Venues",
  //   href: "/natural-venue-showcase",
  //   icon: MapPin,
  //   shortcut: "Ctrl+V",
  // },
  {
    name: "AI Assistant",
    href: "/vibebot-assistant",
    icon: Sparkles,
    shortcut: "Ctrl+A",
  },
];
