import React from "react";
import useStaffBookings from "@/hooks/useStaffBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StaffBookings() {
  const { data: bookings, isLoading, error } = useStaffBookings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Staff Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading bookings...
          </div>
        ) : error ? (
          <div className="text-sm text-destructive">
            Failed to load bookings
          </div>
        ) : bookings?.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No staff bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookings?.map((b) => (
              <div
                key={b._id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold">{b.event_name}</h3>
                  <Badge variant="outline">
                    {b.transaction_status || "Unknown"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  {b.event_address}
                </p>

                <div className="mt-3 text-xs text-muted-foreground">
                  <div>
                    <strong>Date:</strong>{" "}
                    {b.dateFrom
                      ? new Date(b.dateFrom).toLocaleDateString()
                      : "-"}
                  </div>
                  <div>
                    <strong>Time:</strong> {b.timeFrom || "-"} -{" "}
                    {b.timeTo || "-"}
                  </div>
                  <div>
                    <strong>Guests:</strong> {b.no_of_guests ?? "-"}
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button className="text-xs text-primary underline">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StaffBookings;
