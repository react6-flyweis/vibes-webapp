import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Smartphone,
  Camera,
  Download,
  Share2,
  Edit3,
  Palette,
  Type,
  Image as ImageIcon,
  Video,
  Play,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Eye,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Users,
  Calendar,
  MapPin,
  Music,
  Star,
  Crown,
  Gift,
  Target,
  Wand2
} from "lucide-react";

interface StoryTemplate {
  id: string;
  name: string;
  platform: string;
  category: string;
  dimensions: string;
  thumbnailUrl: string;
  previewUrl: string;
  elements: TemplateElement[];
  isPopular: boolean;
  usageCount: number;
  tags: string[];
}

interface TemplateElement {
  type: 'text' | 'image' | 'logo' | 'gradient' | 'shape';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: any;
}

interface GeneratedStory {
  id: string;
  templateId: string;
  eventId: string;
  platform: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  createdAt: string;
  scheduledTime?: string;
  status: 'draft' | 'scheduled' | 'published';
}

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  tiktok: Video
};

const templateCategories = [
  { id: 'announcement', name: 'Event Announcements', icon: Calendar },
  { id: 'countdown', name: 'Countdown Posts', icon: Clock },
  { id: 'behind-scenes', name: 'Behind the Scenes', icon: Camera },
  { id: 'live-updates', name: 'Live Updates', icon: Zap },
  { id: 'highlights', name: 'Event Highlights', icon: Star },
  { id: 'testimonials', name: 'Guest Testimonials', icon: Heart },
  { id: 'after-party', name: 'After Party', icon: Sparkles }
];

export default function SocialStoryTemplates() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [selectedCategory, setSelectedCategory] = useState<string>('announcement');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customizationData, setCustomizationData] = useState({
    eventTitle: '',
    eventDate: '',
    eventLocation: '',
    eventDescription: '',
    primaryColor: '#8B5CF6',
    secondaryColor: '#3B82F6',
    logoUrl: '',
    customText: ''
  });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch story templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['/api/story-templates', selectedPlatform, selectedCategory],
    retry: false,
  });

  // Fetch user's generated stories
  const { data: generatedStories } = useQuery({
    queryKey: ['/api/story-templates/generated'],
    retry: false,
  });

  // Fetch template analytics
  const { data: analytics } = useQuery({
    queryKey: ['/api/story-templates/analytics'],
    retry: false,
  });

  // Generate story mutation
  const generateStoryMutation = useMutation({
    mutationFn: async (data: { templateId: string; customization: any; eventId?: string }) => {
      return await apiRequest("POST", "/api/story-templates/generate", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Story Generated",
        description: "Your custom story template has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/story-templates/generated'] });
      setShowPreview(true);
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate story template. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Schedule story mutation
  const scheduleStoryMutation = useMutation({
    mutationFn: async (data: { storyId: string; platform: string; scheduledTime: string }) => {
      return await apiRequest("POST", "/api/story-templates/schedule", data);
    },
    onSuccess: () => {
      toast({
        title: "Story Scheduled",
        description: "Your story has been scheduled for publication!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/story-templates/generated'] });
    },
  });

  const handleGenerateStory = () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template to customize.",
        variant: "destructive",
      });
      return;
    }

    generateStoryMutation.mutate({
      templateId: selectedTemplate,
      customization: customizationData,
      eventId: "1" // Default event ID
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
              <Camera className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
              <Share2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Social Story Templates
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Create stunning social media stories for your events with professional templates and automated sharing
          </p>
          
          {/* Analytics Stats */}
          {analytics && (
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{(analytics as any).totalTemplates}</div>
                <div className="text-gray-600 dark:text-gray-400">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{(analytics as any).storiesGenerated}</div>
                <div className="text-gray-600 dark:text-gray-400">Stories Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">{(analytics as any).engagement}</div>
                <div className="text-gray-600 dark:text-gray-400">Avg Engagement</div>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="create" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3 mx-auto">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Create Stories
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              My Stories
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Stories Tab */}
          <TabsContent value="create" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Template Selection */}
              <div className="lg:col-span-2 space-y-6">
                {/* Platform & Category Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Platform & Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platform">Platform</Label>
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">
                              <div className="flex items-center gap-2">
                                <Instagram className="w-4 h-4" />
                                Instagram Stories
                              </div>
                            </SelectItem>
                            <SelectItem value="facebook">
                              <div className="flex items-center gap-2">
                                <Facebook className="w-4 h-4" />
                                Facebook Stories
                              </div>
                            </SelectItem>
                            <SelectItem value="twitter">
                              <div className="flex items-center gap-2">
                                <Twitter className="w-4 h-4" />
                                Twitter/X
                              </div>
                            </SelectItem>
                            <SelectItem value="tiktok">
                              <div className="flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                TikTok
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {templateCategories.map((category) => {
                              const IconComponent = category.icon;
                              return (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    {category.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Template Grid */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Choose Template
                    </CardTitle>
                    <CardDescription>
                      Select from our collection of professional templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {templates && Array.isArray(templates) && templates.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(templates as any[]).map((template) => (
                          <div
                            key={template.id}
                            className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                              selectedTemplate === template.id
                                ? 'border-purple-500 ring-2 ring-purple-200'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                              <div className="text-center p-4">
                                <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm font-medium">{template.name}</p>
                                <p className="text-xs text-gray-500">{template.dimensions}</p>
                              </div>
                            </div>
                            {template.isPopular && (
                              <Badge className="absolute top-2 left-2 bg-orange-500">Popular</Badge>
                            )}
                            <div className="absolute bottom-2 right-2">
                              <Badge variant="secondary" className="text-xs">
                                {template.usageCount} uses
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Smartphone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No templates available for this selection</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Customization Panel */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5" />
                      Customize Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="eventTitle">Event Title</Label>
                      <Input
                        id="eventTitle"
                        value={customizationData.eventTitle}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, eventTitle: e.target.value }))}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={customizationData.eventDate}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, eventDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input
                        id="eventLocation"
                        value={customizationData.eventLocation}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, eventLocation: e.target.value }))}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDescription">Description</Label>
                      <Textarea
                        id="eventDescription"
                        value={customizationData.eventDescription}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, eventDescription: e.target.value }))}
                        placeholder="Brief event description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Input
                          id="primaryColor"
                          type="color"
                          value={customizationData.primaryColor}
                          onChange={(e) => setCustomizationData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={customizationData.secondaryColor}
                          onChange={(e) => setCustomizationData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={customizationData.logoUrl}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customText">Custom Text</Label>
                      <Textarea
                        id="customText"
                        value={customizationData.customText}
                        onChange={(e) => setCustomizationData(prev => ({ ...prev, customText: e.target.value }))}
                        placeholder="Additional text or call-to-action"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleGenerateStory}
                  disabled={!selectedTemplate || generateStoryMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {generateStoryMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Story
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* My Stories Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Your Generated Stories
                </CardTitle>
                <CardDescription>
                  Manage and schedule your created social media stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedStories && Array.isArray(generatedStories) && generatedStories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(generatedStories as any[]).map((story) => (
                      <Card key={story.id} className="overflow-hidden">
                        <div className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                          <div className="text-center p-4">
                            <Smartphone className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm font-medium">Story Preview</p>
                            <p className="text-xs text-gray-500">{story.platform}</p>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant={story.status === 'published' ? 'default' : story.status === 'scheduled' ? 'secondary' : 'outline'}>
                                {story.status}
                              </Badge>
                              {platformIcons[story.platform as keyof typeof platformIcons] && (
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    const IconComponent = platformIcons[story.platform as keyof typeof platformIcons];
                                    return <IconComponent className="w-4 h-4" />;
                                  })()}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {story.caption}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Share2 className="w-3 h-3 mr-1" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">No Stories Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first social media story to get started</p>
                    <Button onClick={() => {
                      const createTab = document.querySelector('[value="create"]') as HTMLElement;
                      if (createTab) createTab.click();
                    }}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create Story
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Stories</p>
                      <p className="text-3xl font-bold text-purple-600">{(analytics as any)?.totalStories || '42'}</p>
                    </div>
                    <ImageIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Views</p>
                      <p className="text-3xl font-bold text-blue-600">{(analytics as any)?.averageViews || '2.4K'}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% engagement
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Platform</p>
                      <p className="text-3xl font-bold text-pink-600">IG</p>
                    </div>
                    <Instagram className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-600">
                    <span>68% of total stories</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
                      <p className="text-3xl font-bold text-green-600">{(analytics as any)?.engagementRate || '4.2%'}</p>
                    </div>
                    <Heart className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-4 flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Above average
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Best Performing Templates</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Modern Event Announcement', platform: 'Instagram', engagement: '6.8%' },
                        { name: 'Countdown Timer', platform: 'Instagram', engagement: '5.4%' },
                        { name: 'Behind the Scenes', platform: 'TikTok', engagement: '4.9%' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.platform}</p>
                          </div>
                          <Badge variant="secondary">{item.engagement}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Optimal Posting Times</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { platform: 'Instagram', time: '6-9 PM' },
                        { platform: 'Facebook', time: '1-3 PM' },
                        { platform: 'Twitter', time: '9-10 AM' },
                        { platform: 'TikTok', time: '6-10 PM' }
                      ].map((item, index) => (
                        <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="font-medium">{item.platform}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}