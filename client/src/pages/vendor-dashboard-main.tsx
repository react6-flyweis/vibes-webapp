import { useState } from "react";
import { Link } from "react-router";
import { usePayouts } from "@/hooks/usePayouts";
import { useMyVendorBookingsQuery } from "@/queries/vendorBookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Package,
  ArrowRight,
  Wallet,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function VendorDashboardMain() {
  const [payoutPage] = useState(1);
  const [payoutLimit] = useState(5);

  const {
    data: payoutsData,
    isLoading: payoutsLoading,
    error: payoutsError,
  } = usePayouts(payoutPage, payoutLimit);

  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useMyVendorBookingsQuery();

  // Helper to resolve a date string from vendor booking entry
  const resolveDateString = (b: any) =>
    b?.Date_start || b?.dateFrom || b?.date_start || b?.startDate || null;

  // Calculate statistics
  const totalPayouts =
    payoutsData?.data?.reduce((sum, payout) => sum + (payout.amount || 0), 0) ||
    0;
  const pendingPayouts =
    payoutsData?.data?.filter((p) => !p.Status).length || 0;
  const completedPayouts =
    payoutsData?.data?.filter((p) => p.Status).length || 0;

  const upcomingBookings =
    bookings?.filter((booking) => {
      try {
        const ds = resolveDateString(booking);
        if (!ds) return false;
        const bookingDate = parseISO(ds);
        return bookingDate >= new Date();
      } catch {
        return false;
      }
    }) || [];

  const totalBookings = bookings?.length || 0;
  const totalBookingRevenue =
    bookings?.reduce((sum, booking) => sum + (booking.vendor_amount || 0), 0) ||
    0;

  const isLoading = payoutsLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/10 rounded-md w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-white/10 rounded-lg" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-white/10 rounded-lg" />
              <div className="h-96 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Vendor Dashboard
            </h1>
            <p className="text-purple-200">
              Manage your bookings, payouts, and vendor services
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/vendor-bookings">
              <Button
                variant="outline"
                className="bg-white/20 text-white hover:bg-white/10"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                View Calendar
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="bg-white/5 backdrop-blur-sm border border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${(totalPayouts + totalBookingRevenue).toFixed(2)}
              </div>
              <p className="text-xs text-green-200 mt-1">
                From payouts and bookings
              </p>
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card className="bg-white/5 backdrop-blur-sm border border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Bookings
              </CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalBookings}
              </div>
              <p className="text-xs text-blue-200 mt-1">
                {upcomingBookings.length} upcoming
              </p>
            </CardContent>
          </Card>

          {/* Pending Payouts */}
          <Card className="bg-white/5 backdrop-blur-sm border border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Pending Payouts
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {pendingPayouts}
              </div>
              <p className="text-xs text-yellow-200 mt-1">
                Awaiting processing
              </p>
            </CardContent>
          </Card>

          {/* Completed Payouts */}
          <Card className="bg-white/5 backdrop-blur-sm border border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Completed Payouts
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {completedPayouts}
              </div>
              <p className="text-xs text-purple-200 mt-1">Successfully paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payouts */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-purple-400" />
                  <CardTitle className="text-white">Recent Payouts</CardTitle>
                </div>
                {/* <Button
                    size="sm"
                    variant="ghost"
                    className="text-purple-300 hover:text-white hover:bg-white/10"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button> */}
              </div>
            </CardHeader>
            <CardContent>
              {payoutsError ? (
                <div className="text-center py-8 text-red-300">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Failed to load payouts</p>
                </div>
              ) : payoutsData?.data && payoutsData.data.length > 0 ? (
                <div className="space-y-4">
                  {payoutsData.data.map((payout) => (
                    <div
                      key={payout._id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">
                              Payout #{payout.Vendor_Payout_id || payout._id}
                            </h4>
                            <Badge
                              variant={payout.Status ? "default" : "secondary"}
                              className={
                                payout.Status
                                  ? "bg-green-500/20 text-green-200 border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-200 border-yellow-500/30"
                              }
                            >
                              {payout.Status ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {payout.Status ? "Completed" : "Pending"}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-white/70">
                            {payout.paymentType && (
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                <span>{payout.paymentType}</span>
                              </div>
                            )}
                            {payout.CreateAt && (
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-3 w-3" />
                                <span>
                                  {format(
                                    parseISO(payout.CreateAt),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            ${payout.amount.toFixed(2)}
                          </div>
                          {payout.PendingAmount !== undefined &&
                            payout.PendingAmount > 0 && (
                              <div className="text-xs text-yellow-300 mt-1">
                                ${payout.PendingAmount.toFixed(2)} pending
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No payouts yet</p>
                  <p className="text-sm mt-1">
                    Your payouts will appear here once processed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-white">
                    Upcoming Bookings
                  </CardTitle>
                </div>
                <Link to="/vendor-bookings">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-300 hover:text-white hover:bg-white/10"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {bookingsError ? (
                <div className="text-center py-8 text-red-300">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Failed to load bookings</p>
                </div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {booking.event_details?.name_title || "Event"}
                          </h4>
                          <div className="space-y-1 text-sm text-white/70">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-3 w-3" />
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
                              <Clock className="h-3 w-3" />
                              <span>
                                {booking.Start_time} - {booking.End_time}
                              </span>
                            </div>
                            {booking.event_details?.street_address && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">
                                  {booking.event_details.street_address}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {booking.vendor_amount && (
                            <div className="text-lg font-bold text-white">
                              ${booking.vendor_amount.toFixed(2)}
                            </div>
                          )}
                          <Badge
                            className="mt-2"
                            variant={
                              booking.vendor_amount_status === "Completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.vendor_amount_status || "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming bookings</p>
                  <p className="text-sm mt-1">New bookings will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
