import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IEvent, fetchEvents } from "@/hooks/useEvents";
import { useQuery } from "@tanstack/react-query";
import type { IResponseList } from "@/types";
import useDebounce from "@/hooks/useDebounce";
import EventCard from "@/components/event-card/EventCard";
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
import EventCategorySelector from "@/components/event-category-selector";
import CountrySelector from "@/components/country-selector";
import { Calendar, MapPin, Search, Plus } from "lucide-react";

interface EventFilters {
  category: string;
  genre: string;
  location: string;
  priceRange: string;
  dateRange: string;
  sortBy: string;
}

export default function EventDiscovery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilters>({
    category: "any",
    genre: "any",
    location: "any",
    priceRange: "any",
    dateRange: "any",
    sortBy: "date",
  });

  const debouncedSearch = useDebounce(searchQuery, 350);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Fetch events from the server using paginated endpoint (debounced search)
  const queryKey = [
    "/api/events/getAll",
    {
      page,
      limit,
      search: debouncedSearch,
      sortBy: filters.sortBy === "date" ? "created_at" : filters.sortBy,
      sortOrder: "desc",
      status: true,
    },
  ];

  const { data: paginatedRaw, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      fetchEvents({
        page,
        limit,
        search: debouncedSearch,
        status: true,
        sortBy: filters.sortBy === "date" ? "created_at" : filters.sortBy,
        sortOrder: "desc",
      }),
    select: (res) => res.data,
  });

  const paginated = paginatedRaw as IResponseList<IEvent> | undefined;

  // convenience variables
  const events: IEvent[] =
    (paginated as IResponseList<IEvent> | undefined)?.data ?? [];
  const pagination = (paginated as IResponseList<IEvent> | undefined)
    ?.pagination;

  const totalCount = pagination?.totalItems;

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // reset to first page when search or sort/filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.sortBy]);

  // Don't unmount the search/filter UI while loading — show skeletons in the events grid instead

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

        {/* Search Card (already present above) */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            {/* Primary Search - Category and Location First */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label className="text-white text-sm font-medium mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Category
                </Label>
                <EventCategorySelector
                  value={filters.category}
                  onChange={(value) => handleFilterChange("category", value)}
                  className="h-12 bg-white/10 border-white/20 text-white"
                  placeholder="Choose event type..."
                />
              </div>

              <div>
                <Label className="text-white text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Label>
                <CountrySelector
                  value={filters.location}
                  onChange={(value) => handleFilterChange("location", value)}
                  className="h-12"
                  placeholder="Select country..."
                />
              </div>
            </div>

            {/* Create Event Button */}
            <div className="mb-6 text-center">
              <Button
                onClick={() => navigate("/create-event")}
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

        {/* All Events Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-100">All Events</h2>
            <div className="text-purple-200">{totalCount} events found</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card
                    key={`skeleton-${i}`}
                    className="bg-white/5 backdrop-blur-sm border-white/10"
                  >
                    <CardContent className="p-4">
                      <div className="h-40 bg-white/10 rounded-md mb-4 animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
                      <div className="h-3 bg-white/10 rounded w-1/2 mb-2 animate-pulse" />
                      <div className="flex items-center justify-between mt-4">
                        <div className="h-8 bg-white/10 rounded w-1/3 animate-pulse" />
                        <div className="h-8 bg-white/10 rounded w-1/4 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              : events?.map((event) => (
                  <EventCard key={event.event_id} event={event as IEvent} />
                ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={
                isLoading || (pagination ? !pagination.hasPrevPage : page <= 1)
              }
            >
              Previous
            </Button>

            <div className="text-purple-200">
              Page {page}
              {pagination && pagination.totalPages
                ? ` of ${pagination.totalPages}`
                : ""}
            </div>

            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={
                isLoading ||
                (pagination ? !pagination.hasNextPage : events.length < limit)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
