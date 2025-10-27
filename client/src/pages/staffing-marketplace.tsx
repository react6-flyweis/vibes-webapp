import { useState } from "react";
import { useCreateStaffBookingMutation } from "@/mutations/createStaffBooking";
import { useCreateStaffBookingPayment } from "@/mutations/useCreateStaffBookingPayment";
import { useStaffByRoleQuery, StaffUser } from "@/queries/staffing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import StaffCategorySelector from "@/components/StaffCategorySelector";
import StaffShiftDialog from "@/components/StaffShiftDialog";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import { Search, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  eventType: string;
  date: string;
}

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
  profileImage?: string;
  experience?: string;
  verified?: boolean;
  portfolio?: string[];
  availableDates?: string[];
  reviews?: Review[];
  mobile?: string;
  reviewsCount?: number;
}

export default function EnhancedStaffingMarketplace() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const [showShiftDialog, setShowShiftDialog] = useState(false);

  const { data: staffUsers, isLoading } = useStaffByRoleQuery(4);

  const staffMembers: StaffMember[] =
    staffUsers?.map((u: StaffUser) => {
      const workingPrice = u.staff_details?.working_prices?.[0];
      return {
        id: u.user_id,
        name: u.name,
        category:
          workingPrice?.category_details?.name?.toLowerCase() || "staff",
        specialties: workingPrice?.category_details
          ? [workingPrice.category_details.name]
          : [],
        rating: workingPrice?.review_count ?? 0,
        totalJobs: u.staff_details?.total_bookings ?? 0,
        hourlyRate: (workingPrice?.price ?? 0) / 100,
        location: u.city_details?.name || "",
        availability: [],
        profileImage: undefined,
        experience: "",
        verified: !!u.status,
        portfolio: [],
        availableDates: [],
        reviews: [],
        mobile: u.mobile,
        reviewsCount: workingPrice?.review_count ?? 0,
      };
    }) || [];

  const bookingMutation = useCreateStaffBookingMutation({
    onSuccess: () => {
      toast({
        title: "Booking Created — Complete Payment to Confirm",
        description: "Please complete payment to confirm the booking.",
      });
      setShowShiftDialog(false);
    },
    onError: () => {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking.",
        variant: "destructive",
      });
    },
  });

  const createStaffBookingPaymentMutation = useCreateStaffBookingPayment();

  const handleDirectBooking = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowShiftDialog(true);
  };

  // Price confirmation dialog state
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [pendingBookingPayload, setPendingBookingPayload] = useState<any>(null);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [pendingPayment, setPendingPayment] = useState<any | null>(null);

  const filteredStaff = staffMembers.filter((staff: StaffMember) => {
    const matchesCategory =
      selectedCategory === "all" || staff.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (staff.specialties &&
        staff.specialties.some((s) =>
          s?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  // categories are loaded via StaffCategorySelector using react-query

  if (isLoading) {
    // Skeleton loading state: header, filters and grid placeholders
    return (
      <div className="min-h-screen bg-gray-900 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 md:h-14 bg-white/10 rounded-md mx-auto w-3/4 md:w-1/2 animate-pulse" />
            <div className="mt-4 h-4 bg-white/6 rounded-md mx-auto w-2/3 animate-pulse" />
          </div>

          {/* Filters skeleton */}
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="h-10 bg-white/6 rounded-md animate-pulse" />
                </div>
                <div className="w-48">
                  <div className="h-10 bg-white/6 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl p-6 bg-purple-800/40">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-purple-700/40 animate-pulse mb-4" />
                  <div className="h-6 w-40 bg-white/10 rounded-md animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-white/8 rounded-md animate-pulse mb-3" />
                  <div className="h-5 w-48 bg-white/6 rounded-md animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Staffing Marketplace
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Book verified professionals for your events with instant calendar
            availability and direct booking
          </p>
        </div>

        {selectedStaff && (
          <StaffShiftDialog
            open={showShiftDialog}
            onOpenChange={(open) => {
              setShowShiftDialog(open);
              if (!open) setSelectedStaff(null);
            }}
            staff={selectedStaff}
            onSubmit={(values) => {
              // compute duration in hours
              let durationHours = 1;
              if (values.startTime && values.endTime) {
                const [sh, sm] = values.startTime.split(":").map(Number);
                const [eh, em] = values.endTime.split(":").map(Number);
                const startMin = sh * 60 + sm;
                const endMin = eh * 60 + em;
                durationHours = Math.max(
                  1,
                  Math.round((endMin - startMin) / 60)
                );
              }

              const payload = {
                eventId: values.eventId,
                staffId: selectedStaff?.id,
                staffName: selectedStaff?.name,
                eventDate: values.startDate,
                startTime: values.startTime,
                endTime: values.endTime,
                duration: String(durationHours),
                eventType: values.eventType,
                eventName: values.eventName,
                eventAddress: values.eventAddress,
                guestCount: values.guestCount,
                specialRequests: values.specialRequests,
              };

              // calculate estimate using staff hourly rate
              const estimate = selectedStaff
                ? selectedStaff.hourlyRate * durationHours
                : 0;
              setPriceEstimate(estimate);
              setPendingBookingPayload(payload);
              // create booking on server before presenting payment options
              (async () => {
                try {
                  const res = await bookingMutation.mutateAsync({
                    // convert payload to server shape
                    event_id: payload.eventId,
                    dateFrom: payload.eventDate,
                    dateTo: payload.eventDate,
                    timeFrom: payload.startTime,
                    timeTo: payload.endTime,
                    event_type_id: payload.eventType,
                    staff_id: payload.staffId,
                    event_name: payload.eventName,
                    event_address: payload.eventAddress,
                    no_of_guests: payload.guestCount,
                    special_instruction: payload.specialRequests,
                    transaction_status: "Pending",
                    transaction_id: null,
                    status: true,
                  });

                  // server response may nest data; normalize accordingly
                  const orderResponse = res?.data ?? res;
                  setPendingPayment({ orderResponse });
                  setShowShiftDialog(false);
                  setShowPriceDialog(true);
                } catch (err) {
                  // bookingMutation.onError handles toast; keep dialog open for retry
                  console.error("Booking create failed:", err);
                }
              })();
            }}
          />
        )}

        <PriceConfirmationDialog
          open={showPriceDialog}
          onOpenChange={(open) => setShowPriceDialog(open)}
          priceEstimate={priceEstimate}
          onPrevious={() => {
            // go back to shift dialog
            setShowPriceDialog(false);
            setShowShiftDialog(true);
          }}
          onConfirm={async (payment) => {
            const created = pendingPayment?.orderResponse;
            if (!created) {
              toast({
                title: "Missing order",
                description: "Cannot finalize payment: order missing.",
                variant: "destructive",
              });
              return;
            }

            try {
              // attempt to locate booking id from server response
              const staffBookingId =
                created?.staff_event_book_id ?? created?._id ?? created?.id;

              if (!staffBookingId) {
                toast({
                  title: "Missing booking id",
                  description: "Cannot finalize payment: booking id missing.",
                  variant: "destructive",
                });
                return;
              }

              // finalize payment on server - pass payment identifier (depends on your API)
              await createStaffBookingPaymentMutation.mutateAsync({
                staff_event_book_id: Number(staffBookingId),
                payment_intent_id: payment?.id || payment,
                billingDetails: "Staff Booking Payment",
                // `finalize` is a flag used to indicate completion to the backend if supported
                finalize: true,
              });

              toast({
                title: "Booking Confirmed!",
                description:
                  "Your payment was received and booking is confirmed.",
              });

              setPendingBookingPayload(null);
              setPendingPayment(null);
              setShowPriceDialog(false);
            } catch (err) {
              console.error("Failed to finalize payment:", err);
              toast({
                title: "Payment Failed",
                description: "There was an error finalizing payment.",
                variant: "destructive",
              });
              throw err;
            }
          }}
          onMethodSelect={async (method: number) => {
            // use staff booking payment endpoint
            try {
              const created = pendingPayment?.orderResponse;
              const staffBookingId =
                created?.staff_event_book_id ??
                created?.staff_event_book_id ??
                created?._id;

              if (!staffBookingId) {
                throw new Error("Missing staff booking id");
              }

              const res = await createStaffBookingPaymentMutation.mutateAsync({
                staff_event_book_id: Number(staffBookingId),
                payment_method_id: method,
                billingDetails: "Staff Booking Payment",
              });

              const paymentIntent = res.data.data.paymentIntent;
              return paymentIntent;
            } catch (err) {
              console.error(
                "Failed to create staff booking payment intent:",
                err
              );
              throw err;
            }
          }}
        />

        {/* Filters */}
        <div className="mb-8 max-w-5xl mx-auto">
          <Card className="bg-white backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 " />
                    <Input
                      placeholder="Search by name or specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10  "
                    />
                  </div>
                </div>
                <StaffCategorySelector
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStaff.map((staff: StaffMember) => (
            <Card key={staff.id} className=" border-0 bg-transparent">
              <CardContent className="p-0">
                <div className="bg-purple-700 rounded-2xl p-6 text-center shadow-lg">
                  {staff.profileImage ? (
                    <img
                      src={staff.profileImage}
                      alt={staff.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-purple-800"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-purple-600 flex items-center justify-center text-white text-2xl font-semibold border-4 border-purple-800">
                      {staff.name.charAt(0)}
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-white mt-4">
                    {staff.name}
                  </h3>
                  <p className="text-white/90 mt-1">{staff.mobile || ""}</p>

                  <p className="text-white font-semibold mt-3">
                    {staff.category?.charAt(0).toUpperCase() +
                      staff.category?.slice(1)}{" "}
                    - ${staff.hourlyRate} per Hour
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-3 text-white">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">
                      {staff.rating.toFixed(1)}
                    </span>
                    <span className="text-white/90">
                      ({staff.reviewsCount ?? 0} reviews)
                    </span>
                  </div>

                  <div className="mt-5">
                    <Button
                      onClick={() => handleDirectBooking(staff)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center text-white py-12">
            <h3 className="text-xl mb-2">No staff members found</h3>
            <p className="text-purple-200">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
