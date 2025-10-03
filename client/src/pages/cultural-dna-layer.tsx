import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Heart,
  Music,
  Utensils,
  Palette,
  Users,
  BookOpen,
  Languages,
  MapPin,
  Calendar,
  Star,
  Play,
  Volume2,
  Camera,
  Share2,
  Award,
  Sparkles,
  Crown,
  Coffee,
  Shirt,
  Image,
  MessageCircle,
  Info,
  Plus,
  X,
  CheckCircle,
  Clock,
  Eye,
  ThumbsUp,
  Download,
  Search
} from "lucide-react";

// Cultural DNA Types
interface CulturalVibeTag {
  id: string;
  name: string;
  category: "music" | "cuisine" | "fashion" | "tradition" | "dance" | "art";
  origin: {
    country: string;
    region: string;
    flag: string;
  };
  description: string;
  elements: {
    colors: string[];
    patterns: string[];
    instruments?: string[];
    spices?: string[];
    textiles?: string[];
    symbols?: string[];
  };
  culturalContext: {
    history: string;
    significance: string;
    modernInfluence: string;
    celebrations: string[];
  };
  mediaAssets: {
    playlist?: string;
    recipeCollection?: string;
    fashionGallery?: string;
    danceInstructions?: string;
  };
  popularity: number;
  isAuthentic: boolean;
  verifiedBy?: string;
}

interface CulturalStorytellingLayer {
  id: string;
  eventId: string;
  culturalTheme: string;
  vibeTagsSelected: string[];
  storytellingElements: {
    welcomeMessage: {
      [language: string]: string;
    };
    culturalBackground: {
      [language: string]: string;
    };
    traditionalElements: {
      food: Array<{
        name: string;
        origin: string;
        significance: string;
        recipe?: string;
        translation: { [language: string]: string };
      }>;
      music: Array<{
        genre: string;
        instruments: string[];
        culturalRole: string;
        sampleTrack?: string;
        translation: { [language: string]: string };
      }>;
      fashion: Array<{
        garment: string;
        materials: string[];
        occasion: string;
        symbolism: string;
        translation: { [language: string]: string };
      }>;
    };
  };
  multiLanguageSupport: {
    primaryLanguage: string;
    supportedLanguages: string[];
    autoTranslate: boolean;
    culturalNuances: {
      [language: string]: {
        greetings: string[];
        traditions: string[];
        etiquette: string[];
      };
    };
  };
  interactiveElements: {
    culturalQuiz: boolean;
    traditionalGames: boolean;
    storytimeSegments: boolean;
    photoWithTraditionalElements: boolean;
  };
  communityContributions: Array<{
    contributorId: string;
    contributorName: string;
    contributorOrigin: string;
    contributionType: "story" | "recipe" | "music" | "tradition" | "translation";
    content: string;
    verified: boolean;
    likes: number;
  }>;
  engagement: {
    views: number;
    interactions: number;
    culturalBadgesEarned: number;
    communityFeedback: number;
  };
}

interface CulturalEducationModule {
  id: string;
  title: string;
  culture: string;
  type: "food" | "music" | "fashion" | "tradition" | "language" | "art";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  content: {
    introduction: string;
    keyElements: Array<{
      name: string;
      description: string;
      visualAid: string;
      audioSample?: string;
    }>;
    practicalTips: string[];
    respectfulParticipation: string[];
    commonMistakes: string[];
  };
  interactiveActivities: Array<{
    type: "quiz" | "audio-match" | "visual-identify" | "pronunciation";
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  completionRewards: {
    badge: string;
    points: number;
    unlocks: string[];
  };
}

export default function CulturalDNALayer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("discover");
  const [selectedCulture, setSelectedCulture] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [culturalStoryMode, setCulturalStoryMode] = useState(false);
  const [activeEducationModule, setActiveEducationModule] = useState<string | null>(null);

  // Data fetching
  const { data: culturalVibeTagsData = [] } = useQuery({
    queryKey: ["/api/cultural/vibe-tags"],
  });

  const { data: storytellingLayersData = [] } = useQuery({
    queryKey: ["/api/cultural/storytelling-layers"],
  });

  const { data: educationModulesData = [] } = useQuery({
    queryKey: ["/api/cultural/education-modules"],
  });

  const { data: communityContributionsData = [] } = useQuery({
    queryKey: ["/api/cultural/community-contributions"],
  });

  const { data: languageSupport = [] } = useQuery({
    queryKey: ["/api/cultural/language-support"],
  });

  // Mutations
  const addVibeTagMutation = useMutation({
    mutationFn: (tagData: Partial<CulturalVibeTag>) =>
      apiRequest("POST", "/api/cultural/vibe-tags", tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cultural/vibe-tags"] });
      toast({
        title: "Cultural Vibe Tag Added",
        description: "Your cultural element has been added to the community collection.",
      });
    },
  });

  const createStorytellingLayerMutation = useMutation({
    mutationFn: (layerData: Partial<CulturalStorytellingLayer>) =>
      apiRequest("POST", "/api/cultural/storytelling-layers", layerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cultural/storytelling-layers"] });
      toast({
        title: "Cultural Story Created",
        description: "Your cultural storytelling layer has been saved.",
      });
    },
  });

  const contributeContentMutation = useMutation({
    mutationFn: (contribution: any) =>
      apiRequest("POST", "/api/cultural/contribute", contribution),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cultural/community-contributions"] });
      toast({
        title: "Contribution Shared",
        description: "Thank you for sharing your cultural knowledge!",
      });
    },
  });

  const translateContentMutation = useMutation({
    mutationFn: (data: { content: string; targetLanguage: string }) =>
      apiRequest("POST", "/api/cultural/translate", data),
    onSuccess: (data) => {
      toast({
        title: "Translation Complete",
        description: `Content has been translated to ${data.language}.`,
      });
    },
  });

  // Sample data (fallback)
  const culturalVibeTags: CulturalVibeTag[] = culturalVibeTagsData.length > 0 ? culturalVibeTagsData : [
    {
      id: "afrobeats-lagos",
      name: "Afrobeats Lagos Vibe",
      category: "music",
      origin: {
        country: "Nigeria",
        region: "Lagos",
        flag: "🇳🇬"
      },
      description: "High-energy contemporary African music blending traditional Yoruba elements with modern pop, hip-hop, and dancehall.",
      elements: {
        colors: ["#008751", "#FFFFFF", "#008751"],
        patterns: ["Ankara prints", "Adire tie-dye", "Geometric patterns"],
        instruments: ["Talking drums", "Shekere", "Saxophone", "Synthesizers"],
        symbols: ["Gele headwrap", "Dashiki patterns", "Palm trees"]
      },
      culturalContext: {
        history: "Afrobeats emerged in Lagos in the 2000s, blending traditional Yoruba music with global influences.",
        significance: "Represents modern African identity and diaspora connection.",
        modernInfluence: "Global mainstream adoption by artists like Burna Boy, Wizkid, and Davido.",
        celebrations: ["Lagos Carnival", "Afro Nation", "Detty December"]
      },
      mediaAssets: {
        playlist: "spotify:playlist:afrobeats-lagos-hits",
        fashionGallery: "/cultural/afrobeats/fashion",
        danceInstructions: "/cultural/afrobeats/dance-moves"
      },
      popularity: 89,
      isAuthentic: true,
      verifiedBy: "Nigerian Cultural Council"
    },
    {
      id: "bollywood-glam",
      name: "Bollywood Glam",
      category: "fashion",
      origin: {
        country: "India",
        region: "Mumbai",
        flag: "🇮🇳"
      },
      description: "Glamorous fusion of traditional Indian aesthetics with contemporary Bollywood cinema style.",
      elements: {
        colors: ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5", "#8A2BE2"],
        patterns: ["Paisley", "Mandala", "Floral motifs", "Mirror work"],
        textiles: ["Silk", "Chiffon", "Georgette", "Brocade"],
        symbols: ["Lotus", "Peacock", "Henna patterns", "Maang tikka"]
      },
      culturalContext: {
        history: "Bollywood fashion evolved from classical Indian cinema, blending tradition with glamour.",
        significance: "Represents celebration, joy, and the beauty of Indian aesthetics.",
        modernInfluence: "Global red carpet adoption and fusion fashion trends.",
        celebrations: ["Diwali", "Bollywood Award Shows", "Indian Weddings"]
      },
      mediaAssets: {
        playlist: "spotify:playlist:bollywood-classics",
        fashionGallery: "/cultural/bollywood/outfits",
        recipeCollection: "/cultural/bollywood/party-snacks"
      },
      popularity: 92,
      isAuthentic: true,
      verifiedBy: "Indian Film Heritage Foundation"
    },
    {
      id: "latin-carnaval",
      name: "Latin Carnaval",
      category: "tradition",
      origin: {
        country: "Brazil",
        region: "Rio de Janeiro",
        flag: "🇧🇷"
      },
      description: "Vibrant celebration combining African, Indigenous, and Portuguese influences in explosive festival culture.",
      elements: {
        colors: ["#FFFF00", "#00FF00", "#0000FF", "#FF4500", "#FF1493"],
        patterns: ["Feather designs", "Sequin arrangements", "Tropical motifs"],
        instruments: ["Samba drums", "Cuica", "Agogo", "Tamborim"]
      },
      culturalContext: {
        history: "Rio Carnival tradition dating back to 1723, blending European, African, and Indigenous cultures.",
        significance: "Celebrates unity, diversity, and the joy of life.",
        modernInfluence: "Inspiration for global music festivals and celebration culture.",
        celebrations: ["Rio Carnival", "Salvador Carnival", "Street parties (Blocos)"]
      },
      mediaAssets: {
        playlist: "spotify:playlist:carnaval-samba-hits",
        danceInstructions: "/cultural/carnaval/samba-steps",
        recipeCollection: "/cultural/carnaval/brazilian-party-food"
      },
      popularity: 87,
      isAuthentic: true,
      verifiedBy: "Brazilian Cultural Ministry"
    }
  ];

  const educationModules: CulturalEducationModule[] = educationModulesData.length > 0 ? educationModulesData : [
    {
      id: "japanese-tea-ceremony",
      title: "Japanese Tea Ceremony Etiquette",
      culture: "Japanese",
      type: "tradition",
      difficulty: "intermediate",
      duration: 15,
      content: {
        introduction: "Learn the respectful way to participate in or host elements inspired by the Japanese tea ceremony.",
        keyElements: [
          {
            name: "Bowing (Ojigi)",
            description: "Proper bowing technique shows respect",
            visualAid: "/cultural/japanese/bowing-guide.jpg"
          },
          {
            name: "Tea Presentation",
            description: "How to present and receive tea mindfully",
            visualAid: "/cultural/japanese/tea-presentation.jpg"
          }
        ],
        practicalTips: [
          "Remove shoes when entering tea space",
          "Sit in seiza position (kneeling)",
          "Express gratitude: 'Arigatou gozaimasu'"
        ],
        respectfulParticipation: [
          "Ask permission before taking photos",
          "Observe before participating",
          "Show appreciation for the cultural significance"
        ],
        commonMistakes: [
          "Rushing through the ceremony",
          "Not acknowledging the host properly",
          "Using incorrect hand positions"
        ]
      },
      interactiveActivities: [
        {
          type: "quiz",
          question: "What should you say to show gratitude in Japanese?",
          options: ["Konnichiwa", "Arigatou gozaimasu", "Sayonara", "Sumimasen"],
          correctAnswer: "Arigatou gozaimasu",
          explanation: "Arigatou gozaimasu is the formal way to express deep gratitude."
        }
      ],
      completionRewards: {
        badge: "Tea Ceremony Appreciation",
        points: 150,
        unlocks: ["Advanced Japanese Traditions", "Asian Cultural Collection"]
      }
    }
  ];

  const handleAddCulturalElement = (elementData: any) => {
    addVibeTagMutation.mutate(elementData);
  };

  const handleCreateStorytellingLayer = (layerData: any) => {
    createStorytellingLayerMutation.mutate(layerData);
  };

  const handleTranslateContent = (content: string, targetLanguage: string) => {
    translateContentMutation.mutate({ content, targetLanguage });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-linear-to-br from-orange-500 to-pink-500 rounded-lg">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Cultural DNA Layer (EthnoVibes)
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Celebrate and learn about diverse cultures through immersive event experiences
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <Label htmlFor="language-select">Event Language:</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="fr">🇫🇷 Français</SelectItem>
              <SelectItem value="pt">🇧🇷 Português</SelectItem>
              <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
              <SelectItem value="ja">🇯🇵 日本語</SelectItem>
              <SelectItem value="ar">🇸🇦 العربية</SelectItem>
              <SelectItem value="zh">🇨🇳 中文</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch 
              checked={culturalStoryMode} 
              onCheckedChange={setCulturalStoryMode}
            />
            <Label>Cultural Storytelling Mode</Label>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="discover">Discover Cultures</TabsTrigger>
          <TabsTrigger value="vibe-tags">Vibe Tags</TabsTrigger>
          <TabsTrigger value="storytelling">Storytelling</TabsTrigger>
          <TabsTrigger value="education">Cultural Education</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Discover Cultures Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {culturalVibeTags.map((tag) => (
              <Card key={tag.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tag.origin.flag}</span>
                      <div>
                        <CardTitle className="text-lg">{tag.name}</CardTitle>
                        <CardDescription>{tag.origin.country}, {tag.origin.region}</CardDescription>
                      </div>
                    </div>
                    {tag.isAuthentic && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{tag.description}</p>
                  
                  {/* Cultural Elements */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Cultural Elements:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tag.elements.colors.slice(0, 4).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {tag.elements.instruments && (
                      <div className="flex flex-wrap gap-1">
                        {tag.elements.instruments.slice(0, 3).map((instrument, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Cultural Context */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Cultural Significance:</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {tag.culturalContext.significance}
                    </p>
                  </div>

                  {/* Popularity & Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tag.popularity}%</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedCulture(tag.id)}
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Learn
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAddCulturalElement({ baseTag: tag.id })}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vibe Tags Tab */}
        <TabsContent value="vibe-tags" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Create Cultural Vibe Tags
              </CardTitle>
              <CardDescription>
                Add authentic cultural elements to enhance your event's storytelling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tag Creation Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tag-name">Cultural Element Name</Label>
                    <Input id="tag-name" placeholder="e.g., Afrobeats Lagos Vibe" />
                  </div>
                  <div>
                    <Label htmlFor="tag-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">🎵 Music</SelectItem>
                        <SelectItem value="cuisine">🍽️ Cuisine</SelectItem>
                        <SelectItem value="fashion">👗 Fashion</SelectItem>
                        <SelectItem value="tradition">🎭 Tradition</SelectItem>
                        <SelectItem value="dance">💃 Dance</SelectItem>
                        <SelectItem value="art">🎨 Art</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tag-origin">Cultural Origin</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Country" className="flex-1" />
                      <Input placeholder="Region/City" className="flex-1" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tag-description">Cultural Description</Label>
                    <Textarea 
                      id="tag-description"
                      placeholder="Describe the cultural significance and characteristics..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag-elements">Key Elements</Label>
                    <Input 
                      placeholder="Colors, instruments, patterns (comma-separated)"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => handleAddCulturalElement({})}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Cultural Vibe Tag
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Tags Display */}
          <Card>
            <CardHeader>
              <CardTitle>Your Cultural Vibe Tags</CardTitle>
              <CardDescription>Manage and customize your cultural elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {culturalVibeTags.slice(0, 6).map((tag) => (
                  <div key={tag.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{tag.name}</span>
                      <span className="text-lg">{tag.origin.flag}</span>
                    </div>
                    <Badge variant="outline" className="mb-2">
                      {tag.category}
                    </Badge>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {tag.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {tag.elements.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <Button size="sm" variant="ghost">
                        <Star className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storytelling Tab */}
        <TabsContent value="storytelling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cultural Background Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Cultural Story Builder
                </CardTitle>
                <CardDescription>
                  Create immersive cultural backgrounds for your guests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="story-theme">Cultural Theme</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a cultural theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afrobeats">🇳🇬 Afrobeats Celebration</SelectItem>
                      <SelectItem value="bollywood">🇮🇳 Bollywood Glam</SelectItem>
                      <SelectItem value="carnaval">🇧🇷 Latin Carnaval</SelectItem>
                      <SelectItem value="japanese">🇯🇵 Japanese Harmony</SelectItem>
                      <SelectItem value="arabic">🇸🇦 Arabian Nights</SelectItem>
                      <SelectItem value="custom">🌍 Custom Cultural Mix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea 
                    id="welcome-message"
                    placeholder="Craft a warm cultural welcome for your guests..."
                    rows={3}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTranslateContent("Welcome message", selectedLanguage)}
                    >
                      <Languages className="h-3 w-3 mr-1" />
                      Auto-translate
                    </Button>
                    <span className="text-xs text-gray-500">to {selectedLanguage}</span>
                  </div>
                </div>

                <div>
                  <Label>Traditional Elements to Highlight</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="food-stories" />
                      <Label htmlFor="food-stories" className="text-sm">Food Stories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="music-stories" />
                      <Label htmlFor="music-stories" className="text-sm">Music History</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="fashion-stories" />
                      <Label htmlFor="fashion-stories" className="text-sm">Fashion Tales</Label>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleCreateStorytellingLayer({})}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Cultural Story Layer
                </Button>
              </CardContent>
            </Card>

            {/* Multi-Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Multi-Language Community
                </CardTitle>
                <CardDescription>
                  Connect diverse communities through language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Supported Languages</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "es", name: "Español", flag: "🇪🇸" },
                      { code: "fr", name: "Français", flag: "🇫🇷" },
                      { code: "pt", name: "Português", flag: "🇧🇷" },
                      { code: "hi", name: "हिंदी", flag: "🇮🇳" },
                      { code: "ar", name: "العربية", flag: "🇸🇦" }
                    ].map((lang) => (
                      <div key={lang.code} className="flex items-center space-x-2">
                        <Switch 
                          id={lang.code}
                          checked={lang.code === selectedLanguage}
                        />
                        <Label htmlFor={lang.code} className="text-sm flex items-center gap-1">
                          <span>{lang.flag}</span>
                          {lang.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Translation Features</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Real-time Chat Translation</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Audio Pronunciation Guide</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Cultural Context Notes</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Language Pack
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cultural Elements Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Cultural Elements Preview</CardTitle>
              <CardDescription>
                Preview how cultural elements will appear to your guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="food" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="food">🍽️ Traditional Food</TabsTrigger>
                  <TabsTrigger value="music">🎵 Cultural Music</TabsTrigger>
                  <TabsTrigger value="fashion">👗 Traditional Fashion</TabsTrigger>
                </TabsList>
                
                <TabsContent value="food" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        name: "Jollof Rice",
                        origin: "West Africa",
                        significance: "Unity dish shared across cultures",
                        image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400"
                      },
                      {
                        name: "Biryani",
                        origin: "Indian Subcontinent", 
                        significance: "Royal feast representing hospitality",
                        image: "https://images.unsplash.com/photo-1563379091339-03246963d117?w=400"
                      },
                      {
                        name: "Feijoada",
                        origin: "Brazil",
                        significance: "National dish bringing communities together",
                        image: "https://images.unsplash.com/photo-1544025162-0c4b4e41c058?w=400"
                      }
                    ].map((dish, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <img 
                          src={dish.image} 
                          alt={dish.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h4 className="font-medium">{dish.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{dish.origin}</p>
                          <p className="text-xs">{dish.significance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="music">
                  <div className="space-y-4">
                    {[
                      { genre: "Afrobeats", description: "High-energy rhythms from West Africa", sample: "🎵" },
                      { genre: "Bollywood", description: "Cinematic melodies from Indian films", sample: "🎵" },
                      { genre: "Samba", description: "Carnival rhythms from Brazil", sample: "🎵" }
                    ].map((music, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{music.genre}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{music.description}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="fashion">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { item: "Ankara Dress", culture: "African" },
                      { item: "Saree", culture: "Indian" },
                      { item: "Kimono", culture: "Japanese" },
                      { item: "Kaftan", culture: "Arabic" }
                    ].map((fashion, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-2 bg-linear-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <Shirt className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-medium text-sm">{fashion.item}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{fashion.culture}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {educationModules.map((module) => (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="outline">{module.difficulty}</Badge>
                  </div>
                  <CardDescription>{module.culture} • {module.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {module.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      {module.completionRewards.points} pts
                    </div>
                  </div>
                  
                  <p className="text-sm">{module.content.introduction}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Elements:</h4>
                    <ul className="text-xs space-y-1">
                      {module.content.keyElements.slice(0, 2).map((element, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{element.name}: {element.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => setActiveEducationModule(module.id)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cultural Quiz Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Cultural Knowledge Quiz
              </CardTitle>
              <CardDescription>
                Test your understanding and earn cultural appreciation badges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Cultural Challenge</h4>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm mb-3">
                      In Japanese culture, what should you do before entering a traditional tea ceremony space?
                    </p>
                    <div className="space-y-2">
                      {[
                        "Bow to the host",
                        "Remove your shoes", 
                        "Wash your hands",
                        "All of the above"
                      ].map((option, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          className="w-full text-left justify-start text-sm"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Your Cultural Badges</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "African Music Explorer", earned: true },
                      { name: "Asian Traditions Scholar", earned: true },
                      { name: "Latin Culture Ambassador", earned: false },
                      { name: "Global Cuisine Expert", earned: false }
                    ].map((badge, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-center text-xs ${
                          badge.earned 
                            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' 
                            : 'bg-gray-50 border border-gray-200 text-gray-500'
                        }`}
                      >
                        <div className="text-lg mb-1">
                          {badge.earned ? '🏆' : '🔒'}
                        </div>
                        {badge.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contribute Cultural Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Share Your Cultural Heritage
                </CardTitle>
                <CardDescription>
                  Help others learn about your culture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contribution-type">Contribution Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="What would you like to share?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="story">📖 Cultural Story</SelectItem>
                      <SelectItem value="recipe">🍽️ Traditional Recipe</SelectItem>
                      <SelectItem value="music">🎵 Music Tradition</SelectItem>
                      <SelectItem value="translation">🌐 Translation Help</SelectItem>
                      <SelectItem value="tradition">🎭 Cultural Tradition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contribution-content">Share Your Knowledge</Label>
                  <Textarea 
                    id="contribution-content"
                    placeholder="Tell us about your cultural tradition, recipe, or story..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cultural-origin">Your Cultural Background</Label>
                  <Input placeholder="e.g., Nigerian Yoruba, Japanese from Tokyo" />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => contributeContentMutation.mutate({})}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Share with Community
                </Button>
              </CardContent>
            </Card>

            {/* Community Contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Community Contributions
                </CardTitle>
                <CardDescription>
                  Learn from cultural ambassadors worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {[
                      {
                        id: "1",
                        contributor: "Amara from Lagos",
                        type: "Traditional Recipe",
                        content: "My grandmother's Jollof rice recipe has been passed down for three generations...",
                        likes: 45,
                        verified: true,
                        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150"
                      },
                      {
                        id: "2", 
                        contributor: "Hiroshi from Kyoto",
                        type: "Cultural Story",
                        content: "The meaning behind the cherry blossom festival and why we celebrate hanami...",
                        likes: 32,
                        verified: true,
                        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                      },
                      {
                        id: "3",
                        contributor: "Maria from São Paulo", 
                        type: "Dance Tradition",
                        content: "Samba isn't just a dance - it's the heartbeat of Brazilian carnival culture...",
                        likes: 28,
                        verified: false,
                        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
                      }
                    ].map((contribution) => (
                      <div key={contribution.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contribution.avatar} />
                            <AvatarFallback>{contribution.contributor.split(' ')[0][0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{contribution.contributor}</span>
                              {contribution.verified && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs mb-2">
                              {contribution.type}
                            </Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                              {contribution.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="flex items-center gap-1 hover:text-red-500">
                                <Heart className="h-3 w-3" />
                                {contribution.likes}
                              </button>
                              <button className="flex items-center gap-1 hover:text-blue-500">
                                <Share2 className="h-3 w-3" />
                                Share
                              </button>
                              <button className="flex items-center gap-1 hover:text-green-500">
                                <Languages className="h-3 w-3" />
                                Translate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Cultural Ambassadors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Cultural Ambassadors Program
              </CardTitle>
              <CardDescription>
                Connect with verified cultural experts and community leaders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Dr. Kwame Asante",
                    culture: "West African Traditions",
                    specialization: "Music & Ceremonies",
                    rating: 4.9,
                    sessions: 127,
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                    verified: true
                  },
                  {
                    name: "Priya Sharma",
                    culture: "Indian Classical Arts",
                    specialization: "Dance & Fashion",
                    rating: 4.8,
                    sessions: 89,
                    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
                    verified: true
                  },
                  {
                    name: "Carlos Mendoza",
                    culture: "Latin American Heritage",
                    specialization: "Cuisine & Festivals",
                    rating: 4.7,
                    sessions: 156,
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                    verified: true
                  }
                ].map((ambassador, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <Avatar className="h-16 w-16 mx-auto mb-3">
                        <AvatarImage src={ambassador.avatar} />
                        <AvatarFallback>{ambassador.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <h4 className="font-medium">{ambassador.name}</h4>
                        {ambassador.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{ambassador.culture}</p>
                      <p className="text-xs text-gray-500 mb-3">{ambassador.specialization}</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {ambassador.rating}
                        </div>
                        <span>•</span>
                        <span>{ambassador.sessions} sessions</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}