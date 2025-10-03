import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, MapPin, Users, DollarSign, CheckSquare, MessageCircle, Camera, Music, UserPlus, Settings, Plus, Send, Share2, Upload, Building, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import HeroSection from "@/components/hero-section";
import MenuBuilder from "@/components/menu-builder";
import EventSidebar from "@/components/event-sidebar";
import AddItemModal from "@/components/add-item-modal";
import GuestManagementPanel from "@/components/guest-management-panel";
import InvitationCardGenerator from "@/components/invitation-card-generator";
import SocialMediaSharing from "@/components/social-media-sharing";

export default function EnhancedEventPage() {
  const { id } = useParams();
  const eventId = id ? parseInt(id as string) : 1; // Default to event 1 if no ID provided
  const [activeCategory, setActiveCategory] = useState("drinks");
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isInviteCardOpen, setIsInviteCardOpen] = useState(false);
  const [isSocialSharingOpen, setIsSocialSharingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newBudgetItem, setNewBudgetItem] = useState("");
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetCost, setNewBudgetCost] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: event = {}, isLoading: eventLoading } = useQuery({
    queryKey: [`/api/events/${eventId}`],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/events/${eventId}/stats`],
  });

  const { data: tasks = [] } = useQuery({
    queryKey: [`/api/events/${eventId}/tasks`],
  });

  const { data: budgetData = {} } = useQuery({
    queryKey: [`/api/events/${eventId}/budget`],
  });

  // Transform budget data into array format for the UI
  const budget = budgetData.categories ? Object.entries(budgetData.categories).map(([category, data]: [string, any]) => ({
    id: category,
    itemName: category.charAt(0).toUpperCase() + category.slice(1),
    category: category,
    estimatedCost: data.budgeted || 0,
    actualCost: data.spent || 0,
  })) : [];

  const { data: budgetSummary = {} } = useQuery({
    queryKey: [`/api/events/${eventId}/budget/summary`],
  });

  const { data: messages = [] } = useQuery({
    queryKey: [`/api/events/${eventId}/messages`],
  });

  const { data: photos = [] } = useQuery({
    queryKey: [`/api/events/${eventId}/photos`],
  });

  // Mutations
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; userId: number }) => {
      return apiRequest(`/api/events/${eventId}/messages`, {
        method: "POST",
        body: JSON.stringify(messageData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/messages`] });
      setNewMessage("");
      toast({ title: "Message sent!" });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; description?: string; createdById: number }) => {
      return apiRequest(`/api/events/${eventId}/tasks`, {
        method: "POST",
        body: JSON.stringify(taskData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/tasks`] });
      setNewTaskTitle("");
      setNewTaskDescription("");
      toast({ title: "Task created!" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: number; completed: boolean }) => {
      return apiRequest(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ completed }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/tasks`] });
      toast({ title: "Task updated!" });
    },
  });

  const createBudgetItemMutation = useMutation({
    mutationFn: async (budgetData: { itemName: string; category: string; estimatedCost: number }) => {
      return apiRequest("POST", `/api/events/${eventId}/budget-items`, budgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/budget`] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/budget/summary`] });
      setNewBudgetItem("");
      setNewBudgetCategory("");
      setNewBudgetCost("");
      toast({ title: "Budget item added!" });
    },
  });

  if (eventLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getTimeUntilEvent = () => {
    if (!event.date) return null;
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return "Today!";
    return "Event passed";
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate({
        message: newMessage,
        userId: 1, // In a real app, this would be the current user's ID
      });
    }
  };

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      createTaskMutation.mutate({
        title: newTaskTitle,
        description: newTaskDescription,
        createdById: 1, // In a real app, this would be the current user's ID
      });
    }
  };

  const handleCreateBudgetItem = () => {
    if (newBudgetItem.trim() && newBudgetCategory && newBudgetCost) {
      createBudgetItemMutation.mutate({
        itemName: newBudgetItem,
        category: newBudgetCategory,
        estimatedCost: Math.round(parseFloat(newBudgetCost) * 100), // Convert to cents
      });
    }
  };

  const handleToggleTask = (taskId: number, completed: boolean) => {
    updateTaskMutation.mutate({ taskId, completed: !completed });
  };

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Event Header */}
        <div className="bg-[#0A0A0A] rounded-xl shadow-lg p-6 mb-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">Plan My Event</h1>
                {event.eventType && (
                  <Badge variant="secondary" className="capitalize">
                    {event.eventType}
                  </Badge>
                )}
              </div>
              <p className="text-[#FFFFFF] mb-4">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Users className="w-4 h-4" />
                  <span>{stats?.confirmedCount || 0}/{event.maxAttendees} attending</span>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 lg:ml-6">
              <div className="text-center p-4 bg-[#24292D] rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{getTimeUntilEvent()}</div>
                {event.theme && (
                  <div className="text-sm text-gray-600 mt-1">Theme: {event.theme}</div>
                )}
                {event.dressCode && (
                  <div className="text-sm text-gray-600">Dress: {event.dressCode}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
<TabsList className="grid w-full grid-cols-9 bg-[#24292D] p-1">
  {[
    "overview",
    "menu",
    "tasks",
    "chat",
    "budget",
    "venue",
    "photos",
    "guests",
    "settings",
  ].map((tab) => (
    <TabsTrigger
      key={tab}
      value={tab}
      className="
        bg-[#24292D]
data-[state=active]:focus:outline-hidden        text-gray-400
        data-[state=active]:text-white
                data-[state=active]:bg-[#24292D]

        data-[state=active]:border
        data-[state=active]:border-white
        data-[state=active]:rounded-md
        px-4 py-2
        text-sm font-medium
        transition-colors duration-200
        text-center
      "
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </TabsTrigger>
  ))}
</TabsList>



          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <HeroSection event={event} stats={stats} />
                <MenuBuilder
                  eventId={eventId}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onAddItem={() => setIsAddItemModalOpen(true)}
                />
              </div>
              <div className="lg:col-span-1">
                <EventSidebar
                  event={event}
                  eventId={eventId}
                  stats={stats}
                />
              </div>
            </div>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <MenuBuilder
              eventId={eventId}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddItem={() => setIsAddItemModalOpen(true)}
            />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Tasks</CardTitle>
                <CardDescription>Manage and track event planning tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Task Form */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add New Task</h4>
                  <div className="space-y-3">
                    <Input
                      placeholder="Task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Task description (optional)..."
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                    <Button onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                {/* Tasks List */}
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No tasks yet. Add your first task to get started!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                          />
                          <div>
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Discussion</CardTitle>
                <CardDescription>Chat with other participants and coordinate planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message: any) => (
                        <div key={message.id} className="bg-white p-3 rounded-lg">
                          <div className="font-medium text-sm text-gray-600 mb-1">
                            User {message.userId} • {new Date(message.createdAt).toLocaleTimeString()}
                          </div>
                          <div>{message.message}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Estimated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(budgetSummary.totalEstimated || 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(budgetSummary.totalActual || 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency((budgetSummary.totalEstimated || 0) - (budgetSummary.totalActual || 0))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Items</CardTitle>
                <CardDescription>Track expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Budget Item Form */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add Budget Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Item name..."
                      value={newBudgetItem}
                      onChange={(e) => setNewBudgetItem(e.target.value)}
                    />
                    <Select value={newBudgetCategory} onValueChange={setNewBudgetCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="drinks">Drinks</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="decorations">Decorations</SelectItem>
                        <SelectItem value="rentals">Rentals</SelectItem>
                        <SelectItem value="venue">Venue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Cost ($)"
                      value={newBudgetCost}
                      onChange={(e) => setNewBudgetCost(e.target.value)}
                    />
                    <Button onClick={handleCreateBudgetItem} disabled={!newBudgetItem.trim() || !newBudgetCategory || !newBudgetCost}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Budget Items List */}
                {budget.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No expenses yet. Add your first budget item!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {budget.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                        <div>
                          <h4 className="font-medium">{item.itemName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {item.actualCost ? formatCurrency(item.actualCost) : formatCurrency(item.estimatedCost || 0)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.actualCost ? 'Actual' : 'Estimated'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venue Tab */}
          <TabsContent value="venue" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Venue Management</CardTitle>
                    <CardDescription>Manage venue details, layout, and requirements</CardDescription>
                  </div>
                  <Button>
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Venue Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Venue Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">Downtown Rooftop Terrace</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Address:</span>
                          <span className="font-medium">123 Main St, City Center</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capacity:</span>
                          <span className="font-medium">75 people</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">Outdoor Rooftop</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Sound System", "Lighting", "Bar Area", "Dance Floor",
                          "Restrooms", "Parking", "WiFi", "Climate Control"
                        ].map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Venue Layout</h3>
                      <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-lg p-4 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <Building className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                          <p className="text-sm text-gray-600">Interactive venue map</p>
                          <p className="text-xs text-gray-500">Click to view 3D layout</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Setup Requirements</h3>
                      <div className="space-y-2">
                        {[
                          { item: "Tables & Chairs", status: "Confirmed", color: "green" },
                          { item: "Sound Equipment", status: "Pending", color: "yellow" },
                          { item: "Decorations", status: "In Progress", color: "blue" },
                          { item: "Catering Setup", status: "Confirmed", color: "green" }
                        ].map((req) => (
                          <div key={req.item} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{req.item}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.color === 'green' ? 'bg-green-100 text-green-800' :
                                req.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                              }`}>
                              {req.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <MapPin className="w-5 h-5" />
                      <span className="text-xs">Directions</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Phone className="w-5 h-5" />
                      <span className="text-xs">Contact Venue</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Settings className="w-5 h-5" />
                      <span className="text-xs">Setup Details</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs">Book Again</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Event Gallery</CardTitle>
                    <CardDescription>Share photos and memories</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {photos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No photos yet. Upload the first one!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo: any) => (
                      <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg">
                        <img
                          src={photo.photoUrl}
                          alt={photo.caption || "Event photo"}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Guest Management</CardTitle>
                    <CardDescription>Manage invitations and RSVPs</CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Guests
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.confirmedCount || 0}</div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-gray-600">Maybe</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-sm text-gray-600">Declined</div>
                  </div>
                </div>
                <GuestManagementPanel eventId={eventId} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure event details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Event Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="graduation">Graduation</SelectItem>
                        <SelectItem value="baby-shower">Baby Shower</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <Input
                      placeholder="Enter event theme..."
                      defaultValue={event.theme}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dress Code</label>
                    <Input
                      placeholder="Enter dress code..."
                      defaultValue={event.dressCode}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Music Playlist URL</label>
                    <Input
                      type="url"
                      placeholder="Spotify, Apple Music, or YouTube playlist URL..."
                      defaultValue={event.musicPlaylistUrl}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Total Budget</label>
                    <Input
                      type="number"
                      placeholder="Enter total budget..."
                    />
                  </div>

                  <Button className="w-full">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-20 right-6 flex flex-col gap-3">
        <Button
          onClick={() => setIsSocialSharingOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Share2 className="h-6 w-6" />
        </Button>
        <Button
          onClick={() => setIsInviteCardOpen(true)}
          className="bg-party-coral hover:bg-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        eventId={eventId}
        defaultCategory={activeCategory}
      />

      {/* <InvitationCardGenerator
        event={event}
        isOpen={isInviteCardOpen}
        onClose={() => setIsInviteCardOpen(false)}
      /> */}

      <SocialMediaSharing
        event={event}
        isOpen={isSocialSharingOpen}
        onClose={() => setIsSocialSharingOpen(false)}
      />
    </div>
  );
}