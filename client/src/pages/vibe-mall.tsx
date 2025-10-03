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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingBag,
  Heart,
  Share2,
  Star,
  Camera,
  Shirt,
  Music,
  Ticket,
  Gift,
  Sparkles,
  Eye,
  ShoppingCart,
  Zap,
  Crown,
  Headphones,
  Palette,
  Trophy,
  Search,
  Filter,
  Tag,
  Play,
  Download,
  ExternalLink,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Scan,
  Volume2,
  Image,
  Plus,
  Minus,
  X,
  Check,
  ArrowRight,
} from "lucide-react";

interface VibeMallItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: "clothing" | "decor" | "music" | "collectibles" | "tickets";
  vendor: {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    type: "vendor" | "sponsor" | "influencer";
  };
  images: string[];
  tags: string[];
  popularity: number;
  inStock: boolean;
  limitedEdition?: boolean;
  eventExclusive?: boolean;
  influencerWorn?: {
    influencer: string;
    avatar: string;
    social: string;
  };
  arEnabled: boolean;
  instantDownload?: boolean;
  likes: number;
  purchases: number;
  trending: boolean;
}

interface CartItem {
  item: VibeMallItem;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  arTested?: boolean;
}

export default function VibeMall() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VibeMallItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch VibeMall items
  const { data: mallItems = [], isLoading } = useQuery({
    queryKey: ["/api/vibe-mall/items", selectedCategory, searchTerm],
  });

  // Fetch cart total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.item.price * item.quantity,
    0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async (purchaseData: any) => {
      const response = await apiRequest(
        "POST",
        "/api/vibe-mall/purchase",
        purchaseData
      );
      return response.json();
    },
    onSuccess: (data) => {
      setCartItems([]);
      setShowCart(false);
      toast({
        title: "Purchase Successful!",
        description: `${data.instantItems} items available for instant download, ${data.physicalItems} physical items will be delivered.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vibe-mall/items"] });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description:
          "There was an issue processing your purchase. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like item mutation
  const likeMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("POST", "/api/vibe-mall/like", {
        itemId,
      });
      return response.json();
    },
    onSuccess: (data, itemId) => {
      setLikedItems((prev) => new Set([...Array.from(prev), itemId]));
      toast({
        title: "Added to Wishlist",
        description: "Item saved to your favorites!",
      });
    },
  });

  // AR try-on mutation
  const arTryOnMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await apiRequest("POST", "/api/vibe-mall/ar-tryon", {
        itemId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "AR Try-On Ready",
        description: "Point your camera at yourself to see how it looks!",
      });
    },
  });

  const categories = [
    { id: "all", name: "All Items", icon: ShoppingBag },
    { id: "clothing", name: "Influencer Wear", icon: Shirt },
    { id: "decor", name: "Event Decor", icon: Palette },
    { id: "music", name: "Playlists & Audio", icon: Music },
    { id: "collectibles", name: "Collectibles", icon: Trophy },
    { id: "tickets", name: "E-Tickets", icon: Ticket },
  ];

  const popularTags = [
    "trending",
    "limited-edition",
    "ar-enabled",
    "instant-download",
    "influencer-worn",
    "event-exclusive",
  ];

  const addToCart = (
    item: VibeMallItem,
    options?: { size?: string; color?: string }
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (cartItem) =>
          cartItem.item.id === item.id &&
          cartItem.selectedSize === options?.size &&
          cartItem.selectedColor === options?.color
      );

      if (existing) {
        return prev.map((cartItem) =>
          cartItem === existing
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          item,
          quantity: 1,
          selectedSize: options?.size,
          selectedColor: options?.color,
        },
      ];
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clothing":
        return Shirt;
      case "decor":
        return Palette;
      case "music":
        return Music;
      case "collectibles":
        return Trophy;
      case "tickets":
        return Ticket;
      default:
        return ShoppingBag;
    }
  };

  const renderItemCard = (item: VibeMallItem) => {
    const Icon = getCategoryIcon(item.category);
    const isLiked = likedItems.has(item.id);

    return (
      <Card
        key={item.id}
        className="group hover:shadow-lg transition-all duration-200 overflow-hidden"
      >
        <div className="relative">
          <div className="aspect-square bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
            <Icon className="h-16 w-16 text-purple-600 dark:text-purple-400" />

            {/* Overlays */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {item.trending && (
                <Badge variant="destructive" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {item.limitedEdition && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gold text-black"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Limited
                </Badge>
              )}
              {item.eventExclusive && (
                <Badge className="text-xs bg-purple-600">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Exclusive
                </Badge>
              )}
            </div>

            <div className="absolute top-2 right-2 flex gap-1">
              {item.arEnabled && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    setSelectedItem(item);
                    arTryOnMutation.mutate(item.id);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 ${isLiked ? "text-red-500" : ""}`}
                onClick={() => !isLiked && likeMutation.mutate(item.id)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* AR Preview Overlay */}
            {arMode && selectedItem?.id === item.id && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">AR Try-On Active</p>
                </div>
              </div>
            )}
          </div>

          {/* Vendor Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge
              variant={
                item.vendor.type === "influencer" ? "default" : "secondary"
              }
              className="text-xs flex items-center gap-1"
            >
              {item.vendor.verified && <Check className="h-3 w-3" />}
              {item.vendor.name}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-2">
                {item.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {item.purchases}
              </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>

            {/* Influencer Worn Badge */}
            {item.influencerWorn && (
              <div className="flex items-center gap-2 p-2 bg-linear-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center">
                  <Crown className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-xs font-medium">
                    Worn by {item.influencerWorn.influencer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.influencerWorn.social}
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">${item.price}</span>
                {item.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${item.originalPrice}
                  </span>
                )}
                {item.discount && (
                  <Badge variant="destructive" className="text-xs">
                    -{item.discount}%
                  </Badge>
                )}
              </div>

              <div className="flex gap-1">
                {item.instantDownload && (
                  <Button size="sm" variant="outline" className="h-8 px-2">
                    <Download className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => addToCart(item)}
                  disabled={!item.inStock}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {item.inStock ? "Add" : "Sold Out"}
                </Button>
              </div>
            </div>

            {/* Popularity Indicator */}
            <div className="flex items-center gap-2">
              <Progress value={item.popularity} className="flex-1 h-1" />
              <span className="text-xs text-muted-foreground">
                {item.popularity}% popular
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCart = () => (
    <div className="space-y-4">
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-muted-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">
            Add items from VibeMall to get started
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cartItems.map((cartItem, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                  {React.createElement(
                    getCategoryIcon(cartItem.item.category),
                    { className: "h-6 w-6 text-purple-600" }
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-sm">{cartItem.item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {cartItem.item.vendor.name}
                  </p>
                  {(cartItem.selectedSize || cartItem.selectedColor) && (
                    <p className="text-xs text-muted-foreground">
                      {cartItem.selectedSize &&
                        `Size: ${cartItem.selectedSize}`}
                      {cartItem.selectedSize && cartItem.selectedColor && ", "}
                      {cartItem.selectedColor &&
                        `Color: ${cartItem.selectedColor}`}
                    </p>
                  )}
                  {cartItem.arTested && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      <Eye className="h-3 w-3 mr-1" />
                      AR Tested
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(index, cartItem.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-8 text-center">
                    {cartItem.quantity}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 w-6 p-0"
                    onClick={() => updateQuantity(index, cartItem.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-medium">
                    ${(cartItem.item.price * cartItem.quantity).toFixed(2)}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => removeFromCart(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">
                Total: ${cartTotal.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">
                {cartCount} items
              </span>
            </div>

            <Button
              className="w-full"
              onClick={() =>
                purchaseMutation.mutate({ items: cartItems, total: cartTotal })
              }
              disabled={purchaseMutation.isPending}
            >
              {purchaseMutation.isPending
                ? "Processing..."
                : "Complete Purchase"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading VibeMall...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      {/* Header */}
      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xs border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    VibeMall
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Event Pop-Up Marketplace
                  </p>
                </div>
              </div>

              <Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Live Shopping
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>

              <Dialog open={showCart} onOpenChange={setShowCart}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Shopping Cart</DialogTitle>
                    <DialogDescription>
                      Review your VibeMall items
                    </DialogDescription>
                  </DialogHeader>
                  {renderCart()}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Categories</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  className="whitespace-nowrap flex items-center gap-2"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Popular Tags</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={filterTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  setFilterTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  );
                }}
              >
                {tag.replace("-", " ")}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mb-8">
          <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Featured Collection</h2>
                <p className="text-purple-100 mb-4">
                  Exclusive items from tonight's performers and sponsors
                </p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Crown className="h-3 w-3 mr-1" />
                    Limited Edition
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AR Enabled
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">127</div>
                <div className="text-sm text-purple-200">Items Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(mallItems)
            ? (mallItems as VibeMallItem[]).map((item: VibeMallItem) =>
                renderItemCard(item)
              )
            : []}
        </div>

        {/* Empty State */}
        {(!mallItems ||
          (Array.isArray(mallItems) && mallItems.length === 0)) && (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or category filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setFilterTags([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* AR Mode Overlay */}
      {arMode && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">AR Try-On Mode</h3>
              <p className="text-muted-foreground mb-4">
                Point your camera at yourself to see how the item looks
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setArMode(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setArMode(false);
                    toast({
                      title: "AR Session Complete",
                      description: "Item added to cart with AR verification!",
                    });
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
