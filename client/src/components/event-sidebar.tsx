import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Share,
  UserPlus,
  Sparkles,
  Send,
} from "lucide-react";
import GuestInviteModal from "@/components/guest-invite-modal";
import BulkInviteModal from "@/components/bulk-invite-modal";
import { useNavigate } from "react-router";
import { EventData } from "@/queries/events";
import { formatDate } from "@/lib/formatDate";

interface EventSidebarProps {
  event: EventData;
  eventId: number;
  stats?: {
    confirmedCount: number;
    totalItems: number;
    itemsByCategory: Record<string, { completed: number; total: number }>;
  };
}

export default function EventSidebar({
  event,
  eventId,
  stats,
}: EventSidebarProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setIsBulkInviteModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: participants } = useQuery({
    queryKey: [`/api/events/${eventId}/participants`],
  });

  const recentContributors = participants
    .filter((p: any) => p.user)
    .slice(0, 3);

  const categoryColors = {
    drinks: "bg-party-coral",
    food: "bg-party-turquoise",
    entertainment: "bg-party-blue",
    decorations: "bg-party-mint",
  };

  return (
    <div className="space-y-6">
      {/* Event Details Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <h3 className="font-semibold party-dark mb-4">Event Details</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Calendar className="party-coral h-5 w-5" />
            <div>
              <p className="text-sm font-medium">{formatDate(event.date)}</p>
              <p className="text-xs party-gray">{event.time}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="party-coral h-5 w-5" />
            <div>
              <p className="text-xs party-gray">{event.street_address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="party-coral h-5 w-5" />
            <div>
              <p className="text-sm font-medium">
                {stats?.confirmedCount || 0} of {event.max_capacity} people
              </p>
              <p className="text-xs party-gray">RSVP'd</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Button
            className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
            onClick={() => navigate("/interactive-live-vibes-invite")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Create Interactive Invites
          </Button>
          <Button
            className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            onClick={() => setIsBulkInviteModalOpen(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Bulk Invites
          </Button>
          <Button variant="outline" className="w-full">
            <Share className="mr-2 h-4 w-4" />
            Share Event Link
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <h3 className="font-semibold party-dark mb-4">Planning Progress</h3>
        <div className="space-y-4">
          {stats?.itemsByCategory &&
            Object.entries(stats.itemsByCategory).map(([category, data]) => {
              const percentage =
                data.total > 0
                  ? Math.round((data.completed / data.total) * 100)
                  : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{category}</span>
                    <span
                      className={categoryColors[
                        category as keyof typeof categoryColors
                      ].replace("bg-", "text-")}
                    >
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
        </div>
      </div>

      {/* Participants Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
        <h3 className="font-semibold party-dark mb-4">Recent Contributors</h3>
        <div className="space-y-3">
          {recentContributors.map((participant: any) => (
            <div key={participant.id} className="flex items-center space-x-3">
              <img
                className="w-8 h-8 rounded-full"
                src={
                  participant.user?.avatar ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
                }
                alt={`${participant.user?.name} avatar`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{participant.user?.name}</p>
                <p className="text-xs party-gray">Recently contributed</p>
              </div>
              <Badge
                variant={
                  participant.status === "confirmed" ? "default" : "secondary"
                }
                className={
                  participant.status === "confirmed"
                    ? "bg-party-mint text-white"
                    : ""
                }
              >
                {participant.status === "confirmed"
                  ? "Active"
                  : participant.status}
              </Badge>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 border-party-coral party-coral hover:bg-party-coral hover:text-white"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite More Friends
        </Button>
      </div>

      {/* Vendor Spotlight Card */}
      <div
        className="bg-linear-to-br from-party-blue to-party-turquoise rounded-xl p-6 text-white"
        style={{
          background:
            "linear-gradient(90deg, #9333EA 0%, #DB2777 50%, #F97316 100%)",
        }}
      >
        <h3 className="font-semibold mb-2">Need Professional Help?</h3>
        <p className="text-sm opacity-90 mb-4">
          Discover local DJs, caterers, and party supplies
        </p>
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=96"
          alt="Professional party setup"
          className="w-full h-24 object-cover rounded-lg mb-4"
        />
        <Button className="w-full bg-white text-party-blue hover:bg-gray-100 text-black">
          Browse Vendors
        </Button>
      </div>

      <GuestInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        eventId={eventId}
      />

      <BulkInviteModal
        isOpen={isBulkInviteModalOpen}
        onClose={() => setIsBulkInviteModalOpen(false)}
        eventId={eventId}
        event={event}
      />
    </div>
  );
}
