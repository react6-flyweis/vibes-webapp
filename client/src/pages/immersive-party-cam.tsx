import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Video, 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Sparkles,
  Filter,
  Download,
  Share2,
  Eye,
  Zap,
  Wand2,
  Globe,
  Monitor,
  Smartphone,
  Timer,
  Volume2,
  VolumeX,
  Settings,
  Users,
  Star,
  Heart,
  MessageCircle,
  Send,
  Palette,
  Layers,
  Music,
  Mic,
  Headphones,
  Radio,
  Film,
  Edit3,
  Maximize,
  Minimize,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Upload,
  Save,
  Trash2,
  Copy,
  ExternalLink,
  Award,
  Compass,
  MapPin,
  Clock,
  Calendar,
  TrendingUp
} from "lucide-react";

interface ARFilter {
  id: string;
  name: string;
  description: string;
  category: "theme" | "sponsor" | "effect" | "mask";
  thumbnail: string;
  previewVideo: string;
  isActive: boolean;
  isPremium: boolean;
  usageCount: number;
  rating: number;
  tags: string[];
  sponsorBrand?: string;
  sponsorLogo?: string;
  eventThemes: string[];
}

interface CameraMode {
  id: "360" | "standard" | "vr" | "ar";
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  resolution: string;
  frameRate: string;
  isActive: boolean;
}

interface RecordingSession {
  id: string;
  name: string;
  duration: number;
  mode: string;
  filters: string[];
  thumbnail: string;
  timestamp: string;
  size: string;
  quality: "4K" | "HD" | "SD";
  is360: boolean;
  hasAR: boolean;
  views: number;
  likes: number;
  shares: number;
}

interface HighlightReel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  clips: number;
  style: "cinematic" | "social" | "music-video" | "documentary";
  music: string;
  transitions: string;
  generatedAt: string;
  downloads: number;
  shares: number;
}

export default function ImmersivePartyCam() {
  const { toast } = useToast();
  
  // State management
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMode, setSelectedMode] = useState<CameraMode["id"]>("360");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [currentView, setCurrentView] = useState<"live" | "gallery" | "highlights">("live");
  const [filterIntensity, setFilterIntensity] = useState([75]);
  const [arEnabled, setArEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedHighlightStyle, setSelectedHighlightStyle] = useState<HighlightReel["style"]>("cinematic");
  const [showSettings, setShowSettings] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Data fetching
  const { data: arFilters } = useQuery({
    queryKey: ["/api/partycam/filters"],
  });

  const { data: cameraModes } = useQuery({
    queryKey: ["/api/partycam/modes"],
  });

  const { data: recordings } = useQuery({
    queryKey: ["/api/partycam/recordings"],
  });

  const { data: highlightReels } = useQuery({
    queryKey: ["/api/partycam/highlights"],
  });

  const { data: liveStats } = useQuery({
    queryKey: ["/api/partycam/live-stats"],
    refetchInterval: 2000,
  });

  // Mutations
  const startRecordingMutation = useMutation({
    mutationFn: async (data: { mode: string; filters: string[]; settings: any }) => {
      const response = await fetch("/api/partycam/start-recording", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      setIsRecording(true);
      toast({ title: "Recording Started", description: "360° immersive recording is now active" });
    },
  });

  const generateHighlightMutation = useMutation({
    mutationFn: async (data: { recordings: string[]; style: string; music: string }) => {
      const response = await fetch("/api/partycam/generate-highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Highlight Reel Generated", description: "Your party story is ready to share!" });
    },
  });

  const toggleFilterMutation = useMutation({
    mutationFn: async (filterId: string) => {
      const response = await fetch(`/api/partycam/filters/${filterId}/toggle`, {
        method: "POST",
      });
      return response.json();
    },
  });

  // Mock data
  const mockFilters: ARFilter[] = Array.isArray(arFilters) ? arFilters : [
    {
      id: "neon-rave",
      name: "Neon Rave",
      description: "Electric neon effects with pulsing beats visualization",
      category: "theme",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150",
      previewVideo: "/api/filters/neon-rave-preview.mp4",
      isActive: true,
      isPremium: false,
      usageCount: 1247,
      rating: 4.8,
      tags: ["electronic", "glow", "party"],
      eventThemes: ["rave", "electronic", "nightclub"],
    },
    {
      id: "masquerade-mystery",
      name: "Masquerade Mystery",
      description: "Elegant venetian masks with golden particle effects",
      category: "theme",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150",
      previewVideo: "/api/filters/masquerade-preview.mp4",
      isActive: false,
      isPremium: true,
      usageCount: 892,
      rating: 4.9,
      tags: ["elegant", "formal", "mystery"],
      eventThemes: ["masquerade", "formal", "gala"],
    },
    {
      id: "coca-cola-fizz",
      name: "Coca-Cola Fizz",
      description: "Refreshing bubbles and Coca-Cola branding effects",
      category: "sponsor",
      thumbnail: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=150",
      previewVideo: "/api/filters/cocacola-preview.mp4",
      isActive: false,
      isPremium: false,
      usageCount: 2341,
      rating: 4.6,
      tags: ["refreshing", "bubbles", "brand"],
      sponsorBrand: "Coca-Cola",
      sponsorLogo: "/api/brands/cocacola-logo.png",
      eventThemes: ["summer", "casual", "outdoor"],
    },
    {
      id: "galaxy-dreams",
      name: "Galaxy Dreams",
      description: "Cosmic effects with stars and nebula backgrounds",
      category: "effect",
      thumbnail: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=150",
      previewVideo: "/api/filters/galaxy-preview.mp4",
      isActive: false,
      isPremium: true,
      usageCount: 567,
      rating: 4.7,
      tags: ["cosmic", "dreamy", "space"],
      eventThemes: ["futuristic", "space", "sci-fi"],
    },
  ];

  // Helper function to map mode IDs to icons
  const getModeIcon = (modeId: string) => {
    const iconMap = {
      "360": Globe,
      "standard": Monitor,
      "vr": Eye,
      "ar": Sparkles,
    };
    return iconMap[modeId as keyof typeof iconMap] || Camera;
  };

  // Process camera modes and add icons
  const processedModes: CameraMode[] = Array.isArray(cameraModes) 
    ? cameraModes.map(mode => ({ ...mode, icon: getModeIcon(mode.id) }))
    : [];

  const mockModes: CameraMode[] = processedModes.length > 0 ? processedModes : [
    {
      id: "360",
      name: "360° Immersive",
      description: "Full spherical recording for VR experiences",
      icon: Globe,
      resolution: "4K",
      frameRate: "60fps",
      isActive: true,
    },
    {
      id: "standard",
      name: "Standard HD",
      description: "Traditional high-definition recording",
      icon: Monitor,
      resolution: "1080p",
      frameRate: "30fps",
      isActive: false,
    },
    {
      id: "vr",
      name: "VR Ready",
      description: "Optimized for VR headset viewing",
      icon: Eye,
      resolution: "2K",
      frameRate: "90fps",
      isActive: false,
    },
    {
      id: "ar",
      name: "AR Enhanced",
      description: "Augmented reality with object tracking",
      icon: Sparkles,
      resolution: "1080p",
      frameRate: "60fps",
      isActive: false,
    },
  ];

  const mockRecordings: RecordingSession[] = Array.isArray(recordings) ? recordings : [
    {
      id: "rec-birthday-bash",
      name: "Birthday Bash - Main Room",
      duration: 1847,
      mode: "360° Immersive",
      filters: ["neon-rave", "galaxy-dreams"],
      thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300",
      timestamp: "2 hours ago",
      size: "2.4 GB",
      quality: "4K",
      is360: true,
      hasAR: true,
      views: 234,
      likes: 67,
      shares: 23,
    },
    {
      id: "rec-dance-floor",
      name: "Dance Floor Action",
      duration: 892,
      mode: "AR Enhanced",
      filters: ["coca-cola-fizz"],
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      timestamp: "4 hours ago",
      size: "1.1 GB",
      quality: "HD",
      is360: false,
      hasAR: true,
      views: 456,
      likes: 123,
      shares: 45,
    },
  ];

  const mockHighlights: HighlightReel[] = Array.isArray(highlightReels) ? highlightReels : [
    {
      id: "highlight-birthday-epic",
      title: "Birthday Epic Moments",
      description: "Best moments from the birthday celebration with cinematic effects",
      thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300",
      duration: 187,
      clips: 12,
      style: "cinematic",
      music: "Uplifting Electronic",
      transitions: "Smooth Fade",
      generatedAt: "1 hour ago",
      downloads: 89,
      shares: 234,
    },
    {
      id: "highlight-dance-madness",
      title: "Dance Floor Madness",
      description: "High-energy dance moments with beat-synchronized effects",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      duration: 156,
      clips: 8,
      style: "music-video",
      music: "Electronic Dance",
      transitions: "Beat Drop",
      generatedAt: "3 hours ago",
      downloads: 156,
      shares: 445,
    },
  ];

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Live viewer count simulation
  useEffect(() => {
    if (isLiveStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 10) - 4));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLiveStreaming]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    const settings = {
      mode: selectedMode,
      filters: activeFilters,
      quality: "4K",
      arEnabled,
      audioEnabled,
      filterIntensity: filterIntensity[0],
    };

    startRecordingMutation.mutate({
      mode: selectedMode,
      filters: activeFilters,
      settings,
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    toast({ title: "Recording Saved", description: "Your immersive recording has been saved to gallery" });
  };

  const handleToggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
    toggleFilterMutation.mutate(filterId);
  };

  const handleGenerateHighlight = () => {
    generateHighlightMutation.mutate({
      recordings: mockRecordings.map(r => r.id),
      style: selectedHighlightStyle,
      music: "auto-select",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Immersive PartyCam
          </h1>
          <p className="text-xl text-purple-200">
            360° recording, AR filters, and cinematic highlight reels for unforgettable party memories
          </p>
        </div>

        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-purple-800/50">
            <TabsTrigger value="live" className="data-[state=active]:bg-purple-600">
              <Camera className="mr-2 h-4 w-4" />
              Live Camera
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600">
              <Film className="mr-2 h-4 w-4" />
              Recordings
            </TabsTrigger>
            <TabsTrigger value="highlights" className="data-[state=active]:bg-purple-600">
              <Star className="mr-2 h-4 w-4" />
              Highlight Reels
            </TabsTrigger>
          </TabsList>

          {/* Live Camera Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Camera View */}
              <div className="lg:col-span-2">
                <Card className="bg-black/40 border-purple-500/50">
                  <CardContent className="p-6">
                    <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        poster="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
                      />
                      
                      {/* Recording Indicator */}
                      {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-sm font-medium">REC {formatTime(recordingTime)}</span>
                        </div>
                      )}

                      {/* Live Streaming Indicator */}
                      {isLiveStreaming && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-purple-600/90 px-3 py-1 rounded-full">
                          <Radio className="w-4 h-4" />
                          <span className="text-sm font-medium">LIVE</span>
                          <Badge variant="outline" className="bg-white/20">
                            {viewerCount} viewers
                          </Badge>
                        </div>
                      )}

                      {/* Active Filters Overlay */}
                      {activeFilters.length > 0 && (
                        <div className="absolute bottom-4 left-4 flex gap-2">
                          {activeFilters.map(filterId => {
                            const filter = mockFilters.find(f => f.id === filterId);
                            return filter && (
                              <Badge key={filterId} className="bg-purple-600/80">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {filter.name}
                              </Badge>
                            );
                          })}
                        </div>
                      )}

                      {/* Camera Mode Indicator */}
                      <div className="absolute bottom-4 right-4">
                        <Badge className="bg-blue-600/80">
                          {mockModes.find(m => m.id === selectedMode)?.name}
                        </Badge>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                      {!isRecording ? (
                        <Button 
                          onClick={handleStartRecording}
                          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
                          disabled={startRecordingMutation.isPending}
                        >
                          <Video className="mr-2 h-5 w-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setIsPaused(!isPaused)}
                            variant="outline"
                            className="border-purple-500 text-purple-300"
                          >
                            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                          </Button>
                          <Button
                            onClick={handleStopRecording}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Square className="mr-2 h-4 w-4" />
                            Stop
                          </Button>
                        </div>
                      )}

                      <Button
                        onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                        variant={isLiveStreaming ? "default" : "outline"}
                        className={isLiveStreaming ? "bg-purple-600" : "border-purple-500 text-purple-300"}
                      >
                        <Radio className="mr-2 h-4 w-4" />
                        {isLiveStreaming ? "Stop Stream" : "Go Live"}
                      </Button>

                      <Button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        variant="outline"
                        className="border-purple-500 text-purple-300"
                      >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Camera Modes */}
                <Card className="bg-purple-800/30 border-purple-500/50">
                  <CardHeader>
                    <CardTitle className="text-purple-300">Camera Mode</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockModes.map((mode) => (
                      <div 
                        key={mode.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedMode === mode.id 
                            ? 'bg-purple-600/80 border-2 border-purple-400' 
                            : 'bg-purple-900/50 border border-purple-700/50'
                        }`}
                        onClick={() => setSelectedMode(mode.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <mode.icon className="h-4 w-4" />
                            <span className="font-medium text-sm">{mode.name}</span>
                          </div>
                          {selectedMode === mode.id && (
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-purple-200 mt-1">{mode.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">{mode.resolution}</Badge>
                          <Badge variant="outline" className="text-xs">{mode.frameRate}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Settings */}
                <Card className="bg-purple-800/30 border-purple-500/50">
                  <CardHeader>
                    <CardTitle className="text-purple-300">Quick Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AR Effects</span>
                      <Switch 
                        checked={arEnabled} 
                        onCheckedChange={setArEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audio Recording</span>
                      <Switch 
                        checked={audioEnabled} 
                        onCheckedChange={setAudioEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm">Filter Intensity</span>
                      <Slider
                        value={filterIntensity}
                        onValueChange={setFilterIntensity}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Live Stats */}
                {isLiveStreaming && (
                  <Card className="bg-purple-600/30 border-purple-400/50">
                    <CardHeader>
                      <CardTitle className="text-purple-200">Live Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Viewers</span>
                        <span className="font-bold">{viewerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Duration</span>
                        <span className="font-bold">{formatTime(recordingTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Quality</span>
                        <Badge className="bg-green-600">4K</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* AR Filters */}
            <Card className="bg-purple-800/30 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-300 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AR Filters & Effects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mockFilters.map((filter) => (
                      <div 
                        key={filter.id}
                        className={`relative cursor-pointer transition-all ${
                          activeFilters.includes(filter.id)
                            ? 'ring-2 ring-purple-400 scale-105'
                            : 'hover:scale-105'
                        }`}
                        onClick={() => handleToggleFilter(filter.id)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden">
                          <img 
                            src={filter.thumbnail} 
                            alt={filter.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Filter Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg flex flex-col justify-end p-2">
                          <h4 className="text-xs font-medium text-white">{filter.name}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {filter.category === "sponsor" && (
                              <Badge className="bg-yellow-600 text-xs px-1">Sponsor</Badge>
                            )}
                            {filter.isPremium && (
                              <Badge className="bg-purple-600 text-xs px-1">Pro</Badge>
                            )}
                          </div>
                        </div>

                        {/* Active Indicator */}
                        {activeFilters.includes(filter.id) && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                        )}

                        {/* Usage Count */}
                        <div className="absolute top-2 left-2 bg-black/60 rounded px-1">
                          <span className="text-xs text-white">{filter.usageCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecordings.map((recording) => (
                <Card key={recording.id} className="bg-purple-800/30 border-purple-500/50 overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={recording.thumbnail} 
                      alt={recording.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded">
                      <span className="text-xs text-white">{formatTime(recording.duration)}</span>
                    </div>

                    {/* Quality Badges */}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className="bg-blue-600 text-xs">{recording.quality}</Badge>
                      {recording.is360 && (
                        <Badge className="bg-purple-600 text-xs">360°</Badge>
                      )}
                      {recording.hasAR && (
                        <Badge className="bg-pink-600 text-xs">AR</Badge>
                      )}
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        size="sm" 
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">{recording.name}</h3>
                    <div className="flex items-center justify-between text-sm text-purple-200 mb-3">
                      <span>{recording.timestamp}</span>
                      <span>{recording.size}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {recording.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {recording.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {recording.shares}
                      </div>
                    </div>

                    {/* Active Filters */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recording.filters.map(filterId => {
                        const filter = mockFilters.find(f => f.id === filterId);
                        return filter && (
                          <Badge key={filterId} variant="outline" className="text-xs">
                            {filter.name}
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Highlight Reels Tab */}
          <TabsContent value="highlights" className="space-y-6">
            {/* Generate New Highlight */}
            <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-purple-500/50">
              <CardHeader>
                <CardTitle className="text-purple-200 flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Generate New Highlight Reel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["cinematic", "social", "music-video", "documentary"].map((style) => (
                    <div
                      key={style}
                      className={`p-4 rounded-lg cursor-pointer text-center transition-all ${
                        selectedHighlightStyle === style
                          ? 'bg-purple-600 border-2 border-purple-400'
                          : 'bg-purple-900/50 border border-purple-700/50'
                      }`}
                      onClick={() => setSelectedHighlightStyle(style as any)}
                    >
                      <div className="capitalize font-medium">{style.replace('-', ' ')}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleGenerateHighlight}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                  disabled={generateHighlightMutation.isPending}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Highlight Reel
                </Button>
              </CardContent>
            </Card>

            {/* Existing Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockHighlights.map((highlight) => (
                <Card key={highlight.id} className="bg-purple-800/30 border-purple-500/50 overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={highlight.thumbnail} 
                      alt={highlight.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded">
                      <span className="text-xs text-white">{formatTime(highlight.duration)}</span>
                    </div>

                    {/* Style Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-xs capitalize">
                        {highlight.style.replace('-', ' ')}
                      </Badge>
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        size="sm" 
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      >
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">{highlight.title}</h3>
                    <p className="text-sm text-purple-200 mb-3">{highlight.description}</p>
                    
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-purple-300 mb-3">
                      <div>
                        <span className="text-purple-400">Clips:</span> {highlight.clips}
                      </div>
                      <div>
                        <span className="text-purple-400">Music:</span> {highlight.music}
                      </div>
                      <div>
                        <span className="text-purple-400">Generated:</span> {highlight.generatedAt}
                      </div>
                      <div>
                        <span className="text-purple-400">Transitions:</span> {highlight.transitions}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-purple-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {highlight.downloads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {highlight.shares}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}