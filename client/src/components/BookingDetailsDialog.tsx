import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";

interface BookingDetailsDialogProps {
  booking: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  // Helper to resolve a date string from vendor booking entry
  const resolveDateString = (b: any) =>
    b?.Date_start || b?.dateFrom || b?.date_start || b?.startDate || null;

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-gray-900 max-w-2xl border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900">
            {booking.event_details?.name_title || "Booking Details"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">Date</label>
              <div className="flex items-center gap-2 mt-1">
                <CalendarIcon className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">
                  {(() => {
                    const d = resolveDateString(booking);
                    return d ? format(parseISO(d), "MMMM dd, yyyy") : "—";
                  })()}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">Time</label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">
                  {booking.Start_time} - {booking.End_time}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Booking ID
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.vendor_event_book_id ?? booking._id}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Transaction ID
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.transaction_id ?? "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Amount
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.amount ? `$${booking.amount.toFixed(2)}` : "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Vendor Amount
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.vendor_amount
                  ? `$${booking.vendor_amount.toFixed(2)}`
                  : "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Amount Status
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.amount_status ?? "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Vendor Amount Status
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.vendor_amount_status ?? "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Vendor
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.vendor_details?.name ??
                  booking.vendor_details?.email ??
                  "—"}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Customer
              </label>
              <div className="mt-1 font-medium text-gray-900">
                {booking.user_details?.name ??
                  booking.user_details?.email ??
                  "—"}
              </div>
            </div>
          </div>

          {booking.event_details?.street_address && (
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Location
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">
                  {booking.event_details.street_address}
                  {booking.event_details.city &&
                    `, ${booking.event_details.city}`}
                  {booking.event_details.state &&
                    `, ${booking.event_details.state}`}
                  {booking.event_details.zip_code &&
                    ` ${booking.event_details.zip_code}`}
                </span>
              </div>
            </div>
          )}

          {booking.event_details?.max_capacity && (
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Guests
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-gray-900">
                  {booking.event_details.max_capacity} guests
                </span>
              </div>
            </div>
          )}

          {booking.special_instruction && (
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Special Instructions
              </label>
              <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg text-gray-700 border border-gray-200">
                {booking.special_instruction}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Payment Status
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    booking.vendor_amount_status === "Completed"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    booking.vendor_amount_status === "Completed"
                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-100"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                  }
                >
                  {booking.vendor_amount_status || "Pending"}
                </Badge>
              </div>
            </div>
            {booking.vendor_amount && (
              <div className="text-right">
                <label className="text-sm text-gray-600 font-medium">
                  Total Amount
                </label>
                <div className="text-3xl font-bold text-gray-900 mt-1">
                  ${booking.vendor_amount.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
