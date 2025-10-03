import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Users,
  Star,
  DollarSign,
  Search,
  Waves,
  Bus,
  Building2,
  Plane,
  Train,
  Flame,
  Sailboat,
  Mountain,
  Share2,
} from "lucide-react";
import SocialShare from "@/components/social-share";

const categoryIcons = {
  "party-bus": Bus,
  cruise: Waves,
  yacht: Sailboat,
  rooftop: Building2,
  warehouse: Building2,
  beach: Mountain,
  pool: Waves,
  boat: Sailboat,
  "private-jet": Plane,
  train: Train,
  underground: Flame,
};

const categoryLabels = {
  "party-bus": "Party Bus",
  cruise: "Cruise Party",
  yacht: "Yacht Party",
  rooftop: "Rooftop Party",
  warehouse: "Warehouse Party",
  beach: "Beach Party",
  pool: "Pool Party",
  boat: "Boat Party",
  "private-jet": "Private Jet",
  train: "Party Train",
  underground: "Underground",
};

export default function UniquePartyExperiences() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events/discover"],
  });

  // Filter events to show only unique party types
  const allEvents = Array.isArray(events) ? events : [];
  const uniquePartyEvents = allEvents.filter((event: any) =>
    [
      "party-bus",
      "cruise",
      "yacht",
      "rooftop",
      "warehouse",
      "beach",
      "pool",
      "boat",
      "private-jet",
      "train",
      "underground",
    ].includes(event.category)
  );

  const filteredEvents = uniquePartyEvents.filter((event: any) => {
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    const matchesCity = selectedCity === "all" || event.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  const cities = Array.from(
    new Set(uniquePartyEvents.map((event: any) => event.city).filter(Boolean))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Unique Party Experiences
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Discover extraordinary party venues and experiences - from luxury
            yacht cruises to underground warehouse raves
          </p>
        </div>

        {/* Category Icons Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-4 mb-8">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            const isSelected = selectedCategory === key;
            return (
              <Button
                key={key}
                variant={isSelected ? "default" : "outline"}
                onClick={() => setSelectedCategory(isSelected ? "all" : key)}
                className={`h-20 flex flex-col gap-2 ${
                  isSelected
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search unique experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">City</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {filteredEvents.length}
              </div>
              <div className="text-purple-200">Unique experiences found</div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => {
            const Icon =
              categoryIcons[event.category as keyof typeof categoryIcons] ||
              Bus;
            const categoryLabel =
              categoryLabels[event.category as keyof typeof categoryLabels] ||
              event.category;

            return (
              <Card
                key={event.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600/90 text-white flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {categoryLabel}
                    </Badge>
                  </div>
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500/90 text-black">
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="h-4 w-4" />
                    {event.city}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-purple-100 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <Calendar className="h-4 w-4" />
                      {event.date} at {event.time}
                    </div>

                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <Users className="h-4 w-4" />
                      {event.attendees} / {event.maxCapacity} attending
                    </div>

                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <DollarSign className="h-4 w-4" />
                      {typeof event.price === "object"
                        ? `${event.price.currency} ${event.price.min} - ${event.price.max}`
                        : `$${event.price}`}
                    </div>

                    <div className="flex items-center gap-2 text-purple-200 text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      {event.rating} rating
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags
                      ?.slice(0, 3)
                      .map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-purple-300 text-purple-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                        onClick={() =>
                          (window.location.href = `/events/${event.id}`)
                        }
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShareModalOpen(true);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() =>
                        (window.location.href = `/events/booking/${event.id}`)
                      }
                    >
                      Book Now - From $
                      {typeof event.price === "object"
                        ? event.price.min
                        : event.price}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center text-white py-12">
            <h3 className="text-xl mb-2">No unique experiences found</h3>
            <p className="text-purple-200">
              Try adjusting your search criteria or check back later for new
              events
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-linear-to-r from-purple-600/20 to-blue-600/20 border-purple-300/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to host your own unique party experience?
              </h3>
              <p className="text-purple-200 mb-6">
                Create unforgettable memories with our specialized event
                planning services
              </p>
              <Button
                size="lg"
                className="bg-linear-to-r from-purple-600 to-blue-600"
                onClick={() => (window.location.href = "/create-event")}
              >
                Create Your Event
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Social Share Modal */}
        {selectedEvent && (
          <SocialShare
            event={selectedEvent}
            isOpen={shareModalOpen}
            onClose={() => {
              setShareModalOpen(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
