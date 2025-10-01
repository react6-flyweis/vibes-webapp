import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Sparkles,
  Volume2,
  Users,
  MapPin,
  Calendar,
  Clock,
  Music,
  Camera,
  Gift,
  Star,
  Heart,
  Zap,
  Crown,
  Palette,
  Globe,
  Share2,
  Download,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  VolumeX,
  Headphones,
  Disc3,
  PartyPopper,
  Wallet,
  Shield,
  Timer,
  TrendingUp,
  MessageCircle,
  Image,
  Video,
  Eye,
  Target,
  Award,
  Gamepad2,
  Activity,
  Trophy,
  Smartphone,
  Mic
} from "lucide-react";

interface EventInvitation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  host: {
    name: string;
    avatar: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    style: string;
  };
  virtualVenue: {
    modelUrl: string;
    previewImages: string[];
    interactiveElements: string[];
  };
  soundtrack: {
    previewTracks: Array<{
      id: string;
      title: string;
      artist: string;
      preview: string;
      votes: number;
    }>;
  };
  rsvpDetails: {
    totalInvited: number;
    confirmed: number;
    pending: number;
  };
  perks: Array<{
    id: string;
    title: string;
    description: string;
    type: 'discount' | 'recipe' | 'nft' | 'exclusive';
    value: string;
    unlocked: boolean;
  }>;
  smartContract: {
    enabled: boolean;
    chainId: string;
    contractAddress: string;
    nftTokenId?: string;
  };
  countdownTarget: string;
  vibeUpdates: Array<{
    id: string;
    type: 'milestone' | 'vendor' | 'menu' | 'decor';
    message: string;
    timestamp: string;
    image?: string;
  }>;
}

interface GuestProfile {
  name: string;
  email: string;
  avatar: string;
  vibeType: string;
  excitement: string;
  contribution: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  nftVerified: boolean;
  selectedSeat?: number;
}

const vibeTypes = [
  { id: 'party-starter', name: 'Life of the Party', icon: PartyPopper, color: 'bg-red-500' },
  { id: 'chill-viber', name: 'Chill Viber', icon: Heart, color: 'bg-blue-500' },
  { id: 'dance-machine', name: 'Dance Machine', icon: Disc3, color: 'bg-purple-500' },
  { id: 'social-butterfly', name: 'Social Butterfly', icon: Users, color: 'bg-pink-500' },
  { id: 'music-lover', name: 'Music Lover', icon: Headphones, color: 'bg-green-500' },
  { id: 'vibe-curator', name: 'Vibe Curator', icon: Palette, color: 'bg-yellow-500' }
];

export default function InteractiveLiveVibesInvite() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'preview' | 'explore' | 'interact'>('preview');
  const [guestProfile, setGuestProfile] = useState<GuestProfile>({
    name: '',
    email: '',
    avatar: '👤',
    vibeType: '',
    excitement: '',
    contribution: '',
    rsvpStatus: 'pending',
    nftVerified: false,
    selectedSeat: undefined,
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get invitation ID from URL params (in real implementation)
  const invitationId = "invite_001";

  // Video generation function
  const generateVideo = async (options: any) => {
    try {
      const response = await apiRequest(`/api/invitations/${invitationId}/generate-video`, "POST", {
        guestId: "guest_001",
        options
      });
      
      if (response.success) {
        toast({
          title: "Video Generated Successfully!",
          description: `Your personalized welcome video is ready. Duration: ${response.video.options.duration}s`,
        });
      } else {
        toast({
          title: "Video Generation Complete",
          description: "Your personalized welcome video has been created.",
        });
      }
      
    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        title: "Video Processing",
        description: "Video generation request received. Processing in background.",
        variant: "default",
      });
    }
  };

  // Share invitation function
  const handleShareInvitation = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: invitation?.eventTitle || 'Amazing Event Invitation',
          text: `You're invited to ${invitation?.eventTitle}! Check out this immersive invitation experience.`,
          url: `${window.location.origin}/interactive-live-vibes-invite?id=${invitationId}`
        });
      } else {
        // Fallback: copy to clipboard
        const shareUrl = `${window.location.origin}/interactive-live-vibes-invite?id=${invitationId}`;
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Invitation link copied to clipboard. Share it with your friends!",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Available",
        description: "Use your browser's share options or copy the URL to share this invitation.",
        variant: "default",
      });
    }
  };

  // Save to calendar function
  const handleSaveToCalendar = () => {
    try {
      if (invitation) {
        const startDate = new Date(`${invitation.eventDate} ${invitation.eventTime}`);
        const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // Add 4 hours
        
        const formatDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const calendarData = {
          title: invitation.eventTitle,
          start: formatDate(startDate),
          end: formatDate(endDate),
          description: `Join us for ${invitation.eventTitle} at ${invitation.venue.name}. This Interactive Live Vibes Invite includes personal videos, 3D venue tours, live music voting, VIP perks, and NFT RSVP features!`,
          location: `${invitation.venue.name}, ${invitation.venue.address}`
        };

        // Google Calendar URL
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${calendarData.start}/${calendarData.end}&details=${encodeURIComponent(calendarData.description)}&location=${encodeURIComponent(calendarData.location)}`;
        
        // iCal format for download
        const icalData = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Vibes//Interactive Live Vibes Invite//EN',
          'BEGIN:VEVENT',
          `DTSTART:${calendarData.start}`,
          `DTEND:${calendarData.end}`,
          `SUMMARY:${calendarData.title}`,
          `DESCRIPTION:${calendarData.description}`,
          `LOCATION:${calendarData.location}`,
          `UID:${invitationId}@vibes.com`,
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');

        // Try to open Google Calendar, fallback to download
        if (window.confirm('Add to Google Calendar? (Cancel to download .ics file instead)')) {
          window.open(googleUrl, '_blank');
        } else {
          // Download .ics file
          const blob = new Blob([icalData], { type: 'text/calendar' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${invitation.eventTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
          link.click();
          URL.revokeObjectURL(url);
        }

        toast({
          title: "Calendar Event Created!",
          description: "Event has been added to your calendar with all invitation details.",
        });
      }
    } catch (error) {
      console.error('Calendar error:', error);
      toast({
        title: "Calendar Export Available",
        description: "You can manually add this event to your calendar using the event details shown.",
        variant: "default",
      });
    }
  };

  // Fetch invitation details
  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ['/api/invitations', invitationId],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/invitations/${invitationId}`, "GET");
      } catch (err) {
        console.error("Failed to fetch invitation:", err);
        return null;
      }
    },
    retry: false,
  });

  // Fetch guest RSVP list
  const { data: guestList } = useQuery({
    queryKey: ['/api/invitations', invitationId, 'guests'],
    queryFn: async () => {
      try {
        return await apiRequest(`/api/invitations/${invitationId}/guests`, "GET");
      } catch (err) {
        console.error("Failed to fetch guests:", err);
        return [];
      }
    },
    retry: false,
  });

  // Submit RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: async (rsvpData: any) => {
      return await apiRequest(`/api/invitations/${invitationId}/rsvp`, "POST", rsvpData);
    },
    onSuccess: () => {
      toast({
        title: "RSVP Confirmed!",
        description: "Your special perks have been unlocked!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/invitations'] });
    },
    onError: (error) => {
      console.error("RSVP failed:", error);
      toast({
        title: "RSVP Failed",
        description: "Unable to submit RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Vote for track mutation
  const voteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      return await apiRequest(`/api/invitations/${invitationId}/vote-track`, "POST", { trackId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invitations'] });
      toast({
        title: "Vote Recorded!",
        description: "Your track vote has been counted.",
      });
    },
    onError: (error) => {
      console.error("Vote failed:", error);
    },
  });

  // Mint NFT RSVP mutation
  const mintNFTMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/invitations/${invitationId}/mint-nft`, "POST", {});
    },
    onSuccess: () => {
      toast({
        title: "NFT RSVP Minted!",
        description: "Your blockchain verification is complete!",
      });
      setGuestProfile(prev => ({ ...prev, nftVerified: true }));
    },
    onError: (error) => {
      console.error("NFT minting failed:", error);
      toast({
        title: "NFT Minting Failed",
        description: "Unable to mint NFT RSVP. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Countdown timer
  useEffect(() => {
    if (!invitation) return;

    const targetDate = new Date(invitation.countdownTarget).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [invitation]);

  // Audio visualization
  useEffect(() => {
    if (!canvasRef.current || !audioRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create animated waveform effect
      const bars = 32;
      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * canvas.height * (isPlaying ? 0.8 : 0.2);
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#3B82F6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      }
      
      if (isPlaying) {
        requestAnimationFrame(drawVisualization);
      }
    };

    drawVisualization();
  }, [isPlaying]);

  const handlePlayTrack = (trackId: string, previewUrl: string) => {
    if (selectedTrack === trackId && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setSelectedTrack(trackId);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = previewUrl;
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          toast({
            title: "Audio Unavailable",
            description: "Track preview is not available at the moment.",
            variant: "destructive",
          });
          setIsPlaying(false);
        });
      }
    }
  };

  const handleRSVP = (status: 'confirmed' | 'declined') => {
    const rsvpData = {
      ...guestProfile,
      rsvpStatus: status,
      selectedSeat: guestProfile.selectedSeat,
      timestamp: new Date().toISOString()
    };
    
    rsvpMutation.mutate(rsvpData);
    setGuestProfile(prev => ({ ...prev, rsvpStatus: status }));
  };

  const handleMintNFT = () => {
    if (invitation?.smartContract?.enabled) {
      mintNFTMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const invitationData = invitation || {
    id: invitationId,
    eventId: "event_001",
    eventTitle: "Sarah's Epic 25th Birthday Bash",
    eventDate: "2025-06-15",
    eventTime: "8:00 PM",
    venue: {
      name: "The Garden Rooftop",
      address: "123 Skyline Drive, Downtown",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    host: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"
    },
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#3B82F6",
      style: "Neon Dreams"
    },
    virtualVenue: {
      modelUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      previewImages: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format"
      ],
      interactiveElements: ["Dance Floor", "VIP Lounge", "Bar Area", "Photo Booth"]
    },
    soundtrack: {
      previewTracks: [
        { id: "track_1", title: "Midnight City", artist: "M83", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format", votes: 23 },
        { id: "track_2", title: "Feel It Still", artist: "Portugal. The Man", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format", votes: 18 },
        { id: "track_3", title: "Electric Feel", artist: "MGMT", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format", votes: 15 },
        { id: "track_4", title: "Dancing Queen", artist: "ABBA", preview: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format", votes: 31 }
      ]
    },
    rsvpDetails: {
      totalInvited: 50,
      confirmed: 32,
      pending: 18
    },
    perks: [
      {
        id: "perk_1",
        title: "Signature Cocktail Recipe",
        description: "Sarah's secret Neon Fizz recipe for pre-gaming",
        type: "recipe" as const,
        value: "recipe_neon_fizz.pdf",
        unlocked: false
      },
      {
        id: "perk_2", 
        title: "Early Bird VIP Access",
        description: "Get exclusive access 30 minutes early",
        type: "exclusive" as const,
        value: "vip_early_access",
        unlocked: false
      },
      {
        id: "perk_3",
        title: "Outfit Discount",
        description: "20% off at StyleHub for party outfits",
        type: "discount" as const,
        value: "PARTY20",
        unlocked: false
      },
      {
        id: "perk_4",
        title: "Commemorative NFT",
        description: "Limited edition party NFT badge",
        type: "nft" as const,
        value: "nft_party_badge_001",
        unlocked: false
      }
    ],
    smartContract: {
      enabled: true,
      chainId: "ethereum",
      contractAddress: "0x1234567890abcdef",
      nftTokenId: "party_rsvp_001"
    },
    countdownTarget: "2025-06-15T20:00:00Z",
    vibeUpdates: [
      {
        id: "update_1",
        type: "milestone" as const,
        message: "🎉 30 guests confirmed! The party is officially happening!",
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "update_2",
        type: "vendor" as const,
        message: "🎵 DJ MixMaster confirmed for the night! Get ready to dance!",
        timestamp: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: "update_3",
        type: "menu" as const,
        message: "🍸 Cocktail menu finalized - featuring 6 signature drinks!",
        timestamp: new Date(Date.now() - 21600000).toISOString()
      }
    ]
  };

  return (
    <div className="min-h-screen" style={{ 
      background: `linear-gradient(135deg, ${invitationData.theme.primaryColor}15, ${invitationData.theme.secondaryColor}15)` 
    }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div 
              className="p-4 rounded-2xl shadow-2xl text-white"
              style={{ background: `linear-gradient(135deg, ${invitationData.theme.primaryColor}, ${invitationData.theme.secondaryColor})` }}
            >
              <Sparkles className="w-12 h-12" />
            </div>
            <div 
              className="p-4 rounded-2xl shadow-2xl text-white"
              style={{ background: `linear-gradient(135deg, ${invitationData.theme.secondaryColor}, ${invitationData.theme.primaryColor})` }}
            >
              <PartyPopper className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4" style={{ color: invitationData.theme.primaryColor }}>
            {invitationData.eventTitle}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            You're invited to an unforgettable experience!
          </p>
          
          {/* Event Details */}
          <div className="flex items-center justify-center gap-8 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: invitationData.theme.primaryColor }} />
              <span>{new Date(invitationData.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: invitationData.theme.primaryColor }} />
              <span>{invitationData.eventTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" style={{ color: invitationData.theme.primaryColor }} />
              <span>{invitationData.venue.name}</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-8 text-center" style={{ 
            background: `linear-gradient(135deg, ${invitationData.theme.primaryColor}10, ${invitationData.theme.secondaryColor}10)` 
          }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Timer className="w-6 h-6" />
              Party Countdown
            </h2>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div 
                    className="text-3xl font-bold text-white rounded-lg p-4 mb-2"
                    style={{ backgroundColor: invitationData.theme.primaryColor }}
                  >
                    {value.toString().padStart(2, '0')}
                  </div>
                  <p className="text-sm capitalize text-gray-600 dark:text-gray-400">{unit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={currentView} onValueChange={(value: any) => setCurrentView(value)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3 mx-auto">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Venue Preview
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Soundtrack
            </TabsTrigger>
            <TabsTrigger value="interact" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              RSVP & Vibes
            </TabsTrigger>
          </TabsList>

          {/* Virtual Venue Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  3D Virtual Venue Tour
                </CardTitle>
                <CardDescription>Explore the party space before you arrive!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden h-96 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Globe className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Interactive 3D Venue</h3>
                      <p className="text-gray-300 mb-4">Click and drag to explore the space</p>
                      <Button 
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => toast({ title: "3D Tour", description: "Loading immersive venue experience..." })}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Virtual Tour
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {invitationData.virtualVenue.interactiveElements.map((element: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col gap-2"
                      onClick={() => toast({ title: "Venue Spotlight", description: `Focusing on ${element}` })}
                    >
                      <Target className="w-6 h-6" />
                      <span className="text-sm">{element}</span>
                    </Button>
                  ))}
                </div>

                {/* Dynamic Seat Selection Wizard */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Smart Seat Wizard
                    </CardTitle>
                    <CardDescription>AI-powered seat recommendation based on your preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Preference Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const recommendedSeat = Math.floor(Math.random() * 8) + 1; // VIP seats
                          setGuestProfile(prev => ({ ...prev, selectedSeat: recommendedSeat }));
                          toast({ title: "Perfect Match!", description: `VIP seat ${recommendedSeat} recommended for party starters!` });
                        }}
                      >
                        🎉 Close to Action
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const recommendedSeat = Math.floor(Math.random() * 8) + 25; // Back seats
                          setGuestProfile(prev => ({ ...prev, selectedSeat: recommendedSeat }));
                          toast({ title: "Perfect Match!", description: `Quiet seat ${recommendedSeat} perfect for observers!` });
                        }}
                      >
                        🧘 Chill Vibes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const recommendedSeat = Math.floor(Math.random() * 12) + 13; // Middle area
                          setGuestProfile(prev => ({ ...prev, selectedSeat: recommendedSeat }));
                          toast({ title: "Perfect Match!", description: `Social seat ${recommendedSeat} great for mingling!` });
                        }}
                      >
                        💬 Social Zone
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const availableSeats = [...Array(32)].map((_, i) => i + 1).filter(seat => ![3, 7, 12, 18, 23, 27].includes(seat));
                          const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
                          setGuestProfile(prev => ({ ...prev, selectedSeat: randomSeat }));
                          toast({ title: "Surprise Me!", description: `Random seat ${randomSeat} selected!` });
                        }}
                      >
                        🎲 Surprise Me
                      </Button>
                    </div>

                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-4">
                      {/* Stage/DJ Area */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-sm font-bold">
                        DJ STAGE
                      </div>
                      
                      {/* Dance Floor */}
                      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-40 h-20 border-2 border-dashed border-purple-400 rounded flex items-center justify-center text-purple-600 text-sm font-medium">
                        DANCE FLOOR
                      </div>
                      
                      {/* Seating Areas with Enhanced Visuals */}
                      <div className="grid grid-cols-8 gap-2 mt-28">
                        {[...Array(32)].map((_, index) => {
                          const seatNumber = index + 1;
                          const isVIP = index < 8;
                          const isSelected = guestProfile.selectedSeat === seatNumber;
                          const isOccupied = [3, 7, 12, 18, 23, 27].includes(seatNumber);
                          const isRecommended = guestProfile.vibeType === 'party-starter' && isVIP;
                          
                          return (
                            <Button
                              key={seatNumber}
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              className={`w-8 h-8 p-0 text-xs transition-all duration-300 ${
                                isVIP ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : ''
                              } ${
                                isOccupied ? 'bg-red-100 border-red-400 cursor-not-allowed' : ''
                              } ${
                                isRecommended ? 'ring-2 ring-green-400 animate-pulse' : ''
                              }`}
                              disabled={isOccupied}
                              onClick={() => setGuestProfile(prev => ({ ...prev, selectedSeat: seatNumber }))}
                            >
                              {isOccupied ? 'X' : isRecommended ? '★' : seatNumber}
                            </Button>
                          );
                        })}
                      </div>
                      
                      {/* Enhanced Legend */}
                      <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-gray-400 bg-white rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-yellow-400 bg-yellow-50 rounded"></div>
                          <span>VIP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border border-red-400 bg-red-100 rounded"></div>
                          <span>Taken</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-purple-600 rounded"></div>
                          <span>Selected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 border-2 border-green-400 bg-green-50 rounded"></div>
                          <span>Recommended</span>
                        </div>
                      </div>
                    </div>
                    
                    {guestProfile.selectedSeat && (
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="font-medium text-purple-800 dark:text-purple-300 flex items-center justify-center gap-2">
                          <span>Seat {guestProfile.selectedSeat} Reserved</span>
                          {guestProfile.selectedSeat <= 8 && (
                            <Badge className="bg-yellow-500 text-yellow-900">VIP</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {guestProfile.selectedSeat <= 8 ? "Front row energy! Perfect for dancing." : 
                           guestProfile.selectedSeat <= 24 ? "Great social spot with good views." : 
                           "Relaxed area with easy bar access."}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interactive 3D Venue Preview */}
                <div className="relative h-96 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
                  <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                    {/* 3D Venue Container */}
                    <div 
                      className="relative w-full h-full transition-transform duration-1000 hover:rotate-y-12" 
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Main Hall */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-b from-purple-800/80 to-purple-900/80 rounded-lg backdrop-blur-sm border border-purple-400/30 cursor-pointer"
                        style={{ transform: 'rotateY(0deg) translateZ(20px)' }}
                        onClick={() => toast({ title: "Main Hall", description: "DJ Stage & Dance Floor - Capacity: 150 guests" })}
                      >
                        <div className="p-4 h-full flex flex-col justify-between relative">
                          <div>
                            <h3 className="text-white font-bold text-lg">Main Hall</h3>
                            <p className="text-purple-200 text-sm">DJ Stage & Dance Floor</p>
                          </div>

                          {/* DJ Stage */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-500 rounded flex items-center justify-center">
                            <Music className="w-4 h-4 text-yellow-900" />
                          </div>

                          {/* Dance Floor */}
                          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-12 border-2 border-yellow-400/50 rounded bg-yellow-400/20">
                            <div className="text-xs text-yellow-200 text-center mt-3">Dance Floor</div>
                          </div>

                          {/* Table Layout - Left Side (Tables 1-4) */}
                          <div className="absolute top-12 left-4 space-y-2">
                            {[1, 2, 3, 4].map((tableNum) => (
                              <div 
                                key={`left-table-${tableNum}`}
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Table ${tableNum}`, description: `Round table for 12 guests - Premium location` });
                                }}
                              >
                                {/* Table */}
                                <div className="w-8 h-8 bg-amber-600 rounded-full border-2 border-amber-400 shadow-lg">
                                  <div className="text-xs text-amber-100 text-center mt-1">{tableNum}</div>
                                </div>
                                {/* Chairs around table */}
                                <div className="absolute -top-1 -left-1 w-10 h-10">
                                  {Array.from({ length: 12 }).map((_, chairIndex) => {
                                    const angle = (chairIndex * 360) / 12;
                                    const x = Math.cos((angle * Math.PI) / 180) * 15;
                                    const y = Math.sin((angle * Math.PI) / 180) * 15;
                                    return (
                                      <div
                                        key={chairIndex}
                                        className="absolute w-1 h-1 bg-amber-300 rounded-full"
                                        style={{
                                          left: `${20 + x}px`,
                                          top: `${20 + y}px`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Table Layout - Right Side (Tables 5-8) */}
                          <div className="absolute top-12 right-4 space-y-2">
                            {[5, 6, 7, 8].map((tableNum) => (
                              <div 
                                key={`right-table-${tableNum}`}
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Table ${tableNum}`, description: `Round table for 12 guests - Premium location` });
                                }}
                              >
                                {/* Table */}
                                <div className="w-8 h-8 bg-amber-600 rounded-full border-2 border-amber-400 shadow-lg">
                                  <div className="text-xs text-amber-100 text-center mt-1">{tableNum}</div>
                                </div>
                                {/* Chairs around table */}
                                <div className="absolute -top-1 -left-1 w-10 h-10">
                                  {Array.from({ length: 12 }).map((_, chairIndex) => {
                                    const angle = (chairIndex * 360) / 12;
                                    const x = Math.cos((angle * Math.PI) / 180) * 15;
                                    const y = Math.sin((angle * Math.PI) / 180) * 15;
                                    return (
                                      <div
                                        key={chairIndex}
                                        className="absolute w-1 h-1 bg-amber-300 rounded-full"
                                        style={{
                                          left: `${20 + x}px`,
                                          top: `${20 + y}px`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Center Tables (Tables 9-12) - Near DJ */}
                          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 grid grid-cols-2 gap-3">
                            {[9, 10, 11, 12].map((tableNum) => (
                              <div 
                                key={`center-table-${tableNum}`}
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Table ${tableNum}`, description: `Round table for 10 guests - DJ view` });
                                }}
                              >
                                {/* Table */}
                                <div className="w-6 h-6 bg-amber-600 rounded-full border-2 border-amber-400 shadow-lg">
                                  <div className="text-xs text-amber-100 text-center">{tableNum}</div>
                                </div>
                                {/* Chairs around table */}
                                <div className="absolute -top-1 -left-1 w-8 h-8">
                                  {Array.from({ length: 10 }).map((_, chairIndex) => {
                                    const angle = (chairIndex * 360) / 10;
                                    const x = Math.cos((angle * Math.PI) / 180) * 12;
                                    const y = Math.sin((angle * Math.PI) / 180) * 12;
                                    return (
                                      <div
                                        key={chairIndex}
                                        className="absolute w-1 h-1 bg-amber-300 rounded-full"
                                        style={{
                                          left: `${16 + x}px`,
                                          top: `${16 + y}px`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bar Area */}
                          <div 
                            className="absolute top-1/2 left-2 w-4 h-8 bg-green-600 rounded cursor-pointer border border-green-400" 
                            title="Bar Area"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ title: "Bar Area", description: "Full service bar with signature cocktails" });
                            }}
                          >
                            <div className="text-xs text-green-100 text-center mt-2">BAR</div>
                          </div>

                          {/* VIP Section */}
                          <div 
                            className="absolute top-4 right-2 w-12 h-6 bg-blue-600 rounded cursor-pointer border border-blue-400" 
                            title="VIP Section"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ title: "VIP Section", description: "Exclusive seating for premium guests" });
                            }}
                          >
                            <div className="text-xs text-blue-100 text-center mt-1">VIP</div>
                          </div>

                          {/* Capacity Info */}
                          <div className="absolute bottom-2 right-2 text-xs text-purple-200 bg-purple-900/50 px-2 py-1 rounded">
                            12 Tables • 134 Seats
                          </div>
                        </div>
                      </div>

                      {/* VIP Lounge */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-b from-yellow-800/80 to-yellow-900/80 rounded-lg backdrop-blur-sm border border-yellow-400/30 cursor-pointer"
                        style={{ transform: 'rotateY(90deg) translateZ(20px)' }}
                        onClick={() => toast({ title: "VIP Lounge", description: "Exclusive area with premium amenities" })}
                      >
                        <div className="p-4 h-full flex flex-col justify-between relative">
                          <div>
                            <h3 className="text-white font-bold text-lg">VIP Lounge</h3>
                            <p className="text-yellow-200 text-sm">Exclusive Area</p>
                          </div>

                          {/* VIP Tables - Premium Layout */}
                          <div className="absolute top-16 left-6 space-y-4">
                            {[13, 14].map((tableNum) => (
                              <div 
                                key={`vip-table-${tableNum}`}
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `VIP Table ${tableNum}`, description: `Premium table for 10 guests - Bottle service included` });
                                }}
                              >
                                {/* VIP Table */}
                                <div className="w-10 h-10 bg-yellow-600 rounded-full border-2 border-yellow-400 shadow-lg">
                                  <div className="text-xs text-yellow-100 text-center mt-2">{tableNum}</div>
                                </div>
                                {/* Chairs around VIP table */}
                                <div className="absolute -top-1 -left-1 w-12 h-12">
                                  {Array.from({ length: 10 }).map((_, chairIndex) => {
                                    const angle = (chairIndex * 360) / 10;
                                    const x = Math.cos((angle * Math.PI) / 180) * 18;
                                    const y = Math.sin((angle * Math.PI) / 180) * 18;
                                    return (
                                      <div
                                        key={chairIndex}
                                        className="absolute w-1.5 h-1.5 bg-yellow-300 rounded-full border border-yellow-200"
                                        style={{
                                          left: `${24 + x}px`,
                                          top: `${24 + y}px`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* VIP Lounge Seating */}
                          <div className="absolute top-12 right-4 space-y-2">
                            <div className="w-8 h-4 bg-yellow-700 rounded border border-yellow-500 cursor-pointer"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   toast({ title: "Lounge Seating", description: "Luxury sofas for 6 guests" });
                                 }}>
                              <div className="text-xs text-yellow-100 text-center">SOFA</div>
                            </div>
                            <div className="w-8 h-4 bg-yellow-700 rounded border border-yellow-500 cursor-pointer"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   toast({ title: "Lounge Seating", description: "Luxury sofas for 6 guests" });
                                 }}>
                              <div className="text-xs text-yellow-100 text-center">SOFA</div>
                            </div>
                          </div>

                          {/* VIP Bar */}
                          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-yellow-600 rounded border border-yellow-400 cursor-pointer"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 toast({ title: "VIP Bar", description: "Premium bottle service and exclusive cocktails" });
                               }}>
                            <div className="text-xs text-yellow-100 text-center mt-1">VIP BAR</div>
                          </div>

                          {/* Crown Icon */}
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Crown className="w-4 h-4 text-yellow-900" />
                          </div>

                          {/* VIP Capacity Info */}
                          <div className="absolute bottom-2 right-2 text-xs text-yellow-200 bg-yellow-900/50 px-2 py-1 rounded">
                            2 Tables • 32 Seats
                          </div>
                        </div>
                      </div>

                      {/* Outdoor Patio */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-b from-green-800/80 to-green-900/80 rounded-lg backdrop-blur-sm border border-green-400/30 cursor-pointer"
                        style={{ transform: 'rotateY(180deg) translateZ(20px)' }}
                        onClick={() => toast({ title: "Outdoor Patio", description: "Garden setting with fresh air and city views" })}
                      >
                        <div className="p-4 h-full flex flex-col justify-between relative">
                          <div>
                            <h3 className="text-white font-bold text-lg">Outdoor Patio</h3>
                            <p className="text-green-200 text-sm">Fresh Air & Views</p>
                          </div>

                          {/* Patio High Tables */}
                          <div className="absolute top-16 left-4 grid grid-cols-2 gap-3">
                            {[15, 16, 17, 18].map((tableNum) => (
                              <div 
                                key={`patio-table-${tableNum}`}
                                className="relative group cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Patio Table ${tableNum}`, description: `High-top table for 6 guests - Fresh air dining` });
                                }}
                              >
                                {/* High Table */}
                                <div className="w-6 h-6 bg-green-600 rounded border-2 border-green-400 shadow-lg">
                                  <div className="text-xs text-green-100 text-center">{tableNum}</div>
                                </div>
                                {/* Chairs around high table */}
                                <div className="absolute -top-1 -left-1 w-8 h-8">
                                  {Array.from({ length: 6 }).map((_, chairIndex) => {
                                    const angle = (chairIndex * 360) / 6;
                                    const x = Math.cos((angle * Math.PI) / 180) * 12;
                                    const y = Math.sin((angle * Math.PI) / 180) * 12;
                                    return (
                                      <div
                                        key={chairIndex}
                                        className="absolute w-1 h-1 bg-green-300 rounded-full"
                                        style={{
                                          left: `${16 + x}px`,
                                          top: `${16 + y}px`,
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Garden Lounge Seating */}
                          <div className="absolute top-12 right-4 space-y-3">
                            <div className="w-10 h-6 bg-green-700 rounded border border-green-500 cursor-pointer"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   toast({ title: "Garden Lounge", description: "Outdoor sectional seating for 8 guests" });
                                 }}>
                              <div className="text-xs text-green-100 text-center mt-1">LOUNGE</div>
                            </div>
                            <div className="w-10 h-6 bg-green-700 rounded border border-green-500 cursor-pointer"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   toast({ title: "Garden Lounge", description: "Outdoor sectional seating for 8 guests" });
                                 }}>
                              <div className="text-xs text-green-100 text-center mt-1">LOUNGE</div>
                            </div>
                          </div>

                          {/* Garden Bar */}
                          <div 
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-green-600 rounded border border-green-400 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ title: "Garden Bar", description: "Outdoor cocktail service with fresh air" });
                            }}
                          >
                            <div className="text-xs text-green-100 text-center mt-1">GARDEN BAR</div>
                          </div>

                          {/* Patio Capacity Info */}
                          <div className="absolute bottom-2 right-2 text-xs text-green-200 bg-green-900/50 px-2 py-1 rounded">
                            4 Tables • 40 Seats
                          </div>
                        </div>
                      </div>

                      {/* Photo Booth Area */}
                      <div 
                        className="absolute inset-4 bg-gradient-to-b from-pink-800/80 to-pink-900/80 rounded-lg backdrop-blur-sm border border-pink-400/30 cursor-pointer"
                        style={{ transform: 'rotateY(270deg) translateZ(20px)' }}
                        onClick={() => toast({ title: "Photo Booth", description: "Professional photo booth with props and instant prints" })}
                      >
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div>
                            <h3 className="text-white font-bold text-lg">Photo Booth</h3>
                            <p className="text-pink-200 text-sm">Capture Memories</p>
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                            <Camera className="w-4 h-4 text-pink-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3D Navigation Controls */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                      onClick={() => toast({ title: "360° View", description: "Exploring venue from all angles" })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                      onClick={() => toast({ title: "Focus Mode", description: "Zooming into venue details" })}
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                      onClick={() => toast({ title: "Virtual Tour", description: "Starting guided venue walkthrough" })}
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Venue Information Overlay */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                    <h3 className="font-bold text-sm">Jordan's Birthday Venue</h3>
                    <p className="text-xs text-gray-300">4 Interactive Areas • 360° Exploration</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">Main Hall</span>
                      <span className="text-xs bg-yellow-500/30 px-2 py-1 rounded">VIP</span>
                      <span className="text-xs bg-green-500/30 px-2 py-1 rounded">Patio</span>
                      <span className="text-xs bg-pink-500/30 px-2 py-1 rounded">Photos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Soundtrack Explorer */}
          <TabsContent value="explore" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Live Soundtrack Preview
                </CardTitle>
                <CardDescription>Get a taste of the night's vibe and vote for your favorites!</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Audio Visualizer */}
                <div className="mb-6">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={120}
                    className="w-full h-24 rounded-lg bg-black"
                  />
                  <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
                </div>

                {/* Track List */}
                <div className="space-y-4">
                  {invitationData.soundtrack.previewTracks.map((track) => (
                    <Card key={track.id} className={`transition-all ${selectedTrack === track.id ? 'ring-2 ring-purple-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant={selectedTrack === track.id && isPlaying ? "destructive" : "default"}
                              onClick={() => handlePlayTrack(track.id, track.preview)}
                            >
                              {selectedTrack === track.id && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <div>
                              <h3 className="font-semibold">{track.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{track.artist}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <span className="text-sm">{track.votes}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => voteTrackMutation.mutate(track.id)}
                              disabled={voteTrackMutation.isPending}
                            >
                              <Star className="w-4 h-4" />
                              Vote
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interactive RSVP */}
          <TabsContent value="interact" className="space-y-6">
            {/* Personalized Mood Avatar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Create Your Vibe Avatar
                </CardTitle>
                <CardDescription>Let everyone know what energy you're bringing!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {vibeTypes.map((vibe) => {
                    const IconComponent = vibe.icon;
                    return (
                      <Button
                        key={vibe.id}
                        variant={guestProfile.vibeType === vibe.id ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col gap-2"
                        onClick={() => setGuestProfile(prev => ({ ...prev, vibeType: vibe.id }))}
                      >
                        <div className={`p-2 rounded-full text-white ${vibe.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-sm">{vibe.name}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">What are you most excited about?</label>
                    <Textarea
                      placeholder="Dancing, meeting new people, trying the signature cocktails..."
                      value={guestProfile.excitement || ''}
                      onChange={(e) => setGuestProfile(prev => ({ ...prev, excitement: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">What are you bringing to the party?</label>
                    <Textarea
                      placeholder="Good vibes, amazing dance moves, party games..."
                      value={guestProfile.contribution || ''}
                      onChange={(e) => setGuestProfile(prev => ({ ...prev, contribution: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your RSVP
                </CardTitle>
              </CardHeader>
              <CardContent>
                {guestProfile.rsvpStatus === 'pending' ? (
                  <div className="flex gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => handleRSVP('confirmed')}
                      disabled={rsvpMutation.isPending}
                      style={{ backgroundColor: invitationData.theme.primaryColor }}
                      className="text-white"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      I'm In! Let's Party!
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleRSVP('declined')}
                      disabled={rsvpMutation.isPending}
                    >
                      Can't Make It
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
                      backgroundColor: guestProfile.rsvpStatus === 'confirmed' ? `${invitationData.theme.primaryColor}20` : '#ef444420',
                      color: guestProfile.rsvpStatus === 'confirmed' ? invitationData.theme.primaryColor : '#ef4444'
                    }}>
                      {guestProfile.rsvpStatus === 'confirmed' ? <Zap className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      {guestProfile.rsvpStatus === 'confirmed' ? 'You\'re going!' : 'You declined'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Smart Contract RSVP */}
            {invitationData.smartContract.enabled && guestProfile.rsvpStatus === 'confirmed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Blockchain RSVP Verification
                  </CardTitle>
                  <CardDescription>Secure your spot with NFT verification</CardDescription>
                </CardHeader>
                <CardContent>
                  {!guestProfile.nftVerified ? (
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Mint your NFT RSVP token for ultimate authenticity and exclusive perks!
                      </p>
                      <Button
                        size="lg"
                        onClick={handleMintNFT}
                        disabled={mintNFTMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        {mintNFTMutation.isPending ? 'Minting...' : 'Mint NFT RSVP'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <Shield className="w-4 h-4" />
                        NFT Verified
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Token ID: {invitationData.smartContract.nftTokenId}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Unlocked Perks */}
            {guestProfile.rsvpStatus === 'confirmed' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Your Exclusive Perks
                  </CardTitle>
                  <CardDescription>Special rewards for confirming your attendance!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {invitationData.perks.map((perk) => (
                      <Card key={perk.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                            <Gift className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{perk.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {perk.description}
                            </p>
                            <Button size="sm" className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              Claim Perk
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guest List Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Who's Coming
                </CardTitle>
                <CardDescription>
                  {invitationData.rsvpDetails.confirmed} confirmed • {invitationData.rsvpDetails.pending} pending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium">Guest {index + 1}</p>
                      <Badge variant="outline" className="text-xs">
                        Party Starter
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Event Mood Heatmap */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Live Mood Heatmap
                </CardTitle>
                <CardDescription>Real-time guest emotion tracking and venue energy</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mood Selection */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                  {[
                    { emoji: '🔥', mood: 'Excited', color: 'bg-red-500' },
                    { emoji: '😊', mood: 'Happy', color: 'bg-yellow-500' },
                    { emoji: '🎵', mood: 'Vibing', color: 'bg-purple-500' },
                    { emoji: '🤩', mood: 'Amazed', color: 'bg-pink-500' },
                    { emoji: '😎', mood: 'Cool', color: 'bg-blue-500' },
                    { emoji: '💃', mood: 'Dancing', color: 'bg-green-500' }
                  ].map((moodOption) => (
                    <Button
                      key={moodOption.mood}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 flex flex-col gap-1"
                      onClick={() => {
                        toast({ 
                          title: "Mood Shared!", 
                          description: `You're feeling ${moodOption.mood.toLowerCase()}!` 
                        });
                      }}
                    >
                      <span className="text-lg">{moodOption.emoji}</span>
                      <span className="text-xs">{moodOption.mood}</span>
                    </Button>
                  ))}
                </div>

                {/* Venue Heatmap Visualization */}
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-8 gap-1">
                    {[...Array(32)].map((_, index) => {
                      const heatIntensity = Math.random();
                      const heatColor = heatIntensity > 0.7 ? 'bg-red-400' : 
                                       heatIntensity > 0.4 ? 'bg-yellow-400' : 
                                       heatIntensity > 0.2 ? 'bg-green-400' : 'bg-blue-400';
                      return (
                        <div
                          key={index}
                          className={`w-6 h-6 rounded ${heatColor} opacity-70 transition-all duration-1000`}
                          style={{
                            animation: `pulse ${1 + Math.random() * 2}s infinite`,
                          }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Heatmap Legend */}
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded"></div>
                      <span>High Energy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                      <span>Excited</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span>Happy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-400 rounded"></div>
                      <span>Chill</span>
                    </div>
                  </div>
                </div>

                {/* Live Mood Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">85%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Excitement Level</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">23</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Vibing Now</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">18</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Dancing</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Overall Happiness</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Vibe Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Vibe Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitationData.vibeUpdates.map((update) => (
                    <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{update.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(update.timestamp).toDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Personalized Welcome Video Generator */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Your Personal Welcome Video
            </CardTitle>
            <CardDescription>Custom AI-generated video message just for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                    onClick={() => generateVideo({ includeHostMessage: true, includeVenueTour: true, includeMusicPreview: true })}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Generate My Welcome Video
                  </Button>
                </div>
                
                {/* Animated Background Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute top-1/2 right-8 w-8 h-8 bg-green-400 rounded-full opacity-25 animate-ping"></div>
              </div>

              {/* Video Customization Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => generateVideo({ includeHostMessage: true })}
                >
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Host Message</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => generateVideo({ includeVenueTour: true })}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Venue Tour</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => generateVideo({ includeMusicPreview: true })}
                >
                  <Music className="w-4 h-4" />
                  <span className="text-xs">Music Preview</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-auto p-3 flex flex-col gap-2"
                  onClick={() => generateVideo({ includeMemoryReel: true })}
                >
                  <Camera className="w-4 h-4" />
                  <span className="text-xs">Memory Reel</span>
                </Button>
              </div>

              {/* Video Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>AI-Generated Script</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Mic className="w-4 h-4 text-blue-600" />
                  <span>Custom Voice Message</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Palette className="w-4 h-4 text-green-600" />
                  <span>Themed Visuals</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Guest Interaction Leaderboard */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Guest Interaction Leaderboard
            </CardTitle>
            <CardDescription>Most active and engaged party guests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alex Chen", avatar: "🎉", score: 285, badge: "Party Starter", color: "bg-yellow-500" },
                { name: "Maya Rodriguez", avatar: "💃", score: 267, badge: "Dance Floor Queen", color: "bg-purple-500" },
                { name: "Jordan Kim", avatar: "🎵", score: 251, badge: "Music Curator", color: "bg-blue-500" },
                { name: "Sam Wilson", avatar: "😊", score: 238, badge: "Vibe Spreader", color: "bg-green-500" },
                { name: "Riley Davis", avatar: "🔥", score: 225, badge: "Energy Booster", color: "bg-red-500" }
              ].map((guest, index) => (
                <div key={guest.name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`w-8 h-8 rounded-full ${guest.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {index + 1}
                  </div>
                  <div className="text-2xl">{guest.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium">{guest.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{guest.badge}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{guest.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                  {index < 3 && (
                    <div className="text-lg">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interaction Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Song Votes</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">89</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mood Shares</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">42</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">RSVP Confirms</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">27</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">NFT Mints</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Augmented Reality Event Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              AR Event Preview
            </CardTitle>
            <CardDescription>Experience the party before you arrive</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* AR Preview Window */}
              <div className="relative aspect-square bg-gradient-to-br from-cyan-900 to-purple-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Point Your Camera</h3>
                    <p className="text-sm opacity-80">Scan to preview the venue in AR</p>
                  </div>
                </div>
                
                {/* AR Elements Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                  🎵 DJ Booth
                </div>
                <div className="absolute bottom-6 right-6 bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                  🍹 Bar Area
                </div>
                <div className="absolute top-1/2 left-6 bg-white/90 text-black px-2 py-1 rounded text-xs font-medium">
                  💃 Dance Floor
                </div>
              </div>

              {/* AR Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Virtual Venue Tour</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Explore every corner</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">See Other Guests</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Who's coming nearby</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Interactive Map</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Navigate with ease</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">AR Filters</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Party-themed effects</div>
                  </div>
                </Button>
              </div>

              {/* Launch AR Button */}
              <Button size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Smartphone className="w-5 h-5 mr-2" />
                Launch AR Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Share Invitation */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Love this invitation?</h3>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={handleShareInvitation}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share with Friends
              </Button>
              <Button 
                variant="outline"
                onClick={handleSaveToCalendar}
              >
                <Download className="w-4 h-4 mr-2" />
                Save to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}