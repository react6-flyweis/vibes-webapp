import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Ticket,
  Heart,
  Share2,
  TrendingUp,
  Music,
  Mic,
  Trophy,
  Gamepad2,
  Palette,
  Camera,
  Book,
  Coffee,
  ShoppingBag
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  time: string;
  price: { min: number; max: number; currency: string };
  image: string;
  rating: number;
  attendees: number;
  maxCapacity: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  soldOut: boolean;
  organizer: string;
}

const categoryIcons = {
  concert: Music,
  sports: Trophy,
  theater: Mic,
  gaming: Gamepad2,
  art: Palette,
  photography: Camera,
  education: Book,
  food: Coffee,
  shopping: ShoppingBag,
  default: Calendar
};

const regions = [
  "All Regions",
  "North America",
  "Europe", 
  "Asia",
  "South America",
  "Africa",
  "Oceania"
];

const categories = [
  "All Categories",
  "Concert",
  "Sports",
  "Theater",
  "Gaming",
  "Art",
  "Photography",
  "Education",
  "Food & Drink",
  "Shopping"
];

const priceRanges = [
  "All Prices",
  "Free",
  "Under $25",
  "$25 - $50",
  "$50 - $100",
  "$100 - $200",
  "Over $200"
];

export default function FindAndBookEvents() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events/discover", { 
      category: selectedCategory,
      location: selectedRegion,
      priceRange: selectedPriceRange,
      sortBy,
      search: searchQuery
    }]
  });

  const handleBookEvent = (eventId: string) => {
    setLocation(`/events/booking/${eventId}`);
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category.toLowerCase() as keyof typeof categoryIcons] || categoryIcons.default;
    return IconComponent;
  };

  const getPriceDisplay = (price: any) => {
    if (price.min === 0) return "Free";
    if (price.min === price.max) return `$${price.min}`;
    return `$${price.min} - $${price.max}`;
  };

  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All Categories" || 
      event.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find & Book Events</h1>
          <p className="text-xl text-blue-100 mb-6">
            Discover amazing events worldwide and book your tickets instantly
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search events, venues, or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-300"
                />
              </div>

              {/* Quick Filters */}
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-blue-100 mb-2 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-blue-100 mb-2 block">Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-blue-100 mb-2 block">Price Range</Label>
                  <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-blue-100 mb-2 block">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-blue-300 hover:text-white"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide" : "More"} Filters
                </Button>
                <p className="text-blue-200 text-sm">
                  {filteredEvents.length} events found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Events Section */}
        {filteredEvents.some((event: Event) => event.featured) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Featured Events
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredEvents
                .filter((event: Event) => event.featured)
                .slice(0, 2)
                .map((event: Event) => (
                  <Card key={event.id} className="bg-white/10 backdrop-blur border-white/20 overflow-hidden">
                    <div className="relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-black">Featured</Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="sm" variant="ghost" className="bg-black/20 hover:bg-black/40">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="bg-black/20 hover:bg-black/40">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <p className="text-blue-100">{event.organizer}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-400" />
                          <span>{event.attendees}/{event.maxCapacity}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{event.rating}</span>
                          </div>
                          <div className="text-lg font-bold text-green-400">
                            {getPriceDisplay(event.price)}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleBookEvent(event.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Events Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">All Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: Event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              
              return (
                <Card key={event.id} className="bg-white/10 backdrop-blur border-white/20 overflow-hidden hover:bg-white/15 transition-all">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {event.trending && (
                        <Badge className="bg-red-500 text-white">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {event.soldOut && (
                        <Badge className="bg-gray-500 text-white">Sold Out</Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/50 text-white">
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-white mb-1">{event.title}</h3>
                    <p className="text-blue-100 text-sm mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-blue-400" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <Clock className="h-3 w-3 text-blue-400 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-blue-400" />
                        <span className="line-clamp-1">{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-blue-400" />
                        <span>{event.attendees}/{event.maxCapacity} attending</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{event.rating}</span>
                        </div>
                        <div className="font-bold text-green-400">
                          {getPriceDisplay(event.price)}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookEvent(event.id)}
                        disabled={event.soldOut}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Ticket className="h-4 w-4 mr-1" />
                        {event.soldOut ? "Sold Out" : "Book"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <Card className="bg-white/10 backdrop-blur border-white/20 text-center p-8">
            <Search className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-blue-100 mb-4">
              Try adjusting your search criteria or explore different categories
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setSelectedRegion("All Regions");
                setSelectedPriceRange("All Prices");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}