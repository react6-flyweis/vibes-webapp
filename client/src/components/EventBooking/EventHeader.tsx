import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { IEvent } from "@/hooks/useEvents";

interface Props {
  event: IEvent;
}

export default function EventHeader({ event }: Props) {
  // Use event image if provided, otherwise use a random fallback image
  const fallbackImage = `https://picsum.photos/1200/600?random=${Math.floor(
    Math.random() * 100000
  )}`;
  const imageUrl = event.event_image || fallbackImage;
  return (
    <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="relative">
        <img
          src={imageUrl}
          alt={event.name_title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl font-bold">{event.name_title}</h1>
          <p className="text-blue-100">{event.created_by?.Name}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span>{new Date(event.date || "").toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-400" />
            <span>{event.venue_details?.name}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
