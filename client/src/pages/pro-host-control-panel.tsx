import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Bell, 
  MessageSquare, 
  Send, 
  Calendar, 
  Clock, 
  Star, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Settings,
  Zap,
  Brain,
  Target,
  Mail,
  Phone,
  MapPin,
  Eye,
  ThumbsUp,
  Music,
  Utensils,
  Camera,
  Sparkles,
  Crown,
  Trophy,
  Gift,
  Coffee,
  Cake,
  PartyPopper
} from "lucide-react";

interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  status: 'upcoming' | 'live' | 'completed';
  hostId: string;
}

interface GuestData {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: 'confirmed' | 'maybe' | 'declined' | 'pending';
  checkInTime: string | null;
  lastActivity: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  engagementLevel: number;
  dietaryRestrictions: string[];
  plusOnes: number;
  arrived: boolean;
  leftEarly: boolean;
}

interface HostNotification {
  id: string;
  type: 'attendance' | 'sentiment' | 'engagement' | 'rsvp' | 'system';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  actionRequired: boolean;
  handled: boolean;
}

interface PushNotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  trigger: 'manual' | 'scheduled' | 'condition';
  category: 'announcement' | 'reminder' | 'surprise' | 'engagement';
  audienceFilter: string;
}

interface PostEventTask {
  id: string;
  type: 'thank_you' | 'review_request' | 'photo_sharing' | 'feedback_survey';
  name: string;
  description: string;
  automated: boolean;
  delay: number; // hours after event
  template: string;
  status: 'pending' | 'sent' | 'failed';
}

export default function ProHostControlPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("all");
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [autoNotificationsEnabled, setAutoNotificationsEnabled] = useState(true);
  
  // Data queries
  const { data: hostEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/pro-host/events"],
  });
  
  const { data: eventAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/pro-host/analytics", selectedEvent],
    enabled: !!selectedEvent,
  });
  
  const { data: guestList, isLoading: guestsLoading } = useQuery({
    queryKey: ["/api/pro-host/guests", selectedEvent],
    enabled: !!selectedEvent,
  });
  
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ["/api/pro-host/notifications", selectedEvent],
    enabled: !!selectedEvent,
  });
  
  const { data: aiInsights, isLoading: insightsLoading } = useQuery({
    queryKey: ["/api/pro-host/ai-insights", selectedEvent],
    enabled: !!selectedEvent && aiInsightsEnabled,
  });

  // Mutations
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: { message: string; audience: string; type: string }) => {
      const response = await apiRequest("POST", "/api/pro-host/send-notification", {
        eventId: selectedEvent,
        ...data
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notification Sent",
        description: "Push notification delivered to selected audience.",
      });
      setNotificationMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/pro-host/notifications"] });
    },
  });

  const automatePostEventMutation = useMutation({
    mutationFn: async (tasks: PostEventTask[]) => {
      const response = await apiRequest("POST", "/api/pro-host/automate-post-event", {
        eventId: selectedEvent,
        tasks
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Automation Configured",
        description: "Post-event tasks will run automatically.",
      });
    },
  });

  // Helper functions
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-500" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-500" />;
      default: return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const currentEvent = hostEvents?.find((event: EventData) => event.id === selectedEvent);
  const attendanceRate = guestList ? 
    Math.round((guestList.filter((g: GuestData) => g.arrived).length / guestList.length) * 100) : 0;
  const avgSentiment = guestList ? 
    guestList.reduce((acc: number, g: GuestData) => acc + g.sentimentScore, 0) / guestList.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pro Host Control Panel</h1>
                <p className="text-gray-600">AI-powered event management and guest engagement</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Brain className="h-4 w-4 mr-1" />
                AI Assistant Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Event Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Select Event</label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event to manage" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostEvents?.map((event: EventData) => (
                      <SelectItem key={event.id} value={event.id}>
                        <div className="flex items-center space-x-2">
                          <Badge variant={event.status === 'live' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <span>{event.name}</span>
                          <span className="text-gray-500">- {event.date}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {currentEvent && (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentEvent.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="h-4 w-4" />
                    <span>{guestList?.length || 0} / {currentEvent.capacity} guests</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedEvent && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Live Statistics */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Activity className="h-5 w-5 mr-2 text-blue-500" />
                      Live Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Attendance Rate</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={attendanceRate} className="w-16" />
                        <span className="text-sm font-medium">{attendanceRate}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Guest Sentiment</span>
                      <div className="flex items-center space-x-2">
                        {getSentimentIcon(avgSentiment > 0.6 ? 'positive' : avgSentiment < 0.4 ? 'negative' : 'neutral')}
                        <span className="text-sm font-medium">{Math.round(avgSentiment * 100)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">RSVP Dropoffs</span>
                      <Badge variant="outline" className="text-red-600">
                        {guestList?.filter((g: GuestData) => g.rsvpStatus === 'declined').length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => sendNotificationMutation.mutate({
                        message: "🎉 Surprise toast time! Head to the bar for a special announcement!",
                        audience: "checked_in",
                        type: "surprise"
                      })}
                    >
                      <PartyPopper className="h-4 w-4 mr-2" />
                      Surprise Toast
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => sendNotificationMutation.mutate({
                        message: "🕺 The dance floor is now open! Let's get this party started!",
                        audience: "all",
                        type: "announcement"
                      })}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      Open Dance Floor
                    </Button>
                    
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => sendNotificationMutation.mutate({
                        message: "📸 Group photo time at the main stage! Don't miss out!",
                        audience: "all",
                        type: "engagement"
                      })}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Group Photo Call
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Notifications */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <Bell className="h-5 w-5 mr-2 text-orange-500" />
                      Alerts & Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-40">
                      <div className="space-y-2">
                        {notifications?.slice(0, 5).map((notification: HostNotification) => (
                          <div 
                            key={notification.id}
                            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(notification.priority)}`}
                          >
                            <div className="flex items-start justify-between">
                              <p className="text-sm">{notification.message}</p>
                              {notification.actionRequired && (
                                <Button size="sm" variant="outline" className="ml-2">
                                  <Target className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Guest List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Guest Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-96">
                        <div className="space-y-3">
                          {guestList?.map((guest: GuestData) => (
                            <div key={guest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  guest.arrived ? 'bg-green-500' : 
                                  guest.rsvpStatus === 'confirmed' ? 'bg-yellow-500' : 'bg-gray-300'
                                }`} />
                                <div>
                                  <p className="font-medium">{guest.name}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Badge variant="outline" size="sm">
                                      {guest.rsvpStatus}
                                    </Badge>
                                    {getSentimentIcon(guest.sentiment)}
                                    <span>{Math.round(guest.sentimentScore * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {guest.checkInTime && (
                                  <Badge variant="secondary" size="sm">
                                    {guest.checkInTime}
                                  </Badge>
                                )}
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Attendance Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{attendanceRate}%</div>
                      <p className="text-sm text-gray-600">Attendance Rate</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Confirmed RSVPs</span>
                        <span className="font-medium">
                          {guestList?.filter((g: GuestData) => g.rsvpStatus === 'confirmed').length || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Actually Arrived</span>
                        <span className="font-medium">
                          {guestList?.filter((g: GuestData) => g.arrived).length || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">Left Early</span>
                        <span className="font-medium text-orange-600">
                          {guestList?.filter((g: GuestData) => g.leftEarly).length || 0}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm">No-Shows</span>
                        <span className="font-medium text-red-600">
                          {guestList?.filter((g: GuestData) => !g.arrived && g.rsvpStatus === 'confirmed').length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Send Notification */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Push Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        placeholder="Type your message to guests..."
                        className="min-h-20"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Audience</label>
                      <Select value={selectedAudience} onValueChange={setSelectedAudience}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Guests</SelectItem>
                          <SelectItem value="checked_in">Checked In Only</SelectItem>
                          <SelectItem value="vip">VIP Guests</SelectItem>
                          <SelectItem value="confirmed">Confirmed RSVPs</SelectItem>
                          <SelectItem value="maybe">Maybe RSVPs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => sendNotificationMutation.mutate({
                        message: notificationMessage,
                        audience: selectedAudience,
                        type: "manual"
                      })}
                      disabled={!notificationMessage.trim() || sendNotificationMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Notification
                    </Button>
                  </CardContent>
                </Card>

                {/* Notification Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Quick Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Welcome Message",
                          message: "🎉 Welcome to the party! Check in at the front desk for your welcome drink!",
                          audience: "confirmed"
                        },
                        {
                          name: "Food Service",
                          message: "🍽️ Dinner is now being served! Please make your way to the dining area.",
                          audience: "checked_in"
                        },
                        {
                          name: "Last Call",
                          message: "🥂 Last call for drinks! Bar closes in 30 minutes.",
                          audience: "checked_in"
                        },
                        {
                          name: "Thank You",
                          message: "❤️ Thank you for celebrating with us! Safe travels home!",
                          audience: "all"
                        }
                      ].map((template, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => {
                            setNotificationMessage(template.message);
                            setSelectedAudience(template.audience);
                          }}
                        >
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-600 mt-1">{template.message}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* AI Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiInsights?.recommendations?.map((insight: any, index: number) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-start space-x-3">
                            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">{insight.title}</h4>
                              <p className="text-sm text-blue-700 mt-1">{insight.description}</p>
                              {insight.action && (
                                <Button size="sm" className="mt-2" variant="outline">
                                  {insight.action}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sentiment Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Guest Sentiment Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(avgSentiment * 100)}%
                        </div>
                        <p className="text-sm text-gray-600">Overall Happiness</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Smile className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Positive</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={
                              guestList ? (guestList.filter((g: GuestData) => g.sentiment === 'positive').length / guestList.length) * 100 : 0
                            } className="w-20" />
                            <span className="text-sm font-medium">
                              {guestList ? Math.round((guestList.filter((g: GuestData) => g.sentiment === 'positive').length / guestList.length) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Meh className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Neutral</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={
                              guestList ? (guestList.filter((g: GuestData) => g.sentiment === 'neutral').length / guestList.length) * 100 : 0
                            } className="w-20" />
                            <span className="text-sm font-medium">
                              {guestList ? Math.round((guestList.filter((g: GuestData) => g.sentiment === 'neutral').length / guestList.length) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Frown className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Negative</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={
                              guestList ? (guestList.filter((g: GuestData) => g.sentiment === 'negative').length / guestList.length) * 100 : 0
                            } className="w-20" />
                            <span className="text-sm font-medium">
                              {guestList ? Math.round((guestList.filter((g: GuestData) => g.sentiment === 'negative').length / guestList.length) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Post-Event Automation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Post-Event Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        {
                          name: "Thank You Notes",
                          description: "Send personalized thank you messages",
                          delay: 2,
                          automated: true
                        },
                        {
                          name: "Review Requests",
                          description: "Ask guests to leave reviews and feedback",
                          delay: 24,
                          automated: true
                        },
                        {
                          name: "Photo Sharing",
                          description: "Share event photos and memories",
                          delay: 48,
                          automated: false
                        },
                        {
                          name: "Feedback Survey",
                          description: "Collect detailed event feedback",
                          delay: 72,
                          automated: true
                        }
                      ].map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{task.name}</h4>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Delay: {task.delay} hours</p>
                          </div>
                          <Switch checked={task.automated} />
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => automatePostEventMutation.mutate([
                        { id: '1', name: 'Thank You Notes', type: 'thank_you', description: 'Personalized thanks', automated: true, delay: 2, template: 'default', status: 'pending' }
                      ])}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Configure Automation
                    </Button>
                  </CardContent>
                </Card>

                {/* Smart Triggers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Smart Triggers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Low Attendance Alert</h4>
                          <p className="text-sm text-gray-600">Alert when attendance drops below 70%</p>
                        </div>
                        <Switch checked={autoNotificationsEnabled} onCheckedChange={setAutoNotificationsEnabled} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Sentiment Monitoring</h4>
                          <p className="text-sm text-gray-600">Track guest mood in real-time</p>
                        </div>
                        <Switch checked={aiInsightsEnabled} onCheckedChange={setAiInsightsEnabled} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Auto Thank You</h4>
                          <p className="text-sm text-gray-600">Send thanks when guests check out</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Early Departure Alerts</h4>
                          <p className="text-sm text-gray-600">Notify when VIP guests leave early</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {!selectedEvent && (
          <Card>
            <CardContent className="p-12 text-center">
              <Crown className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select an Event to Begin</h3>
              <p className="text-gray-600">
                Choose an event from the dropdown above to access the Pro Host Control Panel features.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}