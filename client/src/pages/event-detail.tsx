import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SocialShare from "@/components/social-share";
import { 
  MapPin, 
  Calendar,
  Users,
  Star,
  DollarSign,
  Clock,
  Bus,
  Waves,
  Building2,
  Plane,
  Train,
  Sailboat,
  Mountain,
  Flame,
  Share2,
  Heart,
  ExternalLink,
  Ticket,
  Info,
  Phone,
  Mail
} from "lucide-react";

const categoryIcons = {
  "party-bus": Bus,
  "cruise": Waves,
  "yacht": Sailboat,
  "rooftop": Building2,
  "warehouse": Building2,
  "beach": Mountain,
  "pool": Waves,
  "boat": Sailboat,
  "private-jet": Plane,
  "train": Train,
  "underground": Flame
};

const categoryLabels = {
  "party-bus": "Party Bus",
  "cruise": "Cruise Party",
  "yacht": "Yacht Experience",
  "rooftop": "Rooftop Party",
  "warehouse": "Warehouse Rave",
  "beach": "Beach Party",
  "pool": "Pool Party",
  "boat": "Boat Party",
  "private-jet": "Private Jet",
  "train": "Party Train",
  "underground": "Underground"
};

export default function EventDetail() {
  const [, params] = useRoute("/events/:eventId");
  const eventId = params?.eventId;
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ["/api/events/booking", eventId],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-purple-200 mb-6">The event you're looking for doesn't exist.</p>
          <Button 
            onClick={() => window.location.href = "/unique-parties"}
            className="bg-linear-to-r from-purple-600 to-blue-600"
          >
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[event.category as keyof typeof categoryIcons] || Bus;
  const categoryLabel = categoryLabels[event.category as keyof typeof categoryLabels] || event.category;

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // In a real app, this would make an API call to save the favorite
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/20"
          >
            ← Back
          </Button>
        </div>

        {/* Event Title and Actions */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-purple-600/90 text-white flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  {categoryLabel}
                </Badge>
                {event.featured && (
                  <Badge className="bg-yellow-500/90 text-black">Featured</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
              <div className="flex items-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.venue}, {event.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{event.date} at {event.time}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFavorite}
                className={`border-white/30 ${isFavorited ? 'bg-red-500 text-white' : 'text-white hover:bg-white/20'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShareModalOpen(true)}
                className="border-white/30 text-white hover:bg-white/20"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{event.attendees}</div>
                  <div className="text-purple-200 text-sm">Attending</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{event.rating}</div>
                  <div className="text-purple-200 text-sm">Rating</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {typeof event.price === 'object' ? `$${event.price.min}+` : `$${event.price}`}
                  </div>
                  <div className="text-purple-200 text-sm">From</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{event.time}</div>
                  <div className="text-purple-200 text-sm">Start Time</div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-200 leading-relaxed mb-4">
                  {event.description}
                </p>
                
                {event.tags && (
                  <div>
                    <h4 className="text-white font-semibold mb-3">Event Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-purple-300 text-purple-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Venue Information</h4>
                    <div className="space-y-2 text-purple-200">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.city}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-2">Event Schedule</h4>
                    <div className="space-y-2 text-purple-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div>
                  <h4 className="text-white font-semibold mb-2">Capacity</h4>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} / {event.maxCapacity} attendees</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div 
                      className="bg-linear-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Book Your Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {typeof event.price === 'object' 
                      ? `$${event.price.min} - $${event.price.max}`
                      : `$${event.price}`
                    }
                  </div>
                  <div className="text-purple-200 text-sm">+ 7% platform fee</div>
                </div>

                <Button 
                  className="w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  onClick={() => window.location.href = `/events/booking/${event.id}`}
                >
                  Book Now
                </Button>

                <div className="text-center text-purple-200 text-sm">
                  Secure booking • Instant confirmation
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => window.open('mailto:support@vibes.app')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => window.open('tel:+1-555-VIBES')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Similar Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-purple-200 text-sm">
                  Discover more amazing {categoryLabel.toLowerCase()} experiences
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                  onClick={() => window.location.href = `/unique-parties?category=${event.category}`}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Browse Similar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShare
        event={event}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}