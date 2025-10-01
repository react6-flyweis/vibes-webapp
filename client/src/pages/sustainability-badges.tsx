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
  Leaf, 
  Shield, 
  Award, 
  Recycle,
  TreePine,
  Droplets,
  Sun,
  Wind,
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Target,
  Sparkles,
  Eye,
  Plus,
  Download,
  Share2,
  Settings,
  BarChart3,
  Zap,
  Heart,
  Truck,
  Factory,
  Home
} from "lucide-react";

interface SustainabilityBadge {
  id: string;
  userId: number;
  eventId: number;
  eventTitle: string;
  badgeType: string;
  badgeName: string;
  description: string;
  criteria: string[];
  earnedAt: string;
  blockchainTxHash: string;
  verificationStatus: 'pending' | 'verified' | 'expired';
  impactMetrics: {
    carbonSaved: number;
    wasteReduced: number;
    waterSaved: number;
    localVendorsUsed: number;
  };
  sustainabilityScore: number;
  validUntil: string;
  certificateUrl: string;
}

interface SustainabilityVendor {
  id: string;
  name: string;
  category: string;
  sustainabilityRating: number;
  certifications: string[];
  impactClaims: {
    carbonNeutral: boolean;
    zeroWaste: boolean;
    localSourcing: boolean;
    renewableEnergy: boolean;
    organicMaterials: boolean;
  };
  verificationDate: string;
  blockchainProof: string;
  location: {
    city: string;
    distance: number;
  };
  pricing: {
    basePrice: number;
    greenPremium: number;
    currency: string;
  };
}

interface SustainabilityStats {
  totalBadges: number;
  totalCarbonSaved: number;
  totalWasteReduced: number;
  totalWaterSaved: number;
  verifiedEvents: number;
  topImpactCategories: Array<{
    category: string;
    impact: number;
    badgeCount: number;
  }>;
  corporateAdoption: number;
}

const badgeTypeIcons = {
  'green_party': Leaf,
  'carbon_neutral': Wind,
  'zero_waste': Recycle,
  'local_sourcing': Home,
  'renewable_energy': Sun,
  'water_conservation': Droplets,
  'eco_transport': Truck,
  'sustainable_decor': TreePine
};

const badgeTypeColors = {
  'green_party': 'from-green-400 to-emerald-500',
  'carbon_neutral': 'from-blue-400 to-cyan-500',
  'zero_waste': 'from-yellow-400 to-orange-500',
  'local_sourcing': 'from-purple-400 to-pink-500',
  'renewable_energy': 'from-orange-400 to-yellow-500',
  'water_conservation': 'from-blue-500 to-indigo-500',
  'eco_transport': 'from-green-500 to-teal-500',
  'sustainable_decor': 'from-emerald-400 to-green-600'
};

export default function SustainabilityBadges() {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's sustainability badges
  const { data: sustainabilityBadges, isLoading } = useQuery({
    queryKey: ['/api/sustainability/badges'],
    retry: false,
  });

  // Fetch verified sustainable vendors
  const { data: sustainableVendors } = useQuery({
    queryKey: ['/api/sustainability/vendors', selectedCategory],
    retry: false,
  });

  // Fetch sustainability statistics
  const { data: sustainabilityStats } = useQuery({
    queryKey: ['/api/sustainability/stats'],
    retry: false,
  });

  // Fetch user's events for badge verification
  const { data: userEvents } = useQuery({
    queryKey: ['/api/events/user'],
    retry: false,
  });

  // Verify sustainability claim mutation
  const verifySustainabilityMutation = useMutation({
    mutationFn: async (claimData: { eventId: number; vendorChoices: string[]; sustainabilityMeasures: string[] }) => {
      return await apiRequest("POST", "/api/sustainability/verify", claimData);
    },
    onSuccess: (data) => {
      toast({
        title: "Sustainability Verified",
        description: `Congratulations! You've earned the ${data.badgeName} badge and saved ${data.carbonSaved}kg CO2.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sustainability/badges'] });
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Unable to verify sustainability claims. Please check your vendor choices.",
        variant: "destructive",
      });
    },
  });

  // Submit vendor certification mutation
  const submitVendorCertificationMutation = useMutation({
    mutationFn: async (certificationData: any) => {
      return await apiRequest("POST", "/api/sustainability/vendor-certification", certificationData);
    },
    onSuccess: () => {
      toast({
        title: "Certification Submitted",
        description: "Your sustainability claims are being verified on the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sustainability/vendors'] });
    },
  });

  const calculateTotalImpact = (badges: SustainabilityBadge[]) => {
    if (!badges) return { carbon: 0, waste: 0, water: 0 };
    
    return badges.reduce((total, badge) => ({
      carbon: total.carbon + badge.impactMetrics.carbonSaved,
      waste: total.waste + badge.impactMetrics.wasteReduced,
      water: total.water + badge.impactMetrics.waterSaved
    }), { carbon: 0, waste: 0, water: 0 });
  };

  const totalImpact = calculateTotalImpact(sustainabilityBadges);

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
          <Leaf className="w-16 h-16 text-green-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Blockchain Sustainability Badges
          </h1>
          <p className="text-white/90 mt-2 text-xl">Earn verified green credentials for eco-conscious event choices</p>
        </div>

        {/* Feature Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Shield className="w-8 h-8 mr-3 text-green-200" />
              Verified Environmental Impact
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              Blockchain-verified sustainability credentials for events and vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <TreePine className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Carbon Tracking</h3>
                <p className="text-white/80 text-sm">Measure and reduce event carbon footprint</p>
              </div>
              <div className="text-center">
                <Recycle className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Waste Reduction</h3>
                <p className="text-white/80 text-sm">Zero-waste event certification</p>
              </div>
              <div className="text-center">
                <Home className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Local Sourcing</h3>
                <p className="text-white/80 text-sm">Support local eco-friendly vendors</p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-party-green mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Blockchain Verified</h3>
                <p className="text-white/80 text-sm">Immutable sustainability proof</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Impact Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
            <CardContent className="p-4 text-center">
              <Wind className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalImpact.carbon}kg</div>
              <p className="text-gray-600 text-sm">CO2 Saved</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
            <CardContent className="p-4 text-center">
              <Recycle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalImpact.waste}kg</div>
              <p className="text-gray-600 text-sm">Waste Reduced</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
            <CardContent className="p-4 text-center">
              <Droplets className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalImpact.water}L</div>
              <p className="text-gray-600 text-sm">Water Saved</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{sustainabilityBadges?.length || 0}</div>
              <p className="text-gray-600 text-sm">Badges Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Global Sustainability Stats */}
        {sustainabilityStats && (
          <Card className="mb-8 bg-white/95 backdrop-blur border-2 border-white/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
                Global Sustainability Impact
              </CardTitle>
              <CardDescription>Platform-wide environmental achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{sustainabilityStats.totalBadges || '1,247'}</div>
                  <p className="text-sm text-gray-600">Total Badges</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{sustainabilityStats.totalCarbonSaved || '45.2'}T</div>
                  <p className="text-sm text-gray-600">Carbon Saved</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600">{sustainabilityStats.totalWasteReduced || '12.8'}T</div>
                  <p className="text-sm text-gray-600">Waste Reduced</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{sustainabilityStats.verifiedEvents || '589'}</div>
                  <p className="text-sm text-gray-600">Green Events</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{sustainabilityStats.corporateAdoption || '73'}%</div>
                  <p className="text-sm text-gray-600">Corporate Adoption</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            onClick={() => verifySustainabilityMutation.mutate({ 
              eventId: 1, 
              vendorChoices: ['vendor_eco_1', 'vendor_eco_2'], 
              sustainabilityMeasures: ['zero_waste', 'local_sourcing'] 
            })}
            className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Verify My Event
          </Button>
          <Button 
            onClick={() => setShowVendorModal(true)}
            variant="outline"
            className="font-bold py-3 px-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-800"
          >
            <Leaf className="w-5 h-5 mr-2" />
            Browse Green Vendors
          </Button>
        </div>

        {/* Sustainability Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sustainabilityBadges && sustainabilityBadges.length > 0 ? (
            sustainabilityBadges.map((badge: SustainabilityBadge) => {
              const BadgeIcon = badgeTypeIcons[badge.badgeType as keyof typeof badgeTypeIcons] || Award;
              const badgeGradient = badgeTypeColors[badge.badgeType as keyof typeof badgeTypeColors] || 'from-green-400 to-emerald-500';
              
              return (
                <Card key={badge.id} className="bg-white/95 backdrop-blur border-2 border-white/30 hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-2">
                    <div className={`w-full h-48 bg-gradient-to-br ${badgeGradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <BadgeIcon className="w-20 h-20 text-white/80" />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${badge.verificationStatus === 'verified' ? 'bg-green-500' : badge.verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                          {badge.verificationStatus === 'verified' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : badge.verificationStatus === 'pending' ? (
                            'Pending'
                          ) : (
                            'Expired'
                          )}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-gray-800">
                          Score: {badge.sustainabilityScore}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-black/50 rounded-lg p-2">
                          <div className="grid grid-cols-3 gap-2 text-white text-xs">
                            <div className="text-center">
                              <div className="font-bold">{badge.impactMetrics.carbonSaved}kg</div>
                              <div>CO2 Saved</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{badge.impactMetrics.wasteReduced}kg</div>
                              <div>Waste Cut</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{badge.impactMetrics.waterSaved}L</div>
                              <div>Water Saved</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{badge.badgeName}</CardTitle>
                    <CardDescription className="text-sm">{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{badge.eventTitle}</span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm mb-2">Criteria Met</h4>
                        <div className="space-y-1">
                          {badge.criteria.slice(0, 3).map((criterion, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {criterion}
                            </div>
                          ))}
                          {badge.criteria.length > 3 && (
                            <p className="text-xs text-gray-500">+{badge.criteria.length - 3} more criteria</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Earned: {new Date(badge.earnedAt).toLocaleDateString()}</span>
                        <span>Valid until: {new Date(badge.validUntil).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View Certificate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Sustainability Badges Yet</h3>
              <p className="text-white/70 mb-6">Start making eco-friendly choices to earn your first green badge!</p>
              <Button 
                onClick={() => verifySustainabilityMutation.mutate({ 
                  eventId: 1, 
                  vendorChoices: ['vendor_eco_1'], 
                  sustainabilityMeasures: ['local_sourcing'] 
                })}
                className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Verify My First Event
              </Button>
            </div>
          )}
        </div>

        {/* Sustainable Vendors Section */}
        <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-6 h-6 mr-2 text-green-600" />
              Verified Sustainable Vendors
            </CardTitle>
            <CardDescription>Blockchain-verified eco-friendly event service providers</CardDescription>
          </CardHeader>
          <CardContent>
            {sustainableVendors && sustainableVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sustainableVendors.slice(0, 6).map((vendor: SustainabilityVendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{vendor.name}</h4>
                        <p className="text-sm text-gray-600">{vendor.category}</p>
                        <p className="text-xs text-gray-500">{vendor.location.city} • {vendor.location.distance}km away</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-bold">{vendor.sustainabilityRating}/5</span>
                        </div>
                        <p className="text-sm text-green-600">${vendor.pricing.basePrice}+</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap mb-3">
                      {vendor.certifications.slice(0, 3).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {cert}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className={`flex items-center ${vendor.impactClaims.carbonNeutral ? 'text-green-600' : 'text-gray-400'}`}>
                        <Wind className="w-3 h-3 mr-1" />
                        Carbon Neutral
                      </div>
                      <div className={`flex items-center ${vendor.impactClaims.zeroWaste ? 'text-green-600' : 'text-gray-400'}`}>
                        <Recycle className="w-3 h-3 mr-1" />
                        Zero Waste
                      </div>
                      <div className={`flex items-center ${vendor.impactClaims.localSourcing ? 'text-green-600' : 'text-gray-400'}`}>
                        <Home className="w-3 h-3 mr-1" />
                        Local Sourcing
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-2" />
                <p>No verified sustainable vendors in your area yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowVendorModal(true)}
                  variant="outline"
                >
                  Submit Vendor for Verification
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}