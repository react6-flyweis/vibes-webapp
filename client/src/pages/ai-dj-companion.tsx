import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Users,
  TrendingUp,
  Music,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Mic,
  Headphones,
  Radio,
  Activity,
  Target,
  Zap,
  BarChart3,
  Vote,
  Disc3,
  Music2,
  Music3,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  bpm: number;
  energy: number;
  valence: number;
  danceability: number;
  source: "spotify" | "soundcloud" | "local";
  artwork?: string;
  previewUrl?: string;
  votes: {
    up: number;
    down: number;
    userVote?: "up" | "down" | null;
  };
}

interface GuestPreference {
  id: string;
  name: string;
  genres: string[];
  energyLevel: number;
  currentMood: string;
  recentVotes: { trackId: string; vote: "up" | "down" }[];
}

interface CrowdAnalytics {
  averageEnergy: number;
  dominantGenres: string[];
  moodTrend: "rising" | "falling" | "stable";
  engagementScore: number;
  peakTimes: string[];
  requestedTracks: Track[];
}

const mockRequestedTracks: Track[] = [
  {
    id: "1",
    title: "Levitating",
    artist: "Dua Lipa",
    duration: 203,
    bpm: 103,
    energy: 85,
    valence: 90,
    danceability: 85,
    source: "spotify",
    votes: { up: 24, down: 2, userVote: null },
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 200,
    bpm: 171,
    energy: 78,
    valence: 85,
    danceability: 80,
    source: "spotify",
    votes: { up: 19, down: 3, userVote: null },
  },
];

export default function AIDJCompanion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [crossfade, setCrossfade] = useState([50]);
  const [autoMixEnabled, setAutoMixEnabled] = useState(true);
  const [energyTarget, setEnergyTarget] = useState([70]);
  const [selectedPlatform, setSelectedPlatform] = useState<
    "spotify" | "soundcloud" | "local"
  >("spotify");

  // Fetch current DJ session data
  const { data: djSession, isLoading: sessionLoading } = useQuery({
    queryKey: ["/api/dj/session"],
    refetchInterval: 3000, // Real-time updates every 3 seconds
  });

  // Fetch AI suggestions
  const { data: aiSuggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["/api/dj/ai-suggestions"],
    refetchInterval: 5000, // Update suggestions every 5 seconds
  });

  // Fetch crowd analytics
  const { data: crowdAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/dj/crowd-analytics"],
    refetchInterval: 2000, // Real-time crowd data
  });

  // Fetch guest preferences
  const { data: guestPreferences, isLoading: preferencesLoading } = useQuery({
    queryKey: ["/api/dj/guest-preferences"],
    refetchInterval: 10000,
  });

  // Play track mutation
  const playTrackMutation = useMutation({
    mutationFn: async (track: Track) => {
      return apiRequest("POST", "/api/dj/play-track", { track });
    },
    onSuccess: (data) => {
      setCurrentTrack(data.track);
      setIsPlaying(true);
      queryClient.invalidateQueries({ queryKey: ["/api/dj/session"] });
      toast({
        title: "Track Playing",
        description: `Now playing: ${data.track.title} by ${data.track.artist}`,
      });
    },
    onError: () => {
      toast({
        title: "Playback Error",
        description: "Failed to play track. Check your platform connection.",
        variant: "destructive",
      });
    },
  });

  // Vote on track mutation
  const voteTrackMutation = useMutation({
    mutationFn: async ({
      trackId,
      vote,
    }: {
      trackId: string;
      vote: "up" | "down";
    }) => {
      return apiRequest("POST", "/api/dj/vote-track", { trackId, vote });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dj/ai-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dj/crowd-analytics"] });
    },
  });

  // Update DJ preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferences: any) => {
      return apiRequest("POST", "/api/dj/update-preferences", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dj/ai-suggestions"] });
      toast({
        title: "Preferences Updated",
        description: "AI suggestions will adapt to your new settings",
      });
    },
  });

  const handlePlayTrack = (track: Track) => {
    playTrackMutation.mutate(track);
  };

  const handleVote = (trackId: string, vote: "up" | "down") => {
    voteTrackMutation.mutate({ trackId, vote });
  };

  const handleTogglePlayback = () => {
    setIsPlaying(!isPlaying);
    // API call to pause/resume would go here
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return "text-red-500";
    if (energy >= 60) return "text-orange-500";
    if (energy >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "spotify":
        return <Music2 className="h-4 w-4 text-green-500" />;
      case "soundcloud":
        return <Music3 className="h-4 w-4 text-orange-500" />;
      default:
        return <Disc3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-black to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VibeMix AI DJ Companion
          </h1>
          <p className="text-gray-300">
            Data-driven party curation that responds to crowd mood instantly
          </p>
        </div>

        {/* Current Track & Controls */}
        <Card className="mb-8 bg-black/40 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentTrack ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentTrack.artwork && (
                    <img
                      src={currentTrack.artwork}
                      alt="Album artwork"
                      className="w-16 h-16 rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentTrack.title}
                    </h3>
                    <p className="text-gray-400">{currentTrack.artist}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPlatformIcon(currentTrack.source)}
                      <Badge variant="outline">{currentTrack.bpm} BPM</Badge>
                      <Badge
                        variant="outline"
                        className={getEnergyColor(currentTrack.energy)}
                      >
                        {currentTrack.energy}% Energy
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePlayback}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No track currently playing</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="ai-suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="crowd-analytics">Crowd Analytics</TabsTrigger>
            <TabsTrigger value="guest-voting">Guest Voting</TabsTrigger>
            <TabsTrigger value="dj-controls">DJ Controls</TabsTrigger>
          </TabsList>

          {/* AI Suggestions Tab */}
          <TabsContent value="ai-suggestions">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Track Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {suggestionsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-700 rounded mb-2"></div>
                          <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiSuggestions?.data?.suggestions?.map((track: Track) => (
                        <div
                          key={track.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                        >
                          <div className="flex items-center gap-3">
                            {getPlatformIcon(track.source)}
                            <div>
                              <h4 className="font-medium">{track.title}</h4>
                              <p className="text-sm text-gray-400">
                                {track.artist}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {track.bpm} BPM
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getEnergyColor(
                                    track.energy
                                  )}`}
                                >
                                  {track.energy}% Energy
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-sm">
                              <ThumbsUp className="h-3 w-3" />
                              {track.votes.up}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handlePlayTrack(track)}
                              disabled={playTrackMutation.isPending}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Energy Target
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Target Energy Level
                      </label>
                      <Slider
                        value={energyTarget}
                        onValueChange={setEnergyTarget}
                        max={100}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Chill (0%)</span>
                        <span className={getEnergyColor(energyTarget[0])}>
                          Current: {energyTarget[0]}%
                        </span>
                        <span>High Energy (100%)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-Mix Mode</span>
                      <Switch
                        checked={autoMixEnabled}
                        onCheckedChange={setAutoMixEnabled}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Crossfade Duration
                      </label>
                      <Slider
                        value={crossfade}
                        onValueChange={setCrossfade}
                        max={100}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {crossfade[0]}% overlap between tracks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Crowd Analytics Tab */}
          <TabsContent value="crowd-analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-black/40 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Crowd Energy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsLoading ? (
                    <div className="animate-pulse h-20 bg-gray-700 rounded"></div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getEnergyColor(
                            crowdAnalytics?.data?.averageEnergy || 75
                          )}`}
                        >
                          {crowdAnalytics?.data?.averageEnergy || 75}%
                        </div>
                        <p className="text-sm text-gray-400">Average Energy</p>
                      </div>
                      <Progress
                        value={crowdAnalytics?.data?.averageEnergy || 75}
                        className="h-2"
                      />
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          className={`h-4 w-4 ${
                            crowdAnalytics?.data?.moodTrend === "rising"
                              ? "text-green-500"
                              : crowdAnalytics?.data?.moodTrend === "falling"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        />
                        <span className="text-sm capitalize">
                          {crowdAnalytics?.data?.moodTrend || "rising"}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Guest Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">
                        {crowdAnalytics?.data?.engagementScore || 92}%
                      </div>
                      <p className="text-sm text-gray-400">Engagement Score</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Voters</span>
                        <span>{guestPreferences?.data?.length || 47}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Votes</span>
                        <span>{djSession?.data?.totalVotes || 156}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Popular Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(
                      crowdAnalytics?.data?.dominantGenres || [
                        "House",
                        "Techno",
                        "Hip-Hop",
                        "Pop",
                        "Electronic",
                      ]
                    )
                      ?.slice(0, 5)
                      .map((genre: string, index: number) => (
                        <div key={genre} className="flex items-center gap-2">
                          <div className="w-6 text-center text-sm font-bold">
                            #{index + 1}
                          </div>
                          <Badge variant="outline" className="flex-1">
                            {genre}
                          </Badge>
                        </div>
                      )) || (
                      <div className="text-center text-gray-400">
                        <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No genre data yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guest Voting Tab */}
          <TabsContent value="guest-voting">
            <Card className="bg-black/40 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5" />
                  Live Guest Voting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(
                    crowdAnalytics?.data?.requestedTracks || mockRequestedTracks
                  )?.map((track: Track) => (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                    >
                      <div className="flex items-center gap-3">
                        {getPlatformIcon(track.source)}
                        <div>
                          <h4 className="font-medium">{track.title}</h4>
                          <p className="text-sm text-gray-400">
                            {track.artist}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {track.bpm} BPM
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {formatDuration(track.duration)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(track.id, "up")}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {track.votes.up}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(track.id, "down")}
                            className="flex items-center gap-1"
                          >
                            <ThumbsDown className="h-3 w-3" />
                            {track.votes.down}
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handlePlayTrack(track)}
                          disabled={playTrackMutation.isPending}
                        >
                          Queue
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-gray-400 py-8">
                      <Vote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No guest requests yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DJ Controls Tab */}
          <TabsContent value="dj-controls">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Platform Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Music Platform
                      </label>
                      <div className="flex gap-2 mt-2">
                        {["spotify", "soundcloud", "local"].map((platform) => (
                          <Button
                            key={platform}
                            variant={
                              selectedPlatform === platform
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedPlatform(platform as any)}
                            className="flex items-center gap-2"
                          >
                            {getPlatformIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Connection Status</span>
                        <Badge variant="outline" className="text-green-500">
                          Connected
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Mode</span>
                        <Switch checked={true} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Crowd Feedback</span>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Master Volume
                      </label>
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        Crossfade Time
                      </label>
                      <Slider
                        value={crossfade}
                        onValueChange={setCrossfade}
                        max={10}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {crossfade[0]} seconds
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        updatePreferencesMutation.mutate({
                          platform: selectedPlatform,
                          volume: volume[0],
                          crossfade: crossfade[0],
                          energyTarget: energyTarget[0],
                          autoMix: autoMixEnabled,
                        })
                      }
                      disabled={updatePreferencesMutation.isPending}
                      className="w-full"
                    >
                      Save DJ Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
