import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { Badge } from "@/components/ui/badge";
import { EventData } from "@/queries/events";
import { Guest } from "@/queries/guests";

// Convert a time string (24-hour) like "19:30" or "19:30:00" to 12-hour format with AM/PM.
// If the string already contains AM/PM, return it unchanged. If falsy, return "TBD".
function formatTime12(time?: string | null) {
  if (!time) return "TBD";
  // If it already contains am/pm, return as-is (case-insensitive)
  if (/\b(am|pm)\b/i.test(time)) return time;

  const m = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return time; // unknown format, return raw

  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const suffix = hh >= 12 ? "PM" : "AM";
  hh = hh % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${mm} ${suffix}`;
}

interface Props {
  event: EventData;
  guests?: Guest[];
  getTimeUntilEvent: () => string | null;
}

export default function Header({ event, guests, getTimeUntilEvent }: Props) {
  return (
    <div className="bg-[#0A0A0A] rounded-xl shadow-lg p-6 mb-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <p>Plan My Event</p>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">
              {event.name_title}
            </h1>
            {event.event_type_id && (
              <Badge variant="secondary" className="capitalize">
                {event.event_type_id}
              </Badge>
            )}
          </div>
          <p className="text-[#FFFFFF] mb-4">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span>{formatTime12(event.time)}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4" />
              <span>{event.street_address}</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Users className="w-4 h-4" />
              <span>
                {guests?.length || 0}/{event.max_capacity} attending
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:ml-6">
          <div className="text-center p-4 bg-[#24292D] rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {getTimeUntilEvent()}
            </div>
            {/* {event.theme && (
              <div className="text-sm text-gray-600 mt-1">
                Theme: {event.theme}
              </div>
            )}
            {event.dressCode && (
              <div className="text-sm text-gray-600">
                Dress: {event.dressCode}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
