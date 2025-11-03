import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChefHat, Search, Utensils, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCateringMarketplacesQuery } from "@/queries/cateringMarketplaces";
import { useCreateCateringBooking } from "@/queries/cateringBookings";
import { useCreateCateringBookingPayment } from "@/mutations/useCreateCateringBookingPayment";
import CateringCategorySelector from "@/components/CateringCategorySelector";
import CateringVendorCard from "@/components/CateringVendorCard";
import EventDetailsDialog from "@/components/EventDetailsDialog";
import MenuServicesDialog from "@/components/MenuServicesDialog";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import BookedSuccessDialog from "@/components/BookedSuccessDialog";

interface CateringMenu {
  id: string;
  name: string;
  chef: string;
  cuisine: string;
  category: string;
  pricePerPerson: number;
  minOrder: number;
  servings: string[];
  description: string;
  items: string[];
  dietary: string[];
  rating: number;
  reviews: number;
  availability: string[];
  preparationTime: string;
  location: string;
  image: string;
  featured: boolean;
}

export default function CateringMarketplace() {
  const bookingMutation = useCreateCateringBooking({
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: "Complete your payment to confirm the booking.",
      });
    },
    onError: (err) => {
      toast({
        title: "Booking Error",
        description: String(err),
        variant: "destructive",
      });
    },
  });

  const createCateringBookingPaymentMutation =
    useCreateCateringBookingPayment();

  const [pendingPayment, setPendingPayment] = useState<any | null>(null);
  const [bookedDialogOpen, setBookedDialogOpen] = useState(false);
  const [bookedInfo, setBookedInfo] = useState<any | null>(null);

  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<CateringMenu | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    eventDate: "",
    guestCount: "",
    servingType: "",
    dietaryRequests: "",
    deliveryAddress: "",
    specialInstructions: "",
  });

  const { data: marketplaces = [], isLoading: isLoadingMarketplaces } =
    useCateringMarketplacesQuery();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [menuInitialValues, setMenuInitialValues] = useState<any>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<{
    guestCount: number;
    pricePerPerson: number;
  } | null>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [menuDetails, setMenuDetails] = useState<any>(null);

  const handleMenuSubmit = (vals: any) => {
    const guestCount =
      parseInt(eventDetails?.guestCount || vals.guestCount || "0") || 0;
    const pricePerPerson = parseFloat(vals.pricePerPerson || "0") || 0;
    setMenuDetails(vals);
    setConfirmPayload({ guestCount, pricePerPerson });
    setMenuDialogOpen(false);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async (payment?: any) => {
    setConfirmDialogOpen(false);

    const vendorName =
      marketplaces.find((m: any) => m._id === activeVendorId)?.name || null;
    const menuName = menuDetails?.name || selectedMenu?.name || null;
    const guests =
      (confirmPayload && confirmPayload.guestCount) ||
      eventDetails?.guestCount ||
      null;
    const price =
      (confirmPayload && confirmPayload.pricePerPerson) ||
      menuDetails?.pricePerPerson ||
      null;
    const total =
      (pendingPayment &&
        pendingPayment.transaction &&
        pendingPayment.transaction.amount) ||
      (guests && price ? Number(guests) * Number(price) : null) ||
      null;

    setBookedInfo({
      vendorName,
      menuName,
      guestCount: guests,
      pricePerPerson: price,
      totalAmount: total,
      date: eventDetails?.startDate || eventDetails?.eventDate || null,
      time:
        (eventDetails &&
          `${eventDetails.startTime || "8 PM"} - ${
            eventDetails.endTime || "10 PM"
          }`) ||
        null,
    });
    console.debug("[Catering] bookedInfo (confirm):", {
      vendorName,
      menuName,
      guestCount: guests,
      pricePerPerson: price,
      totalAmount: total,
      date: eventDetails?.startDate || eventDetails?.eventDate || null,
    });
    setBookedDialogOpen(true);

    setEventDetails(null);
    setMenuDetails(null);
    setConfirmPayload(null);
    setPendingPayment(null);
  };

  const handleMethodSelect = async (method: number) => {
    // Ensure booking exists, then create payment intent for it
    if (!activeVendorId || !eventDetails || !menuDetails || !confirmPayload) {
      throw new Error("Missing booking data");
    }

    // Use a local variable so we can update it after creating a booking
    let bookingResponse = pendingPayment;
    try {
      if (!bookingResponse) {
        const payload = {
          event_name: eventDetails.eventName || "",
          event_address: eventDetails.eventAddress || "",
          event_type_id:
            typeof eventDetails.eventType === "number"
              ? eventDetails.eventType
              : 1,
          catering_marketplace_id: Number(activeVendorId) || 0,
          event_to_date:
            eventDetails.endDate ||
            eventDetails.startDate ||
            new Date().toISOString(),
          event_from_date: eventDetails.startDate || new Date().toISOString(),
          event_to_time: eventDetails.endTime || "23:00",
          event_from_time: eventDetails.startTime || "18:00",
          guest_count: confirmPayload.guestCount || 0,
          amount: Math.round(
            (confirmPayload.guestCount || 0) *
              (confirmPayload.pricePerPerson || 0)
          ),
        };

        const res = await bookingMutation.mutateAsync(payload);
        console.log(res);
        bookingResponse = res.data;
        setPendingPayment(res.data);

        const returnedAmount = bookingResponse?.transaction?.amount ?? 0;
        if (returnedAmount && (confirmPayload?.guestCount || 0) > 0) {
          const computedPricePerPerson =
            returnedAmount / (confirmPayload!.guestCount || 1);
          setMenuDetails((md: any) => ({
            ...(md || {}),
            pricePerPerson: computedPricePerPerson,
          }));
          setConfirmPayload((cp) => ({
            guestCount:
              (cp && cp.guestCount) || confirmPayload!.guestCount || 0,
            pricePerPerson: computedPricePerPerson,
          }));
        }
      }

      const bookingId =
        bookingResponse?.booking?.catering_marketplace_booking_id;

      if (!bookingId) {
        throw new Error("Missing booking id from server response");
      }

      const paymentRes = await createCateringBookingPaymentMutation.mutateAsync(
        {
          catering_marketplace_booking_id: Number(bookingId),
          payment_method_id: method,
          billingDetails: "CateringBooking",
        }
      );

      // follow the staff pattern: return paymentIntent located at data.data.paymentIntent
      return paymentRes.data.data.paymentIntent;
    } catch (err) {
      console.error("Failed to create booking/payment intent:", err);
      throw err;
    }
  };

  const calculateOrderCost = () => {
    if (!selectedMenu || !orderDetails.guestCount) return 0;

    const guestCount = parseInt(orderDetails.guestCount);
    const subtotal = guestCount * selectedMenu.pricePerPerson;
    const platformFee = subtotal * 0.15;

    return subtotal + platformFee;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleCategoryChange = (value: string) => setSelectedCategory(value);

  const handleCuisineChange = (value: string) => setSelectedCuisine(value);

  const handleDialogClose = () => setDialogOpen(false);

  const handleMenuClose = () => setMenuDialogOpen(false);

  const handleConfirmOpenChange = (open: boolean) => setConfirmDialogOpen(open);

  const handleServingTypeChange = (value: string) =>
    setOrderDetails((prev) => ({ ...prev, servingType: value }));

  const handleOrderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement & { name: string };
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target as HTMLTextAreaElement & { name: string };
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelOrder = () => setSelectedMenu(null);

  const handleBookedDone = () => {
    setBookedDialogOpen(false);
    setBookedInfo(null);
    setActiveVendorId(null);
    setPendingPayment(null);
    setConfirmPayload(null);
    setSelectedMenu(null);
    setOrderDetails({
      eventDate: "",
      guestCount: "",
      servingType: "",
      dietaryRequests: "",
      deliveryAddress: "",
      specialInstructions: "",
    });
  };

  // Ensure bookedInfo is populated when the dialog is opened from any flow.
  useEffect(() => {
    if (bookedDialogOpen && !bookedInfo) {
      const vendorName =
        marketplaces.find((m: any) => m._id === activeVendorId)?.name || null;
      const menuName =
        (menuDetails && (menuDetails.name || menuDetails.menuName)) ||
        (selectedMenu && selectedMenu.name) ||
        null;
      const guestCount =
        (confirmPayload && confirmPayload.guestCount) ||
        eventDetails?.guestCount ||
        orderDetails?.guestCount ||
        null;
      const pricePerPerson =
        (menuDetails && menuDetails.pricePerPerson) ||
        (confirmPayload && confirmPayload.pricePerPerson) ||
        (selectedMenu && selectedMenu.pricePerPerson) ||
        null;
      const totalAmount =
        guestCount && pricePerPerson
          ? Number(guestCount) * Number(pricePerPerson)
          : null;

      const info = {
        vendorName,
        menuName,
        guestCount,
        pricePerPerson,
        totalAmount,
        date:
          eventDetails?.startDate ||
          eventDetails?.eventDate ||
          orderDetails?.eventDate ||
          null,
        time:
          (eventDetails &&
            `${eventDetails.startTime || "8 PM"} - ${
              eventDetails.endTime || "10 PM"
            }`) ||
          null,
      };
      console.debug("[Catering] populate bookedInfo from effect:", info);
      setBookedInfo(info);
    }
  }, [bookedDialogOpen]);

  const filteredMarketplaces = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    return (marketplaces || []).filter((m: any) => {
      if (!m) return false;

      // Category filter: support numeric or string category ids
      if (selectedCategory && selectedCategory !== "all") {
        const vendorCat =
          m.catering_marketplace_category_id ??
          m.catering_marketplace_category?._id ??
          null;
        if (vendorCat == null) return false;
        if (
          String(vendorCat) !== String(selectedCategory) &&
          String(Number(selectedCategory)) !== String(vendorCat)
        ) {
          return false;
        }
      }

      // Cuisine filter (if vendor exposes cuisine)
      if (selectedCuisine && selectedCuisine !== "all") {
        const vendorCuisine = (m.cuisine || m.cuisines || "")
          .toString()
          .toLowerCase();
        if (!vendorCuisine.includes(selectedCuisine.toLowerCase()))
          return false;
      }

      // Search across name, address, phone
      if (q) {
        const hay = `${m.name || ""} ${m.address || ""} ${
          m.mobile_no || ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [marketplaces, searchQuery, selectedCategory, selectedCuisine]);

  const handleBookClick = (vendorId: string) => {
    setActiveVendorId(vendorId);
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (payload: any) => {
    console.log("handleDialogSubmit payload:", payload);
    // When users submit event details, create a booking on the server
    if (!activeVendorId) {
      toast({
        title: "Missing vendor",
        description: "Please select a vendor before requesting booking.",
        variant: "destructive",
      });
      return;
    }

    const bookingPayload = {
      event_name: payload.eventName || "",
      event_address: payload.eventAddress || "",
      event_type_id: 1,
      catering_marketplace_id: Number(activeVendorId),
      event_to_date:
        payload.endDate || payload.startDate || new Date().toISOString(),
      event_from_date: payload.startDate || new Date().toISOString(),
      event_to_time: "23:00",
      event_from_time: "18:00",
      guest_count: Number(payload.guestCount) || 0,
      // amount: Number(payload.amount) || 0,
    };

    try {
      const res = await bookingMutation.mutateAsync(bookingPayload);
      const bookingResponse = res?.data;

      setPendingPayment(bookingResponse);

      const returnedAmount = bookingResponse.transaction.amount || 0;

      // compute a per-person price if guest_count is available
      const guestCount = Number(payload.guestCount) || 0;
      const pricePerPerson = guestCount > 0 ? returnedAmount / guestCount : 0;

      // Close details dialog and open the price/payment confirmation dialog
      setDialogOpen(false);
      setEventDetails(payload);
      // provide menuDetails with returned pricePerPerson so UI shows correct estimate
      setMenuDetails({ pricePerPerson });
      // set a confirm payload using guest count and returned pricePerPerson
      setConfirmPayload({ guestCount, pricePerPerson });
      // open the confirmation / payment dialog
      setConfirmDialogOpen(true);
    } catch (err) {
      // bookingMutation.onError will show toast; keep dialog open for retry
      console.error(
        "Failed to create catering booking on details submit:",
        err
      );
    }
    // keep activeVendorId until menu dialog completes
  };

  // const orderMutation = useMutation({
  //   mutationFn: async (orderData: any) => {
  //     return await apiRequest("POST", "/api/catering/orders", orderData);
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Order Placed Successfully",
  //       description: "The caterer will confirm your order within 24 hours.",
  //     });
  //     setSelectedMenu(null);
  //     queryClient.invalidateQueries({ queryKey: ["/api/catering/orders"] });
  //   },
  //   onError: (error: any) => {
  //     toast({
  //       title: "Order Failed",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });

  const handleOrder = async () => {
    if (!selectedMenu) return;

    // require a vendor id (activeVendorId should be set when user opened vendor menus)
    if (!activeVendorId) {
      toast({
        title: "Select vendor",
        description:
          "Please start your order from a vendor page so we know which caterer to contact.",
        variant: "destructive",
      });
      return;
    }

    const guestCount = parseInt(orderDetails.guestCount || "0") || 0;
    if (guestCount === 0) {
      toast({
        title: "Invalid guest count",
        description: "Please enter a valid number of guests.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      event_name: `Order: ${selectedMenu.name}`,
      event_address:
        orderDetails.deliveryAddress || selectedMenu.location || "",
      event_type_id: 1,
      catering_marketplace_id: Number(activeVendorId) || 0,
      event_to_date: orderDetails.eventDate || new Date().toISOString(),
      event_from_date: orderDetails.eventDate || new Date().toISOString(),
      event_to_time: "23:00",
      event_from_time: "18:00",
      guest_count: guestCount,
      amount: Math.round(guestCount * (selectedMenu.pricePerPerson || 0)),
    };

    // call booking API via react-query mutateAsync so we can await it
    try {
      await bookingMutation.mutateAsync(payload as any);
      // prepare bookedInfo from local state and show popup (server does not return menu details)
      const vendorName =
        marketplaces.find((m: any) => m._id === activeVendorId)?.name || null;
      const menuName = selectedMenu?.name || null;
      const guests = guestCount || orderDetails.guestCount || null;
      const price = selectedMenu?.pricePerPerson || null;
      const total = guests && price ? Number(guests) * Number(price) : null;

      setBookedInfo({
        vendorName,
        menuName,
        guestCount: guests,
        pricePerPerson: price,
        totalAmount: total,
        date: orderDetails.eventDate || null,
        time: null,
      });
      console.debug("[Catering] setBookedInfo (order):", {
        vendorName,
        menuName,
        guestCount: guests,
        pricePerPerson: price,
        totalAmount: total,
        date: orderDetails.eventDate || null,
      });
      setBookedDialogOpen(true);

      // clear local selection
      setSelectedMenu(null);
    } catch (err) {
      // onError provided to the hook will already show a toast; log for debugging
      console.error("Catering booking failed:", err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "appetizers":
        return <Utensils className="h-4 w-4" />;
      case "main-course":
        return <ChefHat className="h-4 w-4" />;
      case "desserts":
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Catering Marketplace
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Discover amazing catering menus from top chefs. From intimate
            dinners to grand celebrations.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-5xl mx-auto">
          <Card className="bg-white backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 " />
                    <Input
                      placeholder="Search menus, chefs, or dishes..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10  "
                    />
                  </div>
                </div>
                <CateringCategorySelector
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                />
                <Select
                  value={selectedCuisine}
                  onValueChange={handleCuisineChange}
                >
                  <SelectTrigger className="w-48 ">
                    <SelectValue placeholder="Cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Catering Vendors / Marketplaces */}
        <div className="mb-8 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Catering Vendors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingMarketplaces ? (
              [1, 2, 3].map((i) => (
                <CateringVendorCard
                  key={`vendor-skel-${i}`}
                  skeleton
                  onBook={handleBookClick}
                />
              ))
            ) : filteredMarketplaces.length === 0 ? (
              <div className="col-span-full text-center text-orange-200 p-6 bg-white/5 rounded-md">
                No vendors found. Try a different search or clear filters.
              </div>
            ) : (
              filteredMarketplaces.map((vendor: any) => (
                <CateringVendorCard
                  key={vendor._id}
                  vendor={vendor}
                  onBook={handleBookClick}
                />
              ))
            )}
          </div>
        </div>

        <EventDetailsDialog
          open={dialogOpen}
          vendorName={
            marketplaces.find((m: any) => m._id === activeVendorId)?.name
          }
          vendorPhone={
            marketplaces.find((m: any) => m._id === activeVendorId)?.mobile_no
          }
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />

        {/* <MenuServicesDialog
          open={menuDialogOpen}
          initial={menuInitialValues}
          onBack={() => setDialogOpen(true)}
          onClose={() => setMenuDialogOpen(false)}
          onSubmit={handleMenuSubmit}
        /> */}

        <PriceConfirmationDialog
          open={confirmDialogOpen}
          onOpenChange={handleConfirmOpenChange}
          priceEstimate={parseFloat(
            (
              (confirmPayload?.guestCount || 0) *
              (confirmPayload?.pricePerPerson || 0) *
              1.15
            ).toFixed(2)
          )}
          onConfirm={(payment) => handleConfirm(payment)}
          onPrevious={() => {
            // go back to menu dialog
            setConfirmDialogOpen(false);
            setMenuDialogOpen(true);
          }}
          onMethodSelect={handleMethodSelect}
        />

        <BookedSuccessDialog
          open={bookedDialogOpen}
          info={bookedInfo}
          onDone={() => {
            setBookedDialogOpen(false);
            setBookedInfo(null);
            setActiveVendorId(null);
            setPendingPayment(null);
            setConfirmPayload(null);
            setSelectedMenu(null);
            setOrderDetails({
              eventDate: "",
              guestCount: "",
              servingType: "",
              dietaryRequests: "",
              deliveryAddress: "",
              specialInstructions: "",
            });
          }}
        />

        {/* Order Modal */}
        {selectedMenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Order {selectedMenu.name}
                </CardTitle>
                <p className="text-orange-200">
                  by Chef {selectedMenu.chef} • ${selectedMenu.pricePerPerson}
                  /person
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Menu Items</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedMenu.items.map((item, index) => (
                      <div key={index} className="text-orange-200 text-sm">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Event Date
                    </label>
                    <Input
                      type="date"
                      name="eventDate"
                      value={orderDetails.eventDate}
                      onChange={handleOrderInputChange}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Number of Guests
                    </label>
                    <Input
                      type="number"
                      name="guestCount"
                      placeholder={`Minimum ${selectedMenu.minOrder}`}
                      value={orderDetails.guestCount}
                      onChange={handleOrderInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                    />
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Serving Style
                    </label>
                    <Select
                      value={orderDetails.servingType}
                      onValueChange={handleServingTypeChange}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select serving style" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMenu.servings.map((serving) => (
                          <SelectItem key={serving} value={serving}>
                            {serving}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-orange-100 text-sm font-medium">
                      Delivery Address
                    </label>
                    <Input
                      name="deliveryAddress"
                      placeholder="Event venue address"
                      value={orderDetails.deliveryAddress}
                      onChange={handleOrderInputChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-orange-100 text-sm font-medium">
                    Dietary Restrictions
                  </label>
                  <Input
                    name="dietaryRequests"
                    placeholder="Any allergies or dietary requirements..."
                    value={orderDetails.dietaryRequests}
                    onChange={handleOrderInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                  />
                </div>

                <div>
                  <label className="text-orange-100 text-sm font-medium">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    placeholder="Any special requests or setup instructions..."
                    value={orderDetails.specialInstructions}
                    onChange={handleOrderTextareaChange}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-orange-200 resize-none h-20"
                  />
                </div>

                {orderDetails.guestCount &&
                  parseInt(orderDetails.guestCount) >=
                    selectedMenu.minOrder && (
                    <div className="p-4 bg-orange-500/20 rounded-lg border border-orange-300/30">
                      <div className="space-y-2">
                        <div className="flex justify-between text-white">
                          <span>
                            Subtotal ({orderDetails.guestCount} guests):
                          </span>
                          <span>
                            $
                            {(
                              parseInt(orderDetails.guestCount) *
                              selectedMenu.pricePerPerson
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-orange-200">
                          <span>Platform fee (15%):</span>
                          <span>
                            $
                            {(
                              parseInt(orderDetails.guestCount) *
                              selectedMenu.pricePerPerson *
                              0.15
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-white font-semibold border-t border-orange-300/30 pt-2">
                          <span>Total:</span>
                          <span>${calculateOrderCost().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelOrder}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleOrder}
                    disabled={
                      !orderDetails.guestCount ||
                      parseInt(orderDetails.guestCount) < selectedMenu.minOrder
                    }
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {/* {orderMutation.isPending
                      ? "Placing Order..."
                      : "Place Order"} */}
                    Place Order
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
