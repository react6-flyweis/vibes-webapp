import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Music, 
  Brain, 
  TrendingUp, 
  Users, 
  Heart,
  Zap,
  Volume2,
  Play,
  Pause,
  SkipForward,
  ThumbsUp,
  ThumbsDown,
  Settings,
  Sparkles,
  BarChart3,
  Target,
  Lightbulb
} from "lucide-react";

export default function AdaptiveMusicEngine() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [energyLevel, setEnergyLevel] = useState([75]);
  const [moodTarget, setMoodTarget] = useState("upbeat");
  const [autoAdaptive, setAutoAdaptive] = useState(true);

  // Fetch music recommendations
  const { data: recommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ["/api/music/recommendations"],
    retry: false,
  });

  // Fetch crowd analysis
  const { data: crowdAnalysis, isLoading: loadingAnalysis } = useQuery({
    queryKey: ["/api/music/crowd-analysis"],
    retry: false,
  });

  // Fetch recommendation settings
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["/api/music/settings"],
    retry: false,
  });

  // Generate new recommendations
  const generateRecommendations = useMutation({
    mutationFn: async (params: any) => {
      return await apiRequest("POST", "/api/music/generate-recommendations", params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music/recommendations"] });
      toast({
        title: "Recommendations Updated",
        description: "New music recommendations generated based on current crowd analysis.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Apply recommendation
  const applyRecommendation = useMutation({
    mutationFn: async (trackId: string) => {
      return await apiRequest("POST", "/api/music/apply-recommendation", { trackId });
    },
    onSuccess: () => {
      toast({
        title: "Track Applied",
        description: "Recommendation has been added to the DJ queue.",
      });
    },
    onError: () => {
      toast({
        title: "Apply Failed",
        description: "Failed to apply recommendation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      return await apiRequest("POST", "/api/music/update-settings", newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music/settings"] });
      toast({
        title: "Settings Updated",
        description: "Music recommendation settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Provide feedback
  const provideFeedback = useMutation({
    mutationFn: async (data: { trackId: string; feedback: 'positive' | 'negative'; reason?: string }) => {
      return await apiRequest("POST", "/api/music/feedback", data);
    },
    onSuccess: () => {
      toast({
        title: "Feedback Recorded",
        description: "Your feedback will improve future recommendations.",
      });
    },
    onError: () => {
      toast({
        title: "Feedback Failed",
        description: "Failed to record feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateRecommendations = () => {
    setIsAnalyzing(true);
    generateRecommendations.mutate({
      energyLevel: energyLevel[0],
      moodTarget,
      autoAdaptive,
      crowdSize: crowdAnalysis?.currentCrowd ?? 50,
      timeOfDay: new Date().getHours()
    });
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return "text-red-500";
    if (energy >= 60) return "text-orange-500";
    if (energy >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "energetic": return <Zap className="h-4 w-4" />;
      case "chill": return <Heart className="h-4 w-4" />;
      case "upbeat": return <TrendingUp className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  if (loadingRecommendations || loadingAnalysis || loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Adaptive Music Engine</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered music recommendations that adapt to your crowd's energy and preferences in real-time
        </p>
      </div>

      {/* Real-time Crowd Analysis */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Crowd Analysis
          </CardTitle>
          <CardDescription>
            Real-time analysis of crowd energy and engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{crowdAnalysis?.currentCrowd ?? 89}</div>
              <div className="text-sm text-muted-foreground">Active Listeners</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getEnergyColor(crowdAnalysis?.energyLevel ?? 75)}`}>
                {crowdAnalysis?.energyLevel ?? 75}%
              </div>
              <div className="text-sm text-muted-foreground">Energy Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{crowdAnalysis?.engagementScore ?? 8.4}</div>
              <div className="text-sm text-muted-foreground">Engagement Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {getMoodIcon(crowdAnalysis?.dominantMood ?? "upbeat")}
                <Badge variant="secondary">{crowdAnalysis?.dominantMood ?? "Upbeat"}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Crowd Mood</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <Label>Real-time Energy Tracking</Label>
              <span className="text-sm text-muted-foreground">Last 30 minutes</span>
            </div>
            <Progress value={crowdAnalysis?.energyLevel ?? 75} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Learning
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI Music Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Curated tracks based on crowd analysis and preferences
              </p>
            </div>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isAnalyzing || generateRecommendations.isPending}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {isAnalyzing ? "Analyzing..." : "Generate New"}
            </Button>
          </div>

          <div className="grid gap-4">
            {(recommendations?.tracks || []).map((track: any, index: number) => (
              <Card key={track.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          <Music className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{track.genre}</Badge>
                            <Badge variant="secondary">{track.bpm} BPM</Badge>
                            <Badge className={getEnergyColor(track.energy)}>
                              Energy: {track.energy}/10
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-center mr-4">
                        <div className="text-sm font-semibold text-primary">{track.matchScore}%</div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => provideFeedback.mutate({ trackId: track.id, feedback: 'positive' })}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => provideFeedback.mutate({ trackId: track.id, feedback: 'negative' })}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => applyRecommendation.mutate(track.id)}
                        disabled={applyRecommendation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Apply
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-muted-foreground">
                    <strong>Why recommended:</strong> {track.reason}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recommendation Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {recommendations?.analytics?.accuracy ?? 87}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on user feedback and engagement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tracks Applied</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {recommendations?.analytics?.appliedTracks ?? 23}
                </div>
                <p className="text-sm text-muted-foreground">
                  Recommendations used today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Crowd Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {recommendations?.analytics?.satisfaction ?? 4.6}/5
                </div>
                <p className="text-sm text-muted-foreground">
                  Average rating for AI picks
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Genre Distribution</CardTitle>
              <CardDescription>Most recommended genres today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(recommendations?.analytics?.genres || []).map((genre: any) => (
                  <div key={genre.name} className="flex items-center justify-between">
                    <span className="text-sm">{genre.name}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={genre.percentage} className="w-24 h-2" />
                      <span className="text-sm text-muted-foreground w-8">
                        {genre.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Learning Insights
              </CardTitle>
              <CardDescription>
                How the AI adapts to your crowd's preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Learned Preferences</h4>
                  <div className="space-y-2">
                    {(recommendations?.learning?.preferences || []).map((pref: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{pref.pattern}</span>
                        <Badge variant="secondary">{pref.confidence}% confidence</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Pattern Recognition</h4>
                  <div className="space-y-2">
                    {(recommendations?.learning?.patterns || []).map((pattern: any, index: number) => (
                      <div key={index} className="p-2 bg-muted rounded">
                        <div className="text-sm font-medium">{pattern.name}</div>
                        <div className="text-xs text-muted-foreground">{pattern.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Feedback Integration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  The AI continuously learns from DJ and crowd feedback to improve recommendations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {recommendations?.learning?.positiveFeedback ?? 78}
                    </div>
                    <div className="text-sm text-green-600">Positive Feedback</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {recommendations?.learning?.negativeFeedback ?? 12}
                    </div>
                    <div className="text-sm text-red-600">Negative Feedback</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendations?.learning?.learningRate ?? 94}%
                    </div>
                    <div className="text-sm text-blue-600">Learning Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Settings</CardTitle>
              <CardDescription>
                Customize how the AI generates music recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-adaptive">Auto-Adaptive Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjust recommendations based on crowd response
                    </p>
                  </div>
                  <Switch
                    id="auto-adaptive"
                    checked={autoAdaptive}
                    onCheckedChange={setAutoAdaptive}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Energy Level: {energyLevel[0]}%</Label>
                  <Slider
                    value={energyLevel}
                    onValueChange={setEnergyLevel}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood-target">Mood Target</Label>
                  <select
                    id="mood-target"
                    value={moodTarget}
                    onChange={(e) => setMoodTarget(e.target.value)}
                    className="w-full p-2 border border-input rounded-md"
                  >
                    <option value="energetic">Energetic</option>
                    <option value="upbeat">Upbeat</option>
                    <option value="chill">Chill</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Real-time Adaptation</Label>
                    <p className="text-sm text-muted-foreground">
                      Adjust recommendations based on live crowd feedback
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Genre Diversity</Label>
                    <p className="text-sm text-muted-foreground">
                      Include varied genres in recommendations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button
                onClick={() => updateSettings.mutate({
                  autoAdaptive,
                  energyLevel: energyLevel[0],
                  moodTarget,
                  realTimeAdaptation: true,
                  genreDiversity: true
                })}
                disabled={updateSettings.isPending}
                className="w-full"
              >
                {updateSettings.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}