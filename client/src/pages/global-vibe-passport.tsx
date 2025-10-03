import { useState, useEffect } from "react";
import { BookOpen, MapPin, Trophy, Star, Gift, Users, Zap, Crown, Globe, Medal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";

interface PassportStamp {
  id: string;
  eventId: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  stampType: "attendance" | "referral" | "engagement" | "milestone" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
  imageUrl: string;
  description: string;
  earnedAt: string;
}

interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  requiredPoints: number;
  color: string;
  icon: string;
  benefits: string[];
  currentMembers: number;
  badge: string;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  category: "vip_access" | "merchandise" | "nft" | "experiences" | "discounts";
  cost: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  imageUrl: string;
  available: number;
  claimed: boolean;
  expiresAt?: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  currentTier: string;
  totalPoints: number;
  eventsAttended: number;
  referralsMade: number;
  citiesVisited: number;
  countriesVisited: number;
  joinedAt: string;
  lastActivity: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "attendance" | "social" | "exploration" | "referrals" | "engagement";
  icon: string;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export default function GlobalVibePassport() {
  const [selectedTab, setSelectedTab] = useState("passport");
  const [selectedStamp, setSelectedStamp] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { data: userProfile } = useQuery({
    queryKey: ["/api/passport/profile"],
    refetchInterval: 30000,
  });

  const { data: passportStamps } = useQuery({
    queryKey: ["/api/passport/stamps"],
    refetchInterval: 30000,
  });

  const { data: loyaltyTiers } = useQuery({
    queryKey: ["/api/passport/tiers"],
    refetchInterval: 60000,
  });

  const { data: availableRewards } = useQuery({
    queryKey: ["/api/passport/rewards"],
    refetchInterval: 30000,
  });

  const { data: achievements } = useQuery({
    queryKey: ["/api/passport/achievements"],
    refetchInterval: 30000,
  });

  // Mock data for demonstration
  const profile: UserProfile = userProfile || {
    id: "user-vibe-explorer",
    name: "Jordan Kim",
    avatar: "JK",
    currentTier: "City Explorer",
    totalPoints: 2847,
    eventsAttended: 23,
    referralsMade: 8,
    citiesVisited: 12,
    countriesVisited: 4,
    joinedAt: "2024-08-15",
    lastActivity: "2025-01-26T22:30:00Z"
  };

  const stamps: PassportStamp[] = passportStamps || [
    {
      id: "stamp-sunset-collective",
      eventId: "beach-festival-2025",
      eventName: "Sunset Collective Beach Festival",
      eventLocation: "Miami Beach, FL",
      eventDate: "2025-01-26",
      stampType: "attendance",
      rarity: "legendary",
      points: 150,
      imageUrl: "/api/stamps/sunset-collective.png",
      description: "Attended the inaugural Sunset Collective festival with 500+ vibers",
      earnedAt: "2025-01-26T23:45:00Z"
    },
    {
      id: "stamp-underground-warehouse",
      eventId: "warehouse-rave-nyc",
      eventName: "Underground Warehouse Experience",
      eventLocation: "Brooklyn, NY",
      eventDate: "2025-01-15",
      stampType: "attendance",
      rarity: "epic",
      points: 120,
      imageUrl: "/api/stamps/warehouse-underground.png",
      description: "Discovered hidden gem warehouse party with exclusive techno lineup",
      earnedAt: "2025-01-15T20:30:00Z"
    },
    {
      id: "stamp-referral-milestone",
      eventId: "global-referral",
      eventName: "Vibe Spreader Achievement",
      eventLocation: "Global",
      eventDate: "2025-01-20",
      stampType: "referral",
      rarity: "rare",
      points: 80,
      imageUrl: "/api/stamps/referral-milestone.png",
      description: "Successfully referred 5 friends who attended events",
      earnedAt: "2025-01-20T14:22:00Z"
    },
    {
      id: "stamp-first-international",
      eventId: "london-rooftop-2024",
      eventName: "London Rooftop Sessions",
      eventLocation: "London, UK",
      eventDate: "2024-12-08",
      stampType: "milestone",
      rarity: "epic",
      points: 200,
      imageUrl: "/api/stamps/international-debut.png",
      description: "First international event - London rooftop with skyline views",
      earnedAt: "2024-12-08T19:15:00Z"
    }
  ];

  const tiers: LoyaltyTier[] = loyaltyTiers || [
    {
      id: "newcomer",
      name: "Vibe Newcomer",
      level: 1,
      requiredPoints: 0,
      color: "gray",
      icon: "👋",
      benefits: ["Basic event access", "Community chat access"],
      currentMembers: 15420,
      badge: "/api/badges/newcomer.png"
    },
    {
      id: "regular-viber",
      name: "Regular Viber",
      level: 2,
      requiredPoints: 500,
      color: "blue",
      icon: "🎵",
      benefits: ["Early event notifications", "5% booking discount", "Profile customization"],
      currentMembers: 8932,
      badge: "/api/badges/regular-viber.png"
    },
    {
      id: "city-explorer",
      name: "City Explorer",
      level: 3,
      requiredPoints: 1500,
      color: "purple",
      icon: "🌆",
      benefits: ["VIP event previews", "10% booking discount", "Exclusive city guides", "Priority support"],
      currentMembers: 3456,
      badge: "/api/badges/city-explorer.png"
    },
    {
      id: "backstage-viber",
      name: "Backstage Viber",
      level: 4,
      requiredPoints: 4000,
      color: "gold",
      icon: "🎭",
      benefits: ["Backstage access", "Meet & greet opportunities", "15% booking discount", "Exclusive merch"],
      currentMembers: 892,
      badge: "/api/badges/backstage-viber.png"
    },
    {
      id: "superhost",
      name: "Superhost",
      level: 5,
      requiredPoints: 10000,
      color: "diamond",
      icon: "👑",
      benefits: ["Host verification badge", "Revenue sharing", "Featured listings", "Personal concierge"],
      currentMembers: 156,
      badge: "/api/badges/superhost.png"
    }
  ];

  const rewards: LoyaltyReward[] = availableRewards || [
    {
      id: "reward-vip-weekend",
      name: "VIP Weekend Pass",
      description: "All-access VIP pass for any weekend event in your city",
      category: "vip_access",
      cost: 800,
      rarity: "epic",
      imageUrl: "/api/rewards/vip-weekend-pass.jpg",
      available: 25,
      claimed: false
    },
    {
      id: "reward-limited-hoodie",
      name: "Limited Edition Vibes Hoodie",
      description: "Exclusive holographic hoodie with your tier badge and city collection",
      category: "merchandise",
      cost: 450,
      rarity: "rare",
      imageUrl: "/api/rewards/limited-hoodie.jpg",
      available: 100,
      claimed: false
    },
    {
      id: "reward-golden-nft",
      name: "Golden Vibe Passport NFT",
      description: "Unique NFT representing your journey across the global party scene",
      category: "nft",
      cost: 1200,
      rarity: "legendary",
      imageUrl: "/api/rewards/golden-passport-nft.jpg",
      available: 50,
      claimed: false
    },
    {
      id: "reward-dj-masterclass",
      name: "Private DJ Masterclass",
      description: "One-on-one session with a featured DJ from recent events",
      category: "experiences",
      cost: 1500,
      rarity: "legendary",
      imageUrl: "/api/rewards/dj-masterclass.jpg",
      available: 10,
      claimed: false
    },
    {
      id: "reward-city-discount",
      name: "City Explorer 25% Discount",
      description: "25% off your next 3 bookings in any new city you visit",
      category: "discounts",
      cost: 300,
      rarity: "common",
      imageUrl: "/api/rewards/city-discount.jpg",
      available: 200,
      claimed: true
    }
  ];

  const userAchievements: Achievement[] = achievements || [
    {
      id: "achievement-first-event",
      name: "First Steps",
      description: "Attend your first Vibes event",
      category: "attendance",
      icon: "🎉",
      points: 50,
      rarity: "common",
      unlockedAt: "2024-08-20T19:30:00Z",
      progress: 1,
      maxProgress: 1
    },
    {
      id: "achievement-city-hopper",
      name: "City Hopper",
      description: "Attend events in 10 different cities",
      category: "exploration",
      icon: "✈️",
      points: 300,
      rarity: "epic",
      unlockedAt: "2025-01-15T22:00:00Z",
      progress: 12,
      maxProgress: 10
    },
    {
      id: "achievement-social-butterfly",
      name: "Social Butterfly",
      description: "Make 50 new connections at events",
      category: "social",
      icon: "🦋",
      points: 200,
      rarity: "rare",
      progress: 43,
      maxProgress: 50
    },
    {
      id: "achievement-vibe-spreader",
      name: "Vibe Spreader",
      description: "Refer 10 friends who attend events",
      category: "referrals",
      icon: "📢",
      points: 250,
      rarity: "rare",
      progress: 8,
      maxProgress: 10
    },
    {
      id: "achievement-content-creator",
      name: "Content Creator",
      description: "Share 25 event highlights on social media",
      category: "engagement",
      icon: "📸",
      points: 150,
      rarity: "rare",
      progress: 18,
      maxProgress: 25
    },
    {
      id: "achievement-globe-trotter",
      name: "Globe Trotter",
      description: "Attend events in 5 different countries",
      category: "exploration",
      icon: "🌍",
      points: 500,
      rarity: "legendary",
      progress: 4,
      maxProgress: 5
    }
  ];

  const currentTier = tiers.find(t => t.name === profile.currentTier) || tiers[2];
  const nextTier = tiers.find(t => t.level === currentTier.level + 1);
  const progressToNextTier = nextTier ? ((profile.totalPoints - currentTier.requiredPoints) / (nextTier.requiredPoints - currentTier.requiredPoints)) * 100 : 100;

  const claimReward = (rewardId: string) => {
    // Handle reward claiming
  };

  const shareAchievement = (achievementId: string) => {
    // Handle achievement sharing
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Global Vibe Passport</h1>
            <Globe className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your gamified journey through the global party scene. Collect stamps, unlock tiers, and redeem exclusive rewards!
          </p>
        </div>

        {/* Profile Header */}
        <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-purple-500">
                  <AvatarFallback className="text-2xl bg-purple-600 text-white">
                    {profile.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${
                        currentTier.color === 'gold' ? 'text-yellow-400 border-yellow-400' :
                        currentTier.color === 'purple' ? 'text-purple-400 border-purple-400' :
                        currentTier.color === 'diamond' ? 'text-cyan-400 border-cyan-400' :
                        'text-blue-400 border-blue-400'
                      }`}
                    >
                      {currentTier.icon} {currentTier.name}
                    </Badge>
                    <span className="text-gray-400 text-sm">Level {currentTier.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-purple-400">{profile.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Total Points</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-blue-400">{profile.eventsAttended}</div>
                  <div className="text-xs text-gray-400">Events Attended</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-green-400">{profile.citiesVisited}</div>
                  <div className="text-xs text-gray-400">Cities Visited</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/50">
                  <div className="text-2xl font-bold text-yellow-400">{profile.countriesVisited}</div>
                  <div className="text-xs text-gray-400">Countries Visited</div>
                </div>
              </div>
            </div>
            
            {/* Progress to Next Tier */}
            {nextTier && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">Progress to {nextTier.name}</span>
                  <span className="text-gray-400 text-sm">
                    {profile.totalPoints} / {nextTier.requiredPoints} points
                  </span>
                </div>
                <Progress value={progressToNextTier} className="h-3" />
                <div className="text-center mt-2 text-sm text-gray-400">
                  {nextTier.requiredPoints - profile.totalPoints} points until next tier
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 border-purple-500/20">
            <TabsTrigger value="passport" className="data-[state=active]:bg-purple-600">
              <BookOpen className="h-4 w-4 mr-2" />
              Passport
            </TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-indigo-600">
              <Crown className="h-4 w-4 mr-2" />
              Tiers
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-pink-600">
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-yellow-600">
              <Medal className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-green-600">
              <Star className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Passport Stamps Tab */}
          <TabsContent value="passport" className="space-y-4">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Your Digital Passport
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Collect stamps from events around the world. Each stamp tells the story of your vibe journey!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stamps.map((stamp) => (
                    <div 
                      key={stamp.id} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStamp === stamp.id 
                          ? 'border-purple-400 bg-purple-900/30' 
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedStamp(selectedStamp === stamp.id ? null : stamp.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            stamp.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                            stamp.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                            stamp.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                            'text-gray-400 border-gray-400'
                          }`}
                        >
                          {stamp.rarity}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">+{stamp.points}</div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-white font-bold text-sm mb-1">{stamp.eventName}</h3>
                      <p className="text-gray-400 text-xs mb-2">{stamp.eventLocation}</p>
                      <p className="text-gray-500 text-xs">{new Date(stamp.eventDate).toLocaleDateString()}</p>
                      
                      {selectedStamp === stamp.id && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-gray-300 text-xs">{stamp.description}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Earned {new Date(stamp.earnedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Passport Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-purple-400">{stamps.length}</div>
                    <div className="text-sm text-gray-400">Total Stamps</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-yellow-400">
                      {stamps.filter(s => s.rarity === 'legendary').length}
                    </div>
                    <div className="text-sm text-gray-400">Legendary Stamps</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-blue-400">
                      {new Set(stamps.map(s => s.eventLocation.split(',')[1]?.trim() || s.eventLocation)).size}
                    </div>
                    <div className="text-sm text-gray-400">Unique Locations</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-800/30">
                    <div className="text-2xl font-bold text-green-400">
                      {stamps.reduce((sum, stamp) => sum + stamp.points, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Points from Stamps</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Loyalty Tiers Tab */}
          <TabsContent value="tiers" className="space-y-4">
            <Card className="border-indigo-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5 text-indigo-400" />
                  Loyalty Tiers
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Unlock exclusive benefits as you climb the tiers. Each level brings new perks and experiences!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tiers.map((tier, index) => (
                    <div 
                      key={tier.id}
                      className={`p-6 rounded-lg border-2 ${
                        tier.name === profile.currentTier 
                          ? 'border-purple-400 bg-purple-900/30' 
                          : index < currentTier.level 
                            ? 'border-green-500/50 bg-green-900/20'
                            : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{tier.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                            <p className="text-gray-400">Level {tier.level} • {tier.requiredPoints.toLocaleString()} points required</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {tier.name === profile.currentTier && (
                            <Badge variant="outline" className="text-purple-400 border-purple-400 mb-2">
                              Current Tier
                            </Badge>
                          )}
                          {index < currentTier.level && (
                            <Badge variant="outline" className="text-green-400 border-green-400 mb-2">
                              Unlocked
                            </Badge>
                          )}
                          <div className="text-sm text-gray-400">{tier.currentMembers.toLocaleString()} members</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white font-semibold mb-2">Benefits:</h4>
                          <ul className="space-y-1">
                            {tier.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-gray-300 text-sm flex items-center gap-2">
                                <Zap className="h-3 w-3 text-yellow-400" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {tier.name === profile.currentTier && nextTier && (
                          <div>
                            <h4 className="text-white font-semibold mb-2">Progress to {nextTier.name}:</h4>
                            <Progress value={progressToNextTier} className="mb-2" />
                            <p className="text-sm text-gray-400">
                              {nextTier.requiredPoints - profile.totalPoints} points remaining
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card className="border-pink-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-5 w-5 text-pink-400" />
                  Loyalty Rewards Store
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Redeem your points for exclusive perks, VIP access, merchandise, and unique experiences!
                </CardDescription>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-semibold">{profile.totalPoints.toLocaleString()} Points Available</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="relative mb-3">
                        <div className="w-full h-32 bg-linear-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Gift className="h-12 w-12 text-white" />
                        </div>
                        <Badge 
                          variant="outline"
                          className={`absolute top-2 right-2 text-xs ${
                            reward.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                            reward.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                            reward.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                            'text-gray-400 border-gray-400'
                          }`}
                        >
                          {reward.rarity}
                        </Badge>
                      </div>
                      
                      <h3 className="text-white font-bold text-sm mb-2">{reward.name}</h3>
                      <p className="text-gray-400 text-xs mb-3">{reward.description}</p>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-white font-semibold">{reward.cost}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{reward.available} available</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className={`w-full ${
                          reward.claimed 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : profile.totalPoints >= reward.cost
                              ? 'bg-pink-600 hover:bg-pink-700'
                              : 'bg-gray-600 cursor-not-allowed'
                        }`}
                        disabled={reward.claimed || profile.totalPoints < reward.cost}
                        onClick={() => claimReward(reward.id)}
                      >
                        {reward.claimed ? 'Claimed' : 
                         profile.totalPoints >= reward.cost ? 'Redeem' : 'Insufficient Points'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card className="border-yellow-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Medal className="h-5 w-5 text-yellow-400" />
                  Achievements
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your progress and unlock special achievements as you explore the global vibe scene!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userAchievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-4 rounded-lg border-2 ${
                        achievement.unlockedAt 
                          ? 'border-yellow-400/50 bg-yellow-900/20' 
                          : 'border-gray-700 bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div>
                            <h3 className="text-white font-bold">{achievement.name}</h3>
                            <p className="text-gray-400 text-sm">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">+{achievement.points}</div>
                          <Badge 
                            variant="outline"
                            className={`text-xs ${
                              achievement.rarity === 'legendary' ? 'text-yellow-400 border-yellow-400' :
                              achievement.rarity === 'epic' ? 'text-purple-400 border-purple-400' :
                              achievement.rarity === 'rare' ? 'text-blue-400 border-blue-400' :
                              'text-gray-400 border-gray-400'
                            }`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400 text-sm">Progress</span>
                          <span className="text-white text-sm">
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      {achievement.unlockedAt ? (
                        <div className="flex justify-between items-center">
                          <span className="text-green-400 text-sm font-medium">✓ Unlocked</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => shareAchievement(achievement.id)}
                          >
                            Share
                          </Button>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          {achievement.maxProgress - achievement.progress} more to unlock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-400" />
                  Passport Settings
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize your passport experience and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Achievement Notifications</label>
                      <p className="text-gray-400 text-sm">Get notified when you unlock new achievements</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Tier Progress Updates</label>
                      <p className="text-gray-400 text-sm">Receive updates on your tier advancement</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Reward Alerts</label>
                      <p className="text-gray-400 text-sm">Get alerted about new rewards and limited offers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-white font-medium">Public Profile</label>
                      <p className="text-gray-400 text-sm">Allow other vibers to see your passport and achievements</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-white font-semibold mb-4">Account Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Member since:</span>
                      <span className="text-white ml-2">{new Date(profile.joinedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last activity:</span>
                      <span className="text-white ml-2">{new Date(profile.lastActivity).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total referrals:</span>
                      <span className="text-white ml-2">{profile.referralsMade}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Passport ID:</span>
                      <span className="text-white ml-2 font-mono">VP-{profile.id.slice(-8).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}