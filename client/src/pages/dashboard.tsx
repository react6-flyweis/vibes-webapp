import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Users,
  Palette,
  MapPin,
  Armchair,
  Mail,
  Sparkles,
  TrendingUp,
  Star,
  Heart,
  Plus,
  ArrowRight,
  Zap,
  Globe,
  Crown,
  Shield,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Share2,
} from 'lucide-react';

const quickStats = [
  { name: 'Active Events', value: '12', change: '+3', icon: Calendar, color: 'blue' },
  { name: 'Total Guests', value: '1,247', change: '+127', icon: Users, color: 'green' },
  { name: 'Designs Created', value: '34', change: '+8', icon: Palette, color: 'purple' },
  { name: 'Venues Booked', value: '8', change: '+2', icon: MapPin, color: 'orange' },
];

// Integrated feature ecosystem data
const platformFeatures = [
  {
    category: "Smart Entry & Access",
    features: [
      { name: "Smart Entry & Identity", path: "/smart-entry", icon: Shield, description: "AI-powered access control with face recognition, NFT passes, and voice authentication", status: "active", usage: "247 entries today" },
      { name: "NFT Guest Passes", path: "/smart-entry", icon: Crown, description: "Blockchain-verified VIP access with tier-based privileges", status: "active", usage: "15 VIP passes minted" }
    ]
  },
  {
    category: "Live Experience",
    features: [
      { name: "PartyCast Live", path: "/partycast-live", icon: Activity, description: "Livestream events with interactive viewer engagement and multi-platform broadcasting", status: "streaming", usage: "3 live streams active" },
      { name: "Party Quest", path: "/party-quest-gamified", icon: Star, description: "Gamified guest experience with quests, rewards, and team challenges", status: "active", usage: "89 quests completed" },
      { name: "Pro Host Control", path: "/pro-host-control-panel", icon: BarChart3, description: "AI-powered event management with real-time analytics and automation", status: "monitoring", usage: "12 events monitored" }
    ]
  },
  {
    category: "Commerce & Marketplace",
    features: [
      { name: "VibeMall", path: "/vibe-mall", icon: Eye, description: "Live shopping with AR try-on features and real-time commerce during events", status: "active", usage: "$12,750 revenue today" },
      { name: "Interactive Drink Payment", path: "/interactive-drink-payment", icon: Zap, description: "QR/NFC wristband integration with vendor payment collection", status: "processing", usage: "156 transactions" },
      { name: "Vendor Marketplace", path: "/vendor-marketplace", icon: Users, description: "Complete vendor ecosystem with payments and service booking", status: "active", usage: "34 vendors active" }
    ]
  },
  {
    category: "Design & Creation",
    features: [
      { name: "Collaborative Design", path: "/collaborative-design-sharing", icon: Palette, description: "Community-driven design sharing with real-time collaboration", status: "creating", usage: "67 designs shared" },
      { name: "Digital Twin System", path: "/digital-twin-system", icon: Globe, description: "3D venue modeling with immersive event planning capabilities", status: "active", usage: "8 venues digitized" },
      { name: "AI Party Designer", path: "/ai-party-designer", icon: Sparkles, description: "AI-powered theme generation and complete event blueprints", status: "generating", usage: "23 themes created" }
    ]
  },
  {
    category: "Community & Culture",
    features: [
      { name: "Cultural DNA Layer", path: "/cultural-dna-layer", icon: Heart, description: "Authentic cultural celebration with education and community contributions", status: "exploring", usage: "8 cultures featured" },
      { name: "Global Vibe Passport", path: "/global-vibe-passport", icon: Crown, description: "Gamified loyalty program with tier progression and rewards", status: "collecting", usage: "234 stamps earned" },
      { name: "In-Event Commerce", path: "/in-event-commerce", icon: CheckCircle, description: "Real-time shopping with contextual offers and shoppable moments", status: "shopping", usage: "78 purchases" }
    ]
  },
  {
    category: "Innovation Lab",
    features: [
      { name: "Immersive PartyCam", path: "/immersive-party-cam", icon: Activity, description: "360° recording with AR lenses and sponsor-branded filters", status: "recording", usage: "12 videos created" },
      { name: "Smart Drink Concierge", path: "/smart-drink-concierge", icon: Zap, description: "QR/NFC wristband integration with personalized drink experiences", status: "serving", usage: "89 drinks served" },
      { name: "AI DJ Companion", path: "/ai-dj-companion", icon: Users, description: "Real-time music curation with crowd energy analysis", status: "mixing", usage: "4 playlists active" }
    ]
  }
];

const systemHealth = {
  overallStatus: "Operational",
  uptime: "99.9%",
  activeFeatures: 18,
  totalTransactions: 1247,
  realTimeUsers: 389
};

const recentEvents = [
  {
    id: 1,
    name: "Sarah's 30th Birthday Bash",
    date: "2025-01-15",
    guests: 45,
    status: "Planning",
    progress: 75,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop&auto=format"
  },
  {
    id: 2,
    name: "Corporate Team Building",
    date: "2025-01-22",
    guests: 120,
    status: "Confirmed",
    progress: 100,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop&auto=format"
  },
  {
    id: 3,
    name: "Wedding Reception",
    date: "2025-02-14",
    guests: 200,
    status: "Planning",
    progress: 45,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop&auto=format"
  },
];

const featuredFeatures = [
  {
    name: 'AI Party Designer',
    description: 'Let AI create the perfect party plan for you',
    icon: Sparkles,
    href: '/ai-party-designer',
    color: 'from-purple-500 to-pink-500',
    badge: 'AI Powered'
  },
  {
    name: 'VibesCard Studio',
    description: 'Design stunning invitations with professional templates',
    icon: Palette,
    href: '/vibescard-studio',
    color: 'from-blue-500 to-cyan-500',
    badge: 'Popular'
  },
  {
    name: 'Venue Showcase',
    description: 'Explore venues with immersive 360° virtual tours',
    icon: MapPin,
    href: '/natural-venue-showcase',
    color: 'from-green-500 to-emerald-500',
    badge: 'New'
  },
  {
    name: 'Interactive Seat Tracker',
    description: 'Smart seating management with 3D visualization',
    icon: Armchair,
    href: '/interactive-seat-tracker',
    color: 'from-orange-500 to-red-500',
    badge: 'Premium'
  },
];

const recentActivities = [
  {
    id: 1,
    type: 'event_created',
    message: 'New event "Birthday Celebration" created',
    time: '2 hours ago',
    icon: Calendar,
  },
  {
    id: 2,
    type: 'design_completed',
    message: 'Invitation design for "Wedding Reception" completed',
    time: '4 hours ago',
    icon: Palette,
  },
  {
    id: 3,
    type: 'venue_booked',
    message: 'Grand Ballroom booked for corporate event',
    time: '6 hours ago',
    icon: MapPin,
  },
  {
    id: 4,
    type: 'guest_rsvp',
    message: '12 new RSVPs received',
    time: '8 hours ago',
    icon: Users,
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/ecosystem/health'],
    refetchInterval: 30000,
  });

  const { data: metrics } = useQuery({
    queryKey: ['/api/ecosystem/metrics'],
    refetchInterval: 30000,
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back, Vibe Creator!
          </h1>
          <p className="text-muted-foreground">
            Your event planning command center. Let's create something amazing together.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild>
            <Link href="/create-event">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
          <Button asChild className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Link href="/event-planning/1">
              <Calendar className="w-4 h-4 mr-2" />
              Event Planning
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/ecosystem-dashboard">
              <Activity className="w-4 h-4 mr-2" />
              System Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Platform Health</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {systemHealth?.status || 'Healthy'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Features Active</span>
                    <span>All Systems</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/ecosystem-dashboard">
                    View Full Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link href="/create-event">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create New Event
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/vibescard-studio">
                    <Palette className="w-4 h-4 mr-2" />
                    Design Invitation
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/natural-venue-showcase">
                    <MapPin className="w-4 h-4 mr-2" />
                    Browse Venues
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link href="/ai-party-designer">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Party Planner
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <span>Upgrade to Premium</span>
                </CardTitle>
                <CardDescription>
                  Unlock advanced features and unlimited events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Unlimited events</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Advanced AI features</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Button asChild className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Link href="/premium">
                    Upgrade Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Events</h3>
            <Button asChild>
              <Link href="/create-event">
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-purple-600" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    <Badge variant={event.status === 'Confirmed' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()} • {event.guests} guests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Planning Progress</span>
                      <span>{event.progress}%</span>
                    </div>
                    <Progress value={event.progress} className="h-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredFeatures.map((feature) => (
              <Card key={feature.name} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-linear-to-r ${feature.color}`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-purple-600 transition-colors">
                    {feature.name}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={feature.href}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Stay updated with your latest event planning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <activity.icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}