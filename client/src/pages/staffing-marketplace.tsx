import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Calendar as CalendarIcon,
  MessageSquare
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

export default function StaffingMarketplace() {
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
    endTime: "",
    eventType: "",
    guestCount: "",
    specialRequests: ""
  });
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    eventType: ""
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
        title: "Booking Request Sent",
        description: "The staff member will respond within 24 hours.",
      });
      setSelectedStaff(null);
      queryClient.invalidateQueries({ queryKey: ["/api/staffing/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredStaff = staffMembers.filter((staff: StaffMember) => {
    const matchesCategory = selectedCategory === "all" || staff.category === selectedCategory;
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    return matchesCategory && matchesSearch;
  });

  const handleBooking = () => {
    if (!selectedStaff) return;
    
    bookingMutation.mutate({
      staffId: selectedStaff.id,
      ...bookingDetails,
      totalCost: calculateBookingCost(),
    });
  };

  const calculateBookingCost = () => {
    if (!selectedStaff || !bookingDetails.startTime || !bookingDetails.endTime) return 0;
    
    const start = new Date(`2000-01-01T${bookingDetails.startTime}`);
    const end = new Date(`2000-01-01T${bookingDetails.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const subtotal = hours * selectedStaff.hourlyRate;
    const platformFee = subtotal * 0.10; // 10% platform fee
    
    return subtotal + platformFee;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bartender": return <Utensils className="h-4 w-4" />;
      case "server": return <Users className="h-4 w-4" />;
      case "photographer": return <Camera className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      case "dj": return <Music className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Event Staffing Marketplace</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Book professional event staff for your perfect party. Bartenders, photographers, security, and more.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                    <Input
                      placeholder="Search by name or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStaff.map((staff: StaffMember) => (
            <Card key={staff.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer">
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
                          <Badge className="bg-green-500/20 text-green-300 text-xs">Verified</Badge>
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
                    {staff.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 text-purple-200 text-sm">
                    <MapPin className="h-4 w-4" />
                    {staff.location}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white font-semibold">
                      <DollarSign className="h-4 w-4" />
                      ${staff.hourlyRate}/hr
                    </div>
                    <Button
                      onClick={() => setSelectedStaff(staff)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Book {selectedStaff.name}
                </CardTitle>
                <p className="text-purple-200">
                  {selectedStaff.category} • ${selectedStaff.hourlyRate}/hour
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-purple-100 text-sm font-medium">Event Date</label>
                    <Input
                      type="date"
                      value={bookingDetails.eventDate}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-purple-100 text-sm font-medium">Event Type</label>
                    <Input
                      placeholder="Birthday party, wedding, etc."
                      value={bookingDetails.eventType}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, eventType: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                    />
                  </div>
                  
                  <div>
                    <label className="text-purple-100 text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={bookingDetails.startTime}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, startTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-purple-100 text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={bookingDetails.endTime}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, endTime: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-purple-100 text-sm font-medium">Guest Count</label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={bookingDetails.guestCount}
                      onChange={(e) => setBookingDetails(prev => ({ ...prev, guestCount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-purple-100 text-sm font-medium">Special Requests</label>
                  <textarea
                    placeholder="Any specific requirements or preferences..."
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-purple-200 resize-none h-20"
                  />
                </div>
                
                {bookingDetails.startTime && bookingDetails.endTime && (
                  <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-300/30">
                    <div className="flex justify-between text-white">
                      <span>Estimated Total:</span>
                      <span className="font-semibold">${calculateBookingCost().toFixed(2)}</span>
                    </div>
                    <div className="text-purple-200 text-sm mt-1">
                      Includes 10% platform fee
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStaff(null)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={bookingMutation.isPending || !bookingDetails.eventDate || !bookingDetails.startTime}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {bookingMutation.isPending ? "Booking..." : "Send Booking Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}