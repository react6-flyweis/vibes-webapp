import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useLocation } from "react-router";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Removed badge and separator imports as they're not essential
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Plus,
  X,
  ChefHat,
  Wine,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  User,
  Mail,
  MessageSquare,
  Share2,
  Music,
  Vote,
  Armchair,
  Send,
  Phone,
  Copy,
  QrCode,
  Heart,
  Star,
  Play,
  Pause,
  Volume2,
  UserPlus,
  Settings,
  Wifi,
  Bluetooth,
  Smartphone,
  Globe,
  Link,
  Crown,
  Sparkles,
  Zap,
  Camera,
  Video,
  Mic,
  Headphones,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple Badge component replacement
const Badge = ({ children, variant = "default", className = "" }: any) => (
  <div
    className={`px-2 py-1 rounded text-xs inline-flex items-center gap-1 ${
      variant === "secondary"
        ? "bg-white/20 text-white/80"
        : "bg-white/30 text-white"
    } ${className}`}
  >
    {children}
  </div>
);

// Schemas for menu and drink items
const menuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["appetizer", "main", "dessert", "sides"], {
    required_error: "Category is required",
  }),
  description: z.string().optional(),
  servings: z.string().optional(),
  estimatedCost: z.string().optional(),
  assignedTo: z.string().optional(),
});

const drinkItemSchema = z.object({
  name: z.string().min(1, "Drink name is required"),
  type: z.enum(["alcoholic", "non-alcoholic", "cocktail", "beer", "wine"], {
    required_error: "Drink type is required",
  }),
  quantity: z.string().optional(),
  estimatedCost: z.string().optional(),
  assignedTo: z.string().optional(),
});

// Additional schemas for comprehensive event planning
const guestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  dietary: z.array(z.string()).optional(),
  plusOne: z.boolean().optional(),
  rsvpStatus: z.enum(["pending", "confirmed", "declined"]).default("pending"),
  seatPreference: z.string().optional(),
});

const invitationSchema = z.object({
  template: z.string().min(1, "Template is required"),
  message: z.string().min(1, "Message is required"),
  sendVia: z
    .array(z.enum(["email", "whatsapp", "sms"]))
    .min(1, "Select at least one method"),
  scheduledTime: z.string().optional(),
});

const songSuggestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artist: z.string().min(1, "Artist is required"),
  genre: z.string().optional(),
  mood: z.string().optional(),
  requestedBy: z.string().optional(),
});

type MenuItemForm = z.infer<typeof menuItemSchema>;
type DrinkItemForm = z.infer<typeof drinkItemSchema>;
type GuestForm = z.infer<typeof guestSchema>;
type InvitationForm = z.infer<typeof invitationSchema>;
type SongSuggestionForm = z.infer<typeof songSuggestionSchema>;

export default function EventPlanning() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Menu and drinks management
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [showAddDrinkItem, setShowAddDrinkItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null);
  const [editingDrinkItem, setEditingDrinkItem] = useState<any>(null);

  // Guest management
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any>(null);
  const [guestSearchTerm, setGuestSearchTerm] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);

  // Invitation management
  const [showInvitationComposer, setShowInvitationComposer] = useState(false);
  const [invitationTemplate, setInvitationTemplate] = useState("elegant");
  const [invitationPreview, setInvitationPreview] = useState(false);

  // Seat selection
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [seatLayout, setSeatLayout] = useState("round-tables");

  // DJ booth and music
  const [showDJBooth, setShowDJBooth] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [songSuggestions, setSongSuggestions] = useState<any[]>([]);
  const [playlistMode, setPlaylistMode] = useState("auto");

  // Vibes Connect
  const [vibesConnectEnabled, setVibesConnectEnabled] = useState(true);
  const [liveVibeFeed, setLiveVibeFeed] = useState<any[]>([]);
  const [partyMood, setPartyMood] = useState("building");

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["/api/events", eventId],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: [`/api/events/${eventId}/menu-items`],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch drink items
  const { data: drinkItems = [], isLoading: drinkLoading } = useQuery({
    queryKey: [`/api/events/${eventId}/drink-items`],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch guests
  const { data: eventGuests = [] } = useQuery({
    queryKey: [`/api/events/${eventId}/guests`],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch seating
  const { data: seatingData } = useQuery({
    queryKey: [`/api/events/${eventId}/seating`],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch song requests
  const { data: songRequestsData = [] } = useQuery({
    queryKey: [`/api/events/${eventId}/songs/requests`],
    enabled: !!eventId,
    retry: false,
  });

  // Fetch vibes status
  const { data: vibesData } = useQuery({
    queryKey: [`/api/events/${eventId}/vibes/status`],
    enabled: !!eventId,
    retry: false,
  });

  // Menu item form
  const menuForm = useForm<MenuItemForm>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      category: "appetizer",
      description: "",
      servings: "",
      estimatedCost: "",
      assignedTo: "",
    },
  });

  // Drink item form
  const drinkForm = useForm<DrinkItemForm>({
    resolver: zodResolver(drinkItemSchema),
    defaultValues: {
      name: "",
      type: "non-alcoholic",
      quantity: "",
      estimatedCost: "",
      assignedTo: "",
    },
  });

  // Create menu item mutation
  const createMenuItemMutation = useMutation({
    mutationFn: (data: MenuItemForm) =>
      apiRequest("POST", `/api/events/${eventId}/menu-items`, data),
    onSuccess: () => {
      toast({
        title: "Menu Item Added",
        description: "Your menu item has been added successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "menu-items"],
      });
      menuForm.reset();
      setShowAddMenuItem(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add menu item",
        variant: "destructive",
      });
    },
  });

  // Create drink item mutation
  const createDrinkItemMutation = useMutation({
    mutationFn: (data: DrinkItemForm) =>
      apiRequest("POST", `/api/events/${eventId}/drink-items`, data),
    onSuccess: () => {
      toast({
        title: "Drink Item Added",
        description: "Your drink item has been added successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "drink-items"],
      });
      drinkForm.reset();
      setShowAddDrinkItem(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add drink item",
        variant: "destructive",
      });
    },
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MenuItemForm> }) =>
      apiRequest("PUT", `/api/menu-items/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Menu Item Updated",
        description: "Your menu item has been updated successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "menu-items"],
      });
      setEditingMenuItem(null);
    },
  });

  // Update drink item mutation
  const updateDrinkItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DrinkItemForm> }) =>
      apiRequest("PUT", `/api/drink-items/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Drink Item Updated",
        description: "Your drink item has been updated successfully!",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "drink-items"],
      });
      setEditingDrinkItem(null);
    },
  });

  // Delete mutations
  const deleteMenuItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/menu-items/${id}`),
    onSuccess: () => {
      toast({ title: "Menu item deleted successfully!" });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "menu-items"],
      });
    },
  });

  const deleteDrinkItemMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/drink-items/${id}`),
    onSuccess: () => {
      toast({ title: "Drink item deleted successfully!" });
      queryClient.invalidateQueries({
        queryKey: ["/api/events", eventId, "drink-items"],
      });
    },
  });

  // Fetch budget data with fallbacks
  const { data: budgetData } = useQuery({
    queryKey: [`/api/events/${eventId}/budget`],
    enabled: !!eventId,
    retry: false,
  });

  const { data: budgetSummaryData } = useQuery({
    queryKey: [`/api/events/${eventId}/budget/summary`],
    enabled: !!eventId,
    retry: false,
  });

  // Calculate budget summary with proper fallbacks
  const getBudgetSummary = () => {
    // Use API data if available, otherwise calculate from items
    if (budgetData) {
      return {
        total: budgetData.total || 2500,
        menu: budgetData.categories?.catering?.spent || 450,
        drinks: budgetData.categories?.drinks?.spent || 380,
        spent: budgetData.spent || 1850,
        remaining: budgetData.remaining || 650,
      };
    }

    if (budgetSummaryData) {
      return {
        total: budgetSummaryData.totalBudget || 2500,
        menu: 450, // fallback values
        drinks: 380,
        spent: budgetSummaryData.totalSpent || 1850,
        remaining: budgetSummaryData.remaining || 650,
      };
    }

    // Calculate from menu and drink items if available
    const menuCosts =
      menuItems?.reduce((total: number, item: any) => {
        return total + (parseInt(item.estimatedCost) || 0);
      }, 0) || 450;

    const drinkCosts =
      drinkItems?.reduce((total: number, item: any) => {
        return total + (parseInt(item.estimatedCost) || 0);
      }, 0) || 380;

    const totalCosts = menuCosts + drinkCosts + 1020; // venue + other costs

    return {
      total: totalCosts,
      menu: menuCosts,
      drinks: drinkCosts,
      spent: totalCosts - 650,
      remaining: 650,
    };
  };

  const onSubmitMenuItem = (data: MenuItemForm) => {
    if (editingMenuItem) {
      updateMenuItemMutation.mutate({ id: editingMenuItem.id, data });
    } else {
      createMenuItemMutation.mutate(data);
    }
  };

  const onSubmitDrinkItem = (data: DrinkItemForm) => {
    if (editingDrinkItem) {
      updateDrinkItemMutation.mutate({ id: editingDrinkItem.id, data });
    } else {
      createDrinkItemMutation.mutate(data);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  const budgetSummary = getBudgetSummary();

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white/60 hover:text-white mb-4"
          >
            ← Back to Dashboard
          </Button>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {event?.title || "Event Planning"}
                </h1>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event?.date} at {event?.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {event?.venue}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event?.guestCount || event?.maxCapacity} guests
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">
                  ${budgetSummary.total.toLocaleString()}
                </div>
                <div className="text-white/60 text-sm">Total Budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8 bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Users className="w-3 h-3 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              Guests
            </TabsTrigger>
            <TabsTrigger
              value="invitations"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Mail className="w-3 h-3 mr-1" />
              Invites
            </TabsTrigger>
            <TabsTrigger
              value="seats"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Armchair className="w-3 h-3 mr-1" />
              Seating
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <ChefHat className="w-3 h-3 mr-1" />
              Menu
            </TabsTrigger>
            <TabsTrigger
              value="drinks"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Wine className="w-3 h-3 mr-1" />
              Drinks
            </TabsTrigger>
            <TabsTrigger
              value="dj"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Music className="w-3 h-3 mr-1" />
              DJ Booth
            </TabsTrigger>
            <TabsTrigger
              value="vibes"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Vibes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Details */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-white/80">
                  <div>
                    <strong>Theme:</strong> {event?.theme || "Not specified"}
                  </div>
                  <div>
                    <strong>Budget:</strong> {event?.budget || "Not specified"}
                  </div>
                  <div>
                    <strong>Music:</strong>{" "}
                    {event?.musicPreferences || "Not specified"}
                  </div>
                  <div>
                    <strong>Special Requests:</strong>{" "}
                    {event?.specialRequests || "None"}
                  </div>
                </CardContent>
              </Card>

              {/* Menu Summary */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ChefHat className="h-5 w-5" />
                    Food Menu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{menuItems?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <span>${budgetSummary.menu.toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => setActiveTab("menu")}
                    className="w-full bg-white/20 hover:bg-white/30"
                  >
                    Manage Menu
                  </Button>
                </CardContent>
              </Card>

              {/* Drinks Summary */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wine className="h-5 w-5" />
                    Drinks Menu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{drinkItems?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Cost:</span>
                    <span>${budgetSummary.drinks.toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={() => setActiveTab("drinks")}
                    className="w-full bg-white/20 hover:bg-white/30"
                  >
                    Manage Drinks
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Dietary Restrictions */}
            {event?.dietaryRestrictions && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Dietary Restrictions & Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">{event.dietaryRestrictions}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <ChefHat className="h-6 w-6" />
                Food Menu Planning
              </h2>
              <Button
                onClick={() => setShowAddMenuItem(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>

            {/* Add/Edit Menu Item Form */}
            {(showAddMenuItem || editingMenuItem) && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...menuForm}>
                    <form
                      onSubmit={menuForm.handleSubmit(onSubmitMenuItem)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={menuForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Item Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Caesar Salad"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
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
                                  <SelectItem value="appetizer">
                                    Appetizer
                                  </SelectItem>
                                  <SelectItem value="main">
                                    Main Course
                                  </SelectItem>
                                  <SelectItem value="dessert">
                                    Dessert
                                  </SelectItem>
                                  <SelectItem value="sides">Sides</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuForm.control}
                          name="servings"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Servings
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Serves 8-10"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuForm.control}
                          name="estimatedCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Estimated Cost ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 25"
                                  type="number"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuForm.control}
                          name="assignedTo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Assigned To
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Who's making/bringing this?"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={menuForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Optional description or special instructions"
                                className="bg-white/10 border-white/20 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={
                            createMenuItemMutation.isPending ||
                            updateMenuItemMutation.isPending
                          }
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {editingMenuItem ? "Update Item" : "Add Item"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowAddMenuItem(false);
                            setEditingMenuItem(null);
                            menuForm.reset();
                          }}
                          className="text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Menu Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuLoading ? (
                <div className="col-span-full text-center text-white/60">
                  Loading menu items...
                </div>
              ) : menuItems?.length === 0 ? (
                <div className="col-span-full text-center text-white/60">
                  No menu items yet. Add your first item!
                </div>
              ) : (
                menuItems?.map((item: any) => (
                  <Card
                    key={item.id}
                    className="bg-white/10 backdrop-blur-md border-white/20"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">
                            {item.name}
                          </CardTitle>
                          <div className="mt-1 px-2 py-1 bg-white/20 rounded text-xs text-white/80 inline-block capitalize">
                            {item.category}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingMenuItem(item);
                              menuForm.reset(item);
                            }}
                            className="text-white/60 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              deleteMenuItemMutation.mutate(item.id)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-white/80 text-sm">
                      {item.description && <p>{item.description}</p>}
                      {item.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.servings}
                        </div>
                      )}
                      {item.estimatedCost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />$
                          {item.estimatedCost}
                        </div>
                      )}
                      {item.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.assignedTo}
                        </div>
                      )}
                      <Badge
                        variant={
                          item.status === "completed" ? "default" : "secondary"
                        }
                        className="mt-2"
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {item.status || "pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Drinks Tab */}
          <TabsContent value="drinks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wine className="h-6 w-6" />
                Drinks Menu Planning
              </h2>
              <Button
                onClick={() => setShowAddDrinkItem(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Drink Item
              </Button>
            </div>

            {/* Add/Edit Drink Item Form */}
            {(showAddDrinkItem || editingDrinkItem) && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editingDrinkItem
                      ? "Edit Drink Item"
                      : "Add New Drink Item"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...drinkForm}>
                    <form
                      onSubmit={drinkForm.handleSubmit(onSubmitDrinkItem)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={drinkForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Drink Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Tropical Punch"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drinkForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="non-alcoholic">
                                    Non-Alcoholic
                                  </SelectItem>
                                  <SelectItem value="alcoholic">
                                    Alcoholic
                                  </SelectItem>
                                  <SelectItem value="cocktail">
                                    Cocktail
                                  </SelectItem>
                                  <SelectItem value="beer">Beer</SelectItem>
                                  <SelectItem value="wine">Wine</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drinkForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Quantity
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 2 bottles, 1 gallon"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drinkForm.control}
                          name="estimatedCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Estimated Cost ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 15"
                                  type="number"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={drinkForm.control}
                          name="assignedTo"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-white">
                                Assigned To
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Who's bringing this drink?"
                                  className="bg-white/10 border-white/20 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={
                            createDrinkItemMutation.isPending ||
                            updateDrinkItemMutation.isPending
                          }
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {editingDrinkItem ? "Update Item" : "Add Item"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowAddDrinkItem(false);
                            setEditingDrinkItem(null);
                            drinkForm.reset();
                          }}
                          className="text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {/* Drink Items List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drinkLoading ? (
                <div className="col-span-full text-center text-white/60">
                  Loading drink items...
                </div>
              ) : drinkItems?.length === 0 ? (
                <div className="col-span-full text-center text-white/60">
                  No drink items yet. Add your first item!
                </div>
              ) : (
                drinkItems?.map((item: any) => (
                  <Card
                    key={item.id}
                    className="bg-white/10 backdrop-blur-md border-white/20"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white text-lg">
                            {item.name}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="mt-1 capitalize"
                          >
                            {item.type}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingDrinkItem(item);
                              drinkForm.reset(item);
                            }}
                            className="text-white/60 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              deleteDrinkItemMutation.mutate(item.id)
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-white/80 text-sm">
                      {item.quantity && (
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {item.quantity}
                        </div>
                      )}
                      {item.estimatedCost && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />$
                          {item.estimatedCost}
                        </div>
                      )}
                      {item.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.assignedTo}
                        </div>
                      )}
                      <Badge
                        variant={
                          item.status === "completed" ? "default" : "secondary"
                        }
                        className="mt-2"
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {item.status || "pending"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Budget Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    ${budgetSummary.total.toLocaleString()}
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    Estimated total cost
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Food Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">
                    ${budgetSummary.menu.toLocaleString()}
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    {menuItems?.length || 0} menu items
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Drinks Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-400">
                    ${budgetSummary.drinks.toLocaleString()}
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    {drinkItems?.length || 0} drink items
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Breakdown */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-white mb-2">
                    <span>Food ({menuItems?.length || 0} items)</span>
                    <span>${budgetSummary.menu.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{
                        width: budgetSummary.total
                          ? `${
                              (budgetSummary.menu / budgetSummary.total) * 100
                            }%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white mb-2">
                    <span>Drinks ({drinkItems?.length || 0} items)</span>
                    <span>${budgetSummary.drinks.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{
                        width: budgetSummary.total
                          ? `${
                              (budgetSummary.drinks / budgetSummary.total) * 100
                            }%`
                          : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests Management Tab */}
          <TabsContent value="guests" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Guest Management
                </CardTitle>
                <CardDescription className="text-white/80">
                  Manage event attendees, track RSVPs, and handle dietary
                  requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Input
                      placeholder="Search guests by name or email..."
                      value={guestSearchTerm}
                      onChange={(e) => setGuestSearchTerm(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                  <Button
                    onClick={() => setShowAddGuest(true)}
                    className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Guest
                  </Button>
                </div>

                {/* Guest List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(eventGuests.length > 0 ? eventGuests : mockGuestList).map(
                    (guest) => (
                      <div
                        key={guest.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">
                                {guest.name}
                              </h4>
                              <p className="text-white/60 text-sm">
                                {guest.email}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              guest.rsvpStatus === "confirmed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {guest.rsvpStatus}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          {guest.dietary?.map((diet) => (
                            <Badge
                              key={diet}
                              variant="secondary"
                              className="text-xs"
                            >
                              {diet}
                            </Badge>
                          ))}
                          {guest.plusOne && (
                            <Badge variant="secondary" className="text-xs">
                              +1
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-Invitations & Sharing
                </CardTitle>
                <CardDescription className="text-white/80">
                  Create beautiful invitations and share via WhatsApp, email,
                  and social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invitation Templates */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Choose Template</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {invitationTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            invitationTemplate === template.id
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-white/20 bg-white/5 hover:border-white/40"
                          }`}
                          onClick={() => setInvitationTemplate(template.id)}
                        >
                          <div className="aspect-square bg-linear-to-br from-purple-500 to-pink-500 rounded-md mb-2"></div>
                          <p className="text-white text-sm font-medium">
                            {template.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invitation Preview */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Preview</h3>
                    <div className="bg-white/5 rounded-lg p-6 min-h-[300px] border border-white/10">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-white text-xl font-bold">
                          You're Invited!
                        </h2>
                        <p className="text-white/80">
                          Jordan's 30th Birthday Celebration
                        </p>
                        <div className="space-y-2 text-white/60">
                          <p>📅 Saturday, March 15th at 8:00 PM</p>
                          <p>📍 The Rooftop Lounge, Downtown</p>
                          <p>🎉 Dress code: Cocktail attire</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sharing Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Share via WhatsApp
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="w-4 h-4 mr-2" />
                    Send via Email
                  </Button>
                  <Button className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seating Tab */}
          <TabsContent value="seats" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Armchair className="w-5 h-5" />
                  Seat Selection & Layout
                </CardTitle>
                <CardDescription className="text-white/80">
                  Design seating arrangements and let guests choose their
                  preferred spots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4 items-center">
                  <Select value={seatLayout} onValueChange={setSeatLayout}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-tables">Round Tables</SelectItem>
                      <SelectItem value="long-tables">Long Tables</SelectItem>
                      <SelectItem value="cocktail-style">
                        Cocktail Style
                      </SelectItem>
                      <SelectItem value="theater-style">
                        Theater Style
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setShowSeatMap(true)}
                    className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Layout
                  </Button>
                </div>

                {/* Seat Map Visualization */}
                <div className="bg-white/5 rounded-lg p-6 min-h-[400px] border border-white/10">
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-linear-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white font-medium">
                        DJ BOOTH / STAGE
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-full border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                            selectedSeat === `table-${i + 1}`
                              ? "border-purple-500 bg-purple-500/20 text-purple-200"
                              : "border-white/20 bg-white/5 text-white/60 hover:border-white/40"
                          }`}
                          onClick={() => setSelectedSeat(`table-${i + 1}`)}
                        >
                          T{i + 1}
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-white/80">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                        <span className="text-white/80">Reserved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-white/80">Occupied</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DJ Booth Tab */}
          <TabsContent value="dj" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  DJ Booth & Music Voting
                </CardTitle>
                <CardDescription className="text-white/80">
                  Manage playlist, take song requests, and let guests vote for
                  their favorites
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Now Playing */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Now Playing</h3>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Music className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">
                            Blinding Lights
                          </h4>
                          <p className="text-white/60">The Weeknd</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-white/20 rounded-full h-2">
                              <div className="bg-linear-to-r from-purple-500 to-pink-500 h-2 rounded-full w-1/3"></div>
                            </div>
                            <span className="text-white/60 text-sm">
                              1:23 / 3:45
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <Button
                          size="sm"
                          className="bg-white/10 hover:bg-white/20"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/10 hover:bg-white/20"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-white/10 hover:bg-white/20"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Song Requests */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Song Requests</h3>
                    <div className="space-y-3">
                      {(songRequestsData.length > 0
                        ? songRequestsData
                        : mockSongRequests
                      ).map((song) => (
                        <div
                          key={song.id}
                          className="bg-white/5 rounded-lg p-3 border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {song.title}
                              </h4>
                              <p className="text-white/60 text-xs">
                                {song.artist}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Heart className="w-3 h-3 mr-1" />
                                {song.votes}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-white/10 hover:bg-white/20"
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vibes Connect Tab */}
          <TabsContent value="vibes" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Vibes Connect & Live Experience
                </CardTitle>
                <CardDescription className="text-white/80">
                  Real-time party atmosphere monitoring and interactive features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Party Mood */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">Party Mood</h3>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white text-lg font-semibold">
                        {vibesData?.mood || "Energetic"}
                      </p>
                      <p className="text-white/60 text-sm">
                        Energy Level: {vibesData?.energy || 85}%
                      </p>
                    </div>
                  </div>

                  {/* Live Stats */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">Live Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Guests Present</span>
                        <span className="text-white">
                          {vibesData?.guestsPresent || 47}/
                          {vibesData?.totalGuests || 50}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Dance Floor</span>
                        <span className="text-white">
                          {vibesData?.danceFloorStatus || "Active"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Bar Queue</span>
                        <span className="text-white">
                          {vibesData?.barQueueStatus || "Light"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Camera className="w-4 h-4 mr-2" />
                        Group Photo
                      </Button>
                      <Button className="w-full bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                        <Video className="w-4 h-4 mr-2" />
                        Live Stream
                      </Button>
                      <Button className="w-full bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                        <Mic className="w-4 h-4 mr-2" />
                        Announcement
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Live Feed */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white font-medium mb-4">
                    Live Vibe Feed
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {mockLiveFeed.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.message}</p>
                          <p className="text-white/60 text-xs">
                            {item.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Mock data for new features
const mockGuestList = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    rsvpStatus: "confirmed",
    dietary: ["vegetarian"],
    plusOne: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    rsvpStatus: "pending",
    dietary: ["gluten-free"],
    plusOne: false,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma@example.com",
    rsvpStatus: "confirmed",
    dietary: [],
    plusOne: true,
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@example.com",
    rsvpStatus: "declined",
    dietary: ["vegan"],
    plusOne: false,
  },
];

const invitationTemplates = [
  { id: "elegant", name: "Elegant" },
  { id: "fun", name: "Fun & Colorful" },
  { id: "minimalist", name: "Minimalist" },
  { id: "vintage", name: "Vintage" },
];

const mockSongRequests = [
  { id: 1, title: "Good 4 U", artist: "Olivia Rodrigo", votes: 12 },
  { id: 2, title: "Levitating", artist: "Dua Lipa", votes: 8 },
  { id: 3, title: "Heat Waves", artist: "Glass Animals", votes: 15 },
  { id: 4, title: "Stay", artist: "The Kid LAROI & Justin Bieber", votes: 6 },
];

const mockLiveFeed = [
  { id: 1, message: "Sarah just arrived! 🎉", timestamp: "2 minutes ago" },
  {
    id: 2,
    message: 'Mike requested "Blinding Lights" 🎵',
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    message: "Emma posted a photo to the live wall 📸",
    timestamp: "8 minutes ago",
  },
  {
    id: 4,
    message: "Dance floor is getting crowded! 💃",
    timestamp: "12 minutes ago",
  },
];
