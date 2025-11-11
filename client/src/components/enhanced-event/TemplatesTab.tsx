import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Eye, Sparkles } from "lucide-react";
import {
  templates,
  templateCategories,
} from "@/features/vibescard-studio/data/templates";
import { Template } from "@/features/vibescard-studio/types";

interface TemplatesTabProps {
  onTemplateSelect?: (template: Template) => void;
  selectedTemplateId?: string;
}

export default function TemplatesTab({
  onTemplateSelect,
  selectedTemplateId,
}: TemplatesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    selectedTemplateId || null
  );
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Filter templates based on category and search
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "All" || template.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template.id);
    onTemplateSelect?.(template);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="bg-[#1a1f2e] border-gray-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-[#24292D] border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {templateCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#24292D] border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredTemplates.length} of {templates.length} templates
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`bg-[#1a1f2e] border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
              selectedTemplate === template.id
                ? "border-blue-500 ring-2 ring-blue-400/50"
                : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Template Preview */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-10">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Template Thumbnail (use preview image when available) */}
                {template.preview ? (
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-6xl">{template.thumbnail}</div>
                )}

                {/* Premium Badge */}
                {template.premium && (
                  <Badge className="absolute bottom-2 left-2 bg-yellow-500 text-black text-xs">
                    Premium
                  </Badge>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-sm line-clamp-1">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-400">{template.category}</p>

                {/* Color Palette Preview */}
                {template.palette && template.palette.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {template.palette.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border border-gray-600"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs border-gray-600 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  className={`flex-1 text-xs ${
                    selectedTemplate === template.id
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateClick(template);
                  }}
                >
                  {selectedTemplate === template.id ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <Card className="bg-[#1a1f2e] border-gray-700">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400 text-lg">No templates found</p>
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div
            className="bg-[#1a1f2e] border-2 border-gray-700 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview Header */}
            <div className="bg-[#24292D] border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{previewTemplate.thumbnail}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {previewTemplate.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {previewTemplate.category}
                    </Badge>
                    {previewTemplate.premium && (
                      <Badge className="bg-yellow-500 text-black text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePreview}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Template Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Template Preview
                  </h3>
                  <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border-2 border-gray-700">
                    <div className="text-9xl opacity-80">
                      {previewTemplate.thumbnail}
                    </div>
                    {previewTemplate.preview && (
                      <img
                        src={previewTemplate.preview}
                        alt={previewTemplate.name}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* Template Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <Sparkles className="h-5 w-5" />
                      Template Details
                    </h3>

                    {/* Color Palette */}
                    {previewTemplate.palette &&
                      previewTemplate.palette.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">
                            Color Palette
                          </label>
                          <div className="flex gap-2">
                            {previewTemplate.palette.map((color, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center gap-1"
                              >
                                <div
                                  className="w-12 h-12 rounded-lg border-2 border-gray-600 shadow-lg"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-xs text-gray-400 font-mono">
                                  {color}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Elements Count */}
                    <div className="mt-4 space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Template Elements
                      </label>
                      <div className="bg-[#24292D] rounded-lg p-3 border border-gray-700">
                        <div className="text-sm text-gray-400">
                          {previewTemplate.elements.length} design elements
                          included
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {previewTemplate.elements
                            .map((el) => el.type)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .join(", ")}
                        </div>
                      </div>
                    </div>

                    {/* Background Style */}
                    {previewTemplate.style?.background && (
                      <div className="mt-4 space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                          Background Style
                        </label>
                        <div
                          className="h-16 rounded-lg border-2 border-gray-600"
                          style={{
                            background: previewTemplate.style.background,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        handleTemplateClick(previewTemplate);
                        closePreview();
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Select This Template
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 hover:bg-gray-700"
                      onClick={closePreview}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
