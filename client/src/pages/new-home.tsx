import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Calendar, ArrowRight, Zap, Heart, Trophy, Star, Store, Crown, Building2, PartyPopper, Music, Video, Leaf } from "lucide-react";
import { Link } from "wouter";

export default function NewHomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Plan Perfect Events</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Together with AI
              </span>
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Create unforgettable experiences with our intelligent collaborative platform. From intimate gatherings to grand celebrations, we make event planning effortless and fun.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events/1">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                  <Calendar className="mr-2 h-5 w-5" />
                  Start Planning
                </Button>
              </Link>
              <Link href="/ai-theme-generator">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 px-8 py-3">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Try AI Themes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Everything you need in one place
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful tools designed to make event planning simple and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Party Designer */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    AI Powered
                  </Badge>
                </div>
                <CardTitle className="text-xl">AI Party Designer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Complete event blueprints with menu plans, vendor matches, decoration schemes, and timeline management.
                </CardDescription>
                <Link href="/ai-party-designer">
                  <Button className="w-full group-hover:bg-blue-600">
                    Design Party
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Nightclub Experience */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    Nightlife
                  </Badge>
                </div>
                <CardTitle className="text-xl">Nightclub Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Real-time club discovery, digital check-in, live social feeds, and DJ interactions for the ultimate nightlife.
                </CardDescription>
                <Link href="/nightclub-experience">
                  <Button className="w-full group-hover:bg-purple-600">
                    Explore Nightlife
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Live Music Voting */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Live
                  </Badge>
                </div>
                <CardTitle className="text-xl">Live Music Voting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Real-time song suggestions and voting system that lets guests shape the music with DJ integration.
                </CardDescription>
                <Link href="/live-music-voting">
                  <Button className="w-full group-hover:bg-green-600">
                    Vote on Music
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 3D/AR Space Planner */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    3D/AR
                  </Badge>
                </div>
                <CardTitle className="text-xl">3D/AR Space Planner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Virtual venue design with drag-and-drop furniture, guest flow analysis, and immersive AR previews.
                </CardDescription>
                <Link href="/ar-space-planner">
                  <Button className="w-full group-hover:bg-indigo-600">
                    Plan Space
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Vibe Analyzer */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                    AI Analysis
                  </Badge>
                </div>
                <CardTitle className="text-xl">AI Vibe Analyzer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Real-time sentiment analysis from guest communications with smart recommendations and mood tracking.
                </CardDescription>
                <Link href="/ai-vibe-analyzer">
                  <Button className="w-full group-hover:bg-pink-600">
                    Analyze Vibes
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Smart Scheduling */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-green-500 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300">
                    Smart
                  </Badge>
                </div>
                <CardTitle className="text-xl">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  AI-powered calendar integration that finds optimal times across all timezones with availability sync.
                </CardDescription>
                <Link href="/smart-scheduling">
                  <Button className="w-full group-hover:bg-teal-600">
                    Schedule Smart
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sustainability Tracker */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Eco-Friendly
                  </Badge>
                </div>
                <CardTitle className="text-xl">Sustainability Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Carbon footprint monitoring, eco-vendor matching, and green certification for sustainable events.
                </CardDescription>
                <Link href="/sustainability-tracker">
                  <Button className="w-full group-hover:bg-green-600">
                    Go Green
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Host Achievements */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    Gamified
                  </Badge>
                </div>
                <CardTitle className="text-xl">Host Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Badge system, leaderboards, challenges, and rewards that gamify event hosting for engagement.
                </CardDescription>
                <Link href="/host-achievements">
                  <Button className="w-full group-hover:bg-yellow-600">
                    View Achievements
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Livestream Companion */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                    Live Stream
                  </Badge>
                </div>
                <CardTitle className="text-xl">Livestream Companion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Interactive streaming with real-time chat, polls, donations, and hybrid event support for virtual guests.
                </CardDescription>
                <Link href="/livestream-companion">
                  <Button className="w-full group-hover:bg-red-600">
                    Start Streaming
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Event Planning */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline">Essential</Badge>
                </div>
                <CardTitle className="text-xl">Collaborative Planning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Plan together with friends and family. Manage menus, tasks, guest lists, and budgets in one workspace.
                </CardDescription>
                <Link href="/events/1">
                  <Button variant="outline" className="w-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900">
                    Start Planning
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Vendor Marketplace */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline">Marketplace</Badge>
                </div>
                <CardTitle className="text-xl">Vendor Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Discover trusted DJs, venues, caterers, and decorators. Compare services and book directly.
                </CardDescription>
                <Link href="/vendors">
                  <Button variant="outline" className="w-full group-hover:bg-orange-50 dark:group-hover:bg-orange-900">
                    Browse Vendors
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Trusted by event planners everywhere
            </h2>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">10k+</div>
                <div className="text-blue-100">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">5k+</div>
                <div className="text-blue-100">Happy Planners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">500+</div>
                <div className="text-blue-100">Trusted Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">98%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions for Business Users */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              For Event Professionals
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Join our marketplace and grow your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Join as Vendor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  List your services in our trusted marketplace. Connect with clients and grow your event business.
                </CardDescription>
                <Link href="/vendor-onboarding">
                  <Button className="w-full">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Advertise Your Business</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  Boost your visibility with targeted ads. Reach more clients and showcase your services effectively.
                </CardDescription>
                <Link href="/business-promotion">
                  <Button variant="outline" className="w-full">
                    Start Advertising
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Ready to create something amazing?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Join thousands of happy event planners who trust Vibes to bring their visions to life.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events/1">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Star className="mr-2 h-5 w-5" />
                Start Free Today
              </Button>
            </Link>
            <Link href="/vendors">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3">
                <Store className="mr-2 h-5 w-5" />
                Browse Vendors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}