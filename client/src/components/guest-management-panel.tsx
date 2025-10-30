import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGuestsByEvent, Guest } from "@/queries/guests";
import GuestInviteModal from "@/components/guest-invite-modal";
import { PlanEventMapData } from "@/queries/planEventMaps";

interface GuestManagementPanelProps {
  eventId: string;
  planMap?: PlanEventMapData;
}

export function GuestManagementPanel({
  eventId,
  planMap,
}: GuestManagementPanelProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: guests = [], isLoading: participantsLoading } =
    useGuestsByEvent(eventId);

  const invitations: any[] = [];
  const invitationsLoading = false;

  // const updateRSVP = useMutation({
  //   mutationFn: async ({
  //     participantId,
  //     status,
  //   }: {
  //     participantId: number;
  //     status: string;
  //   }) => {
  //     return await apiRequest(
  //       `/api/events/${eventId}/participants/${participantId}/rsvp`,
  //       "PATCH",
  //       { status }
  //     );
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: [`/api/events/${eventId}/participants`],
  //     });
  //     toast({
  //       title: "RSVP Updated",
  //       description: "Guest status has been updated successfully.",
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Update Failed",
  //       description: "Failed to update RSVP status.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const sendReminder = useMutation({
  //   mutationFn: async (email: string) => {
  //     return await apiRequest(`/api/events/${eventId}/reminder`, "POST", {
  //       email,
  //     });
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Reminder Sent",
  //       description: "RSVP reminder has been sent successfully.",
  //     });
  //   },
  //   onError: () => {
  //     toast({
  //       title: "Reminder Failed",
  //       description: "Failed to send reminder.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  const filteredParticipants: Guest[] = Array.isArray(guests)
    ? guests.filter((p: any) => {
        const name = (p.name || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        const matchesSearch =
          name.includes(searchTerm.toLowerCase()) ||
          email.includes(searchTerm.toLowerCase());
        // guest.status in API is boolean; map filter values accordingly
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "confirmed" && p.status === true) ||
          (statusFilter === "declined" && p.status === false) ||
          (statusFilter === "pending" && p.status === null);
        return matchesSearch && matchesStatus;
      })
    : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <UserCheck className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "declined":
        return <UserX className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const rsvpStats = {
    confirmed: Array.isArray(guests)
      ? guests.filter((p: any) => p.status === true).length
      : 0,
    pending: Array.isArray(guests)
      ? guests.filter((p: any) => p.status === null).length
      : 0,
    declined: Array.isArray(guests)
      ? guests.filter((p: any) => p.status === false).length
      : 0,
    total: Array.isArray(guests) ? guests.length : 0,
  };

  if (participantsLoading || invitationsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading guest information...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* RSVP Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {rsvpStats.confirmed}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {rsvpStats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">
                  {rsvpStats.declined}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-blue-600">
                  {rsvpStats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Guest Management</CardTitle>
            <Button onClick={() => setIsInviteModalOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Guests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="guests">Guest List</TabsTrigger>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
            </TabsList>

            <TabsContent value="guests" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search guests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Guest List */}
              <div className="space-y-2">
                {filteredParticipants.map((participant: any) => (
                  <div
                    key={participant._id || participant.guest_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          participant.img ||
                          participant.image ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
                        }
                        alt={participant.name || "Guest"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">
                          {participant.name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {participant.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge
                        className={getStatusColor(String(participant.status))}
                      >
                        {getStatusIcon(String(participant.status))}
                        <span className="ml-1 capitalize">
                          {participant.status === true
                            ? "confirmed"
                            : participant.status === false
                            ? "declined"
                            : "pending"}
                        </span>
                      </Badge>
                    </div>
                  </div>
                ))}

                {filteredParticipants.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No guests found matching your criteria.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="invitations" className="space-y-4">
              <div className="space-y-2">
                {Array.isArray(invitations) &&
                  invitations.map((invitation: any) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <p className="text-sm text-gray-500">
                            Sent{" "}
                            {new Date(invitation.sentAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Badge className={getStatusColor(invitation.status)}>
                        {getStatusIcon(invitation.status)}
                        <span className="ml-1 capitalize">
                          {invitation.status}
                        </span>
                      </Badge>
                    </div>
                  ))}

                {(!Array.isArray(invitations) || invitations.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No pending invitations.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <GuestInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        eventId={eventId}
      />
    </div>
  );
}
