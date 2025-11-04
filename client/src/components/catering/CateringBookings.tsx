import React from "react";
import useCateringBookings from "@/hooks/useCateringBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CateringBookings() {
  const { data: bookings, isLoading, error } = useCateringBookings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Catering Bookings</CardTitle>
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
            No catering bookings found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bookings?.map((b) => (
              <div
                key={b._id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold">
                    Event #{b.event_id ?? "-"}
                  </h3>
                  <Badge variant="outline">
                    {b.transaction_status || "Unknown"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-2">
                  Guests: {b.guest_count ?? "-"} • Amount:{" "}
                  {typeof b.total_amount === "number" ? b.total_amount : "-"}
                </p>

                <div className="mt-3 text-xs text-muted-foreground">
                  <div>
                    <strong>From:</strong>{" "}
                    {b.event_from_date
                      ? new Date(b.event_from_date).toLocaleDateString()
                      : "-"}
                  </div>
                  <div>
                    <strong>To:</strong>{" "}
                    {b.event_to_date
                      ? new Date(b.event_to_date).toLocaleDateString()
                      : "-"}
                  </div>
                  <div>
                    <strong>Time:</strong> {b.event_from_time || "-"} -{" "}
                    {b.event_to_time || "-"}
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

export default CateringBookings;
