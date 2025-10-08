import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { GuestManagementPanel } from "@/components/guest-management-panel";

export default function GuestsTab({ eventId }: { eventId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Guest Management</CardTitle>
            <CardDescription>Manage invitations and RSVPs</CardDescription>
          </div>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Guests
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{0}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <div className="text-sm text-gray-600">Maybe</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600">Declined</div>
          </div>
        </div> */}
        <GuestManagementPanel eventId={eventId} />
      </CardContent>
    </Card>
  );
}
