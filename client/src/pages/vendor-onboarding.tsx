import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import {
  Upload,
  Check,
  Store,
  MapPin,
  DollarSign,
  Calendar,
  Shield,
} from "lucide-react";

const vendorOnboardingSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessLogo: z.string().url().optional().or(z.literal("")),
  businessDescription: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be 300 characters or less"),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  businessEmail: z.string().email("Valid email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  socialMediaHandles: z.string().optional(),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  serviceLocation: z.string().min(1, "Service location is required"),
  serviceRadius: z.number().min(0).optional(),
  willingToTravel: z.boolean().default(false),
  serviceDays: z.array(z.string()).min(1, "Select at least one service day"),
  minimumBookingFee: z.number().min(0, "Minimum booking fee must be 0 or more"),
  priceRangeMin: z.number().min(0, "Price range minimum must be 0 or more"),
  priceRangeMax: z.number().min(0, "Price range maximum must be 0 or more"),
  depositRequired: z.boolean().default(false),
  paymentMethods: z
    .array(z.string())
    .min(1, "Select at least one payment method"),
  portfolioImages: z.array(z.string()).optional(),
  promoVideo: z.string().url().optional().or(z.literal("")),
  reviewsLink: z.string().url().optional().or(z.literal("")),
  testimonials: z.string().optional(),
  calendarIntegration: z.string().optional(),
  businessLicense: z.string().url().optional().or(z.literal("")),
});

type VendorOnboardingForm = z.infer<typeof vendorOnboardingSchema>;

const vendorCategories = [
  // Beverage & Liquor Vendors
  { id: "liquor-stores", label: "Local Liquor Stores", icon: "🍾" },
  { id: "mobile-bartending", label: "Mobile Bartending Services", icon: "🍸" },
  { id: "alcohol-delivery", label: "Alcohol Delivery Services", icon: "🚚" },
  { id: "beverage-caterers", label: "Beverage Caterers", icon: "🥤" },
  { id: "specialty-drinks", label: "Specialty Drink Vendors", icon: "☕" },

  // Food Vendors & Caterers
  { id: "full-service-caterers", label: "Full-Service Caterers", icon: "🍽️" },
  { id: "food-trucks", label: "Food Trucks", icon: "🚛" },
  { id: "private-chefs", label: "Personal/Private Chefs", icon: "👨‍🍳" },
  { id: "grazing-tables", label: "Grazing Table Providers", icon: "🧀" },
  { id: "dessert-specialists", label: "Dessert Specialists", icon: "🎂" },
  { id: "snack-vendors", label: "Snack Vendors", icon: "🍿" },

  // Entertainment Providers
  { id: "djs", label: "DJs & Mobile DJ Services", icon: "🎵" },
  { id: "live-music", label: "Live Bands & Musicians", icon: "🎸" },
  { id: "karaoke-rentals", label: "Karaoke Machine Rentals", icon: "🎤" },
  { id: "av-technicians", label: "Audio/Visual Technicians", icon: "🔊" },
  { id: "party-hosts", label: "Party Hosts & MCs", icon: "🎭" },
  { id: "performers", label: "Magicians, Dancers, Comedians", icon: "🎪" },

  // Decor & Rentals
  { id: "event-decorators", label: "Event Decorators", icon: "🎈" },
  { id: "balloon-artists", label: "Balloon Artists", icon: "🎈" },
  { id: "furniture-rentals", label: "Table & Chair Rentals", icon: "🪑" },
  { id: "tent-rentals", label: "Tent & Canopy Rentals", icon: "⛺" },
  { id: "linen-rentals", label: "Linen & Tableware Rentals", icon: "🍽️" },
  {
    id: "flower-arrangements",
    label: "Flower Arrangement Vendors",
    icon: "🌸",
  },

  // Photo & Video
  { id: "photographers", label: "Event Photographers", icon: "📸" },
  { id: "videographers", label: "Videographers", icon: "🎥" },
  { id: "photo-booth-rentals", label: "Photo Booth Rentals", icon: "📷" },
  {
    id: "content-concierge",
    label: "Social Media Content Services",
    icon: "📱",
  },

  // Party Planners & Coordinators
  { id: "event-planners", label: "Full-Service Event Planners", icon: "📋" },
  { id: "themed-designers", label: "Themed Party Designers", icon: "🎨" },
  { id: "wedding-planners", label: "Wedding Planners", icon: "💒" },
  { id: "kids-coordinators", label: "Kids Party Coordinators", icon: "🎠" },
  { id: "corporate-managers", label: "Corporate Event Managers", icon: "🏢" },

  // Supplies & Party Favors
  { id: "party-supply-stores", label: "Party Supply Stores", icon: "🎁" },
  { id: "favor-boutiques", label: "Online Favor Boutiques", icon: "💝" },
  { id: "eco-suppliers", label: "Eco-Friendly Party Suppliers", icon: "🌱" },
  { id: "custom-print-shops", label: "Custom Print Shops", icon: "🖨️" },

  // Activities & Games
  { id: "bounce-house-rentals", label: "Bounce House Rentals", icon: "🏰" },
  { id: "game-rentals", label: "Game Rentals", icon: "🎯" },
  {
    id: "face-painting",
    label: "Face Painting & Caricature Artists",
    icon: "🎨",
  },
  { id: "craft-stations", label: "Craft Stations & DIY Booths", icon: "✂️" },

  // Logistics
  { id: "valet-parking", label: "Valet & Parking Attendants", icon: "🚗" },
  { id: "event-security", label: "Event Security", icon: "🛡️" },
  { id: "cleaning-crews", label: "Cleaning Crews", icon: "🧹" },
  { id: "delivery-drivers", label: "Delivery Drivers & Runners", icon: "🚚" },
  {
    id: "portable-restrooms",
    label: "Portable Restroom Providers",
    icon: "🚻",
  },

  // Local Vendor Market
  { id: "boutique-brands", label: "Boutique Alcohol Brands", icon: "🍷" },
  { id: "home-based-chefs", label: "Home-Based Bakers & Chefs", icon: "🏠" },
  {
    id: "cultural-services",
    label: "Cultural/Themed Service Providers",
    icon: "🌎",
  },
  {
    id: "minority-owned",
    label: "Minority/Women-Owned Businesses",
    icon: "⭐",
  },
];

const serviceDayOptions = [
  { id: "weekdays", label: "Weekdays" },
  { id: "weekends", label: "Weekends" },
  { id: "holidays", label: "Holidays" },
];

const paymentMethodOptions = [
  { id: "cash", label: "Cash" },
  { id: "credit", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "venmo", label: "Venmo" },
  { id: "zelle", label: "Zelle" },
];

const calendarOptions = [
  { id: "google", label: "Google Calendar" },
  { id: "outlook", label: "Outlook" },
  { id: "ical", label: "iCal" },
];

export default function VendorOnboarding() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<VendorOnboardingForm>({
    resolver: zodResolver(vendorOnboardingSchema),
    defaultValues: {
      businessName: "",
      businessLogo: "",
      businessDescription: "",
      websiteUrl: "",
      businessEmail: "",
      phoneNumber: "",
      socialMediaHandles: "",
      categories: [],
      serviceLocation: "",
      serviceRadius: 0,
      willingToTravel: false,
      serviceDays: [],
      minimumBookingFee: 0,
      priceRangeMin: 0,
      priceRangeMax: 0,
      depositRequired: false,
      paymentMethods: [],
      portfolioImages: [],
      promoVideo: "",
      reviewsLink: "",
      testimonials: "",
      calendarIntegration: "",
      businessLicense: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: VendorOnboardingForm) => {
      // Convert dollar amounts to cents for storage
      const processedData = {
        ...data,
        minimumBookingFee: Math.round(data.minimumBookingFee * 100),
        priceRangeMin: Math.round(data.priceRangeMin * 100),
        priceRangeMax: Math.round(data.priceRangeMax * 100),
        socialMediaHandles: data.socialMediaHandles || null,
        portfolioImages: data.portfolioImages || [],
      };

      const response = await apiRequest("POST", "/api/vendors", processedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description:
          "Your vendor application has been submitted successfully. You'll receive a confirmation email shortly.",
      });
      navigate("/vendors/dashboard");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VendorOnboardingForm) => {
    submitMutation.mutate(data);
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join Vibes as a Vendor
          </h1>
          <p className="text-xl text-white mb-6">
            Connect with party planners and grow your business on our platform
          </p>

          {/* Progress Bar */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= step
                      ? "bg-party-coral text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {i + 1 <= step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      i + 1 < step ? "bg-party-coral" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Business Information */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="mr-2 party-coral" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your business and how customers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Amazing DJ Services"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="info@amazing-dj.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Business Description * (max 300 characters)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Professional DJ services for weddings, parties, and corporate events..."
                            maxLength={300}
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <div className="text-sm text-gray-500">
                          {field.value?.length || 0}/300 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://amazing-dj.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Logo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/logo.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMediaHandles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Media Handles</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="@amazing_dj, /amazingdjservices"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Categories & Service Area */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 party-coral" />
                    Categories & Service Coverage
                  </CardTitle>
                  <CardDescription>
                    Select your service categories and coverage area
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Vendor Categories * (select all that apply)
                        </FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {vendorCategories.map((category) => (
                            <div
                              key={category.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                field.value?.includes(category.id)
                                  ? "border-party-coral bg-party-coral bg-opacity-10"
                                  : "border-gray-200 hover:border-party-coral"
                              }`}
                              onClick={() => {
                                const current = field.value || [];
                                if (current.includes(category.id)) {
                                  field.onChange(
                                    current.filter((id) => id !== category.id)
                                  );
                                } else {
                                  field.onChange([...current, category.id]);
                                }
                              }}
                            >
                              <div className="text-center">
                                <div className="text-2xl mb-1">
                                  {category.icon}
                                </div>
                                <div className="text-sm font-medium">
                                  {category.label}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="serviceLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Location *</FormLabel>
                          <FormControl>
                            <Input placeholder="New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Radius (miles)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="25"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="willingToTravel"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Willing to travel</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="serviceDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Days *</FormLabel>
                          <div className="flex flex-wrap gap-2">
                            {serviceDayOptions.map((option) => (
                              <Badge
                                key={option.id}
                                variant={
                                  field.value?.includes(option.id)
                                    ? "default"
                                    : "outline"
                                }
                                className={`cursor-pointer ${
                                  field.value?.includes(option.id)
                                    ? "bg-party-coral text-white"
                                    : "hover:bg-party-coral hover:text-white"
                                }`}
                                onClick={() => {
                                  const current = field.value || [];
                                  if (current.includes(option.id)) {
                                    field.onChange(
                                      current.filter((id) => id !== option.id)
                                    );
                                  } else {
                                    field.onChange([...current, option.id]);
                                  }
                                }}
                              >
                                {option.label}
                              </Badge>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Pricing & Booking */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="mr-2 party-coral" />
                    Pricing & Booking Information
                  </CardTitle>
                  <CardDescription>
                    Set your pricing structure and payment preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="minimumBookingFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Booking Fee * ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceRangeMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Range Min * ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="200"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceRangeMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Range Max * ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="2000"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? Number(e.target.value) : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="depositRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Deposit required for bookings</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accepted Payment Methods *</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {paymentMethodOptions.map((method) => (
                            <Badge
                              key={method.id}
                              variant={
                                field.value?.includes(method.id)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer ${
                                field.value?.includes(method.id)
                                  ? "bg-party-coral text-white"
                                  : "hover:bg-party-coral hover:text-white"
                              }`}
                              onClick={() => {
                                const current = field.value || [];
                                if (current.includes(method.id)) {
                                  field.onChange(
                                    current.filter((id) => id !== method.id)
                                  );
                                } else {
                                  field.onChange([...current, method.id]);
                                }
                              }}
                            >
                              {method.label}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 4: Portfolio & Verification */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 party-coral" />
                    Portfolio & Verification
                  </CardTitle>
                  <CardDescription>
                    Showcase your work and verify your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="reviewsLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Link to Reviews (Yelp, Google, etc.)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://yelp.com/biz/amazing-dj"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="promoVideo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Promo Video URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://youtube.com/watch?v=..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="testimonials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Testimonials</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share a quote from a satisfied client..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="calendarIntegration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calendar Integration (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select calendar type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {calendarOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessLicense"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business License URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/license.pdf"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-[#111827] text-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Terms & Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label htmlFor="terms">
                          I agree to Vibes Vendor Terms & Conditions
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verification" />
                        <label htmlFor="verification">
                          I verify business ownership or authorization
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                className="bg-white"
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Previous
              </Button>

              <div className="space-x-4">
                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-party-coral hover:bg-red-500 text-white"
                  >
                    {submitMutation.isPending
                      ? "Submitting..."
                      : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
