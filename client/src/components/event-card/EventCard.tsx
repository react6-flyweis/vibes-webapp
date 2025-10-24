import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { IEvent } from "@/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, DollarSign, Star, Users } from "lucide-react";
import { formatDate } from "@/lib/formatDate";

type Props = {
  event: IEvent;
};

export default function EventCard({ event }: Props) {
  const navigate = useNavigate();
  const fallbackImage = useMemo(() => {
    const seed =
      event.event_id ??
      event.name_title ??
      Math.random().toString(36).slice(2, 9);
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;
  }, [event.event_id, event.name_title]);

  const [imgSrc, setImgSrc] = useState<string>(
    event.event_image || fallbackImage
  );

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer group">
      <div className="relative">
        <img
          src={imgSrc}
          alt={event.name_title}
          loading="lazy"
          onError={() => {
            if (imgSrc !== fallbackImage) setImgSrc(fallbackImage);
          }}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Badge className="absolute top-3 right-3 bg-red-500 text-white">
          Trending
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <Badge
            variant="outline"
            className="text-purple-300 border-purple-300 mb-2"
          >
            {event.event_category_tags_id?.name}
          </Badge>
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
            {event.name_title}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-purple-200">
            <MapPin className="h-4 w-4 mr-2 shrink-0" />
            <span className="text-sm truncate">
              {event.venue_details?.name}, {event.venue_details?.address}
            </span>
          </div>

          <div className="flex items-center text-purple-200">
            <Calendar className="h-4 w-4 mr-2 shrink-0" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center text-purple-200">
            <Clock className="h-4 w-4 mr-2 shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-green-400 font-bold">0{/* price */}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="text-purple-200 text-sm">0</span>
            </div>

            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-purple-200 text-sm">0</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags?.slice(0, 3).map((tag, index) => (
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
          onClick={() => navigate(`/events/booking/${event.event_id}`)}
          className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}
