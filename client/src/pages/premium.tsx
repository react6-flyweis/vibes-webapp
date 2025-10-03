import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Star, Zap, Users, Calendar, TrendingUp, Gift } from "lucide-react";

export default function PremiumPage() {
  const [location, setLocation] = useLocation();

  const premiumFeatures = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Unlimited Guests",
      description: "Invite as many people as you want to your events",
      status: "active"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "AI-Powered Suggestions",
      description: "Get intelligent recommendations for themes, menus, and activities",
      status: "active"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "Advanced Analytics",
      description: "Track engagement, RSVPs, and event success metrics",
      status: "active"
    },
    {
      icon: <Crown className="w-8 h-8 text-purple-500" />,
      title: "Custom Branding",
      description: "Add your logo and brand colors to invitations and materials",
      status: "active"
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: "Priority Support",
      description: "Get help when you need it with dedicated premium support",
      status: "active"
    },
    {
      icon: <Gift className="w-8 h-8 text-pink-500" />,
      title: "Export Capabilities",
      description: "Download guest lists, reports, and event data",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Premium!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your payment was successful. You now have access to all premium features.
          </p>
          <Badge variant="secondary" className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            Premium Member
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/event/1")}>
            <CardHeader className="text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Create Event</CardTitle>
              <CardDescription>Start planning your next amazing event</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/ai-theme-generator")}>
            <CardHeader className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <CardTitle className="text-lg">AI Theme Generator</CardTitle>
              <CardDescription>Get AI-powered theme suggestions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/vendors")}>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Browse Vendors</CardTitle>
              <CardDescription>Find trusted vendors for your events</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Premium Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Your Premium Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {feature.icon}
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <Card className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-blue-100 mb-6">
              You're all set! Create your first premium event and experience the difference.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => setLocation("/event/1")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setLocation("/ai-theme-generator")}
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Zap className="w-4 h-4 mr-2" />
                Try AI Features
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Support Info */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need help getting started? Our premium support team is here for you.
          </p>
          <Button variant="outline" onClick={() => setLocation("/profile")}>
            Contact Premium Support
          </Button>
        </div>
      </div>
    </div>
  );
}