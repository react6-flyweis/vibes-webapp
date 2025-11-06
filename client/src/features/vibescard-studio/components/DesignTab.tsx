import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Type,
  Image,
  Layers,
  PaintBucket,
  Upload,
  Crop,
  Sparkles,
  Music,
  Video,
  QrCode,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Template, DesignElement, ColorScheme } from "../types";
import { templates, templateCategories } from "../data/templates";

interface DesignTabProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTemplate: string | null;
  onApplyTemplate: (template: Template) => void;
  onAddElement: (type: DesignElement["type"]) => void;
  colorScheme: ColorScheme;
}

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
  // { type: "border", icon: Crop, name: "Borders", description: "Ornate frames" },
  // {
  //   type: "animation",
  //   icon: Sparkles,
  //   name: "Animation",
  //   description: "Motion effects",
  // },
  // {
  //   type: "music",
  //   icon: Music,
  //   name: "Music",
  //   description: "Background audio",
  // },
  // {
  //   type: "video",
  //   icon: Video,
  //   name: "Video",
  //   description: "Video backgrounds",
  // },
  // {
  //   type: "qr",
  //   icon: QrCode,
  //   name: "QR Code",
  //   description: "Quick response codes",
  // },
  // {
  //   type: "calendar",
  //   icon: Calendar,
  //   name: "Calendar",
  //   description: "Date integration",
  // },
  // {
  //   type: "rsvp",
  //   icon: MessageSquare,
  //   name: "RSVP",
  //   description: "Response buttons",
  // },
];

export function DesignTab({
  selectedCategory,
  setSelectedCategory,
  selectedTemplate,
  onApplyTemplate,
  onAddElement,
  colorScheme,
}: DesignTabProps) {
  const [templateSearch, setTemplateSearch] = useState("");

  // Local blank template for VibesCard Studio only
  const blankTemplate: Template = {
    id: "blank-local",
    name: "Blank",
    category: "All",
    thumbnail: "⬜",
    premium: false,
    palette: ["#ffffff"],
    preview: "",
    elements: [],
    style: { background: "#ffffff", canvasSize: { width: 800, height: 1027 } },
  };

  const filteredTemplates = templates.filter(
    (template) =>
      (selectedCategory === "All" || template.category === selectedCategory) &&
      (templateSearch === "" ||
        template.name.toLowerCase().includes(templateSearch.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      {/* Templates Section */}
      <Card className="bg-[#0A0A0A] ">
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
              <SelectTrigger className="text-xs ">
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
              className="text-xs bg-white/20"
            />
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {/* Blank option shown only in VibesCard Studio */}
            <div
              key={blankTemplate.id}
              className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all transform hover:scale-105 w-full
                ${
                  selectedTemplate === blankTemplate.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                }`}
              onClick={() => onApplyTemplate(blankTemplate)}
            >
              <div className="text-2xl mb-2 text-center">
                {blankTemplate.thumbnail}
              </div>
              <div className="text-xs font-medium text-center">
                {blankTemplate.name}
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {blankTemplate.category}
              </div>
            </div>

            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all transform hover:scale-105 w-full
                  ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-gray-900"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                  }`}
                onClick={() => onApplyTemplate(template)}
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
            {filteredTemplates.length} templates available
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
                  onAddElement(element.type as DesignElement["type"])
                }
              >
                <element.icon className="w-5 h-5" />
                <div className="text-xs text-center flex flex-col gap-1">
                  <div className="font-medium break-words line-clamp-2 text-center">
                    {element.name}
                  </div>
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
    </div>
  );
}
