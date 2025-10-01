import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, Users, TrendingUp, Award, Settings, 
  BarChart3, Calendar, Target, Sparkles, Crown,
  Building2, Zap, Globe, DollarSign, ChevronRight,
  Eye, Download, Share2, Filter, Search, Plus, Shield,
  Music, Play, Pause, Volume2, Shuffle
} from "lucide-react";

export default function ProfessionalTools() {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [whitelabelModalOpen, setWhitelabelModalOpen] = useState(false);
  const [analyticsFilter, setAnalyticsFilter] = useState("last30days");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundtrackModalOpen, setSoundtrackModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dashboardData = {}, isLoading: dashboardLoading } = useQuery({
    queryKey: ["/api/professional/dashboard"],
  });

  // Fetch soundtracks for event planners
  const { data: soundtracksData = [] } = useQuery({
    queryKey: ["/api/soundtracks"],
  });

  // Fetch user playlists
  const { data: playlistsData = [] } = useQuery({
    queryKey: ["/api/user/playlists"],
  });

  const { data: analyticsData = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/professional/analytics", analyticsFilter],
  });

  const { data: loyaltyData = {}, isLoading: loyaltyLoading } = useQuery({
    queryKey: ["/api/professional/loyalty"],
  });

  const { data: whitelabelTemplates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ["/api/professional/whitelabel-templates"],
  });

  const upgradeMutation = useMutation({
    mutationFn: async (planData: any) => {
      return await apiRequest("POST", "/api/professional/upgrade", planData);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Plan upgraded successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/professional/dashboard"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upgrade plan", variant: "destructive" });
    },
  });

  const createWhitelabelMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest("POST", "/api/professional/whitelabel", templateData);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "White-label dashboard created!" });
      setWhitelabelModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/professional/whitelabel-templates"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create dashboard", variant: "destructive" });
    },
  });

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter Pro",
      price: "$99",
      period: "/month",
      description: "Perfect for small event planning businesses",
      features: [
        "Up to 10 events per month",
        "Basic guest analytics",
        "Standard white-label dashboard",
        "Email support",
        "5% booking commission"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: "$299", 
      period: "/month",
      description: "For established event planning companies",
      features: [
        "Up to 50 events per month",
        "Advanced AI guest analytics", 
        "Custom white-label branding",
        "NFT loyalty program access",
        "Priority support",
        "3% booking commission"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$999",
      period: "/month", 
      description: "For large venues and corporate hosts",
      features: [
        "Unlimited events",
        "Full AI analytics suite",
        "Complete white-label customization",
        "Advanced NFT loyalty features",
        "Dedicated account manager",
        "1% booking commission"
      ],
      popular: false
    }
  ];

  const analyticsMetrics = [
    {
      title: "Total Events Managed",
      value: dashboardData.totalEvents || "247",
      change: "+12%",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Guest Engagement Score",
      value: dashboardData.engagementScore || "8.7",
      change: "+0.3",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Revenue Generated",
      value: dashboardData.revenue || "$124,560",
      change: "+18%",
      icon: DollarSign,
      color: "text-purple-600"
    },
    {
      title: "NFT Loyalty Members",
      value: dashboardData.nftMembers || "1,834",
      change: "+25%",
      icon: Crown,
      color: "text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Event Professional Tools
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Advanced SaaS platform for professional event planners, venues, and corporate hosts with AI-driven analytics and white-label solutions
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6 mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value="soundtracks" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Soundtracks
            </TabsTrigger>
            <TabsTrigger value="whitelabel" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              White-Label
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              NFT Loyalty
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsMetrics.map((metric, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </p>
                        <p className={`text-sm ${metric.color}`}>
                          {metric.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gray-100 dark:bg-slate-700 ${metric.color}`}>
                        <metric.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Events Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { event: "Corporate Gala 2025", client: "TechCorp Inc.", status: "completed", revenue: "$45,000" },
                    { event: "Wedding Reception", client: "Sarah & John", status: "in-progress", revenue: "$28,500" },
                    { event: "Product Launch", client: "StartupXYZ", status: "planning", revenue: "$62,000" },
                    { event: "Charity Fundraiser", client: "Hope Foundation", status: "completed", revenue: "$38,200" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{activity.event}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={activity.status === 'completed' ? 'default' : activity.status === 'in-progress' ? 'secondary' : 'outline'}>
                          {activity.status}
                        </Badge>
                        <span className="font-semibold text-green-600">{activity.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Driven Guest Analytics</h2>
              <div className="flex items-center gap-4">
                <Select value={analyticsFilter} onValueChange={setAnalyticsFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                    <SelectItem value="lastyear">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Guest Behavior Analysis */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guest Behavior Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Peak Engagement Time</span>
                      <span className="text-sm text-purple-600 font-semibold">8:30 PM - 10:30 PM</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Social Media Sharing Rate</span>
                      <span className="text-sm text-green-600 font-semibold">68% (+12%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Return Guest Rate</span>
                      <span className="text-sm text-amber-600 font-semibold">42% (+8%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Predictive Analytics */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Predictions & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      type: "High Priority",
                      message: "Optimal guest capacity for next event: 180-220 people",
                      confidence: "94%",
                      color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    },
                    {
                      type: "Revenue Opportunity", 
                      message: "VIP upgrade potential: $12,500 additional revenue",
                      confidence: "87%",
                      color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    },
                    {
                      type: "Engagement Boost",
                      message: "Add live music between 9-10 PM for 23% higher satisfaction",
                      confidence: "91%",
                      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    },
                    {
                      type: "Cost Optimization",
                      message: "Reduce catering by 15% without impacting guest experience",
                      confidence: "76%",
                      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                    }
                  ].map((prediction, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={prediction.color}>{prediction.type}</Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{prediction.confidence} confidence</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{prediction.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Soundtrack & Playlists Tab */}
          <TabsContent value="soundtracks" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Soundtrack Generator & Playlists</h2>
              <div className="flex gap-3">
                <Button onClick={() => setSoundtrackModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Music className="h-4 w-4 mr-2" />
                  Generate Soundtrack
                </Button>
                <Button onClick={() => setPlaylistModalOpen(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Playlist
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Generated Soundtracks */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Generated Soundtracks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.isArray(soundtracksData) && soundtracksData.slice(0, 3).map((soundtrack: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{soundtrack.title}</h4>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          {soundtrack.tracks} tracks
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{soundtrack.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Music className="h-4 w-4" />
                          {soundtrack.genre} • {soundtrack.duration}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* User Playlists */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-blue-500" />
                    My Playlists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: "playlist_001",
                      name: "Corporate Event Mix",
                      tracks: 24,
                      duration: "2h 15m",
                      source: "Custom",
                      lastModified: "2 hours ago"
                    },
                    {
                      id: "playlist_002", 
                      name: "Birthday Party Hits",
                      tracks: 18,
                      duration: "1h 42m",
                      source: "AI Generated",
                      lastModified: "1 day ago"
                    },
                    {
                      id: "playlist_003",
                      name: "Wedding Reception",
                      tracks: 32,
                      duration: "3h 8m", 
                      source: "Spotify Import",
                      lastModified: "3 days ago"
                    }
                  ].map((playlist, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                         onClick={() => setCurrentPlaylist(playlist)}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{playlist.name}</h4>
                        <Badge variant="outline">{playlist.source}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{playlist.tracks} tracks • {playlist.duration}</span>
                        <span>Modified {playlist.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* DJ Booth Integration */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="h-5 w-5 text-indigo-500" />
                  DJ Booth Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Share Playlists</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share your curated playlists directly with DJs for seamless event execution</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Live Control</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control playlist playback and track selection during live events</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Multi-Source</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Import from Spotify, Apple Music, or create custom playlists from any source</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* White-Label Tab */}
          <TabsContent value="whitelabel" className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">White-Label Dashboards</h2>
              <Button onClick={() => setWhitelabelModalOpen(true)} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Create New Dashboard
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Luxury Events Dashboard",
                  client: "Elite Events Co.",
                  theme: "Gold & Black",
                  status: "Active",
                  views: "2,847",
                  lastUpdated: "2 hours ago"
                },
                {
                  name: "Corporate Solutions Hub",
                  client: "Business Events Pro",
                  theme: "Blue & White", 
                  status: "Active",
                  views: "1,923",
                  lastUpdated: "1 day ago"
                },
                {
                  name: "Wedding Planner Portal",
                  client: "Dream Weddings Inc.",
                  theme: "Rose & Cream",
                  status: "Draft",
                  views: "456",
                  lastUpdated: "3 days ago"
                }
              ].map((dashboard, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                      <Badge variant={dashboard.status === 'Active' ? 'default' : 'secondary'}>
                        {dashboard.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{dashboard.client}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Theme:</span>
                      <span className="font-medium">{dashboard.theme}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Views:</span>
                      <span className="font-medium">{dashboard.views}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium">{dashboard.lastUpdated}</span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* NFT Loyalty Tab */}
          <TabsContent value="loyalty" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">NFT-Based Loyalty Programs</h2>
              <p className="text-gray-600 dark:text-gray-400">Create exclusive VIP experiences with blockchain-verified loyalty rewards</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Loyalty Program Overview */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    VIP Loyalty Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
                      <p className="text-2xl font-bold text-amber-600">1,834</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">NFT Members</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                      <p className="text-2xl font-bold text-purple-600">$284K</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">VIP Revenue</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Tier Distribution</h4>
                    {[
                      { tier: "Diamond VIP", members: 127, percentage: 7, color: "bg-blue-500" },
                      { tier: "Gold VIP", members: 381, percentage: 21, color: "bg-amber-500" },
                      { tier: "Silver VIP", members: 724, percentage: 39, color: "bg-gray-400" },
                      { tier: "Bronze VIP", members: 602, percentage: 33, color: "bg-orange-500" }
                    ].map((tier, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{tier.tier}</span>
                          <span className="text-gray-600 dark:text-gray-400">{tier.members} members</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div className={`${tier.color} h-2 rounded-full`} style={{ width: `${tier.percentage}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* NFT Collection */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Exclusive NFT Collection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "VIP Access Pass",
                      description: "Grants access to exclusive events and perks",
                      holders: 1834,
                      value: "0.5 ETH",
                      rarity: "Common"
                    },
                    {
                      name: "Event Creator Badge",
                      description: "Recognition for hosting successful events",
                      holders: 127,
                      value: "1.2 ETH",
                      rarity: "Rare"
                    },
                    {
                      name: "Legendary Host Crown",
                      description: "Ultra-rare recognition for top performers",
                      holders: 12,
                      value: "5.0 ETH",
                      rarity: "Legendary"
                    }
                  ].map((nft, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{nft.name}</h4>
                        <Badge variant={nft.rarity === 'Legendary' ? 'default' : nft.rarity === 'Rare' ? 'secondary' : 'outline'}>
                          {nft.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{nft.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{nft.holders} holders</span>
                        <span className="font-semibold text-purple-600">{nft.value}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Professional Pricing Plans</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Choose the perfect plan for your event business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card key={plan.id} className={`border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm relative ${plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-green-600"></div>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        upgradeMutation.mutate({ planId: plan.id, planName: plan.name });
                      }}
                      disabled={upgradeMutation.isPending}
                    >
                      {upgradeMutation.isPending ? "Processing..." : `Choose ${plan.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enterprise Features */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-900/10 to-blue-900/10 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise Features</h3>
                  <p className="text-gray-600 dark:text-gray-400">Advanced capabilities for large-scale operations</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Globe, title: "Multi-Location Support", description: "Manage venues across multiple cities" },
                    { icon: Zap, title: "API Integration", description: "Custom integrations with your existing systems" },
                    { icon: Shield, title: "Advanced Security", description: "Enterprise-grade security and compliance" },
                    { icon: Target, title: "Custom Analytics", description: "Tailored reporting and insights dashboard" }
                  ].map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* White-label Creation Modal */}
        <Dialog open={whitelabelModalOpen} onOpenChange={setWhitelabelModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create White-Label Dashboard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dashboardName">Dashboard Name</Label>
                <Input id="dashboardName" placeholder="Enter dashboard name" />
              </div>
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" placeholder="Enter client name" />
              </div>
              <div>
                <Label htmlFor="themeColor">Theme</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury (Gold & Black)</SelectItem>
                    <SelectItem value="corporate">Corporate (Blue & White)</SelectItem>
                    <SelectItem value="wedding">Wedding (Rose & Cream)</SelectItem>
                    <SelectItem value="modern">Modern (Purple & Gray)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="features">Features</Label>
                <Textarea id="features" placeholder="Describe custom features needed" />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                onClick={() => createWhitelabelMutation.mutate({})}
                disabled={createWhitelabelMutation.isPending}
              >
                {createWhitelabelMutation.isPending ? "Creating..." : "Create Dashboard"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}