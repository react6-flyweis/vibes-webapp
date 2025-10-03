import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "lucide-react";

export default function DemoFeatures() {
  const [activeFeature, setActiveFeature] = useState("curator");

  const features = [
    {
      id: "curator",
      name: "AI Vibe Curator",
      description: "Personal party strategist that learns your style",
      icon: Brain,
      color: "purple",
      path: "/vibe-curator",
      details:
        "Learns your party style over time and offers hyper-personalized suggestions for timing, music, guest engagement, and food pairings.",
    },
    {
      id: "virtual",
      name: "Virtual Party Twin",
      description: "Metaverse-ready 3D virtual events",
      icon: Globe,
      color: "cyan",
      path: "/virtual-party-twin",
      details:
        "Create a virtual twin of your event in a 3D environment where remote guests can join and interact digitally.",
    },
    {
      id: "adaptive",
      name: "Adaptive Environment",
      description: "Smart venue control for lighting and atmosphere",
      icon: Zap,
      color: "orange",
      path: "/adaptive-environment",
      details:
        "Smart home integration to control lighting, scent diffusers, and temperature based on crowd mood and music energy.",
    },
    {
      id: "verified",
      name: "Vibe-Verified Guests",
      description: "Social reputation system with badges",
      icon: Trophy,
      color: "yellow",
      path: "/vibe-verified-guests",
      details:
        "Guests earn badges for being great vibe contributors: Hype Captain, Chill Connector, Vibe Curator, and more.",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: "from-purple-500 to-indigo-500 text-purple-600",
      cyan: "from-cyan-500 to-blue-500 text-cyan-600",
      orange: "from-orange-500 to-red-500 text-orange-600",
      yellow: "from-yellow-500 to-orange-500 text-yellow-600",
    };
    return (
      colorMap[color as keyof typeof colorMap] ||
      "from-gray-500 to-gray-600 text-gray-600"
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vibes: Next-Level Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary innovations that transform Vibes from a great party
            planning tool into an iconic, must-have app for social events and
            nightlife.
          </p>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <Link key={feature.id} href={feature.path}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-linear-to-r ${getColorClasses(
                      feature.color
                    )} rounded-xl flex items-center justify-center`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full group-hover:bg-blue-600">
                    Explore Feature
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Feature Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Feature to Preview</CardTitle>
              <CardDescription>
                Click to see detailed information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {features.map((feature) => (
                <Button
                  key={feature.id}
                  variant={activeFeature === feature.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <feature.icon className="w-4 h-4 mr-2" />
                  {feature.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Feature Details */}
          <div className="lg:col-span-2">
            {features.map(
              (feature) =>
                activeFeature === feature.id && (
                  <Card key={feature.id} className="h-full">
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 bg-linear-to-r ${getColorClasses(
                            feature.color
                          )} rounded-lg flex items-center justify-center mr-4`}
                        >
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">
                            {feature.name}
                          </CardTitle>
                          <Badge className="mt-2">Revolutionary Feature</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        {feature.details}
                      </p>
                      <Link href={feature.path}>
                        <Button size="lg" className="w-full">
                          Experience {feature.name}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        </div>

        {/* Additional Features Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-6 h-6 text-indigo-600 mr-3" />
              Complete Feature Suite
            </CardTitle>
            <CardDescription>
              All innovative capabilities in one platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/ai-party-designer">
                <div className="p-4 rounded-lg bg-linear-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow cursor-pointer">
                  <Sparkles className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">
                    AI Party Designer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Complete event blueprints
                  </p>
                </div>
              </Link>

              <Link href="/live-music-voting">
                <div className="p-4 rounded-lg bg-linear-to-br from-green-50 to-teal-50 hover:shadow-md transition-shadow cursor-pointer">
                  <Music className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">
                    Live Music Voting
                  </h3>
                  <p className="text-sm text-gray-600">
                    Guest-driven song selection
                  </p>
                </div>
              </Link>

              <Link href="/nightclub-experience">
                <div className="p-4 rounded-lg bg-linear-to-br from-purple-50 to-pink-50 hover:shadow-md transition-shadow cursor-pointer">
                  <Heart className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">
                    Nightclub Experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    Digital nightlife discovery
                  </p>
                </div>
              </Link>

              <Link href="/events/1">
                <div className="p-4 rounded-lg bg-linear-to-br from-orange-50 to-red-50 hover:shadow-md transition-shadow cursor-pointer">
                  <Calendar className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-800">
                    Event Planning
                  </h3>
                  <p className="text-sm text-gray-600">
                    Collaborative management
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
            >
              <Users className="w-5 h-5 mr-2" />
              Return to Main Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
