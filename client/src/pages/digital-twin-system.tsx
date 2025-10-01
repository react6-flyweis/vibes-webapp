import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Camera, 
  Scan, 
  Upload, 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Move3D,
  Layers,
  Settings,
  Download,
  Share2,
  Eye,
  Maximize,
  Grid3X3,
  Ruler,
  Palette,
  Sun,
  Volume2,
  Users,
  Calendar,
  MapPin,
  Info,
  CheckCircle,
  AlertCircle,
  Clock,
  Monitor,
  Mouse,
  Heart,
  Star,
  ShoppingBag,
  Gift,
  Video,
  Image,
  MessageCircle,
  Tag,
  Route,
  Rewind,
  FastForward,
  SkipBack,
  SkipForward,
  Bookmark
} from "lucide-react";

interface DigitalTwin {
  id: string;
  venueName: string;
  venueType: string;
  address: string;
  capacity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  captureMethod: 'lidar' | 'photogrammetry' | '360camera' | 'manual';
  modelQuality: 'low' | 'medium' | 'high' | 'ultra';
  fileSize: number;
  createdAt: string;
  lastUpdated: string;
  status: 'processing' | 'ready' | 'error';
  features: string[];
  thumbnail: string;
  modelUrl: string;
  textureUrl: string;
  metadata: {
    polygonCount: number;
    textureResolution: string;
    accuracyLevel: number;
    lightingMapped: boolean;
    audioMapped: boolean;
  };
}

interface CaptureSession {
  id: string;
  venueName: string;
  method: string;
  progress: number;
  status: 'setup' | 'capturing' | 'processing' | 'complete' | 'error';
  startTime: string;
  estimatedCompletion: string;
  capturedImages: number;
  totalImages: number;
  currentStage: string;
}

export default function DigitalTwinSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTwin, setSelectedTwin] = useState<DigitalTwin | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'viewer' | 'capture' | 'planner' | 'guest-preview' | 'post-event'>('gallery');
  const [captureMethod, setCaptureMethod] = useState<'lidar' | 'photogrammetry' | '360camera'>('photogrammetry');
  const [isRecording, setIsRecording] = useState(false);
  const [viewerSettings, setViewerSettings] = useState({
    showGrid: false,
    showMeasurements: false,
    lightingMode: 'realistic',
    renderQuality: 'high'
  });
  const [plannerState, setPlannerState] = useState({
    selectedTool: 'select', // select, tables, stage, lighting, decor
    placedItems: [],
    selectedItem: null,
    vendorShowcase: false,
    walkthrough: false
  });

  // Guest preview state
  const [guestState, setGuestState] = useState({
    viewMode: 'first-person' as 'first-person' | 'aerial',
    selectedArea: null as string | null,
    showTaggedAreas: true,
    reservationMode: null as 'seating' | 'vip' | null,
    selectedReservation: null as any,
    walkPosition: { x: 50, y: 50, angle: 0 }
  });

  // Post-Event Experience state
  const [postEventState, setPostEventState] = useState({
    selectedTab: 'highlights' as 'highlights' | 'recap-tour' | 'sponsor-products',
    playingMemory: null as { title: string; description: string } | null,
    tourProgress: 0,
    isPlayingTour: false,
    selectedMemoryZone: null as string | null,
    filterTags: [] as string[],
    showOnlySponsorProducts: false
  });

  // Fetch digital twins
  const { data: digitalTwins = [], isLoading } = useQuery({
    queryKey: ["/api/digital-twins"],
  });

  // Fetch active capture sessions
  const { data: captureSessions = [] } = useQuery({
    queryKey: ["/api/digital-twins/capture-sessions"],
    refetchInterval: 2000 // Refresh every 2 seconds for live updates
  });

  // Start new capture session
  const startCaptureMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/digital-twins/start-capture", data);
    },
    onSuccess: () => {
      toast({
        title: "Capture Started",
        description: "Digital twin capture session has begun. Follow the on-screen instructions.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/digital-twins/capture-sessions"] });
      setViewMode('capture');
    },
    onError: () => {
      toast({
        title: "Capture Failed",
        description: "Unable to start capture session. Please check your equipment.",
        variant: "destructive",
      });
    },
  });

  // Process digital twin
  const processModelMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiRequest("POST", `/api/digital-twins/process/${sessionId}`);
    },
    onSuccess: () => {
      toast({
        title: "Processing Started",
        description: "Your digital twin is being processed. This may take 10-30 minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/digital-twins"] });
    },
  });

  const mockDigitalTwins: DigitalTwin[] = [
    {
      id: "dt_001",
      venueName: "Grand Ballroom - Luxury Hotel",
      venueType: "Ballroom",
      address: "123 Downtown Avenue, NYC",
      capacity: 300,
      dimensions: { length: 40, width: 30, height: 6 },
      captureMethod: 'lidar',
      modelQuality: 'ultra',
      fileSize: 245,
      createdAt: "2025-06-15",
      lastUpdated: "2025-06-20",
      status: 'ready',
      features: ['Chandelier Mapping', 'Acoustic Analysis', 'Lighting Zones', 'Emergency Exits'],
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      modelUrl: "https://models.vibes.com/grand-ballroom.glb",
      textureUrl: "https://textures.vibes.com/grand-ballroom.jpg",
      metadata: {
        polygonCount: 850000,
        textureResolution: "4K",
        accuracyLevel: 98.5,
        lightingMapped: true,
        audioMapped: true
      }
    },
    {
      id: "dt_002", 
      venueName: "Rooftop Garden Terrace",
      venueType: "Outdoor",
      address: "456 Sky Tower, LA",
      capacity: 150,
      dimensions: { length: 25, width: 20, height: 0 },
      captureMethod: 'photogrammetry',
      modelQuality: 'high',
      fileSize: 180,
      createdAt: "2025-06-10",
      lastUpdated: "2025-06-18",
      status: 'ready',
      features: ['Weather Simulation', 'Plant Mapping', 'City View', 'Seating Areas'],
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      modelUrl: "https://models.vibes.com/rooftop-garden.glb",
      textureUrl: "https://textures.vibes.com/rooftop-garden.jpg", 
      metadata: {
        polygonCount: 650000,
        textureResolution: "2K",
        accuracyLevel: 95.2,
        lightingMapped: true,
        audioMapped: false
      }
    },
    {
      id: "dt_003",
      venueName: "Tech Conference Hall",
      venueType: "Conference",
      address: "789 Innovation Drive, SF",
      capacity: 500,
      dimensions: { length: 50, width: 35, height: 8 },
      captureMethod: '360camera',
      modelQuality: 'medium',
      fileSize: 95,
      createdAt: "2025-06-05",
      lastUpdated: "2025-06-12",
      status: 'processing',
      features: ['AV Equipment', 'Stage Mapping', 'Projection Zones', 'Networking Areas'],
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      modelUrl: "https://models.vibes.com/tech-hall.glb",
      textureUrl: "https://textures.vibes.com/tech-hall.jpg",
      metadata: {
        polygonCount: 420000,
        textureResolution: "2K",
        accuracyLevel: 92.8,
        lightingMapped: false,
        audioMapped: true
      }
    }
  ];

  const mockCaptureSessions: CaptureSession[] = [
    {
      id: "cs_001",
      venueName: "Art Gallery Space",
      method: "Photogrammetry",
      progress: 75,
      status: 'capturing',
      startTime: "2025-06-30 14:30",
      estimatedCompletion: "2025-06-30 16:45",
      capturedImages: 450,
      totalImages: 600,
      currentStage: "Capturing interior details"
    },
    {
      id: "cs_002",
      venueName: "Beach Club Pavilion", 
      method: "LiDAR",
      progress: 100,
      status: 'complete',
      startTime: "2025-06-30 10:00",
      estimatedCompletion: "2025-06-30 12:30",
      capturedImages: 1200,
      totalImages: 1200,
      currentStage: "Scan complete - Ready for processing"
    }
  ];

  const startNewCapture = () => {
    const captureData = {
      venueName: "New Venue",
      method: captureMethod,
      quality: 'high'
    };
    
    startCaptureMutation.mutate(captureData);
  };

  const renderTwinGallery = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Digital Twin Gallery</h2>
          <p className="text-muted-foreground">Browse and manage your venue digital twins</p>
        </div>
        <Button onClick={() => setViewMode('capture')} className="bg-blue-600 hover:bg-blue-700">
          <Camera className="w-4 h-4 mr-2" />
          New Capture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDigitalTwins.map((twin) => (
          <Card key={twin.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTwin(twin)}>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative">
              <img 
                src={twin.thumbnail} 
                alt={twin.venueName}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-2 right-2 ${
                  twin.status === 'ready' ? 'bg-green-500' : 
                  twin.status === 'processing' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              >
                {twin.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{twin.venueName}</h3>
              <p className="text-sm text-muted-foreground">{twin.venueType} • {twin.capacity} guests</p>
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-muted-foreground">
                  {twin.captureMethod.toUpperCase()} • {twin.fileSize}MB
                </div>
                <Badge variant="outline">{twin.modelQuality}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCaptureInterface = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Venue Capture Studio</h2>
          <p className="text-muted-foreground">Create new digital twins of your venues</p>
        </div>
        <Button variant="outline" onClick={() => setViewMode('gallery')}>
          <Eye className="w-4 h-4 mr-2" />
          View Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capture Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Capture Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Venue Name</Label>
              <Input placeholder="Enter venue name" />
            </div>
            
            <div>
              <Label>Capture Method</Label>
              <Select value={captureMethod} onValueChange={(value: any) => setCaptureMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photogrammetry">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Photogrammetry (Recommended)
                    </div>
                  </SelectItem>
                  <SelectItem value="lidar">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4" />
                      LiDAR Scanning
                    </div>
                  </SelectItem>
                  <SelectItem value="360camera">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      360° Camera
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>High Quality Mode</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Include Audio Mapping</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Lighting Analysis</Label>
                <Switch defaultChecked />
              </div>
            </div>

            <Button 
              onClick={startNewCapture} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={startCaptureMutation.isPending}
            >
              {startCaptureMutation.isPending ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Start Capture Session
            </Button>
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockCaptureSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active capture sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mockCaptureSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{session.venueName}</h4>
                        <p className="text-sm text-muted-foreground">{session.method}</p>
                      </div>
                      <Badge variant={session.status === 'complete' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{session.progress}%</span>
                      </div>
                      <Progress value={session.progress} className="h-2" />
                      
                      <div className="text-xs text-muted-foreground">
                        <p>{session.currentStage}</p>
                        <p>{session.capturedImages}/{session.totalImages} images captured</p>
                      </div>
                    </div>

                    {session.status === 'complete' && (
                      <Button 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => processModelMutation.mutate(session.id)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Process Model
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGuestPreview = () => {
    const taggedAreas = [
      { id: 'bar', name: 'Bar Area', position: { x: 20, y: 30 }, type: 'amenity', color: 'bg-blue-500' },
      { id: 'bathrooms', name: 'Restrooms', position: { x: 80, y: 15 }, type: 'amenity', color: 'bg-green-500' },
      { id: 'photobooth', name: 'Photo Booth', position: { x: 60, y: 70 }, type: 'entertainment', color: 'bg-purple-500' },
      { id: 'dj-booth', name: 'DJ Station', position: { x: 50, y: 10 }, type: 'entertainment', color: 'bg-red-500' },
      { id: 'entrance', name: 'Main Entrance', position: { x: 10, y: 50 }, type: 'navigation', color: 'bg-yellow-500' },
      { id: 'vip-section', name: 'VIP Lounge', position: { x: 70, y: 25 }, type: 'seating', color: 'bg-amber-500' }
    ];

    const sponsors = [
      { id: 'sponsor1', name: 'Event Co.', logo: '/api/placeholder/60/60', position: { x: 25, y: 20 }, info: 'Premium event management services' },
      { id: 'sponsor2', name: 'Sound Pro', logo: '/api/placeholder/60/60', position: { x: 55, y: 15 }, info: 'Professional audio equipment' },
      { id: 'sponsor3', name: 'Party Lights', logo: '/api/placeholder/60/60', position: { x: 30, y: 60 }, info: 'LED lighting specialists' }
    ];

    const seatingOptions = [
      { id: 'table1', name: 'Table 1', seats: 8, available: 3, price: 0, position: { x: 30, y: 40 } },
      { id: 'table2', name: 'Table 2', seats: 8, available: 8, price: 0, position: { x: 45, y: 45 } },
      { id: 'vip1', name: 'VIP Table 1', seats: 6, available: 2, price: 50, position: { x: 70, y: 30 } },
      { id: 'vip2', name: 'VIP Table 2', seats: 6, available: 6, price: 50, position: { x: 75, y: 35 } }
    ];

    return (
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => setViewMode('gallery')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">Guest Preview</h1>
            <p className="text-sm text-muted-foreground">Experience your event from a guest's perspective</p>
          </div>
          <div /> {/* Spacer for centering */}
        </div>

        {/* Event Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Jordan's 30th Birthday Bash</h2>
          <p className="text-muted-foreground">Saturday, July 15, 2025 • 7:00 PM - 2:00 AM</p>
          <p className="text-sm text-muted-foreground">{selectedTwin?.venueName} • Downtown Event Center</p>
        </div>

        {/* View Mode Controls */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Explore the Venue</h3>
            <div className="flex gap-2">
              <Button
                variant={guestState.viewMode === 'first-person' ? 'default' : 'outline'}
                onClick={() => setGuestState(prev => ({ ...prev, viewMode: 'first-person' }))}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                First Person
              </Button>
              <Button
                variant={guestState.viewMode === 'aerial' ? 'default' : 'outline'}
                onClick={() => setGuestState(prev => ({ ...prev, viewMode: 'aerial' }))}
                size="sm"
              >
                <Map className="w-4 h-4 mr-2" />
                Aerial View
              </Button>
            </div>
          </div>

          {/* Interactive 3D Venue Preview */}
          <div className="relative bg-gradient-to-br from-slate-100 to-blue-50 rounded-lg h-96 border-2 border-dashed border-gray-300 overflow-hidden">
            {/* Venue Layout Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-blue-100">
              {/* Stage Area */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gray-800 rounded" />
              
              {/* Dance Floor */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg" />

              {/* Tables */}
              {seatingOptions.map((table) => (
                <div
                  key={table.id}
                  className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                    table.price > 0 ? 'bg-yellow-400 border-2 border-yellow-600' : 'bg-blue-400 border-2 border-blue-600'
                  } ${guestState.selectedReservation?.id === table.id ? 'ring-4 ring-green-400' : ''}`}
                  style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
                  onClick={() => setGuestState(prev => ({ ...prev, selectedReservation: table }))}
                />
              ))}

              {/* Tagged Areas */}
              {guestState.showTaggedAreas && taggedAreas.map((area) => (
                <div
                  key={area.id}
                  className={`absolute w-6 h-6 rounded-full cursor-pointer ${area.color} opacity-80 hover:opacity-100 transition-all duration-200 flex items-center justify-center`}
                  style={{ left: `${area.position.x}%`, top: `${area.position.y}%` }}
                  onClick={() => setGuestState(prev => ({ ...prev, selectedArea: area.id }))}
                >
                  {area.type === 'amenity' && <Home className="w-3 h-3 text-white" />}
                  {area.type === 'entertainment' && <Music className="w-3 h-3 text-white" />}
                  {area.type === 'navigation' && <MapPin className="w-3 h-3 text-white" />}
                  {area.type === 'seating' && <Sofa className="w-3 h-3 text-white" />}
                </div>
              ))}

              {/* Sponsor Logos */}
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="absolute w-8 h-8 bg-white rounded-lg shadow-md cursor-pointer hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                  style={{ left: `${sponsor.position.x}%`, top: `${sponsor.position.y}%` }}
                  onClick={() => setGuestState(prev => ({ ...prev, selectedArea: sponsor.id }))}
                >
                  <img src={sponsor.logo} alt={sponsor.name} className="w-6 h-6 rounded" />
                </div>
              ))}

              {/* First Person Walker Position */}
              {guestState.viewMode === 'first-person' && (
                <div
                  className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"
                  style={{ 
                    left: `${guestState.walkPosition.x}%`, 
                    top: `${guestState.walkPosition.y}%`,
                    transform: `rotate(${guestState.walkPosition.angle}deg)`
                  }}
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
                </div>
              )}
            </div>

            {/* View Mode Overlay */}
            {guestState.viewMode === 'first-person' && (
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>Use arrow buttons to walk around</span>
                </div>
              </div>
            )}

            {/* Aerial View Grid */}
            {guestState.viewMode === 'aerial' && (
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} className="border border-gray-400" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, walkPosition: { ...prev.walkPosition, x: Math.max(5, prev.walkPosition.x - 5) } }))}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, walkPosition: { ...prev.walkPosition, y: Math.max(5, prev.walkPosition.y - 5) } }))}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, walkPosition: { ...prev.walkPosition, y: Math.min(90, prev.walkPosition.y + 5) } }))}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, walkPosition: { ...prev.walkPosition, x: Math.min(90, prev.walkPosition.x + 5) } }))}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={guestState.showTaggedAreas}
                  onChange={(e) => setGuestState(prev => ({ ...prev, showTaggedAreas: e.target.checked }))}
                  className="rounded"
                />
                Show Tagged Areas
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, reservationMode: prev.reservationMode ? null : 'seating' }))}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Seat
              </Button>
            </div>
          </div>
        </Card>

        {/* Area Information Panel */}
        {guestState.selectedArea && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {taggedAreas.find(a => a.id === guestState.selectedArea)?.name ||
                 sponsors.find(s => s.id === guestState.selectedArea)?.name ||
                 'Area Information'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, selectedArea: null }))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {taggedAreas.find(a => a.id === guestState.selectedArea) && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {guestState.selectedArea === 'bar' && 'Premium bar with signature cocktails and open bar from 7-11 PM'}
                  {guestState.selectedArea === 'bathrooms' && 'Modern restroom facilities with premium amenities'}
                  {guestState.selectedArea === 'photobooth' && 'Professional photo booth with props and instant prints'}
                  {guestState.selectedArea === 'dj-booth' && 'Live DJ playing the latest hits and taking requests'}
                  {guestState.selectedArea === 'entrance' && 'Main entrance with coat check and welcome reception'}
                  {guestState.selectedArea === 'vip-section' && 'Exclusive VIP area with premium seating and bottle service'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button size="sm" variant="outline">
                    <Info className="w-4 h-4 mr-2" />
                    More Info
                  </Button>
                </div>
              </div>
            )}

            {sponsors.find(s => s.id === guestState.selectedArea) && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  {sponsors.find(s => s.id === guestState.selectedArea)?.info}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                  <Button size="sm" variant="outline">
                    <Gift className="w-4 h-4 mr-2" />
                    Special Offers
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Seating Reservation Panel */}
        {guestState.selectedReservation && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reserve {guestState.selectedReservation.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGuestState(prev => ({ ...prev, selectedReservation: null }))}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Seats:</span> {guestState.selectedReservation.seats}
                </div>
                <div>
                  <span className="font-medium">Available:</span> {guestState.selectedReservation.available}
                </div>
                <div>
                  <span className="font-medium">Price:</span> 
                  {guestState.selectedReservation.price > 0 ? ` $${guestState.selectedReservation.price}/person` : ' Free'}
                </div>
                <div>
                  <span className="font-medium">Type:</span> 
                  {guestState.selectedReservation.price > 0 ? ' VIP' : ' General'}
                </div>
              </div>

              {guestState.selectedReservation.available > 0 ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Number of Seats</label>
                    <select className="w-full px-3 py-2 border rounded-lg">
                      {Array.from({ length: Math.min(guestState.selectedReservation.available, 6) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} seat{i > 0 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  {guestState.selectedReservation.price > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">VIP Perks Included:</span>
                      </div>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        <li>• Priority bar service</li>
                        <li>• Complimentary champagne toast</li>
                        <li>• Premium view of entertainment</li>
                        <li>• Dedicated server</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Reserve Now
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>This table is fully reserved</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Join Waitlist
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Event Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Event Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Doors Open</span>
                <span>7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Welcome Reception</span>
                <span>7:00 - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Dinner Service</span>
                <span>8:00 - 9:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Live Entertainment</span>
                <span>9:30 - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Dancing & DJ</span>
                <span>11:00 PM - 2:00 AM</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Guest Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Dress Code:</span>
                <span className="ml-2">Cocktail Attire</span>
              </div>
              <div>
                <span className="font-medium">Parking:</span>
                <span className="ml-2">Valet & Self-Park Available</span>
              </div>
              <div>
                <span className="font-medium">Age Requirement:</span>
                <span className="ml-2">21+ Event</span>
              </div>
              <div>
                <span className="font-medium">Special Dietary:</span>
                <span className="ml-2">Options Available</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Host
              </Button>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="px-8">
            <Check className="w-5 h-5 mr-2" />
            Confirm Attendance
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            <Share2 className="w-5 h-5 mr-2" />
            Share Event
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            <Calendar className="w-5 h-5 mr-2" />
            Add to Calendar
          </Button>
        </div>
      </div>
    );
  };

  const renderEventPlanner = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">3D Event Planner - {selectedTwin?.venueName}</h2>
          <p className="text-muted-foreground">Design your event in immersive 3D space</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={plannerState.walkthrough ? "default" : "outline"} 
            size="sm"
            onClick={() => setPlannerState(prev => ({...prev, walkthrough: !prev.walkthrough}))}
          >
            <Eye className="w-4 h-4 mr-2" />
            {plannerState.walkthrough ? "Exit Walkthrough" : "Start Walkthrough"}
          </Button>
          <Button 
            variant={plannerState.vendorShowcase ? "default" : "outline"} 
            size="sm"
            onClick={() => setPlannerState(prev => ({...prev, vendorShowcase: !prev.vendorShowcase}))}
          >
            <Users className="w-4 h-4 mr-2" />
            Vendor Showcase
          </Button>
          <Button variant="outline" onClick={() => setViewMode('viewer')}>
            <Move3D className="w-4 h-4 mr-2" />
            3D Viewer
          </Button>
          <Button variant="outline" onClick={() => setViewMode('gallery')}>
            <Eye className="w-4 h-4 mr-2" />
            Gallery
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 3D Planning Workspace */}
        <div className="lg:col-span-4">
          <Card className="h-[700px]">
            <CardContent className="p-0 h-full relative">
              {/* Interactive 3D Planning Environment */}
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg relative overflow-hidden">
                {/* 3D Scene Mock */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-40 h-40 mx-auto mb-6 bg-white/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-20 h-20" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">3D Event Designer</h3>
                    <p className="text-white/70 mb-6">Interactive venue planning with real-time 3D preview</p>
                    {plannerState.walkthrough && (
                      <div className="bg-blue-600/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
                        <h4 className="font-semibold mb-2">🚶‍♂️ Walkthrough Mode Active</h4>
                        <p className="text-sm">Use WASD to walk around your venue. Click objects to inspect them.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tool Overlay */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant={plannerState.selectedTool === 'select' ? 'default' : 'secondary'}
                      onClick={() => setPlannerState(prev => ({...prev, selectedTool: 'select'}))}
                    >
                      <Mouse className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={plannerState.selectedTool === 'tables' ? 'default' : 'secondary'}
                      onClick={() => setPlannerState(prev => ({...prev, selectedTool: 'tables'}))}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={plannerState.selectedTool === 'stage' ? 'default' : 'secondary'}
                      onClick={() => setPlannerState(prev => ({...prev, selectedTool: 'stage'}))}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={plannerState.selectedTool === 'lighting' ? 'default' : 'secondary'}
                      onClick={() => setPlannerState(prev => ({...prev, selectedTool: 'lighting'}))}
                    >
                      <Sun className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={plannerState.selectedTool === 'decor' ? 'default' : 'secondary'}
                      onClick={() => setPlannerState(prev => ({...prev, selectedTool: 'decor'}))}
                    >
                      <Palette className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Placed Items Indicators */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-white text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Tables: 12</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Stage: 1</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Lights: 8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Decor: 15</span>
                    </div>
                  </div>
                </div>

                {/* Vendor Showcase Modal */}
                {plannerState.vendorShowcase && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-4xl max-h-[80%] overflow-auto">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Vendor Decor Showcase</CardTitle>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setPlannerState(prev => ({...prev, vendorShowcase: false}))}
                          >
                            ×
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { vendor: "Elegant Events Co.", package: "Luxury Wedding Setup", price: "$2,500", items: "Crystal chandeliers, white linens, centerpieces", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format" },
                            { vendor: "Party Paradise", package: "DJ Booth & Dance Floor", price: "$1,200", items: "LED stage, sound system, dance floor", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format" },
                            { vendor: "Floral Dreams", package: "Garden Party Decor", price: "$800", items: "Flower arrangements, vine installations", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format" },
                            { vendor: "Tech Events", package: "Corporate Conference Setup", price: "$1,500", items: "Projection screens, podium, seating", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format" }
                          ].map((item, index) => (
                            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <img src={item.preview} alt={item.package} className="w-full h-32 object-cover rounded mb-3" />
                                <h4 className="font-semibold">{item.package}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{item.vendor}</p>
                                <p className="text-xs text-muted-foreground mb-3">{item.items}</p>
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-green-600">{item.price}</span>
                                  <Button size="sm">Preview in 3D</Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Status Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-center text-white text-sm">
                    <div className="flex items-center gap-4">
                      <span>Tool: {plannerState.selectedTool.charAt(0).toUpperCase() + plannerState.selectedTool.slice(1)}</span>
                      <span>•</span>
                      <span>Capacity: 280/300 guests</span>
                      <span>•</span>
                      <span>Budget: $8,250 / $10,000</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Export Plan
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Design
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Planning Tools Panel */}
        <div className="space-y-4">
          {/* Item Library */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {plannerState.selectedTool === 'tables' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Tables & Seating</h4>
                  {['Round Table (8 seats)', 'Rectangle Table (10 seats)', 'Cocktail Table (4 seats)', 'Bar Stools', 'Lounge Chairs'].map((item) => (
                    <Button key={item} variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Grid3X3 className="w-3 h-3 mr-2" />
                      {item}
                    </Button>
                  ))}
                </div>
              )}
              
              {plannerState.selectedTool === 'stage' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Stage & Performance</h4>
                  {['Main Stage', 'DJ Booth', 'Dance Floor', 'Performance Area', 'Speaker Setup'].map((item) => (
                    <Button key={item} variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Monitor className="w-3 h-3 mr-2" />
                      {item}
                    </Button>
                  ))}
                </div>
              )}

              {plannerState.selectedTool === 'lighting' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Lighting</h4>
                  {['Chandelier', 'Spot Lights', 'LED Strips', 'Ambient Lighting', 'Party Lights'].map((item) => (
                    <Button key={item} variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Sun className="w-3 h-3 mr-2" />
                      {item}
                    </Button>
                  ))}
                </div>
              )}

              {plannerState.selectedTool === 'decor' && (
                <div className="space-y-2">
                  <h4 className="font-medium">Decorations</h4>
                  {['Centerpieces', 'Banners', 'Balloons', 'Flowers', 'Linens'].map((item) => (
                    <Button key={item} variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Palette className="w-3 h-3 mr-2" />
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Guest Flow</Label>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div className="h-2 bg-green-500 rounded w-4/5"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Optimal circulation</p>
              </div>
              
              <div>
                <Label className="text-xs">Sight Lines</Label>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div className="h-2 bg-blue-500 rounded w-3/4"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Good stage visibility</p>
              </div>

              <div>
                <Label className="text-xs">Acoustics</Label>
                <div className="h-2 bg-gray-200 rounded mt-1">
                  <div className="h-2 bg-purple-500 rounded w-5/6"></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Excellent audio coverage</p>
              </div>
            </CardContent>
          </Card>

          {/* Saved Layouts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Layout Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Wedding Reception', 'Corporate Event', 'Birthday Party', 'Conference', 'Cocktail Party'].map((layout) => (
                <Button key={layout} variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Calendar className="w-3 h-3 mr-2" />
                  {layout}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPostEventExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{selectedTwin?.venueName} - Memory Space</h2>
          <p className="text-muted-foreground">Relive your event with highlights and interactive memories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode('viewer')}>
            <Eye className="w-4 h-4 mr-2" />
            3D Viewer
          </Button>
          <Button variant="outline" onClick={() => setViewMode('gallery')}>
            <Share2 className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </div>
      </div>

      {/* Post-Event Tabs */}
      <Tabs value={postEventState.selectedTab} onValueChange={(value) => setPostEventState(prev => ({...prev, selectedTab: value}))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="highlights">
            <Video className="w-4 h-4 mr-2" />
            Memory Highlights
          </TabsTrigger>
          <TabsTrigger value="recap-tour">
            <Route className="w-4 h-4 mr-2" />
            3D Recap Tour
          </TabsTrigger>
          <TabsTrigger value="sponsor-products">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Sponsor Products
          </TabsTrigger>
        </TabsList>

        {/* Memory Highlights Tab */}
        <TabsContent value="highlights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Memory Viewer */}
            <div className="lg:col-span-2">
              <Card className="h-[500px]">
                <CardContent className="p-0 h-full relative">
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg flex items-center justify-center">
                    {postEventState.playingMemory ? (
                      <div className="text-center text-white">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                          <Video className="w-16 h-16" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Playing: {postEventState.playingMemory.title}</h3>
                        <p className="text-white/70 mb-4">{postEventState.playingMemory.description}</p>
                        <div className="flex gap-2 justify-center">
                          <Button size="sm" variant="secondary">
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                          <Image className="w-16 h-16" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Event Memory Viewer</h3>
                        <p className="text-white/70">Select a memory to replay highlights</p>
                      </div>
                    )}
                  </div>

                  {/* Memory Controls */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Rewind className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <FastForward className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm">
                        <span>2:34 / 8:42</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Memory Library */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tagged Memory Zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { id: 'dance-floor', title: 'Dance Floor Highlights', count: 23, type: 'video', tag: 'Dancing' },
                    { id: 'main-stage', title: 'Performance Moments', count: 15, type: 'video', tag: 'Entertainment' },
                    { id: 'reception', title: 'Welcome Reception', count: 18, type: 'photo', tag: 'Networking' },
                    { id: 'dining', title: 'Dinner Service', count: 12, type: 'photo', tag: 'Food' },
                    { id: 'bar-area', title: 'Cocktail Hour', count: 31, type: 'mixed', tag: 'Drinks' }
                  ].map((zone) => (
                    <Card key={zone.id} className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setPostEventState(prev => ({...prev, selectedMemoryZone: zone.id, playingMemory: {title: zone.title, description: `Guest-generated content from ${zone.tag.toLowerCase()} area`}}))}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {zone.type === 'video' && <Video className="w-4 h-4 text-purple-500" />}
                            {zone.type === 'photo' && <Image className="w-4 h-4 text-blue-500" />}
                            {zone.type === 'mixed' && <MessageCircle className="w-4 h-4 text-green-500" />}
                            <div>
                              <h4 className="font-medium text-sm">{zone.title}</h4>
                              <p className="text-xs text-muted-foreground">{zone.count} memories</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">{zone.tag}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Memory Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter Memories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Videos', 'Photos', 'Guest Selfies', 'Professional', 'Candid'].map((filter) => (
                      <Badge key={filter} variant={postEventState.filterTags.includes(filter) ? 'default' : 'outline'} 
                             className="cursor-pointer text-xs"
                             onClick={() => setPostEventState(prev => ({
                               ...prev, 
                               filterTags: prev.filterTags.includes(filter) 
                                 ? prev.filterTags.filter(t => t !== filter)
                                 : [...prev.filterTags, filter]
                             }))}>
                        {filter}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Time Range</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Entire Event</SelectItem>
                        <SelectItem value="cocktail">Cocktail Hour</SelectItem>
                        <SelectItem value="dinner">Dinner Service</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="dancing">Dancing & DJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 3D Recap Tour Tab */}
        <TabsContent value="recap-tour" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tour Viewer */}
            <div className="lg:col-span-3">
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full relative">
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                        <Route className="w-16 h-16" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">3D Event Recap Tour</h3>
                      <p className="text-white/70 mb-4">Interactive walkthrough of event highlights</p>
                      <div className="w-64 mx-auto mb-4">
                        <Progress value={postEventState.tourProgress} className="h-2" />
                        <p className="text-sm mt-2">Tour Progress: {postEventState.tourProgress}%</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button size="sm" variant="secondary" 
                                onClick={() => setPostEventState(prev => ({...prev, isPlayingTour: !prev.isPlayingTour}))}>
                          {postEventState.isPlayingTour ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {postEventState.isPlayingTour ? 'Pause' : 'Start'} Tour
                        </Button>
                        <Button size="sm" variant="secondary">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Tour Hotspots */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="text-white text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span>Current: Welcome Reception</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Next: Dinner Service</span>
                      </div>
                    </div>
                  </div>

                  {/* Tour Navigation */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Rewind className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <FastForward className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm">
                        <span>Stop 3 of 8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tour Stations */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tour Stations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { id: 1, name: 'Welcome Reception', status: 'completed', duration: '2:15' },
                    { id: 2, name: 'Cocktail Bar', status: 'completed', duration: '1:45' },
                    { id: 3, name: 'Dinner Service', status: 'current', duration: '3:20' },
                    { id: 4, name: 'Entertainment Stage', status: 'upcoming', duration: '2:50' },
                    { id: 5, name: 'Dance Floor', status: 'upcoming', duration: '4:10' },
                    { id: 6, name: 'VIP Lounge', status: 'upcoming', duration: '1:30' },
                    { id: 7, name: 'Photo Booth', status: 'upcoming', duration: '2:00' },
                    { id: 8, name: 'Grand Finale', status: 'upcoming', duration: '1:20' }
                  ].map((station) => (
                    <div key={station.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      station.status === 'current' ? 'bg-blue-50 border-blue-200' :
                      station.status === 'completed' ? 'bg-green-50 border-green-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {station.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {station.status === 'current' && <Play className="w-4 h-4 text-blue-500" />}
                          {station.status === 'upcoming' && <Clock className="w-4 h-4 text-gray-400" />}
                          <div>
                            <h4 className="font-medium text-sm">{station.name}</h4>
                            <p className="text-xs text-muted-foreground">{station.duration}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Jump To
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Tour Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tour Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-advance</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Timestamps</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Include Audio</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Playback Speed</Label>
                    <Select defaultValue="1x">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5x">0.5x</SelectItem>
                        <SelectItem value="1x">1x</SelectItem>
                        <SelectItem value="1.5x">1.5x</SelectItem>
                        <SelectItem value="2x">2x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sponsor Products Tab */}
        <TabsContent value="sponsor-products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Product Showcase */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { 
                    id: 'product1', 
                    name: 'Designer Cocktail Dress', 
                    brand: 'Elegant Boutique',
                    price: '$299', 
                    originalPrice: '$399',
                    image: '/api/placeholder/200/250',
                    zone: 'Dance Floor',
                    availability: 'Available',
                    featured: true
                  },
                  { 
                    id: 'product2', 
                    name: 'Premium Whiskey Set', 
                    brand: 'Luxury Spirits Co.',
                    price: '$149', 
                    originalPrice: '$199',
                    image: '/api/placeholder/200/250',
                    zone: 'VIP Bar',
                    availability: 'Limited Stock',
                    featured: false
                  },
                  { 
                    id: 'product3', 
                    name: 'Artisan Cheese Board', 
                    brand: 'Gourmet Selections',
                    price: '$85', 
                    originalPrice: '$110',
                    image: '/api/placeholder/200/250',
                    zone: 'Reception Area',
                    availability: 'Available',
                    featured: false
                  },
                  { 
                    id: 'product4', 
                    name: 'Signature Perfume', 
                    brand: 'Luxury Scents',
                    price: '$120', 
                    originalPrice: '$160',
                    image: '/api/placeholder/200/250',
                    zone: 'Lounge',
                    availability: 'Available',
                    featured: true
                  },
                  { 
                    id: 'product5', 
                    name: 'Custom Photo Frame', 
                    brand: 'Memory Keepers',
                    price: '$45', 
                    originalPrice: '$65',
                    image: '/api/placeholder/200/250',
                    zone: 'Photo Booth',
                    availability: 'Available',
                    featured: false
                  },
                  { 
                    id: 'product6', 
                    name: 'Luxury Watch', 
                    brand: 'Timepiece Masters',
                    price: '$899', 
                    originalPrice: '$1199',
                    image: '/api/placeholder/200/250',
                    zone: 'VIP Lounge',
                    availability: 'Exclusive',
                    featured: true
                  }
                ].map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500">
                          Featured
                        </Badge>
                      )}
                      <Badge className="absolute top-2 right-2 bg-blue-500">
                        {product.zone}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">{product.price}</span>
                          <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant={product.availability === 'Available' ? 'default' : 
                                        product.availability === 'Limited Stock' ? 'destructive' : 'secondary'}
                                 className="text-xs">
                            {product.availability}
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Heart className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Button size="sm" className="w-full">
                          <ShoppingBag className="w-3 h-3 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Shopping Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Sponsors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'Elegant Boutique', products: 8, discount: '25% off' },
                    { name: 'Luxury Spirits Co.', products: 5, discount: '20% off' },
                    { name: 'Gourmet Selections', products: 12, discount: '15% off' },
                    { name: 'Memory Keepers', products: 6, discount: '30% off' }
                  ].map((sponsor, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <h4 className="font-medium text-sm">{sponsor.name}</h4>
                        <p className="text-xs text-muted-foreground">{sponsor.products} products</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{sponsor.discount}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4 text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Your cart is empty</p>
                    <p className="text-xs">Add products from the event</p>
                  </div>
                  <Button className="w-full" disabled>
                    <Gift className="w-4 h-4 mr-2" />
                    Checkout
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Featured Only</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Available Only</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Event Zone</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All zones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="dance-floor">Dance Floor</SelectItem>
                        <SelectItem value="vip-bar">VIP Bar</SelectItem>
                        <SelectItem value="reception">Reception Area</SelectItem>
                        <SelectItem value="lounge">Lounge</SelectItem>
                        <SelectItem value="photo-booth">Photo Booth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Price Range</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any price" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="under-50">Under $50</SelectItem>
                        <SelectItem value="50-100">$50 - $100</SelectItem>
                        <SelectItem value="100-200">$100 - $200</SelectItem>
                        <SelectItem value="over-200">Over $200</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const render3DViewer = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{selectedTwin?.venueName}</h2>
          <p className="text-muted-foreground">Interactive 3D Digital Twin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setViewMode('gallery')}>
            <Eye className="w-4 h-4 mr-2" />
            Gallery
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Viewer */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardContent className="p-0 h-full relative">
              {/* Mock 3D Viewer */}
              <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
                    <Move3D className="w-16 h-16" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3D Digital Twin Viewer</h3>
                  <p className="text-white/70">Interactive 3D model would load here</p>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button size="sm" variant="secondary">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset View
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Maximize className="w-4 h-4 mr-2" />
                      Fullscreen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Viewer Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Move3D className="w-4 h-4" />
                </Button>
              </div>

              {/* Viewer Settings */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Ruler className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Sun className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Info */}
        <div className="space-y-4">
          {/* Venue Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Venue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Type</Label>
                <p className="font-medium">{selectedTwin?.venueType}</p>
              </div>
              <div>
                <Label className="text-xs">Capacity</Label>
                <p className="font-medium">{selectedTwin?.capacity} guests</p>
              </div>
              <div>
                <Label className="text-xs">Dimensions</Label>
                <p className="font-medium">
                  {selectedTwin?.dimensions.length}m × {selectedTwin?.dimensions.width}m × {selectedTwin?.dimensions.height}m
                </p>
              </div>
              <div>
                <Label className="text-xs">Accuracy</Label>
                <p className="font-medium">{selectedTwin?.metadata.accuracyLevel}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedTwin?.features.map((feature, index) => (
                  <Badge key={index} variant="outline">{feature}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Show Grid</Label>
                <Switch 
                  checked={viewerSettings.showGrid}
                  onCheckedChange={(checked) => 
                    setViewerSettings(prev => ({...prev, showGrid: checked}))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Measurements</Label>
                <Switch 
                  checked={viewerSettings.showMeasurements}
                  onCheckedChange={(checked) => 
                    setViewerSettings(prev => ({...prev, showMeasurements: checked}))
                  }
                />
              </div>
              <div>
                <Label>Lighting Mode</Label>
                <Select 
                  value={viewerSettings.lightingMode}
                  onValueChange={(value) => 
                    setViewerSettings(prev => ({...prev, lightingMode: value}))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="bright">Bright</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="wireframe">Wireframe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {viewMode === 'gallery' && renderTwinGallery()}
        {viewMode === 'capture' && renderCaptureInterface()}
        {viewMode === 'viewer' && selectedTwin && render3DViewer()}
        {viewMode === 'planner' && selectedTwin && renderEventPlanner()}
        {viewMode === 'guest-preview' && selectedTwin && renderGuestPreview()}
        {viewMode === 'post-event' && selectedTwin && renderPostEventExperience()}
      </div>

      {/* Twin Detail Modal */}
      {selectedTwin && viewMode === 'gallery' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedTwin.venueName}</CardTitle>
                  <CardDescription>{selectedTwin.address}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedTwin(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                <img 
                  src={selectedTwin.thumbnail} 
                  alt={selectedTwin.venueName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Technical Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Capture Method:</span>
                      <span className="font-medium">{selectedTwin.captureMethod.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model Quality:</span>
                      <span className="font-medium">{selectedTwin.modelQuality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span className="font-medium">{selectedTwin.fileSize}MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polygons:</span>
                      <span className="font-medium">{selectedTwin.metadata.polygonCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Texture Resolution:</span>
                      <span className="font-medium">{selectedTwin.metadata.textureResolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-medium">{selectedTwin.metadata.accuracyLevel}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTwin.features.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Lighting Mapped</span>
                    </div>
                    {selectedTwin.metadata.audioMapped && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Audio Mapped</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setViewMode('viewer')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View in 3D
                </Button>
                <Button 
                  onClick={() => setViewMode('planner')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Event Planner
                </Button>
                <Button 
                  onClick={() => setViewMode('guest-preview')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Guest Preview
                </Button>
                <Button 
                  onClick={() => setViewMode('post-event')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Memory Space
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}