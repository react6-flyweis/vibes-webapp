import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Wine,
  Beer,
  Coffee,
  Martini,
  Plus,
  Minus,
  QrCode,
  Nfc,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Star,
  ShoppingCart,
  CreditCard,
  Timer,
  Zap,
  Target,
  BarChart3,
  Eye,
  Heart,
  Smile,
  Frown,
  Meh,
  ThumbsUp,
  Wifi,
  Smartphone,
  ChefHat,
  Flame,
  Snowflake,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";

interface DrinkItem {
  id: string;
  name: string;
  description: string;
  category:
    | "cocktail"
    | "beer"
    | "wine"
    | "non-alcoholic"
    | "spirits"
    | "coffee";
  price: number;
  abv?: number;
  ingredients: string[];
  allergens: string[];
  preparationTime: number;
  popularity: number;
  moodTags: string[];
  temperature: "hot" | "cold" | "room";
  difficulty: "easy" | "medium" | "complex";
  image: string;
  nutritionalInfo: {
    calories: number;
    sugar: number;
    caffeine?: number;
  };
  customizable: boolean;
  availability: boolean;
  barLocation: string;
}

interface BarLocation {
  id: string;
  name: string;
  location: string;
  currentWaitTime: number;
  avgWaitTime: number;
  capacity: number;
  currentOrders: number;
  staffCount: number;
  specialties: string[];
  busyLevel: "low" | "medium" | "high";
  coordinates: { x: number; y: number };
}

interface Guest {
  id: string;
  name: string;
  wristbandId: string;
  currentMood: "happy" | "relaxed" | "energetic" | "social" | "contemplative";
  preferences: {
    alcoholic: boolean;
    sweetness: number;
    strength: number;
    temperature: "hot" | "cold" | "any";
    allergens: string[];
  };
  orderHistory: string[];
  currentTab: number;
  loyaltyPoints: number;
  spendingLimit?: number;
}

interface OrderItem {
  drinkId: string;
  quantity: number;
  customizations: string[];
  specialInstructions: string;
}

interface Order {
  id: string;
  guestId: string;
  items: OrderItem[];
  barLocation: string;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderTime: string;
  estimatedReadyTime: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  queuePosition: number;
}

interface MoodAnalytics {
  currentMood: string;
  confidence: number;
  suggestedDrinks: string[];
  moodHistory: Array<{
    time: string;
    mood: string;
    trigger: string;
  }>;
}

export default function SmartDrinkConcierge() {
  const [selectedGuest, setSelectedGuest] = useState<string>("guest-1");
  const [selectedBar, setSelectedBar] = useState<string>("main-bar");
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [view, setView] = useState<"guest" | "host" | "staff">("guest");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showMoodSuggestions, setShowMoodSuggestions] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"tab" | "card" | "points">(
    "tab"
  );

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data fetching
  const { data: drinks } = useQuery({
    queryKey: ["/api/drinks/menu"],
  });

  const { data: bars } = useQuery({
    queryKey: ["/api/drinks/bars"],
  });

  const { data: guests } = useQuery({
    queryKey: ["/api/drinks/guests"],
  });

  const { data: orders } = useQuery({
    queryKey: ["/api/drinks/orders"],
    refetchInterval: 3000,
  });

  const { data: moodAnalytics } = useQuery({
    queryKey: ["/api/drinks/mood-analytics", selectedGuest],
    enabled: !!selectedGuest,
  });

  const { data: realTimeStats } = useQuery({
    queryKey: ["/api/drinks/real-time-stats"],
    refetchInterval: 2000,
  });

  // Mutations
  const scanWristbandMutation = useMutation({
    mutationFn: async (wristbandId: string) => {
      const response = await fetch("/api/drinks/scan-wristband", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wristbandId }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedGuest(data.guestId);
      toast({
        title: "Wristband Scanned",
        description: `Welcome ${data.guestName}!`,
      });
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: {
      guestId: string;
      items: OrderItem[];
      barLocation: string;
      paymentMethod: string;
    }) => {
      const response = await fetch("/api/drinks/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCartItems([]);
      toast({
        title: "Order Placed Successfully",
        description: `Order #${data.orderId} - Estimated wait: ${data.estimatedWaitTime} minutes`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/drinks/orders"] });
    },
  });

  const updateMoodMutation = useMutation({
    mutationFn: async (data: {
      guestId: string;
      mood: string;
      context: string;
    }) => {
      const response = await fetch("/api/drinks/update-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/drinks/mood-analytics"],
      });
    },
  });

  // Mock data
  const mockDrinks: DrinkItem[] = Array.isArray(drinks)
    ? drinks
    : [
        {
          id: "drink-mojito",
          name: "Classic Mojito",
          description: "Fresh mint, lime, white rum, and soda water",
          category: "cocktail",
          price: 12,
          abv: 15,
          ingredients: [
            "White Rum",
            "Fresh Mint",
            "Lime",
            "Sugar",
            "Soda Water",
          ],
          allergens: [],
          preparationTime: 3,
          popularity: 85,
          moodTags: ["refreshing", "social", "energetic"],
          temperature: "cold",
          difficulty: "medium",
          image:
            "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300",
          nutritionalInfo: { calories: 150, sugar: 12 },
          customizable: true,
          availability: true,
          barLocation: "main-bar",
        },
        {
          id: "drink-espresso-martini",
          name: "Espresso Martini",
          description: "Premium vodka, fresh espresso, coffee liqueur",
          category: "cocktail",
          price: 14,
          abv: 25,
          ingredients: [
            "Vodka",
            "Fresh Espresso",
            "Coffee Liqueur",
            "Sugar Syrup",
          ],
          allergens: ["caffeine"],
          preparationTime: 4,
          popularity: 78,
          moodTags: ["sophisticated", "energetic", "evening"],
          temperature: "cold",
          difficulty: "complex",
          image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300",
          nutritionalInfo: { calories: 220, sugar: 8, caffeine: 63 },
          customizable: true,
          availability: true,
          barLocation: "premium-bar",
        },
        {
          id: "drink-craft-ipa",
          name: "Local Craft IPA",
          description: "Hoppy craft beer with citrus notes",
          category: "beer",
          price: 8,
          abv: 6.5,
          ingredients: ["Hops", "Malt", "Yeast", "Water"],
          allergens: ["gluten"],
          preparationTime: 1,
          popularity: 92,
          moodTags: ["casual", "social", "relaxed"],
          temperature: "cold",
          difficulty: "easy",
          image:
            "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300",
          nutritionalInfo: { calories: 180, sugar: 4 },
          customizable: false,
          availability: true,
          barLocation: "main-bar",
        },
      ];

  const mockBars: BarLocation[] = Array.isArray(bars)
    ? bars
    : [
        {
          id: "main-bar",
          name: "Main Bar",
          location: "Center Stage",
          currentWaitTime: 3,
          avgWaitTime: 4,
          capacity: 50,
          currentOrders: 12,
          staffCount: 3,
          specialties: ["Cocktails", "Beer", "Basic Spirits"],
          busyLevel: "medium",
          coordinates: { x: 50, y: 30 },
        },
        {
          id: "premium-bar",
          name: "Premium Lounge",
          location: "VIP Area",
          currentWaitTime: 7,
          avgWaitTime: 8,
          capacity: 20,
          currentOrders: 8,
          staffCount: 2,
          specialties: ["Premium Cocktails", "Wine", "Top Shelf Spirits"],
          busyLevel: "high",
          coordinates: { x: 80, y: 70 },
        },
        {
          id: "coffee-bar",
          name: "Coffee Corner",
          location: "Near Entrance",
          currentWaitTime: 2,
          avgWaitTime: 3,
          capacity: 30,
          currentOrders: 5,
          staffCount: 2,
          specialties: ["Coffee", "Tea", "Non-Alcoholic"],
          busyLevel: "low",
          coordinates: { x: 20, y: 80 },
        },
      ];

  const mockGuests: Guest[] = Array.isArray(guests)
    ? guests
    : [
        {
          id: "guest-1",
          name: "Alex Chen",
          wristbandId: "NFC-001",
          currentMood: "social",
          preferences: {
            alcoholic: true,
            sweetness: 3,
            strength: 2,
            temperature: "cold",
            allergens: [],
          },
          orderHistory: ["drink-mojito", "drink-craft-ipa"],
          currentTab: 28,
          loyaltyPoints: 150,
          spendingLimit: 100,
        },
      ];

  const mockOrders: Order[] = Array.isArray(orders)
    ? orders
    : [
        {
          id: "order-001",
          guestId: "guest-1",
          items: [
            {
              drinkId: "drink-mojito",
              quantity: 2,
              customizations: ["extra mint"],
              specialInstructions: "light on sugar",
            },
          ],
          barLocation: "main-bar",
          status: "preparing",
          orderTime: "2025-01-01T10:30:00Z",
          estimatedReadyTime: "2025-01-01T10:35:00Z",
          totalAmount: 24,
          paymentStatus: "paid",
          queuePosition: 3,
        },
      ];

  const mockMoodAnalytics: MoodAnalytics = (moodAnalytics as MoodAnalytics) || {
    currentMood: "social",
    confidence: 0.85,
    suggestedDrinks: ["drink-mojito", "drink-craft-ipa"],
    moodHistory: [
      { time: "10:00", mood: "energetic", trigger: "music_change" },
      { time: "10:30", mood: "social", trigger: "group_interaction" },
    ],
  };

  const addToCart = (drinkId: string) => {
    const existingItem = cartItems.find((item) => item.drinkId === drinkId);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.drinkId === drinkId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          drinkId,
          quantity: 1,
          customizations: [],
          specialInstructions: "",
        },
      ]);
    }
  };

  const removeFromCart = (drinkId: string) => {
    const existingItem = cartItems.find((item) => item.drinkId === drinkId);
    if (existingItem && existingItem.quantity > 1) {
      setCartItems(
        cartItems.map((item) =>
          item.drinkId === drinkId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCartItems(cartItems.filter((item) => item.drinkId !== drinkId));
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const drink = mockDrinks.find((d) => d.id === item.drinkId);
      return total + (drink?.price || 0) * item.quantity;
    }, 0);
  };

  const getCurrentGuest = () => mockGuests.find((g) => g.id === selectedGuest);
  const getCurrentBar = () => mockBars.find((b) => b.id === selectedBar);

  const getFilteredDrinks = () => {
    let filtered = mockDrinks;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (drink) => drink.category === selectedCategory
      );
    }

    if (showMoodSuggestions && mockMoodAnalytics.suggestedDrinks.length > 0) {
      const suggested = filtered.filter((drink) =>
        mockMoodAnalytics.suggestedDrinks.includes(drink.id)
      );
      const others = filtered.filter(
        (drink) => !mockMoodAnalytics.suggestedDrinks.includes(drink.id)
      );
      return [...suggested, ...others];
    }

    return filtered;
  };

  const getMoodIcon = (mood: string) => {
    const moodIcons = {
      happy: Smile,
      relaxed: Heart,
      energetic: Zap,
      social: Users,
      contemplative: Eye,
    };
    return moodIcons[mood as keyof typeof moodIcons] || Meh;
  };

  const getBusyLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Drink Concierge
          </h1>
          <p className="text-gray-600 mt-2">
            Seamless drink ordering with mood intelligence
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={view === "guest" ? "default" : "outline"}
            onClick={() => setView("guest")}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Guest View
          </Button>
          <Button
            variant={view === "host" ? "default" : "outline"}
            onClick={() => setView("host")}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Host Dashboard
          </Button>
          <Button
            variant={view === "staff" ? "default" : "outline"}
            onClick={() => setView("staff")}
            className="flex items-center gap-2"
          >
            <ChefHat className="h-4 w-4" />
            Staff Panel
          </Button>
        </div>
      </div>

      {view === "guest" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Guest Profile & Scanner */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Guest Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center space-y-2">
                  <div className="flex justify-center gap-4">
                    <QrCode className="h-8 w-8 text-blue-500" />
                    <Nfc className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan QR code or tap NFC wristband
                  </p>
                  <Button
                    onClick={() => scanWristbandMutation.mutate("NFC-001")}
                    disabled={scanWristbandMutation.isPending}
                    className="mt-2"
                  >
                    {scanWristbandMutation.isPending
                      ? "Scanning..."
                      : "Simulate Scan"}
                  </Button>
                </div>
              </div>

              {getCurrentGuest() && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {getCurrentGuest()?.name}
                    </span>
                    <Badge variant="secondary">
                      {getCurrentGuest()?.wristbandId}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {React.createElement(
                      getMoodIcon(getCurrentGuest()?.currentMood || ""),
                      { className: "h-4 w-4" }
                    )}
                    <span className="text-sm">
                      Mood: {getCurrentGuest()?.currentMood}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(mockMoodAnalytics.confidence * 100)}%
                      confident
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Current Tab:</span>
                      <span className="font-medium ml-1">
                        ${getCurrentGuest()?.currentTab}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Loyalty Points:</span>
                      <span className="font-medium ml-1">
                        {getCurrentGuest()?.loyaltyPoints}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood Suggestions & Bar Selection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Smart Suggestions & Bar Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showMoodSuggestions &&
                mockMoodAnalytics.suggestedDrinks.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Based on your {mockMoodAnalytics.currentMood} mood
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {mockMoodAnalytics.suggestedDrinks
                        .slice(0, 3)
                        .map((drinkId) => {
                          const drink = mockDrinks.find(
                            (d) => d.id === drinkId
                          );
                          return drink ? (
                            <Badge
                              key={drinkId}
                              variant="secondary"
                              className="bg-blue-100 text-blue-800"
                            >
                              {drink.name}
                            </Badge>
                          ) : null;
                        })}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mockBars.map((bar) => (
                  <Card
                    key={bar.id}
                    className={`cursor-pointer transition-all ${
                      selectedBar === bar.id
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedBar(bar.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{bar.name}</h3>
                          <div
                            className={`flex items-center gap-1 ${getBusyLevelColor(
                              bar.busyLevel
                            )}`}
                          >
                            <Users className="h-3 w-3" />
                            <span className="text-xs">{bar.busyLevel}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{bar.location}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{bar.currentWaitTime}min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>
                              {bar.currentOrders}/{bar.capacity}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {bar.specialties.slice(0, 2).map((specialty) => (
                            <Badge
                              key={specialty}
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drink Menu */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wine className="h-5 w-5" />
                Drink Menu
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </Button>
                <Button
                  variant={
                    selectedCategory === "cocktail" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("cocktail")}
                  className="flex items-center gap-1"
                >
                  <Martini className="h-3 w-3" />
                  Cocktails
                </Button>
                <Button
                  variant={selectedCategory === "beer" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("beer")}
                  className="flex items-center gap-1"
                >
                  <Beer className="h-3 w-3" />
                  Beer
                </Button>
                <Button
                  variant={
                    selectedCategory === "coffee" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory("coffee")}
                  className="flex items-center gap-1"
                >
                  <Coffee className="h-3 w-3" />
                  Coffee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="grid gap-4">
                  {getFilteredDrinks().map((drink) => {
                    const cartItem = cartItems.find(
                      (item) => item.drinkId === drink.id
                    );
                    const isSuggested =
                      mockMoodAnalytics.suggestedDrinks.includes(drink.id);

                    return (
                      <Card
                        key={drink.id}
                        className={`${
                          isSuggested ? "ring-1 ring-blue-300 bg-blue-50" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={drink.image}
                              alt={drink.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium flex items-center gap-2">
                                    {drink.name}
                                    {isSuggested && (
                                      <Sparkles className="h-3 w-3 text-blue-500" />
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {drink.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold">
                                    ${drink.price}
                                  </span>
                                  {drink.abv && (
                                    <p className="text-xs text-gray-500">
                                      {drink.abv}% ABV
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs">
                                <div className="flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  <span>{drink.preparationTime}min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  <span>{drink.popularity}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {drink.temperature === "cold" ? (
                                    <Snowflake className="h-3 w-3 text-blue-500" />
                                  ) : drink.temperature === "hot" ? (
                                    <Flame className="h-3 w-3 text-red-500" />
                                  ) : (
                                    <div className="h-3 w-3" />
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex gap-1 flex-wrap">
                                  {drink.moodTags.slice(0, 3).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs px-1 py-0"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2">
                                  {cartItem && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeFromCart(drink.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  )}
                                  {cartItem && (
                                    <span className="text-sm font-medium min-w-[20px] text-center">
                                      {cartItem.quantity}
                                    </span>
                                  )}
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => addToCart(drink.id)}
                                    disabled={!drink.availability}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Cart & Checkout */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No items in cart
                </p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => {
                    const drink = mockDrinks.find((d) => d.id === item.drinkId);
                    return drink ? (
                      <div
                        key={item.drinkId}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-sm">{drink.name}</p>
                          <p className="text-xs text-gray-500">
                            x{item.quantity}
                          </p>
                        </div>
                        <span className="font-medium">
                          ${(drink.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ) : null;
                  })}

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between font-bold">
                      <span>Total:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment Method:</p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant={
                          paymentMethod === "tab" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPaymentMethod("tab")}
                        className="justify-start"
                      >
                        <CreditCard className="h-3 w-3 mr-2" />
                        Add to Tab
                      </Button>
                      <Button
                        variant={
                          paymentMethod === "points" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setPaymentMethod("points")}
                        className="justify-start"
                        disabled={
                          (getCurrentGuest()?.loyaltyPoints || 0) <
                          getTotalPrice() * 10
                        }
                      >
                        <Star className="h-3 w-3 mr-2" />
                        Use Points ({getTotalPrice() * 10})
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Estimated Wait:</span>
                      <span className="font-medium">
                        {getCurrentBar()?.currentWaitTime}min
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Pickup Location:</span>
                      <span className="font-medium">
                        {getCurrentBar()?.name}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      placeOrderMutation.mutate({
                        guestId: selectedGuest,
                        items: cartItems,
                        barLocation: selectedBar,
                        paymentMethod,
                      })
                    }
                    disabled={placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {view === "host" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Real-time Analytics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <div className="text-sm text-gray-600">Active Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    $1,847
                  </div>
                  <div className="text-sm text-gray-600">Revenue Today</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    4.2min
                  </div>
                  <div className="text-sm text-gray-600">Avg Wait Time</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-gray-600">Active Guests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bar Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBars.map((bar) => (
                  <div key={bar.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{bar.name}</span>
                      <Badge
                        variant={
                          bar.busyLevel === "high"
                            ? "destructive"
                            : bar.busyLevel === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {bar.busyLevel}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Wait:</span>
                        <span className="font-medium ml-1">
                          {bar.currentWaitTime}min
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-medium ml-1">
                          {bar.currentOrders}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Staff:</span>
                        <span className="font-medium ml-1">
                          {bar.staffCount}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={(bar.currentOrders / bar.capacity) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Drinks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Drinks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDrinks
                  .sort((a, b) => b.popularity - a.popularity)
                  .slice(0, 5)
                  .map((drink, index) => (
                    <div key={drink.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <img
                        src={drink.image}
                        alt={drink.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{drink.name}</p>
                        <p className="text-xs text-gray-500">
                          {drink.popularity}% popularity
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${drink.price}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {view === "staff" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Order Queue */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockOrders.map((order) => {
                  const guest = mockGuests.find((g) => g.id === order.guestId);
                  const statusColor = {
                    pending: "bg-yellow-100 text-yellow-800",
                    preparing: "bg-blue-100 text-blue-800",
                    ready: "bg-green-100 text-green-800",
                    completed: "bg-gray-100 text-gray-800",
                    cancelled: "bg-red-100 text-red-800",
                  };

                  return (
                    <Card key={order.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="font-medium">
                              Order #{order.id.slice(-3)}
                            </span>
                            <span className="text-gray-500 ml-2">
                              {guest?.name}
                            </span>
                          </div>
                          <Badge className={statusColor[order.status]}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => {
                            const drink = mockDrinks.find(
                              (d) => d.id === item.drinkId
                            );
                            return drink ? (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>
                                  {item.quantity}x {drink.name}
                                </span>
                                <span>{drink.preparationTime}min</span>
                              </div>
                            ) : null;
                          })}
                        </div>

                        <div className="flex items-center justify-between mt-3 text-sm">
                          <span>Queue Position: #{order.queuePosition}</span>
                          <span>Total: ${order.totalAmount}</span>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Issue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
