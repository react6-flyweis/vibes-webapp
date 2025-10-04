import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Settings, Calendar, Building } from "lucide-react";

export default function VenueTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Venue Management</CardTitle>
            <CardDescription>Manage venue details, layout, and requirements</CardDescription>
          </div>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            View on Map
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Venue Details</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">Downtown Rooftop Terrace</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium">123 Main St, City Center</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">75 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Outdoor Rooftop</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Sound System", "Lighting", "Bar Area", "Dance Floor", "Restrooms", "Parking", "WiFi", "Climate Control"].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Venue Layout</h3>
              <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center">
                  <Building className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-600">Interactive venue map</p>
                  <p className="text-xs text-gray-500">Click to view 3D layout</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Setup Requirements</h3>
              <div className="space-y-2">
                {[{ item: "Tables & Chairs", status: "Confirmed", color: "green" }, { item: "Sound Equipment", status: "Pending", color: "yellow" }, { item: "Decorations", status: "In Progress", color: "blue" }, { item: "Catering Setup", status: "Confirmed", color: "green" }].map((req) => (
                  <div key={req.item} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{req.item}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.color === 'green' ? 'bg-green-100 text-green-800' : req.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MapPin className="w-5 h-5" />
              <span className="text-xs">Directions</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Phone className="w-5 h-5" />
              <span className="text-xs">Contact Venue</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Setup Details</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Book Again</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
