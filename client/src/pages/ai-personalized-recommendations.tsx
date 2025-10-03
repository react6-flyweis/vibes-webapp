import { useState, useEffect } from "react";
import { Brain, Users, Music, Calendar, Heart, Star, TrendingUp, MapPin, Clock, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";

interface EventRecommendation {
  id: string;
  title: string;
  date: string;
  venue: string;
  matchScore: number;
  reasons: string[];
  attendingFriends: string[];
  vibeTag: string;
  category: string;
  estimatedEnjoyment: number;
}

interface PlaylistRecommendation {
  id: string;
  name: string;
  moodMatch: number;
  tracks: string[];
  vibe: string;
  energyLevel: number;
  personalizedFor: string;
  reasoning: string;
}

interface VibeBuddy {
  id: string;
  name: string;
  avatar: string;
  compatibilityScore: number;
  sharedInterests: string[];
  personality: string;
  socialConnection: string;
  meetingReason: string;
}

interface PersonalityInsight {
  trait: string;
  score: number;
  description: string;
  partyStyle: string;
}

export default function AIPersonalizedRecommendations() {
  const [selectedTab, setSelectedTab] = useState("events");
  const [personalityToggle, setPersonalityToggle] = useState(true);
  const [recommendationLevel, setRecommendationLevel] = useState([85]);

  const { data: eventRecommendations } = useQuery({
    queryKey: ["/api/ai-recommendations/events"],
    refetchInterval: 30000,
  });

  const { data: playlistRecommendations } = useQuery({
    queryKey: ["/api/ai-recommendations/playlists"],
    refetchInterval: 20000,
  });

  const { data: vibeBuddies } = useQuery({
    queryKey: ["/api/ai-recommendations/vibe-buddies"],
    refetchInterval: 15000,
  });

  const { data: personalityProfile } = useQuery({
    queryKey: ["/api/ai-recommendations/personality"],
    refetchInterval: 60000,
  });

  const { data: aiInsights } = useQuery({
    queryKey: ["/api/ai-recommendations/insights"],
    refetchInterval: 25000,
  });

  const events: EventRecommendation[] = eventRecommendations || [
    {
      id: "event-1",
      title: "Sunset Rooftop DJ Set",
      date: "2025-01-28T18:00:00Z",
      venue: "Sky Lounge Downtown",
      matchScore: 94,
      reasons: ["Your love for electronic music", "3 close friends attending", "Perfect for your social energy level"],
      attendingFriends: ["Sarah M.", "Alex K.", "Jordan L."],
      vibeTag: "Electronic Euphoria",
      category: "Music",
      estimatedEnjoyment: 92
    },
    {
      id: "event-2", 
      title: "Intimate Wine & Jazz Evening",
      date: "2025-01-30T19:30:00Z",
      venue: "The Blue Note",
      matchScore: 87,
      reasons: ["Matches your sophisticated taste", "Small group preference", "Jazz in your top genres"],
      attendingFriends: ["Casey T.", "Riley P."],
      vibeTag: "Sophisticated Chill",
      category: "Culture",
      estimatedEnjoyment: 89
    },
    {
      id: "event-3",
      title: "Beach Bonfire & Acoustic Vibes", 
      date: "2025-02-01T16:00:00Z",
      venue: "Malibu Beach",
      matchScore: 91,
      reasons: ["Outdoor party lover", "Acoustic music preference", "Sunset timing preference"],
      attendingFriends: ["Morgan D.", "Taylor S.", "Cameron R."],
      vibeTag: "Natural Harmony",
      category: "Outdoor",
      estimatedEnjoyment: 88
    }
  ];

  const playlists: PlaylistRecommendation[] = playlistRecommendations || [
    {
      id: "playlist-1",
      name: "Your Perfect Party Mix",
      moodMatch: 96,
      tracks: ["Blinding Lights - The Weeknd", "Levitating - Dua Lipa", "Good 4 U - Olivia Rodrigo"],
      vibe: "High Energy Dance",
      energyLevel: 92,
      personalizedFor: "Your Saturday night energy",
      reasoning: "Based on your recent dance activity and favorite artists"
    },
    {
      id: "playlist-2",
      name: "Chill Conversation Starter",
      moodMatch: 89,
      tracks: ["Heat Waves - Glass Animals", "Peaches - Justin Bieber", "drivers license - Olivia Rodrigo"],
      vibe: "Relaxed Social",
      energyLevel: 65,
      personalizedFor: "Your social gathering style",
      reasoning: "Perfect for your preference for meaningful conversations"
    },
    {
      id: "playlist-3",
      name: "Retro Feels Nostalgia",
      moodMatch: 84,
      tracks: ["Don't Stop Me Now - Queen", "September - Earth Wind & Fire", "I Want It That Way - Backstreet Boys"],
      vibe: "Nostalgic Fun",
      energyLevel: 78,
      personalizedFor: "Your throwback music love",
      reasoning: "Matches your nostalgic personality trait"
    }
  ];

  const vibeMatches: VibeBuddy[] = vibeBuddies || [
    {
      id: "buddy-1",
      name: "Alex Chen",
      avatar: "AC",
      compatibilityScore: 93,
      sharedInterests: ["Electronic Music", "Art Galleries", "Rooftop Parties"],
      personality: "Creative Extrovert",
      socialConnection: "Friend of Sarah M.",
      meetingReason: "Both love deep house music and creative conversations"
    },
    {
      id: "buddy-2",
      name: "Maya Rodriguez",
      avatar: "MR", 
      compatibilityScore: 87,
      sharedInterests: ["Jazz Music", "Wine Tasting", "Intimate Gatherings"],
      personality: "Sophisticated Socializer",
      socialConnection: "Friend of Casey T.",
      meetingReason: "Share appreciation for sophisticated cultural experiences"
    },
    {
      id: "buddy-3",
      name: "Jordan Kim",
      avatar: "JK",
      compatibilityScore: 91,
      sharedInterests: ["Outdoor Events", "Acoustic Music", "Photography"],
      personality: "Nature-Loving Creative",
      socialConnection: "Friend of Morgan D.",
      meetingReason: "Both enjoy natural settings and authentic experiences"
    }
  ];

  const personality: PersonalityInsight[] = personalityProfile || [
    {
      trait: "Social Energy",
      score: 78,
      description: "You thrive in medium-sized groups (8-15 people)",
      partyStyle: "Engaged but not overwhelming"
    },
    {
      trait: "Music Taste",
      score: 85,
      description: "Eclectic taste with preference for emotional depth",
      partyStyle: "Appreciates curated, meaningful playlists"
    },
    {
      trait: "Adventure Level",
      score: 72,
      description: "Open to new experiences with some familiarity",
      partyStyle: "Enjoys unique venues with comfortable elements"
    },
    {
      trait: "Conversation Style",
      score: 81,
      description: "Prefers meaningful connections over small talk",
      partyStyle: "Values quality interactions and shared interests"
    }
  ];

  const insights = aiInsights || {
    totalRecommendations: 247,
    accuracyRate: 91,
    personalityConfidence: 87,
    friendsInNetwork: 156,
    eventsAttended: 23,
    satisfactionScore: 4.6,
    learningProgress: 94,
    nextPersonalityUpdate: "2 days"
  };

  const acceptRecommendation = (eventId: string) => {
    // Handle event acceptance
  };

  const savePlaylist = (playlistId: string) => {
    // Handle playlist saving
  };

  const connectWithBuddy = (buddyId: string) => {
    // Handle vibe buddy connection
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">AI-Personalized Recommendations</h1>
            <Star className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your personal party assistant that knows your vibe, connects you with perfect events, and curates experiences just for you
          </p>
        </div>

        {/* AI Insights Dashboard */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              AI Recommendation Engine Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{insights.accuracyRate}%</div>
                <div className="text-sm text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{insights.friendsInNetwork}</div>
                <div className="text-sm text-gray-400">Friends Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{insights.personalityConfidence}%</div>
                <div className="text-sm text-gray-400">Personality Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{insights.satisfactionScore}</div>
                <div className="text-sm text-gray-400">Satisfaction Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20">
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-600">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:bg-blue-600">
              <Music className="h-4 w-4 mr-2" />
              Playlists
            </TabsTrigger>
            <TabsTrigger value="buddies" className="data-[state=active]:bg-green-600">
              <Users className="h-4 w-4 mr-2" />
              Vibe Buddies
            </TabsTrigger>
            <TabsTrigger value="personality" className="data-[state=active]:bg-indigo-600">
              <Brain className="h-4 w-4 mr-2" />
              Personality
            </TabsTrigger>
          </TabsList>

          {/* Event Recommendations Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Personalized Event Recommendations
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-curated events based on your social graph, preferences, and calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{event.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                            <MapPin className="h-4 w-4" />
                            {event.venue}
                            <Clock className="h-4 w-4 ml-2" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{event.matchScore}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Why this is perfect for you:</div>
                          <div className="space-y-1">
                            {event.reasons.map((reason, index) => (
                              <div key={index} className="text-xs text-green-300 flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Friends attending:</div>
                          <div className="flex flex-wrap gap-1">
                            {event.attendingFriends.map((friend, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {friend}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-purple-400 border-purple-400">
                            {event.vibeTag}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {event.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => acceptRecommendation(event.id)}
                          >
                            Interested
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => acceptRecommendation(event.id)}
                          >
                            Get Tickets
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playlist Recommendations Tab */}
          <TabsContent value="playlists" className="space-y-4">
            <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="h-5 w-5 text-blue-400" />
                  AI-Curated Playlists for Your Vibe
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Personalized music based on mood analysis and listening history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playlists.map((playlist) => (
                    <div key={playlist.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-white font-bold text-lg">{playlist.name}</h3>
                          <p className="text-gray-400 text-sm">{playlist.personalizedFor}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">{playlist.moodMatch}%</div>
                          <div className="text-xs text-gray-500">Mood Match</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Energy Level:</div>
                        <Progress value={playlist.energyLevel} className="mb-2" />
                        <div className="text-xs text-gray-500">{playlist.energyLevel}% Energy</div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-2">Sample Tracks:</div>
                        <div className="space-y-1">
                          {playlist.tracks.slice(0, 3).map((track, index) => (
                            <div key={index} className="text-xs text-white bg-gray-700/50 p-2 rounded">
                              {track}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {playlist.vibe}
                          </Badge>
                          <span className="text-xs text-gray-500">{playlist.reasoning}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => savePlaylist(playlist.id)}
                          >
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => savePlaylist(playlist.id)}
                          >
                            Save Playlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vibe Buddies Tab */}
          <TabsContent value="buddies" className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Your Perfect Vibe Buddies
                </CardTitle>
                <CardDescription className="text-gray-400">
                  AI-matched connections based on personality and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vibeMatches.map((buddy) => (
                    <div key={buddy.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={buddy.avatar} />
                          <AvatarFallback className="bg-green-600 text-white">
                            {buddy.avatar}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-white font-bold">{buddy.name}</h3>
                              <p className="text-gray-400 text-sm">{buddy.personality}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-400">{buddy.compatibilityScore}%</div>
                              <div className="text-xs text-gray-500">Compatibility</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Shared Interests:</div>
                              <div className="flex flex-wrap gap-1">
                                {buddy.sharedInterests.map((interest, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-sm text-gray-400 mb-1">Connection:</div>
                              <p className="text-xs text-blue-300">{buddy.socialConnection}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-gray-400 mb-1">Why you'll click:</div>
                            <p className="text-xs text-green-300">{buddy.meetingReason}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => connectWithBuddy(buddy.id)}
                            >
                              View Profile
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => connectWithBuddy(buddy.id)}
                            >
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Profile Tab */}
          <TabsContent value="personality" className="space-y-4">
            <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  Your AI-Analyzed Party Personality
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Deep insights into your social preferences and party behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {personality.map((trait) => (
                    <div key={trait.trait} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white font-semibold">{trait.trait}</h3>
                        <span className="text-indigo-400 font-bold">{trait.score}%</span>
                      </div>
                      
                      <Progress value={trait.score} className="mb-3" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Analysis:</div>
                          <p className="text-xs text-white">{trait.description}</p>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-1">Party Implication:</div>
                          <p className="text-xs text-indigo-300">{trait.partyStyle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-indigo-900/30 border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-indigo-400" />
                    <span className="text-white font-semibold">Personality Insights</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Your AI learns continuously from your party choices and feedback. Next personality update in {insights.nextPersonalityUpdate}.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-400">{insights.learningProgress}%</div>
                      <div className="text-xs text-gray-400">Learning Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{insights.eventsAttended}</div>
                      <div className="text-xs text-gray-400">Events Analyzed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendation Settings */}
        <Card className="border-yellow-500/20 bg-black/40 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-yellow-400" />
              AI Recommendation Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white font-medium">Recommendation Sensitivity</label>
                  <span className="text-yellow-400 font-semibold">{recommendationLevel[0]}%</span>
                </div>
                <Slider
                  value={recommendationLevel}
                  onValueChange={setRecommendationLevel}
                  max={100}
                  step={5}
                  className="mb-2"
                />
                <p className="text-sm text-gray-400">
                  Higher sensitivity shows more diverse recommendations, lower shows only high-confidence matches
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-500/30 text-center">
                  <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Social Graph</div>
                  <div className="text-xs text-gray-400">Friend connections analyzed</div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-500/30 text-center">
                  <Music className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Music DNA</div>
                  <div className="text-xs text-gray-400">Taste profile learning</div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-900/30 border border-green-500/30 text-center">
                  <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Vibe Matching</div>
                  <div className="text-xs text-gray-400">Personality compatibility</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}