import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { 
  Music, Play, Pause, SkipForward, SkipBack, Volume2, 
  Shuffle, Repeat, Heart, Download, Share2, Sparkles,
  Clock, Users, Mic2, Radio, Headphones, Speaker,
  TrendingUp, Zap, Star, Plus, X, Settings
} from "lucide-react";

export default function EventSoundtrackGenerator() {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [generationMode, setGenerationMode] = useState("ai-smart");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [playlistSettings, setPlaylistSettings] = useState({
    duration: 180, // minutes
    energy: 75,
    danceability: 80,
    mood: "upbeat",
    explicit: false,
    genres: [],
    customPrompt: ""
  });

  const queryClient = useQueryClient();

  // Fetch user events
  const { data: userEventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events/user"],
  });

  // Fetch generated soundtracks
  const { data: soundtracksData, isLoading: soundtracksLoading } = useQuery({
    queryKey: ["/api/soundtracks"],
  });

  // Ensure data is properly typed as arrays
  const userEvents = Array.isArray(userEventsData) ? userEventsData : [];
  const soundtracks = Array.isArray(soundtracksData) ? soundtracksData : [];

  // Generate soundtrack mutation
  const generateSoundtrack = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/soundtracks/generate", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/soundtracks"] });
    },
  });

  // AI Music recommendation mutation
  const getAIRecommendations = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/soundtracks/ai-recommend", { prompt });
      return response.json();
    },
  });

  const handleGenerateSoundtrack = () => {
    if (!selectedEventId) return;

    generateSoundtrack.mutate({
      eventId: selectedEventId,
      mode: generationMode,
      settings: playlistSettings
    });
  };

  const playTrack = (track: any) => {
    setCurrentlyPlaying(track);
    // Simulate playing
  };

  const pauseTrack = () => {
    setCurrentlyPlaying(null);
  };

  const availableGenres = [
    "Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "Classical", 
    "Country", "R&B", "Reggae", "Latin", "Funk", "Disco",
    "House", "Techno", "Ambient", "Indie", "Alternative", "Blues"
  ];

  const moodPresets = [
    { id: "energetic", name: "High Energy Party", energy: 90, danceability: 95, icon: "⚡" },
    { id: "chill", name: "Chill Vibes", energy: 40, danceability: 50, icon: "🌊" },
    { id: "romantic", name: "Romantic Evening", energy: 60, danceability: 70, icon: "💕" },
    { id: "sophisticated", name: "Sophisticated Gathering", energy: 65, danceability: 60, icon: "🎩" },
    { id: "festival", name: "Festival Atmosphere", energy: 95, danceability: 90, icon: "🎪" },
    { id: "corporate", name: "Professional Event", energy: 55, danceability: 40, icon: "💼" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white">
              <Music className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Soundtrack Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create personalized music playlists powered by AI that perfectly match your event's vibe and atmosphere
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Generation Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Generate Soundtrack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Selection */}
                <div className="space-y-2">
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event..." />
                    </SelectTrigger>
                    <SelectContent>
                      {userEvents.map((event: any) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generation Mode */}
                <div className="space-y-2">
                  <Label>Generation Mode</Label>
                  <Select value={generationMode} onValueChange={setGenerationMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai-smart">🤖 AI Smart Mix</SelectItem>
                      <SelectItem value="mood-based">🎭 Mood Based</SelectItem>
                      <SelectItem value="genre-focused">🎵 Genre Focused</SelectItem>
                      <SelectItem value="crowd-pleaser">👥 Crowd Pleaser</SelectItem>
                      <SelectItem value="custom">⚙️ Custom Settings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood Presets */}
                <div className="space-y-2">
                  <Label>Quick Mood Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {moodPresets.map((preset) => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 text-xs"
                        onClick={() => {
                          setPlaylistSettings(prev => ({
                            ...prev,
                            energy: preset.energy,
                            danceability: preset.danceability,
                            mood: preset.id
                          }));
                        }}
                      >
                        <span className="mr-1">{preset.icon}</span>
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="w-full justify-between"
                >
                  <span>Advanced Settings</span>
                  <Settings className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {showAdvancedSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 border-t pt-4"
                    >
                      {/* Duration */}
                      <div className="space-y-2">
                        <Label>Playlist Duration: {playlistSettings.duration} minutes</Label>
                        <Slider
                          value={[playlistSettings.duration]}
                          onValueChange={([value]) => 
                            setPlaylistSettings(prev => ({ ...prev, duration: value }))
                          }
                          min={30}
                          max={480}
                          step={15}
                          className="w-full"
                        />
                      </div>

                      {/* Energy Level */}
                      <div className="space-y-2">
                        <Label>Energy Level: {playlistSettings.energy}%</Label>
                        <Slider
                          value={[playlistSettings.energy]}
                          onValueChange={([value]) => 
                            setPlaylistSettings(prev => ({ ...prev, energy: value }))
                          }
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      {/* Danceability */}
                      <div className="space-y-2">
                        <Label>Danceability: {playlistSettings.danceability}%</Label>
                        <Slider
                          value={[playlistSettings.danceability]}
                          onValueChange={([value]) => 
                            setPlaylistSettings(prev => ({ ...prev, danceability: value }))
                          }
                          min={0}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      {/* Genre Selection */}
                      <div className="space-y-2">
                        <Label>Preferred Genres</Label>
                        <div className="flex flex-wrap gap-1">
                          {availableGenres.map((genre) => (
                            <Badge
                              key={genre}
                              variant={playlistSettings.genres.includes(genre) ? "default" : "outline"}
                              className="cursor-pointer text-xs"
                              onClick={() => {
                                setPlaylistSettings(prev => ({
                                  ...prev,
                                  genres: prev.genres.includes(genre)
                                    ? prev.genres.filter(g => g !== genre)
                                    : [...prev.genres, genre]
                                }));
                              }}
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Custom AI Prompt */}
                      <div className="space-y-2">
                        <Label>Custom AI Prompt</Label>
                        <Textarea
                          placeholder="Describe the vibe you want... e.g., 'upbeat songs for a summer rooftop party with young professionals'"
                          value={playlistSettings.customPrompt}
                          onChange={(e) => 
                            setPlaylistSettings(prev => ({ ...prev, customPrompt: e.target.value }))
                          }
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateSoundtrack}
                  disabled={!selectedEventId || generateSoundtrack.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {generateSoundtrack.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Soundtrack
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  AI Music Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ask AI for music recommendations... e.g., 'What songs would work for a corporate networking event?'"
                  className="resize-none"
                  rows={3}
                />
                <Button
                  onClick={() => getAIRecommendations.mutate("sample prompt")}
                  disabled={getAIRecommendations.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <Mic2 className="h-4 w-4 mr-2" />
                  Get AI Suggestions
                </Button>
                
                {getAIRecommendations.data && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {getAIRecommendations.data.recommendation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Soundtracks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-green-600" />
                  Generated Soundtracks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {soundtracksLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent" />
                  </div>
                ) : soundtracks.length === 0 ? (
                  <div className="text-center py-16">
                    <Music className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Soundtracks Yet</h3>
                    <p className="text-gray-500">Generate your first AI-powered soundtrack to get started!</p>
                  </div>
                ) : (
                  <Tabs defaultValue="latest" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="latest">Latest</TabsTrigger>
                      <TabsTrigger value="favorites">Favorites</TabsTrigger>
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="latest" className="space-y-4">
                      {soundtracks.map((soundtrack: any, index: number) => (
                        <motion.div
                          key={soundtrack.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{soundtrack.title}</h3>
                              <p className="text-sm text-gray-500">
                                {soundtrack.duration} min • {soundtrack.trackCount} tracks
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {soundtrack.mood}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Track List */}
                          <div className="space-y-2">
                            {soundtrack.tracks?.slice(0, 5).map((track: any, trackIndex: number) => (
                              <div
                                key={trackIndex}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                              >
                                <div className="flex items-center gap-3">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => currentlyPlaying?.id === track.id ? pauseTrack() : playTrack(track)}
                                  >
                                    {currentlyPlaying?.id === track.id ? (
                                      <Pause className="h-3 w-3" />
                                    ) : (
                                      <Play className="h-3 w-3" />
                                    )}
                                  </Button>
                                  <div>
                                    <p className="text-sm font-medium">{track.title}</p>
                                    <p className="text-xs text-gray-500">{track.artist}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">{track.duration}</span>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Heart className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                            {soundtrack.tracks?.length > 5 && (
                              <p className="text-xs text-gray-500 text-center py-2">
                                +{soundtrack.tracks.length - 5} more tracks
                              </p>
                            )}
                          </div>

                          {/* Soundtrack Stats */}
                          <div className="mt-4 pt-3 border-t flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Energy: {soundtrack.energy}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Danceability: {soundtrack.danceability}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Created: {new Date(soundtrack.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="favorites">
                      <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No favorite soundtracks yet</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="trending">
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Trending soundtracks coming soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Music Player Bar */}
        <AnimatePresence>
          {currentlyPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50"
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                    <Music className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{currentlyPlaying.title}</p>
                    <p className="text-sm text-gray-500">{currentlyPlaying.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button size="sm" variant="ghost">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={pauseTrack}>
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Repeat className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}