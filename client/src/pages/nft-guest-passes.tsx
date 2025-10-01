import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Award, 
  Star, 
  Trophy, 
  Zap, 
  Camera,
  Music,
  Calendar,
  Share2,
  Users,
  Crown,
  Gift,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  ExternalLink,
  Plus,
  Eye,
  Download,
  Wallet,
  Shield,
  Globe,
  Flame,
  Diamond
} from "lucide-react";

interface NFTPass {
  id: string;
  guestId: number;
  eventId: number;
  tokenId: string;
  level: number;
  tier: string;
  experiencePoints: number;
  engagementScore: number;
  achievements: Achievement[];
  perks: Perk[];
  createdAt: string;
  lastUpdated: string;
  metadata: {
    image: string;
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: number | string;
    }>;
  };
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  icon: string;
}

interface Perk {
  id: string;
  type: string;
  title: string;
  description: string;
  value: string;
  unlockLevel: number;
  active: boolean;
  usageCount: number;
  maxUsage: number;
}

const tierColors = {
  bronze: 'from-orange-400 to-yellow-600',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-indigo-600',
  diamond: 'from-blue-400 to-purple-600'
};

const tierIcons = {
  bronze: Award,
  silver: Star,
  gold: Trophy,
  platinum: Crown,
  diamond: Diamond
};

const achievementIcons = {
  calendar: Calendar,
  camera: Camera,
  music: Music,
  share: Share2,
  users: Users,
  heart: Heart
};

export default function NFTGuestPasses() {
  const [selectedPass, setSelectedPass] = useState<string | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [newPassData, setNewPassData] = useState({
    eventId: '',
    guestName: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's NFT passes
  const { data: nftPasses, isLoading } = useQuery({
    queryKey: ['/api/nft-passes'],
    retry: false,
  });

  // Fetch available achievements
  const { data: achievements } = useQuery({
    queryKey: ['/api/nft-passes/achievements'],
    retry: false,
  });

  // Fetch marketplace stats
  const { data: marketplaceStats } = useQuery({
    queryKey: ['/api/nft-passes/marketplace'],
    retry: false,
  });

  // Mint NFT pass mutation
  const mintPassMutation = useMutation({
    mutationFn: async (passData: { eventId: string; guestName: string }) => {
      return await apiRequest("POST", "/api/nft-passes/mint", passData);
    },
    onSuccess: () => {
      toast({
        title: "NFT Pass Minted",
        description: "Your dynamic guest pass has been created on the blockchain!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nft-passes'] });
      setShowMintModal(false);
      setNewPassData({ eventId: '', guestName: '' });
    },
    onError: () => {
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT pass. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Level up pass mutation
  const levelUpMutation = useMutation({
    mutationFn: async ({ passId, achievementId }: { passId: string; achievementId: string }) => {
      return await apiRequest("POST", "/api/nft-passes/level-up", { passId, achievementId });
    },
    onSuccess: (data) => {
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${data.newLevel} and unlocked ${data.newTier} tier!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/nft-passes'] });
    },
  });

  const calculateLevelProgress = (currentXP: number, level: number) => {
    const xpForNextLevel = level * 100; // Simple progression: 100, 200, 300 XP per level
    const xpForCurrentLevel = (level - 1) * 100;
    const progressXP = currentXP - xpForCurrentLevel;
    const neededXP = xpForNextLevel - xpForCurrentLevel;
    return Math.min((progressXP / neededXP) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-party-gradient-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated blockchain network background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-700"></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <line x1="250" y1="250" x2="666" y2="333" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse"/>
          <line x1="666" y1="333" x2="500" y2="750" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse delay-500"/>
          <line x1="500" y1="750" x2="250" y2="250" stroke="url(#connectionGradient)" strokeWidth="1" className="animate-pulse delay-1000"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header with Blockchain Theme */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Diamond className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Dynamic NFT Guest Passes
          </h1>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            Level up your event experiences with blockchain-verified guest passes that evolve with your engagement
          </p>
          
          {/* Live Marketplace Stats */}
          {marketplaceStats && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{(marketplaceStats as any).totalPasses}</div>
                <div className="text-purple-300">Active Passes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{(marketplaceStats as any).activeUsers}</div>
                <div className="text-purple-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{(marketplaceStats as any).totalVolume}</div>
                <div className="text-purple-300">Total Volume</div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Trophy className="w-8 h-8 mr-3 text-yellow-200" />
              Gamified Party Experience
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Earn XP, unlock achievements, and level up your party status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Zap className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Dynamic Evolution</h3>
                <p className="text-white/80 text-sm">Passes evolve based on your engagement</p>
              </div>
              <div className="text-center">
                <Target className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Achievement System</h3>
                <p className="text-white/80 text-sm">Unlock rewards through party activities</p>
              </div>
              <div className="text-center">
                <Gift className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Exclusive Perks</h3>
                <p className="text-white/80 text-sm">Access VIP areas and special discounts</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-party-green mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Blockchain Verified</h3>
                <p className="text-white/80 text-sm">Authentic ownership on-chain</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Stats */}
        {marketplaceStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{(marketplaceStats as any).totalPasses || '1,247'}</div>
                <p className="text-gray-600 text-sm">Active Passes</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{(marketplaceStats as any).activeUsers || '892'}</div>
                <p className="text-gray-600 text-sm">Active Users</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{(marketplaceStats as any).averageLevel || '4.2'}</div>
                <p className="text-gray-600 text-sm">Avg Level</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{(marketplaceStats as any).totalValue || '45.8 ETH'}</div>
                <p className="text-gray-600 text-sm">Total Value</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <Button 
            onClick={() => setShowMintModal(true)}
            className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Mint New NFT Pass
          </Button>
        </div>

        {/* NFT Passes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nftPasses && nftPasses.length > 0 ? (
            nftPasses.map((pass: NFTPass) => {
              const TierIcon = tierIcons[pass.tier as keyof typeof tierIcons] || Award;
              const tierGradient = tierColors[pass.tier as keyof typeof tierColors] || tierColors.bronze;
              const levelProgress = calculateLevelProgress(pass.experiencePoints, pass.level);
              const nextLevelXP = pass.level * 100;
              
              return (
                <Card key={pass.id} className="bg-white/95 backdrop-blur border-2 border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedPass(pass.id)}>
                  <CardHeader className="pb-2">
                    <div className={`w-full h-48 bg-gradient-to-br ${tierGradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <TierIcon className="w-20 h-20 text-white/80" />
                      <div className="absolute top-2 left-2">
                        <Badge className={`bg-black/50 text-white`}>
                          Level {pass.level}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          {pass.tier.charAt(0).toUpperCase() + pass.tier.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="flex justify-between text-white text-xs mb-1">
                            <span>{pass.experiencePoints} XP</span>
                            <span>{nextLevelXP} XP</span>
                          </div>
                          <Progress value={levelProgress} className="h-1" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{pass.metadata.name}</CardTitle>
                    <CardDescription>Token ID: {pass.tokenId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Engagement Score:</span>
                        <span className="font-bold text-blue-600">{pass.engagementScore}%</span>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-sm mb-2">Recent Achievements</h4>
                        <div className="flex gap-1 flex-wrap">
                          {pass.achievements.filter(a => a.completed).slice(0, 3).map((achievement) => {
                            const AchievementIcon = achievementIcons[achievement.icon as keyof typeof achievementIcons] || Award;
                            return (
                              <div key={achievement.id} className="flex items-center bg-gray-100 rounded-full px-2 py-1">
                                <AchievementIcon className="w-3 h-3 mr-1 text-green-600" />
                                <span className="text-xs">{achievement.title}</span>
                              </div>
                            );
                          })}
                          {pass.achievements.filter(a => a.completed).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{pass.achievements.filter(a => a.completed).length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Active Perks</h4>
                        <div className="space-y-1">
                          {pass.perks.filter(p => p.active).slice(0, 2).map((perk) => (
                            <div key={perk.id} className="flex items-center justify-between text-xs bg-green-50 p-2 rounded">
                              <span className="font-medium">{perk.title}</span>
                              <span className="text-green-600">{perk.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No NFT Passes Yet</h3>
              <p className="text-white/70 mb-6">Create your first dynamic guest pass to start earning XP and unlocking achievements!</p>
              <Button 
                onClick={() => setShowMintModal(true)}
                className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
              >
                <Plus className="w-5 h-5 mr-2" />
                Mint Your First Pass
              </Button>
            </div>
          )}
        </div>

        {/* Available Achievements Section */}
        {achievements && achievements.length > 0 && (
          <Card className="mt-8 bg-white/95 backdrop-blur border-2 border-white/30">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Target className="w-6 h-6 mr-2 text-orange-600" />
                Available Achievements
              </CardTitle>
              <CardDescription>Complete these activities to earn XP and level up your NFT pass</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement: Achievement) => {
                  const AchievementIcon = achievementIcons[achievement.icon as keyof typeof achievementIcons] || Award;
                  
                  return (
                    <div key={achievement.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <AchievementIcon className={`w-5 h-5 ${achievement.completed ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        <div className="flex items-center mt-1">
                          <Zap className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs font-medium text-yellow-600">{achievement.xpReward} XP</span>
                        </div>
                      </div>
                      {achievement.completed && (
                        <div className="flex-shrink-0">
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}