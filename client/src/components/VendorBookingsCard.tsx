import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";

type Booking = any;

interface Props {
  selectedDate?: Date | null;
  bookings: Booking[];
  onSelectBooking: (b: Booking) => void;
  onReschedule: (b: Booking) => void;
  onCancel: (b: Booking) => void;
  isBookingCompleted: (b: Booking) => boolean;
}

export default function VendorBookingsCard({
  selectedDate,
  bookings,
  onSelectBooking,
  onReschedule,
  onCancel,
  isBookingCompleted,
}: Props) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">
          {selectedDate
            ? format(selectedDate, "MMMM dd, yyyy")
            : "Select a date"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedDate ? (
          bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking: Booking) => (
                <div
                  key={booking._id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => onSelectBooking(booking)}
                >
                  <h4 className="font-semibold text-white mb-2">
                    {booking.event_name || "Event"}
                  </h4>
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {booking.timeFrom} - {booking.timeTo}
                      </span>
                    </div>
                    {booking.vendor_price && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span>${(booking.vendor_price / 100).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <Badge
                    className="mt-2"
                    variant={
                      booking.transaction_status === "Completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {booking.transaction_status || "Pending"}
                  </Badge>

                  {isBookingCompleted(booking) && (
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/10 text-white hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBooking(booking);
                          onReschedule(booking);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/80 hover:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(booking);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              No bookings on this date
            </div>
          )
        ) : (
          <div className="text-center text-white/60 py-8">
            Select a date to view bookings
          </div>
        )}
      </CardContent>
    </Card>
  );
}
