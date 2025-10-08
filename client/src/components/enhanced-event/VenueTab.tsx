import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Settings, Calendar, Building } from "lucide-react";
import { useVenueDetailsQuery } from "@/queries/venueDetails";
import { VenueAmenities } from "./VenueAmenities";
import { PlanEventMapData } from "@/queries/planEventMaps";
import { SetupRequirements } from "./SetupRequirements";

export default function VenueTab({
  eventId,
  planMap,
}: {
  eventId: string;
  planMap: PlanEventMapData;
}) {
  const { data: venue, isLoading, isError } = useVenueDetailsQuery(eventId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Venue Management</CardTitle>
            <CardDescription>
              Manage venue details, layout, and requirements
            </CardDescription>
          </div>
          <Button asChild>
            <a href={venue?.map || "#"} target="_blank" rel="noreferrer">
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="p-4">Loading venue details...</div>
        ) : isError ? (
          <div className="p-4 text-red-600">Failed to load venue details</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Venue Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{venue?.name || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">
                        {venue?.address || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">
                        {venue?.capacity ? `${venue.capacity} people` : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{venue?.type || "—"}</span>
                    </div>
                  </div>
                </div>

                <VenueAmenities
                  amenitiesEnabled={planMap.venue_management.amenities_id}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Venue Layout</h3>
                  <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-lg p-4 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Building className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-600">
                        Interactive venue map
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to view 3D layout
                      </p>
                    </div>
                  </div>
                </div>

                <SetupRequirements />
              </div>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs">Directions</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-xs">Contact Venue</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-xs">Setup Details</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Book Again</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
