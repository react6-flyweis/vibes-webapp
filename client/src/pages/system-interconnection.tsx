import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  Shield,
  Crown,
  Star,
  BarChart3,
  Eye,
  Zap,
  Users,
  Palette,
  Globe,
  Heart,
  Sparkles,
  Play,
  Settings,
  Network,
  Workflow,
  GitBranch,
  Database,
  Cloud,
} from "lucide-react";

// Complete feature ecosystem with interconnections
const featureEcosystem = {
  core: [
    {
      id: "smart-entry",
      name: "Smart Entry & Identity",
      path: "/smart-entry",
      icon: Shield,
      status: "active",
      connections: ["party-quest", "partycast-live", "pro-host-control"],
      metrics: { users: "247 entries", uptime: "99.9%" },
      description: "AI-powered access control with multi-modal authentication",
    },
    {
      id: "party-quest",
      name: "Party Quest",
      path: "/party-quest-gamified",
      icon: Star,
      status: "active",
      connections: ["smart-entry", "vibe-mall", "global-passport"],
      metrics: { users: "89 quests", uptime: "100%" },
      description: "Gamified guest experience with rewards and challenges",
    },
    {
      id: "partycast-live",
      name: "PartyCast Live",
      path: "/partycast-live",
      icon: Activity,
      status: "streaming",
      connections: ["immersive-cam", "pro-host-control", "ai-dj"],
      metrics: { users: "3 streams", uptime: "98.7%" },
      description: "Livestreaming with interactive viewer engagement",
    },
    {
      id: "pro-host-control",
      name: "Pro Host Control",
      path: "/pro-host-control-panel",
      icon: BarChart3,
      status: "monitoring",
      connections: ["smart-entry", "partycast-live", "ai-party-designer"],
      metrics: { users: "12 events", uptime: "99.5%" },
      description: "AI-powered event management and analytics",
    },
  ],
  commerce: [
    {
      id: "vibe-mall",
      name: "VibeMall",
      path: "/vibe-mall",
      icon: Eye,
      status: "active",
      connections: ["party-quest", "drink-payment", "vendor-marketplace"],
      metrics: { revenue: "$12,750", transactions: "156" },
      description: "Live shopping with AR try-on features",
    },
    {
      id: "drink-payment",
      name: "Interactive Drink Payment",
      path: "/interactive-drink-payment",
      icon: Zap,
      status: "processing",
      connections: ["vibe-mall", "smart-drink-concierge", "vendor-marketplace"],
      metrics: { payments: "156 today", success: "98.7%" },
      description: "QR/NFC wristband payment integration",
    },
    {
      id: "vendor-marketplace",
      name: "Vendor Marketplace",
      path: "/vendor-marketplace",
      icon: Users,
      status: "active",
      connections: ["vibe-mall", "drink-payment", "digital-twin"],
      metrics: { vendors: "34 active", bookings: "67" },
      description: "Complete vendor ecosystem with payments",
    },
  ],
  design: [
    {
      id: "collaborative-design",
      name: "Collaborative Design",
      path: "/collaborative-design-sharing",
      icon: Palette,
      status: "creating",
      connections: ["ai-party-designer", "digital-twin", "cultural-dna"],
      metrics: { designs: "67 shared", collaborations: "23" },
      description: "Community-driven design sharing platform",
    },
    {
      id: "digital-twin",
      name: "Digital Twin System",
      path: "/digital-twin-system",
      icon: Globe,
      status: "active",
      connections: [
        "collaborative-design",
        "vendor-marketplace",
        "ai-party-designer",
      ],
      metrics: { venues: "8 digitized", models: "125 GB" },
      description: "3D venue modeling with immersive planning",
    },
    {
      id: "ai-party-designer",
      name: "AI Party Designer",
      path: "/ai-party-designer",
      icon: Sparkles,
      status: "generating",
      connections: ["digital-twin", "collaborative-design", "pro-host-control"],
      metrics: { themes: "23 created", requests: "89" },
      description: "AI-powered theme generation and blueprints",
    },
  ],
  culture: [
    {
      id: "cultural-dna",
      name: "Cultural DNA Layer",
      path: "/cultural-dna-layer",
      icon: Heart,
      status: "exploring",
      connections: [
        "collaborative-design",
        "global-passport",
        "in-event-commerce",
      ],
      metrics: { cultures: "8 featured", contributors: "156" },
      description: "Authentic cultural celebration platform",
    },
    {
      id: "global-passport",
      name: "Global Vibe Passport",
      path: "/global-vibe-passport",
      icon: Crown,
      status: "collecting",
      connections: ["party-quest", "cultural-dna", "smart-entry"],
      metrics: { stamps: "234 earned", levels: "5 tiers" },
      description: "Gamified loyalty program with rewards",
    },
    {
      id: "in-event-commerce",
      name: "In-Event Commerce",
      path: "/in-event-commerce",
      icon: CheckCircle,
      status: "shopping",
      connections: ["cultural-dna", "vibe-mall", "immersive-cam"],
      metrics: { purchases: "78 today", revenue: "$4,230" },
      description: "Real-time shopping with contextual offers",
    },
  ],
  innovation: [
    {
      id: "immersive-cam",
      name: "Immersive PartyCam",
      path: "/immersive-party-cam",
      icon: Activity,
      status: "recording",
      connections: ["partycast-live", "in-event-commerce", "ai-dj"],
      metrics: { videos: "12 created", storage: "45 GB" },
      description: "360° recording with AR lenses",
    },
    {
      id: "smart-drink-concierge",
      name: "Smart Drink Concierge",
      path: "/smart-drink-concierge",
      icon: Zap,
      status: "serving",
      connections: ["drink-payment", "party-quest", "ai-dj"],
      metrics: { drinks: "89 served", wristbands: "234 active" },
      description: "QR/NFC wristband drink experiences",
    },
    {
      id: "ai-dj",
      name: "AI DJ Companion",
      path: "/ai-dj-companion",
      icon: Users,
      status: "mixing",
      connections: ["partycast-live", "immersive-cam", "smart-drink-concierge"],
      metrics: { playlists: "4 active", tracks: "1,247" },
      description: "Real-time music curation with crowd analysis",
    },
  ],
};

const systemHealth = {
  overallStatus: "Operational",
  uptime: "99.9%",
  activeFeatures: 18,
  totalTransactions: 1247,
  realTimeUsers: 389,
  dataFlow: "2.3 GB/hr",
  apiCalls: "15,678/hr",
};

const integrationFlows = [
  {
    name: "Guest Journey",
    steps: ["Smart Entry", "Party Quest", "VibeMall", "Global Passport"],
    description: "Complete guest experience from entry to rewards",
    active: true,
  },
  {
    name: "Host Management",
    steps: [
      "Pro Host Control",
      "AI Party Designer",
      "Digital Twin",
      "PartyCast Live",
    ],
    description: "End-to-end event planning and management",
    active: true,
  },
  {
    name: "Commerce Flow",
    steps: [
      "VibeMall",
      "Drink Payment",
      "Vendor Marketplace",
      "In-Event Commerce",
    ],
    description: "Seamless commerce and payment ecosystem",
    active: true,
  },
  {
    name: "Cultural Experience",
    steps: [
      "Cultural DNA",
      "Collaborative Design",
      "Global Passport",
      "Immersive Cam",
    ],
    description: "Authentic cultural celebration and sharing",
    active: true,
  },
];

export default function SystemInterconnection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeature, setSelectedFeature] = useState(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "streaming":
        return "bg-red-500";
      case "monitoring":
        return "bg-blue-500";
      case "processing":
        return "bg-yellow-500";
      case "creating":
        return "bg-purple-500";
      case "generating":
        return "bg-pink-500";
      case "exploring":
        return "bg-orange-500";
      case "collecting":
        return "bg-indigo-500";
      case "shopping":
        return "bg-emerald-500";
      case "recording":
        return "bg-rose-500";
      case "serving":
        return "bg-cyan-500";
      case "mixing":
        return "bg-violet-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAllFeatures = () => {
    return [
      ...featureEcosystem.core,
      ...featureEcosystem.commerce,
      ...featureEcosystem.design,
      ...featureEcosystem.culture,
      ...featureEcosystem.innovation,
    ];
  };

  const getFilteredFeatures = () => {
    if (selectedCategory === "all") return getAllFeatures();
    return featureEcosystem[selectedCategory] || [];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            System Interconnection
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Complete platform integration showing how all features work together
            seamlessly
          </p>

          {/* System Health Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {systemHealth.activeFeatures}
              </div>
              <div className="text-xs text-muted-foreground">
                Features Active
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-blue-600">
                {systemHealth.realTimeUsers}
              </div>
              <div className="text-xs text-muted-foreground">Users Online</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-purple-600">
                {systemHealth.totalTransactions}
              </div>
              <div className="text-xs text-muted-foreground">Transactions</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-600">
                {systemHealth.uptime}
              </div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-cyan-600">
                {systemHealth.dataFlow}
              </div>
              <div className="text-xs text-muted-foreground">Data Flow</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-pink-600">
                {systemHealth.apiCalls}
              </div>
              <div className="text-xs text-muted-foreground">API Calls</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-600">Live</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="ecosystem" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ecosystem">Feature Ecosystem</TabsTrigger>
            <TabsTrigger value="flows">Integration Flows</TabsTrigger>
            <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="ecosystem" className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All Features ({getAllFeatures().length})
              </Button>
              {Object.entries(featureEcosystem).map(([key, features]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} (
                  {features.length})
                </Button>
              ))}
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredFeatures().map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-purple-500 cursor-pointer"
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-blue-500 text-white">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">
                              {feature.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getStatusColor(
                                  feature.status
                                )}`}
                              ></div>
                              <span className="text-xs text-muted-foreground capitalize">
                                {feature.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {feature.connections.length} connections
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <div className="space-y-2 mb-3">
                        {Object.entries(feature.metrics).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground capitalize">
                              {key}
                            </span>
                            <span className="font-medium text-purple-600">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1 mr-2"
                        >
                          <Link href={feature.path}>
                            Launch
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Network className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {integrationFlows.map((flow, index) => (
                <Card
                  key={index}
                  className="bg-linear-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-950"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-purple-600" />
                      {flow.name}
                      {flow.active && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto"></div>
                      )}
                    </CardTitle>
                    <CardDescription>{flow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {flow.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex items-center gap-3"
                        >
                          <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 text-xs font-medium flex items-center justify-center">
                            {stepIndex + 1}
                          </div>
                          <span className="text-sm font-medium">{step}</span>
                          {stepIndex < flow.steps.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View Flow Details
                      <GitBranch className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Architecture Overview */}
            <Card className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  System Architecture
                </CardTitle>
                <CardDescription>
                  How all platform components communicate and share data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-3">
                      <Cloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium">Cloud Infrastructure</h4>
                      <p className="text-xs text-muted-foreground">
                        Scalable backend services
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-3">
                      <Network className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium">API Gateway</h4>
                      <p className="text-xs text-muted-foreground">
                        Unified data orchestration
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-3">
                      <Settings className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium">Real-time Processing</h4>
                      <p className="text-xs text-muted-foreground">
                        Instant feature synchronization
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage Analytics</CardTitle>
                  <CardDescription>
                    Real-time usage patterns across all features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getAllFeatures()
                      .slice(0, 6)
                      .map((feature) => (
                        <div key={feature.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{feature.name}</span>
                            <span className="text-muted-foreground">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>
                    Real-time performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Response Time</span>
                        <span className="text-green-600">127ms avg</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Throughput</span>
                        <span className="text-blue-600">2.3k req/min</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Error Rate</span>
                        <span className="text-green-600">0.1%</span>
                      </div>
                      <Progress value={99} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Sync</span>
                        <span className="text-purple-600">Real-time</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Live Activity Feed
                  <Badge variant="outline" className="ml-auto">
                    Real-time
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    {
                      action: "Smart Entry processed",
                      feature: "Smart Entry",
                      time: "2 seconds ago",
                      type: "success",
                    },
                    {
                      action: "Quest completed",
                      feature: "Party Quest",
                      time: "15 seconds ago",
                      type: "info",
                    },
                    {
                      action: "Payment processed",
                      feature: "VibeMall",
                      time: "23 seconds ago",
                      type: "success",
                    },
                    {
                      action: "Stream started",
                      feature: "PartyCast Live",
                      time: "1 minute ago",
                      type: "info",
                    },
                    {
                      action: "Design shared",
                      feature: "Collaborative Design",
                      time: "2 minutes ago",
                      type: "info",
                    },
                    {
                      action: "NFT minted",
                      feature: "Smart Entry",
                      time: "3 minutes ago",
                      type: "success",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium">
                        {activity.action}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.feature}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Navigation */}
        <Card className="mt-8 bg-linear-to-r from-purple-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Ready to Experience the Platform?
                </h3>
                <p className="text-purple-100">
                  All features are interconnected and ready to use
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="secondary" asChild>
                  <Link href="/smart-entry">Start with Smart Entry</Link>
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                  asChild
                >
                  <Link href="/">Back to Dashboard</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedFeature.icon className="w-5 h-5" />
                {selectedFeature.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setSelectedFeature(null)}
                >
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedFeature.description}
              </p>
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Connected Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedFeature.connections.map((connection) => (
                    <Badge
                      key={connection}
                      variant="outline"
                      className="text-xs"
                    >
                      {connection.replace("-", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href={selectedFeature.path}>
                  Launch {selectedFeature.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
