import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  Users, 
  Video, 
  Music, 
  Camera,
  Headphones,
  Monitor,
  Zap,
  Eye,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VirtualPartyTwin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [virtualGuestCount, setVirtualGuestCount] = useState(12);
  const [physicalGuestCount, setPhysicalGuestCount] = useState(28);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [virtualFeatures, setVirtualFeatures] = useState({
    spatialAudio: true,
    avatarInteraction: true,
    sharedPlaylist: true,
    virtualBar: false,
    photoSharing: true
  });
  const { toast } = useToast();

  const virtualGuests = [
    { name: "Alex Chen", location: "Tokyo, Japan", avatar: "🧑‍💻", status: "Dancing" },
    { name: "Maria Santos", location: "São Paulo, Brazil", avatar: "💃", status: "At Virtual Bar" },
    { name: "James Wilson", location: "London, UK", avatar: "🎧", status: "DJ Booth" },
    { name: "Priya Sharma", location: "Mumbai, India", avatar: "📸", status: "Photo Zone" },
    { name: "David Kim", location: "Seoul, Korea", avatar: "🕺", status: "Dance Floor" },
    { name: "Sofia Rodriguez", location: "Mexico City, Mexico", avatar: "🎵", status: "Music Queue" }
  ];

  const startLiveStream = () => {
    setIsLiveStreaming(true);
    toast({
      title: "Virtual Twin Activated",
      description: "Your party is now live in the metaverse! Virtual guests can join.",
    });
  };

  const toggleFeature = (feature: string) => {
    setVirtualFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    toast({
      title: "Virtual Feature Updated",
      description: `${feature} has been ${virtualFeatures[feature] ? 'disabled' : 'enabled'} for virtual guests.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between mb-6 ">
            <div className="p-4">
              <h1 className="text-4xl font-bold text-gray-900 flex items-center text-white">
                <Globe className="w-10 h-10 text-[#EB6F71] mr-4" />
                Virtual Party Twin
              </h1>
              <p className="text-gray-600 mt-2">Create an immersive metaverse experience for global guests</p>
            </div>
            <div className="text-right">
              <Badge className={`px-4 py-2 mb-2 ${isLiveStreaming ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                <Video className="w-4 h-4 mr-2" />
                {isLiveStreaming ? "Live in Metaverse" : "Virtual Twin Ready"}
              </Badge>
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Physical Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{physicalGuestCount}</div>
                <p className="text-sm text-gray-600">Currently at venue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-cyan-600" />
                  Virtual Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-600">{virtualGuestCount}</div>
                <p className="text-sm text-gray-600">In virtual space</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  Stream Viewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">247</div>
                <p className="text-sm text-gray-600">Live spectators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">8</div>
                <p className="text-sm text-gray-600">Countries connected</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Virtual Space
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Global Guests
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Stream Settings
            </TabsTrigger>
          </TabsList>

          {/* Virtual Space Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>3D Virtual Venue</CardTitle>
                  <CardDescription>Real-time replica of your physical space</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-linear-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Monitor className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-semibold">Virtual Party Space</p>
                      <p className="text-sm opacity-90">Immersive 3D Environment</p>
                    </div>
                  </div>
                  {!isLiveStreaming ? (
                    <Button onClick={startLiveStream} className="w-full bg-cyan-600 hover:bg-cyan-700">
                      <Video className="w-4 h-4 mr-2" />
                      Launch Virtual Twin
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Manage Virtual Cameras
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Headphones className="w-4 h-4 mr-2" />
                        Spatial Audio Settings
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Virtual Features</CardTitle>
                  <CardDescription>Configure metaverse experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Spatial Audio</label>
                      <p className="text-sm text-gray-600">3D positional sound</p>
                    </div>
                    <Switch 
                      checked={virtualFeatures.spatialAudio}
                      onCheckedChange={() => toggleFeature('spatialAudio')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Avatar Interaction</label>
                      <p className="text-sm text-gray-600">Virtual guest avatars</p>
                    </div>
                    <Switch 
                      checked={virtualFeatures.avatarInteraction}
                      onCheckedChange={() => toggleFeature('avatarInteraction')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Shared Playlist</label>
                      <p className="text-sm text-gray-600">Cross-reality music sync</p>
                    </div>
                    <Switch 
                      checked={virtualFeatures.sharedPlaylist}
                      onCheckedChange={() => toggleFeature('sharedPlaylist')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Virtual Bar</label>
                      <p className="text-sm text-gray-600">Digital cocktail mixing</p>
                    </div>
                    <Switch 
                      checked={virtualFeatures.virtualBar}
                      onCheckedChange={() => toggleFeature('virtualBar')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium">Photo Sharing</label>
                      <p className="text-sm text-gray-600">Cross-reality photo wall</p>
                    </div>
                    <Switch 
                      checked={virtualFeatures.photoSharing}
                      onCheckedChange={() => toggleFeature('photoSharing')}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Global Guests */}
          <TabsContent value="guests" className="space-y-6  mb-5">
            <Card>
              <CardHeader>
                <CardTitle>Virtual Attendees</CardTitle>
                <CardDescription>Friends joining from around the world</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {virtualGuests.map((guest, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">{guest.avatar}</span>
                        <div>
                          <h4 className="font-semibold">{guest.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {guest.location}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {guest.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
<div className="mb-5">
            <Card className="">
              <CardHeader>
                <CardTitle>Global Activity Map</CardTitle>
                <CardDescription>Real-time virtual guest locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-linear-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-semibold">Live Global Map</p>
                    <p className="text-sm opacity-90">Virtual guests from 8 countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>


            </div>
          </TabsContent>

          {/* Interactions */}
          <TabsContent value="interactions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Reality Features</CardTitle>
                  <CardDescription>Bridge physical and virtual experiences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start">
                    <Music className="w-4 h-4 mr-2" />
                    Sync DJ Set to Virtual Space
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Share Live Photo Stream
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Host Virtual Toasts
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Virtual Dance Battles
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Interactions</CardTitle>
                  <CardDescription>Recent cross-reality moments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 pl-3">
                      <p className="text-sm font-medium">Alex from Tokyo requested "Bohemian Rhapsody"</p>
                      <p className="text-xs text-gray-600">2 minutes ago</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-3">
                      <p className="text-sm font-medium">Maria shared a virtual cocktail recipe</p>
                      <p className="text-xs text-gray-600">5 minutes ago</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <p className="text-sm font-medium">James joined the DJ booth virtually</p>
                      <p className="text-xs text-gray-600">8 minutes ago</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                      <p className="text-sm font-medium">Virtual guests started a conga line</p>
                      <p className="text-xs text-gray-600">12 minutes ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stream Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Streaming Configuration</CardTitle>
                  <CardDescription>Technical settings for optimal experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stream Quality</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>4K Ultra (High bandwidth)</option>
                      <option>1080p HD (Recommended)</option>
                      <option>720p (Mobile friendly)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Audio Bitrate</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>320 kbps (Studio quality)</option>
                      <option>256 kbps (High quality)</option>
                      <option>192 kbps (Standard)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Virtual Environment</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Photorealistic Replica</option>
                      <option>Stylized 3D Space</option>
                      <option>Minimalist Design</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Integration</CardTitle>
                  <CardDescription>Connect with metaverse platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Connect to Horizon Worlds
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Link VRChat Room
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Integrate with AltspaceVR
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Custom WebXR Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VirtualPartyTwin;