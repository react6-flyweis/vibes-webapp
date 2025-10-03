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
  Save,
  Edit,
  Settings,
  ChevronDown,
  ChevronUp,
  Mail,
  QrCode,
  Plus,
  Minus,
  MoreHorizontal,
  Calendar,
  Gift,
  Camera,
  Globe,
  MessageSquare,
  Upload,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  PaintBucket,
  Crop,
} from "lucide-react";

interface DesignElement {
  id: string;
  type: "text" | "image" | "shape" | "background" | "logo" | "border";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  content: any;
  style: any;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  premium: boolean;
  elements: DesignElement[];
  style: any;
}

export default function VibesCardStudioNew() {
  const { toast } = useToast();

  // Canvas and design state
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(100);
  const [gridVisible, setGridVisible] = useState(false);

  // Card content state
  const [eventTitle, setEventTitle] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [hostName, setHostName] = useState("");

  // Design settings
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [colorScheme, setColorScheme] = useState({
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#ffffff",
    text: "#1f2937",
  });

  // UI state
  const [activeTab, setActiveTab] = useState("design");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [templateSearch, setTemplateSearch] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Template categories and data
  const templateCategories = [
    "All",
    "Wedding",
    "Birthday",
    "Corporate",
    "Graduation",
    "Holiday",
    "Anniversary",
    "Baby Shower",
    "Retirement",
    "Quinceañera",
    "Bar/Bat Mitzvah",
    "Engagement",
    "Housewarming",
    "Bridal Shower",
    "Bachelor/Bachelorette",
    "Gender Reveal",
    "Christening",
    "Funeral/Memorial",
    "Going Away",
    "Reunion",
    "Fundraiser",
    "New Year",
    "Valentine's",
    "Easter",
    "Mother's Day",
    "Father's Day",
    "Halloween",
    "Thanksgiving",
    "Christmas",
    "Diwali",
    "Hanukkah",
    "Eid",
    "Kwanzaa",
  ];

  const templates: Template[] = [
    // Wedding Templates
    {
      id: "wedding-luxury-gold",
      name: "Vibes Luxury Gold",
      category: "Wedding",
      thumbnail: "💍",
      premium: true,
      elements: [
        {
          id: "bg-1",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          content: { pattern: "luxury-floral" },
          style: {
            background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><pattern id="luxury-floral" patternUnits="userSpaceOnUse" width="80" height="80"><g opacity="0.1"><path d="M40,20 Q50,10 60,20 Q50,30 40,20 Q30,10 40,20" fill="%23ffffff"/><path d="M40,60 Q50,50 60,60 Q50,70 40,60 Q30,50 40,60" fill="%23ffffff"/><circle cx="20" cy="40" r="2" fill="%23ffffff"/><circle cx="60" cy="40" r="2" fill="%23ffffff"/><text x="40" y="45" text-anchor="middle" font-family="serif" font-size="6" fill="%23ffffff" opacity="0.3">✦</text></g></pattern></defs><rect width="400" height="400" fill="url(%23luxury-floral)"/></svg>\')',
          },
        },
        {
          id: "decorative-corners",
          type: "image",
          x: 0,
          y: 0,
          width: 150,
          height: 150,
          rotation: 0,
          opacity: 0.3,
          zIndex: 1,
          content: {
            src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M0,0 Q50,25 100,0 L100,25 Q75,50 100,100 L75,100 Q25,75 0,100 L0,75 Q25,50 0,0 Z' fill='%23d4af37' opacity='0.4'/></svg>",
          },
          style: {},
        },
        {
          id: "decorative-corners-2",
          type: "image",
          x: 650,
          y: 450,
          width: 150,
          height: 150,
          rotation: 180,
          opacity: 0.3,
          zIndex: 1,
          content: {
            src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M0,0 Q50,25 100,0 L100,25 Q75,50 100,100 L75,100 Q25,75 0,100 L0,75 Q25,50 0,0 Z' fill='%23d4af37' opacity='0.4'/></svg>",
          },
          style: {},
        },
        {
          id: "vibes-logo",
          type: "logo",
          x: 50,
          y: 50,
          width: 120,
          height: 40,
          rotation: 0,
          opacity: 0.8,
          zIndex: 3,
          content: { text: "VIBES" },
          style: {
            fontSize: 24,
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#d4af37",
            letterSpacing: "3px",
          },
        },
        {
          id: "border",
          type: "border",
          x: 50,
          y: 80,
          width: 700,
          height: 460,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          content: { ornate: true, branded: true },
          style: {
            border: "4px solid #d4af37",
            borderRadius: "25px",
            background: "rgba(255,255,255,0.1)",
            boxShadow: "inset 0 0 20px rgba(212,175,55,0.3)",
          },
        },
        {
          id: "text-1",
          type: "text",
          x: 250,
          y: 180,
          width: 300,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "You're Invited" },
          style: {
            fontSize: 36,
            fontFamily: "Playfair Display",
            fontWeight: "bold",
            color: "#8b4513",
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          },
        },
        {
          id: "vibes-watermark",
          type: "text",
          x: 680,
          y: 520,
          width: 100,
          height: 20,
          rotation: 0,
          opacity: 0.4,
          zIndex: 4,
          content: { text: "Created with Vibes" },
          style: {
            fontSize: 10,
            fontFamily: "sans-serif",
            color: "#666",
            textAlign: "right",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        fontFamily: "Playfair Display",
        colorScheme: "vibes-gold",
        brand: "vibes-luxury",
      },
    },
    {
      id: "wedding-minimalist",
      name: "Vibes Minimalist",
      category: "Wedding",
      thumbnail: "🤍",
      premium: true,
      elements: [
        {
          id: "vibes-brand",
          type: "logo",
          x: 650,
          y: 30,
          width: 100,
          height: 30,
          rotation: 0,
          opacity: 0.7,
          zIndex: 3,
          content: { text: "VIBES" },
          style: {
            fontSize: 18,
            fontFamily: "sans-serif",
            fontWeight: "300",
            color: "#8b4513",
            letterSpacing: "2px",
          },
        },
        {
          id: "main-text",
          type: "text",
          x: 200,
          y: 250,
          width: 400,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "You're Invited" },
          style: {
            fontSize: 42,
            fontFamily: "serif",
            fontWeight: "300",
            color: "#2c3e50",
            textAlign: "center",
          },
        },
        {
          id: "vibes-footer",
          type: "text",
          x: 600,
          y: 550,
          width: 150,
          height: 20,
          rotation: 0,
          opacity: 0.5,
          zIndex: 4,
          content: { text: "Powered by Vibes" },
          style: {
            fontSize: 9,
            fontFamily: "sans-serif",
            color: "#999",
            textAlign: "right",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        brand: "vibes-minimal",
      },
    },
    {
      id: "wedding-garden",
      name: "Vibes Garden Romance",
      category: "Wedding",
      thumbnail: "🌸",
      premium: true,
      elements: [
        {
          id: "vibes-emblem",
          type: "logo",
          x: 360,
          y: 50,
          width: 80,
          height: 80,
          rotation: 0,
          opacity: 0.8,
          zIndex: 3,
          content: { emblem: "vibes-flower" },
          style: {
            fontSize: 28,
            fontFamily: "serif",
            color: "#4a6741",
            textAlign: "center",
          },
        },
        {
          id: "vibes-signature",
          type: "text",
          x: 680,
          y: 570,
          width: 100,
          height: 15,
          rotation: 0,
          opacity: 0.6,
          zIndex: 4,
          content: { text: "vibes.studio" },
          style: {
            fontSize: 8,
            fontFamily: "serif",
            color: "#4a6741",
            textAlign: "right",
            fontStyle: "italic",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        brand: "vibes-garden",
      },
    },

    // Birthday Templates
    {
      id: "birthday-milestone-30",
      name: "Vibes Milestone 30th",
      category: "Birthday",
      thumbnail: "3️⃣0️⃣",
      premium: true,
      elements: [
        {
          id: "vibes-header",
          type: "logo",
          x: 300,
          y: 40,
          width: 200,
          height: 50,
          rotation: 0,
          opacity: 0.9,
          zIndex: 3,
          content: { text: "VIBES CELEBRATES" },
          style: {
            fontSize: 16,
            fontFamily: "sans-serif",
            fontWeight: "500",
            color: "#764ba2",
            letterSpacing: "1px",
            textAlign: "center",
          },
        },
        {
          id: "age-display",
          type: "text",
          x: 300,
          y: 200,
          width: 200,
          height: 120,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "30" },
          style: {
            fontSize: 96,
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#667eea",
            textAlign: "center",
          },
        },
        {
          id: "vibes-brand-footer",
          type: "text",
          x: 650,
          y: 560,
          width: 130,
          height: 20,
          rotation: 0,
          opacity: 0.5,
          zIndex: 4,
          content: { text: "vibes milestone series" },
          style: {
            fontSize: 8,
            fontFamily: "sans-serif",
            color: "#764ba2",
            textAlign: "right",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        brand: "vibes-milestone",
      },
    },
    {
      id: "birthday-kids-superhero",
      name: "Vibes Superhero Adventure",
      category: "Birthday",
      thumbnail: "🦸",
      premium: false,
      elements: [
        {
          id: "vibes-kids-logo",
          type: "logo",
          x: 50,
          y: 50,
          width: 150,
          height: 40,
          rotation: 0,
          opacity: 0.8,
          zIndex: 3,
          content: { text: "VIBES KIDS" },
          style: {
            fontSize: 20,
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#ff6b95",
            letterSpacing: "2px",
          },
        },
        {
          id: "superhero-text",
          type: "text",
          x: 200,
          y: 300,
          width: 400,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "SUPERHERO PARTY!" },
          style: {
            fontSize: 32,
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#fff",
            textAlign: "center",
            textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        brand: "vibes-kids",
      },
    },
    {
      id: "birthday-adult-sophisticated",
      name: "Vibes Sophisticated Celebration",
      category: "Birthday",
      thumbnail: "🥂",
      premium: true,
      elements: [
        {
          id: "vibes-elite",
          type: "logo",
          x: 350,
          y: 80,
          width: 100,
          height: 30,
          rotation: 0,
          opacity: 0.7,
          zIndex: 3,
          content: { text: "VIBES" },
          style: {
            fontSize: 22,
            fontFamily: "serif",
            fontWeight: "300",
            color: "#fff",
            letterSpacing: "4px",
            textAlign: "center",
          },
        },
        {
          id: "elegant-invite",
          type: "text",
          x: 200,
          y: 350,
          width: 400,
          height: 80,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "An Elegant Evening" },
          style: {
            fontSize: 28,
            fontFamily: "serif",
            fontWeight: "300",
            color: "#fff",
            textAlign: "center",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)",
        brand: "vibes-elite",
      },
    },
    {
      id: "birthday-surprise",
      name: "Vibes Surprise Spectacular",
      category: "Birthday",
      thumbnail: "🎉",
      premium: false,
      elements: [
        {
          id: "vibes-surprise",
          type: "logo",
          x: 600,
          y: 40,
          width: 150,
          height: 35,
          rotation: 0,
          opacity: 0.8,
          zIndex: 3,
          content: { text: "VIBES SURPRISE" },
          style: {
            fontSize: 14,
            fontFamily: "sans-serif",
            fontWeight: "600",
            color: "#ff6b6b",
            letterSpacing: "1px",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)",
        brand: "vibes-surprise",
      },
    },

    // Corporate Templates
    {
      id: "corporate-tech-launch",
      name: "Vibes Tech Launch Pro",
      category: "Corporate",
      thumbnail: "🚀",
      premium: true,
      elements: [
        {
          id: "vibes-corporate",
          type: "logo",
          x: 50,
          y: 50,
          width: 200,
          height: 40,
          rotation: 0,
          opacity: 0.9,
          zIndex: 3,
          content: { text: "VIBES CORPORATE" },
          style: {
            fontSize: 18,
            fontFamily: "sans-serif",
            fontWeight: "500",
            color: "#764ba2",
            letterSpacing: "2px",
          },
        },
        {
          id: "tech-title",
          type: "text",
          x: 200,
          y: 250,
          width: 400,
          height: 100,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "PRODUCT LAUNCH" },
          style: {
            fontSize: 32,
            fontFamily: "sans-serif",
            fontWeight: "bold",
            color: "#667eea",
            textAlign: "center",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        brand: "vibes-corporate",
      },
    },
    {
      id: "corporate-networking",
      name: "Vibes Professional Network",
      category: "Corporate",
      thumbnail: "🤝",
      premium: true,
      elements: [
        {
          id: "vibes-pro",
          type: "logo",
          x: 350,
          y: 60,
          width: 100,
          height: 25,
          rotation: 0,
          opacity: 0.8,
          zIndex: 3,
          content: { text: "VIBES PRO" },
          style: {
            fontSize: 16,
            fontFamily: "sans-serif",
            fontWeight: "300",
            color: "#fff",
            letterSpacing: "3px",
            textAlign: "center",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        brand: "vibes-professional",
      },
    },
    {
      id: "corporate-awards",
      name: "Vibes Awards Gala",
      category: "Corporate",
      thumbnail: "🏆",
      premium: true,
      elements: [
        {
          id: "vibes-awards",
          type: "logo",
          x: 300,
          y: 70,
          width: 200,
          height: 50,
          rotation: 0,
          opacity: 0.9,
          zIndex: 3,
          content: { text: "VIBES AWARDS" },
          style: {
            fontSize: 20,
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#f5576c",
            letterSpacing: "2px",
            textAlign: "center",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        brand: "vibes-awards",
      },
    },

    // Graduation Templates
    {
      id: "graduation-college",
      name: "College Graduation",
      category: "Graduation",
      thumbnail: "🎓",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
    },
    {
      id: "graduation-high-school",
      name: "High School Graduation",
      category: "Graduation",
      thumbnail: "📚",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
    },
    {
      id: "graduation-phd",
      name: "PhD Achievement",
      category: "Graduation",
      thumbnail: "👨‍🎓",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },

    // Holiday Templates
    {
      id: "christmas-traditional",
      name: "Traditional Christmas",
      category: "Christmas",
      thumbnail: "🎄",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
      },
    },
    {
      id: "halloween-spooky",
      name: "Spooky Halloween",
      category: "Halloween",
      thumbnail: "🎃",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)",
      },
    },
    {
      id: "new-year-gala",
      name: "New Year Gala",
      category: "New Year",
      thumbnail: "🥳",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
    {
      id: "thanksgiving-harvest",
      name: "Harvest Thanksgiving",
      category: "Thanksgiving",
      thumbnail: "🦃",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
    },

    // Cultural & Religious Templates
    {
      id: "diwali-lights",
      name: "Festival of Lights",
      category: "Diwali",
      thumbnail: "🪔",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
    },
    {
      id: "eid-celebration",
      name: "Eid Mubarak",
      category: "Eid",
      thumbnail: "🌙",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
    },
    {
      id: "hanukkah-festival",
      name: "Hanukkah Festival",
      category: "Hanukkah",
      thumbnail: "🕎",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
    {
      id: "kwanzaa-unity",
      name: "Kwanzaa Unity",
      category: "Kwanzaa",
      thumbnail: "🕯️",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
      },
    },

    // Life Events Templates
    {
      id: "baby-shower-boy",
      name: "Baby Boy Shower",
      category: "Baby Shower",
      thumbnail: "👶",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      },
    },
    {
      id: "baby-shower-girl",
      name: "Baby Girl Shower",
      category: "Baby Shower",
      thumbnail: "👧",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      },
    },
    {
      id: "gender-reveal",
      name: "Gender Reveal Party",
      category: "Gender Reveal",
      thumbnail: "🎈",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #a8edea 100%)",
      },
    },
    {
      id: "bridal-shower-elegant",
      name: "Elegant Bridal Shower",
      category: "Bridal Shower",
      thumbnail: "👰",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      },
    },
    {
      id: "bachelor-party",
      name: "Bachelor Party",
      category: "Bachelor/Bachelorette",
      thumbnail: "🍻",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
    {
      id: "bachelorette-party",
      name: "Bachelorette Party",
      category: "Bachelor/Bachelorette",
      thumbnail: "💃",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      },
    },
    {
      id: "engagement-celebration",
      name: "Engagement Celebration",
      category: "Engagement",
      thumbnail: "💍",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      },
    },
    {
      id: "retirement-celebration",
      name: "Retirement Celebration",
      category: "Retirement",
      thumbnail: "🎯",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      },
    },
    {
      id: "quinceañera-princess",
      name: "Quinceañera Princess",
      category: "Quinceañera",
      thumbnail: "👑",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      },
    },
    {
      id: "bar-mitzvah",
      name: "Bar Mitzvah Celebration",
      category: "Bar/Bat Mitzvah",
      thumbnail: "✡️",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
    },
    {
      id: "housewarming-new-home",
      name: "New Home Celebration",
      category: "Housewarming",
      thumbnail: "🏠",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
    },
    {
      id: "going-away-farewell",
      name: "Farewell Celebration",
      category: "Going Away",
      thumbnail: "✈️",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      },
    },
    {
      id: "reunion-family",
      name: "Family Reunion",
      category: "Reunion",
      thumbnail: "👨‍👩‍👧‍👦",
      premium: false,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      },
    },
    {
      id: "fundraiser-charity",
      name: "Charity Fundraiser",
      category: "Fundraiser",
      thumbnail: "❤️",
      premium: true,
      elements: [],
      style: {
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      },
    },
    {
      id: "memorial-celebration-of-life",
      name: "Vibes Celebration of Life",
      category: "Funeral/Memorial",
      thumbnail: "🕊️",
      premium: true,
      elements: [
        {
          id: "peaceful-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          content: { pattern: "peaceful-sky" },
          style: {
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><pattern id="clouds" patternUnits="userSpaceOnUse" width="60" height="40"><ellipse cx="30" cy="20" rx="15" ry="8" fill="%23ffffff" opacity="0.1"/><ellipse cx="20" cy="25" rx="10" ry="5" fill="%23ffffff" opacity="0.08"/></pattern></defs><rect width="300" height="300" fill="url(%23clouds)"/></svg>\')',
          },
        },
        {
          id: "dove-image",
          type: "image",
          x: 350,
          y: 100,
          width: 100,
          height: 80,
          rotation: 0,
          opacity: 0.7,
          zIndex: 2,
          content: {
            src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M20,50 Q30,30 50,40 Q70,30 80,50 Q70,70 50,60 Q30,70 20,50 Z' fill='%23ffffff' opacity='0.8'/><circle cx='60' cy='45' r='2' fill='%23333'/></svg>",
          },
          style: {},
        },
      ],
      style: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        brand: "vibes-memorial",
      },
    },

    // Special Event Templates
    {
      id: "sweet-sixteen",
      name: "Vibes Sweet Sixteen Dreams",
      category: "Birthday",
      thumbnail: "🌟",
      premium: true,
      elements: [
        {
          id: "sparkle-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          content: { pattern: "sparkles" },
          style: {
            background:
              "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%, #ffecd2 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><pattern id="sparkles" patternUnits="userSpaceOnUse" width="40" height="40"><text x="20" y="20" text-anchor="middle" font-size="12" fill="%23ffffff" opacity="0.3">✨</text><text x="10" y="35" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.2">⭐</text></pattern></defs><rect width="200" height="200" fill="url(%23sparkles)"/></svg>\')',
          },
        },
        {
          id: "number-16",
          type: "text",
          x: 300,
          y: 200,
          width: 200,
          height: 120,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
          content: { text: "16" },
          style: {
            fontSize: 80,
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#ff6b95",
            textAlign: "center",
            textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        brand: "vibes-sweet16",
      },
    },

    {
      id: "graduation-medical",
      name: "Vibes Medical Graduation",
      category: "Graduation",
      thumbnail: "⚕️",
      premium: true,
      elements: [
        {
          id: "medical-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="medical" patternUnits="userSpaceOnUse" width="50" height="50"><text x="25" y="30" text-anchor="middle" font-size="20" fill="%23ffffff" opacity="0.1">⚕️</text></pattern></defs><rect width="100" height="100" fill="url(%23medical)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        brand: "vibes-medical",
      },
    },

    {
      id: "tropical-vacation",
      name: "Vibes Tropical Getaway",
      category: "Going Away",
      thumbnail: "🌺",
      premium: false,
      elements: [
        {
          id: "tropical-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><defs><pattern id="tropical" patternUnits="userSpaceOnUse" width="50" height="50"><text x="25" y="30" text-anchor="middle" font-size="16" fill="%23ffffff" opacity="0.2">🌺</text><text x="10" y="45" text-anchor="middle" font-size="12" fill="%23ffffff" opacity="0.15">🌴</text></pattern></defs><rect width="150" height="150" fill="url(%23tropical)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        brand: "vibes-tropical",
      },
    },

    {
      id: "masquerade-ball",
      name: "Vibes Masquerade Elegance",
      category: "Birthday",
      thumbnail: "🎭",
      premium: true,
      elements: [
        {
          id: "masquerade-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><pattern id="masquerade" patternUnits="userSpaceOnUse" width="60" height="60"><text x="30" y="35" text-anchor="middle" font-size="20" fill="%23d4af37" opacity="0.2">🎭</text><circle cx="15" cy="15" r="2" fill="%23d4af37" opacity="0.1"/><circle cx="45" cy="45" r="2" fill="%23d4af37" opacity="0.1"/></pattern></defs><rect width="120" height="120" fill="url(%23masquerade)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)",
        brand: "vibes-masquerade",
      },
    },

    {
      id: "sports-championship",
      name: "Vibes Championship Victory",
      category: "Corporate",
      thumbnail: "🏆",
      premium: true,
      elements: [
        {
          id: "trophy-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="victory" patternUnits="userSpaceOnUse" width="40" height="40"><text x="20" y="25" text-anchor="middle" font-size="14" fill="%23ffffff" opacity="0.2">🏆</text><text x="10" y="10" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.15">⭐</text><text x="30" y="35" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.15">⭐</text></pattern></defs><rect width="100" height="100" fill="url(%23victory)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        brand: "vibes-victory",
      },
    },

    {
      id: "vintage-wine-tasting",
      name: "Vibes Vintage Wine Experience",
      category: "Corporate",
      thumbnail: "🍷",
      premium: true,
      elements: [
        {
          id: "wine-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><pattern id="wine" patternUnits="userSpaceOnUse" width="40" height="40"><circle cx="20" cy="20" r="3" fill="%23ffffff" opacity="0.1"/><text x="20" y="35" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.15">🍷</text></pattern></defs><rect width="80" height="80" fill="url(%23wine)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
        brand: "vibes-wine",
      },
    },

    {
      id: "spring-garden-party",
      name: "Vibes Spring Garden Celebration",
      category: "Birthday",
      thumbnail: "🌸",
      premium: false,
      elements: [
        {
          id: "garden-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="garden" patternUnits="userSpaceOnUse" width="25" height="25"><text x="12" y="18" text-anchor="middle" font-size="10" fill="%23ffffff" opacity="0.3">🌸</text><text x="5" y="10" text-anchor="middle" font-size="6" fill="%23ffffff" opacity="0.2">🌿</text><text x="20" y="8" text-anchor="middle" font-size="6" fill="%23ffffff" opacity="0.2">🌿</text></pattern></defs><rect width="100" height="100" fill="url(%23garden)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        brand: "vibes-garden",
      },
    },

    {
      id: "neon-disco-party",
      name: "Vibes Neon Disco Fever",
      category: "Birthday",
      thumbnail: "🕺",
      premium: true,
      elements: [
        {
          id: "disco-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><pattern id="disco" patternUnits="userSpaceOnUse" width="30" height="30"><rect x="10" y="10" width="3" height="3" fill="%23ff00ff" opacity="0.4"/><rect x="17" y="5" width="3" height="3" fill="%2300ffff" opacity="0.4"/><rect x="5" y="20" width="3" height="3" fill="%23ffff00" opacity="0.4"/><rect x="20" y="22" width="3" height="3" fill="%23ff0080" opacity="0.4"/></pattern></defs><rect width="60" height="60" fill="url(%23disco)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        brand: "vibes-disco",
      },
    },

    {
      id: "beach-bonfire",
      name: "Vibes Beach Bonfire Night",
      category: "Birthday",
      thumbnail: "🔥",
      premium: false,
      elements: [
        {
          id: "beach-bg",
          type: "background",
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          rotation: 0,
          opacity: 1,
          zIndex: 0,
          style: {
            background: "linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)",
            backgroundImage:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><pattern id="beach" patternUnits="userSpaceOnUse" width="40" height="40"><text x="20" y="25" text-anchor="middle" font-size="12" fill="%23ffffff" opacity="0.2">🔥</text><text x="10" y="10" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.15">🌊</text><text x="30" y="35" text-anchor="middle" font-size="8" fill="%23ffffff" opacity="0.15">🌊</text></pattern></defs><rect width="80" height="80" fill="url(%23beach)"/></svg>\')',
          },
        },
      ],
      style: {
        background: "linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)",
        brand: "vibes-beach",
      },
    },
  ];

  const designElements = [
    {
      type: "text",
      icon: Type,
      name: "Text",
      description: "Custom text with fonts",
    },
    {
      type: "image",
      icon: Image,
      name: "Image",
      description: "Photos & graphics",
    },
    {
      type: "shape",
      icon: Layers,
      name: "Shapes",
      description: "Geometric elements",
    },
    {
      type: "background",
      icon: PaintBucket,
      name: "Background",
      description: "Patterns & gradients",
    },
    { type: "logo", icon: Upload, name: "Logo", description: "Brand elements" },
    {
      type: "border",
      icon: Crop,
      name: "Borders",
      description: "Ornate frames",
    },
    {
      type: "animation",
      icon: Sparkles,
      name: "Animation",
      description: "Motion effects",
    },
    {
      type: "music",
      icon: Music,
      name: "Music",
      description: "Background audio",
    },
    {
      type: "video",
      icon: Video,
      name: "Video",
      description: "Video backgrounds",
    },
    {
      type: "qr",
      icon: QrCode,
      name: "QR Code",
      description: "Quick response codes",
    },
    {
      type: "calendar",
      icon: Calendar,
      name: "Calendar",
      description: "Date integration",
    },
    {
      type: "rsvp",
      icon: MessageSquare,
      name: "RSVP",
      description: "Response buttons",
    },
  ];

  // Functions
  const addElement = useCallback(
    (type: DesignElement["type"], content: any = {}) => {
      const newElement: DesignElement = {
        id: `element_${Date.now()}`,
        type,
        x: Math.random() * (canvasSize.width - 200),
        y: Math.random() * (canvasSize.height - 100),
        width: type === "text" ? 200 : 150,
        height: type === "text" ? 50 : 100,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
        content: {
          ...content,
          text: type === "text" ? content.text || "Click to edit" : undefined,
          src:
            type === "image"
              ? content.src ||
                "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=150&h=100&fit=crop&auto=format"
              : undefined,
          shape: type === "shape" ? content.shape || "rectangle" : undefined,
          color: content.color || colorScheme.primary,
        },
        style: {
          fontSize: type === "text" ? 18 : undefined,
          fontFamily: type === "text" ? "Inter" : undefined,
          fontWeight: type === "text" ? "normal" : undefined,
          color: type === "text" ? colorScheme.text : colorScheme.primary,
          backgroundColor:
            type === "shape" ? colorScheme.primary : "transparent",
          borderRadius: type === "shape" ? 4 : 0,
          border:
            type === "border" ? `2px solid ${colorScheme.accent}` : "none",
        },
      };

      setElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);

      toast({
        title: "Element Added",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } element added to canvas`,
      });
    },
    [elements.length, canvasSize, colorScheme, toast]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<DesignElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      toast({
        title: "Element Deleted",
        description: "Element removed from canvas",
      });
    },
    [selectedElement, toast]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id);
      if (element) {
        const duplicate = {
          ...element,
          id: `element_${Date.now()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: Math.max(...elements.map((el) => el.zIndex)) + 1,
        };
        setElements((prev) => [...prev, duplicate]);
        setSelectedElement(duplicate.id);
      }
    },
    [elements]
  );

  const applyTemplate = useCallback(
    (template: Template) => {
      setSelectedTemplate(template.id);
      setElements(template.elements || []);
      setSelectedElement(null);

      // Apply template colors to color scheme
      if (template.style?.background?.includes("gradient")) {
        // Extract colors from gradient if needed
        setColorScheme((prev) => ({
          ...prev,
          background: template.style.background,
        }));
      }

      toast({
        title: "Template Applied",
        description: `${template.name} template loaded successfully`,
      });
    },
    [toast]
  );

  const saveDesign = useMutation({
    mutationFn: async () => {
      const designData = {
        id: `design_${Date.now()}`,
        name: eventTitle || "Untitled Design",
        elements,
        colorScheme,
        canvasSize,
        metadata: {
          eventTitle,
          eventMessage,
          eventDate,
          eventLocation,
          hostName,
          template: selectedTemplate,
        },
      };

      return await apiRequest("POST", "/api/vibescard-designs", designData);
    },
    onSuccess: () => {
      toast({
        title: "Design Saved",
        description: "Your invitation design has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportDesign = useCallback(() => {
    // Export logic would go here
    toast({
      title: "Export Started",
      description: "Your invitation is being prepared for download",
    });
  }, [toast]);

  const selectedEl = elements.find((el) => el.id === selectedElement);

  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="min-h-screen bg-[#111827]">
      <Navigation />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? "w-16" : "w-80"
          } bg-[#1F2937] text-white dark:bg-gray-800   dark:border-gray-300 flex flex-col transition-all duration-300`}
        >
          {/* Sidebar Header */}
          <div className="p-4  dark:border-gray-700 border-gray-300 border-b mb-1">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-white">
                  VibesCard Studio
                </h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto ">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 m-2">
                  <TabsTrigger value="design" className="text-xs">
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="content" className="text-xs">
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="export" className="text-xs">
                    Export
                  </TabsTrigger>
                </TabsList>

                {/* Design Tab */}
                <TabsContent value="design" className="px-4 pb-4 space-y-4">
                  {/* Templates Section */}
                  <Card className="bg-[#0A0A0A] text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Templates</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Category Filter */}
                      <div className="space-y-2">
                        <Label className="text-xs">Category</Label>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {templateCategories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                className="text-xs"
                              >
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Search */}
                      <div className="space-y-2">
                        <Label className="text-xs">Search</Label>
                        <Input
                          placeholder="Search templates..."
                          value={templateSearch}
                          onChange={(e) => setTemplateSearch(e.target.value)}
                          className="text-xs"
                        />
                      </div>

                      {/* Template Grid */}
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {templates
                          .filter(
                            (template) =>
                              (selectedCategory === "All" ||
                                template.category === selectedCategory) &&
                              (templateSearch === "" ||
                                template.name
                                  .toLowerCase()
                                  .includes(templateSearch.toLowerCase()))
                          )
                          .map((template) => (
                            <div
                              key={template.id}
                              className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all transform hover:scale-105 w-full
          ${
            selectedTemplate === template.id
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
          }`}
                              onClick={() => applyTemplate(template)}
                            >
                              <div className="text-2xl mb-2 text-center">
                                {template.thumbnail}
                              </div>
                              <div className="text-xs font-medium text-center">
                                {template.name}
                              </div>
                              <div className="text-xs text-gray-500 text-center mt-1">
                                {template.category}
                              </div>
                              {template.premium && (
                                <Badge className="absolute top-1 right-1 text-xs bg-yellow-500">
                                  Pro
                                </Badge>
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Template Count */}
                      <div className="text-xs text-gray-500 text-center">
                        {
                          templates.filter(
                            (template) =>
                              (selectedCategory === "All" ||
                                template.category === selectedCategory) &&
                              (templateSearch === "" ||
                                template.name
                                  .toLowerCase()
                                  .includes(templateSearch.toLowerCase()))
                          ).length
                        }{" "}
                        templates available
                      </div>
                    </CardContent>
                  </Card>

                  {/* Elements Section */}
                  <Card className="bg-[#0A0A0A] text-black w-full max-w-lg mx-auto">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Elements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {designElements.map((element) => (
                          <Button
                            key={element.type}
                            variant="outline"
                            className="h-auto p-3 flex flex-col items-center gap-2 w-full"
                            onClick={() =>
                              addElement(element.type as DesignElement["type"])
                            }
                          >
                            <element.icon className="w-5 h-5" />
                            <div className="text-xs text-center flex flex-col gap-1">
                              {/* Name - max 2 lines */}
                              <div className="font-medium break-words line-clamp-2 text-center">
                                {element.name}
                              </div>
                              {/* Description - max 2 lines */}
                              <div className="text-gray-500 dark:text-gray-400 break-words line-clamp-2 text-center">
                                {element.description}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Colors Section */}
                  <Card className="bg-[#0A0A0A] text-white">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Color Scheme</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(colorScheme).map(([key, color]) => (
                          <div key={key} className="text-center">
                            <div
                              className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer mx-auto mb-1"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                // Color picker logic would go here
                              }}
                            />
                            <div className="text-xs capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="px-4 pb-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Event Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="eventTitle">Event Title</Label>
                        <Input
                          id="eventTitle"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Enter event title"
                        />
                      </div>

                      <div>
                        <Label htmlFor="eventMessage">Message</Label>
                        <Textarea
                          id="eventMessage"
                          value={eventMessage}
                          onChange={(e) => setEventMessage(e.target.value)}
                          placeholder="Event description or message"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="eventDate">Date & Time</Label>
                        <Input
                          id="eventDate"
                          type="datetime-local"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="eventLocation">Location</Label>
                        <Input
                          id="eventLocation"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="Event location"
                        />
                      </div>

                      <div>
                        <Label htmlFor="hostName">Host Name</Label>
                        <Input
                          id="hostName"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          placeholder="Your name"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="px-4 pb-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Canvas Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Canvas Size</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="square">
                              Square (800x800)
                            </SelectItem>
                            <SelectItem value="landscape">
                              Landscape (800x600)
                            </SelectItem>
                            <SelectItem value="portrait">
                              Portrait (600x800)
                            </SelectItem>
                            <SelectItem value="social">
                              Social Media (1200x630)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Zoom Level: {zoom}%</Label>
                        <Slider
                          value={[zoom]}
                          onValueChange={(value) => setZoom(value[0])}
                          min={25}
                          max={200}
                          step={25}
                          className="mt-2"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="grid"
                          checked={gridVisible}
                          onCheckedChange={(checked) =>
                            setGridVisible(checked === true)
                          }
                        />
                        <Label htmlFor="grid">Show Grid</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Export Tab */}
                <TabsContent value="export" className="px-4 pb-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Export Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button
                        onClick={() => saveDesign.mutate()}
                        disabled={saveDesign.isPending}
                        className="w-full"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saveDesign.isPending ? "Saving..." : "Save Design"}
                      </Button>

                      <Button
                        onClick={exportDesign}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>

                      <Button variant="outline" className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                      </Button>

                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invites
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col ">
          {/* Top Toolbar */}
          <div className="bg-[#1F2937] border-gray-300 border-b text-white dark:bg-gray-800  dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  value={eventTitle || "Untitled Design"}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="text-lg font-semibold border-none bg-transparent focus:ring-0 focus:border-none p-0"
                />

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6" />

                  <Button variant="ghost" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  <Button variant="ghost" size="sm">
                    <RotateCw className="w-4 h-4" />
                  </Button>

                  <Separator orientation="vertical" className="h-6" />

                  <span className="text-sm text-gray-500">{zoom}%</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => saveDesign.mutate()}
                  disabled={saveDesign.isPending}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>

                <Button onClick={exportDesign} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <Button variant="outline" size="sm" className="text-black">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-[#111827] dark:bg-gray-900 p-8 overflow-auto">
            <div className="flex items-center justify-center min-h-full">
              <div
                ref={canvasRef}
                className="relative bg-white rounded-lg shadow-lg"
                style={{
                  width: canvasSize.width * (zoom / 100),
                  height: canvasSize.height * (zoom / 100),
                  backgroundImage: gridVisible
                    ? "radial-gradient(circle, #ccc 1px, transparent 1px)"
                    : "none",
                  backgroundSize: gridVisible ? "20px 20px" : "none",
                }}
              >
                {/* Background */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: colorScheme.background.includes("gradient")
                      ? colorScheme.background
                      : colorScheme.background,
                  }}
                />

                {/* Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer ${
                      selectedElement === element.id
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    style={{
                      left: element.x * (zoom / 100),
                      top: element.y * (zoom / 100),
                      width: element.width * (zoom / 100),
                      height: element.height * (zoom / 100),
                      transform: `rotate(${element.rotation}deg)`,
                      opacity: element.opacity,
                      zIndex: element.zIndex,
                      ...element.style,
                    }}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    {element.type === "text" && (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          updateElement(element.id, {
                            content: {
                              ...element.content,
                              text: e.target.textContent,
                            },
                          });
                        }}
                        className="w-full h-full outline-hidden"
                        style={{
                          fontSize:
                            (element.style?.fontSize || 16) * (zoom / 100),
                          fontFamily: element.style?.fontFamily,
                          fontWeight: element.style?.fontWeight,
                          color: element.style?.color,
                          textAlign: element.style?.textAlign,
                          textShadow: element.style?.textShadow,
                          letterSpacing: element.style?.letterSpacing,
                          fontStyle: element.style?.fontStyle,
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            element.style?.textAlign === "center"
                              ? "center"
                              : element.style?.textAlign === "right"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        {element.content?.text}
                      </div>
                    )}

                    {element.type === "logo" && (
                      <div
                        className="w-full h-full flex items-center justify-center font-bold"
                        style={{
                          fontSize:
                            (element.style?.fontSize || 20) * (zoom / 100),
                          fontFamily: element.style?.fontFamily,
                          fontWeight: element.style?.fontWeight,
                          color: element.style?.color,
                          textAlign: element.style?.textAlign,
                          letterSpacing: element.style?.letterSpacing,
                        }}
                      >
                        {element.content?.text ||
                          element.content?.emblem ||
                          "LOGO"}
                      </div>
                    )}

                    {element.type === "background" && (
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{
                          background: element.style?.background,
                          backgroundImage: element.style?.backgroundImage,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "repeat",
                        }}
                      />
                    )}

                    {element.type === "image" && (
                      <img
                        src={element.content?.src}
                        alt="Design element"
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                      />
                    )}

                    {element.type === "shape" && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.style?.backgroundColor,
                          borderRadius: element.style?.borderRadius,
                        }}
                      />
                    )}

                    {element.type === "border" && (
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{
                          border: element.style?.border,
                          borderRadius: element.style?.borderRadius,
                          background: element.style?.background,
                          boxShadow: element.style?.boxShadow,
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Event Content Overlay */}
                {(eventTitle || eventMessage || eventDate || eventLocation) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
                    {eventTitle && (
                      <h1
                        className="text-4xl font-bold mb-4"
                        style={{
                          color: colorScheme.text,
                          fontSize: 32 * (zoom / 100),
                        }}
                      >
                        {eventTitle}
                      </h1>
                    )}
                    {eventMessage && (
                      <p
                        className="text-lg mb-6 max-w-md"
                        style={{
                          color: colorScheme.text,
                          fontSize: 16 * (zoom / 100),
                        }}
                      >
                        {eventMessage}
                      </p>
                    )}
                    {eventDate && (
                      <div
                        className="text-xl font-semibold mb-2"
                        style={{
                          color: colorScheme.primary,
                          fontSize: 18 * (zoom / 100),
                        }}
                      >
                        {new Date(eventDate).toLocaleDateString()}
                      </div>
                    )}
                    {eventLocation && (
                      <div
                        className="text-lg"
                        style={{
                          color: colorScheme.text,
                          fontSize: 16 * (zoom / 100),
                        }}
                      >
                        📍 {eventLocation}
                      </div>
                    )}
                    {hostName && (
                      <div
                        className="text-sm mt-4"
                        style={{
                          color: colorScheme.secondary,
                          fontSize: 14 * (zoom / 100),
                        }}
                      >
                        Hosted by {hostName}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        {selectedEl && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Properties</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateElement(selectedEl.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteElement(selectedEl.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Position & Size */}
              <div className="space-y-3">
                <h4 className="font-medium">Position & Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>X</Label>
                    <Input
                      type="number"
                      value={selectedEl.x}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          x: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Y</Label>
                    <Input
                      type="number"
                      value={selectedEl.y}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          y: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={selectedEl.width}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          width: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={selectedEl.height}
                      onChange={(e) =>
                        updateElement(selectedEl.id, {
                          height: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Style Properties */}
              {selectedEl.type === "text" && (
                <div className="space-y-3">
                  <h4 className="font-medium">Text Style</h4>
                  <div>
                    <Label>Font Size</Label>
                    <Slider
                      value={[selectedEl.style?.fontSize || 18]}
                      onValueChange={(value) =>
                        updateElement(selectedEl.id, {
                          style: { ...selectedEl.style, fontSize: value[0] },
                        })
                      }
                      min={12}
                      max={72}
                      step={1}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={
                        selectedEl.style?.fontWeight === "bold"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateElement(selectedEl.id, {
                          style: {
                            ...selectedEl.style,
                            fontWeight:
                              selectedEl.style?.fontWeight === "bold"
                                ? "normal"
                                : "bold",
                          },
                        })
                      }
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={
                        selectedEl.style?.fontStyle === "italic"
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        updateElement(selectedEl.id, {
                          style: {
                            ...selectedEl.style,
                            fontStyle:
                              selectedEl.style?.fontStyle === "italic"
                                ? "normal"
                                : "italic",
                          },
                        })
                      }
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Opacity */}
              <div className="space-y-3">
                <h4 className="font-medium">Opacity</h4>
                <Slider
                  value={[selectedEl.opacity * 100]}
                  onValueChange={(value) =>
                    updateElement(selectedEl.id, { opacity: value[0] / 100 })
                  }
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <Separator />

              {/* Rotation */}
              <div className="space-y-3">
                <h4 className="font-medium">Rotation</h4>
                <Slider
                  value={[selectedEl.rotation]}
                  onValueChange={(value) =>
                    updateElement(selectedEl.id, { rotation: value[0] })
                  }
                  min={-180}
                  max={180}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
