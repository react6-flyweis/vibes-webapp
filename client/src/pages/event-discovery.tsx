import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Search,
  Star,
  Users,
  Plus,
  Clock,
  DollarSign,
  Filter,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  category:
    | "concert"
    | "sports"
    | "festival"
    | "conference"
    | "theater"
    | "comedy";
  genre?: string;
  artist?: string;
  team?: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  time: string;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  image: string;
  rating: number;
  attendees: number;
  maxCapacity: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  soldOut: boolean;
  organizer: string;
  ticketTypes: Array<{
    type: string;
    price: number;
    available: number;
    benefits: string[];
  }>;
}

interface EventFilters {
  category: string;
  genre: string;
  location: string;
  priceRange: string;
  dateRange: string;
  sortBy: string;
}

const eventsData = [
  {
    id: "party_bus_001",
    title: "Miami Party Bus Tour",
    description:
      "VIP party bus experience through Miami's hottest nightlife spots with LED lights, premium sound system, and celebrity DJ.",
    category: "party-bus",
    venue: "Miami Party Bus Co.",
    address: "South Beach District",
    city: "Miami",
    date: "2025-06-20",
    time: "18:00",
    price: { min: 89, max: 149, currency: "USD" },
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=240&fit=crop&auto=format",
    rating: 4.9,
    attendees: 78,
    maxCapacity: 100,
    tags: ["party bus", "nightlife", "Miami", "VIP"],
    featured: true,
    trending: true,
    soldOut: false,
    organizer: "Miami Nightlife Tours",
  },
];

export default function EventDiscovery() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilters>({
    category: "any",
    genre: "any",
    location: "any",
    priceRange: "any",
    dateRange: "any",
    sortBy: "date",
  });

  const { data: events = eventsData, isLoading } = useQuery({
    queryKey: ["/api/events"],
    // queryKey: ["/api/events", { filters, search: searchQuery }],
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ["/api/event-recommendations"],
  });

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Discover Amazing Events
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Find concerts, sports, festivals, and more near you with AI-powered
            recommendations
          </p>
        </div>

        {/* Enhanced Search Interface */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {/* Primary Search - Category and Location First */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-white text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Category
                </Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                    <SelectValue placeholder="Choose event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">All Categories</SelectItem>
                    <SelectItem value="concert">Concerts & Music</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="festival">Festivals</SelectItem>
                    <SelectItem value="conference">Conferences</SelectItem>
                    <SelectItem value="theater">Theater & Arts</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="nearby">Near Me</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="australia">
                      Australia & Oceania
                    </SelectItem>
                    <SelectItem value="south-america">South America</SelectItem>
                    <SelectItem value="africa">Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Create Event Button */}
            <div className="mb-6 text-center">
              <Button
                onClick={() => setLocation("/create-event")}
                className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold px-8 py-3"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your Event
              </Button>
            </div>

            {/* Text Search Bar */}
            <div className="mt-4">
              <Label className="text-white text-sm font-medium mb-2 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Search Events
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                <Input
                  placeholder="Search events, artists, teams, or venues..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200 h-12"
                />
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-purple-100">Price Range</Label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      handleFilterChange("priceRange", value)
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Price</SelectItem>
                      <SelectItem value="0-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-200">$100 - $200</SelectItem>
                      <SelectItem value="200+">$200+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-purple-100">Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      handleFilterChange("dateRange", value)
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Any Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">Next 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-purple-100">Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-100">
            Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(recommendations) &&
              recommendations.slice(0, 4).map((event: Event) => (
                <Card
                  key={event.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-40 object-cover"
                    />
                    {event.featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white truncate">
                      {event.title}
                    </h3>
                    <p className="text-purple-200 text-sm">{event.venue}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-400 font-medium">
                        ${event.price.min}+
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-purple-200 text-sm ml-1">
                          {event.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Events Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-100">All Events</h2>
            <div className="text-purple-200">
              {Array.isArray(events) ? events.length : 0} events found
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(events) &&
              events.map((event: Event) => (
                <Card
                  key={event.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-yellow-500 text-black font-medium">
                        Featured
                      </Badge>
                    )}

                    {event.trending && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white">
                        Trending
                      </Badge>
                    )}

                    {event.soldOut && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Badge className="bg-red-600 text-white text-lg px-6 py-2">
                          SOLD OUT
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge
                        variant="outline"
                        className="text-purple-300 border-purple-300 mb-2"
                      >
                        {event.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                        {event.title}
                      </h3>
                      {event.artist && (
                        <p className="text-purple-300 font-medium">
                          {event.artist}
                        </p>
                      )}
                      {event.team && (
                        <p className="text-purple-300 font-medium">
                          {event.team}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-purple-200">
                        <MapPin className="h-4 w-4 mr-2 shrink-0" />
                        <span className="text-sm truncate">
                          {event.venue}, {event.city}
                        </span>
                      </div>

                      <div className="flex items-center text-purple-200">
                        <Calendar className="h-4 w-4 mr-2 shrink-0" />
                        <span className="text-sm">{event.date}</span>
                      </div>

                      <div className="flex items-center text-purple-200">
                        <Clock className="h-4 w-4 mr-2 shrink-0" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-green-400 font-bold">
                          {event.price.min === event.price.max
                            ? `$${event.price.min}`
                            : `$${event.price.min} - $${event.price.max}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-purple-200 text-sm">
                            {event.rating}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-400 mr-1" />
                          <span className="text-purple-200 text-sm">
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs bg-purple-800/50 text-purple-200 border-purple-600"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => setLocation(`/events/booking/${event.id}`)}
                      className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                      disabled={event.soldOut}
                    >
                      {event.soldOut ? "Sold Out" : "Book Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Trending Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-100">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {Array.isArray(events) &&
              events
                .filter((e: Event) => e.trending)
                .slice(0, 3)
                .map((event: Event) => (
                  <Card
                    key={event.id}
                    className="bg-white/10  border-none  overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-32 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        🔥 Trending
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-white mb-2">
                        {event.title}
                      </h3>
                      <p className="text-purple-200 text-sm mb-2">
                        {event.venue}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-medium">
                          ${event.price.min}+
                        </span>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-400 mr-1" />
                          <span className="text-purple-200 text-sm">
                            {event.attendees} going
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
