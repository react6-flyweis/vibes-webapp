import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Trophy,
  Award,
  Crown,
  Star,
  Medal,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  Heart,
  Zap,
  Leaf,
  Camera,
  Music,
  Gift
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedDate?: Date;
  points: number;
}

interface HostStats {
  totalEvents: number;
  totalGuests: number;
  averageRating: number;
  sustainabilityScore: number;
  monthlyRank: number;
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  deadline: Date;
  progress: number;
  maxProgress: number;
  isActive: boolean;
  category: string;
}

interface LeaderboardEntry {
  rank: number;
  hostName: string;
  points: number;
  badge: string;
  eventsThisMonth: number;
}

export default function HostAchievements() {
  const [activeTab, setActiveTab] = useState("achievements");
  
  const [hostStats] = useState<HostStats>({
    totalEvents: 12,
    totalGuests: 347,
    averageRating: 4.8,
    sustainabilityScore: 85,
    monthlyRank: 3,
    totalPoints: 2450,
    level: 8,
    nextLevelPoints: 2750
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: "first-event",
      title: "Party Pioneer",
      description: "Host your first event",
      icon: "🎉",
      category: "Getting Started",
      rarity: "common",
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      unlockedDate: new Date(2024, 0, 15),
      points: 50
    },
    {
      id: "themed-master",
      title: "Themed Master",
      description: "Host 5 themed events with 4.5+ ratings",
      icon: "🎨",
      category: "Creativity",
      rarity: "rare",
      progress: 5,
      maxProgress: 5,
      isUnlocked: true,
      unlockedDate: new Date(2024, 2, 10),
      points: 200
    },
    {
      id: "eco-host",
      title: "Eco Champion",
      description: "Achieve 90+ sustainability score",
      icon: "🌱",
      category: "Sustainability",
      rarity: "epic",
      progress: 85,
      maxProgress: 90,
      isUnlocked: false,
      points: 300
    },
    {
      id: "guest-favorite",
      title: "Guest Favorite",
      description: "Receive 100+ positive reviews",
      icon: "⭐",
      category: "Excellence",
      rarity: "epic",
      progress: 87,
      maxProgress: 100,
      isUnlocked: false,
      points: 350
    },
    {
      id: "social-butterfly",
      title: "Social Butterfly",
      description: "Host events with 500+ total guests",
      icon: "🦋",
      category: "Networking",
      rarity: "legendary",
      progress: 347,
      maxProgress: 500,
      isUnlocked: false,
      points: 500
    },
    {
      id: "innovation-pioneer",
      title: "Innovation Pioneer",
      description: "First to use 5 new AI features",
      icon: "🚀",
      category: "Innovation",
      rarity: "legendary",
      progress: 3,
      maxProgress: 5,
      isUnlocked: false,
      points: 600
    }
  ]);

  const [currentChallenges] = useState<Challenge[]>([
    {
      id: "february-challenge",
      title: "February Brunch Master",
      description: "Host the best brunch of the month",
      reward: "Special Brunch Badge + 200 points",
      deadline: new Date(2024, 1, 29),
      progress: 2,
      maxProgress: 3,
      isActive: true,
      category: "Monthly Challenge"
    },
    {
      id: "spring-prep",
      title: "Spring Event Prep",
      description: "Plan 3 outdoor spring events",
      reward: "Spring Host Badge + 150 points",
      deadline: new Date(2024, 4, 31),
      progress: 1,
      maxProgress: 3,
      isActive: true,
      category: "Seasonal"
    },
    {
      id: "collaboration-king",
      title: "Collaboration Champion",
      description: "Get 20+ guests contributing to event planning",
      reward: "Team Player Badge + 250 points",
      deadline: new Date(2024, 2, 15),
      progress: 18,
      maxProgress: 20,
      isActive: true,
      category: "Community"
    }
  ]);

  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, hostName: "EventMaster Sarah", points: 3200, badge: "👑", eventsThisMonth: 4 },
    { rank: 2, hostName: "Party Pro Mike", points: 2890, badge: "🥈", eventsThisMonth: 3 },
    { rank: 3, hostName: "You", points: 2450, badge: "🥉", eventsThisMonth: 2 },
    { rank: 4, hostName: "Creative Clara", points: 2180, badge: "🏆", eventsThisMonth: 3 },
    { rank: 5, hostName: "Fun Felix", points: 1950, badge: "⭐", eventsThisMonth: 2 }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "from-purple-500 to-pink-500";
      case "epic": return "from-blue-500 to-purple-500";
      case "rare": return "from-green-500 to-blue-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-purple-500 shadow-purple-200";
      case "epic": return "border-blue-500 shadow-blue-200";
      case "rare": return "border-green-500 shadow-green-200";
      default: return "border-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Getting Started": return <Star className="h-4 w-4" />;
      case "Creativity": return <Sparkles className="h-4 w-4" />;
      case "Sustainability": return <Leaf className="h-4 w-4" />;
      case "Excellence": return <Trophy className="h-4 w-4" />;
      case "Networking": return <Users className="h-4 w-4" />;
      case "Innovation": return <Zap className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const levelProgress = ((hostStats.totalPoints - (hostStats.level - 1) * 250) / 300) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Trophy className="inline-block mr-3 h-10 w-10 text-yellow-600" />
          Host Achievements
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Level up your hosting skills, earn badges, and compete with other event creators. 
          Turn every party into an achievement and build your reputation as a top host.
        </p>
      </div>

      {/* Host Level & Stats */}
      <Card className="mb-8 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2">
                  {hostStats.level}
                </div>
                <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Level</div>
              <Progress value={levelProgress} className="mt-2 w-20 mx-auto" />
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{hostStats.totalPoints}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {hostStats.nextLevelPoints - hostStats.totalPoints} to next level
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{hostStats.totalEvents}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Events Hosted</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {hostStats.totalGuests} total guests
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{hostStats.averageRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(hostStats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">#{hostStats.monthlyRank}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Monthly Rank</div>
              <Badge variant="secondary" className="mt-1">
                Rising Star
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  achievement.isUnlocked 
                    ? `border-2 ${getRarityBorder(achievement.rarity)} shadow-lg` 
                    : 'opacity-75 border-dashed'
                }`}
              >
                {achievement.isUnlocked && (
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-linear-to-br ${getRarityColor(achievement.rarity)} transform rotate-45 translate-x-8 -translate-y-8`}></div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(achievement.category)}
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                    
                    <div className="flex justify-between items-center">
                      <Badge 
                        className={`bg-linear-to-r ${getRarityColor(achievement.rarity)} text-white border-0`}
                      >
                        {achievement.rarity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-semibold">{achievement.points}</span>
                      </div>
                    </div>

                    {achievement.isUnlocked && achievement.unlockedDate && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
                        Unlocked {achievement.unlockedDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentChallenges.map((challenge) => (
              <Card key={challenge.id} className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5 text-orange-600" />
                      {challenge.title}
                    </CardTitle>
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      {challenge.category}
                    </Badge>
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.maxProgress}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.maxProgress) * 100} />
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      Reward: {challenge.reward}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Deadline: {challenge.deadline.toLocaleDateString()}
                    </span>
                    <Badge variant={challenge.isActive ? "default" : "secondary"}>
                      {challenge.isActive ? "Active" : "Completed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="mr-2 h-6 w-6 text-yellow-600" />
                Monthly Leaderboard
              </CardTitle>
              <CardDescription>
                Top hosts this month - compete for the crown!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.hostName === "You" 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{entry.badge}</div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          #{entry.rank} {entry.hostName}
                          {entry.hostName === "You" && <Badge>You</Badge>}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {entry.eventsThisMonth} events this month
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{entry.points}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5 text-purple-600" />
                  Profile Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {["🎨", "🌱", "⭐", "🏆", "👑", "🚀", "💎", "🔥"].map((emoji, idx) => (
                    <div key={idx} className="text-2xl text-center p-2 bg-white dark:bg-gray-800 rounded">
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Display your achievements on your profile
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-green-600" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✨ Early access to new features</li>
                  <li>🎨 Custom themes and templates</li>
                  <li>📊 Advanced analytics</li>
                  <li>🎯 Priority vendor matching</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Unlock with Points
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-yellow-600" />
                  Community Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>🎪 Featured in community showcase</li>
                  <li>📸 Event photography discounts</li>
                  <li>🎵 Music licensing deals</li>
                  <li>🍰 Catering partner discounts</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Redeem Rewards
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}