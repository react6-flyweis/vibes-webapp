import { useState, useEffect } from "react";
import { Camera, Smartphone, Music, Palette, Eye, Sparkles, Gift, QrCode, Volume2, Lightbulb, Image, Play } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";

interface ARFilter {
  id: string;
  name: string;
  type: "music" | "lighting" | "manual";
  trigger: string;
  description: string;
  isActive: boolean;
  popularity: number;
  preview: string;
}

interface ARHologram {
  id: string;
  title: string;
  type: "3d_object" | "animation" | "text" | "interactive";
  position: { x: number; y: number; z: number };
  scale: number;
  isVisible: boolean;
  interactionCount: number;
}

interface VendorARBooth {
  id: string;
  vendorName: string;
  category: string;
  products: string[];
  arAssets: string[];
  qrCode: string;
  visitors: number;
  engagement: number;
}

export default function ARPartyOverlays() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [arIntensity, setARIntensity] = useState([75]);
  const [autoMode, setAutoMode] = useState(true);
  const [selectedTab, setSelectedTab] = useState("filters");

  const { data: arFilters } = useQuery({
    queryKey: ["/api/ar-overlays/filters"],
    refetchInterval: 3000,
  });

  const { data: holograms } = useQuery({
    queryKey: ["/api/ar-overlays/holograms"],
    refetchInterval: 2000,
  });

  const { data: vendorBooths } = useQuery({
    queryKey: ["/api/ar-overlays/vendor-booths"],
    refetchInterval: 5000,
  });

  const { data: arMetrics } = useQuery({
    queryKey: ["/api/ar-overlays/metrics"],
    refetchInterval: 4000,
  });

  const filters: ARFilter[] = arFilters || [
    {
      id: "music-pulse",
      name: "Beat Pulse",
      type: "music",
      trigger: "Bass Drop",
      description: "Pulsing neon effects that sync to the beat",
      isActive: true,
      popularity: 92,
      preview: "🌈"
    },
    {
      id: "disco-sparkle",
      name: "Disco Sparkle",
      type: "lighting",
      trigger: "Strobe Lights",
      description: "Sparkling particle effects matching venue lighting",
      isActive: true,
      popularity: 88,
      preview: "✨"
    },
    {
      id: "love-hearts",
      name: "Love Hearts",
      type: "manual",
      trigger: "Manual",
      description: "Floating hearts for romantic moments",
      isActive: false,
      popularity: 76,
      preview: "💖"
    }
  ];

  const holograms_data: ARHologram[] = holograms || [
    {
      id: "dance-floor-sign",
      title: "Dance Floor Welcome",
      type: "3d_object",
      position: { x: 0, y: 2, z: -5 },
      scale: 1.5,
      isVisible: true,
      interactionCount: 234
    },
    {
      id: "floating-menu",
      title: "Cocktail Menu",
      type: "interactive",
      position: { x: -3, y: 1.5, z: -2 },
      scale: 1.0,
      isVisible: true,
      interactionCount: 156
    },
    {
      id: "graffiti-wall",
      title: "Digital Graffiti Wall",
      type: "interactive",
      position: { x: 5, y: 1, z: -8 },
      scale: 2.0,
      isVisible: true,
      interactionCount: 89
    }
  ];

  const vendorBooths_data: VendorARBooth[] = vendorBooths || [
    {
      id: "booth-cosmetics",
      vendorName: "Glow Beauty Co.",
      category: "Cosmetics",
      products: ["AR Makeup Try-On", "Glow Filters", "Beauty Tips"],
      arAssets: ["virtual_makeup.usdz", "glow_effects.reality"],
      qrCode: "QR_GLOW_BEAUTY",
      visitors: 67,
      engagement: 84
    },
    {
      id: "booth-fashion",
      vendorName: "Urban Style",
      category: "Fashion",
      products: ["Virtual Outfits", "Style Match", "Trend Preview"],
      arAssets: ["clothing_try_on.usdz", "style_filters.reality"],
      qrCode: "QR_URBAN_STYLE",
      visitors: 45,
      engagement: 78
    },
    {
      id: "booth-drinks",
      vendorName: "Fizz Cocktails",
      category: "Beverages",
      products: ["Drink Customizer", "Cocktail Info", "Recipe Cards"],
      arAssets: ["drink_builder.usdz", "cocktail_info.reality"],
      qrCode: "QR_FIZZ_COCKTAILS",
      visitors: 92,
      engagement: 91
    }
  ];

  const arMetrics_data = arMetrics || {
    totalActiveUsers: 127,
    filtersTriggered: 2341,
    hologramInteractions: 479,
    vendorBoothVisits: 204,
    avgSessionDuration: "4m 32s",
    popularFilter: "Beat Pulse",
    engagementRate: 87
  };

  const activateFilter = (filterId: string) => {
    setActiveFilter(filterId);
    // In a real app, this would send AR commands to connected devices
  };

  const toggleHologram = (hologramId: string) => {
    // Toggle hologram visibility
  };

  const scanVendorBooth = (boothId: string) => {
    // Open vendor AR experience
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Camera className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">AR Party Overlays</h1>
            <Smartphone className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your party with immersive AR experiences - music-triggered filters, interactive holograms, and vendor showcases
          </p>
        </div>

        {/* Live AR Metrics */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Live AR Experience Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{arMetrics_data.totalActiveUsers}</div>
                <div className="text-sm text-gray-400">Active AR Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{arMetrics_data.filtersTriggered}</div>
                <div className="text-sm text-gray-400">Filters Triggered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{arMetrics_data.hologramInteractions}</div>
                <div className="text-sm text-gray-400">Hologram Touches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{arMetrics_data.engagementRate}%</div>
                <div className="text-sm text-gray-400">Engagement Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AR Control Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20">
            <TabsTrigger value="filters" className="data-[state=active]:bg-purple-600">
              <Sparkles className="h-4 w-4 mr-2" />
              AR Filters
            </TabsTrigger>
            <TabsTrigger value="holograms" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              Holograms
            </TabsTrigger>
            <TabsTrigger value="vendors" className="data-[state=active]:bg-green-600">
              <Gift className="h-4 w-4 mr-2" />
              Vendor Booths
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600">
              <Camera className="h-4 w-4 mr-2" />
              AR Settings
            </TabsTrigger>
          </TabsList>

          {/* AR Filters Tab */}
          <TabsContent value="filters" className="space-y-4">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-400" />
                  Music & Lighting Triggered AR Filters
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Filters automatically activate based on music beats and lighting changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{filter.preview}</div>
                        <div>
                          <div className="text-white font-semibold">{filter.name}</div>
                          <div className="text-gray-400 text-sm">{filter.description}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={filter.type === "music" ? "default" : filter.type === "lighting" ? "secondary" : "outline"}>
                              {filter.trigger}
                            </Badge>
                            <span className="text-xs text-gray-500">{filter.popularity}% popularity</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={filter.isActive}
                          onCheckedChange={() => activateFilter(filter.id)}
                        />
                        {filter.isActive && (
                          <Badge variant="default" className="bg-green-600">
                            Live
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive Holograms Tab */}
          <TabsContent value="holograms" className="space-y-4">
            <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Interactive AR Holograms
                </CardTitle>
                <CardDescription className="text-gray-400">
                  3D objects, floating menus, and digital graffiti walls for guest interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {holograms_data.map((hologram) => (
                    <div key={hologram.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-blue-600/20">
                          {hologram.type === "3d_object" && <Image className="h-6 w-6 text-blue-400" />}
                          {hologram.type === "interactive" && <Play className="h-6 w-6 text-green-400" />}
                          {hologram.type === "animation" && <Sparkles className="h-6 w-6 text-yellow-400" />}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{hologram.title}</div>
                          <div className="text-gray-400 text-sm">
                            Position: ({hologram.position.x}, {hologram.position.y}, {hologram.position.z})
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {hologram.interactionCount} interactions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={hologram.isVisible ? "default" : "outline"}
                          onClick={() => toggleHologram(hologram.id)}
                        >
                          {hologram.isVisible ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vendor AR Booths Tab */}
          <TabsContent value="vendors" className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-400" />
                  Vendor AR Experience Booths
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Interactive vendor showcases with product previews and brand experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vendorBooths_data.map((booth) => (
                    <div key={booth.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-white font-bold text-lg">{booth.vendorName}</div>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            {booth.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{booth.visitors}</div>
                          <div className="text-xs text-gray-400">Visitors</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2">AR Products:</div>
                          <div className="space-y-1">
                            {booth.products.map((product, index) => (
                              <Badge key={index} variant="secondary" className="mr-2 mb-1">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Engagement:</div>
                          <Progress value={booth.engagement} className="mb-2" />
                          <div className="text-xs text-gray-500">{booth.engagement}% engagement rate</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => scanVendorBooth(booth.id)}
                          className="flex items-center gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          Scan AR Experience
                        </Button>
                        <div className="text-xs text-gray-500">
                          Code: {booth.qrCode}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AR Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-indigo-400" />
                  AR Experience Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure AR intensity and automatic trigger settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-medium">Auto AR Mode</label>
                    <Switch 
                      checked={autoMode}
                      onCheckedChange={setAutoMode}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    Automatically trigger AR effects based on music and lighting
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-medium">AR Effect Intensity</label>
                    <span className="text-indigo-400 font-semibold">{arIntensity[0]}%</span>
                  </div>
                  <Slider
                    value={arIntensity}
                    onValueChange={setARIntensity}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    Control how intense and visible AR effects appear
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                    <Volume2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Music Sync</div>
                    <div className="text-sm text-gray-400">Real-time beat detection</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                    <Lightbulb className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Light Sync</div>
                    <div className="text-sm text-gray-400">Venue lighting integration</div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                    <Palette className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Color Match</div>
                    <div className="text-sm text-gray-400">Smart color coordination</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* QR Code for AR Experience */}
        <Card className="border-yellow-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <QrCode className="h-5 w-5 text-yellow-400" />
              Join the AR Party Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">
                  Scan this QR code with your phone to access AR filters, holograms, and vendor experiences
                </p>
                <p className="text-sm text-gray-400">
                  Works with any smartphone camera - no app download required
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="w-24 h-24 bg-black rounded flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}