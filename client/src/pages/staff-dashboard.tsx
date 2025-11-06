import { useState } from "react";
import { useMyStaffBookingsQuery } from "@/queries/staffBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Briefcase,
  CalendarCheck,
} from "lucide-react";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { Link } from "react-router";

export default function StaffDashboard() {
  const { data: bookings, isLoading } = useMyStaffBookingsQuery();
  const [selectedTab, setSelectedTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded-md w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/10 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const now = startOfDay(new Date());

  const upcomingBookings =
    bookings?.filter((booking) => {
      try {
        const bookingDate = startOfDay(parseISO(booking.dateFrom));
        return (
          isAfter(bookingDate, now) || bookingDate.getTime() === now.getTime()
        );
      } catch {
        return false;
      }
    }) || [];

  const pastBookings =
    bookings?.filter((booking) => {
      try {
        const bookingDate = startOfDay(parseISO(booking.dateFrom));
        return isBefore(bookingDate, now);
      } catch {
        return false;
      }
    }) || [];

  const totalEarnings =
    bookings?.reduce((sum, booking) => sum + (booking.staff_price || 0), 0) ||
    0;

  const totalJobs = bookings?.length || 0;
  const completedJobs = pastBookings.length;
  const activeJobs = upcomingBookings.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Staff Dashboard
          </h1>
          <p className="text-purple-200">
            Manage your bookings and track your earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-200 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Total Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalJobs}</div>
              <p className="text-xs text-blue-200/70 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-200 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {completedJobs}
              </div>
              <p className="text-xs text-green-200/70 mt-1">Past bookings</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-200 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeJobs}</div>
              <p className="text-xs text-orange-200/70 mt-1">Upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-200 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                ${(totalEarnings / 100).toFixed(2)}
              </div>
              <p className="text-xs text-purple-200/70 mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-white/10 border-white/20 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({activeJobs})</TabsTrigger>
            <TabsTrigger value="past">Past ({completedJobs})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/staff-bookings">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Calendar
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/10"
                    >
                      Update Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingsList bookings={upcomingBookings.slice(0, 5)} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsList bookings={upcomingBookings} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Past Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingsList bookings={pastBookings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingsList({ bookings }: { bookings: any[] }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-white/60">No bookings found</div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
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
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(parseISO(booking.dateFrom), "MMM dd, yyyy")}
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
                    <span className="truncate">{booking.event_address}</span>
                  </div>
                )}
                {booking.no_of_guests && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{booking.no_of_guests} guests</span>
                  </div>
                )}
              </div>

              {booking.special_instruction && (
                <p className="text-sm text-white/60 italic">
                  {booking.special_instruction}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              {booking.staff_price && (
                <div className="text-2xl font-bold text-white">
                  ${(booking.staff_price / 100).toFixed(2)}
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
