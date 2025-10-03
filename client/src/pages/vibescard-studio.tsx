import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import {
  Palette,
  Type,
  Image,
  Music,
  Video,
  Mic,
  Sparkles,
  Download,
  Share2,
  Eye,
  Layers,
  Move,
  RotateCcw,
  Trash2,
  Copy,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  Coins,
  Leaf,
  Shuffle,
  Users,
  X,
  Link,
  MessageSquare,
  ThumbsUp,
  Clock,
  Camera,
  Gift,
  Globe,
  Smartphone,
  Monitor,
  Upload,
  Plus,
  Save,
  Edit,
  Settings,
  ChevronDown,
  ChevronUp,
  Maximize,
  Mail,
  QrCode,
  Minimize,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

interface CanvasElement {
  id: string;
  type: "text" | "image" | "video" | "audio" | "3d" | "animation" | "sticker";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  content: any;
  style: any;
  animation?: string;
  interactive?: boolean;
  // 3D & Animation properties
  animationType?:
    | "float"
    | "bounce"
    | "spin"
    | "pulse"
    | "swing"
    | "wobble"
    | "confetti";
  animationSpeed?: "slow" | "normal" | "fast";
  animationDirection?: "up" | "down" | "left" | "right" | "circular";
  touchResponsive?: boolean;
  tiltResponsive?: boolean;
  particleCount?: number;
  depth?: number;
  perspective?: number;
}

interface InviteTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: CanvasElement[];
  style: any;
}

interface AudioGreeting {
  id: string;
  url: string;
  duration: number;
  waveform: number[];
  autoPlay: boolean;
}

export default function VibesCardStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [inviteTitle, setInviteTitle] = useState("Your Amazing Event");
  const [inviteMessage, setInviteMessage] = useState("");
  const [cardStyle, setCardStyle] = useState({
    backgroundColor: "#1a1a2e",
    backgroundImage: "",
    fontFamily: "Inter",
    primaryColor: "#ff6b6b",
    secondaryColor: "#4ecdc4",
    accentColor: "#45b7d1",
  });
  const [audioGreeting, setAudioGreeting] = useState<AudioGreeting | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [publishSettings, setPublishSettings] = useState({
    enableTracking: true,
    enableSharing: true,
    enableRSVP: true,
    requireNFT: false,
    ecoFriendly: true,
    vendorBranding: false,
  });
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [guestPhotos, setGuestPhotos] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [designComplexity, setDesignComplexity] = useState(0);
  const [templateTransitioning, setTemplateTransitioning] = useState(false);
  const [showCollabTooltip, setShowCollabTooltip] = useState(false);
  const [draggedTemplate, setDraggedTemplate] = useState<any>(null);
  const [sharedDesigns, setSharedDesigns] = useState<any[]>([]);
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [showPreviewCarousel, setShowPreviewCarousel] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [aiColorSuggestions, setAiColorSuggestions] = useState<any[]>([]);
  const [decorationCustomizer, setDecorationCustomizer] = useState({
    showCustomizer: false,
    selectedDecoration: null as CanvasElement | null,
    customizationType: "position" as "position" | "style" | "animation",
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch templates from API
  const { data: vibesStudioData, isLoading } = useQuery({
    queryKey: ["/api/vibescard-studio"],
  });

  // Fetch shared designs
  const { data: sharedDesignsData } = useQuery({
    queryKey: ["/api/shared-designs"],
  });

  // Share design mutation
  const shareDesignMutation = useMutation({
    mutationFn: async (designData: any) => {
      return apiRequest("POST", "/api/share-design", designData);
    },
    onSuccess: (data) => {
      setShareableLink(data.shareableLink);
      toast({
        title: "Design Shared!",
        description: "Your design has been shared successfully",
      });
    },
  });

  // Remix design mutation
  const remixDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      return apiRequest("POST", `/api/remix-design/${designId}`);
    },
    onSuccess: (data) => {
      setSelectedTemplate(data.template);
      setCanvasElements(data.elements || []);
      toast({
        title: "Design Remixed!",
        description: "Design has been loaded for remixing",
      });
      setShowRemixModal(false);
    },
  });

  // Generate AI Color Palette mutation
  const generateColorPaletteMutation = useMutation({
    mutationFn: async (eventType: string) => {
      return apiRequest("POST", "/api/vibescard-studio/color-palette", {
        eventType,
      });
    },
    onSuccess: (data) => {
      setAiColorSuggestions(data.palettes);
      toast({
        title: "AI Color Palettes Generated!",
        description: "New color combinations ready for your event",
      });
    },
  });

  // Export Social Media Story mutation
  const exportStoryMutation = useMutation({
    mutationFn: async (platform: string) => {
      setIsGeneratingStory(true);
      return apiRequest("POST", "/api/vibescard-studio/export-story", {
        platform,
        elements: canvasElements,
        style: cardStyle,
      });
    },
    onSuccess: (data) => {
      setIsGeneratingStory(false);
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = `vibes-story-${Date.now()}.${data.format}`;
      link.click();
      toast({
        title: "Story Exported!",
        description: `Your ${data.platform} story is ready to share`,
      });
    },
    onError: () => {
      setIsGeneratingStory(false);
    },
  });

  const templates: InviteTemplate[] = (vibesStudioData as any)?.templates || [];

  // Get unique categories for filtering
  const categories = [
    "All",
    ...Array.from(new Set(templates.map((t) => t.category))),
  ];

  // Filter templates by selected category
  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  // AI-powered design complexity analysis
  const calculateDesignComplexity = (elements: CanvasElement[]) => {
    let complexity = 0;

    // Base complexity from element count
    complexity += elements.length * 5;

    // Animation complexity
    const animatedElements = elements.filter((el) => el.animationType);
    complexity += animatedElements.length * 15;

    // High-complexity animations
    const complexAnimations = animatedElements.filter(
      (el) => el.animationType === "confetti" || el.animationType === "spin"
    );
    complexity += complexAnimations.length * 10;

    // Touch/tilt responsive elements
    const responsiveElements = elements.filter(
      (el) => el.touchResponsive || el.tiltResponsive
    );
    complexity += responsiveElements.length * 8;

    // 3D elements
    const threeDElements = elements.filter((el) => el.type === "3d");
    complexity += threeDElements.length * 12;

    // Multiple font families
    const fontFamilies = new Set(
      elements
        .filter((el) => el.style?.fontFamily)
        .map((el) => el.style.fontFamily)
    );
    if (fontFamilies.size > 2) complexity += (fontFamilies.size - 2) * 5;

    // Color variety
    const colors = new Set(
      elements.filter((el) => el.style?.color).map((el) => el.style.color)
    );
    if (colors.size > 4) complexity += (colors.size - 4) * 3;

    return Math.min(Math.max(complexity, 0), 100);
  };

  // Function to apply a complete template with transition effect
  const applyTemplate = (template: any) => {
    console.log("Applying template:", template);

    setTemplateTransitioning(true);
    setSelectedTemplate(template.id);

    // Immediately apply styling and elements
    if (template.elements && template.elements.length > 0) {
      console.log("Template elements found:", template.elements.length);

      const processedElements = template.elements.map((element: any) => ({
        ...element,
        id:
          element.id ||
          `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }));

      setCanvasElements(processedElements);

      // Calculate complexity for new design
      const complexity = calculateDesignComplexity(processedElements);
      setDesignComplexity(complexity);
    } else {
      console.log("No elements found in template");
      setCanvasElements([]);
      setDesignComplexity(0);
    }

    // Apply template styling with proper background
    const newStyle = {
      backgroundColor: template.style?.backgroundColor || "#1a1a2e",
      backgroundImage:
        template.style?.gradient || template.style?.backgroundImage || "",
      fontFamily: template.style?.fontFamily || "Inter",
      primaryColor: template.style?.primaryColor || "#FFFFFF",
      secondaryColor: template.style?.secondaryColor || "#FFD700",
      accentColor: template.style?.accentColor || "#45b7d1",
    };

    console.log("Applying style:", newStyle);
    setCardStyle(newStyle);

    // Apply canvas background immediately
    setTimeout(() => {
      if (canvasRef.current && template.style?.gradient) {
        console.log("Setting canvas background to:", template.style.gradient);
        canvasRef.current.style.background = template.style.gradient;
      }
    }, 100);

    // Set template content
    setInviteTitle(template.name || "Your Amazing Event");
    setInviteMessage("Join us for an unforgettable celebration!");

    setTimeout(() => {
      setTemplateTransitioning(false);
    }, 300);

    toast({
      title: "Template Applied!",
      description: `${template.name} template loaded with ${
        template.elements?.length || 0
      } elements`,
    });
  };

  // One-click social media story export
  const exportToSocialStory = (
    platform: "instagram" | "facebook" | "twitter"
  ) => {
    const canvasData = {
      elements: canvasElements,
      style: cardStyle,
      title: inviteTitle,
      dimensions:
        platform === "instagram"
          ? { width: 1080, height: 1920 }
          : { width: 1200, height: 630 },
    };

    // Create downloadable image
    const canvas = document.createElement("canvas");
    canvas.width = canvasData.dimensions.width;
    canvas.height = canvasData.dimensions.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Apply background
      ctx.fillStyle = cardStyle.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add title
      ctx.fillStyle = cardStyle.primaryColor;
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText(inviteTitle, canvas.width / 2, 100);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `vibes-card-${platform}-story.png`;
          a.click();
          URL.revokeObjectURL(url);

          toast({
            title: "Story Exported!",
            description: `Your design has been exported for ${
              platform.charAt(0).toUpperCase() + platform.slice(1)
            }.`,
          });
        }
      }, "image/png");
    }
  };

  // 3D Assets and animations
  const threeDAssets = [
    {
      id: "confetti",
      name: "Floating Confetti",
      type: "animation",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
    {
      id: "balloons",
      name: "Party Balloons",
      type: "3d",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
    {
      id: "dj-deck",
      name: "DJ Equipment",
      type: "3d",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
    {
      id: "neon-sign",
      name: "Neon Sign",
      type: "animation",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
    {
      id: "champagne",
      name: "Champagne Bottle",
      type: "3d",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
    {
      id: "disco-ball",
      name: "Disco Ball",
      type: "animation",
      thumbnail:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
    },
  ];

  // AI Style suggestions
  const aiStyleSuggestions = [
    {
      theme: "Boho Chic",
      colors: ["#d4a574", "#c19a6b", "#8b7355"],
      fonts: ["Playfair Display", "Lora"],
      elements: ["dried flowers", "mandala patterns"],
    },
    {
      theme: "Cyberpunk",
      colors: ["#ff00ff", "#00ffff", "#ffff00"],
      fonts: ["Orbitron", "Rajdhani"],
      elements: ["neon glows", "grid patterns"],
    },
    {
      theme: "Minimalist",
      colors: ["#ffffff", "#f8f9fa", "#343a40"],
      fonts: ["Inter", "Helvetica"],
      elements: ["clean lines", "white space"],
    },
    {
      theme: "Retro 80s",
      colors: ["#ff6b9d", "#c44569", "#f8b500"],
      fonts: ["Passion One", "Righteous"],
      elements: ["synthwave", "geometric shapes"],
    },
  ];

  const { data: studioData } = useQuery({
    queryKey: ["/api/vibescard-studio"],
  });

  const saveCardMutation = useMutation({
    mutationFn: async (cardData: any) => {
      return await apiRequest("/api/vibescard-studio/save", "POST", cardData);
    },
    onSuccess: () => {
      toast({
        title: "Card Saved Successfully!",
        description: "Your VibesCard has been saved to your studio collection.",
      });
    },
  });

  const generateAISuggestionsMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return await apiRequest("/api/vibescard-studio/ai-suggestions", "POST", {
        prompt,
      });
    },
    onSuccess: (data) => {
      setAiSuggestions(data.suggestions);
    },
  });

  const createNFTMutation = useMutation({
    mutationFn: async (cardData: any) => {
      return await apiRequest(
        "/api/vibescard-studio/create-nft",
        "POST",
        cardData
      );
    },
    onSuccess: (data) => {
      toast({
        title: "NFT Invitation Created!",
        description: `Your unique NFT invitation has been minted. Token ID: ${data.tokenId}`,
      });
    },
  });

  // Canvas manipulation functions
  const addElement = useCallback(
    (type: string, content: any) => {
      const newElement: CanvasElement = {
        id: `element_${Date.now()}`,
        type: type as any,
        x: 100,
        y: 100,
        width: type === "text" ? 200 : 150,
        height: type === "text" ? 50 : 150,
        rotation: 0,
        opacity: 1,
        zIndex: canvasElements.length + 1,
        content,
        style: {},
        interactive: type === "3d" || type === "animation",
      };

      setCanvasElements((prev) => {
        const updated = [...prev, newElement];
        setDesignComplexity(calculateDesignComplexity(updated));
        return updated;
      });
      setSelectedElement(newElement.id);
    },
    [canvasElements.length]
  );

  // Enhanced drag and drop handlers for templates and elements
  const handleTemplateDragStart = (
    e: React.DragEvent,
    template: InviteTemplate
  ) => {
    setDraggedTemplate(template);
    e.dataTransfer.setData("template-data", JSON.stringify(template));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle template drop
    const templateData = e.dataTransfer.getData("template-data");
    if (templateData || draggedTemplate) {
      const template = templateData
        ? JSON.parse(templateData)
        : draggedTemplate;
      applyTemplate(template);
      setDraggedTemplate(null);
      return;
    }

    // Handle element drop
    const elementType = e.dataTransfer.getData("element-type");
    const elementContent = e.dataTransfer.getData("element-content");

    if (elementType) {
      try {
        const content = elementContent ? JSON.parse(elementContent) : {};
        addElement(elementType as CanvasElement["type"], content);
      } catch (error) {
        console.error("Error parsing element content:", error);
        addElement(elementType as CanvasElement["type"], {});
      }
    }
  };

  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setCanvasElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback((id: string) => {
    setCanvasElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElement(null);
  }, []);

  const duplicateElement = useCallback(
    (id: string) => {
      const element = canvasElements.find((el) => el.id === id);
      if (element) {
        const duplicate = {
          ...element,
          id: `element_${Date.now()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: Math.max(...canvasElements.map((el) => el.zIndex)) + 1,
        };
        setCanvasElements((prev) => [...prev, duplicate]);
      }
    },
    [canvasElements]
  );

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // In a real implementation, you would use MediaRecorder API
      setTimeout(() => {
        setIsRecording(false);
        setAudioGreeting({
          id: `audio_${Date.now()}`,
          url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
          duration: 5.2,
          waveform: Array.from({ length: 50 }, () => Math.random() * 100),
          autoPlay: false,
        });
        toast({
          title: "Audio Greeting Recorded!",
          description: "Your voice message has been added to the invitation.",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Recording Failed",
        description:
          "Please allow microphone access to record audio greetings.",
        variant: "destructive",
      });
    }
  };

  const generateAISuggestions = () => {
    const prompt = `Create invitation copy for: ${inviteTitle}. Style: ${selectedTemplate}`;
    generateAISuggestionsMutation.mutate(prompt);
  };

  const publishCard = () => {
    const cardData = {
      title: inviteTitle,
      message: inviteMessage,
      elements: canvasElements,
      style: cardStyle,
      audioGreeting,
      settings: publishSettings,
      guestPhotos,
      collaborativeMode,
    };

    if (publishSettings.requireNFT) {
      createNFTMutation.mutate(cardData);
    } else {
      saveCardMutation.mutate(cardData);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            VibesCard Studio
          </h1>
          <p className="text-xl text-purple-200 mb-6">
            Create living, interactive invitation experiences
          </p>

          {/* Collaborative Design Toolbar */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              onClick={() => setShowShareModal(true)}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!selectedTemplate}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Design
            </Button>

            <Button
              onClick={() => setShowRemixModal(true)}
              variant="outline"
              className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Browse Remixes
            </Button>

            <Button
              onClick={() => setCollaborativeMode(!collaborativeMode)}
              variant={collaborativeMode ? "default" : "outline"}
              className={
                collaborativeMode
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-400 text-green-300 hover:bg-green-400 hover:text-white"
              }
            >
              <Users className="w-4 h-4 mr-2" />
              {collaborativeMode ? "Exit Collab" : "Collaborate"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Tools & Assets */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="templates" className="text-xs">
                  Templates
                </TabsTrigger>
                <TabsTrigger value="ecards" className="text-xs">
                  E-Cards
                </TabsTrigger>
                <TabsTrigger value="elements" className="text-xs">
                  Elements
                </TabsTrigger>
                <TabsTrigger value="3d" className="text-xs">
                  3D & Motion
                </TabsTrigger>
                <TabsTrigger value="vendors" className="text-xs">
                  Vendors
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs">
                  Media
                </TabsTrigger>
                <TabsTrigger value="ai" className="text-xs">
                  AI
                </TabsTrigger>
              </TabsList>

              {/* Templates Tab */}
              <TabsContent value="templates" className="space-y-4">
                <Card className="border-purple-500 bg-linear-to-r from-purple-900/20 to-pink-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-purple-300 font-bold">
                      Dynamic Templates
                    </CardTitle>
                    <p className="text-xs text-gray-400 mb-2">
                      Click or drag templates to apply them to your canvas
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={
                            selectedCategory === category
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className={`text-xs ${
                            selectedCategory === category
                              ? "bg-purple-600 text-white"
                              : "border-purple-400 text-purple-300 hover:bg-purple-700"
                          }`}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" />
                      </div>
                    ) : (
                      filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`relative cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-lg ${
                            selectedTemplate === template.id
                              ? "border-purple-400 shadow-lg shadow-purple-500/25"
                              : "border-gray-600 hover:border-purple-500"
                          }`}
                          draggable
                          onDragStart={(e) =>
                            handleTemplateDragStart(e, template)
                          }
                          onClick={() => applyTemplate(template)}
                        >
                          <div
                            className="w-full h-28 flex items-center justify-center relative"
                            style={{
                              background: template.style?.gradient || "#1a1a2e",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <span className="text-white font-bold text-sm drop-shadow-lg z-10">
                              {template.name}
                            </span>
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Badge
                                variant="secondary"
                                className="text-xs bg-black/50 text-white"
                              >
                                {template.elements?.length || 0} elements
                              </Badge>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/90 to-transparent p-2">
                            <p className="text-white text-xs font-medium">
                              {template.name}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <Badge
                                variant="outline"
                                className="text-xs border-purple-400 text-purple-300 bg-purple-900/50"
                              >
                                {template.category}
                              </Badge>
                              <span className="text-xs text-gray-300 font-medium">
                                Drag & Drop
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* E-Cards Tab */}
              <TabsContent value="ecards" className="space-y-4">
                <Card className="border-emerald-500 bg-linear-to-r from-emerald-900/20 to-teal-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-emerald-300 font-bold flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Professional E-Cards
                    </CardTitle>
                    <p className="text-xs text-gray-400 mb-2">
                      Create sophisticated digital invitations inspired by
                      premium platforms
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        "Graduation",
                        "Wedding",
                        "Birthday",
                        "Corporate",
                        "Holiday",
                        "Anniversary",
                        "Baby Shower",
                        "Retirement",
                      ].map((occasion) => (
                        <Button
                          key={occasion}
                          variant="outline"
                          size="sm"
                          className="text-xs border-emerald-400 text-emerald-300 hover:bg-emerald-700"
                          onClick={() => setSelectedCategory(occasion)}
                        >
                          {occasion}
                        </Button>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Premium E-Card Templates */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          id: "grad_elegant",
                          name: "Elegant Graduation",
                          category: "Graduation",
                          thumbnail: "🎓",
                          style: "elegant",
                          features: [
                            "RSVP Tracking",
                            "Photo Gallery",
                            "Gift Registry",
                          ],
                        },
                        {
                          id: "grad_modern",
                          name: "Modern Achievement",
                          category: "Graduation",
                          thumbnail: "🌟",
                          style: "modern",
                          features: [
                            "Video Messages",
                            "Social Share",
                            "Achievement Timeline",
                          ],
                        },
                        {
                          id: "wedding_classic",
                          name: "Classic Romance",
                          category: "Wedding",
                          thumbnail: "💍",
                          style: "classic",
                          features: [
                            "Couple Story",
                            "Registry Links",
                            "Venue Map",
                          ],
                        },
                        {
                          id: "corp_professional",
                          name: "Corporate Excellence",
                          category: "Corporate",
                          thumbnail: "🏢",
                          style: "professional",
                          features: [
                            "Agenda View",
                            "Speaker Bios",
                            "Networking Hub",
                          ],
                        },
                        {
                          id: "birthday_festive",
                          name: "Festive Celebration",
                          category: "Birthday",
                          thumbnail: "🎂",
                          style: "festive",
                          features: [
                            "Memory Lane",
                            "Wish Collection",
                            "Party Games",
                          ],
                        },
                        {
                          id: "holiday_winter",
                          name: "Winter Wonderland",
                          category: "Holiday",
                          thumbnail: "❄️",
                          style: "seasonal",
                          features: [
                            "Secret Santa",
                            "Recipe Exchange",
                            "Photo Booth",
                          ],
                        },
                      ].map((template) => (
                        <div
                          key={template.id}
                          className="relative group cursor-pointer border border-emerald-500/30 rounded-lg p-3 hover:border-emerald-400 transition-all duration-300 bg-linear-to-br from-emerald-800/20 to-teal-800/20"
                          draggable
                          onDragStart={(e) =>
                            handleTemplateDragStart(e, template)
                          }
                          onClick={() => applyTemplate(template)}
                        >
                          <div className="text-2xl mb-2 text-center">
                            {template.thumbnail}
                          </div>
                          <div className="text-xs font-semibold text-emerald-300 mb-1">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-400 mb-2">
                            {template.style}
                          </div>

                          <div className="space-y-1">
                            {template.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 text-xs text-emerald-200"
                              >
                                <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                                {feature}
                              </div>
                            ))}
                          </div>

                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Badge className="bg-emerald-600 text-white text-xs">
                              Premium
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4 bg-emerald-500/30" />

                    {/* E-Card Features */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-emerald-300">
                        Professional Features
                      </h4>

                      <div className="grid grid-cols-1 gap-2">
                        {[
                          {
                            icon: QrCode,
                            label: "QR Code Integration",
                            desc: "Easy check-in & sharing",
                          },
                          {
                            icon: Clock,
                            label: "Calendar Sync",
                            desc: "Auto-add to calendars",
                          },
                          {
                            icon: Globe,
                            label: "Multi-language Support",
                            desc: "Reach global audiences",
                          },
                          {
                            icon: Gift,
                            label: "Gift Registry Links",
                            desc: "Integrated shopping",
                          },
                          {
                            icon: Camera,
                            label: "Photo Collection",
                            desc: "Guest photo sharing",
                          },
                          {
                            icon: MessageSquare,
                            label: "Guest Messages",
                            desc: "Collect well-wishes",
                          },
                        ].map((feature) => (
                          <div
                            key={feature.label}
                            className="flex items-start gap-2 p-2 rounded-lg bg-emerald-800/10 border border-emerald-500/20"
                          >
                            <feature.icon className="w-4 h-4 text-emerald-400 mt-0.5" />
                            <div>
                              <div className="text-xs font-medium text-emerald-300">
                                {feature.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {feature.desc}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4 bg-emerald-500/30" />

                    {/* Advanced Customization */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-emerald-300">
                        Advanced Customization
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-300 hover:bg-emerald-700"
                        >
                          <Palette className="w-3 h-3 mr-1" />
                          Brand Colors
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-300 hover:bg-emerald-700"
                        >
                          <Type className="w-3 h-3 mr-1" />
                          Custom Fonts
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-300 hover:bg-emerald-700"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Logo Upload
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-300 hover:bg-emerald-700"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Layout Tools
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-4 bg-emerald-500/30" />

                    {/* Response & Analytics */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-emerald-300">
                        Response Management
                      </h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-300">
                            RSVP Tracking
                          </span>
                          <Checkbox className="border-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-300">
                            Guest Analytics
                          </span>
                          <Checkbox className="border-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-300">
                            Auto Reminders
                          </span>
                          <Checkbox className="border-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-800/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-300">
                            Guest List Export
                          </span>
                          <Checkbox className="border-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Elements Tab */}
              <TabsContent value="elements" className="space-y-4">
                <Card className="border-blue-500 bg-linear-to-r from-blue-900/20 to-cyan-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-blue-300 font-bold">
                      Basic Elements
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      Drag elements onto your canvas or click to add
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          type: "text",
                          icon: "📝",
                          name: "Text",
                          desc: "Add custom text",
                          content: { text: "Click to edit", fontSize: 24 },
                        },
                        {
                          type: "image",
                          icon: "🖼️",
                          name: "Image",
                          desc: "Upload photos",
                          content: {
                            src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=150&h=150&fit=crop&auto=format",
                          },
                        },
                        {
                          type: "video",
                          icon: "🎥",
                          name: "Video",
                          desc: "Add video content",
                          content: {
                            src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
                          },
                        },
                        {
                          type: "3d",
                          icon: "✨",
                          name: "3D Effect",
                          desc: "Animated elements",
                          content: "🎉",
                        },
                        {
                          type: "sticker",
                          icon: "🎯",
                          name: "Sticker",
                          desc: "Fun decorations",
                          content: "🎊",
                        },
                        {
                          type: "animation",
                          icon: "🎬",
                          name: "Animation",
                          desc: "Motion effects",
                          content: "sparkle",
                        },
                      ].map((element) => (
                        <div
                          key={element.type}
                          className="flex flex-col items-center p-3 bg-gray-800 rounded-lg border border-gray-600 hover:border-blue-400 hover:bg-blue-900/30 cursor-grab active:cursor-grabbing transition-all hover:scale-105"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "element-type",
                              element.type
                            );
                            e.dataTransfer.setData(
                              "element-content",
                              JSON.stringify(element.content)
                            );
                            e.dataTransfer.effectAllowed = "copy";
                          }}
                          onClick={() =>
                            addElement(
                              element.type as CanvasElement["type"],
                              element.content
                            )
                          }
                        >
                          <span className="text-2xl mb-1">{element.icon}</span>
                          <span className="text-xs font-medium text-blue-300">
                            {element.name}
                          </span>
                          <span className="text-xs text-gray-400 text-center">
                            {element.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      3D & Animated Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {threeDAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="relative cursor-pointer rounded-lg overflow-hidden border border-gray-600 hover:border-purple-400 transition-colors"
                          onClick={() =>
                            addElement(asset.type, {
                              assetId: asset.id,
                              name: asset.name,
                            })
                          }
                        >
                          <div className="w-full h-16 bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1">
                            <p className="text-white text-xs">{asset.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 3D & Motion Tab */}
              <TabsContent value="3d" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">3D Party Assets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          name: "Floating Balloons",
                          icon: "🎈",
                          type: "3d",
                          animation: "float",
                        },
                        {
                          name: "DJ Deck",
                          icon: "🎧",
                          type: "3d",
                          animation: "pulse",
                        },
                        {
                          name: "Neon Sign",
                          icon: "💡",
                          type: "3d",
                          animation: "glow",
                        },
                        {
                          name: "Cocktail Glass",
                          icon: "🍸",
                          type: "3d",
                          animation: "swing",
                        },
                        {
                          name: "Disco Ball",
                          icon: "🪩",
                          type: "3d",
                          animation: "spin",
                        },
                        {
                          name: "Confetti Burst",
                          icon: "🎊",
                          type: "animation",
                          animation: "confetti",
                        },
                      ].map((asset) => (
                        <Button
                          key={asset.name}
                          variant="outline"
                          className="h-16 flex flex-col items-center justify-center text-xs hover:bg-purple-600 hover:border-purple-400"
                          onClick={() => {
                            const newElement: CanvasElement = {
                              id: Date.now().toString(),
                              type: asset.type as any,
                              x: 200,
                              y: 200,
                              width: 80,
                              height: 80,
                              rotation: 0,
                              opacity: 1,
                              zIndex: canvasElements.length + 1,
                              content: asset.icon,
                              style: {
                                fontSize: "3rem",
                                filter:
                                  "drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))",
                              },
                              animationType: asset.animation as any,
                              animationSpeed: "normal",
                              touchResponsive: true,
                              tiltResponsive: true,
                              particleCount:
                                asset.name === "Confetti Burst"
                                  ? 50
                                  : undefined,
                            };
                            setCanvasElements([...canvasElements, newElement]);
                          }}
                        >
                          <span className="text-lg mb-1">{asset.icon}</span>
                          <span>{asset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Animation Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedElement && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-gray-300">
                            Animation Type
                          </Label>
                          <Select
                            value={
                              (selectedElement as any)?.animationType || "none"
                            }
                            onValueChange={(value) => {
                              const updated = canvasElements.map((el) =>
                                el.id === (selectedElement as any)?.id
                                  ? { ...el, animationType: value as any }
                                  : el
                              );
                              setCanvasElements(updated);
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Animation</SelectItem>
                              <SelectItem value="float">Float</SelectItem>
                              <SelectItem value="bounce">Bounce</SelectItem>
                              <SelectItem value="spin">Spin</SelectItem>
                              <SelectItem value="pulse">Pulse</SelectItem>
                              <SelectItem value="swing">Swing</SelectItem>
                              <SelectItem value="wobble">Wobble</SelectItem>
                              <SelectItem value="confetti">Confetti</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs text-gray-300">Speed</Label>
                          <Select
                            value={selectedElement.animationSpeed || "normal"}
                            onValueChange={(value) => {
                              const updated = canvasElements.map((el) =>
                                el.id === selectedElement.id
                                  ? { ...el, animationSpeed: value as any }
                                  : el
                              );
                              setCanvasElements(updated);
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="slow">Slow</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="fast">Fast</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="touch-responsive"
                              checked={selectedElement.touchResponsive || false}
                              onCheckedChange={(checked) => {
                                const updated = canvasElements.map((el) =>
                                  el.id === selectedElement.id
                                    ? {
                                        ...el,
                                        touchResponsive: checked as boolean,
                                      }
                                    : el
                                );
                                setCanvasElements(updated);
                              }}
                            />
                            <Label
                              htmlFor="touch-responsive"
                              className="text-xs text-gray-300"
                            >
                              Touch Responsive
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="tilt-responsive"
                              checked={selectedElement.tiltResponsive || false}
                              onCheckedChange={(checked) => {
                                const updated = canvasElements.map((el) =>
                                  el.id === selectedElement.id
                                    ? {
                                        ...el,
                                        tiltResponsive: checked as boolean,
                                      }
                                    : el
                                );
                                setCanvasElements(updated);
                              }}
                            />
                            <Label
                              htmlFor="tilt-responsive"
                              className="text-xs text-gray-300"
                            >
                              Device Tilt Responsive
                            </Label>
                          </div>
                        </div>

                        {selectedElement.animationType === "confetti" && (
                          <div>
                            <Label className="text-xs text-gray-300">
                              Particle Count:{" "}
                              {selectedElement.particleCount || 30}
                            </Label>
                            <Slider
                              value={[selectedElement.particleCount || 30]}
                              onValueChange={([value]) => {
                                const updated = canvasElements.map((el) =>
                                  el.id === selectedElement.id
                                    ? { ...el, particleCount: value }
                                    : el
                                );
                                setCanvasElements(updated);
                              }}
                              max={100}
                              min={10}
                              step={5}
                              className="mt-1"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {!selectedElement && (
                      <p className="text-xs text-gray-500 text-center py-4">
                        Select a 3D element to customize animations
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Motion Presets</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      { name: "Party Mode", desc: "High-energy animations" },
                      { name: "Elegant", desc: "Subtle, refined motion" },
                      {
                        name: "Celebration",
                        desc: "Festive bursts and floats",
                      },
                      { name: "Nightclub", desc: "Pulsing neon effects" },
                    ].map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          toast({
                            title: `${preset.name} Preset Applied`,
                            description: preset.desc,
                          });
                        }}
                      >
                        <Zap className="w-3 h-3 mr-2" />
                        <div className="text-left">
                          <div>{preset.name}</div>
                          <div className="text-xs text-gray-500">
                            {preset.desc}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vendors Tab */}
              <TabsContent value="vendors" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Vendor Partners</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          name: "Elite Catering Co",
                          type: "Catering",
                          logo: "🍽️",
                          offer: "15% off orders over $500",
                          color: "from-orange-500 to-red-500",
                        },
                        {
                          name: "DJ Soundwave",
                          type: "DJ Services",
                          logo: "🎧",
                          offer: "Free lighting package",
                          color: "from-blue-500 to-purple-500",
                        },
                        {
                          name: "FlowerPower Florists",
                          type: "Decorations",
                          logo: "🌸",
                          offer: "Complimentary centerpieces",
                          color: "from-pink-500 to-rose-500",
                        },
                        {
                          name: "Photo Magic Studio",
                          type: "Photography",
                          logo: "📸",
                          offer: "2 hours free photo booth",
                          color: "from-green-500 to-teal-500",
                        },
                        {
                          name: "Mixology Masters",
                          type: "Bar Service",
                          logo: "🍸",
                          offer: "Free signature cocktail",
                          color: "from-indigo-500 to-blue-500",
                        },
                      ].map((vendor) => (
                        <div
                          key={vendor.name}
                          className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-purple-400 transition-colors cursor-pointer"
                          onClick={() => {
                            const newElement: CanvasElement = {
                              id: Date.now().toString(),
                              type: "sticker",
                              x: 250,
                              y: 150,
                              width: 120,
                              height: 40,
                              rotation: 0,
                              opacity: 1,
                              zIndex: canvasElements.length + 1,
                              content: {
                                vendor: vendor.name,
                                offer: vendor.offer,
                                logo: vendor.logo,
                              },
                              style: {
                                background: `linear-gradient(135deg, ${vendor.color})`,
                                color: "white",
                                borderRadius: "8px",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                              },
                            };
                            setCanvasElements([...canvasElements, newElement]);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{vendor.logo}</span>
                            <div className="flex-1">
                              <div className="text-white font-medium text-sm">
                                {vendor.name}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {vendor.type}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="mt-2 text-xs text-green-400 font-medium">
                            🎁 {vendor.offer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Co-Branding Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-300">
                        Primary Sponsor
                      </Label>
                      <Select>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select primary sponsor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elite-catering">
                            Elite Catering Co
                          </SelectItem>
                          <SelectItem value="dj-soundwave">
                            DJ Soundwave
                          </SelectItem>
                          <SelectItem value="photo-magic">
                            Photo Magic Studio
                          </SelectItem>
                          <SelectItem value="mixology">
                            Mixology Masters
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-sponsor-logo" />
                        <Label
                          htmlFor="show-sponsor-logo"
                          className="text-xs text-gray-300"
                        >
                          Display sponsor logo
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="sponsor-footer" />
                        <Label
                          htmlFor="sponsor-footer"
                          className="text-xs text-gray-300"
                        >
                          Add "Powered by [Sponsor]" footer
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="branded-colors" />
                        <Label
                          htmlFor="branded-colors"
                          className="text-xs text-gray-300"
                        >
                          Use sponsor brand colors
                        </Label>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Co-Branding Applied",
                          description:
                            "Sponsor branding has been integrated into your invitation",
                        });
                      }}
                    >
                      <Coins className="w-3 h-3 mr-2" />
                      Apply Co-Branding
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Exclusive Perks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {[
                        {
                          icon: "🍹",
                          name: "Free Welcome Drink",
                          desc: "Complimentary cocktail on arrival",
                        },
                        {
                          icon: "🎫",
                          name: "VIP Entry Pass",
                          desc: "Skip the line with fast track entry",
                        },
                        {
                          icon: "🍰",
                          name: "Dessert Voucher",
                          desc: "Free dessert with main course",
                        },
                        {
                          icon: "📷",
                          name: "Photo Package",
                          desc: "10 professional photos included",
                        },
                        {
                          icon: "🎁",
                          name: "Gift Bag",
                          desc: "Exclusive party favor bag",
                        },
                        {
                          icon: "🚗",
                          name: "Valet Parking",
                          desc: "Complimentary valet service",
                        },
                      ].map((perk) => (
                        <div
                          key={perk.name}
                          className="flex items-center space-x-3 p-2 bg-gray-800 rounded border border-gray-700 hover:border-green-400 transition-colors cursor-pointer"
                          onClick={() => {
                            const newElement: CanvasElement = {
                              id: Date.now().toString(),
                              type: "sticker",
                              x: 200,
                              y: 300,
                              width: 140,
                              height: 30,
                              rotation: 0,
                              opacity: 1,
                              zIndex: canvasElements.length + 1,
                              content: {
                                perk: perk.name,
                                icon: perk.icon,
                                description: perk.desc,
                              },
                              style: {
                                background:
                                  "linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(21, 128, 61, 0.8))",
                                color: "white",
                                borderRadius: "6px",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                border: "1px solid rgba(34, 197, 94, 0.5)",
                              },
                            };
                            setCanvasElements([...canvasElements, newElement]);
                          }}
                        >
                          <span className="text-lg">{perk.icon}</span>
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium">
                              {perk.name}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {perk.desc}
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-green-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Revenue Sharing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-green-900 bg-opacity-30 p-3 rounded border border-green-600">
                      <div className="flex items-center space-x-2 mb-2">
                        <Coins className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-medium text-sm">
                          Partnership Benefits
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-green-200">
                        <div>• Earn 5% commission on vendor bookings</div>
                        <div>• Get featured vendor placement</div>
                        <div>• Access to premium vendor network</div>
                        <div>• Priority customer support</div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-green-400 text-green-300 hover:bg-green-400 hover:text-white"
                      onClick={() => {
                        toast({
                          title: "Partnership Program",
                          description:
                            "Contact our vendor relations team to join the partner program",
                        });
                      }}
                    >
                      <Leaf className="w-3 h-3 mr-2" />
                      Join Partner Program
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Audio Greeting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!audioGreeting ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={startRecording}
                        disabled={isRecording}
                      >
                        {isRecording ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Recording...
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Record Greeting
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Voice Message
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <div className="h-8 bg-gray-800 rounded flex items-center px-2">
                          {audioGreeting.waveform.map((height, i) => (
                            <div
                              key={i}
                              className="w-1 bg-purple-400 mx-px rounded"
                              style={{ height: `${height * 0.2}px` }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          {audioGreeting.duration}s
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Guest Photo Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Import Guest Photos
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="collaborative"
                        checked={collaborativeMode}
                        onCheckedChange={(checked) =>
                          setCollaborativeMode(!!checked)
                        }
                      />
                      <Label htmlFor="collaborative" className="text-sm">
                        Enable guest uploads
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Tab */}
              <TabsContent value="ai" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">AI Copy Assistant</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={generateAISuggestions}
                      disabled={generateAISuggestionsMutation.isPending}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Generate Copy
                    </Button>

                    {aiSuggestions.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Suggested Copy:</Label>
                        {aiSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
                            onClick={() => setInviteMessage(suggestion.text)}
                          >
                            <p className="text-xs text-gray-300">
                              {suggestion.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      AI Design Complexity Meter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Design Complexity</span>
                        <span
                          className={`font-medium ${
                            designComplexity < 30
                              ? "text-green-400"
                              : designComplexity < 70
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {designComplexity}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            designComplexity < 30
                              ? "bg-green-500"
                              : designComplexity < 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${designComplexity}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        {designComplexity < 30
                          ? "Simple and elegant design"
                          : designComplexity < 70
                          ? "Balanced complexity level"
                          : "High complexity - may impact performance"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        AI Color Palette Generator
                      </h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          generateColorPaletteMutation.mutate(selectedTemplate)
                        }
                        disabled={generateColorPaletteMutation.isPending}
                        className="w-full"
                      >
                        <Palette className="w-3 h-3 mr-2" />
                        Generate Color Palette
                      </Button>

                      {aiColorSuggestions.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-xs">
                            AI Suggested Palettes:
                          </Label>
                          {aiColorSuggestions.map((palette, index) => (
                            <div
                              key={index}
                              className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
                              onClick={() => {
                                setCardStyle({
                                  ...cardStyle,
                                  primaryColor: palette.primary,
                                  secondaryColor: palette.secondary,
                                  accentColor: palette.accent,
                                  backgroundColor: palette.background,
                                });
                                toast({
                                  title: "Palette Applied!",
                                  description: `${palette.name} color scheme applied`,
                                });
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  {palette.name}
                                </span>
                                <div className="flex space-x-1">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: palette.primary }}
                                  ></div>
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor: palette.secondary,
                                    }}
                                  ></div>
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: palette.accent }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Social Media Export
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            exportStoryMutation.mutate("instagram")
                          }
                          disabled={isGeneratingStory}
                          className="flex-1"
                        >
                          {isGeneratingStory ? (
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="w-3 h-3 mr-1" />
                          )}
                          Instagram
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportStoryMutation.mutate("facebook")}
                          disabled={isGeneratingStory}
                          className="flex-1"
                        >
                          {isGeneratingStory ? (
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Share2 className="w-3 h-3 mr-1" />
                          )}
                          Facebook
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportToSocialStory("twitter")}
                          className="flex-1"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Twitter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      AI Style Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {aiStyleSuggestions.map((style, index) => (
                      <div
                        key={index}
                        className="p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-400"
                        onClick={() => {
                          setCardStyle({
                            ...cardStyle,
                            primaryColor: style.colors[0],
                            secondaryColor: style.colors[1],
                            fontFamily: style.fonts[0],
                          });
                        }}
                      >
                        <p className="font-medium text-sm text-white">
                          {style.theme}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {style.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {style.fonts.join(", ")}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Canvas */}
          <div className="col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="w-4 h-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="w-4 h-4 mr-1" />
                  Mobile
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPreviewCarousel(!showPreviewCarousel)}
                  className="bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreviewCarousel ? "Single View" : "Carousel Preview"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setDecorationCustomizer({
                      ...decorationCustomizer,
                      showCustomizer: !decorationCustomizer.showCustomizer,
                    });
                  }}
                  className="bg-linear-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Customize
                </Button>
                <Button size="sm" variant="outline" onClick={publishCard}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Publish
                </Button>
              </div>
            </div>

            <Card className="flex-1 bg-gray-900 border-gray-700">
              <CardContent className="p-0 h-full">
                {showPreviewCarousel ? (
                  <div className="relative h-full overflow-hidden">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 bg-black bg-opacity-50 rounded-full px-4 py-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newIndex =
                            currentPreviewIndex > 0
                              ? currentPreviewIndex - 1
                              : filteredTemplates.length - 1;
                          setCurrentPreviewIndex(newIndex);
                          if (filteredTemplates[newIndex]) {
                            applyTemplate(filteredTemplates[newIndex]);
                          }
                        }}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </Button>
                      <span className="text-white text-sm font-medium px-3">
                        {currentPreviewIndex + 1} / {filteredTemplates.length}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const newIndex =
                            currentPreviewIndex < filteredTemplates.length - 1
                              ? currentPreviewIndex + 1
                              : 0;
                          setCurrentPreviewIndex(newIndex);
                          if (filteredTemplates[newIndex]) {
                            applyTemplate(filteredTemplates[newIndex]);
                          }
                        }}
                        className="text-white hover:bg-white hover:bg-opacity-20"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Button>
                    </div>

                    <div
                      className="flex transition-transform duration-700 ease-in-out h-full"
                      style={{
                        transform: `translateX(-${currentPreviewIndex * 100}%)`,
                      }}
                    >
                      {filteredTemplates.map((template, index) => (
                        <div
                          key={template.id}
                          className="w-full shrink-0 h-full relative cursor-pointer"
                          onClick={() => {
                            applyTemplate(template);
                            setShowPreviewCarousel(false);
                          }}
                        >
                          <div
                            className="w-full h-full bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden"
                            style={{
                              background:
                                template.style?.gradient ||
                                template.style?.backgroundImage ||
                                "#1a1a2e",
                            }}
                          >
                            {/* Template Elements Preview */}
                            {template.elements?.map((element) => (
                              <div
                                key={element.id}
                                className={`absolute transition-all duration-300 ${
                                  element.animationType === "float"
                                    ? "animate-bounce"
                                    : element.animationType === "spin"
                                    ? "animate-spin"
                                    : element.animationType === "pulse"
                                    ? "animate-pulse"
                                    : element.animationType === "bounce"
                                    ? "animate-bounce"
                                    : element.animationType === "swing"
                                    ? "animate-pulse"
                                    : ""
                                }`}
                                style={{
                                  left: element.x,
                                  top: element.y,
                                  width: element.width,
                                  height: element.height,
                                  transform: `rotate(${element.rotation}deg)`,
                                  opacity: element.opacity,
                                  zIndex: element.zIndex,
                                  fontSize: element.style?.fontSize || "2rem",
                                  color: element.style?.color || "#FFFFFF",
                                  fontFamily:
                                    element.style?.fontFamily || "Inter",
                                  animationDuration:
                                    element.animationSpeed === "slow"
                                      ? "3s"
                                      : element.animationSpeed === "fast"
                                      ? "0.8s"
                                      : "1.5s",
                                }}
                              >
                                {element.type === "text" &&
                                  element.content.text}
                                {(element.type === "3d" ||
                                  element.type === "animation") &&
                                  (typeof element.content === "object"
                                    ? element.content.text ||
                                      element.content.src ||
                                      element.content
                                    : element.content)}
                              </div>
                            ))}

                            {/* Template Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-6">
                              <h3 className="text-white text-xl font-bold mb-2">
                                {template.name}
                              </h3>
                              <p className="text-gray-300 text-sm">
                                {template.category}
                              </p>
                              <Button
                                size="sm"
                                className="mt-3 bg-white text-black hover:bg-gray-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyTemplate(template);
                                  setShowPreviewCarousel(false);
                                }}
                              >
                                Use Template
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    ref={canvasRef}
                    className={`relative mx-auto bg-gray-800 border-2 ${
                      draggedTemplate
                        ? "border-purple-400 border-dashed"
                        : "border-gray-600"
                    } overflow-hidden transition-all duration-300 ${
                      previewMode === "mobile"
                        ? "w-80 h-[600px]"
                        : "w-full h-full"
                    }`}
                    style={{
                      background:
                        cardStyle.backgroundImage ||
                        (selectedTemplate === "birthday-party"
                          ? "radial-gradient(circle at 20% 80%, #667eea 0%, #764ba2 40%, #f093fb 100%)"
                          : cardStyle.backgroundColor || "#1a1a2e"),
                      borderRadius: "12px",
                    }}
                    onDragOver={handleCanvasDragOver}
                    onDrop={handleCanvasDrop}
                  >
                    {/* Canvas Elements - Fully Integrated System */}
                    {canvasElements.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute cursor-move select-none transition-all duration-200 ${
                          selectedElement === element.id
                            ? "ring-2 ring-purple-400 ring-opacity-80 shadow-lg"
                            : "hover:ring-1 hover:ring-gray-400 hover:ring-opacity-50"
                        } ${
                          element.animationType === "float"
                            ? "animate-bounce"
                            : element.animationType === "spin"
                            ? "animate-spin"
                            : element.animationType === "pulse"
                            ? "animate-pulse"
                            : element.animationType === "bounce"
                            ? "animate-bounce"
                            : element.animationType === "swing"
                            ? "animate-pulse"
                            : element.animationType === "wobble"
                            ? "animate-bounce"
                            : ""
                        }`}
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          transform: `rotate(${element.rotation}deg)`,
                          opacity: element.opacity,
                          zIndex: element.zIndex,
                          animationDuration:
                            element.animationSpeed === "slow"
                              ? "3s"
                              : element.animationSpeed === "fast"
                              ? "0.8s"
                              : "1.5s",
                          ...element.style,
                        }}
                        onClick={() => setSelectedElement(element.id)}
                        onMouseEnter={(e) => {
                          if (element.touchResponsive) {
                            e.currentTarget.style.transform = `rotate(${element.rotation}deg) scale(1.05)`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (element.touchResponsive) {
                            e.currentTarget.style.transform = `rotate(${element.rotation}deg) scale(1)`;
                          }
                        }}
                      >
                        {/* Text Element Rendering */}
                        {element.type === "text" && (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              fontSize: element.content.fontSize || 24,
                              fontFamily:
                                element.style?.fontFamily ||
                                cardStyle.fontFamily ||
                                "Arial",
                              color:
                                element.style?.color ||
                                cardStyle.primaryColor ||
                                "#FFFFFF",
                              fontWeight: element.style?.fontWeight || "bold",
                              textAlign: element.style?.textAlign || "center",
                              lineHeight: element.style?.lineHeight || "1.2",
                              textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                              whiteSpace: "pre-line",
                            }}
                          >
                            {element.content.text}
                          </div>
                        )}

                        {/* Image Element Rendering */}
                        {element.type === "image" && (
                          <img
                            src={element.content.src}
                            alt="Canvas element"
                            className="w-full h-full object-cover"
                            style={{
                              borderRadius:
                                element.style?.borderRadius || "8px",
                              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                            }}
                          />
                        )}

                        {/* Video Element Rendering */}
                        {element.type === "video" && (
                          <video
                            src={element.content.src}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                            muted
                            loop
                          />
                        )}

                        {/* 3D and Animation Elements - Enhanced System */}
                        {(element.type === "3d" ||
                          element.type === "animation") && (
                          <div
                            className="w-full h-full flex items-center justify-center relative"
                            style={{
                              fontSize: element.style?.fontSize || "2.5rem",
                              filter: element.touchResponsive
                                ? "drop-shadow(0 0 15px rgba(255,255,255,0.8))"
                                : "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
                              transform: `perspective(${
                                element.perspective || 1000
                              }px)`,
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                          >
                            <span className="text-center select-none relative z-10">
                              {typeof element.content === "object"
                                ? element.content.text ||
                                  element.content.src ||
                                  "🎉"
                                : element.content}
                            </span>

                            {/* Confetti Animation System */}
                            {element.animationType === "confetti" && (
                              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                {Array.from({
                                  length: element.particleCount || 40,
                                }).map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute animate-bounce"
                                    style={{
                                      left: `${10 + Math.random() * 80}%`,
                                      top: `${10 + Math.random() * 80}%`,
                                      fontSize: "1rem",
                                      animationDelay: `${Math.random() * 2}s`,
                                      animationDuration: `${
                                        0.8 + Math.random() * 1.2
                                      }s`,
                                      opacity: 0.8,
                                      transform: `rotate(${
                                        Math.random() * 360
                                      }deg)`,
                                    }}
                                  >
                                    ✨
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Interactive Touch Response */}
                            {element.touchResponsive && (
                              <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={() => {
                                  // Interactive feedback for touch-responsive elements
                                  toast({
                                    title: "Interactive Element!",
                                    description:
                                      "This element responds to user interaction",
                                  });
                                }}
                              />
                            )}
                          </div>
                        )}

                        {/* Audio Element Rendering */}
                        {element.type === "audio" && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                            <div className="text-center">
                              <Volume2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                              <p className="text-xs text-gray-300">
                                Audio Greeting
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Sticker Element Rendering */}
                        {element.type === "sticker" && (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              fontSize: element.style?.fontSize || "2rem",
                              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                            }}
                          >
                            {typeof element.content === "object"
                              ? element.content.text ||
                                element.content.emoji ||
                                "🎉"
                              : element.content}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Invitation Content Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <h2
                        className="text-2xl font-bold text-white mb-2"
                        style={{ color: cardStyle.primaryColor }}
                      >
                        {inviteTitle}
                      </h2>
                      {inviteMessage && (
                        <p className="text-white text-sm opacity-90">
                          {inviteMessage}
                        </p>
                      )}
                    </div>

                    {/* Invitation Content Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <h2
                        className="text-2xl font-bold text-white mb-2"
                        style={{ color: cardStyle.primaryColor }}
                      >
                        {inviteTitle}
                      </h2>
                      {inviteMessage && (
                        <p className="text-white text-sm opacity-90">
                          {inviteMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Properties & Settings */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            <Tabs defaultValue="properties" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Invitation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="title" className="text-sm">
                        Event Title
                      </Label>
                      <Input
                        id="title"
                        value={inviteTitle}
                        onChange={(e) => setInviteTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-sm">
                        Invitation Message
                      </Label>
                      <Textarea
                        id="message"
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {selectedElement && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        Element Properties
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const element = canvasElements.find(
                                (el) => el.id === selectedElement
                              );
                              if (element) duplicateElement(element.id);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              const element = canvasElements.find(
                                (el) => el.id === selectedElement
                              );
                              if (element) deleteElement(element.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        const element = canvasElements.find(
                          (el) => el.id === selectedElement
                        );
                        if (!element) return null;

                        return (
                          <>
                            <div>
                              <Label className="text-sm">Opacity</Label>
                              <Slider
                                value={[element.opacity * 100]}
                                onValueChange={([value]) =>
                                  updateElement(selectedElement, {
                                    opacity: value / 100,
                                  })
                                }
                                max={100}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Rotation</Label>
                              <Slider
                                value={[element.rotation]}
                                onValueChange={([value]) =>
                                  updateElement(selectedElement, {
                                    rotation: value,
                                  })
                                }
                                min={-180}
                                max={180}
                                step={1}
                                className="mt-2"
                              />
                            </div>
                            {element.type === "text" && (
                              <div>
                                <Label className="text-sm">Font Size</Label>
                                <Slider
                                  value={[element.content.fontSize || 24]}
                                  onValueChange={([value]) =>
                                    updateElement(selectedElement, {
                                      content: {
                                        ...element.content,
                                        fontSize: value,
                                      },
                                    })
                                  }
                                  min={12}
                                  max={72}
                                  step={2}
                                  className="mt-2"
                                />
                              </div>
                            )}

                            {(element.type === "3d" ||
                              element.type === "animation") && (
                              <>
                                <div>
                                  <Label className="text-sm">
                                    Animation Type
                                  </Label>
                                  <Select
                                    value={element.animationType || "float"}
                                    onValueChange={(value) =>
                                      updateElement(selectedElement, {
                                        animationType: value as any,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="float">
                                        Float
                                      </SelectItem>
                                      <SelectItem value="bounce">
                                        Bounce
                                      </SelectItem>
                                      <SelectItem value="spin">Spin</SelectItem>
                                      <SelectItem value="pulse">
                                        Pulse
                                      </SelectItem>
                                      <SelectItem value="swing">
                                        Swing
                                      </SelectItem>
                                      <SelectItem value="wobble">
                                        Wobble
                                      </SelectItem>
                                      <SelectItem value="confetti">
                                        Confetti
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-sm">
                                    Animation Speed
                                  </Label>
                                  <Select
                                    value={element.animationSpeed || "normal"}
                                    onValueChange={(value) =>
                                      updateElement(selectedElement, {
                                        animationSpeed: value as any,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="slow">Slow</SelectItem>
                                      <SelectItem value="normal">
                                        Normal
                                      </SelectItem>
                                      <SelectItem value="fast">Fast</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="touch-responsive"
                                      checked={element.touchResponsive || false}
                                      onCheckedChange={(checked) =>
                                        updateElement(selectedElement, {
                                          touchResponsive: !!checked,
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor="touch-responsive"
                                      className="text-sm"
                                    >
                                      Touch Responsive
                                    </Label>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="tilt-responsive"
                                      checked={element.tiltResponsive || false}
                                      onCheckedChange={(checked) =>
                                        updateElement(selectedElement, {
                                          tiltResponsive: !!checked,
                                        })
                                      }
                                    />
                                    <Label
                                      htmlFor="tilt-responsive"
                                      className="text-sm"
                                    >
                                      Device Tilt Responsive
                                    </Label>
                                  </div>
                                </div>

                                {element.animationType === "confetti" && (
                                  <div>
                                    <Label className="text-sm">
                                      Particle Count
                                    </Label>
                                    <Slider
                                      value={[element.particleCount || 30]}
                                      onValueChange={([value]) =>
                                        updateElement(selectedElement, {
                                          particleCount: value,
                                        })
                                      }
                                      min={10}
                                      max={100}
                                      step={5}
                                      className="mt-2"
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Style Tab */}
              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Card Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm">Background Color</Label>
                      <Input
                        type="color"
                        value={cardStyle.backgroundColor}
                        onChange={(e) =>
                          setCardStyle({
                            ...cardStyle,
                            backgroundColor: e.target.value,
                          })
                        }
                        className="mt-1 h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Primary Color</Label>
                      <Input
                        type="color"
                        value={cardStyle.primaryColor}
                        onChange={(e) =>
                          setCardStyle({
                            ...cardStyle,
                            primaryColor: e.target.value,
                          })
                        }
                        className="mt-1 h-10"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Font Family</Label>
                      <Select
                        value={cardStyle.fontFamily}
                        onValueChange={(value) =>
                          setCardStyle({ ...cardStyle, fontFamily: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Playfair Display">
                            Playfair Display
                          </SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Orbitron">Orbitron</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Publish Tab */}
              <TabsContent value="publish" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Publishing Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tracking"
                        checked={publishSettings.enableTracking}
                        onCheckedChange={(checked) =>
                          setPublishSettings({
                            ...publishSettings,
                            enableTracking: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="tracking" className="text-sm">
                        Enable analytics tracking
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nft"
                        checked={publishSettings.requireNFT}
                        onCheckedChange={(checked) =>
                          setPublishSettings({
                            ...publishSettings,
                            requireNFT: !!checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="nft"
                        className="text-sm flex items-center"
                      >
                        <Coins className="w-4 h-4 mr-1" />
                        Create NFT invitation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="eco"
                        checked={publishSettings.ecoFriendly}
                        onCheckedChange={(checked) =>
                          setPublishSettings({
                            ...publishSettings,
                            ecoFriendly: !!checked,
                          })
                        }
                      />
                      <Label
                        htmlFor="eco"
                        className="text-sm flex items-center"
                      >
                        <Leaf className="w-4 h-4 mr-1" />
                        Eco-friendly messaging
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Vendor Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vendor"
                        checked={publishSettings.vendorBranding}
                        onCheckedChange={(checked) =>
                          setPublishSettings({
                            ...publishSettings,
                            vendorBranding: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="vendor" className="text-sm">
                        Enable vendor co-branding
                      </Label>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      Add Vendor Perks
                    </Button>
                  </CardContent>
                </Card>

                {/* One-Click Social Media Shareable Designs */}
                <Card className="border-green-500 bg-linear-to-r from-green-900/20 to-blue-900/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-300 font-bold flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Social Media Export
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      Export your design optimized for different platforms
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          platform: "Instagram Story",
                          icon: "📱",
                          size: "1080x1920",
                          color: "bg-linear-to-r from-purple-500 to-pink-500",
                          format: "story",
                        },
                        {
                          platform: "Instagram Post",
                          icon: "📷",
                          size: "1080x1080",
                          color: "bg-linear-to-r from-purple-500 to-red-500",
                          format: "post",
                        },
                        {
                          platform: "Facebook Event",
                          icon: "👥",
                          size: "1920x1080",
                          color: "bg-linear-to-r from-blue-600 to-blue-700",
                          format: "event",
                        },
                        {
                          platform: "Twitter Card",
                          icon: "🐦",
                          size: "1200x675",
                          color: "bg-linear-to-r from-sky-400 to-blue-500",
                          format: "card",
                        },
                        {
                          platform: "LinkedIn Post",
                          icon: "💼",
                          size: "1200x627",
                          color: "bg-linear-to-r from-blue-600 to-blue-800",
                          format: "professional",
                        },
                        {
                          platform: "TikTok Video",
                          icon: "🎵",
                          size: "1080x1920",
                          color: "bg-linear-to-r from-red-500 to-black",
                          format: "vertical",
                        },
                      ].map((social) => (
                        <div
                          key={social.platform}
                          className={`${social.color} p-3 rounded-lg cursor-pointer hover:scale-105 transition-all text-white`}
                          onClick={() =>
                            exportStoryMutation.mutate(social.format)
                          }
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">{social.icon}</span>
                            {exportStoryMutation.isPending ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {social.platform}
                            </p>
                            <p className="text-xs opacity-80">{social.size}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Quick Share Options
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Copy shareable link
                            const shareUrl = `${
                              window.location.origin
                            }/shared-invite/${Date.now()}`;
                            navigator.clipboard.writeText(shareUrl);
                            toast({
                              title: "Link Copied!",
                              description: "Share link copied to clipboard",
                            });
                          }}
                        >
                          <Link className="w-3 h-3 mr-1" />
                          Copy Link
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Generate QR code for sharing
                            toast({
                              title: "QR Code Generated!",
                              description: "QR code for easy sharing created",
                            });
                          }}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          QR Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // Email share
                            const subject = encodeURIComponent(
                              `You're Invited: ${inviteTitle}`
                            );
                            const body = encodeURIComponent(
                              `Check out this amazing invitation: ${inviteMessage}`
                            );
                            window.open(
                              `mailto:?subject=${subject}&body=${body}`
                            );
                          }}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">
                        Advanced Export Options
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Include Animations</Label>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">High Resolution</Label>
                          <Checkbox defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Platform Branding</Label>
                          <Checkbox />
                        </div>
                      </div>

                      <Button
                        className="w-full mt-3"
                        onClick={() => {
                          // Bulk export all formats
                          toast({
                            title: "Bulk Export Started!",
                            description:
                              "Generating all social media formats...",
                          });
                          // Export for all platforms
                          [
                            "story",
                            "post",
                            "event",
                            "card",
                            "professional",
                            "vertical",
                          ].forEach((format, index) => {
                            setTimeout(() => {
                              exportStoryMutation.mutate(format);
                            }, index * 1000);
                          });
                        }}
                        disabled={exportStoryMutation.isPending}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export All Formats
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={publishCard}>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish VibesCard
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Share Design Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Share Your Design
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-300">Design Title</Label>
                <Input
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  placeholder="Enter design title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-300">Description</Label>
                <Textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Describe your design..."
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="public" />
                <Label htmlFor="public" className="text-sm text-gray-300">
                  Make design publicly available for remixing
                </Label>
              </div>

              {shareableLink && (
                <div className="bg-gray-800 p-3 rounded border">
                  <Label className="text-sm text-gray-300">
                    Shareable Link
                  </Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <Input value={shareableLink} readOnly className="text-sm" />
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shareableLink);
                        toast({
                          title: "Link Copied!",
                          description: "Shareable link copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    const designData = {
                      title: inviteTitle,
                      message: inviteMessage,
                      elements: canvasElements,
                      style: cardStyle,
                      template: selectedTemplate,
                      public: true,
                    };
                    shareDesignMutation.mutate(designData);
                  }}
                  className="flex-1"
                  disabled={shareDesignMutation.isPending}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {shareDesignMutation.isPending
                    ? "Sharing..."
                    : "Share Design"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Browse Remixes Modal */}
      {showRemixModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-[800px] max-w-90vw max-h-90vh overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Browse & Remix Designs
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRemixModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {((sharedDesignsData as any)?.designs || []).map(
                (design: any) => (
                  <div
                    key={design.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-400 transition-colors"
                  >
                    <div
                      className="w-full h-32 bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center"
                      style={{
                        background:
                          design.style?.gradient ||
                          design.style?.backgroundColor,
                      }}
                    >
                      <span className="text-white font-bold">
                        {design.title}
                      </span>
                    </div>

                    <div className="p-3 space-y-2">
                      <h3 className="text-white font-medium">{design.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {design.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Users className="w-3 h-3" />
                          <span>{design.remixCount || 0} remixes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{design.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{design.createdAt}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => remixDesignMutation.mutate(design.id)}
                          className="flex-1"
                          disabled={remixDesignMutation.isPending}
                        >
                          <Shuffle className="w-3 h-3 mr-1" />
                          Remix
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Like functionality
                            toast({
                              title: "Design Liked!",
                              description: "Added to your favorites",
                            });
                          }}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              ) || (
                <div className="col-span-2 text-center py-8">
                  <Shuffle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">
                    No shared designs available yet
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Be the first to share your creation!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
