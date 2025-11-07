import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import { Link } from "react-router";

type AvailabilitySlot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "available" | "busy" | "blocked";
  notes?: string;
};

type RecurringPattern = {
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
};

export default function CalendarManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  // Sample availability data - replace with actual API calls
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    {
      id: "1",
      date: "2025-11-10",
      startTime: "09:00",
      endTime: "17:00",
      status: "available",
      notes: "Available for events",
    },
    {
      id: "2",
      date: "2025-11-15",
      startTime: "14:00",
      endTime: "22:00",
      status: "available",
      notes: "Evening events preferred",
    },
    {
      id: "3",
      date: "2025-11-20",
      startTime: "10:00",
      endTime: "18:00",
      status: "blocked",
      notes: "Personal time off",
    },
  ]);

  const [newSlot, setNewSlot] = useState({
    startTime: "09:00",
    endTime: "17:00",
    status: "available" as "available" | "busy" | "blocked",
    notes: "",
  });

  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>({
    daysOfWeek: [],
    startTime: "09:00",
    endTime: "17:00",
  });

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Group availability by date
  const availabilityByDate = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const hasAvailability = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availabilityByDate[dateStr]?.length > 0;
  };

  const getAvailabilityStatus = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const slots = availabilityByDate[dateStr];
    if (!slots || slots.length === 0) return null;

    if (slots.some((s) => s.status === "available")) return "available";
    if (slots.some((s) => s.status === "busy")) return "busy";
    return "blocked";
  };

  const selectedDateSlots = selectedDate
    ? availabilityByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  const handleAddSlot = () => {
    if (!selectedDate) return;

    const newAvailability: AvailabilitySlot = {
      id: Date.now().toString(),
      date: format(selectedDate, "yyyy-MM-dd"),
      ...newSlot,
    };

    setAvailability([...availability, newAvailability]);
    setShowAddDialog(false);
    setNewSlot({
      startTime: "09:00",
      endTime: "17:00",
      status: "available",
      notes: "",
    });
  };

  const handleUpdateSlot = () => {
    if (!editingSlot) return;

    setAvailability(
      availability.map((slot) =>
        slot.id === editingSlot.id ? editingSlot : slot
      )
    );
    setEditingSlot(null);
  };

  const handleDeleteSlot = (id: string) => {
    setAvailability(availability.filter((slot) => slot.id !== id));
  };

  const handleApplyRecurring = () => {
    const newSlots: AvailabilitySlot[] = [];
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(addMonths(currentDate, 2)); // Apply for 3 months

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    days.forEach((day) => {
      if (recurringPattern.daysOfWeek.includes(day.getDay())) {
        const dateStr = format(day, "yyyy-MM-dd");
        // Don't add if already exists
        if (!availabilityByDate[dateStr]) {
          newSlots.push({
            id: `recurring-${Date.now()}-${day.getTime()}`,
            date: dateStr,
            startTime: recurringPattern.startTime,
            endTime: recurringPattern.endTime,
            status: "available",
            notes: "Recurring availability",
          });
        }
      }
    });

    setAvailability([...availability, ...newSlots]);
    setShowRecurringDialog(false);
    setRecurringPattern({
      daysOfWeek: [],
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  const toggleDayOfWeek = (day: number) => {
    setRecurringPattern((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 border-green-500/50";
      case "busy":
        return "bg-yellow-500/20 border-yellow-500/50";
      case "blocked":
        return "bg-red-500/20 border-red-500/50";
      default:
        return "bg-gray-500/20 border-gray-500/50";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 text-green-200 border-green-500/30";
      case "busy":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-500/30";
      case "blocked":
        return "bg-red-500/20 text-red-200 border-red-500/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Calendar Management
            </h1>
            <p className="text-purple-200">
              Manage your availability and schedule
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/vendor-dashboard">
              <Button
                variant="outline"
                className="bg-white/20 text-white hover:bg-white/10"
              >
                Back to Dashboard
              </Button>
            </Link>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setShowRecurringDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Recurring
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-2xl">
                    {format(currentDate, "MMMM yyyy")}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/10"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/10"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/20 text-white hover:bg-white/10"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-purple-200 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDate
                      ? isSameDay(day, selectedDate)
                      : false;
                    const hasAvail = hasAvailability(day);
                    const status = getAvailabilityStatus(day);

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative aspect-square p-2 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${!isCurrentMonth ? "text-white/30" : "text-white"}
                          ${
                            isToday
                              ? "bg-blue-500/20 border border-blue-500/50"
                              : ""
                          }
                          ${
                            isSelected
                              ? "bg-purple-500/30 border border-purple-500"
                              : ""
                          }
                          ${!isSelected && !isToday ? "hover:bg-white/10" : ""}
                          ${
                            hasAvail && !isSelected && !isToday && status
                              ? getStatusColor(status)
                              : ""
                          }
                        `}
                      >
                        <span className="relative z-10">
                          {format(day, "d")}
                        </span>
                        {hasAvail && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Selected Date Details */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">
                    {selectedDate
                      ? format(selectedDate, "MMMM dd, yyyy")
                      : "Select a date"}
                  </CardTitle>
                  {selectedDate && (
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => setShowAddDialog(true)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  selectedDateSlots.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getStatusBadgeColor(slot.status)}>
                              {slot.status}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
                                onClick={() => setEditingSlot(slot)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => handleDeleteSlot(slot.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          {slot.notes && (
                            <p className="text-xs text-white/50 mt-2">
                              {slot.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-white/60 py-8">
                      <p className="mb-3">No availability set for this date</p>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => setShowAddDialog(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Availability
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center text-white/60 py-8">
                    Select a date to manage availability
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white/5 border-white/10 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50" />
                  <span className="text-white/70">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50" />
                  <span className="text-white/70">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/50" />
                  <span className="text-white/70">Busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50" />
                  <span className="text-white/70">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500" />
                  <span className="text-white/70">Selected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Availability Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>
              Add Availability for{" "}
              {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-white/70">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="endTime" className="text-white/70">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status" className="text-white/70">
                Status
              </Label>
              <Select
                value={newSlot.status}
                onValueChange={(value: any) =>
                  setNewSlot({ ...newSlot, status: value })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/10">
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes" className="text-white/70">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={newSlot.notes}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, notes: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
                placeholder="Add any notes about this availability..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSlot}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Availability Dialog */}
      <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Edit Availability</DialogTitle>
          </DialogHeader>
          {editingSlot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editStartTime" className="text-white/70">
                    Start Time
                  </Label>
                  <Input
                    id="editStartTime"
                    type="time"
                    value={editingSlot.startTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        startTime: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="editEndTime" className="text-white/70">
                    End Time
                  </Label>
                  <Input
                    id="editEndTime"
                    type="time"
                    value={editingSlot.endTime}
                    onChange={(e) =>
                      setEditingSlot({
                        ...editingSlot,
                        endTime: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editStatus" className="text-white/70">
                  Status
                </Label>
                <Select
                  value={editingSlot.status}
                  onValueChange={(value: any) =>
                    setEditingSlot({ ...editingSlot, status: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/10">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editNotes" className="text-white/70">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="editNotes"
                  value={editingSlot.notes || ""}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, notes: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Add any notes about this availability..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingSlot(null)}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSlot}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recurring Availability Dialog */}
      <Dialog open={showRecurringDialog} onOpenChange={setShowRecurringDialog}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle>Set Recurring Availability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white/70 mb-3 block">
                Select Days of Week
              </Label>
              <div className="grid grid-cols-7 gap-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="outline"
                    onClick={() => toggleDayOfWeek(idx)}
                    className={`
                      ${
                        recurringPattern.daysOfWeek.includes(idx)
                          ? "bg-purple-600 border-purple-500 text-white"
                          : "bg-white/5 border-white/10 text-white/70"
                      }
                    `}
                  >
                    {day}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">
                Selected days: {recurringPattern.daysOfWeek.length}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recurStartTime" className="text-white/70">
                  Start Time
                </Label>
                <Input
                  id="recurStartTime"
                  type="time"
                  value={recurringPattern.startTime}
                  onChange={(e) =>
                    setRecurringPattern({
                      ...recurringPattern,
                      startTime: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="recurEndTime" className="text-white/70">
                  End Time
                </Label>
                <Input
                  id="recurEndTime"
                  type="time"
                  value={recurringPattern.endTime}
                  onChange={(e) =>
                    setRecurringPattern({
                      ...recurringPattern,
                      endTime: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-sm text-blue-200">
                This will apply your availability to the selected days for the
                next 3 months.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRecurringDialog(false)}
              className="bg-white/10 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyRecurring}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={recurringPattern.daysOfWeek.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Apply Recurring
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
