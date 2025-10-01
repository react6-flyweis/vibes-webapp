import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Brain, 
  Globe, 
  Zap, 
  Trophy, 
  Sparkles, 
  ArrowRight,
  Music,
  Users,
  Calendar,
  Crown,
  Heart,
  Star,
  User,
  LogOut,
  Settings,
  Video,
  Shield
} from "lucide-react";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-party-gradient-1 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-party-rainbow opacity-10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-party-pink rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-party-yellow rounded-full opacity-30 animate-party-wiggle"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-party-turquoise rounded-full opacity-15 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent animate-party-wiggle">Welcome to Vibes!</h1>
            <p className="text-white/90 mt-2 text-xl font-medium">Ready to plan your next amazing event?</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Demo User
            </Badge>
            <Link href="/checkout">
              <Button className="bg-party-gradient-2 hover:scale-105 transition-transform animate-neon-glow border-2 border-white/30">
                <Trophy className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </Link>
            <Link href="/stripe-config">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10">
                <Crown className="h-4 w-4 mr-2" />
                Configure Payment
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

        {/* Revolutionary Features Section */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center animate-bounce-gentle">
              <Sparkles className="w-10 h-10 mr-3 text-yellow-200" />
              Revolutionary Features
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Next-level innovations that make Vibes the ultimate party planning platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/vibe-curator">
                <div className="p-6 rounded-xl bg-white/15 hover:bg-white/25 transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/20">
                  <Brain className="h-10 w-10 text-party-yellow mb-3" />
                  <h3 className="font-bold text-white text-lg">AI Vibe Curator</h3>
                  <p className="text-sm text-white/80">Personal party strategist</p>
                </div>
              </Link>

              <Link href="/virtual-party-twin">
                <div className="p-6 rounded-xl bg-white/15 hover:bg-white/25 transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/20">
                  <Globe className="h-10 w-10 text-party-turquoise mb-3" />
                  <h3 className="font-bold text-white text-lg">Virtual Party Twin</h3>
                  <p className="text-sm text-white/80">Metaverse experience</p>
                </div>
              </Link>

              <Link href="/adaptive-environment">
                <div className="p-6 rounded-xl bg-white/15 hover:bg-white/25 transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/20">
                  <Zap className="h-10 w-10 text-party-orange mb-3" />
                  <h3 className="font-bold text-white text-lg">Adaptive Environment</h3>
                  <p className="text-sm text-white/80">Smart venue integration</p>
                </div>
              </Link>

              <Link href="/vibe-verified-guests">
                <div className="p-6 rounded-xl bg-white/15 hover:bg-white/25 transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/20">
                  <Trophy className="h-10 w-10 text-party-yellow mb-3" />
                  <h3 className="font-bold text-white text-lg">Vibe-Verified Guests</h3>
                  <p className="text-sm text-white/80">Social reputation system</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/events/1">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-party-coral/30">
              <CardHeader className="text-center">
                <Calendar className="h-10 w-10 text-party-coral mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">Plan Event</CardTitle>
                <CardDescription className="text-party-gray">Create and manage events</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ai-party-designer">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-party-purple/30">
              <CardHeader className="text-center">
                <Sparkles className="h-10 w-10 text-party-purple mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">AI Party Designer</CardTitle>
                <CardDescription className="text-party-gray">Complete event blueprints</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/live-music-voting">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-party-turquoise/30">
              <CardHeader className="text-center">
                <Music className="h-10 w-10 text-party-turquoise mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">Live Music Voting</CardTitle>
                <CardDescription className="text-party-gray">Guest-driven song selection</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ai-video-memory">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-party-pink/30">
              <CardHeader className="text-center">
                <Video className="h-10 w-10 text-party-pink mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">AI Video Memory</CardTitle>
                <CardDescription className="text-party-gray">Epic after-movie generator</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/smart-contract-escrow">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-green-400/30">
              <CardHeader className="text-center">
                <Shield className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">Smart Contract Escrow</CardTitle>
                <CardDescription className="text-party-gray">Blockchain vendor payments</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/nightclub-experience">
            <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/95 backdrop-blur hover:scale-105 animate-party-wiggle border-2 border-party-pink/30">
              <CardHeader className="text-center">
                <Heart className="h-10 w-10 text-party-pink mx-auto mb-2" />
                <CardTitle className="text-lg font-bold text-party-dark">Nightclub Experience</CardTitle>
                <CardDescription className="text-party-gray">Digital nightlife discovery</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/ai-theme-generator">
            <div className="p-6 rounded-xl bg-party-gradient-3 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/30">
              <Sparkles className="h-10 w-10 text-white mb-3" />
              <h3 className="font-bold text-white text-lg">AI Theme Generator</h3>
              <p className="text-sm text-white/80">Smart theme creation</p>
            </div>
          </Link>

          <Link href="/ar-space-planner">
            <div className="p-6 rounded-xl bg-party-gradient-1 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/30">
              <Globe className="h-10 w-10 text-white mb-3" />
              <h3 className="font-bold text-white text-lg">AR Space Planner</h3>
              <p className="text-sm text-white/80">Virtual space design</p>
            </div>
          </Link>

          <Link href="/guest-matchmaking">
            <div className="p-6 rounded-xl bg-party-gradient-2 hover:shadow-2xl transition-all cursor-pointer hover:scale-105 animate-party-wiggle border border-white/30">
              <Users className="h-10 w-10 text-white mb-3" />
              <h3 className="font-bold text-white text-lg">Guest Matchmaking</h3>
              <p className="text-sm text-white/80">Smart guest connections</p>
            </div>
          </Link>

          <Link href="/vendors">
            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 hover:shadow-md transition-shadow cursor-pointer">
              <Crown className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Vendor Marketplace</h3>
              <p className="text-sm text-gray-600">Find party vendors</p>
            </div>
          </Link>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/demo">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}