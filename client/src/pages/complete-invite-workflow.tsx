import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Send,
  Users,
  Calendar,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Download,
  Eye,
  QrCode,
  Smartphone,
  Mail,
  MessageSquare,
  Instagram,
  Twitter,
  Facebook,
  Palette,
  Camera,
  Music,
  Gift,
  Crown,
  Zap,
  Sparkles,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
  Video,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit3,
  Copy,
  ExternalLink,
  Settings,
  Sliders,
  Wand2,
  Bot,
  Gamepad2,
  ShoppingBag,
  Headphones,
} from "lucide-react";
import image1 from "../../assests/templateImage/1.jpg";
import image2 from "../../assests/templateImage/2.jpg";
import image3 from "../../assests/templateImage/3.jpg";

import image4 from "../../assests/templateImage/4.jpg";
import image5 from "../../assests/templateImage/5.jpg";
import GuestManagement from "@/components/invitation/GuestManagement";
import PreviewInvitation from "@/components/invitation/PreviewInvitation";

interface InvitationEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  hostName: string;
  hostAvatar: string;
  coverImage: string;
  category:
    | "birthday"
    | "wedding"
    | "corporate"
    | "party"
    | "cultural"
    | "nightclub";
  capacity: number;
  ticketPrice?: number;
  isPrivate: boolean;
  requiresApproval: boolean;
  dresscode?: string;
  ageRestriction?: number;
  amenities: string[];
  culturalTheme?: string;
  vibesTags: string[];
  sustainabilityScore?: number;
  setCurrentStep: string;
}

interface InvitationTemplate {
  id: string;
  name: string;
  category:
    | "classic"
    | "modern"
    | "cultural"
    | "ar-enhanced"
    | "nft-exclusive"
    | "interactive";
  thumbnail: string;
  previewImages: string[];
  features: string[];
  isPremium: boolean;
  culturalRegion?: string;
  arElements?: string[];
  nftIntegration?: boolean;
  interactiveFeatures?: string[];
  musicIntegration?: boolean;
  gamificationLevel?: "basic" | "medium" | "advanced";
}

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  tier?: "vip" | "premium" | "general";
  dietary?: string[];
  plusOnes?: number;
  rsvpStatus?: "pending" | "accepted" | "declined" | "maybe";
  accessLevel?: "full" | "limited" | "preview";
  nftPassId?: string;
  loyaltyPoints?: number;
}

interface InvitationPreview {
  template: InvitationTemplate;
  event: InvitationEvent;
  customizations: {
    colors: string[];
    fonts: string[];
    animations: boolean;
    musicPreview?: string;
    arExperience?: boolean;
    nftPassPreview?: boolean;
    gamificationElements?: boolean;
    culturalElements?: string[];
    sustainabilityBadges?: boolean;
  };
}
// types.ts (make a separate file if you like)
export type StepType =
  | "event"
  | "template"
  | "customize"
  | "guests"
  | "preview"
  | "send";

export default function CompleteInviteWorkflow() {
  const { toast } = useToast();

  // Core workflow state
  const [currentStep, setCurrentStep] = useState<
    "event" | "template" | "customize" | "guests" | "preview" | "send"
  >("event");
  const [selectedEvent, setSelectedEvent] = useState<InvitationEvent | null>(
    null
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvitationTemplate | null>(null);
  const [guestList, setGuestList] = useState<Guest[]>([]);
  const [customizations, setCustomizations] = useState<
    InvitationPreview["customizations"]
  >({
    colors: ["#6366f1", "#8b5cf6"],
    fonts: ["Inter", "Playfair Display"],
    animations: true,
    arExperience: false,
    nftPassPreview: false,
    gamificationElements: false,
    culturalElements: [],
    sustainabilityBadges: false,
  });

  // Event creation state
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    category: "party" as const,
    capacity: 50,
    ticketPrice: 0,
    isPrivate: false,
    requiresApproval: false,
    dresscode: "",
    ageRestriction: 0,
    culturalTheme: "",
    vibesTags: [] as string[],
  });

  // Guest management state
  const [bulkGuestInput, setBulkGuestInput] = useState("");
  const [guestImportMethod, setGuestImportMethod] = useState<
    "manual" | "csv" | "contacts" | "social"
  >("manual");
  const [singleGuest, setSingleGuest] = useState({
    name: "",
    email: "",
    phone: "",
    tier: "general" as const,
  });

  // Preview and sending state
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "mobile" | "ar" | "nft"
  >("desktop");
  const [sendingMethod, setSendingMethod] = useState<
    "email" | "sms" | "social" | "qr" | "nfc"
  >("email");
  const [scheduledSend, setScheduledSend] = useState("");
  const [personalizedMessages, setPersonalizedMessages] = useState<
    Record<string, string>
  >({});

  // Data queries
  const { data: savedEvents = [] } = useQuery({
    queryKey: ["/api/events/my-events"],
    retry: false,
  });

  const { data: invitationTemplates = [] } = useQuery({
    queryKey: ["/api/invitations/templates"],
    retry: false,
  });

  const { data: culturalThemes = [] } = useQuery({
    queryKey: ["/api/cultural/themes"],
    retry: false,
  });

  const { data: arExperiences = [] } = useQuery({
    queryKey: ["/api/ar/experiences"],
    retry: false,
  });

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: async (data: Partial<InvitationEvent>) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedEvent(data);
      setCurrentStep("template");
      toast({
        title: "Event Created",
        description: "Your event has been created successfully",
      });
    },
  });

  const generateInvitationMutation = useMutation({
    mutationFn: async (data: {
      eventId: string;
      templateId: string;
      customizations: any;
      guests: Guest[];
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/invitations/generate",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitations Generated",
        description: "Your personalized invitations are ready to send",
      });
      setCurrentStep("send");
    },
  });

  const sendInvitationsMutation = useMutation({
    mutationFn: async (data: {
      invitationId: string;
      method: string;
      recipients: Guest[];
      scheduledTime?: string;
      personalizations?: Record<string, string>;
    }) => {
      const response = await apiRequest("POST", "/api/invitations/send", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invitations Sent",
        description: `Successfully sent ${data.sentCount} invitations`,
      });
    },
  });

  // Sample data
  const sampleEvents: InvitationEvent[] = [
    {
      id: "event-birthday-bash",
      title: "Sarah's 25th Birthday Bash",
      description:
        "Join us for an unforgettable night celebrating Sarah's milestone birthday with music, dancing, and great vibes!",
      date: "2025-07-15",
      time: "20:00",
      venue: "Rooftop Lounge Sky Bar",
      address: "123 Downtown Plaza, City Center",
      hostName: "Sarah Johnson",
      hostAvatar: image1,
      coverImage: image1,
      category: "birthday",
      capacity: 100,
      ticketPrice: 25,
      isPrivate: false,
      requiresApproval: false,
      dresscode: "Cocktail Attire",
      ageRestriction: 21,
      amenities: ["Open Bar", "DJ", "Photo Booth", "VIP Area", "Rooftop Views"],
      vibesTags: ["upbeat", "celebration", "dancing", "cocktails", "skyline"],
      sustainabilityScore: 85,
    },
    {
      id: "event-corporate-gala",
      title: "Annual Innovation Awards Gala",
      description:
        "Celebrating breakthrough achievements and innovation in technology with industry leaders and visionaries.",
      date: "2025-08-10",
      time: "18:30",
      venue: "Grand Convention Center",
      address: "456 Business District Ave",
      hostName: "TechCorp Industries",
      hostAvatar: image2,
      coverImage: image2,
      category: "corporate",
      capacity: 500,
      ticketPrice: 150,
      isPrivate: true,
      requiresApproval: true,
      dresscode: "Black Tie",
      amenities: [
        "Networking Lounge",
        "Awards Ceremony",
        "Gourmet Dining",
        "Live Entertainment",
      ],
      vibesTags: [
        "professional",
        "networking",
        "elegant",
        "awards",
        "innovation",
      ],
      sustainabilityScore: 92,
    },
  ];

  const sampleTemplates: InvitationTemplate[] = [
    {
      id: "template-neon-nights",
      name: "Neon Nights AR Experience",
      category: "ar-enhanced",
      thumbnail: image4,
      previewImages: [image4, image4],
      features: [
        "3D Neon Animations",
        "AR Party Preview",
        "Interactive Elements",
        "Sound Integration",
      ],
      isPremium: true,
      arElements: [
        "Floating Neon Signs",
        "3D Party Scene",
        "Interactive DJ Booth",
        "Virtual Confetti",
      ],
      interactiveFeatures: [
        "Tap to RSVP",
        "AR Venue Tour",
        "Music Preview",
        "Guest Messages",
      ],
      musicIntegration: true,
      gamificationLevel: "advanced",
    },
    {
      id: "template-cultural-celebration",
      name: "Global Cultural Celebration",
      category: "cultural",
      thumbnail: image3,

      previewImages: [image3, image3],
      features: [
        "Multi-language Support",
        "Cultural Elements",
        "Traditional Patterns",
        "Local Customs",
      ],
      isPremium: false,
      culturalRegion: "Global",
      interactiveFeatures: [
        "Cultural Quiz",
        "Traditional Music",
        "Language Selection",
      ],
      gamificationLevel: "medium",
    },
    {
      id: "template-nft-exclusive",
      name: "NFT VIP Experience",
      category: "nft-exclusive",
      thumbnail: image3,
      previewImages: [image3, image5],
      features: [
        "Blockchain Authentication",
        "NFT Pass Generation",
        "Exclusive Access",
        "Digital Collectibles",
      ],
      isPremium: true,
      nftIntegration: true,
      interactiveFeatures: [
        "NFT Minting",
        "Wallet Connect",
        "Token Gating",
        "Exclusive Perks",
      ],
      gamificationLevel: "advanced",
    },
  ];

  const handleCreateEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.venue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate({
      ...eventForm,
      id: `event-${Date.now()}`,
      hostName: "Current User",
      hostAvatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      coverImage:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
      amenities: [],
    });
  };

  const handleAddGuest = () => {
    if (!singleGuest.name || !singleGuest.email) {
      toast({
        title: "Missing Information",
        description: "Please provide name and email",
        variant: "destructive",
      });
      return;
    }

    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      ...singleGuest,
      rsvpStatus: "pending",
      accessLevel: "full",
    };

    setGuestList((prev) => [...prev, newGuest]);
    setSingleGuest({ name: "", email: "", phone: "", tier: "general" });

    toast({
      title: "Guest Added",
      description: `${newGuest.name} has been added to the guest list`,
    });
  };

  const handleBulkImport = () => {
    if (!bulkGuestInput.trim()) return;

    const lines = bulkGuestInput.split("\n").filter((line) => line.trim());
    const newGuests: Guest[] = lines.map((line, index) => {
      const [name, email, phone] = line.split(",").map((s) => s.trim());
      return {
        id: `guest-bulk-${Date.now()}-${index}`,
        name: name || `Guest ${index + 1}`,
        email: email || `guest${index + 1}@example.com`,
        phone: phone || "",
        tier: "general" as const,
        rsvpStatus: "pending" as const,
        accessLevel: "full" as const,
      };
    });

    setGuestList((prev) => [...prev, ...newGuests]);
    setBulkGuestInput("");

    toast({
      title: "Guests Imported",
      description: `Added ${newGuests.length} guests to the list`,
    });
  };

  const handleGenerateInvitations = () => {
    if (!selectedEvent || !selectedTemplate || guestList.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please complete all steps before generating invitations",
        variant: "destructive",
      });
      return;
    }

    generateInvitationMutation.mutate({
      eventId: selectedEvent.id,
      templateId: selectedTemplate.id,
      customizations,
      guests: guestList,
    });
  };

  const handleSendInvitations = () => {
    if (!selectedEvent || guestList.length === 0) return;

    sendInvitationsMutation.mutate({
      invitationId: `invitation-${selectedEvent.id}`,
      method: sendingMethod,
      recipients: guestList,
      scheduledTime: scheduledSend || undefined,
      personalizations: personalizedMessages,
    });
  };

  const stepProgress = {
    event: 0,
    template: 20,
    customize: 40,
    guests: 60,
    preview: 80,
    send: 100,
  };

  return (
    <div className="min-h-screen bg-[#111827] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white dark:text-white mb-2">
            Complete Invitation Workflow
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Create stunning invitations with AI, AR, NFT, and social features
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <Progress value={stepProgress[currentStep]} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-500">
              <span
                className={
                  currentStep === "event" ? "text-purple-600 font-medium" : ""
                }
              >
                Event Details
              </span>
              <span
                className={
                  currentStep === "template"
                    ? "text-purple-600 font-medium"
                    : ""
                }
              >
                Choose Template
              </span>
              <span
                className={
                  currentStep === "customize"
                    ? "text-purple-600 font-medium"
                    : ""
                }
              >
                Customize
              </span>
              <span
                className={
                  currentStep === "guests" ? "text-purple-600 font-medium" : ""
                }
              >
                Guest List
              </span>
              <span
                className={
                  currentStep === "preview" ? "text-purple-600 font-medium" : ""
                }
              >
                Preview
              </span>
              <span
                className={
                  currentStep === "send" ? "text-purple-600 font-medium" : ""
                }
              >
                Send
              </span>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {[
              "event",
              "template",
              "customize",
              "guests",
              "preview",
              "send",
            ].map((step, index) => (
              <Button
                key={step}
                variant={currentStep === step ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step as any)}
                className="capitalize"
              >
                {step}
              </Button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Event Details */}
          {currentStep === "event" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#EB6F71]" />
                  Event Details
                </CardTitle>
                <CardDescription>
                  Create your event or select from existing events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="new" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#111827] text-white">
                    <TabsTrigger value="new">Create New Event</TabsTrigger>
                    <TabsTrigger value="existing">
                      Select Existing Event
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="new" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Event Title *</Label>
                          <Input
                            id="title"
                            value={eventForm.title}
                            onChange={(e) =>
                              setEventForm((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            placeholder="Amazing Birthday Party"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={eventForm.description}
                            onChange={(e) =>
                              setEventForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Describe your event..."
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date">Date *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={eventForm.date}
                              onChange={(e) =>
                                setEventForm((prev) => ({
                                  ...prev,
                                  date: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="time">Time *</Label>
                            <Input
                              id="time"
                              type="time"
                              value={eventForm.time}
                              onChange={(e) =>
                                setEventForm((prev) => ({
                                  ...prev,
                                  time: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="venue">Venue *</Label>
                          <Input
                            id="venue"
                            value={eventForm.venue}
                            onChange={(e) =>
                              setEventForm((prev) => ({
                                ...prev,
                                venue: e.target.value,
                              }))
                            }
                            placeholder="Sky Lounge Rooftop"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={eventForm.address}
                            onChange={(e) =>
                              setEventForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            placeholder="123 Downtown Ave, City"
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={eventForm.category}
                            onValueChange={(value: any) =>
                              setEventForm((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="birthday">
                                Birthday Party
                              </SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="corporate">
                                Corporate Event
                              </SelectItem>
                              <SelectItem value="party">
                                General Party
                              </SelectItem>
                              <SelectItem value="cultural">
                                Cultural Event
                              </SelectItem>
                              <SelectItem value="nightclub">
                                Nightclub Event
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              value={eventForm.capacity}
                              onChange={(e) =>
                                setEventForm((prev) => ({
                                  ...prev,
                                  capacity: parseInt(e.target.value) || 0,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="ticketPrice">
                              Ticket Price ($)
                            </Label>
                            <Input
                              id="ticketPrice"
                              type="number"
                              value={eventForm.ticketPrice}
                              onChange={(e) =>
                                setEventForm((prev) => ({
                                  ...prev,
                                  ticketPrice: parseFloat(e.target.value) || 0,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreateEvent}
                        disabled={createEventMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {createEventMutation.isPending
                          ? "Creating..."
                          : "Create Event & Continue"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="existing" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {sampleEvents.map((event) => (
                        <Card
                          key={event.id}
                          className={`cursor-pointer transition-all ${
                            selectedEvent?.id === event.id
                              ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "hover:shadow-lg"
                          }`}
                          onClick={() => {
                            setSelectedEvent(event);
                            setCurrentStep("template");
                          }}
                        >
                          <div className="aspect-video relative overflow-hidden rounded-t-lg">
                            <img
                              src={event.coverImage}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge
                                variant="secondary"
                                className="bg-white/90"
                              >
                                {event.category}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">
                              {event.title}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {event.date} at {event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {event.venue}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Up to {event.capacity} guests
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Template Selection */}
          {currentStep === "template" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#EB6F71]" />
                  Choose Invitation Template
                </CardTitle>
                <CardDescription>
                  Select from our collection of professional invitation
                  templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setCurrentStep("customize");
                      }}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-110"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className={
                              template.isPremium
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {template.isPremium ? "Premium" : "Free"}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white/90">
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {template.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {template.features.slice(0, 3).map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {template.arElements && (
                              <Camera className="w-4 h-4" />
                            )}
                            {template.nftIntegration && (
                              <Crown className="w-4 h-4" />
                            )}
                            {template.musicIntegration && (
                              <Music className="w-4 h-4" />
                            )}
                            {template.gamificationLevel && (
                              <Gamepad2 className="w-4 h-4" />
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("event")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("customize")}
                    disabled={!selectedTemplate}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Customize Template
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customization */}
          {currentStep === "customize" && selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customization Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-[#EB6F71]" />
                    Customize Your Invitation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Colors */}
                  <div>
                    <Label className="text-base font-medium">
                      Color Scheme
                    </Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[
                        ["#6366f1", "#8b5cf6"],
                        ["#ef4444", "#f97316"],
                        ["#10b981", "#06b6d4"],
                        ["#f59e0b", "#eab308"],
                      ].map((colors, index) => (
                        <div
                          key={index}
                          className={`aspect-square rounded-lg cursor-pointer ring-2 ${
                            JSON.stringify(customizations.colors) ===
                            JSON.stringify(colors)
                              ? "ring-gray-900"
                              : "ring-transparent"
                          }`}
                          style={{
                            background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
                          }}
                          onClick={() =>
                            setCustomizations((prev) => ({ ...prev, colors }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Features</Label>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Animations</span>
                      </div>
                      <Switch
                        checked={customizations.animations}
                        onCheckedChange={(checked) =>
                          setCustomizations((prev) => ({
                            ...prev,
                            animations: checked,
                          }))
                        }
                      />
                    </div>

                    {selectedTemplate.arElements && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>AR Experience</span>
                        </div>
                        <Switch
                          checked={customizations.arExperience}
                          onCheckedChange={(checked) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              arExperience: checked,
                            }))
                          }
                        />
                      </div>
                    )}

                    {selectedTemplate.nftIntegration && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          <span>NFT Pass Preview</span>
                        </div>
                        <Switch
                          checked={customizations.nftPassPreview}
                          onCheckedChange={(checked) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              nftPassPreview: checked,
                            }))
                          }
                        />
                      </div>
                    )}

                    {selectedTemplate.gamificationLevel && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4" />
                          <span>Gamification Elements</span>
                        </div>
                        <Switch
                          checked={customizations.gamificationElements}
                          onCheckedChange={(checked) =>
                            setCustomizations((prev) => ({
                              ...prev,
                              gamificationElements: checked,
                            }))
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Sustainability Badges</span>
                      </div>
                      <Switch
                        checked={customizations.sustainabilityBadges}
                        onCheckedChange={(checked) =>
                          setCustomizations((prev) => ({
                            ...prev,
                            sustainabilityBadges: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* AI Enhancement */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">AI Enhancement</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Let AI optimize your invitation design based on your event
                      type and audience
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Enhance with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                  <div className="flex gap-2">
                    {["desktop", "mobile", "ar", "nft"].map((mode) => (
                      <Button
                        key={mode}
                        size="sm"
                        variant={previewMode === mode ? "default" : "outline"}
                        onClick={() => setPreviewMode(mode as any)}
                        className="capitalize"
                      >
                        {mode}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-3/4 bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900 to-blue-900 rounded-lg p-6 relative overflow-hidden">
                    {/* Mock invitation preview */}
                    <div
                      className="w-full h-full rounded-lg shadow-lg relative"
                      style={{
                        background: `linear-gradient(135deg, ${customizations.colors[0]}, ${customizations.colors[1]})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 rounded-lg" />
                      <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {selectedEvent?.title || "Your Event"}
                          </h3>
                          <p className="text-white/90 text-sm mb-4">
                            {selectedEvent?.description ||
                              "Event description here..."}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {selectedEvent?.date || "Date"} at{" "}
                            {selectedEvent?.time || "Time"}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            {selectedEvent?.venue || "Venue"}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            className="bg-white text-gray-900 hover:bg-gray-100"
                          >
                            RSVP Now
                          </Button>
                          {customizations.arExperience && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white text-white hover:bg-white/20"
                            >
                              <Camera className="w-4 h-4 mr-1" />
                              AR
                            </Button>
                          )}
                        </div>

                        {/* Feature badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-1">
                          {customizations.nftPassPreview && (
                            <Badge className="bg-yellow-500">NFT</Badge>
                          )}
                          {customizations.gamificationElements && (
                            <Badge className="bg-green-500">Quest</Badge>
                          )}
                          {customizations.sustainabilityBadges && (
                            <Badge className="bg-blue-500">Eco</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === "guests" && <GuestManagement />}
          {currentStep === "preview" && (
            <PreviewInvitation
              setCurrentStep={setCurrentStep}
              event={selectedEvent}
              template={selectedTemplate}
              guests={guestList}
            />
          )}

          {/* Navigation Buttons */}
          {currentStep !== "event" && currentStep !== "template" && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  const steps = [
                    "event",
                    "template",
                    "customize",
                    "guests",
                    "preview",
                    "send",
                  ];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1] as any);
                  }
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  const steps = [
                    "event",
                    "template",
                    "customize",
                    "guests",
                    "preview",
                    "send",
                  ];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1] as any);
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
