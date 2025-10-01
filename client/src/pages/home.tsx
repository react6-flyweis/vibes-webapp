import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { 
  Calendar, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Star,
  Heart,
  Zap,
  Trophy,
  LogOut,
  User,
  Crown,
  Coins,
  Building2
} from "lucide-react";

export default function HomePage() {
  // Always show the main dashboard for now
  const showDashboard = true;

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Welcome to Vibes!</h1>
              <p className="text-gray-600 mt-2">Ready to plan your next amazing event?</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Demo User
              </Badge>
              <Link href="/pricing">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Trophy className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/find-events">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Find & Book Events</h3>
                  <p className="text-blue-100">Discover amazing events worldwide and book instantly</p>
                  <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                    Explore Events
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/create-event">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-green-600 to-teal-600 text-white cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Create Your Event</h3>
                  <p className="text-green-100">Plan and organize unforgettable experiences</p>
                  <Button className="mt-4 bg-white text-green-600 hover:bg-gray-100">
                    Start Planning
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/vendors">
              <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-orange-600 to-red-600 text-white cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Vendor Marketplace</h3>
                  <p className="text-orange-100">Connect with professional event vendors</p>
                  <Button className="mt-4 bg-white text-orange-600 hover:bg-gray-100">
                    Browse Vendors
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Web3 Blockchain Features */}
          <Card className="mb-8 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Crown className="h-8 w-8 text-yellow-400" />
                Revolutionary Web3 Features
              </CardTitle>
              <CardDescription className="text-purple-100">
                Next-generation blockchain-powered event experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/nft-guest-passes">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Dynamic NFT Passes</CardTitle>
                      <CardDescription className="text-purple-100">Evolving guest passes that level up</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/global-marketplace">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Users className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Global Marketplace</CardTitle>
                      <CardDescription className="text-purple-100">Decentralized vendor platform</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/event-dao">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Star className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Event-as-a-DAO</CardTitle>
                      <CardDescription className="text-purple-100">Community-owned events</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/ai-vibe-modeling">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                      <CardTitle className="text-white">AI Vibe Modeling</CardTitle>
                      <CardDescription className="text-purple-100">Predictive guest preferences</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/token-gated-vip">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Token-Gated VIP</CardTitle>
                      <CardDescription className="text-purple-100">Exclusive premium experiences</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/ar-vr-immersive">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-2" />
                      <CardTitle className="text-white">AR/VR Immersive</CardTitle>
                      <CardDescription className="text-purple-100">Virtual venue previews</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/sustainability-badges">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Heart className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Sustainability Badges</CardTitle>
                      <CardDescription className="text-purple-100">Verified eco-friendly events</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/smart-contract-escrow">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Trophy className="h-12 w-12 text-orange-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Smart Escrow</CardTitle>
                      <CardDescription className="text-purple-100">Secure vendor payments</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/vendor-liquidity">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Coins className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                      <CardTitle className="text-white">DeFi Liquidity</CardTitle>
                      <CardDescription className="text-purple-100">Instant vendor cash flow</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/branded-micro-events">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Star className="h-12 w-12 text-pink-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Brand Activations</CardTitle>
                      <CardDescription className="text-purple-100">Sponsored micro-experiences</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/venue-integration">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Building2 className="h-12 w-12 text-green-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Venue Partners</CardTitle>
                      <CardDescription className="text-purple-100">Digital twin integration</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Event Discovery & Booking */}
          <Card className="mb-8 bg-gradient-to-r from-blue-900 to-green-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="h-8 w-8 text-green-400" />
                Event Discovery & Booking
              </CardTitle>
              <CardDescription className="text-blue-100">
                Find and book amazing events with AI recommendations and social features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/event-discovery">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Discover Events</CardTitle>
                      <CardDescription className="text-blue-100">AI-powered event search</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/loyalty-rewards">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Loyalty & Rewards</CardTitle>
                      <CardDescription className="text-blue-100">Earn points and perks</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/social-groups">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Users className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Social Groups</CardTitle>
                      <CardDescription className="text-blue-100">Create event groups</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/live-updates">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="text-center">
                      <Zap className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <CardTitle className="text-white">Live Updates</CardTitle>
                      <CardDescription className="text-blue-100">Real-time event info</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Live Vibes Invite - Featured Section */}
          <Card className="mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Interactive Live Vibes Invite</CardTitle>
                  <CardDescription className="text-pink-100 text-lg">Revolutionary immersive invitations that transform how guests experience your events</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🎬</span>
                  </div>
                  <h4 className="font-semibold text-white">Personal Videos</h4>
                  <p className="text-sm text-pink-100">Custom welcome messages</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h4 className="font-semibold text-white">3D Venue Tours</h4>
                  <p className="text-sm text-pink-100">Immersive space preview</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h4 className="font-semibold text-white">Live Music Voting</h4>
                  <p className="text-sm text-pink-100">Guest playlist control</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <h4 className="font-semibold text-white">VIP Perks</h4>
                  <p className="text-sm text-pink-100">Exclusive guest benefits</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h4 className="font-semibold text-white">NFT RSVP</h4>
                  <p className="text-sm text-pink-100">Collectible memories</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Link href="/interactive-live-vibes-invite">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all">
                    Experience Immersive Invitations →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Traditional Event Features */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/events/1">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <CardTitle>My Events</CardTitle>
                  <CardDescription>Manage your celebrations</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/ai-party-designer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <CardTitle>AI Party Designer</CardTitle>
                  <CardDescription>Complete event blueprints</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/nightclub-experience">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Zap className="h-12 w-12 text-pink-600 mx-auto mb-2" />
                  <CardTitle>Nightclub Experience</CardTitle>
                  <CardDescription>Real-time nightlife discovery</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/live-music-voting">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <CardTitle>Live Music Voting</CardTitle>
                  <CardDescription>Guest-driven song selection</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* AI Features Showcase */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                Revolutionary AI Features
              </CardTitle>
              <CardDescription>Powered by cutting-edge artificial intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/ai-theme-generator">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Star className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">AI Theme Generator</h3>
                    <p className="text-sm text-gray-600">AI-curated event themes</p>
                  </div>
                </Link>

                <Link href="/ai-vibe-analyzer">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Heart className="h-8 w-8 text-pink-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">AI Vibe Analyzer</h3>
                    <p className="text-sm text-gray-600">Real-time sentiment tracking</p>
                  </div>
                </Link>

                <Link href="/ar-space-planner">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Trophy className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">3D/AR Space Planner</h3>
                    <p className="text-sm text-gray-600">Virtual venue design</p>
                  </div>
                </Link>

                <Link href="/smart-scheduling">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Smart Scheduling</h3>
                    <p className="text-sm text-gray-600">AI calendar optimization</p>
                  </div>
                </Link>

                <Link href="/sustainability-tracker">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Heart className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Sustainability Tracker</h3>
                    <p className="text-sm text-gray-600">Eco-friendly planning</p>
                  </div>
                </Link>

                <Link href="/host-achievements">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Host Achievements</h3>
                    <p className="text-sm text-gray-600">Gamified hosting</p>
                  </div>
                </Link>

                <Link href="/livestream-companion">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Zap className="h-8 w-8 text-red-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Livestream Companion</h3>
                    <p className="text-sm text-gray-600">Interactive streaming</p>
                  </div>
                </Link>

                <Link href="/vendors">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Users className="h-8 w-8 text-indigo-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Vendor Marketplace</h3>
                    <p className="text-sm text-gray-600">Find trusted vendors</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Next-Level Features */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-indigo-500" />
                Next-Level Features
              </CardTitle>
              <CardDescription>Ground-breaking innovations that make Vibes iconic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/vibe-curator">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Heart className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">AI Vibe Curator</h3>
                    <p className="text-sm text-gray-600">Personal party strategist</p>
                  </div>
                </Link>

                <Link href="/virtual-party-twin">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Zap className="h-8 w-8 text-cyan-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Virtual Party Twin</h3>
                    <p className="text-sm text-gray-600">Metaverse party experience</p>
                  </div>
                </Link>

                <Link href="/adaptive-environment">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Star className="h-8 w-8 text-orange-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Adaptive Environment</h3>
                    <p className="text-sm text-gray-600">Smart venue control</p>
                  </div>
                </Link>

                <Link href="/vibe-verified-guests">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-md transition-shadow cursor-pointer">
                    <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
                    <h3 className="font-semibold text-gray-800">Vibe-Verified Guests</h3>
                    <p className="text-sm text-gray-600">Social reputation system</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Events</CardTitle>
              <CardDescription>Continue working on your celebrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events yet. Create your first event to get started!</p>
                <Link href="/events/new">
                  <Button className="mt-4">
                    Create Your First Event
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">Vibes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The revolutionary event planning platform that combines AI-powered intelligence, 
            immersive AR visualization, and seamless collaboration to create unforgettable celebrations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => {
                const userData = {
                  id: 1,
                  username: "demo_user",
                  email: "demo@vibes.com",
                  fullName: "Demo User",
                  subscriptionTier: "free"
                };
                // Simple demo login
                window.location.href = "/demo";
              }}
            >
              Get Started (Demo Login)
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI-Powered Planning</CardTitle>
              <CardDescription>
                Get intelligent recommendations for themes, vendors, and guest experiences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AR Visualization</CardTitle>
              <CardDescription>
                Preview decorations and layouts in your actual space using augmented reality
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Collaboration</CardTitle>
              <CardDescription>
                Coordinate with guests and vendors through intelligent matchmaking and planning tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Events?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of hosts creating magical experiences with AI-powered event planning.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start Planning Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}