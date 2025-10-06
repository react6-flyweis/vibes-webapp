import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Video,
  Camera,
  Music,
  Heart,
  Download,
  Share2,
  Play,
  Sparkles,
  Clock,
  Users,
  Volume2,
  Star,
} from "lucide-react";
import { Link } from "react-router";

export default function AIVideoMemory() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's events
  const { data: events } = useQuery({
    queryKey: ["/api/events/user"],
    retry: false,
  });

  // Fetch video memories
  const { data: videoMemories, isLoading } = useQuery({
    queryKey: ["/api/video-memories"],
    retry: false,
  });

  // Fetch event highlights for selected event
  const { data: highlights } = useQuery({
    queryKey: ["/api/events", selectedEventId, "highlights"],
    enabled: !!selectedEventId,
    retry: false,
  });

  // Generate video memory mutation
  const generateVideoMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await fetch("/api/video-memories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (!response.ok) throw new Error("Failed to generate video");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Video Generation Started",
        description:
          "Your AI after-movie is being created! This usually takes 3-5 minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/video-memories"] });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    },
  });

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
          <Video className="w-16 h-16 text-yellow-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-linear-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            AI Video Memory Generator
          </h1>
          <p className="text-white/90 mt-2 text-xl">
            Create epic after-movies with AI magic
          </p>
        </div>

        {/* Feature Description */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Sparkles className="w-8 h-8 mr-3 text-yellow-200" />
              Post-Event Magic
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              AI automatically creates stunning after-movies from your event
              highlights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Camera className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Best Photos & Videos</h3>
                <p className="text-white/80 text-sm">
                  AI selects the most engaging moments
                </p>
              </div>
              <div className="text-center">
                <Music className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Top Song Requests</h3>
                <p className="text-white/80 text-sm">
                  Features the crowd's favorite tracks
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">
                  Crowd Energy Highlights
                </h3>
                <p className="text-white/80 text-sm">
                  Captures peak excitement moments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Selection & Generation */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardHeader>
                <CardTitle className="text-party-dark">
                  Generate New Video Memory
                </CardTitle>
                <CardDescription>
                  Select an event to create an AI after-movie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.isArray(events) && events.length > 0 ? (
                  events.map((event: any) => (
                    <div
                      key={event.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedEventId === event.id
                          ? "border-party-coral bg-party-coral/10"
                          : "border-gray-200 hover:border-party-coral/50"
                      }`}
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-party-dark">
                            {event.title}
                          </h3>
                          <p className="text-sm text-party-gray">
                            {event.date}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {event.guestCount || 0} guests
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              {event.photoCount || 0} photos
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-party-gray">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No events available for video generation</p>
                    <Link to="/events/1">
                      <Button className="mt-4 bg-party-coral hover:bg-party-coral/90">
                        View Sample Event
                      </Button>
                    </Link>
                  </div>
                )}

                {selectedEventId && (
                  <Button
                    onClick={() =>
                      generateVideoMutation.mutate(selectedEventId)
                    }
                    disabled={generateVideoMutation.isPending}
                    className="w-full bg-party-gradient-2 hover:scale-105 transition-transform"
                  >
                    {generateVideoMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Video...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Video Memory
                      </div>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Event Highlights Preview */}
            {highlights && (
              <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="text-party-dark">
                    Event Highlights Preview
                  </CardTitle>
                  <CardDescription>
                    What will be included in your video
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-party-coral">
                        {(highlights as any)?.photos?.length || 0}
                      </div>
                      <div className="text-sm text-party-gray">Best Photos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-party-turquoise">
                        {(highlights as any)?.songs?.length || 0}
                      </div>
                      <div className="text-sm text-party-gray">Top Songs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-party-pink">
                        {(highlights as any)?.crowdMoments?.length || 0}
                      </div>
                      <div className="text-sm text-party-gray">
                        Energy Peaks
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Generated Videos */}
          <div>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardHeader>
                <CardTitle className="text-party-dark">
                  Your Video Memories
                </CardTitle>
                <CardDescription>
                  AI-generated after-movies from your events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-party-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-party-gray">Loading video memories...</p>
                  </div>
                ) : Array.isArray(videoMemories) && videoMemories.length > 0 ? (
                  <div className="space-y-4">
                    {videoMemories.map((memory: any) => (
                      <div key={memory.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={memory.thumbnailUrl}
                              alt={memory.eventTitle}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white bg-black/50 rounded-full p-1" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-party-dark">
                              {memory.eventTitle}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant={
                                  memory.status === "ready"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {memory.status === "ready"
                                  ? "Ready"
                                  : memory.status === "generating"
                                  ? "Generating..."
                                  : "Error"}
                              </Badge>
                              <span className="text-sm text-party-gray flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {memory.duration}s
                              </span>
                            </div>
                            <div className="flex gap-4 mt-2 text-xs text-party-gray">
                              <span>{memory.highlights.bestPhotos} photos</span>
                              <span>{memory.highlights.topSongs} songs</span>
                              <span>
                                Energy: {memory.highlights.energyScore}/10
                              </span>
                            </div>
                          </div>
                          {memory.status === "ready" && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-party-gray">
                    <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No video memories generated yet</p>
                    <p className="text-sm mt-1">
                      Select an event above to create your first AI after-movie
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
