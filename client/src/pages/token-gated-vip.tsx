import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Crown, 
  Star, 
  Lock, 
  Unlock,
  Diamond,
  Shield,
  Coins,
  Users,
  Calendar,
  MapPin,
  Clock,
  Gift,
  Sparkles,
  Eye,
  Plus,
  Settings,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  Wallet,
  Key,
  Zap,
  Award,
  Heart,
  Camera,
  Music,
  Utensils,
  Wine
} from "lucide-react";

interface VIPExperience {
  id: string;
  eventId: number;
  title: string;
  description: string;
  category: string;
  exclusivityLevel: 'premium' | 'elite' | 'legendary';
  accessRequirements: {
    nftCollection?: string;
    tokenAddress?: string;
    minimumBalance?: number;
    specificNFTs?: string[];
    tierRequired?: string;
  };
  benefits: string[];
  capacity: number;
  currentMembers: number;
  priceETH: number;
  priceUSD: number;
  location: string;
  duration: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'ended';
  hostWallet: string;
  createdAt: string;
  marketplaceStats: {
    totalSales: number;
    averagePrice: number;
    resaleVolume: number;
  };
}

interface TokenGateStats {
  totalExperiences: number;
  activeMembers: number;
  totalRevenue: string;
  averageExclusivity: number;
  topCategories: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
}

interface UserTokens {
  nfts: Array<{
    tokenId: string;
    collection: string;
    name: string;
    image: string;
    tier?: string;
  }>;
  tokenBalances: Array<{
    symbol: string;
    balance: number;
    address: string;
  }>;
  eligibleExperiences: string[];
}

const exclusivityColors = {
  premium: 'from-blue-500 to-cyan-500',
  elite: 'from-purple-500 to-pink-500',
  legendary: 'from-yellow-500 to-orange-500'
};

const exclusivityIcons = {
  premium: Star,
  elite: Crown,
  legendary: Diamond
};

const categoryIcons = {
  dining: Utensils,
  entertainment: Music,
  lounge: Wine,
  networking: Users,
  photography: Camera,
  exclusive: Gift
};

export default function TokenGatedVIP() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExperienceData, setNewExperienceData] = useState({
    title: '',
    description: '',
    category: 'dining',
    exclusivityLevel: 'premium',
    capacity: '',
    priceETH: '',
    location: '',
    duration: '',
    benefits: [''],
    tokenAddress: '',
    minimumBalance: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch VIP experiences
  const { data: vipExperiences, isLoading } = useQuery({
    queryKey: ['/api/token-gated-vip/experiences'],
    retry: false,
  });

  // Fetch user's tokens and NFTs
  const { data: userTokens } = useQuery({
    queryKey: ['/api/token-gated-vip/user-tokens'],
    retry: false,
  });

  // Fetch marketplace stats
  const { data: marketplaceStats } = useQuery({
    queryKey: ['/api/token-gated-vip/stats'],
    retry: false,
  });

  // Create VIP experience mutation
  const createExperienceMutation = useMutation({
    mutationFn: async (experienceData: any) => {
      return await apiRequest("POST", "/api/token-gated-vip/create", experienceData);
    },
    onSuccess: () => {
      toast({
        title: "VIP Experience Created",
        description: "Your exclusive token-gated experience is now live on the marketplace.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/token-gated-vip/experiences'] });
      setShowCreateModal(false);
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create VIP experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Purchase VIP experience mutation
  const purchaseExperienceMutation = useMutation({
    mutationFn: async (experienceId: string) => {
      return await apiRequest("POST", "/api/token-gated-vip/purchase", { experienceId });
    },
    onSuccess: () => {
      toast({
        title: "VIP Access Granted",
        description: "You now have exclusive access to this premium experience!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/token-gated-vip/experiences'] });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase VIP experience. Check your token balance.",
        variant: "destructive",
      });
    },
  });

  const checkEligibility = (experience: VIPExperience) => {
    if (!userTokens) return false;
    
    // Check NFT requirements
    if (experience.accessRequirements.nftCollection) {
      const hasRequiredNFT = userTokens.nfts.some(nft => 
        nft.collection === experience.accessRequirements.nftCollection
      );
      if (!hasRequiredNFT) return false;
    }

    // Check token balance requirements
    if (experience.accessRequirements.tokenAddress && experience.accessRequirements.minimumBalance) {
      const tokenBalance = userTokens.tokenBalances.find(token => 
        token.address === experience.accessRequirements.tokenAddress
      );
      if (!tokenBalance || tokenBalance.balance < experience.accessRequirements.minimumBalance) {
        return false;
      }
    }

    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-party-gradient-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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
          <Crown className="w-16 h-16 text-yellow-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            Token-Gated VIP Experiences
          </h1>
          <p className="text-white/90 mt-2 text-xl">Exclusive experiences for NFT holders and token owners</p>
        </div>

        {/* Feature Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Shield className="w-8 h-8 mr-3 text-yellow-200" />
              Blockchain-Verified Exclusivity
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Premium experiences that only verified token holders can access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Key className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Token Verification</h3>
                <p className="text-white/80 text-sm">Automatic NFT & token balance checks</p>
              </div>
              <div className="text-center">
                <Diamond className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Tiered Access</h3>
                <p className="text-white/80 text-sm">Premium, Elite & Legendary experiences</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Secondary Market</h3>
                <p className="text-white/80 text-sm">Trade access passes on marketplace</p>
              </div>
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-party-green mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Exclusive Benefits</h3>
                <p className="text-white/80 text-sm">VIP perks only token holders enjoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Stats */}
        {marketplaceStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.totalExperiences || '23'}</div>
                <p className="text-gray-600 text-sm">VIP Experiences</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.activeMembers || '447'}</div>
                <p className="text-gray-600 text-sm">VIP Members</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.totalRevenue || '47.2 ETH'}</div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.averageExclusivity || '8.9'}/10</div>
                <p className="text-gray-600 text-sm">Exclusivity Score</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Token Overview */}
        {userTokens && (
          <Card className="mb-8 bg-white/95 backdrop-blur border-2 border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-6 h-6 mr-2 text-blue-600" />
                Your Token Portfolio
              </CardTitle>
              <CardDescription>NFTs and tokens that grant you VIP access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-3">Your NFTs</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {userTokens.nfts.slice(0, 4).map((nft, index) => (
                      <div key={index} className="border rounded-lg p-3 text-center">
                        <div className="w-full h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded mb-2 flex items-center justify-center">
                          <Award className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">{nft.name}</p>
                        <p className="text-xs text-gray-500">{nft.collection}</p>
                        {nft.tier && (
                          <Badge className="mt-1 text-xs">{nft.tier}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3">Token Balances</h4>
                  <div className="space-y-2">
                    {userTokens.tokenBalances.map((token, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <Coins className="w-4 h-4 mr-2 text-yellow-600" />
                          <span className="font-medium">{token.symbol}</span>
                        </div>
                        <span className="font-bold">{token.balance.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      You're eligible for {userTokens.eligibleExperiences.length} VIP experiences
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create VIP Experience
          </Button>
          <Button 
            variant="outline"
            className="font-bold py-3 px-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-800"
          >
            <Eye className="w-5 h-5 mr-2" />
            Browse Marketplace
          </Button>
        </div>

        {/* VIP Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipExperiences && vipExperiences.length > 0 ? (
            vipExperiences.map((experience: VIPExperience) => {
              const ExclusivityIcon = exclusivityIcons[experience.exclusivityLevel as keyof typeof exclusivityIcons];
              const CategoryIcon = categoryIcons[experience.category as keyof typeof categoryIcons] || Gift;
              const exclusivityGradient = exclusivityColors[experience.exclusivityLevel as keyof typeof exclusivityColors];
              const isEligible = checkEligibility(experience);
              const occupancyRate = (experience.currentMembers / experience.capacity) * 100;
              
              return (
                <Card key={experience.id} className="bg-white/95 backdrop-blur border-2 border-white/30 hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className={`w-full h-48 bg-gradient-to-br ${exclusivityGradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <CategoryIcon className="w-20 h-20 text-white/80" />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/50 text-white">
                          <ExclusivityIcon className="w-3 h-3 mr-1" />
                          {experience.exclusivityLevel.charAt(0).toUpperCase() + experience.exclusivityLevel.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        {isEligible ? (
                          <Badge className="bg-green-500 text-white">
                            <Unlock className="w-3 h-3 mr-1" />
                            Eligible
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500 text-white">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="flex justify-between text-white text-xs mb-1">
                            <span>{experience.priceETH} ETH</span>
                            <span>${experience.priceUSD}</span>
                          </div>
                          <div className="flex justify-between text-white text-xs">
                            <span>{experience.currentMembers}/{experience.capacity} members</span>
                            <span>{occupancyRate.toFixed(0)}% full</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{experience.title}</CardTitle>
                    <CardDescription className="text-sm">{experience.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {experience.duration}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Exclusive Benefits</h4>
                        <div className="space-y-1">
                          {experience.benefits.slice(0, 3).map((benefit, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <Star className="w-3 h-3 mr-2 text-yellow-500" />
                              {benefit}
                            </div>
                          ))}
                          {experience.benefits.length > 3 && (
                            <p className="text-xs text-gray-500">+{experience.benefits.length - 3} more benefits</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Access Requirements</h4>
                        <div className="space-y-1">
                          {experience.accessRequirements.nftCollection && (
                            <div className="text-xs text-gray-600">
                              <Award className="w-3 h-3 inline mr-1" />
                              {experience.accessRequirements.nftCollection} NFT
                            </div>
                          )}
                          {experience.accessRequirements.minimumBalance && (
                            <div className="text-xs text-gray-600">
                              <Coins className="w-3 h-3 inline mr-1" />
                              {experience.accessRequirements.minimumBalance} tokens minimum
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          disabled={!isEligible || experience.currentMembers >= experience.capacity}
                          onClick={() => purchaseExperienceMutation.mutate(experience.id)}
                        >
                          {isEligible ? (
                            <>
                              <Crown className="w-4 h-4 mr-1" />
                              Join VIP
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-1" />
                              Locked
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No VIP Experiences Available</h3>
              <p className="text-white/70 mb-6">Create the first exclusive token-gated experience for your event!</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create VIP Experience
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}