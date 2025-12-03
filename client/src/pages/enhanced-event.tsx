import { useParams } from "react-router";
import Navigation from "@/components/navigation";
import { useState } from "react";
import { usePlanEventMapsByEventQuery } from "@/queries/planEventMaps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Send, Share2 } from "lucide-react";
import { useEventByIdQuery } from "@/queries/events";
import HeroSection from "@/components/hero-section";
import MenuBuilder from "@/components/menu-builder";
import EventSidebar from "@/components/event-sidebar";

import Header from "@/components/enhanced-event/Header";
import TasksTab from "@/components/enhanced-event/TasksTab";
import ChatTab from "@/components/enhanced-event/ChatTab";
import BudgetTab from "@/components/enhanced-event/BudgetTab";
import VenueTab from "@/components/enhanced-event/VenueTab";
import PhotosTab from "@/components/enhanced-event/PhotosTab";
import GuestsTab from "@/components/enhanced-event/GuestsTab";
import SettingsTab from "@/components/enhanced-event/SettingsTab";
import TemplatesTab from "@/components/enhanced-event/TemplatesTab";
// import SocialMediaSharing from "@/components/social-media-sharing";
import { useGuestsByEvent } from "@/queries/guests";

export default function EnhancedEventPage() {
  const { id: eventId } = useParams();

  // const [isSocialSharingOpen, setIsSocialSharingOpen] = useState(false);
  // active tab state
  const [activeTab, setActiveTab] = useState<string>("overview");
  // selected template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const { data: event, isLoading: eventLoading } = useEventByIdQuery(eventId);

  console.log(event);

  const { data: planMap, isLoading: planMapLoading } =
    usePlanEventMapsByEventQuery(eventId);

  const { data: guests } = useGuestsByEvent(eventId);

  // while loading or missing event/planMap show loading
  if (eventLoading || !eventId || !event || planMapLoading || !planMap) {
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

  // determine whether a plan map exists (planMap query returns an array)
  const hasPlanMap = Array.isArray(planMap) && planMap.length > 0;

  return (
    <div className="min-h-screen bg-[#0C111F]">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header
          guests={guests}
          event={event}
          getTimeUntilEvent={getTimeUntilEvent}
        />

        <Tabs
          value={activeTab}
          onValueChange={(next) => {
            // If there's no plan map, only allow 'overview' or 'menu'.
            // This lets the user start on the overview and go to the
            // menu, but blocks navigation to later steps until they've
            // added/claimed a menu item which creates a plan map.
            if (!hasPlanMap) {
              if (next === "menu" || next === "overview") setActiveTab(next);
              return;
            }

            // when plan map exists, allow normal switching
            setActiveTab(next);
          }}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-10 bg-[#24292D] p-1">
            {[
              "overview",
              "menu",
              "templates",
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
                // disable all tabs except overview & menu while there's no plan map
                disabled={!hasPlanMap && !["overview", "menu"].includes(tab)}
                className={`bg-[#24292D] data-[state=active]:focus:outline-hidden text-gray-400 data-[state=active]:text-white data-[state=active]:bg-[#24292D] data-[state=active]:border data-[state=active]:border-white data-[state=active]:rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 text-center`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="flex flex-col gap-5 lg:col-span-3">
                <HeroSection
                  guests={guests}
                  event={event}
                  planMap={planMap?.[0]}
                />
                <MenuBuilder planMap={planMap?.[0]} eventId={eventId} />
              </div>
              <div className="lg:col-span-1">
                <EventSidebar
                  guests={guests}
                  event={event}
                  planMap={planMap?.[0]}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <MenuBuilder planMap={planMap?.[0]} eventId={eventId} />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <TemplatesTab
              selectedTemplateId={selectedTemplateId || undefined}
              onTemplateSelect={(template) => {
                setSelectedTemplateId(template.id);
                console.log("Selected template:", template);
              }}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TasksTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <ChatTab eventId={eventId} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetTab event={event} eventId={eventId} planMap={planMap?.[0]} />
          </TabsContent>

          <TabsContent value="venue" className="space-y-6">
            <VenueTab planMap={planMap?.[0]} eventId={eventId} />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <PhotosTab eventId={eventId} planMap={planMap?.[0]} />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6">
            <GuestsTab eventId={eventId} planMap={planMap?.[0]} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab event={event} planMap={planMap?.[0]} />
          </TabsContent>
        </Tabs>
      </div>

      {/* <div className="fixed bottom-20 right-6 flex flex-col gap-3">
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
      </div> */}

      {/* AddItemModal is now managed inside MenuBuilder */}

      {/* <SocialMediaSharing
        event={event}
        isOpen={isSocialSharingOpen}
        onClose={() => setIsSocialSharingOpen(false)}
      /> */}
    </div>
  );
}
