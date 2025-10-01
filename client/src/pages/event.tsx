import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import MenuBuilder from "@/components/menu-builder";
import EventSidebar from "@/components/event-sidebar";
import AddItemModal from "@/components/add-item-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function EventPage() {
  const { id } = useParams();
  const eventId = id ? parseInt(id) : 1; // Default to event 1 for demo
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("drinks");

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: [`/api/events/${eventId}`],
  });

  const { data: eventStats } = useQuery({
    queryKey: [`/api/events/${eventId}/stats`],
  });

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-party-gray">Loading event...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-500">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <HeroSection 
        event={event} 
        stats={eventStats} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MenuBuilder 
              eventId={eventId}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onAddItem={() => setIsAddItemModalOpen(true)}
            />
          </div>
          
          <div>
            <EventSidebar 
              event={event} 
              eventId={eventId}
              stats={eventStats}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsAddItemModalOpen(true)}
          className="bg-party-coral hover:bg-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse-slow"
          size="icon"
        >
          <Plus className="text-xl" />
        </Button>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        eventId={eventId}
        defaultCategory={activeCategory}
      />
    </div>
  );
}
