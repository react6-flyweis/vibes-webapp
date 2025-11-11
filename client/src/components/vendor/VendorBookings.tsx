import React, { useState } from "react";
import {
  useVendorBookingsByAuth,
  useCancelVendorBooking,
} from "@/queries/vendorBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function VendorBookings() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [cancelBookingId, setCancelBookingId] = useState<number | null>(null);

  const { data, isLoading, error } = useVendorBookingsByAuth(page, limit);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const cancelMutation = useCancelVendorBooking({
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/bookings/getByAuth"],
      });
      setCancelBookingId(null);
    },
    onError: (err: any) => {
      toast({
        title: "Cancellation Failed",
        description:
          err?.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
      setCancelBookingId(null);
    },
  });

  const bookings = data?.data || [];
  const pagination = data?.pagination;

  const handleCancelClick = (bookingId: number) => {
    setCancelBookingId(bookingId);
  };

  const handleConfirmCancel = () => {
    if (cancelBookingId) {
      cancelMutation.mutate(cancelBookingId);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Vendor Bookings</CardTitle>
          {pagination && pagination.totalItems > 0 && (
            <div className="text-sm text-muted-foreground">
              Total: {pagination.totalItems}
            </div>
          )}
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
          ) : bookings.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No vendor bookings found.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left side - booking info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-semibold">
                              {booking.event_details?.name_title || "Booking"}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {booking.vendor_category_details.map((cat) => (
                                <Badge
                                  key={cat._id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {cat.emozi} {cat.category_name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusColor(
                              booking.vender_booking_status
                            )}
                          >
                            {booking.vender_booking_status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(booking.Date_start)}
                              {booking.Date_start !== booking.End_date && (
                                <> - {formatDate(booking.End_date)}</>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.Start_time} - {booking.End_time}
                            </span>
                          </div>
                          {booking.event_details?.venue_name && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">
                                {booking.event_details.venue_name}
                              </span>
                            </div>
                          )}
                          {booking.event_details?.max_capacity && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {booking.event_details.max_capacity} capacity
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <div>
                            <strong>Booked by:</strong>{" "}
                            {booking.created_by_details.name} (
                            {booking.created_by_details.email})
                          </div>
                          <div>
                            <strong>Created:</strong>{" "}
                            {formatDate(booking.CreateAt)}
                          </div>
                        </div>
                      </div>

                      {/* Right side - actions */}
                      <div className="flex flex-row md:flex-col gap-2">
                        {booking.vender_booking_status.toLowerCase() ===
                          "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                handleCancelClick(booking.Vendor_Booking_id)
                              }
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            {/* Reschedule button - hidden for now */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="hidden"
                            >
                              Reschedule
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrevPage || isLoading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!pagination.hasNextPage || isLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={cancelBookingId !== null}
        onOpenChange={(open) => !open && setCancelBookingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={cancelMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {cancelMutation.isPending
                ? "Cancelling..."
                : "Yes, cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default VendorBookings;
