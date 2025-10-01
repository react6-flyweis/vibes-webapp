import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  MessageSquare,
  Heart,
  Music,
  Share2,
  Settings,
  Eye,
  EyeOff,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize,
  Minimize,
  Camera,
  PhoneCall,
  Headphones,
  Wifi,
  WifiOff,
  Star,
  Gift,
  Zap,
  Crown,
  PartyPopper,
  Sparkles,
  ThumbsUp,
  Clock,
  Globe,
  Lock,
  Monitor,
  Smartphone,
  ExternalLink,
  Download,
  BarChart3,
  TrendingUp,
  UserPlus
} from "lucide-react";

interface LiveStream {
  id: string;
  eventId: string;
  eventTitle: string;
  hostName: string;
  hostAvatar: string;
  title: string;
  description: string;
  status: 'scheduled' | 'live' | 'ended' | 'paused';
  startTime: string;
  endTime?: string;
  duration: number;
  thumbnail: string;
  streamUrl: string;
  isPrivate: boolean;
  accessCode?: string;
  viewerCount: number;
  maxViewers: number;
  totalViews: number;
  platforms: string[];
  quality: 'auto' | '1080p' | '720p' | '480p';
  tags: string[];
  category: 'party' | 'wedding' | 'corporate' | 'birthday' | 'concert';
  isHybridEvent: boolean;
  recording: {
    isEnabled: boolean;
    autoSave: boolean;
    highlights: boolean;
  };
  interactions: {
    commentsEnabled: boolean;
    votingEnabled: boolean;
    cheersEnabled: boolean;
    requestsEnabled: boolean;
    moderationEnabled: boolean;
  };
  analytics: {
    peakViewers: number;
    averageWatchTime: number;
    engagementRate: number;
    totalComments: number;
    totalCheers: number;
    totalRequests: number;
  };
}

interface StreamComment {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'cheer' | 'request' | 'vote';
  metadata?: {
    cheerType?: string;
    cheerAmount?: number;
    requestSong?: string;
    voteOption?: string;
  };
  isPinned: boolean;
  isModerated: boolean;
}

interface StreamCheer {
  id: string;
  type: 'applause' | 'fire' | 'heart' | 'star' | 'crown' | 'party';
  name: string;
  icon: string;
  cost: number;
  animation: string;
  color: string;
}

interface StreamRequest {
  id: string;
  streamId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'song' | 'shoutout' | 'announcement' | 'game';
  content: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'denied' | 'completed';
  votes: number;
  priority: 'low' | 'medium' | 'high';
}

interface StreamPoll {
  id: string;
  streamId: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  endTime: string;
  isActive: boolean;
  totalVotes: number;
}

export default function PartyCastLive() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState("live");
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [streamSettings, setStreamSettings] = useState({
    isPrivate: false,
    quality: '720p',
    platforms: ['vibes'],
    recording: true,
    interactions: true
  });
  const [newComment, setNewComment] = useState("");
  const [selectedCheer, setSelectedCheer] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState("");
  const [requestType, setRequestType] = useState<'song' | 'shoutout' | 'announcement' | 'game'>('song');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [showChat, setShowChat] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  
  // Data queries
  const { data: liveStreams, isLoading: streamsLoading } = useQuery({
    queryKey: ["/api/partycast/streams"],
    refetchInterval: 5000,
  });
  
  const { data: streamComments, isLoading: commentsLoading } = useQuery({
    queryKey: ["/api/partycast/comments", selectedStream],
    enabled: !!selectedStream,
    refetchInterval: 2000,
  });
  
  const { data: streamRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["/api/partycast/requests", selectedStream],
    enabled: !!selectedStream,
    refetchInterval: 3000,
  });
  
  const { data: streamAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/partycast/analytics", selectedStream],
    enabled: !!selectedStream && isHost,
    refetchInterval: 10000,
  });

  const { data: availableCheers } = useQuery({
    queryKey: ["/api/partycast/cheers"],
  });

  // Mutations
  const startStreamMutation = useMutation({
    mutationFn: async (data: { eventId: string; title: string; description: string; settings: any }) => {
      const response = await apiRequest("POST", "/api/partycast/start", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Stream Started!",
        description: "Your party is now live for remote guests",
      });
      setSelectedStream(data.streamId);
      setIsHost(true);
      queryClient.invalidateQueries({ queryKey: ["/api/partycast"] });
    },
  });

  const endStreamMutation = useMutation({
    mutationFn: async (streamId: string) => {
      const response = await apiRequest("POST", `/api/partycast/${streamId}/end`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Stream Ended",
        description: "Thanks for sharing your party with remote guests!",
      });
      setSelectedStream(null);
      setIsHost(false);
      queryClient.invalidateQueries({ queryKey: ["/api/partycast"] });
    },
  });

  const joinStreamMutation = useMutation({
    mutationFn: async (data: { streamId: string; accessCode?: string }) => {
      const response = await apiRequest("POST", `/api/partycast/${data.streamId}/join`, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Joined Stream",
        description: "Welcome to the party!",
      });
      setSelectedStream(data.streamId);
      queryClient.invalidateQueries({ queryKey: ["/api/partycast"] });
    },
  });

  const sendCommentMutation = useMutation({
    mutationFn: async (data: { streamId: string; content: string; type: 'comment' | 'cheer' | 'request' }) => {
      const response = await apiRequest("POST", `/api/partycast/${data.streamId}/comment`, data);
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/partycast/comments"] });
    },
  });

  const sendCheerMutation = useMutation({
    mutationFn: async (data: { streamId: string; cheerType: string; message?: string }) => {
      const response = await apiRequest("POST", `/api/partycast/${data.streamId}/cheer`, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Cheer Sent!",
        description: `You sent ${data.cheerName} to the party!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partycast/comments"] });
    },
  });

  const sendRequestMutation = useMutation({
    mutationFn: async (data: { streamId: string; type: string; content: string }) => {
      const response = await apiRequest("POST", `/api/partycast/${data.streamId}/request`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "Your request has been sent to the host",
      });
      setNewRequest("");
      queryClient.invalidateQueries({ queryKey: ["/api/partycast/requests"] });
    },
  });

  // Helper functions
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'scheduled': return 'bg-blue-500 text-white';
      case 'ended': return 'bg-gray-500 text-white';
      case 'paused': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCheerIcon = (type: string) => {
    switch (type) {
      case 'applause': return <ThumbsUp className="h-4 w-4" />;
      case 'fire': return <Zap className="h-4 w-4" />;
      case 'heart': return <Heart className="h-4 w-4" />;
      case 'star': return <Star className="h-4 w-4" />;
      case 'crown': return <Crown className="h-4 w-4" />;
      case 'party': return <PartyPopper className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  // Sample data (would come from API)
  const streams: LiveStream[] = liveStreams || [
    {
      id: "stream-001",
      eventId: "event-001",
      eventTitle: "Sarah's Birthday Bash",
      hostName: "Sarah Johnson",
      hostAvatar: "/avatars/sarah.jpg",
      title: "Epic Birthday Party Live!",
      description: "Join us for an amazing birthday celebration with live music, dancing, and surprises!",
      status: "live",
      startTime: "2025-07-01T19:00:00Z",
      duration: 3600,
      thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
      streamUrl: "https://stream.vibes.com/sarah-birthday",
      isPrivate: false,
      viewerCount: 247,
      maxViewers: 350,
      totalViews: 1250,
      platforms: ["vibes", "youtube", "instagram"],
      quality: "1080p",
      tags: ["birthday", "party", "music", "dancing"],
      category: "birthday",
      isHybridEvent: true,
      recording: {
        isEnabled: true,
        autoSave: true,
        highlights: true
      },
      interactions: {
        commentsEnabled: true,
        votingEnabled: true,
        cheersEnabled: true,
        requestsEnabled: true,
        moderationEnabled: false
      },
      analytics: {
        peakViewers: 350,
        averageWatchTime: 1845,
        engagementRate: 78,
        totalComments: 423,
        totalCheers: 89,
        totalRequests: 34
      }
    },
    {
      id: "stream-002",
      eventId: "event-002",
      eventTitle: "Tech Company Annual Gala",
      hostName: "InnovateTech Events",
      hostAvatar: "/avatars/company.jpg",
      title: "Annual Innovation Gala",
      description: "Celebrating our achievements and looking forward to the future",
      status: "scheduled",
      startTime: "2025-07-02T20:00:00Z",
      duration: 0,
      thumbnail: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
      streamUrl: "",
      isPrivate: true,
      accessCode: "TECH2025",
      viewerCount: 0,
      maxViewers: 500,
      totalViews: 0,
      platforms: ["vibes"],
      quality: "1080p",
      tags: ["corporate", "gala", "awards"],
      category: "corporate",
      isHybridEvent: true,
      recording: {
        isEnabled: true,
        autoSave: true,
        highlights: false
      },
      interactions: {
        commentsEnabled: true,
        votingEnabled: false,
        cheersEnabled: true,
        requestsEnabled: false,
        moderationEnabled: true
      },
      analytics: {
        peakViewers: 0,
        averageWatchTime: 0,
        engagementRate: 0,
        totalComments: 0,
        totalCheers: 0,
        totalRequests: 0
      }
    }
  ];

  const comments: StreamComment[] = streamComments || [
    {
      id: "comment-001",
      streamId: "stream-001",
      userId: "user-001",
      userName: "Alex Chen",
      userAvatar: "/avatars/alex.jpg",
      content: "This party looks amazing! Wish I could be there!",
      timestamp: "2025-07-01T19:15:30Z",
      type: "comment",
      isPinned: false,
      isModerated: false
    },
    {
      id: "comment-002",
      streamId: "stream-001",
      userId: "user-002",
      userName: "Maya Rodriguez",
      userAvatar: "/avatars/maya.jpg",
      content: "Happy Birthday Sarah! 🎉",
      timestamp: "2025-07-01T19:16:45Z",
      type: "cheer",
      metadata: {
        cheerType: "party",
        cheerAmount: 5
      },
      isPinned: false,
      isModerated: false
    },
    {
      id: "comment-003",
      streamId: "stream-001",
      userId: "user-003",
      userName: "Jordan Smith",
      userAvatar: "/avatars/jordan.jpg",
      content: "Can you play 'Happy' by Pharrell Williams?",
      timestamp: "2025-07-01T19:18:20Z",
      type: "request",
      metadata: {
        requestSong: "Happy - Pharrell Williams"
      },
      isPinned: false,
      isModerated: false
    }
  ];

  const cheers: StreamCheer[] = availableCheers || [
    { id: "cheer-001", type: "applause", name: "Applause", icon: "👏", cost: 1, animation: "bounce", color: "#FFD700" },
    { id: "cheer-002", type: "fire", name: "Fire", icon: "🔥", cost: 2, animation: "pulse", color: "#FF4500" },
    { id: "cheer-003", type: "heart", name: "Love", icon: "❤️", cost: 3, animation: "float", color: "#FF69B4" },
    { id: "cheer-004", type: "star", name: "Star", icon: "⭐", cost: 5, animation: "sparkle", color: "#FFD700" },
    { id: "cheer-005", type: "crown", name: "Crown", icon: "👑", cost: 10, animation: "glow", color: "#FFD700" },
    { id: "cheer-006", type: "party", name: "Party", icon: "🎉", cost: 15, animation: "confetti", color: "#FF6B6B" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Radio className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PartyCast Live</h1>
                <p className="text-gray-600">Livestream your party to remote guests and expand the celebration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Wifi className="h-4 w-4 mr-1" />
                {connectionStatus === 'connected' ? 'Connected' : 'Connecting...'}
              </Badge>
              <Button onClick={() => setShowSettings(true)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="live">Live Streams</TabsTrigger>
            <TabsTrigger value="host">Host Stream</TabsTrigger>
            <TabsTrigger value="viewer">Watch Party</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Live Streams Tab */}
          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {streams.map((stream) => (
                <Card key={stream.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                  <div className="relative">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getStatusColor(stream.status)}>
                        {stream.status === 'live' && <Radio className="h-3 w-3 mr-1" />}
                        {stream.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="bg-black/70 text-white border-white/20">
                        <Eye className="h-3 w-3 mr-1" />
                        {stream.viewerCount}
                      </Badge>
                    </div>
                    {stream.status === 'live' && (
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="outline" className="bg-red-500/90 text-white border-red-300">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(stream.duration)}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stream.hostAvatar} />
                          <AvatarFallback>{stream.hostName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{stream.title}</CardTitle>
                          <p className="text-sm text-gray-600">{stream.hostName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {stream.isPrivate && <Lock className="h-4 w-4 text-gray-400" />}
                        {stream.isHybridEvent && <Globe className="h-4 w-4 text-blue-500" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{stream.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {stream.totalViews} views
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {stream.analytics.totalComments}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {stream.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" size="sm">{platform}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {stream.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                      ))}
                    </div>

                    <div className="pt-2">
                      {stream.status === 'live' ? (
                        <Button 
                          className="w-full bg-red-500 hover:bg-red-600"
                          onClick={() => joinStreamMutation.mutate({ streamId: stream.id })}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Live Stream
                        </Button>
                      ) : stream.status === 'scheduled' ? (
                        <Button variant="outline" className="w-full">
                          <Clock className="h-4 w-4 mr-2" />
                          Starts {new Date(stream.startTime).toLocaleTimeString()}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Watch Replay
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Host Stream Tab */}
          <TabsContent value="host" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Stream Setup */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Start Your Live Stream
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Camera Preview</p>
                      <p className="text-sm opacity-75">Your live stream will appear here</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Stream Title</label>
                      <Input placeholder="Enter stream title..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Event Category</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="party">Party</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate</option>
                        <option value="birthday">Birthday</option>
                        <option value="concert">Concert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea placeholder="Describe your event..." rows={3} />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex space-x-4">
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4 mr-2" />
                        Test Audio
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Test Camera
                      </Button>
                    </div>
                    <Button 
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => startStreamMutation.mutate({
                        eventId: "event-new",
                        title: "My Live Party",
                        description: "Join my amazing party live!",
                        settings: streamSettings
                      })}
                    >
                      <Radio className="h-4 w-4 mr-2" />
                      Go Live
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stream Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Stream Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Private Stream</label>
                      <Switch 
                        checked={streamSettings.isPrivate}
                        onCheckedChange={(checked) => 
                          setStreamSettings(prev => ({ ...prev, isPrivate: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Recording</label>
                      <Switch 
                        checked={streamSettings.recording}
                        onCheckedChange={(checked) => 
                          setStreamSettings(prev => ({ ...prev, recording: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Allow Interactions</label>
                      <Switch 
                        checked={streamSettings.interactions}
                        onCheckedChange={(checked) => 
                          setStreamSettings(prev => ({ ...prev, interactions: checked }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Stream Quality</label>
                      <select 
                        value={streamSettings.quality}
                        onChange={(e) => setStreamSettings(prev => ({ ...prev, quality: e.target.value }))}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="auto">Auto</option>
                        <option value="1080p">1080p HD</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Stream Platforms</label>
                      <div className="space-y-2">
                        {['vibes', 'youtube', 'instagram', 'twitch'].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id={platform}
                              checked={streamSettings.platforms.includes(platform)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStreamSettings(prev => ({ 
                                    ...prev, 
                                    platforms: [...prev.platforms, platform] 
                                  }));
                                } else {
                                  setStreamSettings(prev => ({ 
                                    ...prev, 
                                    platforms: prev.platforms.filter(p => p !== platform) 
                                  }));
                                }
                              }}
                            />
                            <label htmlFor={platform} className="text-sm capitalize">{platform}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Watch Party Tab */}
          <TabsContent value="viewer" className="space-y-6">
            {selectedStream ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* Video Player */}
                <Card className="lg:col-span-3">
                  <CardContent className="p-0">
                    <div className="relative bg-gray-900 rounded-t-lg">
                      <div className="aspect-video flex items-center justify-center text-white">
                        <div className="text-center">
                          <Play className="h-24 w-24 mx-auto mb-4 opacity-50" />
                          <p className="text-xl font-medium">Live Stream Player</p>
                          <p className="opacity-75">Video stream would appear here</p>
                        </div>
                      </div>
                      
                      {/* Player Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center space-x-4">
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                              <Volume2 className="h-4 w-4" />
                            </Button>
                            <div className="w-24">
                              <Slider
                                value={volume}
                                onValueChange={setVolume}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-red-500">
                              <Radio className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>
                            <span className="text-sm">247 viewers</span>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                              <Maximize className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stream Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatars/sarah.jpg" />
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-xl font-bold">Epic Birthday Party Live!</h2>
                            <p className="text-gray-600">Sarah Johnson • 247 viewers</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat & Interactions */}
                <Card className="h-fit">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Live Chat</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
                        {showChat ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {showChat && (
                    <CardContent className="space-y-4">
                      {/* Chat Messages */}
                      <ScrollArea className="h-64 w-full pr-4">
                        <div className="space-y-3">
                          {comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={comment.userAvatar} />
                                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium">{comment.userName}</span>
                                  {comment.type !== 'comment' && (
                                    <Badge size="sm" variant="outline">
                                      {getCheerIcon(comment.metadata?.cheerType || comment.type)}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Chat Input */}
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <Input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Say something..."
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && newComment.trim()) {
                                sendCommentMutation.mutate({
                                  streamId: selectedStream,
                                  content: newComment,
                                  type: 'comment'
                                });
                              }
                            }}
                          />
                          <Button size="sm" onClick={() => {
                            if (newComment.trim()) {
                              sendCommentMutation.mutate({
                                streamId: selectedStream,
                                content: newComment,
                                type: 'comment'
                              });
                            }
                          }}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Cheers */}
                        <div>
                          <p className="text-sm font-medium mb-2">Send Cheers</p>
                          <div className="grid grid-cols-3 gap-2">
                            {cheers.slice(0, 6).map((cheer) => (
                              <Button
                                key={cheer.id}
                                variant="outline"
                                size="sm"
                                className="flex flex-col p-2 h-auto"
                                onClick={() => sendCheerMutation.mutate({
                                  streamId: selectedStream,
                                  cheerType: cheer.type
                                })}
                              >
                                <span className="text-lg">{cheer.icon}</span>
                                <span className="text-xs">{cheer.cost}</span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Song Requests */}
                        <div>
                          <p className="text-sm font-medium mb-2">Request Song</p>
                          <div className="flex space-x-2">
                            <Input
                              value={newRequest}
                              onChange={(e) => setNewRequest(e.target.value)}
                              placeholder="Song title or artist..."
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => {
                              if (newRequest.trim()) {
                                sendRequestMutation.mutate({
                                  streamId: selectedStream,
                                  type: 'song',
                                  content: newRequest
                                });
                              }
                            }}>
                              <Music className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            ) : (
              <div className="text-center py-16">
                <Video className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Stream Selected</h3>
                <p className="text-gray-600 mb-6">Choose a live stream from the Live Streams tab to start watching</p>
                <Button onClick={() => setActiveTab("live")}>
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Live Streams
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Key Metrics */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Viewers</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-gray-600 ml-1">vs last stream</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Peak Viewers</p>
                      <p className="text-2xl font-bold">350</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-gray-600">at 8:45 PM</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-purple-500 mr-1" />
                    <span className="text-gray-600">423 interactions</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Watch Time</p>
                      <p className="text-2xl font-bold">31m</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500">Above average</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Viewer Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="h-16 w-16 mx-auto mb-2" />
                        <p>Viewer activity chart would appear here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { platform: 'Vibes App', viewers: 156, percentage: 63 },
                      { platform: 'YouTube', viewers: 89, percentage: 36 },
                      { platform: 'Instagram', viewers: 2, percentage: 1 }
                    ].map((item) => (
                      <div key={item.platform} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.platform}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{item.viewers}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Stream Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Notifications</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-join audio</label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Save recordings</label>
                <Switch defaultChecked />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Default quality</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="auto">Auto</option>
                  <option value="1080p">1080p</option>
                  <option value="720p">720p</option>
                  <option value="480p">480p</option>
                </select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}