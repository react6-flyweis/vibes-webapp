import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Ticket, 
  Calendar,
  Clock,
  MapPin,
  Download,
  Share2,
  QrCode,
  Check,
  X,
  RefreshCcw,
  Mail,
  Phone,
  Edit,
  Save,
  Users,
  Star,
  CreditCard
} from "lucide-react";

interface BookingTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  basePrice: number;
  platformFee: number;
  status: 'confirmed' | 'cancelled' | 'refunded';
  confirmationCode: string;
  bookingDate: string;
  ticketNumbers: string[];
  customerName: string;
  customerEmail: string;
  paymentStatus: string;
}

export default function TicketManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<BookingTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingContact, setEditingContact] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: ""
  });

  // Fetch user's bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["/api/bookings/history-with-fees"],
  }) as { data: BookingTicket[]; isLoading: boolean };

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      return await apiRequest("POST", `/api/bookings/${bookingId}/cancel`);
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled. Refund will be processed within 3-5 business days.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/history-with-fees"] });
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel booking. Please contact support.",
        variant: "destructive",
      });
    },
  });

  // Update contact info mutation
  const updateContactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/user/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Contact Updated",
        description: "Your contact information has been updated successfully.",
      });
      setEditingContact(false);
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to update contact information.",
        variant: "destructive",
      });
    },
  });

  const filteredBookings = (bookings as BookingTicket[]).filter((booking: BookingTicket) =>
    booking.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.confirmationCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingBookings = filteredBookings.filter((booking: BookingTicket) => 
    new Date(booking.eventDate) > new Date() && booking.status === 'confirmed'
  );

  const pastBookings = filteredBookings.filter((booking: BookingTicket) => 
    new Date(booking.eventDate) <= new Date() || booking.status !== 'confirmed'
  );

  const downloadTicket = (booking: BookingTicket) => {
    // Generate and download ticket PDF
    const ticketData = {
      eventTitle: booking.eventTitle,
      confirmationCode: booking.confirmationCode,
      ticketNumbers: booking.ticketNumbers,
      eventDate: booking.eventDate,
      eventTime: booking.eventTime,
      venue: booking.eventVenue,
      quantity: booking.quantity
    };
    
    toast({
      title: "Ticket Downloaded",
      description: "Your ticket has been downloaded successfully.",
    });
  };

  const shareTicket = (booking: BookingTicket) => {
    if (navigator.share) {
      navigator.share({
        title: `Ticket for ${booking.eventTitle}`,
        text: `I'm going to ${booking.eventTitle}! Confirmation: ${booking.confirmationCode}`,
        url: window.location.origin + `/events/${booking.eventId}`
      });
    } else {
      navigator.clipboard.writeText(
        `I'm going to ${booking.eventTitle}! Confirmation: ${booking.confirmationCode}\n${window.location.origin}/events/${booking.eventId}`
      );
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard.",
      });
    }
  };

  const generateQRCode = (booking: BookingTicket) => {
    toast({
      title: "QR Code Generated",
      description: "QR code for ticket verification generated.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Tickets</h1>
          <p className="text-purple-200">Manage your event bookings and tickets</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Label htmlFor="search" className="text-white mb-2 block">Search tickets</Label>
          <Input
            id="search"
            placeholder="Search by event name or confirmation code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-600">
              Upcoming Events ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-purple-600">
              Past Events ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="text-center p-8">
                  <Ticket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Events</h3>
                  <p className="text-purple-200 mb-4">You don't have any upcoming events booked.</p>
                  <Button 
                    onClick={() => window.location.href = "/find-events"}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    Browse Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking: BookingTicket) => (
                  <Card key={booking.id} className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-green-600 text-white">
                          {booking.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="border-purple-300 text-purple-200">
                          {booking.ticketType}
                        </Badge>
                      </div>
                      <CardTitle className="text-white text-lg">{booking.eventTitle}</CardTitle>
                      <CardDescription className="text-purple-200">
                        Confirmation: {booking.confirmationCode}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-purple-200">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <Clock className="h-4 w-4" />
                          <span>{booking.eventTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.eventVenue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-200">
                          <Users className="h-4 w-4" />
                          <span>{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <Separator className="my-4 bg-white/20" />

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-purple-200">Total Paid</span>
                        <span className="text-xl font-bold text-white">${booking.totalAmount}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadTicket(booking)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareTicket(booking)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateQRCode(booking)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="text-center p-8">
                  <Ticket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Past Events</h3>
                  <p className="text-purple-200">You don't have any past events.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking: BookingTicket) => (
                  <Card key={booking.id} className="bg-white/10 backdrop-blur border-white/20">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{booking.eventTitle}</h3>
                            <Badge className={
                              booking.status === 'confirmed' ? 'bg-gray-600' :
                              booking.status === 'cancelled' ? 'bg-red-600' : 'bg-orange-600'
                            }>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-purple-200">
                            <div>
                              <span className="block font-medium">Date</span>
                              <span>{booking.eventDate}</span>
                            </div>
                            <div>
                              <span className="block font-medium">Tickets</span>
                              <span>{booking.quantity} × {booking.ticketType}</span>
                            </div>
                            <div>
                              <span className="block font-medium">Confirmation</span>
                              <span>{booking.confirmationCode}</span>
                            </div>
                            <div>
                              <span className="block font-medium">Total</span>
                              <span>${booking.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadTicket(booking)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-white/10 backdrop-blur border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl">{selectedBooking.eventTitle}</CardTitle>
                    <CardDescription className="text-purple-200">
                      Booking Details
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooking(null)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Event Details */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Event Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-purple-300 font-medium">Date & Time</span>
                      <span className="text-white">{selectedBooking.eventDate} at {selectedBooking.eventTime}</span>
                    </div>
                    <div>
                      <span className="block text-purple-300 font-medium">Venue</span>
                      <span className="text-white">{selectedBooking.eventVenue}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Ticket Details */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Ticket Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Confirmation Code</span>
                      <span className="text-white font-mono">{selectedBooking.confirmationCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Ticket Type</span>
                      <span className="text-white">{selectedBooking.ticketType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Quantity</span>
                      <span className="text-white">{selectedBooking.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Status</span>
                      <Badge className={
                        selectedBooking.status === 'confirmed' ? 'bg-green-600' :
                        selectedBooking.status === 'cancelled' ? 'bg-red-600' : 'bg-orange-600'
                      }>
                        {selectedBooking.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Payment Details */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-300">Subtotal ({selectedBooking.quantity} tickets)</span>
                      <span className="text-white">${selectedBooking.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-300">Platform Fee (7%)</span>
                      <span className="text-white">${selectedBooking.platformFee}</span>
                    </div>
                    <Separator className="bg-white/20" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total Paid</span>
                      <span className="text-white">${selectedBooking.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
                    onClick={() => downloadTicket(selectedBooking)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => shareTicket(selectedBooking)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  {selectedBooking.status === 'confirmed' && new Date(selectedBooking.eventDate) > new Date() && (
                    <Button
                      variant="destructive"
                      onClick={() => cancelBookingMutation.mutate(selectedBooking.id)}
                      disabled={cancelBookingMutation.isPending}
                    >
                      {cancelBookingMutation.isPending ? (
                        <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}