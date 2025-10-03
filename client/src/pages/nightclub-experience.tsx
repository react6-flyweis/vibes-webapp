import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Music,
  MapPin,
  Users,
  Star,
  Clock,
  Camera,
  Zap,
  Gift,
  QrCode,
  Smartphone,
  Volume2,
  Heart,
  TrendingUp,
  Award,
  Share2,
  Calendar,
  DollarSign,
  Crown,
  Radio,
  Disc3,
  PartyPopper,
  Wine,
  Beer,
  Coffee,
  Martini,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Timer,
} from "lucide-react";

interface NightclubVenue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  vibeScore: number;
  coverCharge: number;
  lineup: Array<{
    djName: string;
    genre: string;
    startTime: string;
    isHeadliner: boolean;
  }>;
  amenities: string[];
  rating: number;
  photos: string[];
  theme?: string;
  specialOffers: string[];
}

interface LiveMoment {
  id: string;
  userName: string;
  userPhoto: string;
  content: string;
  mediaUrl?: string;
  mediaType: "photo" | "video";
  timestamp: Date;
  reactions: Array<{ emoji: string; count: number }>;
  location: string;
  tags: string[];
}

interface VibeConnection {
  id: string;
  userName: string;
  userPhoto: string;
  musicTaste: string[];
  currentMood: string;
  matchScore: number;
  isOnline: boolean;
  location: string;
}

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

interface Order {
  id: string;
  guestId: string;
  items: Array<{
    drinkId: string;
    quantity: number;
    customizations: string[];
    specialInstructions: string;
  }>;
  barLocation: string;
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
  orderTime: string;
  estimatedReadyTime: string;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  queuePosition: number;
}

interface ClubStats {
  totalCheckedIn: number;
  vibePoints: number;
  photosShared: number;
  songsRequested: number;
  connectionsKade: number;
  currentDjRating: number;
}

export default function NightclubExperience() {
  const [selectedVenue, setSelectedVenue] = useState<string>("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    "discover" | "checkedin" | "live"
  >("discover");
  const [newMomentText, setNewMomentText] = useState("");
  const [vibeStatus, setVibeStatus] = useState("Ready to party! 🎉");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useState<
    Array<{ drinkId: string; quantity: number }>
  >([]);
  const [activeTab, setActiveTab] = useState("discover");

  const [nightclubs] = useState<NightclubVenue[]>([
    {
      id: "club1",
      name: "Pulse Nightclub",
      location: "Downtown District",
      capacity: 500,
      currentOccupancy: 320,
      vibeScore: 94,
      coverCharge: 25,
      lineup: [
        {
          djName: "DJ Phoenix",
          genre: "Progressive House",
          startTime: "10:00 PM",
          isHeadliner: true,
        },
        {
          djName: "Neon Beats",
          genre: "Tech House",
          startTime: "12:00 AM",
          isHeadliner: false,
        },
        {
          djName: "Void",
          genre: "Techno",
          startTime: "2:00 AM",
          isHeadliner: false,
        },
      ],
      amenities: [
        "VIP Tables",
        "Bottle Service",
        "LED Dance Floor",
        "Rooftop Terrace",
      ],
      rating: 4.8,
      photos: [
        "https://via.placeholder.com/300x200/8B5CF6/ffffff?text=Pulse+Main+Floor",
      ],
      theme: "Neon Nights",
      specialOffers: ["Free entry before 11 PM", "$5 drinks until midnight"],
    },
    {
      id: "club2",
      name: "Voltage Underground",
      location: "Industrial Quarter",
      capacity: 300,
      currentOccupancy: 280,
      vibeScore: 89,
      coverCharge: 20,
      lineup: [
        {
          djName: "Bass Guru",
          genre: "Drum & Bass",
          startTime: "9:30 PM",
          isHeadliner: true,
        },
        {
          djName: "Deep Sync",
          genre: "Deep House",
          startTime: "11:30 PM",
          isHeadliner: false,
        },
      ],
      amenities: ["Underground Vibe", "Sound System", "Industrial Decor"],
      rating: 4.6,
      photos: [
        "https://via.placeholder.com/300x200/EF4444/ffffff?text=Voltage+Underground",
      ],
      specialOffers: ["Student discount available"],
    },
  ]);

  const [liveMoments, setLiveMoments] = useState<LiveMoment[]>([
    {
      id: "moment1",
      userName: "Sarah M.",
      userPhoto: "https://via.placeholder.com/40x40/3B82F6/ffffff?text=S",
      content: "This drop is INSANE! 🔥",
      mediaUrl:
        "https://via.placeholder.com/200x200/8B5CF6/ffffff?text=Dance+Floor",
      mediaType: "photo",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      reactions: [
        { emoji: "🔥", count: 23 },
        { emoji: "💃", count: 15 },
        { emoji: "🎉", count: 8 },
      ],
      location: "Main Floor",
      tags: ["dancefloor", "djphoenix"],
    },
    {
      id: "moment2",
      userName: "Mike R.",
      userPhoto: "https://via.placeholder.com/40x40/10B981/ffffff?text=M",
      content: "VIP section vibes are unmatched",
      mediaType: "photo",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      reactions: [
        { emoji: "👑", count: 12 },
        { emoji: "🥂", count: 8 },
      ],
      location: "VIP Lounge",
      tags: ["vip", "luxury"],
    },
  ]);

  const [vibeConnections, setVibeConnections] = useState<VibeConnection[]>([
    {
      id: "conn1",
      userName: "Emma L.",
      userPhoto: "https://via.placeholder.com/40x40/F59E0B/ffffff?text=E",
      musicTaste: ["House", "Techno", "Progressive"],
      currentMood: "Dancing Queen",
      matchScore: 92,
      isOnline: true,
      location: "Dance Floor",
    },
    {
      id: "conn2",
      userName: "Alex K.",
      userPhoto: "https://via.placeholder.com/40x40/8B5CF6/ffffff?text=A",
      musicTaste: ["Deep House", "Ambient", "Chill"],
      currentMood: "Vibing Hard",
      matchScore: 87,
      isOnline: true,
      location: "Lounge Area",
    },
  ]);

  const [clubStats, setClubStats] = useState<ClubStats>({
    totalCheckedIn: 347,
    vibePoints: 1250,
    photosShared: 89,
    songsRequested: 156,
    connectionsKade: 12,
    currentDjRating: 4.7,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Drink ordering queries
  const { data: drinksMenu = [] } = useQuery({
    queryKey: ["/api/drinks/menu"],
    enabled: isCheckedIn,
  });

  const { data: barLocations = [] } = useQuery({
    queryKey: ["/api/drinks/bars"],
    enabled: isCheckedIn,
  });

  const { data: currentOrders = [] } = useQuery({
    queryKey: ["/api/drinks/orders"],
    enabled: isCheckedIn,
    refetchInterval: 3000,
  });

  const { data: drinkStats = {} } = useQuery({
    queryKey: ["/api/drinks/real-time-stats"],
    enabled: isCheckedIn,
    refetchInterval: 2000,
  });

  // Simulate real-time updates
  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => {
        // Real-time updates would come from venue APIs
        // For demo purposes, simulating live data updates

        // Update stats
        setClubStats((prev) => ({
          ...prev,
          totalCheckedIn: prev.totalCheckedIn + Math.floor(Math.random() * 3),
          photosShared: prev.photosShared + Math.floor(Math.random() * 2),
          songsRequested: prev.songsRequested + Math.floor(Math.random() * 2),
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isCheckedIn]);

  const checkInToVenue = (venueId: string) => {
    setSelectedVenue(venueId);
    setIsCheckedIn(true);
    setCurrentMode("live");

    toast({
      title: "Welcome to the party!",
      description: "You're now checked in. Start exploring and connecting!",
    });
  };

  const postMoment = () => {
    if (!newMomentText.trim()) {
      toast({
        title: "Add your vibe",
        description: "Write something about your club experience!",
        variant: "destructive",
      });
      return;
    }

    const newMoment: LiveMoment = {
      id: Math.random().toString(36),
      userName: "You",
      userPhoto: "https://via.placeholder.com/40x40/3B82F6/ffffff?text=Y",
      content: newMomentText,
      mediaType: "photo",
      timestamp: new Date(),
      reactions: [],
      location: "Dance Floor",
      tags: ["live", "vibes"],
    };

    setLiveMoments((prev) => [newMoment, ...prev]);
    setNewMomentText("");
    setClubStats((prev) => ({
      ...prev,
      photosShared: prev.photosShared + 1,
      vibePoints: prev.vibePoints + 50,
    }));

    toast({
      title: "Moment shared!",
      description: "Your vibe is now part of the live feed. +50 Vibe Points!",
    });
  };

  const addReaction = (momentId: string, emoji: string) => {
    setLiveMoments((prev) =>
      prev.map((moment) =>
        moment.id === momentId
          ? {
              ...moment,
              reactions: moment.reactions
                .map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                )
                .concat(
                  moment.reactions.find((r) => r.emoji === emoji)
                    ? []
                    : [{ emoji, count: 1 }]
                ),
            }
          : moment
      )
    );
  };

  const connectWithUser = (connectionId: string) => {
    const connection = vibeConnections.find((c) => c.id === connectionId);
    if (connection) {
      setClubStats((prev) => ({
        ...prev,
        connectionsKade: prev.connectionsKade + 1,
        vibePoints: prev.vibePoints + 100,
      }));
      toast({
        title: "Vibe connection made!",
        description: `You're now connected with ${connection.userName}. +100 Vibe Points!`,
      });
    }
  };

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return "text-green-600 bg-green-100";
    if (percentage < 80) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // Drink ordering functions
  const addToCart = (drinkId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.drinkId === drinkId);
      if (existing) {
        return prev.map((item) =>
          item.drinkId === drinkId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { drinkId, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: "Item added successfully!",
    });
  };

  const removeFromCart = (drinkId: string) => {
    setCartItems((prev) => prev.filter((item) => item.drinkId !== drinkId));
  };

  const updateCartQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(drinkId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.drinkId === drinkId ? { ...item, quantity } : item
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cocktail":
        return Martini;
      case "beer":
        return Beer;
      case "wine":
        return Wine;
      case "coffee":
        return Coffee;
      default:
        return Wine;
    }
  };

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest(
        "POST",
        "/api/drinks/process-payment",
        orderData
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Payment Successful!",
        description: "Your drink order has been placed and payment processed.",
      });
      // Clear cart after successful payment
      setCartItems([]);
      // Refresh orders
      queryClient.invalidateQueries({ queryKey: ["/api/drinks/orders"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/drinks/real-time-stats"],
      });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description:
          "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before ordering.",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = cartItems.reduce((total, item) => {
      const drink = drinksMenu.find((d: any) => d.id === item.drinkId);
      return total + (drink ? drink.price * item.quantity : 0);
    }, 0);

    const orderData = {
      items: cartItems,
      totalAmount: totalAmount,
      barLocation: "Main Bar",
      guestId: "current-user",
    };

    paymentMutation.mutate(orderData);
  };

  const selectedVenueData = nightclubs.find(
    (club) => club.id === selectedVenue
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <PartyPopper className="inline-block mr-3 h-10 w-10 text-purple-600" />
          Nightclub Experience
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Transform your nightlife with real-time club discovery, live social
          feeds, DJ interactions, and personalized connections that make every
          night unforgettable.
        </p>
      </div>

      {!isCheckedIn ? (
        <>
          {/* Club Discovery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {nightclubs.map((club) => (
              <Card
                key={club.id}
                className="overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={club.photos[0]}
                    alt={club.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600 text-white">
                      Vibe Score: {club.vibeScore}%
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`${getOccupancyColor(
                        club.currentOccupancy,
                        club.capacity
                      )}`}
                    >
                      {Math.round(
                        (club.currentOccupancy / club.capacity) * 100
                      )}
                      % Full
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{club.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4" />
                        {club.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{club.rating}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        ${club.coverCharge} cover
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {club.theme && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                        Tonight's Theme: {club.theme}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Tonight's Lineup</h4>
                    <div className="space-y-2">
                      {club.lineup.map((dj, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4" />
                            <span
                              className={dj.isHeadliner ? "font-semibold" : ""}
                            >
                              {dj.djName}
                            </span>
                            {dj.isHeadliner && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                Headliner
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {dj.startTime} • {dj.genre}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {club.amenities.map((amenity, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {club.specialOffers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">
                        Special Offers
                      </h4>
                      <ul className="text-sm space-y-1">
                        {club.specialOffers.map((offer, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Gift className="h-4 w-4 text-green-500 mt-0.5" />
                            {offer}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-sm font-semibold">
                        {club.currentOccupancy}/{club.capacity}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Current crowd
                      </div>
                    </div>
                    <div className="text-center">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <div className="text-sm font-semibold">Open Now</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        Until 4:00 AM
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => checkInToVenue(club.id)}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Check In & Enter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Live Club Experience */}
          <Card className="mb-8 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Welcome to {selectedVenueData?.name}!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You're now part of the live experience
                  </p>
                </div>
                <Badge className="bg-green-500 text-white animate-pulse">
                  LIVE
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {clubStats.vibePoints}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Vibe Points
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {clubStats.totalCheckedIn}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    People Here
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {clubStats.photosShared}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Moments Shared
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {clubStats.connectionsKade}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Connections
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600">
                    {clubStats.currentDjRating}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    DJ Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="live-feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="live-feed">Live Feed</TabsTrigger>
              <TabsTrigger value="vibe-connect">Vibe Connect</TabsTrigger>
              <TabsTrigger value="dj-booth">DJ Booth</TabsTrigger>
              <TabsTrigger value="drinks">Drinks</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            <TabsContent value="live-feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Post New Moment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="mr-2 h-6 w-6" />
                        Share Your Vibe
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={newMomentText}
                        onChange={(e) => setNewMomentText(e.target.value)}
                        placeholder="What's your vibe right now? Share the energy!"
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-1" />
                            Photo
                          </Button>
                          <Button variant="outline" size="sm">
                            <Smartphone className="h-4 w-4 mr-1" />
                            Story
                          </Button>
                        </div>
                        <Button onClick={postMoment}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Moment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live Moments Feed */}
                  <div className="space-y-4">
                    {liveMoments.map((moment) => (
                      <Card key={moment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={moment.userPhoto} />
                              <AvatarFallback>
                                {moment.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">
                                  {moment.userName}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {moment.location}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {moment.timestamp.toLocaleTimeString()}
                                </span>
                              </div>

                              <p className="mb-3">{moment.content}</p>

                              {moment.mediaUrl && (
                                <img
                                  src={moment.mediaUrl}
                                  alt="Moment"
                                  className="w-full max-w-sm rounded-lg mb-3"
                                />
                              )}

                              <div className="flex items-center gap-4">
                                {["🔥", "💃", "🎉", "👑"].map((emoji) => (
                                  <Button
                                    key={emoji}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      addReaction(moment.id, emoji)
                                    }
                                    className="text-lg p-1 h-8"
                                  >
                                    {emoji}
                                    <span className="ml-1 text-sm">
                                      {moment.reactions.find(
                                        (r) => r.emoji === emoji
                                      )?.count || 0}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Current DJ & Track */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Disc3 className="mr-2 h-6 w-6" />
                        Now Playing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-3">
                        <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto flex items-center justify-center animate-spin">
                          <Music className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">DJ Phoenix</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Progressive House
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{clubStats.currentDjRating}/5.0</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Heart className="mr-2 h-4 w-4" />
                          Rate This Set
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Your Night Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Check-in time:</span>
                        <span className="font-semibold">10:45 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vibe points earned:</span>
                        <span className="font-semibold text-purple-600">
                          +{clubStats.vibePoints}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moments shared:</span>
                        <span className="font-semibold">
                          {clubStats.photosShared}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>New connections:</span>
                        <span className="font-semibold">
                          {clubStats.connectionsKade}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vibe-connect" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-6 w-6" />
                    People You Might Vibe With
                  </CardTitle>
                  <CardDescription>
                    Connect with others who share your music taste and energy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vibeConnections.map((connection) => (
                      <Card
                        key={connection.id}
                        className="border-2 hover:border-purple-500 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={connection.userPhoto} />
                                <AvatarFallback>
                                  {connection.userName[0]}
                                </AvatarFallback>
                              </Avatar>
                              {connection.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">
                                  {connection.userName}
                                </span>
                                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                  {connection.matchScore}% match
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                "{connection.currentMood}"
                              </p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {connection.musicTaste.map((genre, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {connection.location}
                                </span>
                                <Button
                                  size="sm"
                                  onClick={() => connectWithUser(connection.id)}
                                >
                                  Vibe Connect
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dj-booth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Radio className="mr-2 h-6 w-6" />
                    DJ Booth Connection
                  </CardTitle>
                  <CardDescription>
                    Send requests and feedback directly to the DJ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">
                        Current DJ: Phoenix
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span>Set Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-5 w-5 text-yellow-500 fill-current cursor-pointer hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                      </div>
                      <Button className="w-full mb-4">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Send Song Request
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Live DJ Feedback</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span>Energy Level</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            🔥 High
                          </Button>
                          <Button size="sm" variant="outline">
                            😎 Chill
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span>Current Track</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            ❤️ Love it
                          </Button>
                          <Button size="sm" variant="outline">
                            ⏭️ Next
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-6 w-6" />
                    Vibe Points & Rewards
                  </CardTitle>
                  <CardDescription>
                    Earn points and unlock exclusive club perks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {clubStats.vibePoints}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      Total Vibe Points Tonight
                    </div>
                    <Progress value={75} className="mt-4" />
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      750 more points until next reward tier
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2 border-green-200">
                      <CardContent className="p-4 text-center">
                        <Gift className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <h4 className="font-semibold">Free Drink</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          500 Points
                        </p>
                        <Button size="sm" className="w-full">
                          Redeem
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <Crown className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <h4 className="font-semibold">VIP Upgrade</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          1000 Points
                        </p>
                        <Button size="sm" className="w-full" disabled>
                          {clubStats.vibePoints >= 1000
                            ? "Redeem"
                            : "Need more points"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Ways to Earn Points</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Share a moment</span>
                        <span className="font-semibold">+50 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Make a vibe connection</span>
                        <span className="font-semibold">+100 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate the DJ</span>
                        <span className="font-semibold">+25 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in early (before 11 PM)</span>
                        <span className="font-semibold">+200 points</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drinks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Martini className="mr-2 h-6 w-6" />
                    Smart Drink Concierge
                  </CardTitle>
                  <CardDescription>
                    Order drinks seamlessly with QR/NFC wristband integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Drink Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {drinkStats.totalOrders || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Total Orders
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ${drinkStats.revenue || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Revenue
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {cartItems.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Cart Items
                      </div>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={
                        selectedCategory === "all" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Drinks
                    </Button>
                    {["cocktail", "beer", "wine", "non-alcoholic"].map(
                      (category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                      )
                    )}
                  </div>

                  {/* Drinks Menu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {drinksMenu
                      .filter(
                        (drink: any) =>
                          selectedCategory === "all" ||
                          drink.category === selectedCategory
                      )
                      .map((drink: any) => {
                        const Icon = getCategoryIcon(drink.category);
                        const cartItem = cartItems.find(
                          (item) => item.drinkId === drink.id
                        );
                        return (
                          <Card key={drink.id} className="relative">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">
                                    {drink.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    ${drink.price}
                                  </p>
                                </div>
                                <Icon className="h-6 w-6 text-purple-600" />
                              </div>

                              <p className="text-sm text-gray-500 mb-3">
                                {drink.description}
                              </p>

                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  {drink.preparationTime}min
                                </Badge>
                                {drink.abv && (
                                  <Badge variant="outline" className="text-xs">
                                    {drink.abv}% ABV
                                  </Badge>
                                )}
                                <Badge
                                  variant={
                                    drink.availability
                                      ? "default"
                                      : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {drink.availability
                                    ? "Available"
                                    : "Out of Stock"}
                                </Badge>
                              </div>

                              {cartItem ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateCartQuantity(
                                        drink.id,
                                        cartItem.quantity - 1
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="font-semibold">
                                    {cartItem.quantity}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateCartQuantity(
                                        drink.id,
                                        cartItem.quantity + 1
                                      )
                                    }
                                  >
                                    +
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeFromCart(drink.id)}
                                    className="ml-2"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => addToCart(drink.id)}
                                  disabled={!drink.availability}
                                  className="w-full"
                                  size="sm"
                                >
                                  <ShoppingBag className="h-4 w-4 mr-1" />
                                  Add to Cart
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>

                  {/* Current Orders */}
                  {currentOrders.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Your Orders
                      </h3>
                      <div className="space-y-3">
                        {currentOrders.map((order: any) => (
                          <Card key={order.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-semibold">
                                    Order #{order.id.slice(-4)}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {order.items.length} items • $
                                    {order.totalAmount}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Bar: {order.barLocation}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    variant={
                                      order.status === "ready"
                                        ? "default"
                                        : order.status === "preparing"
                                        ? "secondary"
                                        : order.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                    }
                                  >
                                    {order.status === "ready" && (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {order.status === "preparing" && (
                                      <Timer className="h-3 w-3 mr-1" />
                                    )}
                                    {order.status === "pending" && (
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </Badge>
                                  {order.queuePosition > 0 && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Queue: #{order.queuePosition}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cart Summary */}
                  {cartItems.length > 0 && (
                    <Card className="border-2 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Cart Summary</h3>
                        <div className="space-y-2">
                          {cartItems.map((item) => {
                            const drink = drinksMenu.find(
                              (d: any) => d.id === item.drinkId
                            );
                            return drink ? (
                              <div
                                key={item.drinkId}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {drink.name} x{item.quantity}
                                </span>
                                <span>
                                  ${(drink.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className="border-t pt-2 mt-3">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>
                              $
                              {cartItems
                                .reduce((total, item) => {
                                  const drink = drinksMenu.find(
                                    (d: any) => d.id === item.drinkId
                                  );
                                  return (
                                    total +
                                    (drink ? drink.price * item.quantity : 0)
                                  );
                                }, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-3"
                          onClick={handlePayment}
                          disabled={paymentMutation.isPending}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          {paymentMutation.isPending
                            ? "Processing..."
                            : "Order & Pay with QR/NFC"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
