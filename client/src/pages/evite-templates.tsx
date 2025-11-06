import { useState } from "react";
// import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Eye, Check } from "lucide-react";
import { Palette, Sparkles, Star } from "lucide-react";
import {
  templateCategories as categories,
  templates as rawTemplates,
} from "@/features/vibescard-studio/data/templates";

interface EviteTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  fonts: string;
  layout: "classic" | "modern" | "elegant" | "playful" | "minimalist";
  features: string[];
  preview: React.ComponentType;
  free: boolean;
  previewImg: string;
}
import Pagination from "./Pagination";

// Map project's Template type to the local EviteTemplate shape
const eviteTemplates: EviteTemplate[] = rawTemplates.map((t) => {
  // use explicit palette and preview if provided in the template data; otherwise fall back
  const colors: string[] = (t as any).palette ?? [];
  if (colors.length === 0) {
    // fallback defaults based on category
    if (t.category?.toLowerCase?.().includes("wedding")) {
      colors.push("#F7EB00", "#FFAD34");
    } else if (t.category?.toLowerCase?.().includes("birthday")) {
      colors.push("#ff9a9e", "#fecfef");
    } else {
      colors.push("#667eea", "#764ba2");
    }
  }

  const previewImg =
    (t as any).preview ??
    t.elements?.find((e: any) => e.type === "image" && e.content?.src)?.content
      ?.src ??
    `/templates/${t.id}.png`;

  return {
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.style?.brand ?? t.thumbnail ?? t.name,
    colors,
    fonts: t.style?.fontFamily ?? "",
    layout: "classic",
    features: ["Custom text", "Color adjustments", "Add photos"],
    preview: () => null,
    free: !t.premium,
    previewImg,
  } as EviteTemplate;
});

export default function EviteTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] =
    useState<EviteTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const filteredTemplates =
    selectedCategory === "All"
      ? eviteTemplates
      : eviteTemplates.filter((t) => t.category === selectedCategory);

  const handleTemplateSelect = (template: EviteTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode(true);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      // Navigate to customization with selected template
      window.location.href = `/complete-invite-workflow?template=${selectedTemplate.id}`;
    }
  };

  return (
    <div className="bg-[#0C111F]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">
            Professional Invitation Templates
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto ">
            Choose from our collection of professionally designed,
            Evibes-inspired templates. Each template is fully customizable and
            includes interactive features for your guests.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Template Grid */}
        {!previewMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="relative w-[444px] h-[569px] rounded-lg overflow-hidden shadow-md group"
              >
                {/* Background Preview */}
                <img
                  src={template.previewImg} // ✅ dynamic preview
                  alt={template.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay Bottom Section */}
                <div className="absolute bottom-0 left-1/2 h-[290px] -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-md rounded-lg p-4">
                  {/* Title + Description */}
                  <h3 className="text-white font-bold text-lg">
                    {template.name}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {template.description}
                  </p>

                  {/* Category */}
                  <div className="mt-3 inline-flex border border-gray-300 rounded-full px-3 py-0.5">
                    <span className="text-white text-xs font-semibold">
                      {template.category}
                    </span>
                  </div>

                  {/* Colors */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-300">Colors:</span>
                    <div className="flex gap-2">
                      {template.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <p className="mt-3 text-xs font-medium text-gray-300">
                    Features:
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 mt-1">
                    {template.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-300 text-xs"
                      >
                        <Check className="w-3 h-3 mr-1 text-green-600" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="flex items-center justify-center gap-2 flex-1 h-10 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template);
                        handleUseTemplate();
                      }}
                      className="w-12 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
                    >
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Template Preview Mode */
          selectedTemplate && (
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  ← Back to Templates
                </Button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-white">{selectedTemplate.description}</p>
                </div>
                <Button
                  onClick={handleUseTemplate}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Use This Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Large Preview */}
                <div className="space-y-4">
                  <div className="">
                    {/* <div className="transform scale-150 origin-top">
                                                        <selectedTemplate.previewImg />

                  </div> */}

                    <img
                      src={selectedTemplate.previewImg}
                      className="h-[900px]"
                    />
                  </div>

                  {/* Template Actions */}
                  {/* <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Preview
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Template
                  </Button>
                  <Button variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div> */}
                </div>

                {/* Template Details */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="w-5 h-5" />
                        <span>Template Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Category</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.category}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Layout Style
                        </Label>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedTemplate.layout}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Font Style
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTemplate.fonts}
                        </p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Color Palette
                        </Label>
                        <div className="flex space-x-2 mt-1">
                          {selectedTemplate.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-lg border border-gray-200 shadow-xs"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Included Features</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedTemplate.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5" />
                        <span>Customization Options</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Custom text and messaging</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Color scheme adjustment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Add personal photos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Custom questions for guests</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Music and mood settings</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Interactive elements</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleUseTemplate}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Customize This Template
                    <Sparkles className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Call to Action */}
        {/* {!previewMode && (
        <div className="text-center space-y-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-8 rounded-lg">
          <h3 className="text-xl font-semibold">Need a Custom Design?</h3>
          <p className="text-muted-foreground">
            Our AI-powered design studio can create a unique template just for your event.
          </p>
          <Button asChild variant="outline">
            <Link to="/interactive-design-generator">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Custom Template
            </Link>
          </Button>
        </div>
      )} */}
        <Pagination />
      </div>
    </div>
  );
}
