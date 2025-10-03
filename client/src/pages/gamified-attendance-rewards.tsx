import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Trophy,
  Star,
  Gift,
  Target,
  Award,
  Zap,
  Crown,
  Coins,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle,
  Plus,
  Sparkles,
  Medal,
  Flame,
  Timer,
  Share2,
  Download,
  Gamepad2,
  BarChart3,
  Heart,
  Coffee,
  Music,
  Camera,
  MessageCircle,
} from "lucide-react";

interface UserReward {
  id: string;
  userId: string;
  eventId: string;
  type: "points" | "badge" | "item" | "discount" | "access";
  title: string;
  description: string;
  value: number;
  earnedAt: string;
  isRedeemed: boolean;
  expiresAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  totalPoints: number;
  totalEvents: number;
  streak: number;
  badges: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "attendance" | "engagement" | "social" | "milestone";
  target: number;
  progress: number;
  reward: {
    type: string;
    value: number;
    description: string;
  };
  timeLeft: string;
  difficulty: "easy" | "medium" | "hard";
  isActive: boolean;
}

const rarityColors = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
};

const achievementIcons = {
  trophy: Trophy,
  star: Star,
  crown: Crown,
  medal: Medal,
  target: Target,
  flame: Flame,
  heart: Heart,
  music: Music,
  camera: Camera,
  users: Users,
};

export default function GamifiedAttendanceRewards() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user rewards
  const { data: userRewards, isLoading } = useQuery({
    queryKey: ["/api/gamification/rewards"],
    retry: false,
  });

  // Fetch achievements
  const { data: achievements } = useQuery({
    queryKey: ["/api/gamification/achievements"],
    retry: false,
  });

  // Fetch leaderboard
  const { data: leaderboard } = useQuery({
    queryKey: ["/api/gamification/leaderboard", selectedTimeframe],
    retry: false,
  });

  // Fetch challenges
  const { data: challenges } = useQuery({
    queryKey: ["/api/gamification/challenges"],
    retry: false,
  });

  // Fetch user stats
  const { data: userStats } = useQuery({
    queryKey: ["/api/gamification/stats"],
    retry: false,
  });

  // Claim reward mutation
  const claimRewardMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      return await apiRequest(
        "POST",
        `/api/gamification/rewards/${rewardId}/claim`,
        {}
      );
    },
    onSuccess: () => {
      toast({
        title: "Reward Claimed!",
        description: "Your reward has been successfully claimed.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/gamification/rewards"],
      });
    },
  });

  // Complete challenge mutation
  const completechallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      return await apiRequest(
        "POST",
        `/api/gamification/challenges/${challengeId}/complete`,
        {}
      );
    },
    onSuccess: () => {
      toast({
        title: "Challenge Completed!",
        description: "You've earned bonus points and rewards!",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/gamification/challenges"],
      });
    },
  });

  const handleClaimReward = (rewardId: string) => {
    claimRewardMutation.mutate(rewardId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
              <Star className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Gamified Attendance Rewards
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Earn points, unlock achievements, and compete with friends through
            engaging event participation
          </p>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-linear-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="p-6 text-center">
                <Coins className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold">
                  {(userStats as any).totalPoints || 2847}
                </div>
                <p className="text-sm opacity-90">Total Points</p>
              </CardContent>
            </Card>
            <Card className="bg-linear-to-r from-blue-500 to-indigo-500 text-white">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold">
                  {(userStats as any).rank || 12}
                </div>
                <p className="text-sm opacity-90">Global Rank</p>
              </CardContent>
            </Card>
            <Card className="bg-linear-to-r from-indigo-500 to-purple-500 text-white">
              <CardContent className="p-6 text-center">
                <Flame className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold">
                  {(userStats as any).streak || 7}
                </div>
                <p className="text-sm opacity-90">Day Streak</p>
              </CardContent>
            </Card>
            <Card className="bg-linear-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-3" />
                <div className="text-3xl font-bold">
                  {(userStats as any).badges || 23}
                </div>
                <p className="text-sm opacity-90">Badges Earned</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-fit lg:grid-cols-5 mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Challenges
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Attended Sarah's Birthday",
                        points: 50,
                        time: "2 hours ago",
                        icon: Calendar,
                      },
                      {
                        action: "Shared event on social media",
                        points: 25,
                        time: "5 hours ago",
                        icon: Share2,
                      },
                      {
                        action: "Early bird attendance bonus",
                        points: 100,
                        time: "1 day ago",
                        icon: Timer,
                      },
                      {
                        action: "Photo upload reward",
                        points: 30,
                        time: "2 days ago",
                        icon: Camera,
                      },
                    ].map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                            <IconComponent className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            +{activity.points} pts
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Progress to Next Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Level Progress
                  </CardTitle>
                  <CardDescription>
                    You're close to leveling up!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">Level 8</span>
                      <span className="text-lg font-semibold">Level 9</span>
                    </div>
                    <Progress value={75} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>2,847 / 3,200 points</span>
                      <span>353 points to go</span>
                    </div>
                    <div className="mt-4 p-4 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                      <h4 className="font-semibold mb-2">Level 9 Rewards:</h4>
                      <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                        <li>• Exclusive VIP event access</li>
                        <li>• 500 bonus points</li>
                        <li>• Special golden badge</li>
                        <li>• Priority event notifications</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Earn points with these quick actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      action: "Check in to current event",
                      points: 50,
                      icon: MapPin,
                      available: true,
                    },
                    {
                      action: "Share event on social",
                      points: 25,
                      icon: Share2,
                      available: true,
                    },
                    {
                      action: "Upload event photo",
                      points: 30,
                      icon: Camera,
                      available: true,
                    },
                    {
                      action: "Invite a friend",
                      points: 100,
                      icon: Users,
                      available: false,
                    },
                  ].map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant={action.available ? "default" : "secondary"}
                        disabled={!action.available}
                        className="h-auto p-4 flex flex-col gap-2"
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="text-xs text-center">
                          {action.action}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          +{action.points} pts
                        </Badge>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Achievements</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {achievements && Array.isArray(achievements)
                    ? `${
                        (achievements as any[]).filter((a) => a.unlocked).length
                      } / ${(achievements as any[]).length} unlocked`
                    : "Loading achievements..."}
                </p>
              </div>
              <div className="flex gap-2">
                {["all", "unlocked", "locked"].map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

            {achievements &&
            Array.isArray(achievements) &&
            achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(achievements as any[]).map((achievement) => {
                  const IconComponent =
                    achievementIcons[
                      achievement.icon as keyof typeof achievementIcons
                    ] || Trophy;
                  return (
                    <Card
                      key={achievement.id}
                      className={`relative overflow-hidden ${
                        achievement.unlocked
                          ? "bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                          : "opacity-60"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={`p-3 rounded-full ${
                              rarityColors[achievement.rarity]
                            } flex items-center justify-center`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {achievement.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className="capitalize text-xs"
                              >
                                {achievement.rarity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {achievement.description}
                            </p>

                            {!achievement.unlocked && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span>Progress</span>
                                  <span>
                                    {achievement.progress} /{" "}
                                    {achievement.maxProgress}
                                  </span>
                                </div>
                                <Progress
                                  value={
                                    (achievement.progress /
                                      achievement.maxProgress) *
                                    100
                                  }
                                  className="h-2"
                                />
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                              <Badge variant="secondary">
                                +{achievement.points} pts
                              </Badge>
                              {achievement.unlocked && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-xs">Unlocked</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  No Achievements Yet
                </h3>
                <p className="text-gray-500">
                  Start attending events to unlock your first achievements!
                </p>
              </div>
            )}
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Active Challenges</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete challenges to earn bonus rewards
                </p>
              </div>
            </div>

            {challenges &&
            Array.isArray(challenges) &&
            challenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(challenges as any[])
                  .filter((c) => c.isActive)
                  .map((challenge) => (
                    <Card
                      key={challenge.id}
                      className="relative overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {challenge.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {challenge.description}
                            </p>
                          </div>
                          <Badge
                            variant={
                              challenge.difficulty === "easy"
                                ? "secondary"
                                : challenge.difficulty === "medium"
                                ? "default"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {challenge.difficulty}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress</span>
                              <span>
                                {challenge.progress} / {challenge.target}
                              </span>
                            </div>
                            <Progress
                              value={
                                (challenge.progress / challenge.target) * 100
                              }
                              className="h-3"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-orange-600" />
                              <span className="text-sm text-orange-600">
                                {challenge.timeLeft}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Reward:
                              </p>
                              <p className="font-semibold text-green-600">
                                {challenge.reward.description}
                              </p>
                            </div>
                          </div>

                          {challenge.progress >= challenge.target && (
                            <Button
                              onClick={() =>
                                completechallengeMutation.mutate(challenge.id)
                              }
                              disabled={completechallengeMutation.isPending}
                              className="w-full"
                            >
                              <Gift className="w-4 h-4 mr-2" />
                              Claim Reward
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  No Active Challenges
                </h3>
                <p className="text-gray-500">
                  New challenges will appear regularly. Check back soon!
                </p>
              </div>
            )}
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  See how you rank against other event enthusiasts
                </p>
              </div>
              <div className="flex gap-2">
                {["week", "month", "all-time"].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={
                      selectedTimeframe === timeframe ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className="capitalize"
                  >
                    {timeframe.replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>

            {leaderboard &&
            Array.isArray(leaderboard) &&
            leaderboard.length > 0 ? (
              <div className="space-y-4">
                {(leaderboard as any[]).map((entry, index) => (
                  <Card
                    key={entry.userId}
                    className={`${
                      index < 3
                        ? "border-2 border-yellow-400 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {index < 3 ? (
                              <Crown className="w-5 h-5" />
                            ) : (
                              entry.rank
                            )}
                          </div>
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{entry.username}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{entry.totalEvents} events</span>
                            <span>{entry.streak} day streak</span>
                            <span>{entry.badges} badges</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">
                            {entry.totalPoints.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            points
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  No Leaderboard Data
                </h3>
                <p className="text-gray-500">
                  The leaderboard will update as more users participate in
                  events.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Your Rewards</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and redeem your earned rewards
                </p>
              </div>
            </div>

            {userRewards &&
            Array.isArray(userRewards) &&
            userRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(userRewards as any[]).map((reward) => (
                  <Card
                    key={reward.id}
                    className={`relative ${
                      reward.isRedeemed ? "opacity-60" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                          <Gift className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{reward.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {reward.description}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className="capitalize">
                              {reward.type}
                            </Badge>
                            {reward.value && (
                              <Badge variant="secondary">
                                {reward.type === "points"
                                  ? `${reward.value} pts`
                                  : reward.type === "discount"
                                  ? `${reward.value}% off`
                                  : `${reward.value} value`}
                              </Badge>
                            )}
                          </div>

                          {reward.expiresAt && !reward.isRedeemed && (
                            <p className="text-xs text-orange-600 mt-2">
                              Expires:{" "}
                              {new Date(reward.expiresAt).toLocaleDateString()}
                            </p>
                          )}

                          <div className="mt-4">
                            {reward.isRedeemed ? (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Redeemed</span>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleClaimReward(reward.id)}
                                disabled={claimRewardMutation.isPending}
                                size="sm"
                                className="w-full"
                              >
                                Claim Reward
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Rewards Yet</h3>
                <p className="text-gray-500">
                  Attend events and complete challenges to earn rewards!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
