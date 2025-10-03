import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { 
  Palette, 
  Sparkles, 
  Users, 
  Trophy, 
  Star,
  Heart,
  Zap,
  Wand2,
  Eye,
  Brush,
  Camera,
  Download,
  Share2,
  Undo,
  Redo,
  Layers,
  Settings,
  Play,
  Volume2,
  Headphones,
  Moon,
  Sun,
  CloudRain,
  Flower,
  Coffee,
  BookOpen,
  Target,
  Gift,
  Crown,
  Award,
  TrendingUp,
  MessageSquare,
  CalendarDays,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function InteractiveDesignGenerator() {
  const [currentMood, setCurrentMood] = useState("energetic");
  const [designStyle, setDesignStyle] = useState("modern");
  const [colorPalette, setColorPalette] = useState<string[]>([]);
  const [sparklePosition, setSparklePosition] = useState({ x: 0, y: 0 });
  const [achievements, setAchievements] = useState<any[]>([]);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [designElements, setDesignElements] = useState<any[]>([]);
  const [moodIntensity, setMoodIntensity] = useState([70]);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [animationTriggers, setAnimationTriggers] = useState(new Set());
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [sharedContent, setSharedContent] = useState<any[]>([]);
  const [eventContext, setEventContext] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparkleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mood-based color palettes
  const moodPalettes = {
    energetic: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
    calm: ["#74B9FF", "#A29BFE", "#6C5CE7", "#81ECEC", "#00B894"],
    creative: ["#FD79A8", "#E84393", "#E17055", "#FDCB6E", "#F0932B"],
    professional: ["#2D3436", "#636E72", "#74B9FF", "#0984E3", "#00B894"],
    romantic: ["#FD79A8", "#FF7675", "#FDCB6E", "#E17055", "#A29BFE"],
    mysterious: ["#2D3436", "#636E72", "#6C5CE7", "#A29BFE", "#74B9FF"],
    playful: ["#FDCB6E", "#E17055", "#00B894", "#00CEC9", "#FF7675"],
    elegant: ["#2D3436", "#B2BEC3", "#DDD6FE", "#C7ECEE", "#FEF3C7"]
  };

  // Achievement system
  const achievementsList = [
    { id: "first_design", name: "First Creation", description: "Created your first design", icon: "🎨", unlocked: false, points: 10 },
    { id: "palette_master", name: "Palette Master", description: "Generated 10 color palettes", icon: "🌈", unlocked: false, points: 25 },
    { id: "story_teller", name: "Story Teller", description: "Generated your first story", icon: "📖", unlocked: false, points: 15 },
    { id: "collaborator", name: "Team Player", description: "Collaborated with others", icon: "👥", unlocked: false, points: 20 },
    { id: "mood_explorer", name: "Mood Explorer", description: "Tried all mood types", icon: "🎭", unlocked: false, points: 30 },
    { id: "design_wizard", name: "Design Wizard", description: "Created 50 designs", icon: "🧙‍♂️", unlocked: false, points: 100 }
  ];

  // Onboarding steps
  const onboardingSteps = [
    {
      title: "Welcome to Interactive Design Studio",
      description: "Let's create something amazing together! First, tell us about your mood.",
      action: "mood"
    },
    {
      title: "Choose Your Style",
      description: "What design aesthetic speaks to you today?",
      action: "style"
    },
    {
      title: "Set Your Creative Intensity",
      description: "How bold do you want your designs to be?",
      action: "intensity"
    },
    {
      title: "Ready to Create!",
      description: "You're all set! Let's start designing.",
      action: "complete"
    }
  ];

  // Fetch event context and group members
  const { data: eventData } = useQuery({
    queryKey: ['/api/events/user'],
    retry: false,
  });

  const { data: participantsData } = useQuery({
    queryKey: ['/api/events/participants/1'],
    retry: false,
  });

  // Initialize component
  useEffect(() => {
    generateMoodPalette();
    initializeSparkleEffect();
    loadUserAchievements();
    loadEventContext();
    return () => {
      if (sparkleIntervalRef.current) {
        clearInterval(sparkleIntervalRef.current);
      }
    };
  }, []);

  const loadEventContext = () => {
    if (eventData) {
      setEventContext(eventData);
    }
    if (participantsData) {
      setGroupMembers(participantsData || []);
    }
  };

  // Social group integration functions
  const shareContentWithGroup = async (content: any) => {
    try {
      await apiRequest('/api/events/messages', 'POST', {
        eventId: 1,
        userId: 1,
        message: `${content.type === 'story' ? '📖 Story' : '🎨 Design'}: ${content.content.substring(0, 100)}...`,
        type: 'design_share',
        metadata: content
      });

      setSharedContent(prev => [...prev, {
        id: Date.now(),
        ...content,
        sharedAt: new Date().toISOString(),
        sharedBy: "You"
      }]);

      // Trigger sparkle effect for sharing
      createSparkleEffect('share');
      
      // Update query cache to refresh group data
      queryClient.invalidateQueries({ queryKey: ['/api/events/messages/1'] });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const createSparkleEffect = (type: string) => {
    const colors = {
      share: 'bg-blue-400',
      achievement: 'bg-yellow-400',
      collaboration: 'bg-purple-400',
      mood: 'bg-pink-400'
    };

    Array.from({ length: 8 }).forEach((_, index) => {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = `fixed pointer-events-none z-50 w-3 h-3 ${colors[type as keyof typeof colors]} rounded-full animate-ping`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
          if (document.body.contains(sparkle)) {
            document.body.removeChild(sparkle);
          }
        }, 2000);
      }, index * 150);
    });
  };

  // Update palette when mood changes
  useEffect(() => {
    generateMoodPalette();
  }, [currentMood, moodIntensity]);

  const generateMoodPalette = () => {
    const basePalette = moodPalettes[currentMood as keyof typeof moodPalettes] || moodPalettes.energetic;
    const intensity = moodIntensity[0] / 100;
    
    // Adjust colors based on intensity
    const adjustedPalette = basePalette.map(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const adjustedR = Math.round(r * intensity + (255 * (1 - intensity)));
      const adjustedG = Math.round(g * intensity + (255 * (1 - intensity)));
      const adjustedB = Math.round(b * intensity + (255 * (1 - intensity)));
      
      return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
    });
    
    setColorPalette(adjustedPalette);
  };

  const initializeSparkleEffect = () => {
    sparkleIntervalRef.current = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      setSparklePosition({ x, y });
      
      // Create sparkle element
      const sparkle = document.createElement('div');
      sparkle.className = 'fixed pointer-events-none z-50 w-2 h-2 bg-yellow-400 rounded-full animate-ping';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      document.body.appendChild(sparkle);
      
      // Remove sparkle after animation
      setTimeout(() => {
        if (document.body.contains(sparkle)) {
          document.body.removeChild(sparkle);
        }
      }, 1000);
    }, 3000);
  };

  const loadUserAchievements = () => {
    const userAchievements = achievementsList.map((achievement, index) => ({
      ...achievement,
      unlocked: index < 2 // Simulate some unlocked achievements
    }));
    setAchievements(userAchievements);
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true }
        : achievement
    ));
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      setAnimationTriggers(prev => new Set([...prev, achievementId]));
      toast({
        title: "Achievement Unlocked!",
        description: `${achievement.name} - ${achievement.description}`,
      });
      
      // Remove animation trigger after delay
      setTimeout(() => {
        setAnimationTriggers(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(achievementId);
          return newSet;
        });
      }, 3000);
    }
  };

  const generateStory = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest('/api/ai/generate-story', 'POST', {
        prompt,
        mood: currentMood,
        style: designStyle,
        colorPalette,
        eventId: 1, // Connect to current event
        groupContext: true // Enable group collaboration context
      });
      return response;
    },
    onSuccess: (data) => {
      setGeneratedStory(data.story);
      unlockAchievement("story_teller");
      
      // Share story with group members
      shareContentWithGroup({
        type: 'story',
        content: data.story,
        mood: currentMood,
        style: designStyle,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Story Generated & Shared",
        description: "Your personalized story is ready and shared with the group!"
      });
    },
    onError: () => {
      toast({
        title: "Story Generation Failed",
        description: "Unable to generate story. Please try again.",
        variant: "destructive"
      });
    }
  });

  const addCollaborator = (collaborator: any) => {
    setCollaborators(prev => [...prev, collaborator]);
    unlockAchievement("collaborator");
    
    // Add sparkle effect for collaboration
    const sparkles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    sparkles.forEach((sparkle, index) => {
      setTimeout(() => {
        const element = document.createElement('div');
        element.className = 'fixed pointer-events-none z-50 w-3 h-3 bg-blue-400 rounded-full animate-bounce';
        element.style.left = `${sparkle.x}%`;
        element.style.top = `${sparkle.y}%`;
        document.body.appendChild(element);
        
        setTimeout(() => {
          if (document.body.contains(element)) {
            document.body.removeChild(element);
          }
        }, 2000);
      }, index * 200);
    });
  };

  const nextOnboardingStep = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(prev => prev + 1);
    } else {
      unlockAchievement("first_design");
    }
  };

  const getMoodIcon = (mood: string) => {
    const icons = {
      energetic: <Zap className="h-5 w-5" />,
      calm: <Moon className="h-5 w-5" />,
      creative: <Brush className="h-5 w-5" />,
      professional: <Target className="h-5 w-5" />,
      romantic: <Heart className="h-5 w-5" />,
      mysterious: <Eye className="h-5 w-5" />,
      playful: <Star className="h-5 w-5" />,
      elegant: <Crown className="h-5 w-5" />
    };
    return icons[mood as keyof typeof icons] || <Sparkles className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interactive Design Generator
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create personalized designs with AI-powered mood detection, real-time collaboration, and dynamic storytelling features.
          </p>
        </div>

        {/* Onboarding Progress */}
        {onboardingStep < onboardingSteps.length - 1 && (
          <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                {onboardingSteps[onboardingStep].title}
              </CardTitle>
              <Progress value={(onboardingStep + 1) / onboardingSteps.length * 100} className="mt-2" />
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {onboardingSteps[onboardingStep].description}
              </p>
              <Button onClick={nextOnboardingStep} className="bg-purple-600 hover:bg-purple-700">
                Continue <Star className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generator">Design Generator</TabsTrigger>
            <TabsTrigger value="moods">Mood Palettes</TabsTrigger>
            <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            <TabsTrigger value="stories">Story Generator</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="group-integration">Group Integration</TabsTrigger>
          </TabsList>

          {/* Design Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Design Canvas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <canvas 
                      ref={canvasRef}
                      className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                      width={600}
                      height={300}
                    />
                    
                    <div className="flex gap-2 flex-wrap">
                      {colorPalette.map((color, index) => (
                        <div
                          key={index}
                          className="w-12 h-12 rounded-lg border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            // Add sparkle effect when color is selected
                            const sparkle = document.createElement('div');
                            sparkle.className = 'fixed pointer-events-none z-50 w-4 h-4 rounded-full animate-ping';
                            sparkle.style.backgroundColor = color;
                            sparkle.style.left = '50%';
                            sparkle.style.top = '50%';
                            document.body.appendChild(sparkle);
                            setTimeout(() => {
                              if (document.body.contains(sparkle)) {
                                document.body.removeChild(sparkle);
                              }
                            }, 1000);
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Undo className="h-4 w-4 mr-2" />
                        Undo
                      </Button>
                      <Button variant="outline">
                        <Redo className="h-4 w-4 mr-2" />
                        Redo
                      </Button>
                      <Button variant="outline">
                        <Layers className="h-4 w-4 mr-2" />
                        Layers
                      </Button>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Design Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Mood</label>
                    <Select value={currentMood} onValueChange={setCurrentMood}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(moodPalettes).map(mood => (
                          <SelectItem key={mood} value={mood}>
                            <div className="flex items-center gap-2">
                              {getMoodIcon(mood)}
                              <span className="capitalize">{mood}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Design Style</label>
                    <Select value={designStyle} onValueChange={setDesignStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="whimsical">Whimsical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Mood Intensity: {moodIntensity[0]}%
                    </label>
                    <Slider
                      value={moodIntensity}
                      onValueChange={setMoodIntensity}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-semibold">Quick Actions</h4>
                    <Button 
                      className="w-full" 
                      onClick={generateMoodPalette}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate New Palette
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Import Image
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Design
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mood Palettes Tab */}
          <TabsContent value="moods" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(moodPalettes).map(([mood, colors]) => (
                <Card 
                  key={mood}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    currentMood === mood ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setCurrentMood(mood)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {getMoodIcon(mood)}
                      {mood}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1 mb-3">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-8 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {mood === 'energetic' && "Vibrant and dynamic colors for high-energy designs"}
                      {mood === 'calm' && "Soothing blues and greens for peaceful compositions"}
                      {mood === 'creative' && "Bold and expressive colors for artistic projects"}
                      {mood === 'professional' && "Clean and sophisticated tones for business use"}
                      {mood === 'romantic' && "Warm and passionate colors for intimate designs"}
                      {mood === 'mysterious' && "Deep and enigmatic shades for intrigue"}
                      {mood === 'playful' && "Fun and cheerful colors for joyful creations"}
                      {mood === 'elegant' && "Refined and graceful tones for luxury appeal"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Active Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {collaborators.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active collaborators</p>
                      <Button 
                        className="mt-4"
                        onClick={() => addCollaborator({
                          id: Date.now(),
                          name: "Design Partner",
                          avatar: "DP",
                          status: "online"
                        })}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Invite Collaborator
                      </Button>
                    </div>
                  ) : (
                    collaborators.map((collaborator, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {collaborator.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-sm text-gray-500">{collaborator.status}</p>
                        </div>
                        <Badge variant="default">Online</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Real-time Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Collaboration Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        Real-time cursor tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        Live design updates
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Collaborative reactions
                      </li>
                      <li className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Sparkle animations
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        // Trigger sparkle effect
                        Array.from({ length: 10 }).forEach((_, i) => {
                          setTimeout(() => {
                            const sparkle = document.createElement('div');
                            sparkle.className = 'fixed pointer-events-none z-50 w-3 h-3 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-ping';
                            sparkle.style.left = `${Math.random() * 100}%`;
                            sparkle.style.top = `${Math.random() * 100}%`;
                            document.body.appendChild(sparkle);
                            setTimeout(() => {
                              if (document.body.contains(sparkle)) {
                                document.body.removeChild(sparkle);
                              }
                            }, 2000);
                          }, i * 100);
                        });
                      }}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Trigger Sparkle Effect
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Workspace
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Story Generator Tab */}
          <TabsContent value="stories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Story Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter a story prompt or theme..."
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                    rows={4}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline">Mood: {currentMood}</Badge>
                    <Badge variant="outline">Style: {designStyle}</Badge>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => generateStory.mutate(storyPrompt)}
                    disabled={generateStory.isPending || !storyPrompt.trim()}
                  >
                    {generateStory.isPending ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Story
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Generated Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedStory ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg">
                        <p className="text-sm leading-relaxed">{generatedStory}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-2" />
                          Like
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No story generated yet</p>
                      <p className="text-sm text-gray-400">Enter a prompt to create your personalized story</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card 
                  key={achievement.id}
                  className={`transition-all ${
                    achievement.unlocked 
                      ? 'bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  } ${
                    animationTriggers.has(achievement.id) 
                      ? 'animate-pulse scale-105' 
                      : ''
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <p className={achievement.unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-500'}>
                          {achievement.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Trophy className={`h-4 w-4 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                          <span className="text-sm">{achievement.points} points</span>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <Badge variant="default" className="mt-2 bg-yellow-600">
                        <Award className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Total Progress</span>
                      <span className="text-sm text-gray-600">
                        {achievements.filter(a => a.unlocked).length} / {achievements.length}
                      </span>
                    </div>
                    <Progress 
                      value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Points</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {achievements.filter(a => a.unlocked).length}
                      </p>
                      <p className="text-sm text-gray-600">Unlocked</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                      </p>
                      <p className="text-sm text-gray-600">Complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Group Integration Tab */}
          <TabsContent value="group-integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Event Context: {eventContext?.title || "Sarah's Birthday Bash"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Connected Features</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-blue-500" />
                        <span>Mood Palettes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <span>AI Stories</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>Collaboration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>Achievements</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Group Members ({groupMembers.length})</h4>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {groupMembers.slice(0, 5).map((member, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                          <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {member.name?.charAt(0) || 'G'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{member.name || 'Group Member'}</p>
                            <p className="text-xs text-gray-500">{member.email || 'Active'}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {member.rsvpStatus || 'Going'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => {
                      shareContentWithGroup({
                        type: 'palette',
                        content: `Mood: ${currentMood}, Colors: ${colorPalette.join(', ')}`,
                        mood: currentMood,
                        style: designStyle,
                        colorPalette: colorPalette
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Current Palette with Group
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Shared Content Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {sharedContent.length === 0 ? (
                      <div className="text-center py-8">
                        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No shared content yet</p>
                        <p className="text-sm text-gray-400">Create and share designs, stories, or palettes with your group</p>
                      </div>
                    ) : (
                      sharedContent.map((content, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20">
                          <div className="flex items-center gap-2 mb-2">
                            {content.type === 'story' ? <BookOpen className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
                            <span className="font-medium text-sm capitalize">{content.type}</span>
                            <Badge variant="outline" className="text-xs">{content.mood}</Badge>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {content.content.substring(0, 100)}...
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Shared by {content.sharedBy}</span>
                            <span>{new Date(content.sharedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Integrated Feature Showcase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">Mood Sync</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Current palette automatically reflects group's collective mood preferences
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => createSparkleEffect('mood')}
                    >
                      Demo Mood Sync
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold">Live Collaboration</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Real-time design sharing with sparkle effects for each group member action
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        addCollaborator({
                          name: "Alex Chen",
                          avatar: "AC",
                          status: "online"
                        });
                        createSparkleEffect('collaboration');
                      }}
                    >
                      Add Collaborator
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold">AI Story Integration</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Stories incorporate event details and are automatically shared with group
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setStoryPrompt("A magical evening celebration");
                        shareContentWithGroup({
                          type: 'story',
                          content: "AI-generated story about our amazing group celebration...",
                          mood: currentMood,
                          style: designStyle
                        });
                      }}
                    >
                      Generate Group Story
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold">Group Achievements</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Unlock achievements together as group collaborates on designs
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        unlockAchievement("collaborator");
                        createSparkleEffect('achievement');
                      }}
                    >
                      Unlock Team Achievement
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">Seamless Integration Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-600 dark:text-green-400 font-semibold">Event Connection</div>
                      <div className="text-green-700 dark:text-green-300">✓ Active</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold">Group Members</div>
                      <div className="text-blue-700 dark:text-blue-300">✓ {groupMembers.length} Connected</div>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold">AI Features</div>
                      <div className="text-purple-700 dark:text-purple-300">✓ Enabled</div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold">Real-time Sync</div>
                      <div className="text-yellow-700 dark:text-yellow-300">✓ Live</div>
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