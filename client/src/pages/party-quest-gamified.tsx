import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Trophy, 
  Target, 
  Users, 
  Camera, 
  Music, 
  MapPin, 
  Gift, 
  Star, 
  Zap, 
  Crown, 
  Coins, 
  CheckCircle, 
  Clock, 
  Sparkles,
  GamepadIcon,
  Ticket,
  Award,
  Heart,
  MessageSquare,
  Share2,
  Volume2,
  Utensils,
  PartyPopper,
  Puzzle,
  Flag,
  Timer,
  Gem,
  Medal,
  Shield,
  Crosshair,
  Zap as Lightning,
  Zap as Fire,
  Coffee as Drink,
  Sword as Swords
} from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'social';
  category: 'exploration' | 'social' | 'creative' | 'challenge' | 'trivia';
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  timeLimit?: number; // minutes
  teamSize?: number;
  status: 'available' | 'active' | 'completed' | 'expired';
  progress: number;
  participants: number;
  maxParticipants?: number;
  isHidden?: boolean;
  unlockConditions?: string[];
}

interface QuestRequirement {
  id: string;
  type: 'visit' | 'dance' | 'photo' | 'trivia' | 'social' | 'purchase' | 'time' | 'check_in';
  target: string;
  count: number;
  completed: number;
  description: string;
}

interface QuestReward {
  id: string;
  type: 'drink_token' | 'nft' | 'shout_out' | 'vip_access' | 'points' | 'badge' | 'discount';
  value: string | number;
  description: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  questsCompleted: number;
  totalPoints: number;
  rank: number;
  color: string;
  motto?: string;
  captain: string;
  achievements: string[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: 'captain' | 'member';
  points: number;
  questsCompleted: number;
  online: boolean;
}

interface Leaderboard {
  individual: LeaderboardEntry[];
  teams: TeamLeaderboard[];
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  points: number;
  questsCompleted: number;
  rank: number;
  badges: string[];
  title: string;
}

interface TeamLeaderboard {
  team: Team;
  points: number;
  questsCompleted: number;
  rank: number;
}

export default function PartyQuestGamified() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [activeTab, setActiveTab] = useState("quests");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [questFilter, setQuestFilter] = useState("all");
  const [showTeamCreation, setShowTeamCreation] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMotto, setTeamMotto] = useState("");
  
  // Data queries
  const { data: availableQuests, isLoading: questsLoading } = useQuery({
    queryKey: ["/api/party-quest/quests"],
  });
  
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/party-quest/progress"],
  });
  
  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/party-quest/leaderboard"],
  });
  
  const { data: userTeam, isLoading: teamLoading } = useQuery({
    queryKey: ["/api/party-quest/team"],
  });

  // Mutations
  const startQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      const response = await apiRequest("POST", "/api/party-quest/start", { questId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quest Started!",
        description: "Good luck on your adventure!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/party-quest"] });
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: { name: string; motto: string }) => {
      const response = await apiRequest("POST", "/api/party-quest/create-team", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Team Created!",
        description: "Your quest team is ready for adventure!",
      });
      setShowTeamCreation(false);
      setTeamName("");
      setTeamMotto("");
      queryClient.invalidateQueries({ queryKey: ["/api/party-quest/team"] });
    },
  });

  const joinTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const response = await apiRequest("POST", "/api/party-quest/join-team", { teamId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Joined Team!",
        description: "Welcome to your quest team!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/party-quest/team"] });
    },
  });

  const claimRewardMutation = useMutation({
    mutationFn: async (questId: string) => {
      const response = await apiRequest("POST", "/api/party-quest/claim-reward", { questId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Claimed!",
        description: `You earned ${data.reward.description}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/party-quest"] });
    },
  });

  // Helper functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exploration': return <MapPin className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'creative': return <Camera className="h-4 w-4" />;
      case 'challenge': return <Target className="h-4 w-4" />;
      case 'trivia': return <Puzzle className="h-4 w-4" />;
      default: return <GamepadIcon className="h-4 w-4" />;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'drink_token': return <Drink className="h-4 w-4" />;
      case 'nft': return <Gem className="h-4 w-4" />;
      case 'shout_out': return <Volume2 className="h-4 w-4" />;
      case 'vip_access': return <Crown className="h-4 w-4" />;
      case 'points': return <Coins className="h-4 w-4" />;
      case 'badge': return <Medal className="h-4 w-4" />;
      case 'discount': return <Ticket className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const filteredQuests = availableQuests?.filter((quest: Quest) => {
    if (questFilter === 'all') return true;
    if (questFilter === 'active') return quest.status === 'active';
    if (questFilter === 'completed') return quest.status === 'completed';
    if (questFilter === 'team') return quest.type === 'team';
    return quest.category === questFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <GamepadIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Party Quest</h1>
                <p className="text-gray-600">Gamified guest experience with quests, rewards, and team challenges</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{userProgress?.totalPoints || 0}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userProgress?.completedQuests || 0}</div>
                <div className="text-sm text-gray-600">Quests Done</div>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Trophy className="h-4 w-4 mr-1" />
                Rank #{userProgress?.rank || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="quests">Active Quests</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Quests Tab */}
          <TabsContent value="quests" className="space-y-6">
            
            {/* Quest Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Quests', icon: <GamepadIcon className="h-4 w-4" /> },
                    { id: 'active', label: 'Active', icon: <Lightning className="h-4 w-4" /> },
                    { id: 'exploration', label: 'Exploration', icon: <MapPin className="h-4 w-4" /> },
                    { id: 'social', label: 'Social', icon: <Users className="h-4 w-4" /> },
                    { id: 'creative', label: 'Creative', icon: <Camera className="h-4 w-4" /> },
                    { id: 'challenge', label: 'Challenge', icon: <Target className="h-4 w-4" /> },
                    { id: 'team', label: 'Team Quests', icon: <Swords className="h-4 w-4" /> }
                  ].map((filter) => (
                    <Button
                      key={filter.id}
                      variant={questFilter === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setQuestFilter(filter.id)}
                      className="flex items-center space-x-1"
                    >
                      {filter.icon}
                      <span>{filter.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuests.map((quest: Quest) => (
                <Card key={quest.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(quest.category)}
                        <CardTitle className="text-lg">{quest.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(quest.difficulty)}>
                        {quest.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{quest.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Quest Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                    </div>

                    {/* Requirements */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Requirements:</h4>
                      {quest.requirements.slice(0, 3).map((req) => (
                        <div key={req.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center space-x-2">
                            {req.completed >= req.count ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={req.completed >= req.count ? 'line-through' : ''}>
                              {req.description}
                            </span>
                          </span>
                          <span className="text-gray-500">{req.completed}/{req.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rewards */}
                    <div>
                      <h4 className="font-medium text-sm mb-2">Rewards:</h4>
                      <div className="flex flex-wrap gap-1">
                        {quest.rewards.map((reward) => (
                          <Badge key={reward.id} variant="outline" className="text-xs">
                            {getRewardIcon(reward.type)}
                            <span className="ml-1">{reward.description}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Quest Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3" />
                        <span>{quest.participants} participants</span>
                      </div>
                      {quest.timeLimit && (
                        <div className="flex items-center space-x-1">
                          <Timer className="h-3 w-3" />
                          <span>{quest.timeLimit}m</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {quest.status === 'available' && (
                        <Button 
                          className="w-full"
                          onClick={() => startQuestMutation.mutate(quest.id)}
                          disabled={startQuestMutation.isPending}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Start Quest
                        </Button>
                      )}
                      
                      {quest.status === 'active' && (
                        <Button variant="outline" className="w-full">
                          <Lightning className="h-4 w-4 mr-2" />
                          In Progress
                        </Button>
                      )}
                      
                      {quest.status === 'completed' && (
                        <Button 
                          variant="default" 
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => claimRewardMutation.mutate(quest.id)}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Claim Reward
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Your Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Your Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userTeam ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-xl font-bold" style={{ color: userTeam.color }}>
                          {userTeam.name}
                        </h3>
                        {userTeam.motto && (
                          <p className="text-sm text-gray-600 italic">"{userTeam.motto}"</p>
                        )}
                        <div className="flex justify-center space-x-4 mt-2">
                          <div className="text-center">
                            <div className="font-bold text-lg">{userTeam.totalPoints}</div>
                            <div className="text-xs text-gray-600">Points</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">#{userTeam.rank}</div>
                            <div className="text-xs text-gray-600">Rank</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Team Members</h4>
                        <div className="space-y-2">
                          {userTeam.members.map((member: TeamMember) => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{member.name}</div>
                                  {member.role === 'captain' && (
                                    <Badge variant="outline" size="sm">Captain</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-sm">{member.points} pts</div>
                                <div className="text-xs text-gray-600">{member.questsCompleted} quests</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Join a Team</h3>
                      <p className="text-gray-600 mb-4">
                        Team up with other guests for collaborative quests and higher rewards!
                      </p>
                      <Button onClick={() => setShowTeamCreation(true)}>
                        <Swords className="h-4 w-4 mr-2" />
                        Create Team
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Teams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Swords className="h-5 w-5 mr-2" />
                    Available Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {leaderboard?.teams?.slice(0, 10).map((teamEntry: TeamLeaderboard) => (
                        <div key={teamEntry.team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium" style={{ color: teamEntry.team.color }}>
                              {teamEntry.team.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {teamEntry.team.members.length} members • #{teamEntry.rank}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => joinTeamMutation.mutate(teamEntry.team.id)}
                            disabled={teamEntry.team.members.length >= 6}
                          >
                            Join
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Individual Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Individual Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {leaderboard?.individual?.map((entry: LeaderboardEntry, index: number) => (
                        <div key={entry.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center min-w-8">
                            {index < 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                              }`}>
                                {index + 1}
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-gray-600">#{index + 1}</div>
                            )}
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={entry.avatar} />
                            <AvatarFallback>{entry.name[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-medium">{entry.name}</div>
                            <div className="text-sm text-gray-600">{entry.title}</div>
                            <div className="flex space-x-1 mt-1">
                              {entry.badges.slice(0, 3).map((badge, idx) => (
                                <Badge key={idx} variant="outline" size="sm">{badge}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">{entry.points}</div>
                            <div className="text-sm text-gray-600">{entry.questsCompleted} quests</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Team Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Swords className="h-5 w-5 mr-2" />
                    Team Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {leaderboard?.teams?.map((teamEntry: TeamLeaderboard, index: number) => (
                        <div key={teamEntry.team.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center min-w-8">
                            {index < 3 ? (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? 'bg-yellow-500' : 
                                index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                              }`}>
                                {index + 1}
                              </div>
                            ) : (
                              <div className="text-lg font-bold text-gray-600">#{index + 1}</div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium" style={{ color: teamEntry.team.color }}>
                              {teamEntry.team.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {teamEntry.team.members.length} members
                            </div>
                            {teamEntry.team.motto && (
                              <div className="text-xs text-gray-500 italic">"{teamEntry.team.motto}"</div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-lg">{teamEntry.points}</div>
                            <div className="text-sm text-gray-600">{teamEntry.questsCompleted} quests</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Drink Tokens */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Drink className="h-5 w-5 mr-2" />
                    Drink Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-blue-600">{userProgress?.drinkTokens || 0}</div>
                    <p className="text-gray-600">Available Tokens</p>
                    <Button className="mt-4 w-full" variant="outline">
                      <Drink className="h-4 w-4 mr-2" />
                      Redeem at Bar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* NFT Collection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gem className="h-5 w-5 mr-2" />
                    NFT Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProgress?.nftCollection?.slice(0, 3).map((nft: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                          <Gem className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{nft.name}</div>
                          <Badge variant="outline" size="sm">{nft.rarity}</Badge>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Gem className="h-4 w-4 mr-2" />
                      View Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Medal className="h-5 w-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProgress?.achievements?.slice(0, 4).map((achievement: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-lg">
                        <Medal className="h-5 w-5 text-yellow-600" />
                        <div>
                          <div className="font-medium text-sm">{achievement.name}</div>
                          <div className="text-xs text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full" variant="outline">
                      <Medal className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "First Steps", description: "Complete your first quest", icon: <Flag className="h-6 w-6" />, unlocked: true },
                { name: "Social Butterfly", description: "Join a team and complete 3 social quests", icon: <Users className="h-6 w-6" />, unlocked: true },
                { name: "Explorer", description: "Visit all party booths", icon: <MapPin className="h-6 w-6" />, unlocked: false },
                { name: "Dance Master", description: "Dance 10 times during the party", icon: <Music className="h-6 w-6" />, unlocked: false },
                { name: "Photographer", description: "Take and tag 5 photos", icon: <Camera className="h-6 w-6" />, unlocked: true },
                { name: "Trivia Champion", description: "Answer 20 trivia questions correctly", icon: <Puzzle className="h-6 w-6" />, unlocked: false },
                { name: "Team Captain", description: "Create a team and complete 5 team quests", icon: <Crown className="h-6 w-6" />, unlocked: false },
                { name: "Party Legend", description: "Reach the top 3 on the leaderboard", icon: <Trophy className="h-6 w-6" />, unlocked: false },
                { name: "Quest Master", description: "Complete 25 quests", icon: <Target className="h-6 w-6" />, unlocked: false }
              ].map((achievement, index) => (
                <Card key={index} className={`${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
                    }`}>
                      {achievement.icon}
                    </div>
                    <h3 className="font-bold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Team Creation Dialog */}
        <Dialog open={showTeamCreation} onOpenChange={setShowTeamCreation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Your Quest Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter team name..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Team Motto (Optional)</label>
                <input
                  type="text"
                  value={teamMotto}
                  onChange={(e) => setTeamMotto(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter team motto..."
                />
              </div>
              <Button 
                className="w-full"
                onClick={() => createTeamMutation.mutate({ name: teamName, motto: teamMotto })}
                disabled={!teamName.trim() || createTeamMutation.isPending}
              >
                <Swords className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}