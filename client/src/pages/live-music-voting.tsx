import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  Heart,
  ThumbsUp,
  Play,
  Pause,
  Volume2,
  Users,
  Clock,
  TrendingUp,
  Search,
  Plus,
  Download,
  Settings,
  Headphones,
  Zap,
  Star,
  Eye,
} from "lucide-react";

interface SongSuggestion {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  suggestedBy: string;
  note: string;
  votes: number;
  hasVoted: boolean;
  reactions: Array<{ emoji: string; count: number }>;
  timestamp: Date;
  source: "spotify" | "apple" | "youtube";
  sourceUrl: string;
  albumArt?: string;
  isPlaying?: boolean;
}

interface DJSettings {
  isLiveMode: boolean;
  maxSuggestionsPerGuest: number;
  requireApproval: boolean;
  autoPlayTopSongs: boolean;
  votingTimeLimit: number;
  themeFilter?: string;
}

interface MusicStats {
  totalSuggestions: number;
  totalVotes: number;
  activeGuests: number;
  currentlyPlaying?: string;
  topGenre: string;
  averageVotesPerSong: number;
}

export default function LiveMusicVoting() {
  const [userRole, setUserRole] = useState<"host" | "guest" | "dj">("guest");
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionNote, setSuggestionNote] = useState("");
  const [selectedSource, setSelectedSource] = useState<
    "spotify" | "apple" | "youtube"
  >("spotify");

  const [djSettings, setDjSettings] = useState<DJSettings>({
    isLiveMode: true,
    maxSuggestionsPerGuest: 3,
    requireApproval: false,
    autoPlayTopSongs: false,
    votingTimeLimit: 30,
    themeFilter: undefined,
  });

  const [musicStats, setMusicStats] = useState<MusicStats>({
    totalSuggestions: 47,
    totalVotes: 234,
    activeGuests: 18,
    currentlyPlaying: "Dancing Queen - ABBA",
    topGenre: "Pop",
    averageVotesPerSong: 5.2,
  });

  const [songSuggestions, setSongSuggestions] = useState<SongSuggestion[]>([
    {
      id: "1",
      title: "Uptown Funk",
      artist: "Mark Ronson ft. Bruno Mars",
      album: "Uptown Special",
      duration: "4:30",
      suggestedBy: "Sarah M.",
      note: "This will get everyone dancing!",
      votes: 23,
      hasVoted: false,
      reactions: [
        { emoji: "🔥", count: 8 },
        { emoji: "🥳", count: 6 },
        { emoji: "💃", count: 4 },
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      source: "spotify",
      sourceUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
      albumArt: "https://via.placeholder.com/60x60/1DB954/ffffff?text=♪",
    },
    {
      id: "2",
      title: "Can't Stop the Feeling!",
      artist: "Justin Timberlake",
      duration: "3:56",
      suggestedBy: "Mike R.",
      note: "Perfect for this vibe",
      votes: 19,
      hasVoted: true,
      reactions: [
        { emoji: "😍", count: 5 },
        { emoji: "🎉", count: 7 },
        { emoji: "👏", count: 3 },
      ],
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      source: "apple",
      sourceUrl: "https://music.apple.com/song/123456",
      albumArt: "https://via.placeholder.com/60x60/000000/ffffff?text=♫",
      isPlaying: true,
    },
    {
      id: "3",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      duration: "2:58",
      suggestedBy: "Emma L.",
      note: "Gen Z energy!",
      votes: 16,
      hasVoted: false,
      reactions: [
        { emoji: "⚡", count: 4 },
        { emoji: "🤘", count: 2 },
      ],
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      source: "youtube",
      sourceUrl: "https://youtube.com/watch?v=123",
      albumArt: "https://via.placeholder.com/60x60/FF0000/ffffff?text=♬",
    },
  ]);

  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      title: string;
      artist: string;
      duration: string;
      source: "spotify" | "apple" | "youtube";
      albumArt: string;
    }>
  >([]);

  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    if (isLiveMode) {
      const interval = setInterval(() => {
        // Simulate new votes
        setSongSuggestions((prev) =>
          prev.map((song) => ({
            ...song,
            votes: song.votes + Math.floor(Math.random() * 2),
            reactions: song.reactions.map((reaction) => ({
              ...reaction,
              count: reaction.count + Math.floor(Math.random() * 2),
            })),
          }))
        );

        // Update stats
        setMusicStats((prev) => ({
          ...prev,
          totalVotes: prev.totalVotes + Math.floor(Math.random() * 3),
          activeGuests: Math.max(
            15,
            prev.activeGuests + Math.floor(Math.random() * 3 - 1)
          ),
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLiveMode]);

  const voteSong = (songId: string) => {
    const targetSong = songSuggestions.find((s) => s.id === songId);
    if (!targetSong) return;

    setSongSuggestions((prev) =>
      prev.map((song) =>
        song.id === songId
          ? {
              ...song,
              votes: song.hasVoted ? song.votes - 1 : song.votes + 1,
              hasVoted: !song.hasVoted,
            }
          : song
      )
    );

    toast({
      title: targetSong.hasVoted ? "Vote removed" : "Vote added",
      description: `${
        targetSong.hasVoted ? "Removed vote from" : "Voted for"
      } "${targetSong.title}"`,
    });
  };

  const addReaction = (songId: string, emoji: string) => {
    setSongSuggestions((prev) =>
      prev.map((song) =>
        song.id === songId
          ? {
              ...song,
              reactions: song.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            }
          : song
      )
    );
  };

  const suggestSong = (searchResult: any) => {
    if (suggestionNote.length < 5) {
      toast({
        title: "Add a note",
        description:
          "Please add a short note about why you want this song played.",
        variant: "destructive",
      });
      return;
    }

    const newSuggestion: SongSuggestion = {
      id: Math.random().toString(36),
      title: searchResult.title,
      artist: searchResult.artist,
      duration: searchResult.duration,
      suggestedBy: "You",
      note: suggestionNote,
      votes: 1,
      hasVoted: true,
      reactions: [],
      timestamp: new Date(),
      source: selectedSource,
      sourceUrl: "#",
      albumArt: searchResult.albumArt,
    };

    setSongSuggestions((prev) => [newSuggestion, ...prev]);
    setSuggestionNote("");
    setSearchQuery("");

    toast({
      title: "Song suggested!",
      description: `"${searchResult.title}" has been added to the queue.`,
    });
  };

  const searchSongs = async (query: string) => {
    if (query.length < 3) return;

    try {
      const response = await apiRequest("/api/music/search", "POST", {
        query,
        source: selectedSource,
        limit: 10,
      });
      setSearchResults(response.tracks || []);
    } catch (error) {
      // Clear results if API fails
      setSearchResults([]);
      toast({
        title: "Music search unavailable",
        description: "Please check your music service API credentials",
        variant: "destructive",
      });
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "spotify":
        return <div className="w-4 h-4 bg-green-500 rounded-full" />;
      case "apple":
        return <div className="w-4 h-4 bg-gray-900 rounded-full" />;
      case "youtube":
        return <div className="w-4 h-4 bg-red-500 rounded-full" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const sortedSuggestions = [...songSuggestions].sort(
    (a, b) => b.votes - a.votes
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Music className="inline-block mr-3 h-10 w-10 text-purple-600" />
          Live Song Suggestions & Voting
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Let your guests shape the music! Real-time song suggestions, voting,
          and DJ integration create the perfect soundtrack for your event.
        </p>
      </div>

      {/* Live Stats Bar */}
      <Card className="mb-8 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {musicStats.totalSuggestions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Song Suggestions
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {musicStats.totalVotes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Votes
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {musicStats.activeGuests}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Active Guests
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {musicStats.topGenre}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Top Genre
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2">
                {isLiveMode && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
                <Badge variant={isLiveMode ? "default" : "secondary"}>
                  {isLiveMode ? "LIVE" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Song Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Playing */}
          {musicStats.currentlyPlaying && (
            <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Now Playing</div>
                    <div className="text-lg">{musicStats.currentlyPlaying}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-600 text-white">DJ Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Voted Songs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="mr-2 h-6 w-6" />
                  Live Song Queue
                </div>
                <Badge variant="outline">
                  {sortedSuggestions.length} songs
                </Badge>
              </CardTitle>
              <CardDescription>
                Songs ranked by guest votes - DJ can see and play top picks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedSuggestions.map((song, index) => (
                <div
                  key={song.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    song.isPlaying
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src={song.albumArt}
                        alt={song.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      {song.isPlaying && (
                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Play className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg truncate">
                            {song.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300">
                            {song.artist}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            {getSourceIcon(song.source)}
                            <span>{song.duration}</span>
                            <span>•</span>
                            <span>by {song.suggestedBy}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {song.votes}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            votes
                          </div>
                        </div>
                      </div>

                      {song.note && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 italic mb-3">
                          "{song.note}"
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant={song.hasVoted ? "default" : "outline"}
                            size="sm"
                            onClick={() => voteSong(song.id)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-1 ${
                                song.hasVoted ? "fill-current" : ""
                              }`}
                            />
                            Vote
                          </Button>

                          <div className="flex gap-1">
                            {["🔥", "🥳", "💃"].map((emoji) => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                size="sm"
                                onClick={() => addReaction(song.id, emoji)}
                                className="text-lg p-1 h-8 w-8"
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {song.reactions.map((reaction, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-sm"
                            >
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Suggest Songs & Controls */}
        <div className="space-y-6">
          {/* Suggest New Song */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-6 w-6" />
                Suggest a Song
              </CardTitle>
              <CardDescription>
                Add songs to the live queue for everyone to vote on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Music Source</Label>
                <Select
                  value={selectedSource}
                  onValueChange={(value: any) => setSelectedSource(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spotify">Spotify</SelectItem>
                    <SelectItem value="apple">Apple Music</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Search Songs</Label>
                <div className="flex gap-2">
                  <Input
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchSongs(e.target.value);
                    }}
                    placeholder="Song title or artist..."
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {searchResults.length > 0 && searchQuery && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <img
                        src={result.albumArt}
                        alt=""
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {result.artist}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => suggestSong(result)}
                        disabled={suggestionNote.length < 5}
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label>Why this song? (Required)</Label>
                <Textarea
                  value={suggestionNote}
                  onChange={(e) => setSuggestionNote(e.target.value)}
                  placeholder="This will get everyone dancing!"
                  rows={2}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {suggestionNote.length}/100 characters
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DJ Controls (if user is DJ) */}
          {userRole === "dj" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="mr-2 h-6 w-6" />
                  DJ Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Live Mode</span>
                  <Button
                    variant={isLiveMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsLiveMode(!isLiveMode)}
                  >
                    {isLiveMode ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Max suggestions per guest</Label>
                  <Select
                    value={djSettings.maxSuggestionsPerGuest.toString()}
                    onValueChange={(value) =>
                      setDjSettings((prev) => ({
                        ...prev,
                        maxSuggestionsPerGuest: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 songs</SelectItem>
                      <SelectItem value="3">3 songs</SelectItem>
                      <SelectItem value="5">5 songs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Top Songs to DJ Software
                </Button>

                <Button className="w-full" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Show Live Queue on Screen
                </Button>
              </CardContent>
            </Card>
          )}

          {/* User Role Selector (for demo) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">View Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={userRole}
                onValueChange={(value: any) => setUserRole(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guest">Guest View</SelectItem>
                  <SelectItem value="host">Host View</SelectItem>
                  <SelectItem value="dj">DJ View</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Live Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Most requested genre:</span>
                <Badge>{musicStats.topGenre}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg votes per song:</span>
                <span className="font-semibold">
                  {musicStats.averageVotesPerSong}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Top suggestion:</span>
                <span className="font-semibold text-sm">
                  {sortedSuggestions[0]?.title.substring(0, 20)}...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
