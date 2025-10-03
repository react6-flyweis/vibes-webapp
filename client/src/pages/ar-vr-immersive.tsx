import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Eye, 
  Camera, 
  Monitor,
  Headphones,
  Play,
  Download,
  Share2,
  Settings,
  Palette,
  Lightbulb,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  ThumbsUp,
  RotateCcw,
  Maximize,
  Volume2,
  Smartphone,
  Laptop,
  Glasses,
  Zap,
  Sparkles,
  Target,
  Film,
  Image,
  Box,
  Move3D
} from "lucide-react";

interface ARVRExperience {
  id: string;
  eventId: number;
  eventTitle: string;
  type: 'ar_preview' | 'vr_recap' | '3d_venue_tour' | 'interactive_demo';
  title: string;
  description: string;
  category: string;
  duration: string;
  fileSize: string;
  quality: '720p' | '1080p' | '4K' | '8K';
  deviceCompatibility: string[];
  features: string[];
  createdAt: string;
  lastUpdated: string;
  stats: {
    views: number;
    downloads: number;
    rating: number;
    reviews: number;
    sharesCount: number;
  };
  media: {
    thumbnail: string;
    previewVideo: string;
    vrFile: string;
    arAssets: string[];
  };
  interactiveElements: Array<{
    id: string;
    type: 'decor_swap' | 'lighting_change' | 'layout_adjust' | 'color_theme';
    name: string;
    options: string[];
  }>;
  vendorSpotlights: Array<{
    vendorId: string;
    vendorName: string;
    category: string;
    showcaseItems: string[];
    estimatedCost: number;
  }>;
}

interface ARVRStats {
  totalExperiences: number;
  totalViews: number;
  averageEngagement: number;
  conversionRate: number;
  topCategories: Array<{
    category: string;
    count: number;
    engagement: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
  }>;
}

const experienceTypeIcons = {
  ar_preview: Smartphone,
  vr_recap: Glasses,
  '3d_venue_tour': Box,
  interactive_demo: Move3D
};

const experienceTypeColors = {
  ar_preview: 'from-blue-500 to-cyan-500',
  vr_recap: 'from-purple-500 to-pink-500',
  '3d_venue_tour': 'from-green-500 to-emerald-500',
  interactive_demo: 'from-yellow-500 to-orange-500'
};

const deviceIcons = {
  'VR Headset': Glasses,
  'Mobile AR': Smartphone,
  'Desktop': Monitor,
  'Laptop': Laptop
};

export default function ARVRImmersive() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'ar' | 'vr' | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AR/VR experiences
  const { data: arvrExperiences, isLoading } = useQuery({
    queryKey: ['/api/ar-vr/experiences', { category: selectedCategory, device: selectedDevice }],
    retry: false,
  });

  // Fetch AR/VR statistics
  const { data: arvrStats } = useQuery({
    queryKey: ['/api/ar-vr/stats'],
    retry: false,
  });

  // Fetch user's events for experience creation
  const { data: userEvents } = useQuery({
    queryKey: ['/api/events/user'],
    retry: false,
  });

  // Create AR/VR experience mutation
  const createExperienceMutation = useMutation({
    mutationFn: async (experienceData: any) => {
      return await apiRequest("POST", "/api/ar-vr/create", experienceData);
    },
    onSuccess: () => {
      toast({
        title: "AR/VR Experience Created",
        description: "Your immersive experience has been generated and is ready for viewing.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ar-vr/experiences'] });
      setShowCreateModal(false);
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create AR/VR experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Launch experience mutation
  const launchExperienceMutation = useMutation({
    mutationFn: async ({ experienceId, mode }: { experienceId: string; mode: 'ar' | 'vr' }) => {
      return await apiRequest("POST", "/api/ar-vr/launch", { experienceId, mode });
    },
    onSuccess: (data, variables) => {
      toast({
        title: `${variables.mode.toUpperCase()} Experience Launched`,
        description: "Opening immersive experience in new window...",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ar-vr/experiences'] });
    },
    onError: () => {
      toast({
        title: "Launch Failed",
        description: "Failed to launch AR/VR experience. Please check device compatibility.",
        variant: "destructive",
      });
    },
  });

  // Rate experience mutation
  const rateExperienceMutation = useMutation({
    mutationFn: async ({ experienceId, rating }: { experienceId: string; rating: number }) => {
      return await apiRequest("POST", "/api/ar-vr/rate", { experienceId, rating });
    },
    onSuccess: () => {
      toast({
        title: "Rating Submitted",
        description: "Thank you for your feedback on this immersive experience.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ar-vr/experiences'] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-party-gradient-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-party-gradient-1 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-party-rainbow opacity-10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-party-pink rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-party-yellow rounded-full opacity-30 animate-party-wiggle"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-party-turquoise rounded-full opacity-15 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Glasses className="w-16 h-16 text-cyan-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-linear-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Immersive AR/VR Experiences
          </h1>
          <p className="text-white/90 mt-2 text-xl">Preview venues in AR and relive events in virtual reality</p>
        </div>

        {/* Feature Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Eye className="w-8 h-8 mr-3 text-cyan-200" />
              Next-Gen Event Visualization
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Experience events before they happen and relive memories in stunning detail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">AR Previews</h3>
                <p className="text-white/80 text-sm">See decor and layouts before booking</p>
              </div>
              <div className="text-center">
                <Glasses className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">VR Recaps</h3>
                <p className="text-white/80 text-sm">Relive events in immersive virtual reality</p>
              </div>
              <div className="text-center">
                <Box className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">3D Venue Tours</h3>
                <p className="text-white/80 text-sm">Interactive space exploration</p>
              </div>
              <div className="text-center">
                <Move3D className="w-12 h-12 text-party-green mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Interactive Demos</h3>
                <p className="text-white/80 text-sm">Real-time customization and testing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AR/VR Statistics */}
        {arvrStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Film className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{arvrStats.totalExperiences || '89'}</div>
                <p className="text-gray-600 text-sm">AR/VR Experiences</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{arvrStats.totalViews || '12.4K'}</div>
                <p className="text-gray-600 text-sm">Total Views</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{arvrStats.averageEngagement || '87'}%</div>
                <p className="text-gray-600 text-sm">Engagement Rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{arvrStats.conversionRate || '34'}%</div>
                <p className="text-gray-600 text-sm">Booking Rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/30">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Settings className="w-6 h-6 mr-2 text-gray-600" />
              Experience Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Experience Type</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="ar_preview">AR Previews</SelectItem>
                    <SelectItem value="vr_recap">VR Recaps</SelectItem>
                    <SelectItem value="3d_venue_tour">3D Venue Tours</SelectItem>
                    <SelectItem value="interactive_demo">Interactive Demos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="device">Device Type</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Devices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Devices</SelectItem>
                    <SelectItem value="vr_headset">VR Headset</SelectItem>
                    <SelectItem value="mobile_ar">Mobile AR</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="laptop">Laptop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Create Experience
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AR/VR Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arvrExperiences && arvrExperiences.length > 0 ? (
            arvrExperiences.map((experience: ARVRExperience) => {
              const TypeIcon = experienceTypeIcons[experience.type as keyof typeof experienceTypeIcons];
              const typeGradient = experienceTypeColors[experience.type as keyof typeof experienceTypeColors];
              
              return (
                <Card key={experience.id} className="bg-white/95 backdrop-blur-sm border-2 border-white/30 hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className={`w-full h-48 bg-linear-to-br ${typeGradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <TypeIcon className="w-20 h-20 text-white/80" />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/50 text-white">
                          {experience.quality}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {experience.duration}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="flex justify-between text-white text-xs mb-1">
                            <span>{experience.stats.views} views</span>
                            <span>{experience.fileSize}</span>
                          </div>
                          <div className="flex items-center justify-between text-white text-xs">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                              <span>{experience.stats.rating}/5</span>
                            </div>
                            <span>{experience.stats.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <CardDescription>{experience.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.eventTitle}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Key Features</h4>
                        <div className="flex gap-1 flex-wrap">
                          {experience.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {experience.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{experience.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Compatible Devices</h4>
                        <div className="flex gap-2">
                          {experience.deviceCompatibility.slice(0, 3).map((device, index) => {
                            const DeviceIcon = deviceIcons[device as keyof typeof deviceIcons] || Monitor;
                            return (
                              <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                <DeviceIcon className="w-3 h-3" />
                                <span>{device}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {experience.vendorSpotlights.length > 0 && (
                        <div>
                          <h4 className="font-bold text-sm mb-2">Featured Vendors</h4>
                          <div className="space-y-1">
                            {experience.vendorSpotlights.slice(0, 2).map((vendor, index) => (
                              <div key={index} className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded">
                                <span className="font-medium">{vendor.vendorName}</span>
                                <span className="text-green-600">${vendor.estimatedCost}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => launchExperienceMutation.mutate({ 
                            experienceId: experience.id, 
                            mode: experience.type.includes('ar') ? 'ar' : 'vr' 
                          })}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Launch
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Glasses className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No AR/VR Experiences Available</h3>
              <p className="text-white/70 mb-6">Create immersive previews and recaps for your events!</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
              >
                <Camera className="w-5 h-5 mr-2" />
                Create AR/VR Experience
              </Button>
            </div>
          )}
        </div>

        {/* Device Compatibility Info */}
        {arvrStats && arvrStats.deviceBreakdown && (
          <Card className="mt-8 bg-white/95 backdrop-blur-sm border-2 border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="w-6 h-6 mr-2 text-blue-600" />
                Device Usage Statistics
              </CardTitle>
              <CardDescription>How users are experiencing AR/VR content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {arvrStats.deviceBreakdown.map((device, index) => {
                  const DeviceIcon = deviceIcons[device.device as keyof typeof deviceIcons] || Monitor;
                  return (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <DeviceIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                      <div className="text-lg font-bold text-gray-800">{device.percentage}%</div>
                      <p className="text-sm text-gray-600">{device.device}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}