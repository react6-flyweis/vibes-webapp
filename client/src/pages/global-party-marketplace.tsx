import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  Star, 
  MapPin, 
  DollarSign, 
  Users,
  Calendar,
  Shield,
  Verified,
  TrendingUp,
  Filter,
  Search,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  Award,
  Clock,
  CreditCard,
  Zap,
  Target,
  ChevronRight,
  Music,
  Camera,
  Utensils,
  Palette,
  Mic,
  Crown
} from "lucide-react";

interface MarketplaceVendor {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  location: {
    city: string;
    country: string;
    coordinates: [number, number];
  };
  rating: number;
  reviewCount: number;
  verified: boolean;
  onChainReviews: number;
  pricing: {
    startingPrice: number;
    currency: string;
    pricingModel: 'fixed' | 'hourly' | 'package' | 'custom';
  };
  availability: {
    nextAvailable: string;
    bookedSlots: number;
    responseTime: string;
  };
  portfolio: {
    images: string[];
    videos: string[];
    testimonials: Array<{
      client: string;
      rating: number;
      comment: string;
      eventType: string;
      verified: boolean;
    }>;
  };
  blockchain: {
    contractAddress: string;
    totalBookings: number;
    successRate: number;
    averagePaymentTime: string;
  };
  services: string[];
  languages: string[];
  certifications: string[];
  socialProof: {
    eventsCompleted: number;
    clientRetention: number;
    responseRate: number;
  };
}

interface MarketplaceStats {
  totalVendors: number;
  totalBookings: number;
  averageRating: number;
  countriesServed: number;
  totalValueTransacted: string;
  activeContracts: number;
}

const categoryIcons = {
  music: Music,
  photography: Camera,
  catering: Utensils,
  decoration: Palette,
  entertainment: Mic,
  venue: Crown
};

const categoryColors = {
  music: 'from-purple-500 to-pink-500',
  photography: 'from-blue-500 to-cyan-500',
  catering: 'from-green-500 to-emerald-500',
  decoration: 'from-yellow-500 to-orange-500',
  entertainment: 'from-red-500 to-pink-500',
  venue: 'from-indigo-500 to-purple-500'
};

export default function GlobalPartyMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch marketplace vendors
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['/api/marketplace/vendors', { 
      search: searchTerm, 
      category: selectedCategory, 
      location: selectedLocation,
      priceRange,
      sortBy 
    }],
    retry: false,
  });

  // Fetch marketplace statistics
  const { data: marketplaceStats } = useQuery({
    queryKey: ['/api/marketplace/stats'],
    retry: false,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/marketplace/categories'],
    retry: false,
  });

  // Book vendor mutation
  const bookVendorMutation = useMutation({
    mutationFn: async (bookingData: { vendorId: string; eventDate: string; services: string[]; budget: number }) => {
      return await apiRequest("POST", "/api/marketplace/book", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent via smart contract. The vendor will respond soon.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/vendors'] });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: { vendorId: string; rating: number; comment: string; eventId: string }) => {
      return await apiRequest("POST", "/api/marketplace/reviews", reviewData);
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Your on-chain review has been recorded permanently on the blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace/vendors'] });
    },
  });

  const filteredVendors = vendors?.filter((vendor: MarketplaceVendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || vendor.location.country === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  }) || [];

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
          <Globe className="w-16 h-16 text-blue-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Global Party Marketplace
          </h1>
          <p className="text-white/90 mt-2 text-xl">Discover and book verified vendors worldwide with blockchain transparency</p>
        </div>

        {/* Marketplace Stats */}
        {marketplaceStats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.totalVendors || '2,847'}</div>
                <p className="text-gray-600 text-xs">Verified Vendors</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.totalBookings || '12,654'}</div>
                <p className="text-gray-600 text-xs">Total Bookings</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.averageRating || '4.8'}</div>
                <p className="text-gray-600 text-xs">Average Rating</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.countriesServed || '89'}</div>
                <p className="text-gray-600 text-xs">Countries</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.totalValueTransacted || '$2.4M'}</div>
                <p className="text-gray-600 text-xs">Value Locked</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{marketplaceStats.activeContracts || '156'}</div>
                <p className="text-gray-600 text-xs">Active Contracts</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-white/30">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Search className="w-8 h-8 mr-3 text-blue-600" />
              Find Your Perfect Vendor
            </CardTitle>
            <CardDescription>Search through verified, blockchain-powered vendor profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="DJ, photographer, caterer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="music">Music & DJs</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="catering">Catering</SelectItem>
                    <SelectItem value="decoration">Decoration</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="venue">Venues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price Range</Label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="budget">$0 - $500</SelectItem>
                    <SelectItem value="mid">$500 - $2000</SelectItem>
                    <SelectItem value="premium">$2000 - $5000</SelectItem>
                    <SelectItem value="luxury">$5000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="recent">Recently Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.length > 0 ? (
            filteredVendors.map((vendor: MarketplaceVendor) => {
              const CategoryIcon = categoryIcons[vendor.category as keyof typeof categoryIcons] || Users;
              const categoryGradient = categoryColors[vendor.category as keyof typeof categoryColors] || 'from-gray-500 to-gray-700';
              
              return (
                <Card key={vendor.id} className="bg-white/95 backdrop-blur-sm border-2 border-white/30 hover:scale-105 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedVendor(vendor.id)}>
                  <CardHeader className="pb-2">
                    <div className={`w-full h-48 bg-linear-to-br ${categoryGradient} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                      <CategoryIcon className="w-20 h-20 text-white/80" />
                      <div className="absolute top-2 left-2">
                        {vendor.verified && (
                          <Badge className="bg-green-500 text-white">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          On-chain
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm font-bold">{vendor.rating}</span>
                            <span className="text-xs ml-1">({vendor.reviewCount})</span>
                          </div>
                          <div className="text-xs">
                            {vendor.onChainReviews} on-chain reviews
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {vendor.location.city}, {vendor.location.country}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {vendor.pricing.currency}{vendor.pricing.startingPrice}+
                        </div>
                        <div className="text-xs text-gray-500">{vendor.pricing.pricingModel}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vendor.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-bold text-green-600">{vendor.blockchain.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Events Completed:</span>
                        <span className="font-bold text-blue-600">{vendor.socialProof.eventsCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-bold text-purple-600">{vendor.availability.responseTime}</span>
                      </div>
                      
                      <div className="flex gap-1 flex-wrap mt-2">
                        {vendor.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {vendor.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No vendors found</h3>
              <p className="text-white/70 mb-6">Try adjusting your search criteria or browse all categories</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                  setPriceRange('all');
                }}
                className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full"
              >
                <Filter className="w-5 h-5 mr-2" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}