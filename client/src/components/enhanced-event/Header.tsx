import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  event: any;
  stats: any;
  getTimeUntilEvent: () => string | null;
}

export default function Header({ event, stats, getTimeUntilEvent }: Props) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl shadow-lg p-6 mb-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Plan My Event</h1>
            {event.eventType && (
              <Badge variant="secondary" className="capitalize">
                {event.eventType}
              </Badge>
            )}
          </div>
          <p className="text-[#FFFFFF] mb-4">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4" />
              <span>{stats?.confirmedCount || 0}/{event.maxAttendees} attending</span>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6">
          <div className="text-center p-4 bg-[#24292D] rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{getTimeUntilEvent()}</div>
            {event.theme && (
              <div className="text-sm text-gray-600 mt-1">Theme: {event.theme}</div>
            )}
            {event.dressCode && (
              <div className="text-sm text-gray-600">Dress: {event.dressCode}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
