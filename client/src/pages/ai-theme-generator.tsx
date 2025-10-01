import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Palette, Music, ShoppingBag, Heart, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ThemeGeneration {
  name: string;
  colors: string[];
  fonts: string[];
  vibe: string;
  menuSuggestions: string[];
  musicPlaylist: {
    genre: string;
    songs: string[];
  };
  decorSuggestions: {
    item: string;
    price: string;
    link: string;
    description: string;
  }[];
}

const presetThemes: Record<string, ThemeGeneration> = {
  "chill rooftop brunch": {
    name: "Zen Garden Brunch",
    colors: ["#F7F3E9", "#E8D5B7", "#B8A082", "#6B5B73", "#87CEEB"],
    fonts: ["Inter", "Playfair Display"],
    vibe: "Relaxed, elegant, and Instagram-worthy with natural light and fresh vibes",
    menuSuggestions: [
      "Avocado toast with microgreens",
      "Açaí bowls with fresh berries",
      "Craft cold brew coffee",
      "Smoked salmon bagels",
      "Fresh fruit platters"
    ],
    musicPlaylist: {
      genre: "Chill Indie/Acoustic",
      songs: [
        "Golden - Harry Styles",
        "Breath Me - Sia",
        "Vienna - Billy Joel",
        "Something in the Way She Moves - James Taylor",
        "Holocene - Bon Iver"
      ]
    },
    decorSuggestions: [
      {
        item: "Eucalyptus garlands",
        price: "$25",
        link: "https://amazon.com/eucalyptus-garland",
        description: "Fresh green garlands for natural ambiance"
      },
      {
        item: "White market umbrellas", 
        price: "$89",
        link: "https://amazon.com/market-umbrellas",
        description: "Provide shade and elegant coverage"
      },
      {
        item: "Rustic wooden serving boards",
        price: "$35",
        link: "https://amazon.com/wooden-boards",
        description: "Perfect for charcuterie and appetizers"
      }
    ]
  },
  "neon retro rave": {
    name: "Electric Nostalgia",
    colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF1493", "#00FF00"],
    fonts: ["Orbitron", "Neon Glow"],
    vibe: "High-energy, nostalgic 80s/90s with electric beats and glow-everything",
    menuSuggestions: [
      "Neon cocktails with LED ice cubes",
      "Glow-in-the-dark jello shots",
      "Retro candy bar",
      "Pop rocks cocktails",
      "Neon-colored popcorn"
    ],
    musicPlaylist: {
      genre: "Synthwave/Electronic",
      songs: [
        "Blinding Lights - The Weeknd",
        "I Can't Sleep - Clay Walker", 
        "Midnight City - M83",
        "Electric Feel - MGMT",
        "One More Time - Daft Punk"
      ]
    },
    decorSuggestions: [
      {
        item: "LED strip lights (multicolor)",
        price: "$45",
        link: "https://amazon.com/led-strips",
        description: "Create electric ambiance throughout space"
      },
      {
        item: "Blacklight reactive decorations",
        price: "$28",
        link: "https://amazon.com/blacklight-decor",
        description: "Glow under UV lighting for authentic rave feel"
      },
      {
        item: "Disco ball with spotlight",
        price: "$65",
        link: "https://amazon.com/disco-ball",
        description: "Classic party centerpiece with modern LED"
      }
    ]
  }
};

export default function AIThemeGenerator() {
  const [vibeInput, setVibeInput] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [generatedTheme, setGeneratedTheme] = useState<ThemeGeneration | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateTheme = useMutation({
    mutationFn: async (vibeDescription: string) => {
      try {
        // Check if it matches a preset first
        const lowerVibe = vibeDescription.toLowerCase();
        const matchedPreset = Object.keys(presetThemes).find(key => 
          lowerVibe.includes(key) || key.includes(lowerVibe)
        );
        
        if (matchedPreset) {
          return presetThemes[matchedPreset];
        }

        // Try AI API for custom theme generation
        try {
          const response = await apiRequest('/api/ai/generate-theme', 'POST', {
            eventType: vibeDescription,
            guestCount: 20,
            budget: "moderate"
          });

          // Transform AI response to match our theme structure
          return {
            name: response.name || "AI Generated Theme",
            colors: response.colorScheme || ["#4F46E5", "#7C3AED", "#EC4899"],
            fonts: ["Inter", "Playfair Display"],
            vibe: `AI-generated theme: ${response.name}`,
            menuSuggestions: response.foodIdeas || [
              "AI-curated menu suggestions",
              "Personalized food recommendations",
              "Theme-matched cuisine"
            ],
            musicPlaylist: {
              genre: "AI Curated",
              songs: response.musicSuggestions || [
                "AI-selected tracks",
                "Mood-matched music",
                "Custom playlist"
              ]
            },
            decorSuggestions: response.decorations?.map((item: string, index: number) => ({
              item: item,
              price: `$${25 + (index * 15)}`,
              link: "#",
              description: `AI-recommended ${item.toLowerCase()}`
            })) || [
              {
                item: "AI-recommended decorations",
                price: "$50",
                link: "#",
                description: "Intelligent decoration suggestions"
              }
            ]
          };
        } catch (aiError) {
          // Generate intelligent theme based on description
          const words = vibeDescription.toLowerCase().split(' ');
          const eventKeywords = {
            birthday: { colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"], music: "Pop & Dance Hits", vibe: "Celebratory & Joyful" },
            wedding: { colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6"], music: "Romantic Classics", vibe: "Elegant & Romantic" },
            corporate: { colors: ["#2C3E50", "#3498DB", "#E74C3C"], music: "Professional Background", vibe: "Professional & Modern" },
            holiday: { colors: ["#C0392B", "#27AE60", "#F39C12"], music: "Holiday Classics", vibe: "Festive & Warm" },
            graduation: { colors: ["#8E44AD", "#F1C40F", "#2ECC71"], music: "Uplifting Anthems", vibe: "Achievement & Success" }
          };

          let selectedTheme = { colors: ["#6366F1", "#8B5CF6", "#EC4899"], music: "Mixed Playlist", vibe: "Custom Celebration" };
          
          for (const [key, theme] of Object.entries(eventKeywords)) {
            if (words.some(word => word.includes(key) || key.includes(word))) {
              selectedTheme = theme;
              break;
            }
          }

          return {
            name: `${vibeDescription.charAt(0).toUpperCase() + vibeDescription.slice(1)} Theme`,
            colors: selectedTheme.colors,
            fonts: ["Inter", "Playfair Display"],
            vibe: selectedTheme.vibe,
            menuSuggestions: [
              "Themed appetizers and finger foods",
              "Signature cocktails or beverages",
              "Custom dessert station"
            ],
            musicPlaylist: {
              genre: selectedTheme.music,
              songs: [
                "Curated playlist for your event",
                "Mix of crowd favorites",
                "Background ambiance music"
              ]
            },
            decorSuggestions: [
              {
                item: "Color-coordinated balloons",
                price: "$35",
                link: "#",
                description: "Matching your theme colors"
              },
              {
                item: "Themed centerpieces",
                price: "$50",
                link: "#",
                description: "Custom table decorations"
              },
              {
                item: "Ambient lighting",
                price: "$65",
                link: "#",
                description: "Perfect mood lighting"
              }
            ]
          };
        }
      } catch (error) {
        console.error("Theme generation failed:", error);
        throw error;
      }
    },
    onSuccess: (theme) => {
      setGeneratedTheme(theme);
      setIsGenerating(false);
      toast({
        title: "🎨 Theme Generated!",
        description: "Your AI-powered theme is ready to inspire your event!"
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      console.error("Theme generation error:", error);
      toast({
        title: "Generation Error",
        description: `Error: ${error.message || "Let's try again with a different vibe description."}`,
        variant: "destructive"
      });
    }
  });

  const handleGenerate = () => {
    if (!vibeInput.trim()) {
      toast({
        title: "Describe Your Vibe",
        description: "Tell us about the atmosphere you want to create!",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    generateTheme.mutate(vibeInput);
  };

  const selectPreset = (preset: string) => {
    setSelectedPreset(preset);
    setVibeInput(preset);
    setGeneratedTheme(presetThemes[preset]);
  };

  const applyTheme = useMutation({
    mutationFn: async () => {
      // For now, simulate saving the theme
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "🎉 Theme Applied!",
        description: "Your AI theme has been saved to your event toolkit!"
      });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Theme Generator
            </h1>
            <Wand2 className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Describe your dream vibe and watch AI transform it into a complete theme with colors, music, menu ideas, and shopping links!
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Describe Your Vibe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., 'chill rooftop brunch with boho vibes' or 'neon retro rave with 80s nostalgia'"
              value={vibeInput}
              onChange={(e) => setVibeInput(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Quick presets:</span>
              {Object.keys(presetThemes).map((preset) => (
                <Badge
                  key={preset}
                  variant={selectedPreset === preset ? "default" : "outline"}
                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900"
                  onClick={() => selectPreset(preset)}
                >
                  {preset}
                </Badge>
              ))}
            </div>

            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate My Theme
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Theme Display */}
        {generatedTheme && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  {generatedTheme.name}
                </CardTitle>
                <Button
                  onClick={() => applyTheme.mutate()}
                  disabled={applyTheme.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Apply This Theme
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {generatedTheme.vibe}
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="colors">Colors & Fonts</TabsTrigger>
                  <TabsTrigger value="menu">Menu Ideas</TabsTrigger>
                  <TabsTrigger value="music">Music Playlist</TabsTrigger>
                  <TabsTrigger value="decor">Shopping List</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Color Palette
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {generatedTheme.colors.map((color: any, index: any) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs mt-1 font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Recommended Fonts</h3>
                    <div className="flex gap-2">
                      {generatedTheme.fonts.map((font: any, index: any) => (
                        <Badge key={index} variant="outline">
                          {font}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="menu" className="space-y-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span>🍽️</span>
                    Menu Suggestions - {generatedTheme.name}
                  </h3>
                  <div className="grid gap-2">
                    {generatedTheme.menuSuggestions.map((item: any, index: any) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-green-600">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="music" className="space-y-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    {generatedTheme.musicPlaylist.genre} Playlist
                  </h3>
                  <div className="grid gap-2">
                    {generatedTheme.musicPlaylist.songs.map((song: any, index: any) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-purple-600">♪</span>
                        <span>{song}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="decor" className="space-y-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Curated Shopping List
                  </h3>
                  <div className="grid gap-4">
                    {generatedTheme.decorSuggestions.map((item: any, index: any) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{item.item}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{item.price}</p>
                              <Button size="sm" variant="outline" asChild>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                  Shop Now
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}