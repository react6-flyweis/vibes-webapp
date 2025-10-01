import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users,
  Star,
  Clock,
  DollarSign,
  Wifi,
  Car,
  Camera,
  Shield,
  Zap,
  Award,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  Coins,
  QrCode,
  Box
} from "lucide-react";

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  category: 'nightclub' | 'restaurant' | 'hotel' | 'event_space' | 'rooftop' | 'warehouse';
  capacity: number;
  hourlyRate: number;
  rating: number;
  totalBookings: number;
  images: string[];
  amenities: string[];
  availability: {
    date: string;
    timeSlots: Array<{
      start: string;
      end: string;
      available: boolean;
      price: number;
    }>;
  }[];
  digitalTwin: {
    enabled: boolean;
    floorPlan: string;
    vrTourUrl?: string;
    arMarkersCount: number;
    lastUpdated: string;
  };
  loyaltyProgram: {
    enabled: boolean;
    pointsPerBooking: number;
    totalPointsIssued: number;
    memberCount: number;
    blockchainVerified: boolean;
  };
  integrationStatus: 'pending' | 'active' | 'premium' | 'suspended';
  partnerSince: string;
  revenue: {
    monthlyEarnings: number;
    totalEarnings: number;
    commissionRate: number;
    pendingPayouts: number;
  };
}

interface VenueBooking {
  id: string;
  venueId: string;
  venueName: string;
  eventId: number;
  eventTitle: string;
  hostName: string;
  bookingDate: string;
  timeSlot: string;
  guestCount: number;
  totalCost: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  loyaltyPoints: number;
  smartContractAddress?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface VenueStats {
  totalVenues: number;
  totalBookings: number;
  averageRating: number;
  monthlyRevenue: number;
  topCategory: string;
  averageUtilization: number;
}

export default function VenueIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [guestCount, setGuestCount] = useState("");

  // Fetch venue data
  const { data: venues = [], isLoading: venuesLoading } = useQuery({
    queryKey: ["/api/venues"],
  });

  const { data: venueBookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/venue-bookings"],
  });

  const { data: venueStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/venues/stats"],
  });

  // Book venue mutation
  const bookVenueMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/venues/book", data);
    },
    onSuccess: () => {
      toast({
        title: "Venue Booked Successfully",
        description: "Your booking has been confirmed and smart contract deployed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      queryClient.invalidateQueries({ queryKey: ["/api/venue-bookings"] });
      setSelectedVenue(null);
      setBookingDate("");
      setSelectedTimeSlot("");
      setGuestCount("");
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Join loyalty program mutation
  const loyaltyMutation = useMutation({
    mutationFn: async (venueId: string) => {
      return await apiRequest("POST", "/api/venues/join-loyalty", { venueId });
    },
    onSuccess: () => {
      toast({
        title: "Loyalty Program Joined",
        description: "You're now earning blockchain-verified loyalty points!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Join Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBookVenue = () => {
    if (!selectedVenue || !bookingDate || !selectedTimeSlot || !guestCount) return;
    
    bookVenueMutation.mutate({
      venueId: selectedVenue,
      bookingDate,
      timeSlot: selectedTimeSlot,
      guestCount: parseInt(guestCount)
    });
  };

  const handleJoinLoyalty = (venueId: string) => {
    loyaltyMutation.mutate(venueId);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nightclub': return Zap;
      case 'restaurant': return Users;
      case 'hotel': return Building2;
      case 'event_space': return Calendar;
      case 'rooftop': return Star;
      case 'warehouse': return Box;
      default: return Building2;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'premium': return 'text-purple-700 bg-purple-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  if (venuesLoading || bookingsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Venue Integration Hub
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Direct venue partnerships with digital twins, automated booking, and blockchain loyalty programs
          </p>
        </div>

        {/* Venue Platform Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-green-400" />
                Partner Venues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {venueStats.totalVenues || 0}
              </div>
              <p className="text-green-100 text-sm">Integrated venues</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5 text-blue-400" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {venueStats.totalBookings?.toLocaleString() || '0'}
              </div>
              <p className="text-green-100 text-sm">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 text-yellow-400" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                ${venueStats.monthlyRevenue?.toLocaleString() || '0'}
              </div>
              <p className="text-green-100 text-sm">Monthly venue revenue</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {venueStats.averageUtilization || 0}%
              </div>
              <p className="text-green-100 text-sm">Average capacity used</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Partner Venues */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building2 className="h-6 w-6 text-green-400" />
                  Partner Venues
                </CardTitle>
                <CardDescription className="text-green-100">
                  Integrated venues with digital twins and automated booking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {venues.map((venue: Venue) => {
                    const IconComponent = getCategoryIcon(venue.category);
                    return (
                      <div 
                        key={venue.id}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedVenue === venue.id 
                            ? 'border-green-400 bg-green-500/20' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedVenue(venue.id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{venue.name}</h3>
                              <p className="text-green-100 text-sm">{venue.address}, {venue.city}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(venue.integrationStatus)}>
                              {venue.integrationStatus}
                            </Badge>
                            {venue.digitalTwin.enabled && (
                              <Badge className="text-blue-700 bg-blue-100">
                                Digital Twin
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-green-200">Capacity:</span>
                            <span className="text-white ml-2">{venue.capacity} guests</span>
                          </div>
                          <div>
                            <span className="text-green-200">Hourly Rate:</span>
                            <span className="text-yellow-400 ml-2">${venue.hourlyRate}</span>
                          </div>
                          <div>
                            <span className="text-green-200">Rating:</span>
                            <div className="flex items-center ml-2">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-white ml-1">{venue.rating}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-green-200">Bookings:</span>
                            <span className="text-white ml-2">{venue.totalBookings}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-2 text-xs">
                            {venue.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} className="text-xs bg-white/10 text-green-100">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                          
                          {venue.digitalTwin.enabled && (
                            <Button size="sm" variant="outline" className="text-blue-400 border-blue-400">
                              <Eye className="h-4 w-4 mr-1" />
                              View 3D
                            </Button>
                          )}
                        </div>

                        {venue.loyaltyProgram.enabled && (
                          <div className="pt-3 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="text-green-200">Loyalty Program:</span>
                                <span className="text-yellow-400 ml-2">
                                  +{venue.loyaltyProgram.pointsPerBooking} points/booking
                                </span>
                                {venue.loyaltyProgram.blockchainVerified && (
                                  <CheckCircle className="h-4 w-4 text-green-400 inline ml-2" />
                                )}
                              </div>
                              
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinLoyalty(venue.id);
                                }}
                                disabled={loyaltyMutation.isPending}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                {loyaltyMutation.isPending ? (
                                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                  <>
                                    <Coins className="h-4 w-4 mr-1" />
                                    Join
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking & My Bookings */}
          <div className="space-y-6">
            {/* Quick Booking */}
            {selectedVenue && (
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Calendar className="h-6 w-6 text-green-400" />
                    Book Venue
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Automated booking with smart contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date" className="text-green-100">Event Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeSlot" className="text-green-100">Time Slot</Label>
                    <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">9:00 AM - 1:00 PM</SelectItem>
                        <SelectItem value="afternoon">2:00 PM - 6:00 PM</SelectItem>
                        <SelectItem value="evening">7:00 PM - 11:00 PM</SelectItem>
                        <SelectItem value="night">10:00 PM - 2:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="guests" className="text-green-100">Expected Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      placeholder="50"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-green-200"
                    />
                  </div>

                  <Button 
                    onClick={handleBookVenue} 
                    disabled={bookVenueMutation.isPending || !bookingDate || !selectedTimeSlot}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {bookVenueMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Book Venue
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* My Venue Bookings */}
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-6 w-6 text-blue-400" />
                  My Bookings
                </CardTitle>
                <CardDescription className="text-green-100">
                  Recent venue reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {venueBookings.map((booking: VenueBooking) => (
                    <div key={booking.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-sm">{booking.venueName}</h3>
                          <p className="text-green-100 text-xs">{booking.eventTitle}</p>
                        </div>
                        <Badge className={
                          booking.status === 'confirmed' ? 'text-green-700 bg-green-100' :
                          booking.status === 'pending' ? 'text-yellow-700 bg-yellow-100' :
                          booking.status === 'completed' ? 'text-purple-700 bg-purple-100' :
                          'text-red-700 bg-red-100'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="text-green-200">Date:</span>
                          <span className="text-white ml-2">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-200">Time:</span>
                          <span className="text-white ml-2">{booking.timeSlot}</span>
                        </div>
                        <div>
                          <span className="text-green-200">Cost:</span>
                          <span className="text-yellow-400 ml-2">${booking.totalCost}</span>
                        </div>
                        {booking.loyaltyPoints > 0 && (
                          <div>
                            <span className="text-green-200">Points Earned:</span>
                            <span className="text-yellow-400 ml-2">+{booking.loyaltyPoints}</span>
                          </div>
                        )}
                      </div>

                      {booking.smartContractAddress && (
                        <div className="mt-2 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-green-200">Smart Contract</span>
                            <Button size="sm" variant="ghost" className="h-6 text-blue-400">
                              <QrCode className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Benefits */}
        <Card className="mt-8 bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-6 w-6 text-yellow-400" />
              Venue Integration Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Digital Twins</h3>
                <p className="text-green-100 text-sm">Interactive 3D floor plans and virtual tours for precise event planning</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Smart Contracts</h3>
                <p className="text-green-100 text-sm">Automated booking confirmations and secure payment processing</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coins className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Loyalty Programs</h3>
                <p className="text-green-100 text-sm">Blockchain-verified points system for repeat venue bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}