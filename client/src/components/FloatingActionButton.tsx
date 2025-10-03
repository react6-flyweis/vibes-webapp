import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  ShoppingBag, 
  Sparkles, 
  X, 
  Camera, 
  Music,
  Calendar,
  Users,
  Palette,
  Zap
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  path: string;
  color: string;
  description: string;
}

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: "create-event",
      label: "Create Event",
      icon: Plus,
      path: "/create-event",
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Plan your perfect party"
    },
    {
      id: "find-events",
      label: "Find Events",
      icon: Search,
      path: "/find-events",
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Discover amazing parties"
    },
    {
      id: "ai-designer",
      label: "AI Designer",
      icon: Sparkles,
      path: "/ai-party-designer",
      color: "bg-emerald-500 hover:bg-emerald-600",
      description: "AI-powered event planning"
    },
    {
      id: "vibe-mall",
      label: "VibeMall",
      icon: ShoppingBag,
      path: "/vibe-mall",
      color: "bg-orange-500 hover:bg-orange-600",
      description: "Shop party essentials"
    },
    {
      id: "ar-camera",
      label: "AR Camera",
      icon: Camera,
      path: "/immersive-party-cam",
      color: "bg-pink-500 hover:bg-pink-600",
      description: "360° party recording"
    },
    {
      id: "music-voting",
      label: "Music Voting",
      icon: Music,
      path: "/live-music-voting",
      color: "bg-green-500 hover:bg-green-600",
      description: "Control the playlist"
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-4">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="transform transition-all duration-300 ease-out"
              style={{
                transform: `translateY(${isOpen ? 0 : 20}px)`,
                opacity: isOpen ? 1 : 0,
                transitionDelay: `${index * 50}ms`
              }}
            >
              <Link href={action.path}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-white dark:bg-slate-800 w-56">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">{action.label}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}

          {/* Additional Quick Features */}
          <Card className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 w-56">
            <CardContent className="p-4">
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <h4 className="font-medium text-sm mb-1">Explore More</h4>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <Link href="/global-vibe-passport">
                    <div className="text-center group cursor-pointer">
                      <Users className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">Passport</p>
                    </div>
                  </Link>
                  <Link href="/vibes-card-studio">
                    <div className="text-center group cursor-pointer">
                      <Palette className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">Design</p>
                    </div>
                  </Link>
                  <Link href="/system-overview">
                    <div className="text-center group cursor-pointer">
                      <Calendar className="w-5 h-5 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-xs">System</p>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600 rotate-45' 
            : 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
        }`}
        size="lg"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Badge for notifications */}
      {!isOpen && (
        <Badge className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
          3
        </Badge>
      )}
    </div>
  );
}