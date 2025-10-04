import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Send, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import HeroSection from "@/components/hero-section";
import MenuBuilder from "@/components/menu-builder";
import EventSidebar from "@/components/event-sidebar";
import AddItemModal from "@/components/add-item-modal";

import Header from "@/components/enhanced-event/Header";
import TasksTab from "@/components/enhanced-event/TasksTab";
import ChatTab from "@/components/enhanced-event/ChatTab";
import BudgetTab from "@/components/enhanced-event/BudgetTab";
import VenueTab from "@/components/enhanced-event/VenueTab";
import PhotosTab from "@/components/enhanced-event/PhotosTab";
import GuestsTab from "@/components/enhanced-event/GuestsTab";
import SettingsTab from "@/components/enhanced-event/SettingsTab";
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

  const { data: event = {} as any, isLoading: eventLoading } = useQuery<any>({
    queryKey: [`/api/events/${eventId}`],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: [`/api/events/${eventId}/stats`],
  });

  const { data: tasks = [] } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/tasks`],
  });

  const { data: budgetData = {} as any } = useQuery<any>({
    queryKey: [`/api/events/${eventId}/budget`],
  });

  // Transform budget data into array format for the UI
  const budget = budgetData.categories
    ? Object.entries(budgetData.categories).map(
        ([category, data]: [string, any]) => ({
          id: category,
          itemName: category.charAt(0).toUpperCase() + category.slice(1),
          category: category,
          estimatedCost: data.budgeted || 0,
          actualCost: data.spent || 0,
        })
      )
    : [];

  const { data: budgetSummary = {} } = useQuery({
    queryKey: [`/api/events/${eventId}/budget/summary`],
  });

  const { data: messages = [] } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/messages`],
  });

  const { data: photos = [] } = useQuery<any[]>({
    queryKey: [`/api/events/${eventId}/photos`],
  });

  // Mutations
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; userId: number }) => {
      return apiRequest("POST", `/api/events/${eventId}/messages`, messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/messages`],
      });
      setNewMessage("");
      toast({ title: "Message sent!" });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string;
      description?: string;
      createdById: number;
    }) => {
      return apiRequest("POST", `/api/events/${eventId}/tasks`, taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/tasks`],
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      toast({ title: "Task created!" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      completed,
    }: {
      taskId: number;
      completed: boolean;
    }) => {
      return apiRequest("PATCH", `/api/tasks/${taskId}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/tasks`],
      });
      toast({ title: "Task updated!" });
    },
  });

  const createBudgetItemMutation = useMutation({
    mutationFn: async (budgetData: {
      itemName: string;
      category: string;
      estimatedCost: number;
    }) => {
      return apiRequest(
        "POST",
        `/api/events/${eventId}/budget-items`,
        budgetData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/budget`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/api/events/${eventId}/budget/summary`],
      });
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
        <Header
          event={event}
          stats={stats}
          getTimeUntilEvent={getTimeUntilEvent}
        />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
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
                className={`bg-[#24292D] data-[state=active]:focus:outline-hidden text-gray-400 data-[state=active]:text-white data-[state=active]:bg-[#24292D] data-[state=active]:border data-[state=active]:border-white data-[state=active]:rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 text-center`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

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
                <EventSidebar event={event} eventId={eventId} stats={stats} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <MenuBuilder
              eventId={eventId}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddItem={() => setIsAddItemModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TasksTab
              tasks={tasks}
              newTaskTitle={newTaskTitle}
              setNewTaskTitle={setNewTaskTitle}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
              onCreateTask={handleCreateTask}
              onToggleTask={handleToggleTask}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatTab
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetTab
              budget={budget}
              budgetSummary={budgetSummary}
              newBudgetItem={newBudgetItem}
              setNewBudgetItem={setNewBudgetItem}
              newBudgetCategory={newBudgetCategory}
              setNewBudgetCategory={setNewBudgetCategory}
              newBudgetCost={newBudgetCost}
              setNewBudgetCost={setNewBudgetCost}
              onCreateBudgetItem={handleCreateBudgetItem}
            />
          </TabsContent>

          <TabsContent value="venue" className="space-y-6">
            <VenueTab />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <PhotosTab photos={photos} />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6">
            <GuestsTab eventId={eventId} stats={stats} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab event={event} />
          </TabsContent>
        </Tabs>
      </div>

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

      <SocialMediaSharing
        event={event}
        isOpen={isSocialSharingOpen}
        onClose={() => setIsSocialSharingOpen(false)}
      />
    </div>
  );
}
