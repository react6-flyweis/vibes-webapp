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
  Sparkles, 
  Target, 
  Gift, 
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  Eye,
  Share2,
  Award,
  DollarSign,
  ShoppingBag,
  Zap,
  Camera,
  QrCode,
  CheckCircle
} from "lucide-react";

interface BrandedEvent {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  eventId: number;
  eventTitle: string;
  microEventType: 'tasting' | 'demo' | 'giveaway' | 'activation' | 'contest';
  title: string;
  description: string;
  sponsorshipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  budget: number;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  prizes: string[];
  location: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  engagement: {
    views: number;
    participations: number;
    shares: number;
    userGenerated: number;
  };
  blockchain: {
    verified: boolean;
    nftRewards: boolean;
    loyaltyPoints: number;
    txHash?: string;
  };
}

interface BrandCampaign {
  id: string;
  brandName: string;
  category: string;
  totalBudget: number;
  remainingBudget: number;
  targetDemographic: string[];
  preferredEvents: string[];
  campaignGoals: string[];
  minEngagement: number;
  maxCostPerEngagement: number;
  status: 'active' | 'paused' | 'completed';
}

interface AdPlatformStats {
  totalBrands: number;
  activeCampaigns: number;
  totalSpend: number;
  averageEngagement: number;
  topPerformingCategory: string;
  revenueShare: number;
}

export default function BrandedMicroEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [newEventType, setNewEventType] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    maxParticipants: "",
    prizes: "",
    location: ""
  });

  // Fetch branded events data
  const { data: brandedEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/branded-events"],
  });

  const { data: brandCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["/api/brand-campaigns"],
  });

  const { data: adStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/branded-events/stats"],
  });

  // Create micro-event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/branded-events/create", data);
    },
    onSuccess: () => {
      toast({
        title: "Micro-Event Created",
        description: "Brand activation has been scheduled and blockchain verified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/branded-events"] });
      setFormData({
        title: "",
        description: "",
        duration: "",
        maxParticipants: "",
        prizes: "",
        location: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Participate in micro-event mutation
  const participateMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return await apiRequest("POST", "/api/branded-events/participate", { eventId });
    },
    onSuccess: () => {
      toast({
        title: "Participation Confirmed",
        description: "You've joined the brand activation. Check for rewards!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/branded-events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Participation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateEvent = () => {
    if (!selectedBrand || !newEventType || !formData.title) return;
    
    createEventMutation.mutate({
      brandId: selectedBrand,
      microEventType: newEventType,
      ...formData,
      duration: parseInt(formData.duration),
      maxParticipants: parseInt(formData.maxParticipants),
      prizes: formData.prizes.split(',').map(p => p.trim())
    });
  };

  const handleParticipate = (eventId: string) => {
    participateMutation.mutate(eventId);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-700 bg-amber-100';
      case 'silver': return 'text-gray-700 bg-gray-100';
      case 'gold': return 'text-yellow-700 bg-yellow-100';
      case 'platinum': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-700 bg-blue-100';
      case 'active': return 'text-green-700 bg-green-100';
      case 'completed': return 'text-gray-700 bg-gray-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'tasting': return Gift;
      case 'demo': return Eye;
      case 'giveaway': return Star;
      case 'activation': return Zap;
      case 'contest': return Award;
      default: return Sparkles;
    }
  };

  if (eventsLoading || campaignsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Branded Micro-Events
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Transform events into advertising platforms with blockchain-verified brand activations
          </p>
        </div>

        {/* Ad Platform Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-green-400" />
                Total Ad Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${adStats.totalSpend?.toLocaleString() || '0'}
              </div>
              <p className="text-purple-100 text-sm">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {adStats.activeCampaigns || 0}
              </div>
              <p className="text-purple-100 text-sm">Live brand activations</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-pink-400" />
                Avg Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-400">
                {adStats.averageEngagement || 0}%
              </div>
              <p className="text-purple-100 text-sm">User interaction rate</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                Revenue Share
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {adStats.revenueShare || 0}%
              </div>
              <p className="text-purple-100 text-sm">Platform commission</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Micro-Events */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-6 w-6 text-pink-400" />
                  Live Brand Activations
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Interactive sponsored experiences within events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {brandedEvents.map((event: BrandedEvent) => {
                    const IconComponent = getEventTypeIcon(event.microEventType);
                    return (
                      <div key={event.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{event.title}</h3>
                              <p className="text-purple-100 text-sm">{event.brandName}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getTierColor(event.sponsorshipTier)}>
                              {event.sponsorshipTier}
                            </Badge>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-purple-100 text-sm mb-3">{event.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-purple-200">Duration:</span>
                            <span className="text-white ml-2">{event.duration} min</span>
                          </div>
                          <div>
                            <span className="text-purple-200">Participants:</span>
                            <span className="text-white ml-2">
                              {event.currentParticipants}/{event.maxParticipants}
                            </span>
                          </div>
                          <div>
                            <span className="text-purple-200">Location:</span>
                            <span className="text-white ml-2">{event.location}</span>
                          </div>
                          <div>
                            <span className="text-purple-200">Budget:</span>
                            <span className="text-green-400 ml-2">${event.budget}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-blue-400" />
                              {event.engagement.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-green-400" />
                              {event.engagement.participations}
                            </span>
                            <span className="flex items-center gap-1">
                              <Share2 className="h-4 w-4 text-pink-400" />
                              {event.engagement.shares}
                            </span>
                          </div>

                          {event.blockchain.verified && (
                            <div className="flex items-center gap-1 text-green-400">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">Verified</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-purple-200">Prizes:</span>
                            <span className="text-yellow-400 ml-2">
                              {event.prizes.join(', ')}
                            </span>
                          </div>
                          
                          {event.status === 'active' && (
                            <Button 
                              size="sm"
                              onClick={() => handleParticipate(event.id)}
                              disabled={participateMutation.isPending}
                              className="bg-pink-600 hover:bg-pink-700"
                            >
                              {participateMutation.isPending ? (
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <>
                                  <Gift className="h-4 w-4 mr-1" />
                                  Join Now
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        {event.blockchain.nftRewards && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-purple-200">NFT Rewards Available</span>
                              <span className="text-yellow-400">
                                +{event.blockchain.loyaltyPoints} loyalty points
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Brand Campaign Dashboard */}
          <div>
            <Card className="bg-white/10 backdrop-blur border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-6 w-6 text-pink-400" />
                  Active Brand Campaigns
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Current advertising campaigns seeking events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {brandCampaigns.map((campaign: BrandCampaign) => (
                    <div key={campaign.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white">{campaign.brandName}</h3>
                        <Badge className="text-xs bg-green-100 text-green-700">
                          {campaign.status}
                        </Badge>
                      </div>
                      
                      <p className="text-purple-100 text-sm mb-2">{campaign.category}</p>
                      
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-purple-200">Budget:</span>
                          <span className="text-green-400 ml-2">
                            ${campaign.remainingBudget.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-200">Target:</span>
                          <span className="text-white ml-2">
                            {campaign.targetDemographic.join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-200">Max CPE:</span>
                          <span className="text-white ml-2">
                            ${campaign.maxCostPerEngagement}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Micro-Event */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Star className="h-6 w-6 text-yellow-400" />
                  Create Brand Activation
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Design a new sponsored micro-event
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand" className="text-purple-100">Select Brand</Label>
                  <Select value={selectedBrand || ""} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose brand partner" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandCampaigns.map((campaign: BrandCampaign) => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                          {campaign.brandName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="eventType" className="text-purple-100">Event Type</Label>
                  <Select value={newEventType} onValueChange={setNewEventType}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select activation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasting">Product Tasting</SelectItem>
                      <SelectItem value="demo">Live Demo</SelectItem>
                      <SelectItem value="giveaway">Prize Giveaway</SelectItem>
                      <SelectItem value="activation">Brand Activation</SelectItem>
                      <SelectItem value="contest">Interactive Contest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-purple-100">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Tequila Sunset Tasting Bar"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-purple-100">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Interactive tequila tasting with expert mixologist..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-purple-100">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="participants" className="text-purple-100">Max Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      placeholder="50"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="prizes" className="text-purple-100">Prizes (comma-separated)</Label>
                  <Input
                    id="prizes"
                    placeholder="Premium tequila bottle, branded glasses, gift cards"
                    value={formData.prizes}
                    onChange={(e) => setFormData(prev => ({ ...prev, prizes: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-purple-100">Location within Event</Label>
                  <Input
                    id="location"
                    placeholder="Main bar area, booth #5"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                  />
                </div>

                <Button 
                  onClick={handleCreateEvent} 
                  disabled={createEventMutation.isPending || !selectedBrand || !newEventType}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  {createEventMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Create Brand Activation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}