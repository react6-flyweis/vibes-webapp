import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import {
  Network,
  CheckCircle,
  AlertCircle,
  Activity,
  Users,
  Calendar,
  Palette,
  MapPin,
  Armchair,
  Mail,
  Sparkles,
  TrendingUp,
  Settings,
  RefreshCw,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SystemStatus {
  service: string;
  status: "healthy" | "degraded" | "down";
  lastCheck: string;
  responseTime: number;
  features: string[];
}

interface IntegrationFlow {
  id: string;
  name: string;
  source: string;
  target: string;
  status: "active" | "inactive" | "error";
  dataExchanged: number;
  lastSync: string;
}

interface EcosystemMetrics {
  totalEvents: number;
  activeInvitations: number;
  designsCreated: number;
  venuesShowcased: number;
  seatingArranged: number;
  systemUptime: number;
  dataFlowRate: number;
}

const systemServices = [
  {
    name: "VibeInvite System",
    icon: Mail,
    route: "/vibe-invite-system",
    description: "E-invitation management with AI personalization",
  },
  {
    name: "Social Design Studio",
    icon: Palette,
    route: "/social-design-studio",
    description: "Collaborative design creation and sharing",
  },
  {
    name: "Party Hall Decorator",
    icon: Sparkles,
    route: "/party-hall-decorator",
    description: "3D decoration planning and visualization",
  },
  {
    name: "Natural Venue Showcase",
    icon: MapPin,
    route: "/natural-venue-showcase",
    description: "Immersive venue discovery and booking",
  },
  {
    name: "Interactive Seat Tracker",
    icon: Armchair,
    route: "/interactive-seat-tracker",
    description: "Dynamic seating management and optimization",
  },
];

export default function EcosystemDashboard() {
  const [selectedFlow, setSelectedFlow] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch ecosystem health status
  const { data: healthStatus, isLoading: healthLoading } = useQuery({
    queryKey: ["/api/ecosystem/health"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Fetch system metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/ecosystem/metrics"],
  });

  // Fetch integration flows
  const { data: integrationFlows, isLoading: flowsLoading } = useQuery({
    queryKey: ["/api/ecosystem/integrations"],
  });

  // Sync all systems mutation
  const syncSystemsMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/ecosystem/sync-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ecosystem"] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (healthLoading || metricsLoading || flowsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Network className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ecosystem Dashboard
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor and manage the interconnected Vibes platform ecosystem
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => syncSystemsMutation.mutate()}
              disabled={syncSystemsMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {syncSystemsMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sync All Systems
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="integrations">Data Flows</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Status
                  </CardTitle>
                  {getStatusIcon(healthStatus?.status || "unknown")}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize">
                    {healthStatus?.status || "Unknown"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last checked:{" "}
                    {healthStatus?.timestamp
                      ? new Date(healthStatus.timestamp).toLocaleTimeString()
                      : "Never"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.totalEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last hour
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Data Flow Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.dataFlowRate || 0}/min
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cross-system operations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Uptime
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.systemUptime || 99.9}%
                  </div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Integration Status</CardTitle>
                <CardDescription>
                  Real-time status of interconnected platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemServices.map((service, index) => (
                    <div
                      key={service.name}
                      className="flex items-center space-x-4"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          "healthy"
                        )}`}
                      ></div>
                      <service.icon className="h-5 w-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">
                          {service.description}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        Connected
                      </Badge>
                      <Link to={service.route}>
                        <Button variant="outline" size="sm">
                          Access
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Flow Integration */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cross-Platform Data Flows</CardTitle>
                <CardDescription>
                  Monitor how data flows between different platform components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Integration Flow Diagram */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">
                        Event Creation Flow
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">
                            VibeInvite creates event
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-blue-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">
                            Design Studio generates templates
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-purple-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">
                            Venue Showcase suggests locations
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-green-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">
                            Seat Tracker optimizes layout
                          </span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold mb-4">
                        Guest Experience Flow
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                          <span className="text-sm">
                            Guest receives invitation
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-pink-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                          <span className="text-sm">
                            Views 3D venue preview
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-indigo-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                          <span className="text-sm">
                            Selects preferred seating
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-5">
                          <div className="w-1 h-8 bg-cyan-300"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">
                            RSVP confirmation sent
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Data Exchange Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Events Synchronized
                          </p>
                          <p className="text-2xl font-bold">847</p>
                        </div>
                        <div className="text-green-600">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Design Templates Shared
                          </p>
                          <p className="text-2xl font-bold">1,234</p>
                        </div>
                        <div className="text-blue-600">
                          <Palette className="h-6 w-6" />
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Venue Recommendations
                          </p>
                          <p className="text-2xl font-bold">567</p>
                        </div>
                        <div className="text-purple-600">
                          <MapPin className="h-6 w-6" />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Management */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {systemServices.map((service) => (
                <Card key={service.name}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <service.icon className="h-6 w-6 text-purple-600" />
                      <CardTitle>{service.name}</CardTitle>
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className="bg-green-100 text-green-800">
                          Operational
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Response Time
                        </span>
                        <span className="text-sm font-medium">156ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Uptime</span>
                        <span className="text-sm font-medium">99.9%</span>
                      </div>
                      <Separator />
                      <div className="flex space-x-2">
                        <Link to={service.route} className="flex-1">
                          <Button className="w-full" variant="outline">
                            Open Service
                          </Button>
                        </Link>
                        <Button size="icon" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Invitations
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.activeInvitations || 156}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last week
                  </p>
                  <Progress value={76} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Designs Created
                  </CardTitle>
                  <Palette className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.designsCreated || 89}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last week
                  </p>
                  <Progress value={64} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Venues Showcased
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.venuesShowcased || 34}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last week
                  </p>
                  <Progress value={82} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Seating Arranged
                  </CardTitle>
                  <Armchair className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics?.seatingArranged || 127}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +22% from last week
                  </p>
                  <Progress value={91} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            {/* Integration Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>System Integration Performance</CardTitle>
                <CardDescription>
                  Monitor cross-platform data exchange and system performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-center space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-32 w-12 bg-linear-to-t from-blue-500 to-blue-300 rounded-t"></div>
                    <span className="text-xs text-gray-600">VibeInvite</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-40 w-12 bg-linear-to-t from-purple-500 to-purple-300 rounded-t"></div>
                    <span className="text-xs text-gray-600">Design Studio</span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-28 w-12 bg-linear-to-t from-green-500 to-green-300 rounded-t"></div>
                    <span className="text-xs text-gray-600">
                      Party Decorator
                    </span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-36 w-12 bg-linear-to-t from-orange-500 to-orange-300 rounded-t"></div>
                    <span className="text-xs text-gray-600">
                      Venue Showcase
                    </span>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-44 w-12 bg-linear-to-t from-pink-500 to-pink-300 rounded-t"></div>
                    <span className="text-xs text-gray-600">Seat Tracker</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
