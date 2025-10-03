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
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Trophy,
  Star,
  Gift,
  Coins,
  Crown,
  Ticket,
  ShoppingBag,
  Calendar,
  Users,
  Zap,
  TrendingUp,
  Award,
  CheckCircle,
  Lock,
  Unlock,
  Clock,
  Target,
} from "lucide-react";

interface LoyaltyTier {
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
  icon: any;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: "discount" | "exclusive" | "experience" | "merchandise";
  image: string;
  available: boolean;
  expiresAt?: string;
  claimed?: boolean;
}

interface UserStats {
  totalPoints: number;
  availablePoints: number;
  lifetimeEarned: number;
  currentTier: string;
  nextTier: string;
  pointsToNextTier: number;
  eventsAttended: number;
  referralsCount: number;
  achievements: string[];
}

export default function LoyaltyRewards() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch user loyalty data
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/loyalty/stats"],
  });

  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ["/api/loyalty/rewards", selectedCategory],
  });

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["/api/loyalty/activity"],
  });

  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/loyalty/leaderboard"],
  });

  // Redeem reward mutation
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      return await apiRequest("POST", "/api/loyalty/redeem", { rewardId });
    },
    onSuccess: (data) => {
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been added to your account.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/loyalty"] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loyaltyTiers: LoyaltyTier[] = [
    {
      name: "Bronze",
      minPoints: 0,
      color: "text-orange-600 bg-orange-100",
      benefits: ["5% event discounts", "Basic customer support"],
      icon: Trophy,
    },
    {
      name: "Silver",
      minPoints: 1000,
      color: "text-gray-600 bg-gray-100",
      benefits: ["10% event discounts", "Priority booking", "Free delivery"],
      icon: Star,
    },
    {
      name: "Gold",
      minPoints: 5000,
      color: "text-yellow-600 bg-yellow-100",
      benefits: [
        "15% event discounts",
        "VIP customer support",
        "Exclusive events",
        "Free cancellation",
      ],
      icon: Crown,
    },
    {
      name: "Platinum",
      minPoints: 15000,
      color: "text-purple-600 bg-purple-100",
      benefits: [
        "20% event discounts",
        "Personal concierge",
        "Early access",
        "Complimentary upgrades",
      ],
      icon: Award,
    },
  ];

  const rewardCategories = [
    { id: "all", name: "All Rewards", icon: Gift },
    { id: "discount", name: "Discounts", icon: Ticket },
    { id: "exclusive", name: "Exclusive Access", icon: Lock },
    { id: "experience", name: "Experiences", icon: Star },
    { id: "merchandise", name: "Merchandise", icon: ShoppingBag },
  ];

  const handleRedeemReward = (rewardId: string) => {
    redeemMutation.mutate(rewardId);
  };

  const getCurrentTier = () => {
    if (!userStats) return loyaltyTiers[0];
    return (
      loyaltyTiers
        .reverse()
        .find((tier) => userStats.totalPoints >= tier.minPoints) ||
      loyaltyTiers[0]
    );
  };

  const getNextTier = () => {
    if (!userStats) return loyaltyTiers[1];
    return (
      loyaltyTiers.find((tier) => userStats.totalPoints < tier.minPoints) ||
      loyaltyTiers[loyaltyTiers.length - 1]
    );
  };

  const getProgressToNextTier = () => {
    if (!userStats) return 0;
    const currentTier = getCurrentTier();
    const nextTier = getNextTier();
    if (currentTier === nextTier) return 100;

    const progress =
      ((userStats.totalPoints - currentTier.minPoints) /
        (nextTier.minPoints - currentTier.minPoints)) *
      100;
    return Math.min(progress, 100);
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Loyalty & Rewards
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Earn points for every booking and unlock exclusive perks
          </p>
        </div>

        {/* User Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Coins className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">
                {userStats?.availablePoints?.toLocaleString()}
              </div>
              <div className="text-purple-100 text-sm">Available Points</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">
                {userStats?.lifetimeEarned?.toLocaleString()}
              </div>
              <div className="text-purple-100 text-sm">Lifetime Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">
                {userStats?.eventsAttended}
              </div>
              <div className="text-purple-100 text-sm">Events Attended</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">
                {userStats?.referralsCount}
              </div>
              <div className="text-purple-100 text-sm">Referrals Made</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Current Tier & Progress */}
            <Card className="mb-8 bg-linear-to-r from-purple-800 to-blue-800 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {React.createElement(currentTier.icon, {
                    className: "h-6 w-6 text-yellow-400",
                  })}
                  Your Tier: {currentTier.name}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  {currentTier === nextTier
                    ? "You've reached the highest tier!"
                    : `${userStats?.pointsToNextTier} points to ${nextTier.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTier !== nextTier && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-purple-100">
                        {currentTier.name}
                      </span>
                      <span className="text-purple-100">{nextTier.name}</span>
                    </div>
                    <Progress value={getProgressToNextTier()} className="h-3" />
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Your Benefits:
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {currentTier.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-purple-100 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reward Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {rewardCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-white/20 text-white hover:bg-white/10"
                    }
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Rewards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {rewards.map((reward: Reward) => (
                <Card
                  key={reward.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20"
                >
                  <div className="relative">
                    <img
                      src={reward.image}
                      alt={reward.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        reward.category === "exclusive"
                          ? "bg-purple-600"
                          : reward.category === "discount"
                          ? "bg-green-600"
                          : reward.category === "experience"
                          ? "bg-blue-600"
                          : "bg-orange-600"
                      }`}
                    >
                      {reward.category}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">
                      {reward.title}
                    </h3>
                    <p className="text-purple-100 text-sm mb-3">
                      {reward.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-400" />
                        <span className="text-white font-semibold">
                          {reward.pointsCost.toLocaleString()}
                        </span>
                      </div>
                      {reward.expiresAt && (
                        <div className="flex items-center gap-1 text-xs text-purple-200">
                          <Clock className="h-3 w-3" />
                          <span>
                            Expires{" "}
                            {new Date(reward.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={
                        !reward.available ||
                        reward.claimed ||
                        (userStats?.availablePoints || 0) < reward.pointsCost ||
                        redeemMutation.isPending
                      }
                      className="w-full"
                      variant={reward.claimed ? "outline" : "default"}
                    >
                      {reward.claimed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Claimed
                        </>
                      ) : !reward.available ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Unavailable
                        </>
                      ) : (userStats?.availablePoints || 0) <
                        reward.pointsCost ? (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Need{" "}
                          {(
                            reward.pointsCost -
                            (userStats?.availablePoints || 0)
                          ).toLocaleString()}{" "}
                          more
                        </>
                      ) : (
                        <>
                          <Gift className="h-4 w-4 mr-2" />
                          {redeemMutation.isPending ? "Redeeming..." : "Redeem"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tier Progress */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Tier Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyTiers.map((tier, index) => {
                    const IconComponent = tier.icon;
                    const isCurrentTier = tier.name === currentTier.name;
                    const isUnlocked =
                      (userStats?.totalPoints || 0) >= tier.minPoints;

                    return (
                      <div
                        key={tier.name}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isCurrentTier
                            ? "bg-purple-600/30 border border-purple-400"
                            : isUnlocked
                            ? "bg-green-600/20"
                            : "bg-gray-600/20"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            isUnlocked
                              ? tier.color
                              : "bg-gray-400 text-gray-600"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {tier.name}
                            </span>
                            {isCurrentTier && (
                              <Badge className="bg-purple-600">Current</Badge>
                            )}
                            {isUnlocked && !isCurrentTier && (
                              <Unlock className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <div className="text-xs text-purple-100">
                            {tier.minPoints.toLocaleString()} points
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity
                    .slice(0, 5)
                    .map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2"
                      >
                        <div>
                          <div className="text-white text-sm font-medium">
                            {activity.description}
                          </div>
                          <div className="text-purple-200 text-xs">
                            {new Date(activity.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            activity.points > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {activity.points > 0 ? "+" : ""}
                          {activity.points}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Top Earners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((user: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0
                            ? "bg-yellow-500 text-yellow-900"
                            : index === 1
                            ? "bg-gray-400 text-gray-900"
                            : index === 2
                            ? "bg-orange-500 text-orange-900"
                            : "bg-purple-600 text-white"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-sm font-medium">
                          {user.name}
                        </div>
                        <div className="text-purple-200 text-xs">
                          {user.points.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
