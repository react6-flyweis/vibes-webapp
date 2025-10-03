import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Camera, 
  Utensils, 
  Shield, 
  Music, 
  Star,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Calendar as CalendarIcon,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  category: string;
  specialties: string[];
  rating: number;
  totalJobs: number;
  hourlyRate: number;
  location: string;
  availability: string[];
  profileImage: string;
  experience: string;
  verified: boolean;
  portfolio?: string[];
  availableDates: string[];
  reviews: Review[];
}

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  eventType: string;
  date: string;
}

export default function EnhancedStaffingMarketplace() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    eventDate: "",
    startTime: "",
    duration: "",
    eventType: "",
    guestCount: "",
    specialRequests: ""
  });

  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ["/api/staffing/members", selectedCategory, searchQuery],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/staffing/categories"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return await apiRequest("POST", "/api/staffing/bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your staff member has been successfully booked.",
      });
      setShowBookingDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/staffing/members"] });
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking.",
        variant: "destructive",
      });
    },
  });

  const handleDirectBooking = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowBookingDialog(true);
  };

  const confirmBooking = () => {
    if (!selectedStaff || !selectedDate) return;
    
    const booking = {
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      date: selectedDate.toISOString().split('T')[0],
      ...bookingDetails,
      totalCost: calculateTotalCost(),
      status: "confirmed"
    };

    bookingMutation.mutate(booking);
  };

  const calculateTotalCost = () => {
    if (!selectedStaff || !bookingDetails.duration) return 0;
    return selectedStaff.hourlyRate * parseInt(bookingDetails.duration);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      bartender: <Users className="h-4 w-4" />,
      photographer: <Camera className="h-4 w-4" />,
      server: <Utensils className="h-4 w-4" />,
      security: <Shield className="h-4 w-4" />,
      dj: <Music className="h-4 w-4" />
    };
    return icons[category as keyof typeof icons] || <Users className="h-4 w-4" />;
  };

  const filteredStaff = (staffMembers || []).filter((staff: StaffMember) => {
    const matchesCategory = selectedCategory === "all" || staff.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.specialties && staff.specialties.some(s => s?.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getAvailableTimeSlots = (date: Date) => {
    return ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Event Staffing Marketplace
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Book verified professionals for your events with instant calendar availability and direct booking
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-300"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{filteredStaff.length}</div>
              <div className="text-purple-200">Staff members available</div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStaff.map((staff: StaffMember) => (
            <Card key={staff.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{staff.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getCategoryIcon(staff.category)}
                        <span className="text-purple-200 text-sm capitalize">{staff.category}</span>
                        {staff.verified && (
                          <Badge className="bg-green-500/20 text-green-300 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold">{staff.rating}</span>
                    </div>
                    <div className="text-purple-200 text-sm">{staff.totalJobs} jobs</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {staff.specialties && staff.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="h-4 w-4" />
                    {staff.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <DollarSign className="h-4 w-4" />
                    ${staff.hourlyRate}/hour
                  </div>

                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <Clock className="h-4 w-4" />
                    Next available: {staff.availableDates && staff.availableDates[0] ? staff.availableDates[0] : "Contact for availability"}
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3">
                    <Dialog open={showBookingDialog && selectedStaff?.id === staff.id} onOpenChange={setShowBookingDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => handleDirectBooking(staff)}
                          className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Book {staff.name} - {staff.category}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                          {/* Calendar Section */}
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Select Date & Time</h3>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => {
                                const dateStr = date.toISOString().split('T')[0];
                                return !staff.availableDates?.includes(dateStr) || date < new Date();
                              }}
                              className="rounded-md border border-gray-700 bg-gray-800 text-white"
                            />
                            {selectedDate && (
                              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-300 mb-2">Available times for {selectedDate.toDateString()}:</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {getAvailableTimeSlots(selectedDate).map((time) => (
                                    <Button
                                      key={time}
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30"
                                      onClick={() => setBookingDetails({...bookingDetails, startTime: time})}
                                    >
                                      {time}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Booking Form */}
                          <div className="space-y-4">
                            <div>
                              <Label className="text-white">Event Type</Label>
                              <Select onValueChange={(value) => setBookingDetails({...bookingDetails, eventType: value})}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="wedding">Wedding</SelectItem>
                                  <SelectItem value="corporate">Corporate Event</SelectItem>
                                  <SelectItem value="birthday">Birthday Party</SelectItem>
                                  <SelectItem value="private">Private Party</SelectItem>
                                  <SelectItem value="conference">Conference</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-white">Duration</Label>
                              <Select onValueChange={(value) => setBookingDetails({...bookingDetails, duration: value})}>
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2">2 hours</SelectItem>
                                  <SelectItem value="4">4 hours</SelectItem>
                                  <SelectItem value="6">6 hours</SelectItem>
                                  <SelectItem value="8">8 hours</SelectItem>
                                  <SelectItem value="10">10 hours</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-white">Guest Count</Label>
                              <Input 
                                type="number"
                                placeholder="Number of guests"
                                className="bg-gray-800 border-gray-700 text-white"
                                value={bookingDetails.guestCount}
                                onChange={(e) => setBookingDetails({...bookingDetails, guestCount: e.target.value})}
                              />
                            </div>
                            
                            <div>
                              <Label className="text-white">Special Requests</Label>
                              <Textarea 
                                placeholder="Any special requirements or notes..."
                                className="bg-gray-800 border-gray-700 text-white"
                                value={bookingDetails.specialRequests}
                                onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})}
                              />
                            </div>
                            
                            <div className="p-4 bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-center text-white mb-2">
                                <span>Rate: ${staff.hourlyRate}/hour</span>
                                <span>Duration: {bookingDetails.duration || "0"} hours</span>
                              </div>
                              <div className="flex justify-between items-center text-white font-semibold">
                                <span>Total Cost:</span>
                                <span className="text-green-400">${calculateTotalCost()}</span>
                              </div>
                            </div>
                            
                            <Button 
                              className="w-full bg-linear-to-r from-purple-600 to-blue-600"
                              onClick={confirmBooking}
                              disabled={!selectedDate || !bookingDetails.duration || bookingMutation.isPending}
                            >
                              {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-purple-300 text-purple-200 hover:bg-purple-500/20">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">Reviews for {staff.name}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-96 overflow-y-auto space-y-4">
                          {staff.reviews?.map((review) => (
                            <div key={review.id} className="p-4 bg-gray-800 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-white">{review.clientName}</span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Badge variant="outline" className="text-xs">{review.eventType}</Badge>
                                <span>•</span>
                                <span>{review.date}</span>
                              </div>
                            </div>
                          ))}
                          {(!staff.reviews || staff.reviews.length === 0) && (
                            <div className="text-center text-gray-400 py-8">
                              No reviews yet. Be the first to book and review!
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center text-white py-12">
            <h3 className="text-xl mb-2">No staff members found</h3>
            <p className="text-purple-200">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}