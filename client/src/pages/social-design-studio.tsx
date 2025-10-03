import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Share2,
  Download,
  Heart,
  MessageCircle,
  Palette,
  Sparkles,
  Star,
  Copy,
  Edit3,
  Eye,
  Shuffle,
  Layers,
  Instagram,
  Facebook,
  Twitter,
  Music,
  Camera,
  Zap,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  Check,
  Send,
  Bookmark,
  Flag,
  Users,
  Clock,
  TrendingUp,
  TreePine,
  Cake,
} from "lucide-react";

interface DesignElement {
  id: string;
  type: "text" | "image" | "shape" | "background";
  content: string;
  style: {
    fontSize?: number;
    color?: string;
    fontFamily?: string;
    background?: string;
    borderRadius?: number;
    opacity?: number;
    filter?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  zIndex: number;
}

interface DesignComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  position: { x: number; y: number };
  timestamp: string;
  replies: DesignComment[];
  resolved: boolean;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: any;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  specs: {
    maxFileSize: string;
    formats: string[];
    safeZones: { top: number; bottom: number; left: number; right: number };
  };
}

export default function SocialDesignStudio() {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(
    null
  );
  const [comments, setComments] = useState<DesignComment[]>([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentPosition, setCommentPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [remixSettings, setRemixSettings] = useState({
    colorHue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    blur: 0,
  });
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "design" | "mockup" | "animation"
  >("design");
  const [isSharing, setIsSharing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const socialPlatforms: SocialPlatform[] = [
    {
      id: "instagram-story",
      name: "Instagram Story",
      icon: Instagram,
      dimensions: { width: 1080, height: 1920 },
      aspectRatio: "9:16",
      specs: {
        maxFileSize: "30MB",
        formats: ["JPG", "PNG", "MP4"],
        safeZones: { top: 250, bottom: 250, left: 100, right: 100 },
      },
    },
    {
      id: "instagram-post",
      name: "Instagram Post",
      icon: Instagram,
      dimensions: { width: 1080, height: 1080 },
      aspectRatio: "1:1",
      specs: {
        maxFileSize: "30MB",
        formats: ["JPG", "PNG"],
        safeZones: { top: 50, bottom: 50, left: 50, right: 50 },
      },
    },
    {
      id: "facebook-post",
      name: "Facebook Post",
      icon: Facebook,
      dimensions: { width: 1200, height: 630 },
      aspectRatio: "1.91:1",
      specs: {
        maxFileSize: "8MB",
        formats: ["JPG", "PNG"],
        safeZones: { top: 40, bottom: 40, left: 40, right: 40 },
      },
    },
    {
      id: "twitter-card",
      name: "Twitter Card",
      icon: Twitter,
      dimensions: { width: 1200, height: 675 },
      aspectRatio: "16:9",
      specs: {
        maxFileSize: "5MB",
        formats: ["JPG", "PNG"],
        safeZones: { top: 30, bottom: 30, left: 30, right: 30 },
      },
    },
  ];

  // Sample design templates with authentic event data
  const sampleDesigns = {
    "corporate-gala": {
      elements: [
        {
          id: "bg-corporate",
          type: "background" as const,
          content: "",
          style: {
            background:
              "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e1b4b 100%)",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          zIndex: 0,
        },
        {
          id: "text-corp-title",
          type: "text" as const,
          content: "Annual Innovation Summit 2024",
          style: {
            fontSize: 42,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 25 },
          size: { width: 500, height: 60 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-corp-date",
          type: "text" as const,
          content: "December 15, 2024 • Grand Ballroom NYC",
          style: {
            fontSize: 20,
            color: "#e5e7eb",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 45 },
          size: { width: 400, height: 30 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-corp-cta",
          type: "text" as const,
          content: "Register Now • Limited Seats Available",
          style: {
            fontSize: 16,
            color: "#fbbf24",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 70 },
          size: { width: 350, height: 25 },
          rotation: 0,
          zIndex: 2,
        },
      ],
    },
    "birthday-celebration": {
      elements: [
        {
          id: "bg-birthday",
          type: "background" as const,
          content: "",
          style: {
            background:
              "linear-gradient(135deg, #ec4899 0%, #f97316 50%, #eab308 100%)",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          zIndex: 0,
        },
        {
          id: "text-bday-title",
          type: "text" as const,
          content: "Sarah's 25th Birthday Bash",
          style: {
            fontSize: 48,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 30 },
          size: { width: 450, height: 70 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-bday-details",
          type: "text" as const,
          content: "Saturday, Dec 21 • 8 PM • Rooftop Terrace",
          style: {
            fontSize: 22,
            color: "#fef3c7",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 50 },
          size: { width: 400, height: 35 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-bday-theme",
          type: "text" as const,
          content: "✨ Dress Code: Glam & Glitter ✨",
          style: {
            fontSize: 18,
            color: "#fde68a",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 70 },
          size: { width: 300, height: 25 },
          rotation: 0,
          zIndex: 2,
        },
      ],
    },
    "wedding-announcement": {
      elements: [
        {
          id: "bg-wedding",
          type: "background" as const,
          content: "",
          style: {
            background:
              "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          zIndex: 0,
        },
        {
          id: "text-wedding-names",
          type: "text" as const,
          content: "Michael & Jennifer",
          style: {
            fontSize: 52,
            color: "#374151",
            fontFamily: "serif",
          },
          position: { x: 50, y: 25 },
          size: { width: 400, height: 80 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-wedding-date",
          type: "text" as const,
          content: "June 15, 2024",
          style: {
            fontSize: 24,
            color: "#6b7280",
            fontFamily: "serif",
          },
          position: { x: 50, y: 45 },
          size: { width: 200, height: 35 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-wedding-venue",
          type: "text" as const,
          content: "Garden Pavilion • Brooklyn Heights",
          style: {
            fontSize: 18,
            color: "#9ca3af",
            fontFamily: "serif",
          },
          position: { x: 50, y: 65 },
          size: { width: 350, height: 25 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-wedding-rsvp",
          type: "text" as const,
          content: "RSVP by May 1st • Save the Date",
          style: {
            fontSize: 16,
            color: "#d97706",
            fontFamily: "serif",
          },
          position: { x: 50, y: 80 },
          size: { width: 300, height: 20 },
          rotation: 0,
          zIndex: 2,
        },
      ],
    },
    "holiday-party": {
      elements: [
        {
          id: "bg-holiday",
          type: "background" as const,
          content: "",
          style: {
            background:
              "linear-gradient(135deg, #059669 0%, #dc2626 50%, #059669 100%)",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          zIndex: 0,
        },
        {
          id: "text-holiday-title",
          type: "text" as const,
          content: "Holiday Celebration 2024",
          style: {
            fontSize: 46,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 28 },
          size: { width: 480, height: 70 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-holiday-details",
          type: "text" as const,
          content: "December 20 • 7 PM • Winter Wonderland Theme",
          style: {
            fontSize: 20,
            color: "#f0fdf4",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 50 },
          size: { width: 450, height: 30 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-holiday-location",
          type: "text" as const,
          content: "Metropolitan Event Center",
          style: {
            fontSize: 18,
            color: "#dcfce7",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 68 },
          size: { width: 280, height: 25 },
          rotation: 0,
          zIndex: 2,
        },
      ],
    },
    "graduation-party": {
      elements: [
        {
          id: "bg-graduation",
          type: "background" as const,
          content: "",
          style: {
            background:
              "linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #059669 100%)",
          },
          position: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
          rotation: 0,
          zIndex: 0,
        },
        {
          id: "text-grad-title",
          type: "text" as const,
          content: "Congratulations Class of 2024!",
          style: {
            fontSize: 40,
            color: "#ffffff",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 25 },
          size: { width: 520, height: 60 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-grad-name",
          type: "text" as const,
          content: "Celebrating Alex Thompson",
          style: {
            fontSize: 26,
            color: "#e0e7ff",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 45 },
          size: { width: 380, height: 40 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-grad-details",
          type: "text" as const,
          content: "MBA Graduate • Columbia University",
          style: {
            fontSize: 18,
            color: "#c7d2fe",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 65 },
          size: { width: 320, height: 25 },
          rotation: 0,
          zIndex: 2,
        },
        {
          id: "text-grad-celebration",
          type: "text" as const,
          content: "Join us for dinner & celebration • June 8th",
          style: {
            fontSize: 16,
            color: "#a5b4fc",
            fontFamily: "Inter, sans-serif",
          },
          position: { x: 50, y: 78 },
          size: { width: 350, height: 20 },
          rotation: 0,
          zIndex: 2,
        },
      ],
    },
  };

  const [currentDesignType, setCurrentDesignType] = useState(
    "birthday-celebration"
  );

  // Sample comments for collaboration demonstration
  const sampleComments: DesignComment[] = [
    {
      id: "comment-1",
      userId: "user-1",
      userName: "Emily Chen",
      userAvatar: "/api/placeholder/32/32",
      content:
        "Love the color scheme! Could we make the date text a bit larger?",
      position: { x: 52, y: 52 },
      timestamp: "2024-12-15T10:30:00Z",
      replies: [],
      resolved: false,
    },
    {
      id: "comment-2",
      userId: "user-2",
      userName: "Marcus Johnson",
      userAvatar: "/api/placeholder/32/32",
      content: "The gradient looks amazing! Perfect for the birthday theme.",
      position: { x: 30, y: 25 },
      timestamp: "2024-12-15T11:15:00Z",
      replies: [
        {
          id: "reply-1",
          userId: "user-3",
          userName: "Sarah Designer",
          userAvatar: "/api/placeholder/32/32",
          content: "Thanks! I was going for that festive vibe.",
          position: { x: 0, y: 0 },
          timestamp: "2024-12-15T11:20:00Z",
          replies: [],
          resolved: false,
        },
      ],
      resolved: true,
    },
  ];

  const switchDesign = (designType: string) => {
    if (sampleDesigns[designType as keyof typeof sampleDesigns]) {
      setCurrentDesignType(designType);
      setElements(
        sampleDesigns[designType as keyof typeof sampleDesigns].elements
      );
      setComments(designType === "birthday-celebration" ? sampleComments : []);
    }
  };

  useEffect(() => {
    // Initialize with birthday celebration design
    setElements(sampleDesigns["birthday-celebration"].elements);
    setComments(sampleComments);
    setSelectedPlatform(socialPlatforms[0]);
  }, []);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const shareDesign = async (platform: string) => {
    setIsSharing(true);
    triggerConfetti();

    // Simulate API call to generate social media post
    setTimeout(() => {
      setIsSharing(false);
    }, 2000);
  };

  const addComment = (x: number, y: number) => {
    if (!newComment.trim()) return;

    const comment: DesignComment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      userName: "Sarah Designer",
      userAvatar: "/api/placeholder/32/32",
      content: newComment,
      position: { x, y },
      timestamp: new Date().toISOString(),
      replies: [],
      resolved: false,
    };

    setComments([...comments, comment]);
    setNewComment("");
    setCommentPosition(null);
  };

  const applyRemix = () => {
    const remixedElements = elements.map((element) => {
      if (element.type === "background") {
        return {
          ...element,
          style: {
            ...element.style,
            filter: `hue-rotate(${remixSettings.colorHue}deg) saturate(${remixSettings.saturation}%) brightness(${remixSettings.brightness}%) contrast(${remixSettings.contrast}%) blur(${remixSettings.blur}px)`,
          },
        };
      }
      return element;
    });
    setElements(remixedElements);
  };

  const generateMockup = (platform: SocialPlatform) => {
    // Get current design elements for dynamic content
    const backgroundElement = elements.find((el) => el.type === "background");
    const textElements = elements.filter((el) => el.type === "text");
    const mainTitle =
      textElements.find((el) => el.style.fontSize && el.style.fontSize > 30)
        ?.content || "Event Title";
    const subtitle =
      textElements.find(
        (el) =>
          el.style.fontSize && el.style.fontSize <= 30 && el.style.fontSize > 18
      )?.content || "Event Details";

    return (
      <div className="relative bg-gray-900 p-4 rounded-lg">
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-linear-to-r from-purple-400 to-pink-400 rounded-full" />
            <div>
              <div className="text-white font-medium text-sm">
                vibes_party_app
              </div>
              <div className="text-gray-400 text-xs">2 minutes ago</div>
            </div>
          </div>

          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              aspectRatio: platform.aspectRatio,
              maxWidth: "300px",
              background:
                backgroundElement?.style.background ||
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              filter: backgroundElement?.style.filter || "none",
            }}
          >
            {/* Safe zones overlay */}
            <div
              className="absolute border-2 border-yellow-400 border-dashed opacity-30"
              style={{
                top: `${
                  (platform.specs.safeZones.top / platform.dimensions.height) *
                  100
                }%`,
                left: `${
                  (platform.specs.safeZones.left / platform.dimensions.width) *
                  100
                }%`,
                right: `${
                  (platform.specs.safeZones.right / platform.dimensions.width) *
                  100
                }%`,
                bottom: `${
                  (platform.specs.safeZones.bottom /
                    platform.dimensions.height) *
                  100
                }%`,
              }}
            />

            {/* Dynamic design preview */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <h2 className="text-lg font-bold mb-2 line-clamp-2">
                {mainTitle}
              </h2>
              <p className="text-sm opacity-90 line-clamp-2">{subtitle}</p>
              {textElements.length > 2 && (
                <p className="text-xs opacity-75 mt-1 line-clamp-1">
                  {textElements[2]?.content}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 text-white">
            <div className="flex items-center gap-4">
              <Heart className="w-5 h-5" />
              <MessageCircle className="w-5 h-5" />
              <Share2 className="w-5 h-5" />
            </div>
            <Bookmark className="w-5 h-5" />
          </div>

          <div className="text-white text-sm mt-2">
            <span className="font-medium">
              {Math.floor(Math.random() * 2000) + 500} likes
            </span>
          </div>

          <div className="text-white text-sm mt-1">
            <span className="font-medium">vibes_party_app</span>
            <span className="text-gray-300 ml-2">
              {mainTitle.length > 20
                ? mainTitle.substring(0, 20) + "..."
                : mainTitle}
              Check out this amazing event! 🎉
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Confetti Animation */}
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-linear-to-r from-purple-400 to-pink-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#192133] shadow-xs ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Social Design Studio
              </h1>
              <p className="text-white">
                Create, collaborate, and share stunning social media designs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Comments ({comments.length})
              </Button>
              <Button onClick={() => shareDesign("instagram")}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Design
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-6">
        {/* Left Sidebar - Tools */}
        <div className="col-span-3 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Design Templates
            </h3>
            <div className="space-y-2">
              <Button
                variant={
                  currentDesignType === "birthday-celebration"
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => switchDesign("birthday-celebration")}
              >
                <Star className="w-4 h-4 mr-2" />
                Sarah's Birthday Bash
              </Button>
              <Button
                variant={
                  currentDesignType === "corporate-gala" ? "default" : "outline"
                }
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => switchDesign("corporate-gala")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Innovation Summit
              </Button>
              <Button
                variant={
                  currentDesignType === "wedding-announcement"
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => switchDesign("wedding-announcement")}
              >
                <Heart className="w-4 h-4 mr-2" />
                Michael & Jennifer
              </Button>
              <Button
                variant={
                  currentDesignType === "holiday-party" ? "default" : "outline"
                }
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => switchDesign("holiday-party")}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Holiday Celebration
              </Button>
              <Button
                variant={
                  currentDesignType === "graduation-party"
                    ? "default"
                    : "outline"
                }
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => switchDesign("graduation-party")}
              >
                <Star className="w-4 h-4 mr-2" />
                Graduation Party
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Design Tools
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Camera className="w-4 h-4 mr-2" />
                Add Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Layers className="w-4 h-4 mr-2" />
                Add Shape
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Effect
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              Interactive Remix
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Color Hue</Label>
                <Slider
                  value={[remixSettings.colorHue]}
                  onValueChange={([value]) =>
                    setRemixSettings({ ...remixSettings, colorHue: value })
                  }
                  max={360}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Saturation</Label>
                <Slider
                  value={[remixSettings.saturation]}
                  onValueChange={([value]) =>
                    setRemixSettings({ ...remixSettings, saturation: value })
                  }
                  max={200}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Brightness</Label>
                <Slider
                  value={[remixSettings.brightness]}
                  onValueChange={([value]) =>
                    setRemixSettings({ ...remixSettings, brightness: value })
                  }
                  max={200}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <Button size="sm" onClick={applyRemix} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Apply Remix
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Social Platforms
            </h3>
            <div className="space-y-2">
              {socialPlatforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={
                    selectedPlatform?.id === platform.id ? "default" : "outline"
                  }
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedPlatform(platform)}
                >
                  <platform.icon className="w-4 h-4 mr-2" />
                  {platform.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="col-span-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Design Canvas</h3>
              <div className="flex gap-2">
                <Button
                  variant={previewMode === "design" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("design")}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Design
                </Button>
                <Button
                  variant={previewMode === "mockup" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mockup")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Mockup
                </Button>
                <Button
                  variant={previewMode === "animation" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("animation")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Animation
                </Button>
              </div>
            </div>

            {previewMode === "design" && (
              <div
                ref={canvasRef}
                className="relative w-full h-96 bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-crosshair"
                onClick={(e) => {
                  if (commentPosition) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    addComment(x, y);
                  }
                }}
                style={{
                  aspectRatio: selectedPlatform?.aspectRatio || "16:9",
                }}
              >
                {/* Background */}
                {elements
                  .filter((el) => el.type === "background")
                  .map((element) => (
                    <div
                      key={element.id}
                      className="absolute inset-0"
                      style={{
                        background: element.style.background,
                        filter: element.style.filter || "none",
                      }}
                    />
                  ))}

                {/* Other elements */}
                {elements
                  .filter((el) => el.type !== "background")
                  .map((element) => (
                    <div
                      key={element.id}
                      className="absolute cursor-move hover:ring-2 hover:ring-blue-400"
                      style={{
                        left: `${element.position.x}%`,
                        top: `${element.position.y}%`,
                        width: `${element.size.width}px`,
                        height: `${element.size.height}px`,
                        transform: `rotate(${element.rotation}deg)`,
                        zIndex: element.zIndex,
                        fontSize: element.style.fontSize,
                        color: element.style.color,
                        fontFamily: element.style.fontFamily,
                        opacity: element.style.opacity || 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElement(element);
                      }}
                    >
                      {element.content}
                    </div>
                  ))}

                {/* Comments */}
                {showComments &&
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="absolute"
                      style={{
                        left: `${comment.position.x}%`,
                        top: `${comment.position.y}%`,
                      }}
                    >
                      <div className="relative">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform" />
                        <div className="absolute top-6 left-0 bg-white rounded-lg shadow-lg p-3 min-w-48 z-10 border">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-linear-to-r from-purple-400 to-pink-400 rounded-full shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {comment.userName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    comment.timestamp
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                >
                                  Reply
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                >
                                  <Check className="w-3 h-3" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Safe zones overlay for selected platform */}
                {selectedPlatform && (
                  <div
                    className="absolute border-2 border-yellow-400 border-dashed opacity-50 pointer-events-none"
                    style={{
                      top: `${
                        (selectedPlatform.specs.safeZones.top /
                          selectedPlatform.dimensions.height) *
                        100
                      }%`,
                      left: `${
                        (selectedPlatform.specs.safeZones.left /
                          selectedPlatform.dimensions.width) *
                        100
                      }%`,
                      right: `${
                        (selectedPlatform.specs.safeZones.right /
                          selectedPlatform.dimensions.width) *
                        100
                      }%`,
                      bottom: `${
                        (selectedPlatform.specs.safeZones.bottom /
                          selectedPlatform.dimensions.height) *
                        100
                      }%`,
                    }}
                  />
                )}
              </div>
            )}

            {previewMode === "mockup" && selectedPlatform && (
              <div className="flex justify-center">
                {generateMockup(selectedPlatform)}
              </div>
            )}

            {previewMode === "animation" && (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Animation Preview</h4>
                    <p className="text-gray-600">
                      Interactive animations and transitions for social media
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comment Input */}
            {commentPosition && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Label className="text-sm font-medium">Add Comment</Label>
                <div className="flex gap-2 mt-2">
                  <Textarea
                    placeholder="Leave a comment or suggestion..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const rect = canvasRef.current?.getBoundingClientRect();
                        if (rect) {
                          addComment(50, 50); // Default position
                        }
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCommentPosition(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar - Properties & Export */}
        <div className="col-span-3 space-y-4">
          {selectedElement && (
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Element Properties</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Content</Label>
                  <Input
                    value={selectedElement.content}
                    onChange={(e) => {
                      const updated = {
                        ...selectedElement,
                        content: e.target.value,
                      };
                      setElements(
                        elements.map((el) =>
                          el.id === selectedElement.id ? updated : el
                        )
                      );
                      setSelectedElement(updated);
                    }}
                    className="mt-1"
                  />
                </div>

                {selectedElement.type === "text" && (
                  <>
                    <div>
                      <Label className="text-sm">Font Size</Label>
                      <Slider
                        value={[selectedElement.style.fontSize || 16]}
                        onValueChange={([value]) => {
                          const updated = {
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              fontSize: value,
                            },
                          };
                          setElements(
                            elements.map((el) =>
                              el.id === selectedElement.id ? updated : el
                            )
                          );
                          setSelectedElement(updated);
                        }}
                        max={72}
                        min={8}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Color</Label>
                      <Input
                        type="color"
                        value={selectedElement.style.color || "#000000"}
                        onChange={(e) => {
                          const updated = {
                            ...selectedElement,
                            style: {
                              ...selectedElement.style,
                              color: e.target.value,
                            },
                          };
                          setElements(
                            elements.map((el) =>
                              el.id === selectedElement.id ? updated : el
                            )
                          );
                          setSelectedElement(updated);
                        }}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export & Share
            </h3>

            {selectedPlatform && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <selectedPlatform.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">
                      {selectedPlatform.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>
                      Size: {selectedPlatform.dimensions.width}×
                      {selectedPlatform.dimensions.height}
                    </div>
                    <div>Ratio: {selectedPlatform.aspectRatio}</div>
                    <div>Max: {selectedPlatform.specs.maxFileSize}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => shareDesign(selectedPlatform.id)}
                    disabled={isSharing}
                  >
                    {isSharing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share to {selectedPlatform.name}
                      </>
                    )}
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download {selectedPlatform.specs.formats[0]}
                  </Button>

                  <Button variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Collaboration
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setCommentPosition({ x: 50, y: 50 })}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Add Comment
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Flag className="w-4 h-4 mr-2" />
                Report Issue
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Clock className="w-4 h-4 mr-2" />
                Version History
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Views</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Shares</span>
                <span className="font-medium">83</span>
              </div>
              <div className="flex justify-between">
                <span>Comments</span>
                <span className="font-medium">{comments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Engagement Rate</span>
                <span className="font-medium text-green-600">12.4%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
