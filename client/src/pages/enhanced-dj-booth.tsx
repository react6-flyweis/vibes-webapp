import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Mic,
  Radio,
  Users,
  Heart,
  Star,
  Send,
  Download,
  Upload,
  Disc3,
  Headphones,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  bpm: number;
  genre: string;
  energy: number;
  votes: number;
  requestedBy?: string;
  timeRequested?: string;
}

interface DJRequest {
  id: string;
  track: Track;
  requesterName: string;
  message?: string;
  votes: number;
  timestamp: string;
  status: 'pending' | 'approved' | 'played' | 'declined';
}

interface DJStats {
  totalTracks: number;
  totalRequests: number;
  averageRating: number;
  currentListeners: number;
  peakListeners: number;
  setDuration: number;
}

export default function EnhancedDJBooth() {
  const [djMode, setDjMode] = useState<'guest' | 'dj'>('guest');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [djRating, setDjRating] = useState(0);
  const [autoMix, setAutoMix] = useState(true);
  const [crossfadeTime, setCrossfadeTime] = useState([3]);
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current playlist and requests
  const { data: playlist } = useQuery({
    queryKey: ['/api/dj/playlist'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: requests } = useQuery({
    queryKey: ['/api/dj/requests'],
    refetchInterval: 2000, // Update every 2 seconds
  });

  const { data: djStats } = useQuery({
    queryKey: ['/api/dj/stats'],
    refetchInterval: 10000, // Update every 10 seconds
  });

  // Mock data for demonstration
  const mockCurrentTrack: Track = {
    id: "1",
    title: "Summer Nights",
    artist: "DJ Phoenix",
    duration: 240,
    bpm: 128,
    genre: "Progressive House",
    energy: 8,
    votes: 42
  };

  const mockRequests: DJRequest[] = [
    {
      id: "1",
      track: {
        id: "2",
        title: "Dancing Queen",
        artist: "ABBA",
        duration: 231,
        bpm: 100,
        genre: "Pop",
        energy: 9,
        votes: 15
      },
      requesterName: "Sarah",
      message: "Perfect for the dance floor!",
      votes: 15,
      timestamp: "2 minutes ago",
      status: "pending"
    },
    {
      id: "2",
      track: {
        id: "3",
        title: "Levels",
        artist: "Avicii",
        duration: 203,
        bpm: 126,
        genre: "EDM",
        energy: 10,
        votes: 23
      },
      requesterName: "Mike",
      votes: 23,
      timestamp: "5 minutes ago",
      status: "approved"
    }
  ];

  const mockStats: DJStats = {
    totalTracks: 847,
    totalRequests: 156,
    averageRating: 4.8,
    currentListeners: 89,
    peakListeners: 127,
    setDuration: 180
  };

  // Mutations for DJ actions
  const playTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      return await apiRequest("POST", "/api/dj/play", { trackId });
    },
    onSuccess: () => {
      setIsPlaying(true);
      toast({ title: "Track playing", description: "Now playing your selected track" });
    }
  });

  const requestTrackMutation = useMutation({
    mutationFn: async (data: { trackId: string; message?: string }) => {
      return await apiRequest("POST", "/api/dj/request", data);
    },
    onSuccess: () => {
      toast({ title: "Request sent!", description: "Your track request has been sent to the DJ" });
      setRequestMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/dj/requests'] });
    }
  });

  const voteForRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return await apiRequest("POST", "/api/dj/vote", { requestId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dj/requests'] });
    }
  });

  const rateDJMutation = useMutation({
    mutationFn: async (rating: number) => {
      return await apiRequest("POST", "/api/dj/rate", { rating });
    },
    onSuccess: () => {
      toast({ title: "Rating submitted", description: "Thank you for rating the DJ!" });
    }
  });

  useEffect(() => {
    setCurrentTrack(mockCurrentTrack);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 8) return "text-red-500";
    if (energy >= 6) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">DJ Booth</h1>
              <p className="text-blue-200">Live music experience with real-time interaction</p>
            </div>
            <div className="flex gap-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                <Radio className="w-4 h-4 mr-2" />
                Live
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                <Users className="w-4 h-4 mr-2" />
                {mockStats.currentListeners} listening
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="player" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20">
            <TabsTrigger value="player" className="data-[state=active]:bg-purple-600">Player</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-purple-600">Requests</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">Settings</TabsTrigger>
          </TabsList>

          {/* Main Player Tab */}
          <TabsContent value="player" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Track Display */}
              <Card className="lg:col-span-2 bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Disc3 className="mr-2 h-6 w-6 animate-spin" />
                    Now Playing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentTrack && (
                    <>
                      <div className="text-center space-y-4">
                        <div className="w-32 h-32 bg-linear-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                          <Music className="h-16 w-16 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{currentTrack.title}</h3>
                          <p className="text-blue-200">{currentTrack.artist}</p>
                          <div className="flex items-center justify-center gap-4 mt-2">
                            <Badge variant="outline" className="border-purple-400 text-purple-300">
                              {currentTrack.bpm} BPM
                            </Badge>
                            <Badge variant="outline" className="border-blue-400 text-blue-300">
                              {currentTrack.genre}
                            </Badge>
                            <Badge variant="outline" className={`border-current ${getEnergyColor(currentTrack.energy)}`}>
                              Energy: {currentTrack.energy}/10
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <Progress value={(currentTime / currentTrack.duration) * 100} className="h-2" />
                        <div className="flex justify-between text-sm text-blue-200">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(currentTrack.duration)}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                          <SkipBack className="h-6 w-6" />
                        </Button>
                        <Button 
                          size="lg" 
                          className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </Button>
                        <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                          <SkipForward className="h-6 w-6" />
                        </Button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-4">
                        <VolumeX className="h-5 w-5 text-white" />
                        <Slider
                          value={volume}
                          onValueChange={setVolume}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Volume2 className="h-5 w-5 text-white" />
                        <span className="text-white w-12 text-right">{volume[0]}%</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Track Request */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Send className="mr-2 h-5 w-5" />
                      Request Track
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Search for a song..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black/20 border-purple-400/30 text-white"
                    />
                    <Textarea
                      placeholder="Add a message (optional)"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      className="bg-black/20 border-purple-400/30 text-white"
                      rows={3}
                    />
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => requestTrackMutation.mutate({ trackId: "sample", message: requestMessage })}
                      disabled={!searchQuery}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Request
                    </Button>
                  </CardContent>
                </Card>

                {/* DJ Rating */}
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="mr-2 h-5 w-5" />
                      Rate DJ Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="sm"
                          className={`p-1 ${star <= djRating ? 'text-yellow-400' : 'text-gray-400'}`}
                          onClick={() => setDjRating(star)}
                        >
                          <Star className="h-8 w-8 fill-current" />
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => rateDJMutation.mutate(djRating)}
                      disabled={djRating === 0}
                    >
                      Submit Rating
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Music className="mr-2 h-6 w-6" />
                    Track Requests
                  </span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    {mockRequests.length} pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-black/20 rounded-lg border border-purple-400/20">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-white">{request.track.title}</h4>
                          <Badge variant="outline" className={`border-current ${getEnergyColor(request.track.energy)}`}>
                            {request.track.artist}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`border-current ${
                              request.status === 'pending' ? 'text-yellow-400' :
                              request.status === 'approved' ? 'text-green-400' :
                              request.status === 'played' ? 'text-blue-400' : 'text-red-400'
                            }`}
                          >
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-200 mb-2">
                          Requested by {request.requesterName} • {request.timestamp}
                        </p>
                        {request.message && (
                          <p className="text-sm text-gray-300 italic">"{request.message}"</p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-blue-200">{request.track.bpm} BPM</span>
                          <span className="text-sm text-blue-200">{request.track.genre}</span>
                          <span className={`text-sm ${getEnergyColor(request.track.energy)}`}>
                            Energy: {request.track.energy}/10
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-white hover:bg-white/10"
                          onClick={() => voteForRequestMutation.mutate(request.id)}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {request.votes}
                        </Button>
                        {djMode === 'dj' && (
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => playTrackMutation.mutate(request.track.id)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Total Tracks</p>
                      <p className="text-3xl font-bold text-white">{mockStats.totalTracks}</p>
                    </div>
                    <Music className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Requests</p>
                      <p className="text-3xl font-bold text-white">{mockStats.totalRequests}</p>
                    </div>
                    <Send className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Rating</p>
                      <p className="text-3xl font-bold text-white">{mockStats.averageRating}/5</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm">Peak Listeners</p>
                      <p className="text-3xl font-bold text-white">{mockStats.peakListeners}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">DJ Controls</CardTitle>
                  <CardDescription className="text-blue-200">
                    Professional mixing controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Auto Mix</span>
                    <Switch checked={autoMix} onCheckedChange={setAutoMix} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-white">Crossfade Time: {crossfadeTime[0]}s</span>
                    <Slider
                      value={crossfadeTime}
                      onValueChange={setCrossfadeTime}
                      max={10}
                      min={1}
                      step={0.5}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white">Effects</span>
                    <Switch checked={effectsEnabled} onCheckedChange={setEffectsEnabled} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-white">DJ Mode</span>
                    <Select value={djMode} onValueChange={(value: 'guest' | 'dj') => setDjMode(value)}>
                      <SelectTrigger className="bg-black/20 border-purple-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest</SelectItem>
                        <SelectItem value="dj">DJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Export & Import</CardTitle>
                  <CardDescription className="text-blue-200">
                    Manage your music library
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export Playlist
                  </Button>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Tracks
                  </Button>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Eye className="mr-2 h-4 w-4" />
                    Display Mode
                  </Button>

                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Headphones className="mr-2 h-4 w-4" />
                    Audio Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}