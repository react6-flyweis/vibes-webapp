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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useParams } from "react-router";
import {
  Ticket,
  CreditCard,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  Shield,
  CheckCircle,
  AlertTriangle,
  Gift,
  Coins,
  QrCode,
  Download,
  Share2,
  Bell,
  Heart,
  UserPlus,
  Smartphone,
} from "lucide-react";

interface TicketType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  available: number;
  maxPerUser: number;
  category: "general" | "vip" | "premium" | "early_bird";
}

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  image: string;
  organizer: string;
  category: string;
  rating: number;
  totalAttendees: number;
  ticketTypes: TicketType[];
  seatingChart?: string;
  policies: {
    refund: string;
    entry: string;
    ageRestriction?: string;
  };
}

interface BookingData {
  eventId: string;
  tickets: Array<{
    typeId: string;
    quantity: number;
    seatNumbers?: string[];
  }>;
  personalInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  paymentMethod: string;
  promoCode?: string;
  loyaltyPoints?: number;
}

export default function EventBooking() {
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [step, setStep] = useState<
    "tickets" | "seats" | "checkout" | "confirmation"
  >("tickets");

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: [`/api/events/booking/${eventId}`],
    enabled: !!eventId,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { data: seatingChart } = useQuery({
    queryKey: [`/api/events/seating/${eventId}`],
    enabled: !!eventId && step === "seats",
  });

  // Create booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData: BookingData) => {
      return await apiRequest("POST", "/api/events/book", bookingData);
    },
    onSuccess: (data) => {
      toast({
        title: "Booking Successful!",
        description:
          "Your tickets have been booked. Check your email for confirmation.",
      });
      setStep("confirmation");
      queryClient.invalidateQueries({ queryKey: ["/api/user/bookings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Apply promo code mutation
  const promoMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("POST", "/api/promo/validate", { code, eventId });
    },
    onSuccess: (data) => {
      toast({
        title: "Promo Code Applied",
        description: `${data.discount}% discount applied!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Promo Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTicketQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const calculateSubtotal = () => {
    if (!event) return 0;

    let subtotal = 0;
    Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
      const ticket = event.ticketTypes.find(
        (t: TicketType) => t.id === ticketId
      );
      if (ticket) {
        subtotal += ticket.price * quantity;
      }
    });

    return subtotal;
  };

  const calculateDiscount = () => {
    if (!promoMutation.data) return 0;
    return calculateSubtotal() * (promoMutation.data.discount / 100);
  };

  const calculatePlatformFee = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
    return subtotalAfterDiscount * 0.07; // 7% platform fee
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const platformFee = calculatePlatformFee();
    return subtotal - discount + platformFee;
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handleBooking = () => {
    const tickets = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([typeId, quantity]) => ({
        typeId,
        quantity,
        seatNumbers: selectedSeats.slice(0, quantity),
      }));

    const bookingData: BookingData = {
      eventId: eventId!,
      tickets,
      personalInfo,
      paymentMethod: "stripe",
      promoCode: promoCode || undefined,
      loyaltyPoints: usePoints ? userProfile?.loyaltyPoints : undefined,
    };

    bookingMutation.mutate(bookingData);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "general":
        return "text-blue-600 bg-blue-100";
      case "vip":
        return "text-purple-600 bg-purple-100";
      case "premium":
        return "text-gold-600 bg-yellow-100";
      case "early_bird":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-gray-300">
              The event you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { key: "tickets", label: "Select Tickets", icon: Ticket },
              { key: "seats", label: "Choose Seats", icon: MapPin },
              { key: "checkout", label: "Checkout", icon: CreditCard },
              { key: "confirmation", label: "Confirmation", icon: CheckCircle },
            ].map((stepItem, index) => {
              const IconComponent = stepItem.icon;
              const isActive = step === stepItem.key;
              const isCompleted =
                ["tickets", "seats", "checkout", "confirmation"].indexOf(step) >
                index;

              return (
                <div key={stepItem.key} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive
                        ? "border-blue-400 bg-blue-400"
                        : isCompleted
                        ? "border-green-400 bg-green-400"
                        : "border-gray-400 bg-transparent"
                    }`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      isActive ? "text-blue-400" : "text-gray-300"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                  {index < 3 && <div className="w-8 h-px bg-gray-400 ml-4" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Header */}
            <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-2xl font-bold">{event.title}</h1>
                  <p className="text-blue-100">{event.organizer}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            {step === "tickets" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Select Your Tickets
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Choose the ticket type and quantity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.ticketTypes?.map((ticket: TicketType) => (
                      <div
                        key={ticket.id}
                        className="p-4 border border-white/20 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">
                                {ticket.name}
                              </h3>
                              <Badge
                                className={getCategoryColor(ticket.category)}
                              >
                                {ticket.category.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-blue-100 text-sm mb-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {ticket.benefits.map((benefit, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">
                              ${ticket.price}
                              {ticket.originalPrice && (
                                <span className="text-sm text-gray-400 line-through ml-2">
                                  ${ticket.originalPrice}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-blue-100">
                              {ticket.available} available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Select
                            value={
                              selectedTickets[ticket.id]?.toString() || "0"
                            }
                            onValueChange={(value) =>
                              handleTicketQuantityChange(
                                ticket.id,
                                parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                {
                                  length: Math.min(
                                    ticket.maxPerUser + 1,
                                    ticket.available + 1
                                  ),
                                },
                                (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i === 0
                                      ? "None"
                                      : `${i} ticket${i > 1 ? "s" : ""}`}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          {selectedTickets[ticket.id] > 0 && (
                            <div className="text-green-400 font-semibold">
                              $
                              {(
                                ticket.price * selectedTickets[ticket.id]
                              ).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setStep("seats")}
                      disabled={getTotalTickets() === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Seat Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "seats" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Choose Your Seats
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Select {getTotalTickets()} seat(s) for your tickets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="bg-linear-to-b from-purple-600 to-purple-800 p-4 rounded text-center mb-4">
                      <h3 className="text-white font-semibold">STAGE</h3>
                    </div>

                    {/* Interactive Seat Map */}
                    <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
                      {Array.from({ length: 100 }, (_, i) => {
                        const seatNumber = `A${i + 1}`;
                        const isSelected = selectedSeats.includes(seatNumber);
                        const isOccupied = Math.random() > 0.7; // Simulate occupied seats

                        return (
                          <button
                            key={seatNumber}
                            onClick={() => {
                              if (isOccupied) return;

                              if (isSelected) {
                                setSelectedSeats((prev) =>
                                  prev.filter((s) => s !== seatNumber)
                                );
                              } else if (
                                selectedSeats.length < getTotalTickets()
                              ) {
                                setSelectedSeats((prev) => [
                                  ...prev,
                                  seatNumber,
                                ]);
                              }
                            }}
                            disabled={isOccupied}
                            className={`
                              w-6 h-6 rounded text-xs font-semibold transition-colors
                              ${
                                isOccupied
                                  ? "bg-red-500 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                              }
                            `}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-center gap-6 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Occupied</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setStep("tickets")}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Back to Tickets
                    </Button>
                    <Button
                      onClick={() => setStep("checkout")}
                      disabled={selectedSeats.length !== getTotalTickets()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "checkout" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Checkout</CardTitle>
                  <CardDescription className="text-blue-100">
                    Complete your booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="font-semibold text-white mb-4">
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-blue-100">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={personalInfo.firstName}
                            onChange={(e) =>
                              setPersonalInfo((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-blue-100">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={personalInfo.lastName}
                            onChange={(e) =>
                              setPersonalInfo((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-blue-100">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={personalInfo.email}
                            onChange={(e) =>
                              setPersonalInfo((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-blue-100">
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            value={personalInfo.phone}
                            onChange={(e) =>
                              setPersonalInfo((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div>
                      <h3 className="font-semibold text-white mb-4">
                        Promo Code
                      </h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                        />
                        <Button
                          onClick={() => promoMutation.mutate(promoCode)}
                          disabled={!promoCode || promoMutation.isPending}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>

                    {/* Loyalty Points */}
                    {userProfile?.loyaltyPoints > 0 && (
                      <div>
                        <h3 className="font-semibold text-white mb-4">
                          Loyalty Points
                        </h3>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="usePoints"
                            checked={usePoints}
                            onChange={(e) => setUsePoints(e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="usePoints" className="text-blue-100">
                            Use {userProfile.loyaltyPoints} loyalty points ($
                            {(userProfile.loyaltyPoints * 0.01).toFixed(2)}{" "}
                            value)
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep("seats")}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Back to Seats
                    </Button>
                    <Button
                      onClick={handleBooking}
                      disabled={
                        bookingMutation.isPending ||
                        !personalInfo.email ||
                        !personalInfo.firstName
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {bookingMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Complete Booking
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "confirmation" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Booking Confirmed!
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Your tickets have been booked successfully. You'll receive a
                    confirmation email shortly.
                  </p>

                  <div className="flex justify-center gap-4">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download Tickets
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Add to Wallet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(selectedTickets)
                    .filter(([_, quantity]) => quantity > 0)
                    .map(([ticketId, quantity]) => {
                      const ticket = event.ticketTypes.find(
                        (t: TicketType) => t.id === ticketId
                      );
                      if (!ticket) return null;

                      return (
                        <div key={ticketId} className="flex justify-between">
                          <div>
                            <div className="text-white font-medium">
                              {ticket.name}
                            </div>
                            <div className="text-blue-100 text-sm">
                              Qty: {quantity}
                            </div>
                          </div>
                          <div className="text-white font-semibold">
                            ${(ticket.price * quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}

                  {selectedSeats.length > 0 && (
                    <div className="pt-2 border-t border-white/20">
                      <div className="text-white font-medium mb-1">
                        Selected Seats
                      </div>
                      <div className="text-blue-100 text-sm">
                        {selectedSeats.join(", ")}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/20 space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount ({promoMutation.data?.discount}%)</span>
                        <span>-${calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-white">
                      <span>Platform Fee (7%)</span>
                      <span>${calculatePlatformFee().toFixed(2)}</span>
                    </div>

                    <div className="pt-2 border-t border-white/20">
                      <div className="flex justify-between text-lg font-semibold text-white">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  </div>
                </div>

                {/* Policies */}
                <div className="mt-4 text-xs text-blue-100">
                  <div className="flex items-center gap-1 mb-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure payment with Stripe</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    <span>Get notifications for updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
