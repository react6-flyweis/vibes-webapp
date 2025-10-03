import { useState, useEffect } from "react";
import { ShoppingBag, Camera, Scan, MapPin, Star, Heart, Share2, Zap, CreditCard, Clock, Users, Tag, TrendingUp, Eye, Filter, Search, Plus, ShoppingCart, Wallet, QrCode, Smartphone, Store, Gift, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ShoppableItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: "outfit" | "drink" | "merch" | "decor" | "food" | "accessory";
  image: string;
  description: string;
  availability: "in-stock" | "limited" | "pre-order" | "sold-out";
  tags: string[];
  rating: number;
  reviews: number;
  isExclusive: boolean;
  discountPercentage?: number;
  quickBuy: boolean;
  estimatedDelivery: string;
  sizes?: string[];
  colors?: string[];
  location?: {
    venue: string;
    area: string;
    booth?: string;
  };
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
  };
  socialProof: {
    purchases: number;
    likes: number;
    shares: number;
    views: number;
  };
}

interface ShoppableMoment {
  id: string;
  type: "outfit-scan" | "drink-order" | "decor-link" | "brand-activation" | "social-share";
  timestamp: string;
  location: string;
  items: ShoppableItem[];
  context: {
    eventId: string;
    guestId?: string;
    interactionType: string;
    metadata?: any;
  };
  specialOffers?: {
    discount: number;
    code: string;
    expiresAt: string;
    minPurchase?: number;
  };
}

interface CartItem extends ShoppableItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
  momentId?: string;
}

interface BrandActivation {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  activationType: "qr-code" | "nfc-tap" | "ar-scan" | "location-trigger";
  title: string;
  description: string;
  location: string;
  isActive: boolean;
  engagement: {
    scans: number;
    conversions: number;
    shares: number;
  };
  rewards: {
    type: "discount" | "freebie" | "points" | "exclusive-access";
    value: string;
    description: string;
  };
  featuredProducts: string[];
  socialChallenge?: {
    hashtag: string;
    description: string;
    prize: string;
  };
}

export default function InEventCommerce() {
  const [activeTab, setActiveTab] = useState("discover");
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppableItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [recentScan, setRecentScan] = useState<ShoppableMoment | null>(null);
  const [quickOrderActive, setQuickOrderActive] = useState(false);

  const { toast } = useToast();

  const { data: shoppableItems } = useQuery({
    queryKey: ["/api/commerce/items", selectedCategory, searchQuery],
    refetchInterval: 30000,
  });

  const { data: shoppableMoments } = useQuery({
    queryKey: ["/api/commerce/moments"],
    refetchInterval: 15000,
  });

  const { data: brandActivations } = useQuery({
    queryKey: ["/api/commerce/brand-activations"],
    refetchInterval: 30000,
  });

  const { data: cartData } = useQuery({
    queryKey: ["/api/commerce/cart"],
    refetchInterval: 10000,
  });

  const { data: orderHistory } = useQuery({
    queryKey: ["/api/commerce/orders"],
    refetchInterval: 60000,
  });

  const scanItemMutation = useMutation({
    mutationFn: async (data: { itemType: string; location?: string }) => {
      const response = await apiRequest("POST", "/api/commerce/scan", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRecentScan(data.moment);
      toast({
        title: "Item Scanned!",
        description: `Found ${data.moment.items.length} shoppable items`,
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (data: { itemId: string; quantity: number; size?: string; color?: string }) => {
      const response = await apiRequest("POST", "/api/commerce/cart/add", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Item added successfully",
      });
    },
  });

  const quickBuyMutation = useMutation({
    mutationFn: async (data: { itemId: string; size?: string; color?: string }) => {
      const response = await apiRequest("POST", "/api/commerce/quick-buy", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Placed!",
        description: "Your item will be delivered shortly",
      });
    },
  });

  const activateBrandOfferMutation = useMutation({
    mutationFn: async (activationId: string) => {
      const response = await apiRequest("POST", `/api/commerce/brand-activations/${activationId}/activate`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Offer Activated!",
        description: `${data.reward.description} - Use code: ${data.code}`,
      });
    },
  });

  const shareItemMutation = useMutation({
    mutationFn: async (data: { itemId: string; platform: string }) => {
      const response = await apiRequest("POST", "/api/commerce/share", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Shared Successfully",
        description: "Item shared to your social media",
      });
    },
  });

  const items: ShoppableItem[] = shoppableItems || [
    {
      id: "outfit-neon-dress",
      name: "Electric Neon Party Dress",
      brand: "VibeFashion",
      price: 89.99,
      originalPrice: 129.99,
      category: "outfit",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      description: "Stunning neon dress perfect for party vibes. Made with sustainable materials and LED accent lighting.",
      availability: "in-stock",
      tags: ["party", "neon", "sustainable", "led"],
      rating: 4.8,
      reviews: 127,
      isExclusive: true,
      discountPercentage: 31,
      quickBuy: true,
      estimatedDelivery: "Tonight by 11PM",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Electric Blue", "Neon Pink", "Cyber Green"],
      location: {
        venue: "Club Cosmos",
        area: "VIP Lounge",
        booth: "Fashion Corner"
      },
      seller: {
        id: "seller-vibefashion",
        name: "VibeFashion",
        avatar: "https://images.unsplash.com/photo-1560472355-536de3962603?w=150",
        verified: true,
        rating: 4.9
      },
      socialProof: {
        purchases: 23,
        likes: 456,
        shares: 89,
        views: 2341
      }
    },
    {
      id: "drink-cosmic-cocktail",
      name: "Cosmic Sunset Cocktail",
      brand: "Stellar Bar",
      price: 16.50,
      category: "drink",
      image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
      description: "Premium craft cocktail with color-changing elements and edible glitter. Instagrammable and delicious!",
      availability: "in-stock",
      tags: ["cocktail", "premium", "instagrammable", "color-changing"],
      rating: 4.7,
      reviews: 89,
      isExclusive: false,
      quickBuy: true,
      estimatedDelivery: "5-10 minutes",
      location: {
        venue: "Club Cosmos",
        area: "Main Bar"
      },
      seller: {
        id: "seller-stellar-bar",
        name: "Stellar Bar",
        avatar: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150",
        verified: true,
        rating: 4.8
      },
      socialProof: {
        purchases: 156,
        likes: 234,
        shares: 67,
        views: 1234
      }
    },
    {
      id: "merch-glow-bracelet",
      name: "LED Sync Bracelet",
      brand: "TechVibes",
      price: 29.99,
      originalPrice: 39.99,
      category: "merch",
      image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400",
      description: "Smart LED bracelet that syncs with the party's music and lighting. Connect with other party-goers!",
      availability: "limited",
      tags: ["led", "music-sync", "smart", "party-tech"],
      rating: 4.6,
      reviews: 203,
      isExclusive: true,
      discountPercentage: 25,
      quickBuy: true,
      estimatedDelivery: "Available at merch booth",
      colors: ["RGB", "White", "Gold"],
      location: {
        venue: "Club Cosmos",
        area: "Tech Corner",
        booth: "TechVibes Stand"
      },
      seller: {
        id: "seller-techvibes",
        name: "TechVibes",
        avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150",
        verified: true,
        rating: 4.7
      },
      socialProof: {
        purchases: 78,
        likes: 345,
        shares: 123,
        views: 987
      }
    },
    {
      id: "food-neon-sushi",
      name: "Glow Sushi Platter",
      brand: "Neon Bites",
      price: 24.99,
      category: "food",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
      description: "Artisanal sushi with edible neon elements. A feast for your eyes and taste buds!",
      availability: "in-stock",
      tags: ["sushi", "artisanal", "neon", "instagram-worthy"],
      rating: 4.9,
      reviews: 67,
      isExclusive: false,
      quickBuy: true,
      estimatedDelivery: "15-20 minutes",
      location: {
        venue: "Club Cosmos",
        area: "Food Court"
      },
      seller: {
        id: "seller-neon-bites",
        name: "Neon Bites",
        avatar: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=150",
        verified: true,
        rating: 4.8
      },
      socialProof: {
        purchases: 45,
        likes: 178,
        shares: 34,
        views: 567
      }
    }
  ];

  const moments: ShoppableMoment[] = shoppableMoments || [
    {
      id: "moment-1",
      type: "outfit-scan",
      timestamp: new Date().toISOString(),
      location: "Dance Floor",
      items: [items[0]],
      context: {
        eventId: "event-cosmos-night",
        guestId: "guest-sarah",
        interactionType: "camera-scan"
      },
      specialOffers: {
        discount: 20,
        code: "PARTY20",
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        minPurchase: 50
      }
    }
  ];

  const activations: BrandActivation[] = brandActivations || [
    {
      id: "activation-techvibes",
      brandId: "brand-techvibes",
      brandName: "TechVibes",
      brandLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150",
      activationType: "qr-code",
      title: "Tech Vibes Challenge",
      description: "Scan the QR code at our booth and share a video wearing our LED bracelet to win exclusive merch!",
      location: "Tech Corner",
      isActive: true,
      engagement: {
        scans: 234,
        conversions: 67,
        shares: 45
      },
      rewards: {
        type: "discount",
        value: "30% OFF",
        description: "30% off all TechVibes products"
      },
      featuredProducts: ["merch-glow-bracelet"],
      socialChallenge: {
        hashtag: "#TechVibesParty",
        description: "Show off your LED bracelet moves!",
        prize: "Free premium LED kit worth $100"
      }
    },
    {
      id: "activation-stellar-bar",
      brandId: "brand-stellar-bar",
      brandName: "Stellar Bar",
      brandLogo: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=150",
      activationType: "location-trigger",
      title: "Happy Hour Magic",
      description: "Get within 10 feet of the bar to unlock special drink discounts and limited-time cocktails!",
      location: "Main Bar",
      isActive: true,
      engagement: {
        scans: 567,
        conversions: 234,
        shares: 89
      },
      rewards: {
        type: "discount",
        value: "Buy 1 Get 1 Half Price",
        description: "Special pricing on premium cocktails"
      },
      featuredProducts: ["drink-cosmic-cocktail"]
    }
  ];

  const cartItems: CartItem[] = cartData || [
    {
      ...items[0],
      quantity: 1,
      selectedSize: "M",
      selectedColor: "Electric Blue",
      addedAt: new Date().toISOString(),
      momentId: "moment-1"
    }
  ];

  const handleScanItem = (type: string) => {
    setScannerActive(true);
    setTimeout(() => {
      setScannerActive(false);
      scanItemMutation.mutate({ itemType: type, location: "Dance Floor" });
    }, 2000);
  };

  const handleQuickBuy = (item: ShoppableItem) => {
    quickBuyMutation.mutate({ itemId: item.id });
  };

  const handleAddToCart = (item: ShoppableItem, quantity: number = 1) => {
    addToCartMutation.mutate({ itemId: item.id, quantity });
    setCart(prev => [...prev, { ...item, quantity, addedAt: new Date().toISOString() }]);
  };

  const handleActivateBrand = (activationId: string) => {
    activateBrandOfferMutation.mutate(activationId);
  };

  const handleShareItem = (item: ShoppableItem, platform: string) => {
    shareItemMutation.mutate({ itemId: item.id, platform });
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "outfit": return "👗";
      case "drink": return "🍹";
      case "merch": return "🎁";
      case "food": return "🍱";
      case "accessory": return "💎";
      case "decor": return "🎨";
      default: return "🛍️";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock": return "bg-green-500";
      case "limited": return "bg-yellow-500";
      case "pre-order": return "bg-blue-500";
      case "sold-out": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">In-Event Commerce</h1>
            <Zap className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Shop the party in real-time! Tap to buy outfits, order drinks, and discover exclusive brand moments
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => handleScanItem("outfit")}
            disabled={scannerActive}
            className="h-16 bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            <div className="flex flex-col items-center gap-1">
              <Camera className="h-5 w-5" />
              <span className="text-sm">{scannerActive ? "Scanning..." : "Scan Outfit"}</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setQuickOrderActive(!quickOrderActive)}
            className="h-16 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <div className="flex flex-col items-center gap-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Quick Order</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setActiveTab("brands")}
            className="h-16 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <div className="flex flex-col items-center gap-1">
              <QrCode className="h-5 w-5" />
              <span className="text-sm">Scan QR</span>
            </div>
          </Button>
          
          <Button
            onClick={() => setShowCart(true)}
            className="h-16 bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 relative"
          >
            <div className="flex flex-col items-center gap-1">
              <Wallet className="h-5 w-5" />
              <span className="text-sm">Cart ({cart.length})</span>
            </div>
            {cart.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                {cart.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Recent Scan Alert */}
        {recentScan && (
          <Card className="border-green-500/20 bg-green-500/10 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Scan className="h-5 w-5 text-green-400" />
                Scan Successful! Found {recentScan.items.length} items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentScan.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.brand}</p>
                      <p className="text-green-400 font-bold text-sm">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleQuickBuy(item)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>
              {recentScan.specialOffers && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 font-medium">
                    🎉 Special Offer: {recentScan.specialOffers.discount}% off with code {recentScan.specialOffers.code}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Expires in {Math.round((new Date(recentScan.specialOffers.expiresAt).getTime() - Date.now()) / 60000)} minutes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/40 border-purple-500/20">
            <TabsTrigger value="discover" className="data-[state=active]:bg-purple-600">
              <Store className="h-4 w-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="moments" className="data-[state=active]:bg-blue-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Moments
            </TabsTrigger>
            <TabsTrigger value="brands" className="data-[state=active]:bg-green-600">
              <QrCode className="h-4 w-4 mr-2" />
              Brands
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-600">
              <Clock className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-pink-600">
              <Share2 className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Filters */}
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="outfit">👗 Outfits</SelectItem>
                        <SelectItem value="drink">🍹 Drinks</SelectItem>
                        <SelectItem value="merch">🎁 Merch</SelectItem>
                        <SelectItem value="food">🍱 Food</SelectItem>
                        <SelectItem value="accessory">💎 Accessories</SelectItem>
                        <SelectItem value="decor">🎨 Decor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Price Range</Label>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={500}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400 mt-1">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Quick Filters</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer text-xs">🔥 Trending</Badge>
                      <Badge variant="outline" className="cursor-pointer text-xs">⚡ Quick Buy</Badge>
                      <Badge variant="outline" className="cursor-pointer text-xs">💎 Exclusive</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="border-purple-500/20 bg-black/40 backdrop-blur-lg hover:bg-black/60 transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className={`${getAvailabilityColor(item.availability)} text-white text-xs`}>
                        {item.availability}
                      </Badge>
                      {item.isExclusive && (
                        <Badge className="bg-purple-600 text-white text-xs">
                          ⭐ Exclusive
                        </Badge>
                      )}
                      {item.discountPercentage && (
                        <Badge className="bg-red-600 text-white text-xs">
                          -{item.discountPercentage}%
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleShareItem(item, "instagram")}
                        className="bg-black/60 text-white hover:bg-black/80"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-black/60 text-white border-white/20 text-xs">
                        {getCategoryIcon(item.category)} {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.brand}</p>
                      <p className="text-gray-300 text-xs line-clamp-2 mt-1">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-xs">{item.rating}</span>
                        <span className="text-gray-400 text-xs">({item.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Eye className="h-3 w-3" />
                        {item.socialProof.views}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Heart className="h-3 w-3" />
                        {item.socialProof.likes}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-lg">{formatPrice(item.price)}</span>
                          {item.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">{formatPrice(item.originalPrice)}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{item.estimatedDelivery}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={item.seller.avatar} />
                          <AvatarFallback>{item.seller.name[0]}</AvatarFallback>
                        </Avatar>
                        {item.seller.verified && (
                          <Badge className="bg-blue-500 text-white text-xs px-1 py-0">✓</Badge>
                        )}
                      </div>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location.area}</span>
                        {item.location.booth && <span>• {item.location.booth}</span>}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-600">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(item)}
                        className="text-white border-purple-500 hover:bg-purple-500/20"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      {item.quickBuy && (
                        <Button
                          size="sm"
                          onClick={() => handleQuickBuy(item)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Quick Buy
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Shoppable Moments Tab */}
          <TabsContent value="moments" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Live Shoppable Moments</h2>
              <p className="text-gray-400">Real-time shopping opportunities happening right now</p>
            </div>

            <div className="space-y-4">
              {moments.map((moment) => (
                <Card key={moment.id} className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg capitalize">
                          {moment.type.replace("-", " ")} Moment
                        </h3>
                        <p className="text-gray-400 text-sm">{moment.location} • {new Date(moment.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <Badge className="bg-blue-500 text-white">Live</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {moment.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-gray-400 text-sm">{item.brand}</p>
                            <p className="text-blue-400 font-bold">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {moment.specialOffers && (
                      <div className="p-4 bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">⚡ Flash Offer: {moment.specialOffers.discount}% Off!</p>
                            <p className="text-gray-300 text-sm">Use code: {moment.specialOffers.code}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-purple-400 font-bold text-sm">
                              Expires in {Math.round((new Date(moment.specialOffers.expiresAt).getTime() - Date.now()) / 60000)}min
                            </p>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 mt-1">
                              Claim Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Brand Activations Tab */}
          <TabsContent value="brands" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Brand Activations</h2>
              <p className="text-gray-400">Scan QR codes and interact with brands for exclusive rewards</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activations.map((activation) => (
                <Card key={activation.id} className="border-green-500/20 bg-black/40 backdrop-blur-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={activation.brandLogo} />
                        <AvatarFallback>{activation.brandName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{activation.title}</h3>
                        <p className="text-gray-400 text-sm">{activation.brandName} • {activation.location}</p>
                        <p className="text-gray-300 text-sm mt-1">{activation.description}</p>
                      </div>
                      <Badge className={activation.isActive ? "bg-green-500" : "bg-gray-500"}>
                        {activation.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-linear-to-r from-green-600/20 to-emerald-600/20 rounded-lg border border-green-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">🎁 Reward: {activation.rewards.value}</p>
                          <Button
                            size="sm"
                            onClick={() => handleActivateBrand(activation.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {activation.activationType === "qr-code" ? "Scan QR" : "Activate"}
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm">{activation.rewards.description}</p>
                      </div>

                      {activation.socialChallenge && (
                        <div className="p-4 bg-linear-to-r from-pink-600/20 to-purple-600/20 rounded-lg border border-pink-500/30">
                          <p className="text-white font-medium mb-1">📱 Social Challenge</p>
                          <p className="text-gray-300 text-sm mb-2">{activation.socialChallenge.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-pink-400 border-pink-400">
                              {activation.socialChallenge.hashtag}
                            </Badge>
                            <p className="text-pink-400 text-xs font-medium">{activation.socialChallenge.prize}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-white font-bold text-lg">{activation.engagement.scans}</p>
                          <p className="text-gray-400 text-xs">Scans</p>
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{activation.engagement.conversions}</p>
                          <p className="text-gray-400 text-xs">Purchases</p>
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">{activation.engagement.shares}</p>
                          <p className="text-gray-400 text-xs">Shares</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Your Orders</h2>
              <p className="text-gray-400">Track your purchases and delivery status</p>
            </div>

            <div className="space-y-4">
              <Card className="border-orange-500/20 bg-black/40 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Current Order #VB2025</h3>
                      <p className="text-gray-400 text-sm">Ordered 5 minutes ago</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">Preparing</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <img src={items[1].image} alt={items[1].name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{items[1].name}</p>
                        <p className="text-gray-400 text-sm">Quantity: 1</p>
                      </div>
                      <p className="text-blue-400 font-bold">{formatPrice(items[1].price)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                      <span className="text-gray-400">Estimated delivery:</span>
                      <span className="text-white font-medium">5-10 minutes</span>
                    </div>
                    
                    <Progress value={60} className="h-2" />
                    <p className="text-center text-gray-400 text-sm">Your order is being prepared...</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-black/40 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold">Order #VB2024</h3>
                      <p className="text-gray-400 text-sm">Delivered 20 minutes ago</p>
                    </div>
                    <Badge className="bg-green-500 text-white">Delivered</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <img src={items[2].image} alt={items[2].name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{items[2].name}</p>
                        <p className="text-gray-400 text-sm">Quantity: 1</p>
                      </div>
                      <p className="text-green-400 font-bold">{formatPrice(items[2].price)}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Rate Order
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Share Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Social Shopping</h2>
              <p className="text-gray-400">See what others are buying and share your finds</p>
            </div>

            <div className="space-y-4">
              <Card className="border-pink-500/20 bg-black/40 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150" />
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">Sarah Kim just bought</p>
                      <p className="text-gray-400 text-sm">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-4">
                    <img src={items[0].image} alt={items[0].name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{items[0].name}</p>
                      <p className="text-gray-400 text-sm">{items[0].brand}</p>
                      <p className="text-pink-400 font-bold">{formatPrice(items[0].price)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-pink-400 border-pink-400 hover:bg-pink-400/20">
                      <Heart className="h-3 w-3 mr-1" />
                      Love this!
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                      Buy Same
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20 bg-black/40 backdrop-blur-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">Alex Chen shared a find</p>
                      <p className="text-gray-400 text-sm">5 minutes ago</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-3">"This bracelet is so cool! It syncs with the music perfectly 🎵✨"</p>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg mb-4">
                    <img src={items[2].image} alt={items[2].name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{items[2].name}</p>
                      <p className="text-gray-400 text-sm">{items[2].brand}</p>
                      <p className="text-blue-400 font-bold">{formatPrice(items[2].price)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <Heart className="h-3 w-3 mr-1" />
                        24
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400">
                        <Share2 className="h-3 w-3 mr-1" />
                        8
                      </Button>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Check Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Shopping Cart Dialog */}
        <Dialog open={showCart} onOpenChange={setShowCart}>
          <DialogContent className="max-w-2xl bg-black/90 border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">Shopping Cart ({cart.length} items)</DialogTitle>
              <DialogDescription className="text-gray-400">
                Review your items and checkout when ready
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.id}-${item.addedAt}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.brand}</p>
                    {item.selectedSize && <p className="text-gray-400 text-xs">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-gray-400 text-xs">Color: {item.selectedColor}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0">-</Button>
                      <span className="text-white text-sm">{item.quantity}</span>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0">+</Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-gray-400 text-xs">{item.estimatedDelivery}</p>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4">
                <Separator className="bg-gray-600" />
                <div className="flex justify-between items-center text-lg">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-white font-bold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCart(false)}>
                Continue Shopping
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                disabled={cart.length === 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}