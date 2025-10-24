import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent as _CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InvitationEvent } from "@/types/invitation";
import { useEventsByAuthQuery } from "@/queries/events";
import NewEventForm, { NewEventFormValues } from "./NewEventForm";

import image1 from "../../../assests/templateImage/1.jpg";
import image2 from "../../../assests/templateImage/2.jpg";

interface Props {
  setCurrentStep: (s: any) => void;
  onConfirm: (event: InvitationEvent) => void;
}

// Sample data (kept as a fallback)
const sampleEvents: InvitationEvent[] = [
  {
    id: "event-birthday-bash",
    title: "Sarah's 25th Birthday Bash",
    description:
      "Join us for an unforgettable night celebrating Sarah's milestone birthday with music, dancing, and great vibes!",
    date: "2025-07-15",
    time: "20:00",
    venue: "Rooftop Lounge Sky Bar",
    address: "123 Downtown Plaza, City Center",
    hostName: "Sarah Johnson",
    hostAvatar: image1,
    coverImage: image1,
    category: "birthday",
    capacity: 100,
    ticketPrice: 25,
    isPrivate: false,
    requiresApproval: false,
    dresscode: "Cocktail Attire",
    ageRestriction: 21,
    amenities: ["Open Bar", "DJ", "Photo Booth", "VIP Area", "Rooftop Views"],
    vibesTags: ["upbeat", "celebration", "dancing", "cocktails", "skyline"],
    sustainabilityScore: 85,
  },
];

const EventDetails: React.FC<Props> = ({ setCurrentStep, onConfirm }) => {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<InvitationEvent | null>(
    null
  );

  // fetch events the user can manage
  const {
    data: eventsData,
    isLoading: eventsLoading,
    isError: eventsError,
    error: eventsFetchError,
  } = useEventsByAuthQuery();

  // map API EventData to InvitationEvent shape used by this UI
  const fetchedEvents: InvitationEvent[] | null = React.useMemo(() => {
    if (!eventsData || !Array.isArray(eventsData)) return null;
    try {
      return eventsData.map((e: any) => ({
        id: e._id || e.event_id || `event-${Date.now()}`,
        title: e.name_title || e.title || "Untitled Event",
        description: e.description || "",
        date: e.date || (e.created_at ? e.created_at.split("T")[0] : ""),
        time: e.time || "",
        venue: e.venue_name || e.venue || "",
        address: e.street_address || "",
        hostName: e.created_by ? String(e.created_by) : "",
        hostAvatar: e.event_image || "",
        coverImage: e.event_image || "",
        category:
          e.event_type_id && String(e.event_type_id).includes("1")
            ? "party"
            : "party",
        capacity: e.max_capacity || 0,
        ticketPrice: e.ticket_price || undefined,
        isPrivate: e.status === false ? true : false,
        requiresApproval: false,
        dresscode: undefined,
        ageRestriction: undefined,
        amenities: e.live_vibes_invite_vip_perks || [],
        vibesTags: e.tags || [],
        sustainabilityScore: undefined,
      })) as InvitationEvent[];
    } catch (err) {
      return null;
    }
  }, [eventsData]);

  const createEventMutation = useMutation<
    InvitationEvent,
    Error,
    Partial<InvitationEvent>
  >({
    mutationFn: async (data: Partial<InvitationEvent>) => {
      const response = await apiRequest("POST", "/api/events", data);
      try {
        return await response.json();
      } catch {
        return response;
      }
    },
    onSuccess: (data: InvitationEvent) => {
      setSelectedEvent(data);
      setCurrentStep("template");
      toast({
        title: "Event Created",
        description: "Your event has been created successfully",
      });
      onConfirm(data);
    },
  });

  // 'new' tab is rendered below using NewEventForm

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#EB6F71]" />
          Event Details
        </CardTitle>
        <CardDescription>
          Create your event or select from existing events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#111827] text-white">
            <TabsTrigger value="new">Create New Event</TabsTrigger>
            <TabsTrigger value="existing">Select Existing Event</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-6">
            <NewEventForm
              isLoading={createEventMutation.isPending}
              onCreate={(data: NewEventFormValues) => {
                createEventMutation.mutate({
                  ...data,
                  id: `event-${Date.now()}`,
                  hostName: "Current User",
                  hostAvatar:
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                  coverImage:
                    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
                  amenities: [],
                  category: (data.category as any) || "party",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="existing" className="space-y-6">
            {eventsLoading ? (
              <div className="p-4">Loading your events...</div>
            ) : eventsError ? (
              <div className="p-4 text-red-500">
                Failed to load events.{" "}
                {String((eventsFetchError as any)?.message || "")}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(fetchedEvents ?? sampleEvents).map((event) => (
                  <Card
                    key={event.id}
                    className={`cursor-pointer transition-all ${
                      selectedEvent?.id === event.id
                        ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => {
                      setSelectedEvent(event);
                      setCurrentStep("template");
                      onConfirm(event);
                    }}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={event.coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-white/90 inline-block px-2 py-1 rounded">
                          {event.category}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.date} at {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.venue}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Up to {event.capacity} guests
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EventDetails;
