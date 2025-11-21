import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users } from "lucide-react";

type Booking = any;

export default function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  booking?: Booking | null;
}) {
  if (!booking) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>No booking selected.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange && onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      // small, dependency-free formatting for the dialog
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle className="text-lg font-semibold">
              {booking.event_name ?? "Booking"}
            </DialogTitle>
            {booking.event_type_id && (
              <div className="text-xs text-muted-foreground mt-1">
                Event type: {booking.event_type_id}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground text-right">
            <div className="font-medium">
              {booking.transaction_status ?? "Status: -"}
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-3 text-sm text-gray-700">
          {booking.event_address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>{booking.event_address}</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Date</div>
                <div className="font-medium">
                  {formatDate(booking.dateFrom)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Time</div>
                <div className="font-medium">
                  {booking.timeFrom ?? "-"} - {booking.timeTo ?? "-"}
                </div>
              </div>
            </div>

            {booking.no_of_guests && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Guests</div>
                  <div className="font-medium">{booking.no_of_guests}</div>
                </div>
              </div>
            )}
          </div>

          {booking.special_instruction && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded-md">
              <strong>Special Instructions:</strong>
              <div className="mt-1">{booking.special_instruction}</div>
            </div>
          )}

          {booking.amount !== undefined && (
            <div className="pt-1 text-sm">
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="font-medium">
                {typeof booking.amount === "number"
                  ? `$${booking.amount.toFixed(2)}`
                  : booking.amount}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange && onOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
