import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useCreateVendorBooking } from "@/queries/vendorBookings";
import { useVendorServiceTypes } from "@/queries/vendorServiceTypes";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AvailabilityTimeSlotSelector,
  TIME_SLOTS,
} from "@/components/AvailabilityTimeSlotSelector";

interface BookVendorDialogProps {
  vendorId: number;
  userId: number;
  eventId?: number;
  trigger?: React.ReactNode;
}

export default function BookVendorDialog({
  vendorId,
  userId,
  eventId,
  trigger,
}: BookVendorDialogProps) {
  const [open, setOpen] = useState(false);
  const [timingMode, setTimingMode] = useState<
    "hourly" | "fullday" | "multiday"
  >("hourly");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [startTimeSlot, setStartTimeSlot] = useState<string>("");
  const [endTimeSlot, setEndTimeSlot] = useState<string>("");
  const { toast } = useToast();

  const { data: serviceTypes = [] } = useVendorServiceTypes();
  const createBooking = useCreateVendorBooking({
    onSuccess: () => {
      toast({
        title: "Booking Created",
        description: "Your vendor booking has been successfully created.",
      });
      setOpen(false);
      handleReset();
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description:
          error?.response?.data?.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    reset();
    setTimingMode("hourly");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCategories([]);
    setStartTimeSlot("");
    setEndTimeSlot("");
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    if (!startDate) {
      toast({
        title: "Missing Start Date",
        description: "Please select a start date",
        variant: "destructive",
      });
      return;
    }

    // Validation based on timing mode
    if (timingMode === "multiday" && !endDate) {
      toast({
        title: "Missing End Date",
        description: "Please select an end date for multi-day booking",
        variant: "destructive",
      });
      return;
    }

    if (timingMode === "hourly" && !startTimeSlot) {
      toast({
        title: "Missing Time Slot",
        description: "Please select a time slot for hourly booking",
        variant: "destructive",
      });
      return;
    }

    if (selectedCategories.length === 0) {
      toast({
        title: "Missing Categories",
        description: "Please select at least one service category",
        variant: "destructive",
      });
      return;
    }

    // Set times based on timing mode
    let startTime: string;
    let endTime: string;
    let finalEndDate: Date;

    if (timingMode === "hourly") {
      // Extract times from time slot (format: "HH:MM-HH:MM")
      const [slotStart, slotEnd] = startTimeSlot.split("-");
      startTime = slotStart;
      endTime = slotEnd;
      finalEndDate = startDate; // Same day for hourly
    } else if (timingMode === "fullday") {
      // Full day: 00:00 to 23:59
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = startDate; // Same day for full day
    } else {
      // Multi-day: 00:00 to 23:59
      startTime = "00:00";
      endTime = "23:59";
      finalEndDate = endDate || startDate;
    }

    const payload = {
      Year: startDate.getFullYear(),
      Month: startDate.getMonth() + 1,
      Date_start: startDate.toISOString(),
      End_date: finalEndDate.toISOString(),
      Start_time: startTime,
      End_time: endTime,
      User_availabil: "Book",
      user_id: userId,
      Vendor_Category_id: selectedCategories,
      Event_id: eventId,
      Status: true,
    };

    createBooking.mutate(payload);
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Book Vendor</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Vendor</DialogTitle>
          <DialogDescription>
            Fill in the details to book this vendor for your event. Available
            time slots are shown based on vendor availability.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Timing Mode Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">Booking Schedule Type</h3>
            </div>
            <div className="space-y-2">
              <Label>Select how you want to book this vendor *</Label>
              <div className="inline-flex rounded-md shadow-sm bg-transparent border divide-x w-full">
                <button
                  type="button"
                  onClick={() => setTimingMode("hourly")}
                  aria-pressed={timingMode === "hourly"}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    timingMode === "hourly"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted"
                  } rounded-l-md`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Hourly</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTimingMode("fullday")}
                  aria-pressed={timingMode === "fullday"}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    timingMode === "fullday"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Full Day</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTimingMode("multiday")}
                  aria-pressed={timingMode === "multiday"}
                  className={`flex-1 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    timingMode === "multiday"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-muted"
                  } rounded-r-md`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Multiple Days</span>
                  </div>
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {timingMode === "hourly" &&
                  "Book the vendor for a specific time slot"}
                {timingMode === "fullday" &&
                  "Book the vendor for a full day (00:00 - 23:59)"}
                {timingMode === "multiday" &&
                  "Book the vendor for multiple consecutive days"}
              </p>
            </div>
          </div>

          {/* Section 1: Date Range Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm">
                {timingMode === "multiday"
                  ? "1. Select Date Range"
                  : "1. Select Event Date"}
              </h3>
            </div>
            <div
              className={cn(
                "grid gap-4",
                timingMode === "multiday"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              )}
            >
              <div className="space-y-2">
                <Label>
                  {timingMode === "multiday" ? "Start Date *" : "Date *"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {timingMode === "multiday" && (
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Time Slot Selection (Only for Hourly) */}
          {timingMode === "hourly" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">2. Choose Time Slot</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Already booked slots will be disabled
              </p>
              <div className="space-y-2">
                <Label>
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time Slot *
                </Label>
                <AvailabilityTimeSlotSelector
                  userId={vendorId}
                  selectedDate={
                    startDate ? format(startDate, "yyyy-MM-dd") : ""
                  }
                  value={startTimeSlot}
                  onChange={setStartTimeSlot}
                  placeholder="Select time slot"
                  enabled={!!startDate}
                />
              </div>
            </div>
          )}

          {/* Time Display for Full Day and Multi-Day */}
          {/* {(timingMode === "fullday" || timingMode === "multiday") && (
            <div className="bg-muted/30 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Time:</span>
                <span className="text-muted-foreground">
                  Full day (00:00 - 23:59)
                </span>
              </div>
            </div>
          )} */}

          {/* Section 3: Service Categories Multi-Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Badge className="w-5 h-5 p-0 flex items-center justify-center bg-primary">
                {timingMode === "hourly" ? "3" : "2"}
              </Badge>
              <h3 className="font-semibold text-sm">
                {timingMode === "hourly" ? "3" : "2"}. Select Service Categories
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose one or more service categories you need
            </p>
            <div className="space-y-2">
              <Label>Service Categories *</Label>
              <Select onValueChange={(value) => toggleCategory(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service categories..." />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((serviceType) => (
                    <SelectItem
                      key={serviceType.vendor_service_type_id}
                      value={String(serviceType.vendor_service_type_id)}
                    >
                      {serviceType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Categories Display */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map((categoryId) => {
                    const category = serviceTypes.find(
                      (st) => st.vendor_service_type_id === categoryId
                    );
                    return (
                      <Badge
                        key={categoryId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category?.name}
                        <button
                          type="button"
                          onClick={() => removeCategory(categoryId)}
                          className="ml-1 hover:bg-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          {(startDate || selectedCategories.length > 0) && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                📋 Booking Summary
              </h4>
              <div className="text-xs space-y-1">
                <div>
                  <span className="font-medium">Booking Type:</span>{" "}
                  <span className="capitalize">
                    {timingMode === "hourly"
                      ? "Hourly"
                      : timingMode === "fullday"
                      ? "Full Day"
                      : "Multiple Days"}
                  </span>
                </div>
                {startDate && (
                  <div>
                    <span className="font-medium">
                      {timingMode === "multiday" ? "Start Date:" : "Date:"}
                    </span>{" "}
                    {format(startDate, "PPP")}
                    {timingMode === "hourly" &&
                      startTimeSlot &&
                      ` (${startTimeSlot})`}
                    {(timingMode === "fullday" || timingMode === "multiday") &&
                      " (Full Day)"}
                  </div>
                )}
                {timingMode === "multiday" && endDate && (
                  <div>
                    <span className="font-medium">End Date:</span>{" "}
                    {format(endDate, "PPP")} (Full Day)
                  </div>
                )}
                {selectedCategories.length > 0 && (
                  <div>
                    <span className="font-medium">Services:</span>{" "}
                    {selectedCategories
                      .map((id) => {
                        const cat = serviceTypes.find(
                          (st) => st.vendor_service_type_id === id
                        );
                        return cat?.name;
                      })
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                handleReset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createBooking.isPending}>
              {createBooking.isPending ? "Booking..." : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
