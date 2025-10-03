import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Calendar,
  MapPin,
  Camera,
  Eye,
  Star,
  Heart,
  Bookmark,
  Share2,
  Filter,
  Search,
  Maximize,
  RotateCcw,
  ShoppingCart,
  MessageCircle,
  Phone,
  Clock,
  Users,
  Palette,
  Leaf,
  Zap,
  Award,
  TrendingUp,
  Building2,
  TreePine,
  Flower2,
  Lightbulb,
  Sparkles,
  Gift,
  Music,
  Cake,
  LogOut,
} from "lucide-react";

interface VenueShowcase {
  id: string;
  venueName: string;
  location: string;
  vendorName: string;
  theme: string;
  style: string;
  priceRange: string;
  rating: number;
  totalBookings: number;
  showcaseDate: string;
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  decorElements: DecorElement[];
  sustainability: {
    ecoFriendly: boolean;
    reusable: boolean;
    localSourced: boolean;
  };
  availability: {
    nextAvailable: string;
    bookedDates: string[];
  };
}

interface DecorElement {
  id: string;
  type:
    | "centerpiece"
    | "lighting"
    | "backdrop"
    | "florals"
    | "arch"
    | "draping";
  name: string;
  price: number;
  description: string;
  position: { x: number; y: number };
  customizable: boolean;
  inStock: boolean;
}

export default function NaturalVenueShowcase() {
  const [showcases, setShowcases] = useState<VenueShowcase[]>([]);
  const [selectedShowcase, setSelectedShowcase] =
    useState<VenueShowcase | null>(null);
  const [viewMode, setViewMode] = useState<"gallery" | "virtual" | "ar">(
    "gallery"
  );
  const [filterTheme, setFilterTheme] = useState("all");
  const [filterStyle, setFilterStyle] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<DecorElement[]>([]);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);

  // Sample venue showcases
  const sampleShowcases: VenueShowcase[] = [
    {
      id: "showcase-1",
      venueName: "Grand Ballroom at The Metropolitan",
      location: "Downtown NYC",
      vendorName: "Ethereal Events Studio",
      theme: "Luxury Wedding",
      style: "Modern Elegance",
      priceRange: "$5,000 - $12,000",
      rating: 4.9,
      totalBookings: 47,
      showcaseDate: "2024-12-15",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop&auto=format",
      ],
      virtualTourUrl: "/virtual-tours/grand-ballroom-luxury",
      decorElements: [
        {
          id: "elem-1",
          type: "centerpiece",
          name: "Crystal Rose Centerpiece",
          price: 450,
          description: "Hand-crafted crystal vases with premium white roses",
          position: { x: 50, y: 60 },
          customizable: true,
          inStock: true,
        },
        {
          id: "elem-2",
          type: "lighting",
          name: "Ambient LED Uplighting",
          price: 800,
          description: "Wireless LED system with customizable colors",
          position: { x: 20, y: 30 },
          customizable: true,
          inStock: true,
        },
        {
          id: "elem-3",
          type: "backdrop",
          name: "Silk Drape Backdrop",
          price: 1200,
          description: "Premium silk draping with crystal accents",
          position: { x: 50, y: 10 },
          customizable: true,
          inStock: true,
        },
      ],
      sustainability: {
        ecoFriendly: true,
        reusable: true,
        localSourced: false,
      },
      availability: {
        nextAvailable: "2024-12-20",
        bookedDates: ["2024-12-25", "2024-12-31"],
      },
    },
    {
      id: "showcase-2",
      venueName: "Garden Pavilion at Riverside",
      location: "Brooklyn Heights",
      vendorName: "Bloom & Willow Co.",
      theme: "Boho Garden Party",
      style: "Natural Rustic",
      priceRange: "$2,500 - $6,000",
      rating: 4.7,
      totalBookings: 32,
      showcaseDate: "2024-12-18",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
      ],
      virtualTourUrl: "/virtual-tours/garden-pavilion-boho",
      decorElements: [
        {
          id: "elem-4",
          type: "florals",
          name: "Wildflower Arrangements",
          price: 320,
          description: "Seasonal wildflowers in rustic mason jars",
          position: { x: 40, y: 70 },
          customizable: true,
          inStock: true,
        },
        {
          id: "elem-5",
          type: "arch",
          name: "Macrame Ceremony Arch",
          price: 950,
          description: "Hand-woven macrame with dried pampas grass",
          position: { x: 50, y: 20 },
          customizable: false,
          inStock: true,
        },
      ],
      sustainability: {
        ecoFriendly: true,
        reusable: true,
        localSourced: true,
      },
      availability: {
        nextAvailable: "2024-12-22",
        bookedDates: ["2024-12-28"],
      },
    },
    {
      id: "showcase-3",
      venueName: "Rooftop Terrace at Sky Lounge",
      location: "Manhattan Midtown",
      vendorName: "Urban Chic Designs",
      theme: "Corporate Gala",
      style: "Minimalist Modern",
      priceRange: "$8,000 - $15,000",
      rating: 4.8,
      totalBookings: 28,
      showcaseDate: "2024-12-20",
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&auto=format",
      ],
      virtualTourUrl: "/virtual-tours/rooftop-terrace-corporate",
      decorElements: [
        {
          id: "elem-6",
          type: "lighting",
          name: "Linear LED Installation",
          price: 2200,
          description: "Architectural LED strips with programmable patterns",
          position: { x: 30, y: 15 },
          customizable: true,
          inStock: true,
        },
      ],
      sustainability: {
        ecoFriendly: false,
        reusable: true,
        localSourced: false,
      },
      availability: {
        nextAvailable: "2025-01-05",
        bookedDates: ["2025-01-01", "2025-01-15"],
      },
    },
  ];

  useEffect(() => {
    setShowcases(sampleShowcases);
    setSelectedShowcase(sampleShowcases[0]);
  }, []);

  const filteredShowcases = showcases.filter((showcase) => {
    const matchesTheme =
      filterTheme === "all" ||
      showcase.theme.toLowerCase().includes(filterTheme.toLowerCase());
    const matchesStyle =
      filterStyle === "all" ||
      showcase.style.toLowerCase().includes(filterStyle.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      showcase.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showcase.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showcase.theme.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTheme && matchesStyle && matchesSearch;
  });

  const toggleFavorite = (showcaseId: string) => {
    setFavorites((prev) =>
      prev.includes(showcaseId)
        ? prev.filter((id) => id !== showcaseId)
        : [...prev, showcaseId]
    );
  };

  const addToWishlist = (element: DecorElement) => {
    if (!wishlist.find((item) => item.id === element.id)) {
      setWishlist([...wishlist, element]);
    }
  };

  const removeFromWishlist = (elementId: string) => {
    setWishlist(wishlist.filter((item) => item.id !== elementId));
  };

  const calculateTotalWishlistPrice = () => {
    return wishlist.reduce((total, item) => total + item.price, 0);
  };

  const startVirtualTour = (showcase: VenueShowcase) => {
    setSelectedShowcase(showcase);
    setIsVirtualTourActive(true);
    setViewMode("virtual");
  };

  const renderShowcaseCard = (showcase: VenueShowcase) => (
    <Card
      key={showcase.id}
      className="overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <div
          className="h-48 bg-gray-200 bg-cover bg-center relative cursor-pointer"
          style={{ backgroundImage: `url(${showcase.images[0]})` }}
          onClick={() => setSelectedShowcase(showcase)}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90">
              <Calendar className="w-3 h-3 mr-1" />
              Showcase: {new Date(showcase.showcaseDate).toLocaleDateString()}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {showcase.sustainability.ecoFriendly && (
              <Badge className="bg-green-500 text-white">
                <Leaf className="w-3 h-3" />
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(showcase.id);
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  favorites.includes(showcase.id)
                    ? "fill-red-500 text-red-500"
                    : ""
                }`}
              />
            </Button>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Virtual Tour</span>
              </div>
              <div className="flex items-center gap-1 text-white">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{showcase.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">
                {showcase.venueName}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {showcase.location}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{showcase.vendorName}</span>
              <Badge variant="outline">{showcase.theme}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{showcase.style}</span>
              <span className="text-sm font-medium text-green-600">
                {showcase.priceRange}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {showcase.totalBookings} bookings
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Available{" "}
              {new Date(
                showcase.availability.nextAvailable
              ).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => startVirtualTour(showcase)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Virtual Tour
            </Button>
            <Button size="sm" variant="outline">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderVirtualTour = () => {
    if (!selectedShowcase || !isVirtualTourActive) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {selectedShowcase.venueName}
            </h3>
            <p className="text-gray-600">
              Virtual Tour - {selectedShowcase.theme}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Maximize className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsVirtualTourActive(false)}
            >
              <LogOut className="w-4 h-4" />
              Exit Tour
            </Button>
          </div>
        </div>

        <div
          className="relative h-96 rounded-lg overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url(${selectedShowcase.images[0]})`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-xl text-white">
                  360° Virtual Tour
                </h4>
                <p className="text-gray-200 max-w-md">
                  Interactive virtual reality experience showing{" "}
                  {selectedShowcase.vendorName}'s
                  {selectedShowcase.theme} setup in {selectedShowcase.venueName}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive hotspots */}
          {selectedShowcase.decorElements.map((element, index) => (
            <button
              key={element.id}
              className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform animate-pulse"
              style={{
                left: `${element.position.x}%`,
                top: `${element.position.y}%`,
              }}
              onClick={() => {
                /* Show element details */
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedShowcase.decorElements.map((element) => (
            <Card key={element.id} className="p-2">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{element.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {element.type}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    ${element.price}
                  </div>
                  {element.customizable && (
                    <Badge variant="outline" className="text-xs">
                      Customizable
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {element.description}
              </p>

              {/* Responsive buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => addToWishlist(element)}
                >
                  <Bookmark className="w-3 h-3 mr-1" />
                  Add to Wishlist
                </Button>
                <Button size="sm" className="flex-1">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Header */}
      <div className="bg-[#1F2937] shadow-xs ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Natural Venue Showcase
              </h1>
              <p className="text-white">
                Immersive decor experiences in real venues
              </p>
            </div>
            <div className="flex items-center gap-4 text-whit">
              <Badge variant="outline" className="px-3 py-1 text-white">
                Wishlist: ${calculateTotalWishlistPrice()}
              </Badge>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-3 space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Search Venues</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Venue, vendor, or theme..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Theme</Label>
                  <Select value={filterTheme} onValueChange={setFilterTheme}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Themes</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="garden">Garden Party</SelectItem>
                      <SelectItem value="boho">Boho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Style</Label>
                  <Select value={filterStyle} onValueChange={setFilterStyle}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="rustic">Rustic</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Sustainability
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Eco-friendly materials
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Reusable decorations
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Locally sourced
                </label>
              </div>
            </Card>

            {wishlist.length > 0 && (
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Your Wishlist ({wishlist.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">${item.price}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${calculateTotalWishlistPrice()}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Request Quote
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {isVirtualTourActive ? (
              <Card className="p-6">{renderVirtualTour()}</Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Featured Venue Showcases ({filteredShowcases.length})
                    </h2>
                    <p className="text-gray-600">
                      Real decor setups in actual venues - virtually explore
                      before you book
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "gallery" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("gallery")}
                    >
                      Gallery
                    </Button>
                    <Button
                      variant={viewMode === "virtual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("virtual")}
                    >
                      Virtual Tours
                    </Button>
                    <Button
                      variant={viewMode === "ar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("ar")}
                    >
                      AR Preview
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShowcases.map((showcase) =>
                    renderShowcaseCard(showcase)
                  )}
                </div>

                {filteredShowcases.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No showcases found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Showcase Day Banner */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Join Our Next Showcase Day
          </h2>
          <p className="text-purple-100 mb-4">
            Vendors can book time slots to set up real decor themes in partner
            venues
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Book Showcase Slot
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Award className="w-4 h-4 mr-2" />
              Become a Partner Venue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
