import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Lightbulb,
  Music,
  Camera,
  Flower,
  Gift,
  Star,
  Heart,
  Crown,
  Sparkles,
  Wand2,
  Eye,
  RotateCcw,
  Save,
  Download,
  Upload,
  Settings,
  Maximize,
  Move3D,
  Sun,
  Moon,
  TreePine,
  Gem,
  Cake,
  PartyPopper,
  Circle,
} from "lucide-react";

interface DecorationItem {
  id: string;
  type:
    | "balloons"
    | "lights"
    | "flowers"
    | "banners"
    | "centerpieces"
    | "draping"
    | "backdrop"
    | "lighting";
  name: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  scale: number;
  color: string;
  style: string;
  animation?: string;
  price?: number;
}

interface PartyTheme {
  id: string;
  name: string;
  colors: string[];
  decorationTypes: string[];
  ambiance: string;
  description: string;
}

export default function PartyHallDecorator() {
  const [decorations, setDecorations] = useState<DecorationItem[]>([]);
  const [selectedDecoration, setSelectedDecoration] =
    useState<DecorationItem | null>(null);
  const [currentTheme, setCurrentTheme] = useState<PartyTheme | null>(null);
  // Default to preview mode: design-mode UI is commented out/disabled below
  const [viewMode, setViewMode] = useState<"design" | "preview" | "3d">(
    "preview"
  );
  const [lighting, setLighting] = useState({
    ambient: 0.6,
    warmth: 0.7,
    intensity: 0.8,
    color: "#FFE4B5",
  });
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 50, z: 100 });
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [venueLocation, setVenueLocation] = useState("");
  const [showSatelliteView, setShowSatelliteView] = useState(false);
  const [venueCoordinates, setVenueCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Party themes with realistic decoration combinations
  const partyThemes: PartyTheme[] = [
    {
      id: "elegant-wedding",
      name: "Elegant Wedding",
      colors: ["#FFFFFF", "#F8F8FF", "#E6E6FA", "#D4A574"],
      decorationTypes: [
        "white roses",
        "silk draping",
        "crystal centerpieces",
        "string lights",
      ],
      ambiance: "romantic",
      description:
        "Classic white and gold with flowing drapes and crystal accents",
    },
    {
      id: "birthday-celebration",
      name: "Birthday Celebration",
      colors: ["#FF69B4", "#FFD700", "#32CD32", "#FF6347"],
      decorationTypes: [
        "colorful balloons",
        "confetti",
        "birthday banners",
        "cake table",
      ],
      ambiance: "festive",
      description:
        "Vibrant colors with balloons, streamers, and party favorites",
    },
    {
      id: "corporate-gala",
      name: "Corporate Gala",
      colors: ["#1E1E1E", "#C0C0C0", "#FFD700", "#4169E1"],
      decorationTypes: [
        "professional draping",
        "spotlight lighting",
        "branded backdrops",
      ],
      ambiance: "sophisticated",
      description:
        "Professional elegance with branded elements and ambient lighting",
    },
    {
      id: "garden-party",
      name: "Garden Party",
      colors: ["#98FB98", "#FFB6C1", "#FFFFE0", "#87CEEB"],
      decorationTypes: [
        "fresh flowers",
        "garden lights",
        "natural arrangements",
        "outdoor draping",
      ],
      ambiance: "natural",
      description: "Fresh and natural with garden-inspired decorations",
    },
    {
      id: "vintage-glam",
      name: "Vintage Glam",
      colors: ["#B8860B", "#CD853F", "#F5DEB3", "#2F4F4F"],
      decorationTypes: [
        "art deco elements",
        "vintage centerpieces",
        "gold accents",
        "dramatic lighting",
      ],
      ambiance: "glamorous",
      description: "Art deco inspired with gold accents and vintage charm",
    },
  ];

  // Comprehensive decoration catalog
  const decorationCatalog = {
    balloons: [
      {
        name: "Latex Balloon Clusters",
        colors: ["red", "blue", "gold", "white"],
        price: 15,
      },
      {
        name: "Foil Letter Balloons",
        colors: ["silver", "gold", "rose-gold"],
        price: 25,
      },
      {
        name: "Balloon Arches",
        colors: ["rainbow", "monochrome", "gradient"],
        price: 85,
      },
      {
        name: "Helium Heart Balloons",
        colors: ["pink", "red", "white"],
        price: 12,
      },
      {
        name: "Number Balloons",
        colors: ["gold", "silver", "multicolor"],
        price: 18,
      },
    ],
    lighting: [
      {
        name: "String Fairy Lights",
        colors: ["warm-white", "cool-white", "multicolor"],
        price: 35,
      },
      {
        name: "LED Uplighting",
        colors: ["any-color", "rgb-changing"],
        price: 45,
      },
      {
        name: "Chandelier Rental",
        colors: ["crystal", "gold", "modern"],
        price: 120,
      },
      {
        name: "Spotlight System",
        colors: ["white", "colored-gels"],
        price: 75,
      },
      {
        name: "Disco Ball Lighting",
        colors: ["classic-silver", "led-multicolor"],
        price: 40,
      },
    ],
    flowers: [
      {
        name: "Rose Centerpieces",
        colors: ["red", "white", "pink", "mixed"],
        price: 65,
      },
      {
        name: "Hydrangea Arrangements",
        colors: ["blue", "white", "pink"],
        price: 55,
      },
      {
        name: "Tropical Arrangements",
        colors: ["bright-mixed", "orange-red"],
        price: 70,
      },
      {
        name: "Wildflower Bouquets",
        colors: ["mixed-pastels", "bright-mixed"],
        price: 45,
      },
      {
        name: "Orchid Displays",
        colors: ["white", "purple", "pink"],
        price: 80,
      },
    ],
    draping: [
      {
        name: "Ceiling Drapes",
        colors: ["white", "ivory", "blush"],
        price: 150,
      },
      {
        name: "Wall Draping",
        colors: ["white", "colored", "gradient"],
        price: 100,
      },
      {
        name: "Backdrop Curtains",
        colors: ["solid", "sequined", "patterned"],
        price: 85,
      },
      { name: "Table Runners", colors: ["satin", "lace", "burlap"], price: 25 },
      {
        name: "Chair Covers",
        colors: ["white", "colored", "patterned"],
        price: 8,
      },
    ],
    centerpieces: [
      {
        name: "Candle Arrangements",
        colors: ["white", "colored", "mixed"],
        price: 35,
      },
      {
        name: "Crystal Displays",
        colors: ["clear", "colored", "mixed"],
        price: 75,
      },
      {
        name: "Fruit Arrangements",
        colors: ["seasonal", "tropical", "mixed"],
        price: 45,
      },
      {
        name: "Themed Sculptures",
        colors: ["gold", "silver", "colored"],
        price: 95,
      },
      {
        name: "Glass Terrariums",
        colors: ["green", "mixed", "seasonal"],
        price: 55,
      },
    ],
  };

  useEffect(() => {
    // Initialize with a sample decorated hall
    initializeSampleDecoration();
  }, []);

  const initializeSampleDecoration = () => {
    const sampleDecorations: DecorationItem[] = [
      // Entrance balloon arch
      {
        id: "entrance-arch",
        type: "balloons",
        name: "Rainbow Balloon Arch",
        position: { x: 0, y: 20, z: -80 },
        rotation: 0,
        scale: 1.2,
        color: "#FF69B4",
        style: "arch",
        animation: "gentle-sway",
      },
      // Central chandelier
      {
        id: "main-chandelier",
        type: "lighting",
        name: "Crystal Chandelier",
        position: { x: 0, y: 80, z: 0 },
        rotation: 0,
        scale: 1.5,
        color: "#FFD700",
        style: "crystal",
        animation: "sparkle",
      },
      // Stage backdrop
      {
        id: "stage-backdrop",
        type: "backdrop",
        name: "Sequined Backdrop",
        position: { x: 0, y: 40, z: 80 },
        rotation: 0,
        scale: 2,
        color: "#C0C0C0",
        style: "sequined",
        animation: "shimmer",
      },
      // Table centerpieces
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `centerpiece-${i}`,
        type: "centerpieces" as const,
        name: "Rose Centerpiece",
        position: {
          x: ((i % 4) - 1.5) * 60,
          y: 10,
          z: Math.floor(i / 4) * 40 - 20,
        },
        rotation: 0,
        scale: 0.8,
        color: "#FF1493",
        style: "roses",
        animation: "subtle-glow",
      })),
      // Wall draping
      {
        id: "wall-draping-left",
        type: "draping",
        name: "Wall Drapes",
        position: { x: -120, y: 40, z: 0 },
        rotation: 0,
        scale: 1,
        color: "#F0F8FF",
        style: "flowing",
        animation: "gentle-wave",
      },
      {
        id: "wall-draping-right",
        type: "draping",
        name: "Wall Drapes",
        position: { x: 120, y: 40, z: 0 },
        rotation: 0,
        scale: 1,
        color: "#F0F8FF",
        style: "flowing",
        animation: "gentle-wave",
      },
      // Ambient lighting
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `uplight-${i}`,
        type: "lighting" as const,
        name: "LED Uplight",
        position: {
          x: ((i % 3) - 1) * 80,
          y: 5,
          z: Math.floor(i / 3) * 60 - 30,
        },
        rotation: 0,
        scale: 0.5,
        color: "#87CEEB",
        style: "uplight",
        animation: "color-cycle",
      })),
    ];

    setDecorations(sampleDecorations);
    setCurrentTheme(partyThemes[1]); // Birthday theme
  };

  const addDecoration = (type: string, item: any) => {
    const newDecoration: DecorationItem = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      name: item.name,
      position: { x: 0, y: 20, z: 0 },
      rotation: 0,
      scale: 1,
      color: item.colors[0] || "#FF69B4",
      style: "default",
      price: item.price,
    };
    setDecorations([...decorations, newDecoration]);
    setSelectedDecoration(newDecoration);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, type: string, item: any) => {
    e.dataTransfer.setData("decorationType", type);
    e.dataTransfer.setData("decorationItem", JSON.stringify(item));
    setDraggedItem({ type, item });
  };

  const handleDecorationDragStart = (
    e: React.DragEvent,
    decoration: DecorationItem
  ) => {
    e.dataTransfer.setData("decorationId", decoration.id);
    setIsDragging(true);
    setSelectedDecoration(decoration);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropZoneActive(false);
    setIsDragging(false);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 200; // Convert to our coordinate system
    const y = (0.5 - (e.clientY - rect.top) / rect.height) * 200;

    // Snap to grid if enabled
    const snapX = showGrid ? Math.round(x / 10) * 10 : x;
    const snapY = showGrid ? Math.round(y / 10) * 10 : y;

    const decorationType = e.dataTransfer.getData("decorationType");
    const decorationItem = e.dataTransfer.getData("decorationItem");
    const decorationId = e.dataTransfer.getData("decorationId");

    if (decorationId) {
      // Moving existing decoration
      updateDecoration(decorationId, {
        position: { x: snapX, y: snapY, z: 0 },
      });
    } else if (decorationType && decorationItem) {
      // Adding new decoration
      const item = JSON.parse(decorationItem);
      const newDecoration: DecorationItem = {
        id: `${decorationType}-${Date.now()}`,
        type: decorationType as any,
        name: item.name,
        position: { x: snapX, y: snapY, z: 0 },
        rotation: 0,
        scale: 1,
        color: item.colors[0] || "#FF69B4",
        style: "default",
        price: item.price,
      };
      setDecorations([...decorations, newDecoration]);
      setSelectedDecoration(newDecoration);
    }

    setDraggedItem(null);
  };

  // Venue location and satellite view handlers
  const handleLocationSubmit = async () => {
    if (!venueLocation.trim()) return;

    try {
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(venueLocation)}`
      );
      if (response.ok) {
        const data = await response.json();
        setVenueCoordinates({ lat: data.lat, lng: data.lng });
        setShowSatelliteView(true);
      }
    } catch (error) {
      console.error(
        "Geocoding service unavailable. Please ensure proper API keys are configured."
      );
    }
  };

  const updateDecoration = (id: string, updates: Partial<DecorationItem>) => {
    setDecorations(
      decorations.map((dec) => (dec.id === id ? { ...dec, ...updates } : dec))
    );
    if (selectedDecoration?.id === id) {
      setSelectedDecoration({ ...selectedDecoration, ...updates });
    }
  };

  const removeDecoration = (id: string) => {
    setDecorations(decorations.filter((dec) => dec.id !== id));
    if (selectedDecoration?.id === id) {
      setSelectedDecoration(null);
    }
  };

  const applyTheme = (theme: PartyTheme) => {
    setCurrentTheme(theme);
    // Apply theme colors to existing decorations
    const themedDecorations = decorations.map((dec) => ({
      ...dec,
      color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
    }));
    setDecorations(themedDecorations);
  };

  const renderDecoration = (decoration: DecorationItem) => {
    const { position, rotation, scale, color, type, style, animation } =
      decoration;

    const baseStyle = {
      position: "absolute" as const,
      left: `${50 + position.x / 2}%`,
      top: `${50 - position.y / 2}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale}) translateZ(${position.z}px)`,
      transformStyle: "preserve-3d" as const,
      transition: "all 0.3s ease",
      cursor: "pointer",
      zIndex: Math.floor(100 - position.z / 10),
    };

    const animationClass = animation ? `animate-${animation}` : "";

    switch (type) {
      case "balloons":
        return (
          <div
            key={decoration.id}
            style={{
              ...baseStyle,
              width: style === "arch" ? "120px" : "60px",
              height: style === "arch" ? "80px" : "80px",
            }}
            className={`${animationClass} hover:scale-110 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            <div className="relative">
              {style === "arch" ? (
                <div className="flex space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-6 rounded-full shadow-lg"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 2px 8px ${color}50`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="w-12 h-16 rounded-full shadow-lg relative"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 4px 12px ${color}50`,
                  }}
                >
                  <div className="absolute bottom-0 left-1/2 w-px h-4 bg-gray-400 transform -translate-x-1/2" />
                </div>
              )}
            </div>
          </div>
        );

      case "lighting":
        return (
          <div
            key={decoration.id}
            style={baseStyle}
            className={`${animationClass} hover:scale-110 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            {style === "crystal" ? (
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-radial from-yellow-200 to-transparent opacity-80"
                  style={{ boxShadow: `0 0 20px ${color}` }}
                />
                <Gem className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-300" />
              </div>
            ) : style === "uplight" ? (
              <div className="relative">
                <div className="w-8 h-12 bg-linear-to-t from-gray-800 to-gray-600 rounded-t-lg" />
                <div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full opacity-60"
                  style={{
                    background: `radial-gradient(circle, ${color}80 0%, transparent 70%)`,
                    boxShadow: `0 0 15px ${color}`,
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-wrap w-16">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full m-px animate-pulse"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 3px ${color}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case "flowers":
        return (
          <div
            key={decoration.id}
            style={baseStyle}
            className={`${animationClass} hover:scale-110 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            <div className="relative">
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <Flower
                    key={i}
                    className="w-6 h-6 -mt-2"
                    style={{ color: color }}
                  />
                ))}
                <div className="w-8 h-6 bg-green-600 rounded-full opacity-80" />
              </div>
            </div>
          </div>
        );

      case "draping":
        return (
          <div
            key={decoration.id}
            style={{
              ...baseStyle,
              width: "60px",
              height: "120px",
            }}
            className={`${animationClass} hover:scale-105 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            <div
              className="w-full h-full bg-linear-to-b from-opacity-20 to-opacity-80 rounded-b-full"
              style={{
                backgroundColor: color,
                background: `linear-gradient(to bottom, ${color}40, ${color}80)`,
              }}
            />
          </div>
        );

      case "centerpieces":
        return (
          <div
            key={decoration.id}
            style={baseStyle}
            className={`${animationClass} hover:scale-110 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            <div className="relative flex flex-col items-center">
              <div
                className="w-12 h-8 rounded-full shadow-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}40` }}
              >
                {style === "roses" && (
                  <Flower className="w-6 h-6" style={{ color }} />
                )}
                {style === "candles" && (
                  <Sun className="w-6 h-6 text-yellow-400" />
                )}
                {style === "crystal" && (
                  <Gem className="w-6 h-6" style={{ color }} />
                )}
              </div>
              <div className="w-8 h-2 bg-brown-600 rounded-full mt-1" />
            </div>
          </div>
        );

      case "backdrop":
        return (
          <div
            key={decoration.id}
            style={{
              ...baseStyle,
              width: "120px",
              height: "80px",
            }}
            className={`${animationClass} hover:scale-105 cursor-grab active:cursor-grabbing transition-transform`}
            draggable
            onDragStart={(e) => handleDecorationDragStart(e, decoration)}
            onClick={() => setSelectedDecoration(decoration)}
          >
            <div
              className="w-full h-full rounded-lg shadow-lg"
              style={{
                backgroundColor: color,
                background:
                  style === "sequined"
                    ? `linear-gradient(45deg, ${color} 25%, transparent 25%), linear-gradient(-45deg, ${color} 25%, transparent 25%)`
                    : color,
                backgroundSize: style === "sequined" ? "6px 6px" : "auto",
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const calculateTotalCost = () => {
    return decorations.reduce((total, dec) => total + (dec.price || 0), 0);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-xs border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Party Hall Decorator
              </h1>
              <p className="text-gray-600">
                Design and visualize your perfect party setup
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Total: ${calculateTotalCost()}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-6">
        {/* Left Sidebar - Decoration Catalog */}
        <div className="col-span-3 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Party Themes
            </h3>
            <div className="space-y-2">
              {partyThemes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={
                    currentTheme?.id === theme.id ? "default" : "outline"
                  }
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => applyTheme(theme)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {theme.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white"
                          style={{
                            backgroundColor: color,
                            marginLeft: i > 0 ? "-4px" : 0,
                          }}
                        />
                      ))}
                    </div>
                    <span>{theme.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Decorations moved to the right sidebar per request */}

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Venue Location
            </h3>
            <div className="space-y-3 mb-4">
              <div>
                <Label className="text-sm">Venue Address</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Enter venue address..."
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleLocationSubmit()
                    }
                  />
                  <Button
                    size="sm"
                    onClick={handleLocationSubmit}
                    disabled={!venueLocation.trim()}
                  >
                    Locate
                  </Button>
                </div>
              </div>
              {showSatelliteView && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowSatelliteView(!showSatelliteView)}
                >
                  {showSatelliteView ? "Hide" : "Show"} Satellite View
                </Button>
              )}
            </div>
          </Card>

          {/*
            View Controls - commented out per request
            The view mode selector, lighting intensity and animation speed
            controls have been disabled by commenting this block.
          
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              View Controls
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm">View Mode</Label>
                <Select
                  value={viewMode}
                  onValueChange={(value: any) => setViewMode(value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design Mode</SelectItem>
                    <SelectItem value="preview">Preview Mode</SelectItem>
                    <SelectItem value="3d">3D Walkthrough</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Lighting Intensity</Label>
                <Slider
                  value={[lighting.intensity]}
                  onValueChange={([value]) =>
                    setLighting({ ...lighting, intensity: value })
                  }
                  max={1}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm">Animation Speed</Label>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={([value]) => setAnimationSpeed(value)}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
          */}
        </div>

        {/* Main Hall Visualization */}
        <div className="col-span-6">
          {showSatelliteView && venueCoordinates ? (
            <Card className="p-4 h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Satellite View - {venueLocation}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSatelliteView(false)}
                  >
                    Back to Decorator
                  </Button>
                </div>
              </div>

              <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                      <TreePine className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Satellite View Ready
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Location: {venueCoordinates.lat.toFixed(4)},{" "}
                        {venueCoordinates.lng.toFixed(4)}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        Satellite imagery requires Google Maps or Mapbox API
                        keys.
                        <br />
                        Contact your administrator to configure mapping
                        services.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 max-w-md">
                      <div className="bg-white p-3 rounded-lg shadow-sm border">
                        <div className="text-sm font-medium">
                          Building Outline
                        </div>
                        <div className="text-xs text-gray-500">
                          Available with API
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border">
                        <div className="text-sm font-medium">Parking Areas</div>
                        <div className="text-xs text-gray-500">
                          Available with API
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border">
                        <div className="text-sm font-medium">Access Routes</div>
                        <div className="text-xs text-gray-500">
                          Available with API
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border">
                        <div className="text-sm font-medium">
                          Nearby Landmarks
                        </div>
                        <div className="text-xs text-gray-500">
                          Available with API
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-4 h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Party Hall -{" "}
                  {viewMode === "design"
                    ? "Design"
                    : viewMode === "preview"
                    ? "Preview"
                    : "3D"}{" "}
                  Mode
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    Grid {showGrid ? "On" : "Off"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div
                className={`relative w-full h-full bg-linear-to-b from-gray-100 to-gray-200 rounded-lg overflow-hidden transition-all duration-200 ${
                  isDropZoneActive
                    ? "ring-4 ring-blue-400 ring-opacity-50 bg-blue-50"
                    : ""
                }`}
                style={{
                  perspective: viewMode === "3d" ? "1000px" : "none",
                  background:
                    viewMode === "preview"
                      ? `linear-gradient(135deg, ${lighting.color}20, ${
                          currentTheme?.colors[0] || "#FFE4B5"
                        }10)`
                      : undefined,
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {/* Grid overlay */}
                {/* {showGrid && viewMode === "design" && (
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <defs>
                        <pattern
                          id="grid"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#000"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )} */}

                {/* Floor */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-gray-400 to-gray-500"
                  style={{
                    transform:
                      viewMode === "3d"
                        ? "rotateX(90deg) translateZ(-300px)"
                        : undefined,
                  }}
                />

                {/* Ambient lighting overlay */}
                {viewMode === "preview" && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${
                        lighting.color
                      }${Math.floor(lighting.intensity * 30)
                        .toString(16)
                        .padStart(2, "0")} 0%, transparent 50%)`,
                      opacity: lighting.ambient,
                    }}
                  />
                )}

                {/* Drop zone instructions */}
                {isDropZoneActive && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg">
                      <div className="flex items-center gap-2">
                        <Move3D className="w-5 h-5" />
                        <span className="font-medium">
                          Drop decoration here
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Decorations */}
                {decorations.map((decoration) => renderDecoration(decoration))}

                {/* Selection indicator */}
                {selectedDecoration && (
                  <div
                    className="absolute border-2 border-blue-400 rounded-lg pointer-events-none animate-pulse"
                    style={{
                      left: `${50 + selectedDecoration.position.x / 2 - 2}%`,
                      top: `${50 - selectedDecoration.position.y / 2 - 2}%`,
                      width: "40px",
                      height: "40px",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                {/* Center stage marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full opacity-50" />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar - Properties & Controls */}
        <div className="col-span-3 space-y-4">
          {/*
            Editing placeholder commented out per request. To re-enable, remove this comment and restore the block.

            {selectedDecoration ? (
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Editing Disabled</h3>
                <p className="text-sm text-gray-600">
                  Decoration editing is currently disabled.
                </p>
              </Card>
            ) : null}
          */}

          {/* Decorations (moved from left) */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Decorations
            </h3>
            <Tabs defaultValue="balloons" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs">
                <TabsTrigger value="balloons">Balloons</TabsTrigger>
                <TabsTrigger value="lighting">Lights</TabsTrigger>
                <TabsTrigger value="flowers">Flowers</TabsTrigger>
              </TabsList>

              <TabsContent value="balloons" className="mt-4 space-y-2">
                {decorationCatalog.balloons.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 border rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "balloons", item)}
                    onClick={() => addDecoration("balloons", item)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          ${item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Circle className="w-4 h-4 text-pink-500" />
                        <Move3D className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="lighting" className="mt-4 space-y-2">
                {decorationCatalog.lighting.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 border rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "lighting", item)}
                    onClick={() => addDecoration("lighting", item)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          ${item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <Move3D className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="flowers" className="mt-4 space-y-2">
                {decorationCatalog.flowers.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 border rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, "flowers", item)}
                    onClick={() => addDecoration("flowers", item)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          ${item.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flower className="w-4 h-4 text-green-500" />
                        <Move3D className="w-3 h-3 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          {/* No decoration selected card hidden per request
          <Card className="p-4">
            <h3 className="font-semibold mb-4">No decoration selected</h3>
            <p className="text-sm text-gray-600">
              Click on any decoration in the hall to edit its properties
            </p>
          </Card>
          */}

          {/* Quick Actions commented out per request
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <PartyPopper className="w-5 h-5" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Add Confetti Effect
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Music className="w-4 h-4 mr-2" />
                Place DJ Booth
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Camera className="w-4 h-4 mr-2" />
                Photo Booth Area
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Gift className="w-4 h-4 mr-2" />
                Gift Table
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Cake className="w-4 h-4 mr-2" />
                Cake Display
              </Button>
            </div>
          </Card>
          */}

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Decorations ({decorations.length})</span>
                <span>${calculateTotalCost()}</span>
              </div>
              <div className="flex justify-between">
                <span>Setup Fee</span>
                <span>$150</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>${calculateTotalCost() + 150}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes gentle-sway {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(2px) rotate(1deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes gentle-wave {
          0%, 100% { transform: translateY(0) skewX(0deg); }
          50% { transform: translateY(-2px) skewX(1deg); }
        }
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 5px currentColor; }
          50% { box-shadow: 0 0 15px currentColor; }
        }
        @keyframes color-cycle {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        .animate-gentle-sway { animation: gentle-sway 3s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-gentle-wave { animation: gentle-wave 4s ease-in-out infinite; }
        .animate-subtle-glow { animation: subtle-glow 3s ease-in-out infinite; }
        .animate-color-cycle { animation: color-cycle 8s linear infinite; }
      `}</style>
    </div>
  );
}
