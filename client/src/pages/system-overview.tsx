import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Users, 
  Calendar, 
  Music, 
  Palette, 
  Shield, 
  Coins, 
  Camera, 
  Leaf,
  Zap,
  Activity,
  TrendingUp,
  Link2,
  Globe,
  Building2,
  Star,
  Briefcase,
  Settings,
  Play,
  ArrowRight,
  Filter,
  Grid3X3,
  List
} from "lucide-react";
import { Link } from "wouter";

export default function SystemOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const systemCategories = [
    {
      id: "core",
      name: "Core Features",
      icon: Zap,
      color: "blue",
      description: "Essential party planning functionality"
    },
    {
      id: "ai",
      name: "AI & Intelligence",
      icon: Activity,
      color: "purple",
      description: "Artificial intelligence powered features"
    },
    {
      id: "web3",
      name: "Web3 & Blockchain",
      icon: Shield,
      color: "green",
      description: "Blockchain and cryptocurrency features"
    },
    {
      id: "immersive",
      name: "AR/VR Experience",
      icon: Globe,
      color: "orange",
      description: "Augmented and virtual reality features"
    },
    {
      id: "enterprise",
      name: "Enterprise Solutions",
      icon: Building2,
      color: "indigo",
      description: "Professional and corporate features"
    },
    {
      id: "marketplace",
      name: "Marketplace & Vendors",
      icon: Briefcase,
      color: "red",
      description: "Vendor and service marketplace features"
    },
    {
      id: "social",
      name: "Social & Engagement",
      icon: Users,
      color: "pink",
      description: "Social features and guest engagement"
    },
    {
      id: "creative",
      name: "Creative & Design",
      icon: Palette,
      color: "yellow",
      description: "Design tools and creative features"
    }
  ];

  const allFeatures = [
    // Core Features
    { id: "home", name: "Event Dashboard", description: "Main event management dashboard", path: "/", category: "core", tier: "included" },
    { id: "create-event", name: "Create Event", description: "Create and plan new events", path: "/create-event", category: "core", tier: "included" },
    { id: "enhanced-event", name: "Enhanced Event Management", description: "Advanced event planning tools", path: "/enhanced-event", category: "core", tier: "payperuse" },
    { id: "simple-home", name: "Simple Dashboard", description: "Simplified event overview", path: "/simple-home", category: "core", tier: "included" },
    { id: "ecosystem-dashboard", name: "System Integration Dashboard", description: "Real-time system interconnectivity view", path: "/ecosystem-dashboard", category: "core", tier: "payperuse" },

    // AI & Intelligence
    { id: "ai-party-designer", name: "AI Party Designer", description: "AI-powered event design and planning", path: "/ai-party-designer", category: "ai", tier: "payperuse" },
    { id: "ai-theme-generator", name: "AI Theme Generator", description: "Intelligent theme creation", path: "/ai-theme-generator", category: "ai", tier: "payperuse" },
    { id: "ai-vibe-analyzer", name: "AI Vibe Analyzer", description: "Real-time sentiment analysis", path: "/ai-vibe-analyzer", category: "ai", tier: "payperuse" },
    { id: "ai-vibe-modeling", name: "AI Vibe Modeling", description: "Predictive event modeling", path: "/ai-vibe-modeling", category: "ai", tier: "payperuse" },
    { id: "smart-scheduling", name: "Smart Scheduling", description: "Intelligent scheduling optimization", path: "/smart-scheduling", category: "ai", tier: "payperuse" },
    { id: "vibebot-assistant", name: "VibeBot Assistant", description: "AI event planning assistant", path: "/vibebot-assistant", category: "ai", tier: "payperuse" },
    { id: "voice-activated-assistant", name: "Voice Assistant", description: "Voice-controlled event management", path: "/voice-activated-assistant", category: "ai", tier: "payperuse" },
    { id: "adaptive-environment", name: "Adaptive Environment", description: "Dynamic environment adjustments", path: "/adaptive-environment", category: "ai", tier: "payperuse" },

    // Web3 & Blockchain
    { id: "smart-contract-escrow", name: "Smart Contract Escrow", description: "Blockchain payment security", path: "/smart-contract-escrow", category: "web3", tier: "payperuse" },
    { id: "nft-guest-passes", name: "NFT Guest Passes", description: "Blockchain access management", path: "/nft-guest-passes", category: "web3", tier: "payperuse" },
    { id: "token-gated-vip", name: "Token Gated VIP", description: "Crypto VIP access control", path: "/token-gated-vip", category: "web3", tier: "payperuse" },
    { id: "event-dao", name: "Event DAO", description: "Decentralized event organization", path: "/event-dao", category: "web3", tier: "payperuse" },

    // AR/VR Experience
    { id: "ar-space-planner", name: "AR Space Planner", description: "Augmented reality space planning", path: "/ar-space-planner", category: "immersive", tier: "payperuse" },
    { id: "ar-vr-immersive", name: "AR/VR Immersive", description: "Complete VR/AR experiences", path: "/ar-vr-immersive", category: "immersive", tier: "payperuse" },
    { id: "virtual-party-twin", name: "Virtual Party Twin", description: "Digital event simulation", path: "/virtual-party-twin", category: "immersive", tier: "payperuse" },
    { id: "ar-preview", name: "AR Preview", description: "Preview events in AR", path: "/ar-preview", category: "immersive", tier: "payperuse" },

    // Enterprise Solutions
    { id: "enterprise-suite", name: "Enterprise Suite", description: "Complete enterprise feature bundle", path: "/enterprise-suite", category: "enterprise", tier: "included" },
    { id: "corporate-dashboard", name: "Corporate Dashboard", description: "Enterprise analytics and management", path: "/corporate-dashboard", category: "enterprise", tier: "payperuse" },
    { id: "professional-tools", name: "Professional Tools", description: "Advanced planning tools", path: "/professional-tools", category: "enterprise", tier: "payperuse" },
    { id: "premium", name: "Premium Dashboard", description: "Advanced analytics dashboard", path: "/premium", category: "enterprise", tier: "payperuse" },
    { id: "pricing", name: "Pricing Plans", description: "View pay-as-you-go pricing options", path: "/pricing", category: "enterprise", tier: "included" },

    // Marketplace & Vendors
    { id: "vendors", name: "Vendor Marketplace", description: "Professional vendor marketplace", path: "/vendors", category: "marketplace", tier: "payperuse" },
    { id: "vendor-dashboard", name: "Vendor Dashboard", description: "Vendor management system", path: "/vendor-dashboard", category: "marketplace", tier: "payperuse" },
    { id: "vendor-onboarding", name: "Vendor Onboarding", description: "Professional vendor registration", path: "/vendor-onboarding", category: "marketplace", tier: "payperuse" },
    { id: "staffing-marketplace", name: "Staffing Marketplace", description: "Premium staffing solutions", path: "/staffing-marketplace", category: "marketplace", tier: "payperuse" },
    { id: "catering-marketplace", name: "Catering Marketplace", description: "Enterprise catering solutions", path: "/catering-marketplace", category: "marketplace", tier: "payperuse" },
    { id: "vendor-liquidity", name: "Vendor Liquidity", description: "Financial vendor solutions", path: "/vendor-liquidity", category: "marketplace", tier: "payperuse" },

    // Social & Engagement
    { id: "guest-matchmaking", name: "Guest Matchmaking", description: "AI-powered guest connections", path: "/guest-matchmaking", category: "social", tier: "payperuse" },
    { id: "interactive-mood-visualizer", name: "Mood Visualizer", description: "Real-time mood tracking", path: "/interactive-mood-visualizer", category: "social", tier: "payperuse" },
    { id: "gamified-attendance-rewards", name: "Attendance Rewards", description: "Gamified engagement system", path: "/gamified-attendance-rewards", category: "social", tier: "payperuse" },
    { id: "loyalty-rewards", name: "Loyalty Rewards", description: "Guest loyalty program", path: "/loyalty-rewards", category: "social", tier: "payperuse" },
    { id: "host-achievements", name: "Host Achievements", description: "Achievement tracking system", path: "/host-achievements", category: "social", tier: "payperuse" },
    { id: "vibe-verified-guests", name: "Vibe Verified Guests", description: "Guest verification system", path: "/vibe-verified-guests", category: "social", tier: "payperuse" },

    // Creative & Design
    { id: "vibescard-studio", name: "VibesCard Studio", description: "Professional invitation design", path: "/vibescard-studio", category: "creative", tier: "payperuse" },
    { id: "interactive-live-vibes-invite", name: "Interactive Invitations", description: "Dynamic invitation system", path: "/interactive-live-vibes-invite", category: "creative", tier: "payperuse" },
    { id: "social-story-templates", name: "Social Story Templates", description: "Social media content templates", path: "/social-story-templates", category: "creative", tier: "payperuse" },
    { id: "event-soundtrack-generator", name: "Soundtrack Generator", description: "AI-powered music creation", path: "/event-soundtrack-generator", category: "creative", tier: "payperuse" },

    // Additional Features
    { id: "sustainability-tracker", name: "Sustainability Tracker", description: "Environmental impact monitoring", path: "/sustainability-tracker", category: "core", tier: "payperuse" },
    { id: "sustainability-badges", name: "Sustainability Badges", description: "Environmental achievement system", path: "/sustainability-badges", category: "core", tier: "payperuse" },
    { id: "livestream-companion", name: "Livestream Companion", description: "Live streaming integration", path: "/livestream-companion", category: "social", tier: "payperuse" },
    { id: "live-music-voting", name: "Live Music Voting", description: "Interactive music selection", path: "/live-music-voting", category: "social", tier: "payperuse" },
    { id: "enhanced-dj-booth", name: "Enhanced DJ Booth", description: "Professional DJ management", path: "/enhanced-dj-booth", category: "creative", tier: "payperuse" },
    { id: "adaptive-music-engine", name: "Adaptive Music Engine", description: "AI music adaptation", path: "/adaptive-music-engine", category: "ai", tier: "payperuse" },
    { id: "nightclub-experience", name: "Nightclub Experience", description: "Premium nightclub-style events", path: "/nightclub-experience", category: "immersive", tier: "payperuse" },
    { id: "event-verification-badges", name: "Event Verification", description: "Trust and verification system", path: "/event-verification-badges", category: "enterprise", tier: "payperuse" }
  ];

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
      purple: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100",
      green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
      orange: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
      indigo: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-100",
      red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
      pink: "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-100",
      yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100"
    };
    return colors[color] || colors.blue;
  };

  const getTierBadgeColor = (tier: string) => {
    const tiers: Record<string, string> = {
      included: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      payperuse: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
    };
    return tiers[tier] || tiers.payperuse;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Vibes System Overview
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Complete overview of all Vibes features organized by category with search and filtering capabilities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="features">All Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Category Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemCategories.map((category) => {
                const categoryFeatures = allFeatures.filter(f => f.category === category.id);
                return (
                  <Card key={category.id} className="relative overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className={`p-3 rounded-lg w-fit ${getColorClasses(category.color)}`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {categoryFeatures.length} features
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          Explore <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{allFeatures.length}</div>
                  <div className="text-sm text-muted-foreground">Total Features</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{allFeatures.filter(f => f.tier === "included").length}</div>
                  <div className="text-sm text-muted-foreground">Included Features</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{allFeatures.filter(f => f.tier === "payperuse").length}</div>
                  <div className="text-sm text-muted-foreground">Pay-Per-Use</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">{systemCategories.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </Button>
              {systemCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-3 w-3 mr-1" />
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Features by Category */}
            {systemCategories
              .filter(cat => selectedCategory === "all" || selectedCategory === cat.id)
              .map((category) => {
                const categoryFeatures = allFeatures.filter(f => f.category === category.id);
                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <category.icon className="h-5 w-5" />
                        <span>{category.name}</span>
                        <Badge variant="outline">{categoryFeatures.length} features</Badge>
                      </CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryFeatures.map((feature) => (
                          <Link key={feature.id} href={feature.path}>
                            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-sm">{feature.name}</h4>
                                  <Badge className={`text-xs ${getTierBadgeColor(feature.tier)}`}>
                                    {feature.tier}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {feature.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-blue-600">Open</span>
                                  <ArrowRight className="h-3 w-3 text-blue-600" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            {/* Feature Grid/List */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredFeatures.length} of {allFeatures.length} features
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredFeatures.map((feature) => (
                  <Link key={feature.id} href={feature.path}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{feature.name}</h4>
                          <Badge className={`text-xs ${getTierBadgeColor(feature.tier)}`}>
                            {feature.tier}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {feature.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {systemCategories.find(c => c.id === feature.category)?.name}
                          </Badge>
                          <ArrowRight className="h-3 w-3 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFeatures.map((feature) => (
                  <Link key={feature.id} href={feature.path}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-semibold">{feature.name}</h4>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {systemCategories.find(c => c.id === feature.category)?.name}
                            </Badge>
                            <Badge className={`text-xs ${getTierBadgeColor(feature.tier)}`}>
                              {feature.tier}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}