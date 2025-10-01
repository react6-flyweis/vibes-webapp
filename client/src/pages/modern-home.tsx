import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FloatingActionButton from "@/components/FloatingActionButton";
import { 
  Calendar, 
  Plus, 
  Search, 
  Bell, 
  MapPin, 
  Users, 
  Star, 
  Zap, 
  Camera, 
  ShoppingBag, 
  Music,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  ChevronRight,
  Play,
  Mic,
  Palette,
  Globe,
  Gift,
  Target,
  Award
} from "lucide-react";
import TopBar from "@/components/Topbar/TopBar";
import HeroSection from "@/components/Hero/Hero";
import PartySection from "@/components/PartySection/PartySection";
import NightlifeGallery from "@/components/PartySection/NightlifeGallery";
import VibesWeddingUI from "@/components/HomPage/VibesWeddingUI";
import WeddingDashboard from "@/components/HomPage/WeddingDashboard";
import FeatureGrid from "@/components/HomPage/FeatureGrid";
import StatsSection from "@/components/HomPage/StatsSection";
import EventIntegrations from "@/components/HomPage/EventIntegrations";
import IntegrationHub from "@/components/HomPage/IntegrationHub";
import { WebScrapingSection } from "@/components/HomPage/WebScrapingSection";
import RateLimitingAndAutomation from "@/components/HomPage/RateLimitingAndAutomation";
import DreamWeddingCard from "@/components/HomPage/DreamWeddingCard";
import Footer from "@/components/HomPage/Footer";

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  path: string;
  gradient: string;
}

interface FeaturedEvent {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  tags: string[];
  price: string;
  featured: boolean;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

export default function ModernHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);
  





 const [location] = useLocation(); // ✅ yaha string milega, jaise "/"

  const isHome: boolean = location === "/"; // ✅ directly string compare




  const quickActions: QuickAction[] = [
    {
      id: "create-event",
      title: "Create Event",
      subtitle: "Plan your perfect party",
      icon: Plus,
      color: "text-purple-600",
      path: "/create-event",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "find-events",
      title: "Discover Events",
      subtitle: "Find amazing parties nearby",
      icon: Search,
      color: "text-blue-600",
      path: "/find-events",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "ai-party-designer",
      title: "AI Party Designer",
      subtitle: "Let AI design your event",
      icon: Sparkles,
      color: "text-emerald-600",
      path: "/ai-party-designer",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: "vibe-mall",
      title: "VibeMall",
      subtitle: "Shop party essentials",
      icon: ShoppingBag,
      color: "text-orange-600",
      path: "/vibe-mall",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const featuredEvents: FeaturedEvent[] = [
    {
      id: "1",
      title: "Neon Rave Experience",
      host: "DJ Alex Chen",
      date: "Tomorrow",
      time: "10:00 PM",
      location: "Skyline Rooftop",
      attendees: 87,
      maxAttendees: 150,
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop&auto=format",
      tags: ["Electronic", "Rooftop", "VIP"],
      price: "$45",
      featured: true
    },
    {
      id: "2",
      title: "Cultural Fusion Fest",
      host: "Maria Rodriguez",
      date: "This Weekend",
      time: "7:00 PM",
      location: "Cultural Center",
      attendees: 234,
      maxAttendees: 300,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop&auto=format",
      tags: ["Cultural", "Food", "Music"],
      price: "Free",
      featured: true
    },
    {
      id: "3",
      title: "Tech Startup Mixer",
      host: "Innovation Hub",
      date: "Next Week",
      time: "6:30 PM",
      location: "Tech District",
      attendees: 156,
      maxAttendees: 200,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop&auto=format",
      tags: ["Networking", "Tech", "Professional"],
      price: "$25",
      featured: false
    }
  ];

  const recentActivity: RecentActivity[] = [
    {
      id: "1",
      type: "event_created",
      message: "Sarah created 'Birthday Bash 2025'",
      time: "2 hours ago",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      id: "2",
      type: "rsvp",
      message: "15 people RSVP'd to 'Summer Pool Party'",
      time: "4 hours ago",
      icon: Users,
      color: "text-blue-600"
    },
    {
      id: "3",
      type: "achievement",
      message: "You earned the 'Party Planner' badge!",
      time: "1 day ago",
      icon: Award,
      color: "text-purple-600"
    }
  ];

  const trendingFeatures = [
    { name: "AR Party Overlays", users: "2.3k", growth: "+24%" },
    { name: "Live Music Voting", users: "1.8k", growth: "+18%" },
    { name: "Smart Entry System", users: "3.1k", growth: "+35%" },
    { name: "NFT Guest Passes", users: "892", growth: "+12%" }
  ];

  return (

    <>
    {/* <TopBar/> */}
    {/* <HeroSection/> */}
    {/* <div className="min-h-screen">
                     <PartySection/>
                     </div> */}
<div
  className="min-h-screen "
  style={{
    background: "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
  }}
>
  
<VibesWeddingUI/>

<WeddingDashboard/>
<FeatureGrid/>

<StatsSection/>

<EventIntegrations/>
<IntegrationHub/>

<WebScrapingSection/>

<RateLimitingAndAutomation/>
<DreamWeddingCard/>
      {location === "/" && <Footer />}
    
      {/* Header */}
      {/* <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-700/50 shadow-lg shadow-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">Vibes</h1>
                <p className="text-xs text-purple-500 dark:text-purple-400">Event Platform</p>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search events, hosts, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-purple-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-slate-700"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      {/* <main className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 shadow-2xl shadow-purple-500/25">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=600&fit=crop&auto=format" 
              alt="Party hub with people dancing and celebrating"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10"></div>
          </div>
          
          <div className="relative text-center space-y-6 px-8 py-16 md:py-24">
            <div className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium shadow-xl border border-white/40">
              <Sparkles className="w-4 h-4" />
              <span>Welcome back, John!</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              <span className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">Ready to create amazing</span>
              <span className="block text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-white bg-clip-text drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"> experiences</span><span className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">?</span>
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              Plan, host, and attend unforgettable events with AI-powered tools and immersive features.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/create-event">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Link href="/find-events">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold">
                  <Search className="w-5 h-5 mr-2" />
                  Discover Events
                </Button>
              </Link>
            </div>
          </div>
        </section>


        <section className="">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white text-center shadow-2xl">
            <div className="mb-6">
              <h2 className="text-4xl font-bold mb-4">🎉 Start Planning Your Dream Party!</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Create unforgettable events with our all-in-one party planning platform. From intimate gatherings to grand celebrations!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/create-event">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-white/90 font-bold text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Create Your Event Now
                </Button>
              </Link>
              
              <Link href="/ai-party-designer">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold text-lg px-8 py-4"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  AI Party Designer
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2 opacity-90">
                <Calendar className="w-5 h-5" />
                <span>Event Planning</span>
              </div>
              <div className="flex items-center justify-center space-x-2 opacity-90">
                <Users className="w-5 h-5" />
                <span>Guest Management</span>
              </div>
              <div className="flex items-center justify-center space-x-2 opacity-90">
                <Sparkles className="w-5 h-5" />
                <span>AI-Powered Tools</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link key={action.id} href={action.path}>
              <Card className="group hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105 transform hover:bg-white dark:hover:bg-slate-700">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{action.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{action.subtitle}</p>
                  <div className="flex items-center justify-between mt-4">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-purple-600 hover:text-purple-700">
                      Get Started
                    </Button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">Featured Events</h3>
              <Link href="/find-events">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden hover:bg-white dark:hover:bg-slate-700">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {event.featured && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg shadow-yellow-500/25">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-12 h-12 text-white/90" />
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{event.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Hosted by {event.host}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-600">{event.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees}/{event.maxAttendees}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            Join Event
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <Card className="border-0 bg-white dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:bg-gradient-to-r dark:from-purple-800/50 dark:to-pink-800/50 flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-white dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900 dark:text-white">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                  Trending Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{feature.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.users} users</p>
                    </div>
                    <Badge variant="secondary" className="text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border-emerald-200 dark:border-emerald-700">
                      {feature.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Explore More Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/ar-party-overlays">
                    <div className="text-center group cursor-pointer">
                      <Camera className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">AR Overlays</p>
                    </div>
                  </Link>
                  <Link href="/live-music-voting">
                    <div className="text-center group cursor-pointer">
                      <Music className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">Music Voting</p>
                    </div>
                  </Link>
                  <Link href="/ai-vibe-analyzer">
                    <div className="text-center group cursor-pointer">
                      <Mic className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">Vibe Analyzer</p>
                    </div>
                  </Link>
                  <Link href="/vibes-card-studio">
                    <div className="text-center group cursor-pointer">
                      <Palette className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">Card Studio</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Features</h3>
            <Link href="/system-overview">
              <Button variant="outline" size="sm">
                View All Features
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe, title: "Global Events", desc: "Discover worldwide parties", path: "/global-vibe-passport" },
              { icon: Gift, title: "Loyalty Rewards", desc: "Earn points & unlock perks", path: "/loyalty-rewards" },
              { icon: Target, title: "Smart Matching", desc: "AI-powered event suggestions", path: "/ai-personalized-recommendations" },
              { icon: Award, title: "Achievements", desc: "Unlock party achievements", path: "/host-achievements" }
            ].map((feature, index) => (
              <Link key={index} href={feature.path}>
                <Card className="group hover:shadow-md transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardContent className="p-4 text-center">
                    <feature.icon className="w-8 h-8 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
                    <h4 className="font-medium text-slate-900 dark:text-white mb-1">{feature.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{feature.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main> */}
      
      {/* Floating Action Button */}
      {/* <FloatingActionButton /> */}
    </div>


    </>
  );
}