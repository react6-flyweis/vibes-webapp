import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import MyEventCard from "@/components/event-card/MyEventCard";
import { useMyEvents } from "@/hooks/useMyEvents";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import Navigation from "@/components/navigation";

export default function MyEvents() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: events, isLoading } = useMyEvents({
    page: 1,
    limit: 50,
    search: debouncedSearch,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  return (
    <div className="">
      <Navigation />
      <div className="min-h-screen bg-linear-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              My Events
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              Events you've created or are managing. Use the search box to
              filter your events.
            </p>
          </div>

          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <Label className="text-white text-sm font-medium mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Search My Events
                  </Label>
                  <Input
                    placeholder="Search by title, venue or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 bg-white/10 border-white/20 text-white placeholder:text-purple-200 h-12"
                  />
                </div>

                <div className="md:col-span-2 text-right">
                  <Button
                    onClick={() => navigate("/create-event")}
                    className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-2"
                  >
                    <Plus className="h-4 w-4 mr-2 inline" />
                    Create Event
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-purple-100">My Events</h2>
              <div className="text-purple-200">
                {Array.isArray(events) ? events.length : 0} events
              </div>
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
                    <MyEventCard
                      key={(event as any).event_id ?? (event as any)._id}
                      event={event as any}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
