import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Bot, MessageCircle, Bell, CheckCircle, AlertTriangle, Users, Calendar, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface BotInteraction {
  id: number;
  messageType: "reminder" | "suggestion" | "answer" | "nudge";
  botMessage: string;
  userResponse?: string;
  isResolved: boolean;
  priority: "low" | "medium" | "high";
  timestamp: string;
  actionTaken?: string;
}

interface EventProgress {
  totalTasks: number;
  completedTasks: number;
  pendingRSVPs: number;
  missingItems: string[];
  upcomingDeadlines: string[];
}

const mockInteractions: BotInteraction[] = [
  {
    id: 1,
    messageType: "reminder",
    botMessage: "Hey! Your event is in 3 days and you still need to confirm the DJ. Should I help you reach out to your top choices?",
    isResolved: false,
    priority: "high",
    timestamp: "2 hours ago",
    actionTaken: undefined
  },
  {
    id: 2,
    messageType: "nudge",
    botMessage: "Mike and Sarah haven't RSVP'd yet. I can send them a friendly reminder with the event details. Want me to do that?",
    isResolved: false,
    priority: "medium",
    timestamp: "5 hours ago",
    actionTaken: undefined
  },
  {
    id: 3,
    messageType: "suggestion",
    botMessage: "I noticed your menu is missing desserts! Based on your theme 'rooftop brunch', I suggest adding mini cheesecakes or fruit tarts. Should I add these to your shopping list?",
    isResolved: true,
    priority: "low",
    timestamp: "1 day ago",
    actionTaken: "Added fruit tarts to menu"
  },
  {
    id: 4,
    messageType: "answer",
    botMessage: "You asked about backup venue options. I found 3 indoor spaces with availability for your date, all within 2 miles of your original location. Want to see the details?",
    isResolved: true,
    priority: "medium",
    timestamp: "2 days ago",
    actionTaken: "Provided venue alternatives"
  }
];

const mockProgress: EventProgress = {
  totalTasks: 15,
  completedTasks: 8,
  pendingRSVPs: 4,
  missingItems: ["DJ confirmation", "Backup chairs", "Welcome sign"],
  upcomingDeadlines: ["Final headcount (tomorrow)", "Venue payment (3 days)", "Menu finalization (5 days)"]
};

export default function VibeBotAssistant() {
  const [interactions, setInteractions] = useState<BotInteraction[]>(mockInteractions);
  const [progress] = useState<EventProgress>(mockProgress);
  const [chatInput, setChatInput] = useState("");
  const [activeChat, setActiveChat] = useState(false);
  const { toast } = useToast();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      // In production, this would send to AI API
      return apiRequest("/api/vibebot/chat", {
        method: "POST",
        body: JSON.stringify({
          eventId: 1,
          message,
          messageType: "answer"
        })
      });
    },
    onSuccess: () => {
      // Add mock AI response
      const aiResponse: BotInteraction = {
        id: Date.now(),
        messageType: "answer",
        botMessage: `Great question! Let me help you with that. Based on your event details, here's what I recommend...`,
        isResolved: false,
        priority: "medium",
        timestamp: "Just now"
      };
      setInteractions([aiResponse, ...interactions]);
      setChatInput("");
      toast({
        title: "🤖 VibeBot Responded!",
        description: "Your AI assistant has some suggestions for you!"
      });
    }
  });

  const resolveInteraction = useMutation({
    mutationFn: async (interactionId: number, action: string) => {
      return apiRequest("/api/vibebot/resolve", {
        method: "POST",
        body: JSON.stringify({
          interactionId,
          actionTaken: action
        })
      });
    },
    onSuccess: (_, variables) => {
      setInteractions(interactions.map(interaction => 
        interaction.id === variables.interactionId
          ? { ...interaction, isResolved: true, actionTaken: variables.action }
          : interaction
      ));
      toast({
        title: "✅ Task Completed!",
        description: "VibeBot has updated your event progress!"
      });
    }
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    sendMessage.mutate(chatInput);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium": return <Bell className="h-4 w-4 text-yellow-500" />;
      default: return <MessageCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50 dark:bg-red-950";
      case "medium": return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      default: return "border-l-blue-500 bg-blue-50 dark:bg-blue-950";
    }
  };

  const completionPercentage = Math.round((progress.completedTasks / progress.totalTasks) * 100);

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-950 dark:via-blue-950 dark:to-purple-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VibeBot Assistant
            </h1>
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your intelligent co-host that tracks progress, sends reminders, and helps make your event planning effortless!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Event Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Overall Completion</span>
                    <span className="font-bold text-green-600">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tasks Completed</span>
                    <Badge variant="outline">{progress.completedTasks}/{progress.totalTasks}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending RSVPs</span>
                    <Badge variant="secondary">{progress.pendingRSVPs}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Missing Items</span>
                    <Badge variant="destructive">{progress.missingItems.length}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.missingItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{deadline}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Smart Notifications</TabsTrigger>
            <TabsTrigger value="chat">Chat with VibeBot</TabsTrigger>
            <TabsTrigger value="automations">Smart Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Intelligent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <Card key={interaction.id} className={`border-l-4 ${getPriorityColor(interaction.priority)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getPriorityIcon(interaction.priority)}
                              <Badge variant="outline" className="text-xs">
                                {interaction.messageType}
                              </Badge>
                              <span className="text-xs text-gray-500">{interaction.timestamp}</span>
                            </div>
                            <p className="text-sm mb-3">{interaction.botMessage}</p>
                            {interaction.actionTaken && (
                              <Badge variant="secondary" className="text-xs">
                                ✅ {interaction.actionTaken}
                              </Badge>
                            )}
                          </div>
                          {!interaction.isResolved && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => resolveInteraction.mutate(interaction.id, "Completed")}
                                disabled={resolveInteraction.isPending}
                              >
                                Mark Done
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resolveInteraction.mutate(interaction.id, "Dismissed")}
                              >
                                Dismiss
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with Your AI Co-Host
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-linear-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Bot className="h-6 w-6 text-green-600" />
                      <span className="font-semibold">VibeBot</span>
                      <Badge variant="outline">Online</Badge>
                    </div>
                    <p className="text-sm">
                      Hi! I'm your intelligent event assistant. I can help with vendor recommendations, timeline planning, guest management, and answer any questions about your event. What would you like to know?
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask VibeBot anything about your event..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={sendMessage.isPending || !chatInput.trim()}
                    >
                      {sendMessage.isPending ? "Sending..." : "Send"}
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setChatInput("What vendors do I still need to book?")}
                      className="text-left justify-start"
                    >
                      What vendors do I still need to book?
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setChatInput("Help me create a timeline for the day")}
                      className="text-left justify-start"
                    >
                      Help me create a timeline for the day
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setChatInput("Send RSVP reminders to pending guests")}
                      className="text-left justify-start"
                    >
                      Send RSVP reminders to pending guests
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setChatInput("Suggest backup plans for bad weather")}
                      className="text-left justify-start"
                    >
                      Suggest backup plans for bad weather
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Guest Management
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Automatically send RSVP reminders, dietary preference requests, and event updates
                    </p>
                    <Button size="sm">Enable Auto-RSVP</Button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Vendor Follow-ups
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Track vendor responses and automatically follow up on pending confirmations
                    </p>
                    <Button size="sm">Enable Vendor Tracking</Button>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Timeline Optimization
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      AI-powered timeline suggestions based on event type and guest count
                    </p>
                    <Button size="sm">Generate Timeline</Button>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Crisis Management
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Instant backup suggestions when vendors cancel or issues arise
                    </p>
                    <Button size="sm">Enable Crisis Mode</Button>
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