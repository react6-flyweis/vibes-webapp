import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Camera, Video, Smile, Heart, ThumbsUp, Flame, Star, Zap, 
  TrendingUp, Laugh, Trophy, Send, PlayCircle, PauseCircle,
  Volume2, VolumeX, Filter, Grid, Users, Clock, Eye,
  Share2, Download, Flag, MoreVertical, RefreshCw,
  Sparkles, Crown, Award, Target, MessageCircle
} from "lucide-react";

interface Reaction {
  id: string;
  type: "emoji" | "selfie" | "video";
  content: string; // emoji character, image URL, or video URL
  author: {
    id: string;
    name: string;
    avatar: string;
    tier?: "vip" | "premium" | "general";
  };
  timestamp: string;
  eventId: string;
  likes: number;
  isLiked: boolean;
  tags: string[];
  mood: "excited" | "happy" | "energetic" | "chill" | "wild";
  priority: "trending" | "funny" | "hyped" | "normal";
  viewCount: number;
  duration?: number; // for videos in seconds
  caption?: string;
  location?: string;
  musicTrack?: string;
  filters?: string[];
}

interface WallDisplay {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
  currentFilter: "trending" | "funniest" | "most-hyped" | "newest" | "vip-only";
  displayedReactions: Reaction[];
  lastUpdated: string;
  viewerCount: number;
  engagement: {
    totalReactions: number;
    avgLikes: number;
    topMood: string;
  };
}

export default function LiveReactionWalls() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Core state
  const [selectedWall, setSelectedWall] = useState<WallDisplay | null>(null);
  const [activeFilter, setActiveFilter] = useState<"trending" | "funniest" | "most-hyped" | "newest" | "vip-only">("trending");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [cameraMode, setCameraMode] = useState<"photo" | "video">("photo");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [reactionCaption, setReactionCaption] = useState("");

  // UI state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showWallView, setShowWallView] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(null);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<Record<string, boolean>>({});

  // Data queries
  const { data: walls = [], refetch: refetchWalls } = useQuery({
    queryKey: ["/api/reaction-walls"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const { data: reactions = [], refetch: refetchReactions } = useQuery({
    queryKey: ["/api/reactions", selectedWall?.id, activeFilter],
    enabled: !!selectedWall,
    refetchInterval: 2000, // Real-time updates
  });

  const { data: myReactions = [] } = useQuery({
    queryKey: ["/api/reactions/my-reactions"],
  });

  // Mutations
  const postEmojiMutation = useMutation({
    mutationFn: async (data: { emoji: string; eventId: string; caption?: string }) => {
      return await apiRequest("/api/reactions/emoji", "POST", data);
    },
    onSuccess: () => {
      refetchReactions();
      refetchWalls();
      toast({
        title: "Emoji Posted!",
        description: "Your reaction is now live on the wall",
      });
      setSelectedEmoji("");
      setReactionCaption("");
    },
    onError: (error) => {
      console.error("Error posting emoji:", error);
      toast({
        title: "Failed to Post",
        description: "Could not post your emoji reaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const postSelfieMutation = useMutation({
    mutationFn: async (data: { imageData: string; eventId: string; caption?: string; filters?: string[] }) => {
      return await apiRequest("/api/reactions/selfie", "POST", data);
    },
    onSuccess: () => {
      refetchReactions();
      refetchWalls();
      toast({
        title: "Selfie Posted!",
        description: "Your photo is now showing on the party wall",
      });
      setReactionCaption("");
    },
    onError: (error) => {
      console.error("Error posting selfie:", error);
      toast({
        title: "Failed to Post Selfie",
        description: "Could not post your photo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const postVideoMutation = useMutation({
    mutationFn: async (data: { videoData: string; eventId: string; caption?: string; duration: number }) => {
      return await apiRequest("/api/reactions/video", "POST", data);
    },
    onSuccess: () => {
      refetchReactions();
      refetchWalls();
      toast({
        title: "Video Posted!",
        description: "Your 6-second moment is now live",
      });
      setReactionCaption("");
    },
    onError: (error) => {
      console.error("Error posting video:", error);
      toast({
        title: "Failed to Post Video",
        description: "Could not post your video. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likeReactionMutation = useMutation({
    mutationFn: async (reactionId: string) => {
      return await apiRequest(`/api/reactions/${reactionId}/like`, "POST");
    },
    onSuccess: () => {
      refetchReactions();
    },
    onError: (error) => {
      console.error("Error liking reaction:", error);
      toast({
        title: "Failed to Like",
        description: "Could not like this reaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Sample data
  const sampleWalls: WallDisplay[] = [
    {
      id: "wall-main-stage",
      name: "Main Stage Wall",
      location: "Dance Floor",
      isActive: true,
      currentFilter: "trending",
      displayedReactions: [],
      lastUpdated: "2025-07-01T13:47:00Z",
      viewerCount: 127,
      engagement: {
        totalReactions: 342,
        avgLikes: 8.5,
        topMood: "energetic",
      },
    },
    {
      id: "wall-vip-lounge",
      name: "VIP Lounge Wall",
      location: "VIP Area",
      isActive: true,
      currentFilter: "most-hyped",
      displayedReactions: [],
      lastUpdated: "2025-07-01T13:46:30Z",
      viewerCount: 45,
      engagement: {
        totalReactions: 89,
        avgLikes: 12.3,
        topMood: "excited",
      },
    },
    {
      id: "wall-bar-area",
      name: "Bar Vibes Wall",
      location: "Bar & Cocktails",
      isActive: true,
      currentFilter: "funniest",
      displayedReactions: [],
      lastUpdated: "2025-07-01T13:45:15Z",
      viewerCount: 78,
      engagement: {
        totalReactions: 156,
        avgLikes: 6.2,
        topMood: "happy",
      },
    },
  ];

  const sampleReactions: Reaction[] = [
    {
      id: "reaction-1",
      type: "emoji",
      content: "🔥",
      author: {
        id: "user-1",
        name: "DJ Mike",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        tier: "vip",
      },
      timestamp: "2025-07-01T13:47:00Z",
      eventId: "event-1",
      likes: 23,
      isLiked: false,
      tags: ["energy", "music"],
      mood: "energetic",
      priority: "trending",
      viewCount: 89,
      caption: "This beat is INSANE! 🎵",
    },
    {
      id: "reaction-2",
      type: "selfie",
      content: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400",
      author: {
        id: "user-2",
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b45d0dfc?w=150",
        tier: "premium",
      },
      timestamp: "2025-07-01T13:46:45Z",
      eventId: "event-1",
      likes: 18,
      isLiked: true,
      tags: ["selfie", "friends"],
      mood: "happy",
      priority: "funny",
      viewCount: 56,
      caption: "Squad goals! 💃✨",
      filters: ["retro", "neon"],
    },
    {
      id: "reaction-3",
      type: "video",
      content: "https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4",
      author: {
        id: "user-3",
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        tier: "general",
      },
      timestamp: "2025-07-01T13:46:20Z",
      eventId: "event-1",
      likes: 31,
      isLiked: false,
      tags: ["dance", "moves"],
      mood: "wild",
      priority: "hyped",
      viewCount: 112,
      duration: 6,
      caption: "Watch me break it down! 🕺",
      musicTrack: "Party Anthem - DJ Beats",
    },
  ];

  const popularEmojis = [
    "🔥", "💃", "🎉", "🎵", "✨", "🚀", "⚡", "💫",
    "🎊", "🥳", "😍", "🤩", "💯", "🙌", "👏", "💪",
    "🎭", "🎪", "🎨", "🎯", "🎸", "🎤", "🎺", "🥂"
  ];

  const filterOptions = [
    { value: "trending", label: "🔥 Trending", icon: TrendingUp },
    { value: "funniest", label: "😂 Funniest", icon: Laugh },
    { value: "most-hyped", label: "⚡ Most Hyped", icon: Zap },
    { value: "newest", label: "🕐 Newest", icon: Clock },
    { value: "vip-only", label: "👑 VIP Only", icon: Crown },
  ];

  const moodColors = {
    excited: "bg-orange-500",
    happy: "bg-yellow-500",
    energetic: "bg-red-500",
    chill: "bg-blue-500",
    wild: "bg-purple-500",
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: cameraMode === "video" 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        postSelfieMutation.mutate({
          imageData,
          eventId: selectedWall?.id || "event-1",
          caption: reactionCaption,
          filters: ["party-filter"],
        });
        
        stopCamera();
        setShowCreateDialog(false);
      }
    }
  };

  const startVideoRecording = () => {
    setIsRecording(true);
    setRecordingProgress(0);
    
    // Simulate 6-second recording
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRecording(false);
          finishVideoRecording();
          return 100;
        }
        return prev + (100 / 60); // 60 updates over 6 seconds
      });
    }, 100);
  };

  const finishVideoRecording = () => {
    // In a real implementation, this would process the recorded video
    const mockVideoData = "data:video/mp4;base64,mock-video-data";
    
    postVideoMutation.mutate({
      videoData: mockVideoData,
      eventId: selectedWall?.id || "event-1",
      caption: reactionCaption,
      duration: 6,
    });
    
    stopCamera();
    setShowCreateDialog(false);
    setRecordingProgress(0);
  };

  const handleEmojiPost = () => {
    if (!selectedEmoji) {
      toast({
        title: "Select an Emoji",
        description: "Please choose an emoji to post",
        variant: "destructive",
      });
      return;
    }

    postEmojiMutation.mutate({
      emoji: selectedEmoji,
      eventId: selectedWall?.id || "event-1",
      caption: reactionCaption,
    });
  };

  const handleLikeReaction = (reactionId: string) => {
    likeReactionMutation.mutate(reactionId);
  };

  const toggleVideoPlay = (reactionId: string) => {
    setIsPlaying(prev => ({ ...prev, [reactionId]: !prev[reactionId] }));
  };

  const toggleVideoMute = (reactionId: string) => {
    setIsMuted(prev => ({ ...prev, [reactionId]: !prev[reactionId] }));
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      trending: { label: "🔥 Trending", className: "bg-red-100 text-red-800" },
      funny: { label: "😂 Funny", className: "bg-yellow-100 text-yellow-800" },
      hyped: { label: "⚡ Hyped", className: "bg-purple-100 text-purple-800" },
      normal: { label: "", className: "" },
    };
    return badges[priority as keyof typeof badges] || badges.normal;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  useEffect(() => {
    if (showCreateDialog && cameraMode) {
      startCamera();
    }
    return () => stopCamera();
  }, [showCreateDialog, cameraMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Live Reaction Walls
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Share your energy with emojis, selfies, and 6-second video bursts
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">342</div>
              <div className="text-sm text-gray-500">Live Reactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">127</div>
              <div className="text-sm text-gray-500">Viewers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">8.5</div>
              <div className="text-sm text-gray-500">Avg Likes</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wall Selection & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Active Walls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid className="w-5 h-5" />
                  Live Walls
                </CardTitle>
                <CardDescription>Choose a wall to view and interact with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleWalls.map((wall) => (
                  <Card 
                    key={wall.id}
                    className={`cursor-pointer transition-all ${
                      selectedWall?.id === wall.id 
                        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedWall(wall)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{wall.name}</h3>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <Badge variant="outline" className="text-xs">LIVE</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        📍 {wall.location}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {wall.viewerCount} viewers
                        </span>
                        <span>{wall.engagement.totalReactions} reactions</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick React</CardTitle>
                <CardDescription>Share your vibe instantly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Popular Emojis */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Popular Reactions</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {popularEmojis.slice(0, 12).map((emoji) => (
                      <Button
                        key={emoji}
                        variant={selectedEmoji === emoji ? "default" : "outline"}
                        size="sm"
                        className="text-lg p-2 h-10"
                        onClick={() => setSelectedEmoji(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Add a caption... (optional)"
                  value={reactionCaption}
                  onChange={(e) => setReactionCaption(e.target.value)}
                  rows={2}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleEmojiPost}
                    disabled={!selectedEmoji || postEmojiMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {postEmojiMutation.isPending ? "Posting..." : "Post Emoji"}
                  </Button>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Camera
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Reaction</DialogTitle>
                        <DialogDescription>
                          Take a selfie or record a 6-second video
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <Tabs value={cameraMode} onValueChange={(value: any) => setCameraMode(value)}>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="photo">📸 Selfie</TabsTrigger>
                            <TabsTrigger value="video">🎥 Video</TabsTrigger>
                          </TabsList>
                        </Tabs>

                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {isRecording && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                              <div className="text-center">
                                <div className="text-white font-bold text-lg mb-2">RECORDING</div>
                                <Progress value={recordingProgress} className="w-32" />
                                <div className="text-white text-sm mt-1">
                                  {Math.ceil((6 - (recordingProgress / 100) * 6))}s left
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <Textarea
                          placeholder="Add a caption..."
                          value={reactionCaption}
                          onChange={(e) => setReactionCaption(e.target.value)}
                          rows={2}
                        />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        {cameraMode === "photo" ? (
                          <Button 
                            onClick={capturePhoto}
                            disabled={postSelfieMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            {postSelfieMutation.isPending ? "Posting..." : "Take Photo"}
                          </Button>
                        ) : (
                          <Button 
                            onClick={startVideoRecording}
                            disabled={isRecording || postVideoMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isRecording ? "Recording..." : "Record 6s"}
                          </Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Wall Display */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {selectedWall?.name || "Select a Wall"}
                    </CardTitle>
                    {selectedWall && (
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {selectedWall.viewerCount} viewers
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-4 h-4" />
                          {formatTimeAgo(selectedWall.lastUpdated)}
                        </span>
                      </CardDescription>
                    )}
                  </div>
                  
                  {selectedWall && (
                    <Select value={activeFilter} onValueChange={(value: any) => setActiveFilter(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {selectedWall ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                    {sampleReactions.map((reaction) => (
                      <Card key={reaction.id} className="relative group hover:shadow-lg transition-all">
                        <CardContent className="p-3">
                          {/* Reaction Content */}
                          <div className="aspect-square mb-3 relative">
                            {reaction.type === "emoji" && (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                                <span className="text-6xl">{reaction.content}</span>
                              </div>
                            )}
                            
                            {reaction.type === "selfie" && (
                              <img 
                                src={reaction.content} 
                                alt="Selfie reaction"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                            
                            {reaction.type === "video" && (
                              <div className="relative w-full h-full">
                                <video
                                  src={reaction.content}
                                  className="w-full h-full object-cover rounded-lg"
                                  loop
                                  muted={isMuted[reaction.id]}
                                  autoPlay={isPlaying[reaction.id]}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-80 hover:opacity-100"
                                    onClick={() => toggleVideoPlay(reaction.id)}
                                  >
                                    {isPlaying[reaction.id] ? (
                                      <PauseCircle className="w-6 h-6" />
                                    ) : (
                                      <PlayCircle className="w-6 h-6" />
                                    )}
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                                  onClick={() => toggleVideoMute(reaction.id)}
                                >
                                  {isMuted[reaction.id] ? (
                                    <VolumeX className="w-4 h-4" />
                                  ) : (
                                    <Volume2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            )}

                            {/* Priority Badge */}
                            {reaction.priority !== "normal" && (
                              <Badge 
                                className={`absolute top-2 left-2 ${getPriorityBadge(reaction.priority).className}`}
                              >
                                {getPriorityBadge(reaction.priority).label}
                              </Badge>
                            )}

                            {/* Mood Indicator */}
                            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${moodColors[reaction.mood]}`} />
                          </div>

                          {/* Author Info */}
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reaction.author.avatar} alt={reaction.author.name} />
                              <AvatarFallback>{reaction.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium truncate">{reaction.author.name}</span>
                                {reaction.author.tier === "vip" && <Crown className="w-3 h-3 text-yellow-500" />}
                                {reaction.author.tier === "premium" && <Star className="w-3 h-3 text-purple-500" />}
                              </div>
                            </div>
                          </div>

                          {/* Caption */}
                          {reaction.caption && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {reaction.caption}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLikeReaction(reaction.id)}
                              className={`p-1 ${reaction.isLiked ? "text-red-500" : ""}`}
                            >
                              <Heart className={`w-4 h-4 mr-1 ${reaction.isLiked ? "fill-current" : ""}`} />
                              {reaction.likes}
                            </Button>
                            
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" className="p-1">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <span className="text-xs text-gray-500">{reaction.viewCount}</span>
                            </div>
                          </div>

                          {/* Timestamp */}
                          <div className="text-xs text-gray-400 mt-1">
                            {formatTimeAgo(reaction.timestamp)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Select a Wall to View
                    </h3>
                    <p className="text-gray-500">
                      Choose from the active walls to see live reactions and join the fun
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}