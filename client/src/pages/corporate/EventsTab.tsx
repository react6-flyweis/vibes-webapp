import React from "react";
import { IEvent, useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/event-card/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, Briefcase, Users } from "lucide-react";

// const getEventTypeIcon = (type: string) => {
//   switch (type) {
//     case "team-building":
//       return <Users className="h-4 w-4 text-slate-300" />;
//     case "client-event":
//       return <Briefcase className="h-4 w-4 text-slate-300" />;
//     case "company-party":
//       return <Calendar className="h-4 w-4 text-slate-300" />;
//     default:
//       return <Calendar className="h-4 w-4 text-slate-300" />;
//   }
// };

export default function EventsTab() {
  // Use the shared hook to fetch corporate events. Keep server-side params minimal for UI.
  const { data: corporateEvents = [], isLoading } = useEvents({
    page: 1,
    limit: 12,
    search: "",
    status: true,
    sortBy: "created_at",
    sortOrder: "desc",
    // If your hook supports filters by type/department you can pass them here.
  });

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Corporate Events</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="p-6">Loading events...</div>
        ) : corporateEvents.length === 0 ? (
          <div className="p-6 text-slate-300">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corporateEvents.map((event) => (
              // Reuse the shared EventCard for consistency across the app
              <EventCard
                key={(event as any).event_id || (event as any).id}
                event={event as IEvent}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
