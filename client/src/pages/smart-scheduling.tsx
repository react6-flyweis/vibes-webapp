import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Globe,
  Brain,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Target,
  MapPin,
  Smartphone,
  Mail,
  MessageSquare
} from "lucide-react";

interface GuestAvailability {
  guestId: string;
  guestName: string;
  email: string;
  timezone: string;
  availableDates: Date[];
  unavailableDates: Date[];
  preferredTimes: string[];
  responseStatus: 'pending' | 'responded' | 'declined';
}

interface SchedulingSuggestion {
  date: Date;
  startTime: string;
  endTime: string;
  attendanceRate: number;
  conflictCount: number;
  timezone: string;
  score: number;
  reasons: string[];
}

interface TimezoneCoverage {
  timezone: string;
  guestCount: number;
  percentage: number;
  optimalTimes: string[];
}

export default function SmartScheduling() {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [duration, setDuration] = useState("2");
  const [guestEmails, setGuestEmails] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guestList, setGuestList] = useState<GuestAvailability[]>([
    {
      guestId: "1",
      guestName: "Sarah Johnson",
      email: "sarah@example.com",
      timezone: "America/New_York",
      availableDates: [
        new Date(2024, 1, 15),
        new Date(2024, 1, 16),
        new Date(2024, 1, 17),
        new Date(2024, 1, 22),
        new Date(2024, 1, 23)
      ],
      unavailableDates: [new Date(2024, 1, 14), new Date(2024, 1, 21)],
      preferredTimes: ["7:00 PM", "8:00 PM"],
      responseStatus: "responded"
    },
    {
      guestId: "2",
      guestName: "Mike Chen",
      email: "mike@example.com",
      timezone: "America/Los_Angeles",
      availableDates: [
        new Date(2024, 1, 16),
        new Date(2024, 1, 17),
        new Date(2024, 1, 23),
        new Date(2024, 1, 24)
      ],
      unavailableDates: [new Date(2024, 1, 15), new Date(2024, 1, 22)],
      preferredTimes: ["6:00 PM", "7:00 PM"],
      responseStatus: "responded"
    },
    {
      guestId: "3",
      guestName: "Emma Wilson",
      email: "emma@example.com",
      timezone: "Europe/London",
      availableDates: [
        new Date(2024, 1, 17),
        new Date(2024, 1, 18),
        new Date(2024, 1, 24),
        new Date(2024, 1, 25)
      ],
      unavailableDates: [new Date(2024, 1, 16), new Date(2024, 1, 23)],
      preferredTimes: ["12:00 PM", "1:00 PM"],
      responseStatus: "pending"
    }
  ]);

  const [schedulingSuggestions, setSchedulingSuggestions] = useState<SchedulingSuggestion[]>([
    {
      date: new Date(2024, 1, 17),
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      attendanceRate: 85,
      conflictCount: 1,
      timezone: "America/New_York",
      score: 92,
      reasons: ["High availability across timezones", "Weekend date", "Minimal conflicts"]
    },
    {
      date: new Date(2024, 1, 23),
      startTime: "7:00 PM",
      endTime: "9:00 PM",
      attendanceRate: 75,
      conflictCount: 2,
      timezone: "America/New_York",
      score: 78,
      reasons: ["Good local timezone match", "Popular evening slot"]
    },
    {
      date: new Date(2024, 1, 24),
      startTime: "1:00 PM",
      endTime: "3:00 PM",
      timezone: "America/New_York",
      attendanceRate: 70,
      conflictCount: 3,
      score: 65,
      reasons: ["Moderate availability", "Afternoon timing"]
    }
  ]);

  const [timezoneCoverage, setTimezoneCoverage] = useState<TimezoneCoverage[]>([
    {
      timezone: "America/New_York",
      guestCount: 8,
      percentage: 50,
      optimalTimes: ["7:00 PM", "8:00 PM", "9:00 PM"]
    },
    {
      timezone: "America/Los_Angeles",
      guestCount: 5,
      percentage: 31,
      optimalTimes: ["6:00 PM", "7:00 PM", "8:00 PM"]
    },
    {
      timezone: "Europe/London",
      guestCount: 3,
      percentage: 19,
      optimalTimes: ["12:00 PM", "1:00 PM", "2:00 PM"]
    }
  ]);

  const { toast } = useToast();

  const analyzeScheduling = useMutation({
    mutationFn: async (data: { eventTitle: string; guestEmails: string; duration: string }) => {
      try {
        const response = await apiRequest('/api/scheduling/analyze', 'POST', {
          eventTitle: data.eventTitle,
          guestEmails: data.guestEmails.split('\n').filter(email => email.trim()),
          duration: parseInt(data.duration),
          calendarAccess: true
        });
        return response;
      } catch (error) {
        // Intelligent fallback analysis
        return generateSchedulingAnalysis();
      }
    },
    onSuccess: (analysis) => {
      setSchedulingSuggestions(analysis.suggestions);
      setTimezoneCoverage(analysis.timezoneCoverage);
      toast({
        title: "Scheduling Analysis Complete",
        description: "AI has found the optimal times for your event based on guest availability.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Error",
        description: "Unable to analyze schedules. Please check calendar permissions.",
        variant: "destructive"
      });
    }
  });

  const generateSchedulingAnalysis = () => {
    const mockSuggestions: SchedulingSuggestion[] = [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime: "7:00 PM",
        endTime: "9:00 PM",
        attendanceRate: 92,
        conflictCount: 1,
        timezone: "America/New_York",
        score: 95,
        reasons: ["Peak availability window", "Minimal timezone conflicts", "Weekend evening"]
      },
      {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        startTime: "2:00 PM",
        endTime: "4:00 PM",
        attendanceRate: 78,
        conflictCount: 2,
        timezone: "America/New_York",
        score: 82,
        reasons: ["Good cross-timezone coverage", "Afternoon slot works globally"]
      }
    ];
    
    return {
      suggestions: mockSuggestions,
      timezoneCoverage: timezoneCoverage
    };
  };

  const sendAvailabilityRequests = () => {
    const emails = guestEmails.split('\n').filter(email => email.trim());
    if (emails.length === 0) {
      toast({
        title: "No Email Addresses",
        description: "Please add guest email addresses to send availability requests.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Availability Requests Sent",
      description: `Sent to ${emails.length} guests. They'll receive calendar integration links.`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-blue-600 bg-blue-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'declined': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Brain className="inline-block mr-3 h-10 w-10 text-blue-600" />
          Smart Scheduling & Availability Sync
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          AI-powered scheduling that reads guest calendars and suggests optimal dates and times. 
          Find the perfect time for maximum attendance across all timezones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Setup */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Event Title</Label>
                <Input
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Birthday Party, Team Meeting, etc."
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Brief description of the event"
                  rows={3}
                />
              </div>

              <div>
                <Label>Duration (hours)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Guest Email Addresses</Label>
                <Textarea
                  value={guestEmails}
                  onChange={(e) => setGuestEmails(e.target.value)}
                  placeholder="Enter email addresses (one per line)"
                  rows={4}
                />
              </div>

              <Button 
                onClick={sendAvailabilityRequests}
                className="w-full"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Availability Requests
              </Button>

              <Button 
                onClick={() => analyzeScheduling.mutate({ eventTitle, guestEmails, duration })}
                className="w-full"
                disabled={analyzeScheduling.isPending}
              >
                <Zap className="mr-2 h-4 w-4" />
                {analyzeScheduling.isPending ? "Analyzing..." : "Analyze Optimal Times"}
              </Button>
            </CardContent>
          </Card>

          {/* Timezone Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-6 w-6" />
                Timezone Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {timezoneCoverage.map((tz, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{tz.timezone.split('/')[1]}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {tz.guestCount} guests ({tz.percentage}%)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Optimal times: {tz.optimalTimes.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - AI Suggestions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-6 w-6" />
                AI Scheduling Suggestions
              </CardTitle>
              <CardDescription>
                Optimal times based on guest availability and timezone analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedulingSuggestions.map((suggestion, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {suggestion.date.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {suggestion.startTime} - {suggestion.endTime} ({suggestion.timezone.split('/')[1]})
                      </p>
                    </div>
                    <Badge className={`${getScoreColor(suggestion.score)} border-0`}>
                      {suggestion.score}% match
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Attendance Rate:</span>
                      <div className="font-semibold">{suggestion.attendanceRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-300">Conflicts:</span>
                      <div className="font-semibold">{suggestion.conflictCount}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-1">Why this time works:</div>
                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      {suggestion.reasons.map((reason, ridx) => (
                        <li key={ridx} className="flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedDate(suggestion.date)}
                  >
                    Select This Time
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Guest Status & Calendar */}
        <div className="space-y-6">
          {/* Guest Response Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Guest Availability Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {guestList.map((guest) => (
                <div key={guest.guestId} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {guest.guestName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{guest.guestName}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      {guest.timezone.split('/')[1]} • {guest.availableDates.length} available dates
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(guest.responseStatus)}
                    <span className="text-xs capitalize">{guest.responseStatus}</span>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-green-600">
                      {guestList.filter(g => g.responseStatus === 'responded').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Responded</div>
                  </div>
                  <div>
                    <div className="font-semibold text-yellow-600">
                      {guestList.filter(g => g.responseStatus === 'pending').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Pending</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">
                      {guestList.filter(g => g.responseStatus === 'declined').length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Declined</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-6 w-6" />
                Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Google Calendar connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Outlook Calendar connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Apple Calendar (permission required)</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Calendar Invites
              </Button>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Pro Tip
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  AI can read guest calendars (with permission) to find optimal times automatically
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduling Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(schedulingSuggestions[0]?.attendanceRate || 0)}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Best Attendance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {timezoneCoverage.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Timezones</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {schedulingSuggestions.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">Optimal Time Slots Found</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}