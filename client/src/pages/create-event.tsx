import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Image,
  Plus,
  X,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const createEventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eventType: z.enum(["public_event", "private_planning"], {
    required_error: "Event type is required",
  }),
  category: z.string().min(1, "Category is required"),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.string().optional(),
  currency: z.string().optional(),
  maxCapacity: z.string().min(1, "Maximum capacity is required"),
  isPrivate: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
  image: z.string().optional(),
  tags: z.string().optional(),
  // Bank account information for public events with ticket sales
  bankAccountHolder: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  accountType: z.enum(["checking", "savings"]).optional(),

  // Event planning fields for private events
  budget: z.string().optional(),
  guestCount: z.string().optional(),
  specialRequests: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  theme: z.string().optional(),
  musicPreferences: z.string().optional(),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function CreateEvent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTicketTypes, setSelectedTicketTypes] = useState([
    { type: "General Admission", price: "", benefits: ["Entry to event"] },
  ]);
  const [eventType, setEventType] = useState<
    "public_event" | "private_planning" | ""
  >("");

  const form = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: undefined,
      category: "",
      venue: "",
      address: "",
      city: "",
      country: "",
      date: "",
      time: "",
      price: "",
      currency: "USD",
      maxCapacity: "",
      isPrivate: false,
      requiresApproval: false,
      image: "",
      tags: "",
      bankAccountHolder: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      accountType: "checking" as "checking" | "savings",

      // Event planning fields
      budget: "",
      guestCount: "",
      specialRequests: "",
      dietaryRestrictions: "",
      theme: "",
      musicPreferences: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/events", data),
    onSuccess: (response) => {
      toast({
        title: "Event Created Successfully!",
        description: "Ready to send immersive invitations to your guests.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });

      // Navigate to Interactive Live Vibes Invite system
      setTimeout(() => {
        setLocation("/interactive-live-vibes-invite");
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateEventForm) => {
    const eventData = {
      ...data,
      price: parseFloat(data.price),
      maxCapacity: parseInt(data.maxCapacity),
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      ticketTypes: selectedTicketTypes.map((ticket) => ({
        ...ticket,
        price: parseFloat(ticket.price) || 0,
        available: parseInt(data.maxCapacity),
      })),
      organizer: "Current User", // This would come from auth
      attendees: 0,
      rating: 0,
      featured: false,
      trending: false,
      soldOut: false,
    };
    createMutation.mutate(eventData);
  };

  const addTicketType = () => {
    setSelectedTicketTypes([
      ...selectedTicketTypes,
      { type: "", price: "", benefits: [""] },
    ]);
  };

  const removeTicketType = (index: number) => {
    setSelectedTicketTypes(selectedTicketTypes.filter((_, i) => i !== index));
  };

  const updateTicketType = (index: number, field: string, value: string) => {
    const updated = [...selectedTicketTypes];
    if (field === "benefits") {
      updated[index].benefits = value.split(",").map((b) => b.trim());
    } else {
      updated[index][field as keyof (typeof updated)[0]] = value;
    }
    setSelectedTicketTypes(updated);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white flex items-center gap-3">
              <Plus className="h-8 w-8 text-purple-400" />
              Create New Event
            </CardTitle>
            <p className="text-purple-100">Share your event with the world</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Event Type Selection */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Choose Event Type
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={`p-6 cursor-pointer transition-all ${
                        eventType === "public_event"
                          ? "bg-purple-500/30 border-purple-400 scale-105"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setEventType("public_event");
                        form.setValue("eventType", "public_event");
                      }}
                    >
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Public Ticketed Events
                        </h4>
                        <p className="text-purple-200 text-sm">
                          Concerts, festivals, shows, workshops with ticket
                          sales
                        </p>
                      </div>
                    </Card>

                    {/* <Card 
                      className={`p-6 cursor-pointer transition-all ${
                        eventType === "private_planning" 
                          ? "bg-pink-500/30 border-pink-400 scale-105" 
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setEventType("private_planning");
                        form.setValue("eventType", "private_planning");
                      }}
                    >
                      <div className="text-center">
                        <Users className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-white mb-2">Private Party Planning</h4>
                        <p className="text-purple-200 text-sm">Weddings, birthdays, corporate events, private celebrations</p>
                      </div>
                    </Card> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Event Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Amazing Event Name"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your event..."
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventType === "public_event" ? (
                                <>
                                  <SelectItem value="concert">
                                    Concert & Live Music
                                  </SelectItem>
                                  <SelectItem value="festival">
                                    Festival & Fair
                                  </SelectItem>
                                  <SelectItem value="workshop">
                                    Workshop & Class
                                  </SelectItem>
                                  <SelectItem value="conference">
                                    Conference & Seminar
                                  </SelectItem>
                                  <SelectItem value="comedy">
                                    Comedy Show
                                  </SelectItem>
                                  <SelectItem value="theater">
                                    Theater & Performance
                                  </SelectItem>
                                  <SelectItem value="sports">
                                    Sports Event
                                  </SelectItem>
                                  <SelectItem value="exhibition">
                                    Exhibition & Art Show
                                  </SelectItem>
                                  <SelectItem value="networking">
                                    Networking Event
                                  </SelectItem>
                                </>
                              ) : eventType === "private_planning" ? (
                                <>
                                  <SelectItem value="wedding">
                                    Wedding
                                  </SelectItem>
                                  <SelectItem value="birthday">
                                    Birthday Party
                                  </SelectItem>
                                  <SelectItem value="anniversary">
                                    Anniversary
                                  </SelectItem>
                                  <SelectItem value="graduation">
                                    Graduation Party
                                  </SelectItem>
                                  <SelectItem value="baby_shower">
                                    Baby Shower
                                  </SelectItem>
                                  <SelectItem value="corporate">
                                    Corporate Event
                                  </SelectItem>
                                  <SelectItem value="reunion">
                                    Family/School Reunion
                                  </SelectItem>
                                  <SelectItem value="holiday">
                                    Holiday Celebration
                                  </SelectItem>
                                  <SelectItem value="engagement">
                                    Engagement Party
                                  </SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="party">
                                    General Party
                                  </SelectItem>
                                  <SelectItem value="event">
                                    General Event
                                  </SelectItem>
                                </>
                              )}
                              <SelectItem value="virtual">Virtual</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Tags (comma separated)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="music, live, outdoor, family-friendly"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </h3>

                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Venue Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Madison Square Garden"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="4 Pennsylvania Plaza"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Country
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-96 overflow-y-auto">
                              <SelectItem value="united-states">
                                United States
                              </SelectItem>
                              <SelectItem value="canada">Canada</SelectItem>
                              <SelectItem value="united-kingdom">
                                United Kingdom
                              </SelectItem>
                              <SelectItem value="france">France</SelectItem>
                              <SelectItem value="germany">Germany</SelectItem>
                              <SelectItem value="italy">Italy</SelectItem>
                              <SelectItem value="spain">Spain</SelectItem>
                              <SelectItem value="netherlands">
                                Netherlands
                              </SelectItem>
                              <SelectItem value="belgium">Belgium</SelectItem>
                              <SelectItem value="switzerland">
                                Switzerland
                              </SelectItem>
                              <SelectItem value="austria">Austria</SelectItem>
                              <SelectItem value="sweden">Sweden</SelectItem>
                              <SelectItem value="norway">Norway</SelectItem>
                              <SelectItem value="denmark">Denmark</SelectItem>
                              <SelectItem value="finland">Finland</SelectItem>
                              <SelectItem value="ireland">Ireland</SelectItem>
                              <SelectItem value="portugal">Portugal</SelectItem>
                              <SelectItem value="greece">Greece</SelectItem>
                              <SelectItem value="poland">Poland</SelectItem>
                              <SelectItem value="czech-republic">
                                Czech Republic
                              </SelectItem>
                              <SelectItem value="hungary">Hungary</SelectItem>
                              <SelectItem value="croatia">Croatia</SelectItem>
                              <SelectItem value="slovenia">Slovenia</SelectItem>
                              <SelectItem value="slovakia">Slovakia</SelectItem>
                              <SelectItem value="estonia">Estonia</SelectItem>
                              <SelectItem value="latvia">Latvia</SelectItem>
                              <SelectItem value="lithuania">
                                Lithuania
                              </SelectItem>
                              <SelectItem value="australia">
                                Australia
                              </SelectItem>
                              <SelectItem value="new-zealand">
                                New Zealand
                              </SelectItem>
                              <SelectItem value="japan">Japan</SelectItem>
                              <SelectItem value="south-korea">
                                South Korea
                              </SelectItem>
                              <SelectItem value="china">China</SelectItem>
                              <SelectItem value="india">India</SelectItem>
                              <SelectItem value="singapore">
                                Singapore
                              </SelectItem>
                              <SelectItem value="thailand">Thailand</SelectItem>
                              <SelectItem value="malaysia">Malaysia</SelectItem>
                              <SelectItem value="indonesia">
                                Indonesia
                              </SelectItem>
                              <SelectItem value="philippines">
                                Philippines
                              </SelectItem>
                              <SelectItem value="vietnam">Vietnam</SelectItem>
                              <SelectItem value="brazil">Brazil</SelectItem>
                              <SelectItem value="argentina">
                                Argentina
                              </SelectItem>
                              <SelectItem value="chile">Chile</SelectItem>
                              <SelectItem value="colombia">Colombia</SelectItem>
                              <SelectItem value="peru">Peru</SelectItem>
                              <SelectItem value="mexico">Mexico</SelectItem>
                              <SelectItem value="south-africa">
                                South Africa
                              </SelectItem>
                              <SelectItem value="nigeria">Nigeria</SelectItem>
                              <SelectItem value="kenya">Kenya</SelectItem>
                              <SelectItem value="egypt">Egypt</SelectItem>
                              <SelectItem value="morocco">Morocco</SelectItem>
                              <SelectItem value="israel">Israel</SelectItem>
                              <SelectItem value="uae">
                                United Arab Emirates
                              </SelectItem>
                              <SelectItem value="saudi-arabia">
                                Saudi Arabia
                              </SelectItem>
                              <SelectItem value="turkey">Turkey</SelectItem>
                              <SelectItem value="russia">Russia</SelectItem>
                              <SelectItem value="ukraine">Ukraine</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            City/Town/Village
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your city, town, or village"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date, Time, and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-white/10 border-white/20 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-white/10 border-white/20 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxCapacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Max Capacity
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Pricing - Conditional based on event type */}
                {eventType === "public_event" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Starting Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="25.00"
                              className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">
                            Currency
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="JPY">JPY (¥)</SelectItem>
                              <SelectItem value="AUD">AUD (A$)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {eventType === "private_planning" && (
                  <div className="space-y-6">
                    <div className="bg-pink-500/20 border border-pink-400/30 rounded-lg p-6">
                      <h4 className="text-pink-200 font-semibold mb-2 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Private Event Planning Service
                      </h4>
                      <p className="text-pink-100 text-sm">
                        Complete the planning details below to help us create
                        your perfect event.
                      </p>
                    </div>

                    {/* Event Planning Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100 flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Budget Range
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="$5,000 - $10,000"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="guestCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Expected Guest Count
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="50-75 guests"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Theme or Style
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Elegant Garden Party, Rustic Chic, Modern Minimalist"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="musicPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Music Preferences
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Jazz, Classical, Top 40, Live Band"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        control={form.control}
                        name="dietaryRestrictions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Dietary Restrictions & Allergies
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Vegetarian options, nut allergies, gluten-free requirements..."
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Special Requests & Notes
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Photography needs, accessibility requirements, special decorations, entertainment preferences..."
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200 min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Bank Account Information - Only for public events */}
                {eventType === "public_event" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                      <CreditCard className="h-5 w-5 text-purple-300" />
                      <h3 className="text-xl font-semibold text-white">
                        Payment Information
                      </h3>
                    </div>
                    <p className="text-purple-200 text-sm">
                      Enter your bank account details to receive automatic
                      payouts from ticket sales. We take a 7% platform fee, and
                      you'll receive 93% of all sales directly to your account.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bankAccountHolder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Account Holder Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Bank Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Chase Bank"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Account Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="1234567890"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="routingNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Routing Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="021000021"
                                className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="accountType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">
                              Account Type
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="checking">
                                  Checking
                                </SelectItem>
                                <SelectItem value="savings">Savings</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Ticket Types - Only for public events */}
                {eventType === "public_event" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        Ticket Types
                      </h3>
                      <Button
                        type="button"
                        onClick={addTicketType}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ticket Type
                      </Button>
                    </div>

                    {selectedTicketTypes.map((ticket, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <Input
                          placeholder="Ticket type name"
                          value={ticket.type}
                          onChange={(e) =>
                            updateTicketType(index, "type", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        />
                        <Input
                          placeholder="Price"
                          type="number"
                          step="0.01"
                          value={ticket.price}
                          onChange={(e) =>
                            updateTicketType(index, "price", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        />
                        <Input
                          placeholder="Benefits (comma separated)"
                          value={ticket.benefits.join(", ")}
                          onChange={(e) =>
                            updateTicketType(index, "benefits", e.target.value)
                          }
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 border-red-500/40 text-red-200 hover:bg-red-500/30"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-100 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Event Image URL (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/event-image.jpg"
                          className="bg-white/10 border-white/20 text-white placeholder:text-purple-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interactive Live Vibes Invite Preview */}
                <div className="bg-linear-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Interactive Live Vibes Invite
                      </h3>
                      <p className="text-purple-200">
                        Create immersive invitations with 3D venue tours and
                        personalized videos
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        🎬
                      </div>
                      <p className="text-sm text-purple-200">Personal Videos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        🏢
                      </div>
                      <p className="text-sm text-purple-200">3D Venue Tour</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        🎵
                      </div>
                      <p className="text-sm text-purple-200">Music Preview</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-500/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        🎁
                      </div>
                      <p className="text-sm text-purple-200">VIP Perks</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    // onClick={() => setLocation("/interactive-live-vibes-invite")}
                    className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    Preview Immersive Invitations →
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/event-discovery")}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Link href="/enhanced-event/1">
                    <Button
                      type="button" // change from submit since it’s navigation, not form submit
                      className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                    >
                      Create Event & Send Invites
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
