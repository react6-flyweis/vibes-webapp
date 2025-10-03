import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Smile,
  Frown,
  Meh,
  Heart,
  Zap,
  Music,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  Palette,
  Volume2,
  Lightbulb,
  Thermometer,
  Radio,
  Target,
  Mic,
  Camera,
  Globe,
  Star,
  Clock,
  MapPin,
  Calendar,
  Settings
} from "lucide-react";

interface MoodData {
  timestamp: string;
  happiness: number;
  energy: number;
  engagement: number;
  excitement: number;
  overall: number;
  participants: number;
  location?: string;
}

interface MoodTrend {
  period: string;
  average: number;
  peak: number;
  low: number;
  participants: number;
}

interface RealtimeFeedback {
  id: string;
  mood: string;
  intensity: number;
  message?: string;
  timestamp: string;
  anonymous: boolean;
}

const moodIcons = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  excited: Zap,
  loved: Heart,
  energetic: Music
};

const moodColors = {
  happiness: "#FFD700",
  energy: "#FF6B35",
  engagement: "#4ECDC4",
  excitement: "#9B59B6",
  overall: "#3498DB"
};

export default function InteractiveMoodVisualizer() {
  const [selectedEvent, setSelectedEvent] = useState<string>("1");
  const [timeRange, setTimeRange] = useState<string>("live");
  const [moodFilter, setMoodFilter] = useState<string>("all");
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [currentMood, setCurrentMood] = useState({
    happiness: 75,
    energy: 68,
    engagement: 82,
    excitement: 71
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mood data
  const { data: moodData, isLoading } = useQuery({
    queryKey: ['/api/mood-visualizer/data', selectedEvent, timeRange],
    retry: false,
  });

  // Fetch mood trends
  const { data: moodTrends } = useQuery({
    queryKey: ['/api/mood-visualizer/trends', selectedEvent],
    retry: false,
  });

  // Fetch realtime feedback
  const { data: realtimeFeedback } = useQuery({
    queryKey: ['/api/mood-visualizer/feedback', selectedEvent],
    retry: false,
    refetchInterval: isLiveMode ? 5000 : false,
  });

  // Submit mood feedback mutation
  const submitMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; intensity: number; message?: string }) => {
      return await apiRequest("POST", "/api/mood-visualizer/feedback", {
        eventId: selectedEvent,
        ...data
      });
    },
    onSuccess: () => {
      toast({
        title: "Mood Submitted",
        description: "Thank you for sharing your mood with the event!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mood-visualizer/feedback'] });
    },
  });

  // Draw mood visualization on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !moodData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(139, 92, 246, 0.1)`);
    gradient.addColorStop(1, `rgba(59, 130, 246, 0.1)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw mood waves
    if (Array.isArray(moodData) && moodData.length > 0) {
      const dataPoints = moodData as any[];
      
      Object.keys(moodColors).forEach((moodType, index) => {
        ctx.beginPath();
        ctx.strokeStyle = moodColors[moodType as keyof typeof moodColors];
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;

        dataPoints.forEach((point, i) => {
          const x = (i / (dataPoints.length - 1)) * width;
          const y = height - (point[moodType] / 100) * height;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      });
    }

    // Draw animated particles for current mood
    const drawParticles = () => {
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 1;
        
        ctx.beginPath();
        ctx.fillStyle = Object.values(moodColors)[Math.floor(Math.random() * Object.values(moodColors).length)];
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawParticles();
  }, [moodData, currentMood]);

  // Real-time mood updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      setCurrentMood(prev => ({
        happiness: Math.max(0, Math.min(100, prev.happiness + (Math.random() - 0.5) * 10)),
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 8)),
        engagement: Math.max(0, Math.min(100, prev.engagement + (Math.random() - 0.5) * 6)),
        excitement: Math.max(0, Math.min(100, prev.excitement + (Math.random() - 0.5) * 12))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  const handleMoodSubmit = (mood: string, intensity: number) => {
    submitMoodMutation.mutate({ mood, intensity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
              <Activity className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl">
              <BarChart3 className="w-12 h-12 text-white" />
            </div>
            <div className="p-4 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl">
              <Palette className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Interactive Mood Visualizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Experience real-time event emotions through dynamic visualizations and interactive mood tracking
          </p>
        </div>

        <Tabs defaultValue="live" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Live Mood
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Live Mood Tab */}
          <TabsContent value="live" className="space-y-6">
            {/* Live Mood Visualization */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-red-500" />
                      Live Event Mood
                    </CardTitle>
                    <CardDescription>Real-time emotional atmosphere visualization</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isLiveMode ? "destructive" : "secondary"}>
                      {isLiveMode ? "LIVE" : "PAUSED"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLiveMode(!isLiveMode)}
                    >
                      {isLiveMode ? "Pause" : "Resume"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="w-full h-64 rounded-lg border"
                  />
                  <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded-lg">
                    <div className="text-sm">Current Participants: {(moodData as any)?.participants || 156}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Mood Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(currentMood).map(([mood, value]) => {
                const Icon = mood === 'happiness' ? Smile : 
                           mood === 'energy' ? Zap :
                           mood === 'engagement' ? Users : Heart;
                return (
                  <Card key={mood} className="text-center">
                    <CardContent className="p-6">
                      <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: moodColors[mood as keyof typeof moodColors] }} />
                      <div className="text-3xl font-bold mb-2" style={{ color: moodColors[mood as keyof typeof moodColors] }}>
                        {Math.round(value)}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {mood}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Mood Input Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Share Your Mood
                </CardTitle>
                <CardDescription>Help us understand the event atmosphere</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(moodIcons).map(([mood, Icon]) => (
                    <Button
                      key={mood}
                      variant="outline"
                      className="h-20 flex flex-col gap-2"
                      onClick={() => handleMoodSubmit(mood, 80)}
                      disabled={submitMoodMutation.isPending}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs capitalize">{mood}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Mood Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {moodTrends && Array.isArray(moodTrends) && moodTrends.length > 0 ? (
                    <div className="space-y-4">
                      {(moodTrends as any[]).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium">{trend.period}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {trend.participants} participants
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {trend.average}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Peak: {trend.peak}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">No trend data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Peak Mood Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "8:30 PM", mood: "Excitement", value: 94 },
                      { time: "9:15 PM", mood: "Energy", value: 89 },
                      { time: "10:00 PM", mood: "Happiness", value: 87 },
                      { time: "8:00 PM", mood: "Engagement", value: 85 }
                    ].map((peak, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{peak.time}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{peak.mood}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{peak.value}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Live Participant Feedback
                </CardTitle>
                <CardDescription>Real-time mood updates from event attendees</CardDescription>
              </CardHeader>
              <CardContent>
                {realtimeFeedback && Array.isArray(realtimeFeedback) && realtimeFeedback.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {(realtimeFeedback as any[]).map((feedback) => (
                      <div key={feedback.id} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                          {moodIcons[feedback.mood as keyof typeof moodIcons] && (
                            (() => {
                              const MoodIcon = moodIcons[feedback.mood as keyof typeof moodIcons];
                              return <MoodIcon className="w-4 h-4 text-purple-600" />;
                            })()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="capitalize">{feedback.mood}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(feedback.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {feedback.message && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              "{feedback.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div 
                              className="h-full bg-purple-600 rounded-full" 
                              style={{ width: `${feedback.intensity}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{feedback.intensity}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mic className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No feedback available yet</p>
                    <p className="text-sm text-gray-400">Encourage guests to share their mood!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-600">156</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Participants</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Activity className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Mood</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <div className="text-3xl font-bold text-purple-600">+12%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mood Increase</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                  <div className="text-3xl font-bold text-orange-600">94%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Peak Happiness</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Mood Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(currentMood).map(([mood, value]) => (
                    <div key={mood} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">{mood}</span>
                        <span className="text-sm text-gray-600">{Math.round(value)}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${value}%`,
                            backgroundColor: moodColors[mood as keyof typeof moodColors]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}