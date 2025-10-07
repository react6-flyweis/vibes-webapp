import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Send, Share2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useEventByIdQuery } from "@/queries/events";
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
  const { id: eventId } = useParams();

  const [isSocialSharingOpen, setIsSocialSharingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: event, isLoading: eventLoading } = useEventByIdQuery(eventId);
  console.log("Event data:", event);

  // Fetch event plan map details from the master API
  const { data: planMap, isLoading: planMapLoading } = useQuery<any>({
    queryKey: [`/api/master/plan-event-map/event/${eventId}`],
    queryFn: async () =>
      apiRequest("GET", `/api/master/plan-event-map/event/${eventId}`),
    enabled: !!eventId,
  });

  if (eventLoading || planMapLoading || !eventId || !event) {
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

  // const formatCurrency = (cents: number) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //   }).format(cents / 100);
  // };

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

  // Chat UI and logic moved into ChatTab component

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header
          stats={""}
          event={event}
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
                <HeroSection event={event} />
                <MenuBuilder eventId={eventId} />
              </div>
              <div className="lg:col-span-1">
                <EventSidebar event={event} eventId={eventId} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <MenuBuilder eventId={eventId} />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TasksTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="venue" className="space-y-6">
            <VenueTab />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <PhotosTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6">
            <GuestsTab eventId={eventId} />
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
          className="bg-party-coral hover:bg-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>

      {/* AddItemModal is now managed inside MenuBuilder */}

      <SocialMediaSharing
        event={event}
        isOpen={isSocialSharingOpen}
        onClose={() => setIsSocialSharingOpen(false)}
      />
    </div>
  );
}
