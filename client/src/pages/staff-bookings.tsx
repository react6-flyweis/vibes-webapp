import { useState } from "react";
import { useMyStaffBookingsQuery } from "@/queries/staffBookings";
import { useAvailabilityCalendarByAuthQuery } from "@/queries/availabilityCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  List,
} from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Link } from "react-router";
import { useMyStaffBookings } from "@/hooks/useStaffBookings";

export default function StaffBookings() {
  const { data: bookings, isLoading } = useMyStaffBookings();
  const { data: availabilityCalendar, isLoading: isLoadingAvailability } =
    useAvailabilityCalendarByAuthQuery();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  if (isLoading || isLoadingAvailability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded-md w-64 mb-8" />
            <div className="h-96 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Helper to resolve a date string from booking entries (support legacy and new fields)
  const resolveDateString = (b: any) =>
    b?.dateFrom || b?.Date_start || b?.date_start || b?.startDate || null;

  // Group bookings by date
  const bookingsByDate = (bookings || []).reduce((acc, booking) => {
    try {
      const ds = resolveDateString(booking);
      if (!ds) {
        console.warn("Staff booking has no recognizable date field:", booking);
        return acc;
      }
      const date = format(parseISO(ds), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(booking);
    } catch (e) {
      console.error(
        "Invalid booking date:",
        resolveDateString(booking),
        booking
      );
    }
    return acc;
  }, {} as Record<string, any[]>);

  // Group availability calendar entries by date
  const availabilityByDate = (availabilityCalendar || []).reduce(
    (acc, entry) => {
      try {
        // Get all dates in the range from Date_start to End_date
        const startDate = parseISO(entry.Date_start);
        const endDate = parseISO(entry.End_date);
        const dates = eachDayOfInterval({ start: startDate, end: endDate });

        dates.forEach((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          if (!acc[dateStr]) {
            acc[dateStr] = [];
          }
          acc[dateStr].push(entry);
        });
      } catch (e) {
        console.error("Invalid date:", entry.Date_start, entry.End_date);
      }
      return acc;
    },
    {} as Record<string, any[]>
  );

  // Get bookings for selected date
  const selectedDateBookings = selectedDate
    ? bookingsByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  // Get availability entries for selected date
  const selectedDateAvailability = selectedDate
    ? availabilityByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const hasBooking = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return bookingsByDate[dateStr]?.length > 0;
  };

  const getBookingCount = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return bookingsByDate[dateStr]?.length || 0;
  };

  const hasAvailability = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availabilityByDate[dateStr]?.length > 0;
  };

  const getAvailabilityCount = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availabilityByDate[dateStr]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
            <p className="text-purple-200">
              View and manage your event bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/staff-dashboard">
              <Button
                variant="outline"
                className="bg-white/20 text-white hover:bg-white/10"
              >
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/10"
              onClick={() =>
                setViewMode(viewMode === "calendar" ? "list" : "calendar")
              }
            >
              {viewMode === "calendar" ? (
                <List className="h-4 w-4 mr-2" />
              ) : (
                <CalendarIcon className="h-4 w-4 mr-2" />
              )}
              {viewMode === "calendar" ? "List View" : "Calendar View"}
            </Button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-2xl">
                      {format(currentDate, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 text-white hover:bg-white/10"
                        onClick={() =>
                          setCurrentDate(subMonths(currentDate, 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 text-white hover:bg-white/10"
                        onClick={() => setCurrentDate(new Date())}
                      >
                        Today
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 text-white hover:bg-white/10"
                        onClick={() =>
                          setCurrentDate(addMonths(currentDate, 1))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-semibold text-purple-200 py-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                      const isCurrentMonth = isSameMonth(day, currentDate);
                      const isToday = isSameDay(day, new Date());
                      const isSelected = selectedDate
                        ? isSameDay(day, selectedDate)
                        : false;
                      const hasBookings = hasBooking(day);
                      const bookingCount = getBookingCount(day);
                      const hasAvailabilityEntries = hasAvailability(day);
                      const availabilityCount = getAvailabilityCount(day);

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedDate(day);
                          }}
                          className={`
                            relative aspect-square p-2 rounded-lg text-sm font-medium
                            transition-all duration-200
                            ${!isCurrentMonth ? "text-white/30" : "text-white"}
                            ${
                              isToday
                                ? "bg-blue-500/20 border border-blue-500/50"
                                : ""
                            }
                            ${
                              isSelected
                                ? "bg-purple-500/30 border border-purple-500"
                                : ""
                            }
                            ${
                              !isSelected && !isToday ? "hover:bg-white/10" : ""
                            }
                            ${
                              hasBookings && !isSelected && !isToday
                                ? "bg-green-500/10"
                                : ""
                            }
                            ${
                              hasAvailabilityEntries &&
                              !hasBookings &&
                              !isSelected &&
                              !isToday
                                ? "bg-orange-500/10"
                                : ""
                            }
                          `}
                        >
                          <span className="relative z-10">
                            {format(day, "d")}
                          </span>
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex flex-col gap-0.5 items-center">
                            {hasBookings && (
                              <div className="flex gap-0.5">
                                {Array.from({
                                  length: Math.min(bookingCount, 3),
                                }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                                  />
                                ))}
                              </div>
                            )}
                            {hasAvailabilityEntries && (
                              <div className="flex gap-0.5">
                                {Array.from({
                                  length: Math.min(availabilityCount, 3),
                                }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1.5 h-1.5 rounded-full bg-orange-400"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Selected Date Details */}
            <div className="lg:col-span-1">
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
                    selectedDateBookings.length > 0 ||
                    selectedDateAvailability.length > 0 ? (
                      <div className="space-y-4">
                        {/* Bookings Section */}
                        {selectedDateBookings.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                              Bookings ({selectedDateBookings.length})
                            </h4>
                            {selectedDateBookings.map((booking) => (
                              <div
                                key={booking._id}
                                className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-colors cursor-pointer"
                                onClick={() => setSelectedBooking(booking)}
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
                                  {booking.staff_price && (
                                    <div className="flex items-center gap-2">
                                      <DollarSign className="h-3 w-3" />
                                      <span>
                                        $
                                        {(booking.staff_price / 100).toFixed(2)}
                                      </span>
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
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Availability Calendar Section */}
                        {selectedDateAvailability.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wide">
                              Availability ({selectedDateAvailability.length})
                            </h4>
                            {selectedDateAvailability.map((availability) => (
                              <div
                                key={availability._id}
                                className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-colors"
                              >
                                <h4 className="font-semibold text-white mb-2">
                                  {availability.event_details?.name_title ||
                                    "Event"}
                                </h4>
                                <div className="space-y-1 text-sm text-white/70">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {availability.Start_time} -{" "}
                                      {availability.End_time}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-3 w-3" />
                                    <span>
                                      {format(
                                        parseISO(availability.Date_start),
                                        "MMM dd"
                                      )}{" "}
                                      -{" "}
                                      {format(
                                        parseISO(availability.End_date),
                                        "MMM dd"
                                      )}
                                    </span>
                                  </div>
                                  {availability.event_details?.venue_name && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate">
                                        {availability.event_details.venue_name}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <Badge className="mt-2 bg-orange-500/20 text-orange-200 border-orange-500/30">
                                  {availability.User_availabil}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-white/60 py-8">
                        No bookings or availability on this date
                      </div>
                    )
                  ) : (
                    <div className="text-center text-white/60 py-8">
                      Select a date to view bookings
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card className="bg-white/5 border-white/10 mt-4">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50" />
                    <span className="text-white/70">Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-white/70">Has booking(s)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500/10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    </div>
                    <span className="text-white/70">Has availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500" />
                    <span className="text-white/70">Selected</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // List View
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-white">
                              {booking.event_name || "Event Booking"}
                            </h3>
                            <Badge
                              variant={
                                booking.transaction_status === "Completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                booking.transaction_status === "Completed"
                                  ? "bg-green-500/20 text-green-200 border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
                              }
                            >
                              {booking.transaction_status || "Pending"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {(() => {
                                  const ds = resolveDateString(booking);
                                  return ds
                                    ? format(parseISO(ds), "MMM dd, yyyy")
                                    : "—";
                                })()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                {booking.timeFrom} - {booking.timeTo}
                              </span>
                            </div>
                            {booking.event_address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">
                                  {booking.event_address}
                                </span>
                              </div>
                            )}
                            {booking.no_of_guests && (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{booking.no_of_guests} guests</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* <div className="flex flex-col items-end gap-2">
                          {booking.staff_price && (
                            <div className="text-2xl font-bold text-white">
                              ${(booking.staff_price / 100).toFixed(2)}
                            </div>
                          )}
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  No bookings found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Detail Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      >
        <DialogContent className="bg-gray-900/95 backdrop-blur-sm text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedBooking?.event_name || "Booking Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60">Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-purple-400" />
                    <span className="font-medium">
                      {(() => {
                        const ds = resolveDateString(selectedBooking);
                        return ds ? format(parseISO(ds), "MMMM dd, yyyy") : "—";
                      })()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/60">Time</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span className="font-medium">
                      {selectedBooking.timeFrom} - {selectedBooking.timeTo}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBooking.event_address && (
                <div>
                  <label className="text-sm text-white/60">Location</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span className="font-medium">
                      {selectedBooking.event_address}
                    </span>
                  </div>
                </div>
              )}

              {selectedBooking.no_of_guests && (
                <div>
                  <label className="text-sm text-white/60">Guests</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="font-medium">
                      {selectedBooking.no_of_guests} guests
                    </span>
                  </div>
                </div>
              )}

              {selectedBooking.special_instruction && (
                <div>
                  <label className="text-sm text-white/60">
                    Special Instructions
                  </label>
                  <p className="mt-1 text-sm bg-white/5 p-3 rounded-lg">
                    {selectedBooking.special_instruction}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <label className="text-sm text-white/60">
                    Payment Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedBooking.transaction_status === "Completed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        selectedBooking.transaction_status === "Completed"
                          ? "bg-green-500/20 text-green-200 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
                      }
                    >
                      {selectedBooking.transaction_status || "Pending"}
                    </Badge>
                  </div>
                </div>
                {selectedBooking.staff_price && (
                  <div className="text-right">
                    <label className="text-sm text-white/60">
                      Total Amount
                    </label>
                    <div className="text-3xl font-bold text-white mt-1">
                      ${(selectedBooking.staff_price / 100).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
