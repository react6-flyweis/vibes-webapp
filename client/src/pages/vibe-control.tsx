import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Music, 
  Lightbulb, 
  Wine, 
  Coins, 
  Vote, 
  Users, 
  Zap,
  Headphones,
  Palette,
  Clock,
  TrendingUp,
  Star,
  Trophy,
  Flame,
  Heart,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Mic
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VibeVote {
  id: string;
  type: 'music' | 'lighting' | 'drinks';
  title: string;
  description: string;
  options: VoteOption[];
  totalVotes: number;
  tokensRequired: number;
  timeRemaining: number;
  isActive: boolean;
  createdBy: string;
  winningOption?: string;
}

interface VoteOption {
  id: string;
  title: string;
  description: string;
  votes: number;
  percentage: number;
  image?: string;
  color?: string;
}

interface VibeToken {
  balance: number;
  earned: number;
  spent: number;
  history: TokenTransaction[];
}

interface TokenTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  timestamp: string;
}

interface LiveStats {
  totalParticipants: number;
  activeVotes: number;
  totalTokensInCirculation: number;
  currentVibe: 'energetic' | 'chill' | 'party' | 'romantic';
  vibeScore: number;
}

export default function VibeControl() {
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("live-votes");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live votes
  const { data: liveVotes = [], isLoading: votesLoading } = useQuery({
    queryKey: ['/api/vibe-control/votes'],
    refetchInterval: 2000, // Real-time updates every 2 seconds
  });

  // Fetch user's vibe tokens
  const { data: vibeTokens, isLoading: tokensLoading } = useQuery({
    queryKey: ['/api/vibe-control/tokens'],
    refetchInterval: 5000,
  });

  // Fetch live stats
  const { data: liveStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/vibe-control/stats'],
    refetchInterval: 3000,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voteId, optionId, tokensSpent }: { voteId: string; optionId: string; tokensSpent: number }) => {
      return apiRequest("POST", "/api/vibe-control/vote", { voteId, optionId, tokensSpent });
    },
    onSuccess: () => {
      toast({
        title: "Vote Cast!",
        description: "Your vote has been counted and tokens spent.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-control/votes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-control/tokens'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-control/stats'] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteId: string, optionId: string, tokensSpent: number) => {
    if (!vibeTokens || vibeTokens.balance < tokensSpent) {
      toast({
        title: "Insufficient Tokens",
        description: "You don't have enough Vibe Tokens for this vote.",
        variant: "destructive",
      });
      return;
    }
    voteMutation.mutate({ voteId, optionId, tokensSpent });
  };

  const getVibeColor = (vibe: string) => {
    switch (vibe) {
      case 'energetic': return 'text-red-500';
      case 'chill': return 'text-blue-500';
      case 'party': return 'text-purple-500';
      case 'romantic': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

  const getVoteIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music className="w-5 h-5" />;
      case 'lighting': return <Lightbulb className="w-5 h-5" />;
      case 'drinks': return <Wine className="w-5 h-5" />;
      default: return <Vote className="w-5 h-5" />;
    }
  };

  if (votesLoading || tokensLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading VibeControl...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              VibeControl
            </h1>
          </div>
          <p className="text-xl text-purple-100">Real-Time Party Co-Creation</p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{liveStats?.totalParticipants || 0} Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Vote className="w-4 h-4" />
              <span>{liveStats?.activeVotes || 0} Live Votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className={`w-4 h-4 ${getVibeColor(liveStats?.currentVibe || 'party')}`} />
              <span className="capitalize">{liveStats?.currentVibe || 'Party'} Vibe</span>
            </div>
          </div>
        </div>

        {/* Vibe Tokens Display */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/20 rounded-full">
                  <Coins className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{vibeTokens?.balance || 0}</h3>
                  <p className="text-purple-200">Vibe Tokens</p>
                </div>
              </div>
              <div className="text-right text-purple-200">
                <p className="text-sm">Earned: {vibeTokens?.earned || 0}</p>
                <p className="text-sm">Spent: {vibeTokens?.spent || 0}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-2">
                <span>Vibe Score</span>
                <span>{liveStats?.vibeScore || 0}/100</span>
              </div>
              <Progress value={liveStats?.vibeScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/30">
            <TabsTrigger value="live-votes" className="data-[state=active]:bg-purple-600">
              Live Votes
            </TabsTrigger>
            <TabsTrigger value="dj-booth" className="data-[state=active]:bg-purple-600">
              DJ Booth
            </TabsTrigger>
            <TabsTrigger value="bar-control" className="data-[state=active]:bg-purple-600">
              Bar Control
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600">
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-votes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveVotes.map((vote: VibeVote) => (
                <Card key={vote.id} className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        {getVoteIcon(vote.type)}
                        <span>{vote.title}</span>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          {vote.tokensRequired} tokens
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-purple-200">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{Math.floor(vote.timeRemaining / 60)}:{(vote.timeRemaining % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </CardTitle>
                    <p className="text-purple-200 text-sm">{vote.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vote.options.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{option.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-200 text-sm">{option.votes} votes</span>
                            <span className="text-purple-200 text-sm">({option.percentage}%)</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress value={option.percentage} className="flex-1 h-2" />
                          <Button
                            size="sm"
                            onClick={() => handleVote(vote.id, option.id, vote.tokensRequired)}
                            disabled={voteMutation.isPending || !vote.isActive}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Vote
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-purple-500/30">
                      <div className="flex items-center space-x-2 text-purple-200 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>{vote.totalVotes} total votes</span>
                      </div>
                      {vote.winningOption && (
                        <Badge className="bg-green-600">
                          Winner: {vote.options.find(o => o.id === vote.winningOption)?.title}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dj-booth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Now Playing */}
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <Headphones className="w-6 h-6" />
                    <span>Now Playing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">Dance The Night Away</h3>
                      <p className="text-purple-200">The Weeknd</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Progress value={65} className="flex-1 h-1" />
                        <span className="text-purple-200 text-sm">2:30 / 3:45</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Button size="sm" variant="outline" className="border-purple-500">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Pause className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-purple-500">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Requests */}
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <Mic className="w-6 h-6" />
                    <span>Live Requests</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { song: "Blinding Lights", artist: "The Weeknd", votes: 45, tokens: 12 },
                    { song: "Levitating", artist: "Dua Lipa", votes: 38, tokens: 8 },
                    { song: "Good 4 U", artist: "Olivia Rodrigo", votes: 32, tokens: 15 },
                    { song: "Stay", artist: "The Kid LAROI", votes: 28, tokens: 6 }
                  ].map((request, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-500/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{request.song}</p>
                        <p className="text-purple-200 text-sm">{request.artist}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-white text-sm">{request.votes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-purple-200 text-sm">{request.tokens}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bar-control" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Happy Hour Special",
                  description: "Vote for the next discounted drink",
                  options: ["Cosmos", "Mojitos", "Whiskey Sour", "Margaritas"],
                  votes: [23, 31, 18, 28],
                  timeLeft: 180
                },
                {
                  title: "Signature Cocktail",
                  description: "Create tonight's signature drink",
                  options: ["Tropical Fusion", "Smoky Manhattan", "Berry Blast", "Golden Fizz"],
                  votes: [15, 22, 19, 24],
                  timeLeft: 300
                },
                {
                  title: "Bar Lighting",
                  description: "Set the bar atmosphere",
                  options: ["Neon Purple", "Warm Amber", "Cool Blue", "Party Strobe"],
                  votes: [18, 25, 16, 21],
                  timeLeft: 120
                }
              ].map((poll, index) => (
                <Card key={index} className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-white">
                      <Wine className="w-5 h-5" />
                      <span>{poll.title}</span>
                    </CardTitle>
                    <p className="text-purple-200 text-sm">{poll.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {poll.options.map((option, optionIndex) => {
                      const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                      const percentage = Math.round((poll.votes[optionIndex] / totalVotes) * 100);
                      return (
                        <div key={optionIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white">{option}</span>
                            <span className="text-purple-200 text-sm">{poll.votes[optionIndex]} votes</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Progress value={percentage} className="flex-1 h-2" />
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Vote
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-3 border-t border-purple-500/30">
                      <div className="flex items-center justify-between text-purple-200 text-sm">
                        <span>Time remaining:</span>
                        <span>{Math.floor(poll.timeLeft / 60)}:{(poll.timeLeft % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Contributors */}
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span>Top Contributors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Sarah M.", tokens: 245, level: "Vibe Master", avatar: "SM" },
                    { name: "Alex K.", tokens: 198, level: "Party Pro", avatar: "AK" },
                    { name: "Jordan L.", tokens: 167, level: "Music Maven", avatar: "JL" },
                    { name: "Casey T.", tokens: 134, level: "Dance Captain", avatar: "CT" },
                    { name: "Riley P.", tokens: 112, level: "Mood Maker", avatar: "RP" }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-purple-500/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={`${index < 3 ? 'text-yellow-400 border-yellow-400' : 'text-purple-300 border-purple-300'}`}>
                          #{index + 1}
                        </Badge>
                        <Avatar>
                          <AvatarFallback className="bg-purple-600 text-white">{user.avatar}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-purple-200 text-sm">{user.level}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-bold">{user.tokens}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Activity */}
              <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xs">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-white">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <span>Live Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { user: "Sarah M.", action: "voted for Blinding Lights", time: "2s ago", type: "music" },
                    { user: "Alex K.", action: "spent 5 tokens on lighting", time: "8s ago", type: "lighting" },
                    { user: "Jordan L.", action: "requested Levitating", time: "15s ago", type: "music" },
                    { user: "Casey T.", action: "voted for Margaritas", time: "23s ago", type: "drinks" },
                    { user: "Riley P.", action: "earned 3 tokens dancing", time: "31s ago", type: "reward" },
                    { user: "Morgan D.", action: "voted for neon lighting", time: "45s ago", type: "lighting" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-purple-500/10 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'music' ? 'bg-blue-400' :
                        activity.type === 'lighting' ? 'bg-yellow-400' :
                        activity.type === 'drinks' ? 'bg-green-400' : 'bg-purple-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                      </div>
                      <span className="text-purple-300 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}