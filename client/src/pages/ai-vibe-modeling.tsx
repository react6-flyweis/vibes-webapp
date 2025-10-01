import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Music,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Activity,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Star,
  Eye,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Calendar,
  Coffee,
  Utensils,
  Volume2,
  Palette,
  Heart,
  UserCheck
} from "lucide-react";

interface VibeModel {
  id: string;
  eventId: number;
  eventTitle: string;
  modelAccuracy: number;
  lastUpdated: string;
  guestInsights: {
    totalGuests: number;
    analyzedGuests: number;
    averageEngagement: number;
    satisfactionScore: number;
  };
  predictions: {
    noShowRisk: Array<{
      guestId: number;
      guestName: string;
      riskScore: number;
      factors: string[];
      recommendation: string;
    }>;
    preferenceAnalysis: {
      musicGenres: Array<{ genre: string; preference: number; confidence: number }>;
      drinkTypes: Array<{ type: string; preference: number; popularity: number }>;
      themePreferences: Array<{ theme: string; score: number; trending: boolean }>;
    };
    realTimeAdjustments: Array<{
      category: string;
      current: string;
      recommended: string;
      confidence: number;
      impact: string;
    }>;
  };
  socialTrends: {
    trending: Array<{ item: string; category: string; growth: number }>;
    declining: Array<{ item: string; category: string; decline: number }>;
  };
  recommendations: Array<{
    id: string;
    type: 'enhancement' | 'warning' | 'optimization';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    confidence: number;
  }>;
}

const categoryIcons = {
  music: Music,
  drinks: Coffee,
  food: Utensils,
  decor: Palette,
  entertainment: Volume2,
  atmosphere: Heart
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

export default function AIVibeModeling() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vibe models
  const { data: vibeModels, isLoading } = useQuery({
    queryKey: ['/api/ai-vibe-models', selectedEventId],
    retry: false,
    refetchInterval: autoRefresh ? 30000 : false, // Auto-refresh every 30 seconds
  });

  // Fetch user events for selection
  const { data: userEvents } = useQuery({
    queryKey: ['/api/events/user'],
    retry: false,
  });

  // Generate vibe predictions mutation
  const generatePredictionsMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return await apiRequest("POST", "/api/ai-vibe-models/generate", { eventId });
    },
    onSuccess: () => {
      toast({
        title: "Vibe Model Updated",
        description: "AI has analyzed guest data and generated new predictions for your event.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-vibe-models'] });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to generate vibe predictions. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Apply recommendation mutation
  const applyRecommendationMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      return await apiRequest("POST", "/api/ai-vibe-models/apply-recommendation", { recommendationId });
    },
    onSuccess: () => {
      toast({
        title: "Recommendation Applied",
        description: "AI suggestion has been implemented in your event settings.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-vibe-models'] });
    },
  });

  const currentModel = vibeModels?.find((model: VibeModel) => model.eventId === selectedEventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-party-gradient-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-party-gradient-1 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-party-rainbow opacity-10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-party-pink rounded-full opacity-20 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-party-yellow rounded-full opacity-30 animate-party-wiggle"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-party-turquoise rounded-full opacity-15 animate-pulse-slow"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-purple-200 mx-auto mb-4 animate-party-wiggle" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            AI-Powered Vibe Modeling
          </h1>
          <p className="text-white/90 mt-2 text-xl">Predictive analytics for hyper-personalized party experiences</p>
        </div>

        {/* Feature Overview */}
        <Card className="mb-8 bg-party-gradient-2 text-white border-0 shadow-2xl animate-neon-glow">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center animate-bounce-gentle">
              <Sparkles className="w-8 h-8 mr-3 text-purple-200" />
              Intelligent Event Optimization
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              AI analyzes guest behavior and social trends to predict and enhance event experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Target className="w-12 h-12 text-party-yellow mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Preference Prediction</h3>
                <p className="text-white/80 text-sm">Predict guest music, food & drink preferences</p>
              </div>
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-party-turquoise mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">No-Show Prevention</h3>
                <p className="text-white/80 text-sm">Identify at-risk guests and take action</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-party-pink mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Real-Time Adaptation</h3>
                <p className="text-white/80 text-sm">Auto-adjust event elements during the party</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-party-green mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Trend Analysis</h3>
                <p className="text-white/80 text-sm">Leverage social media and cultural trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Overview */}
        {currentModel && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{currentModel.modelAccuracy}%</div>
                <p className="text-gray-600 text-sm">Model Accuracy</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{currentModel.guestInsights.analyzedGuests}</div>
                <p className="text-gray-600 text-sm">Guests Analyzed</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{currentModel.guestInsights.averageEngagement}%</div>
                <p className="text-gray-600 text-sm">Avg Engagement</p>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{currentModel.guestInsights.satisfactionScore}/10</div>
                <p className="text-gray-600 text-sm">Satisfaction Score</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Control Panel */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <Button 
              onClick={() => generatePredictionsMutation.mutate(selectedEventId)}
              disabled={generatePredictionsMutation.isPending}
              className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${generatePredictionsMutation.isPending ? 'animate-spin' : ''}`} />
              Update Predictions
            </Button>
            <Button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              className="text-white border-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
          <div className="text-white/70 text-sm">
            Last updated: {currentModel ? new Date(currentModel.lastUpdated).toLocaleTimeString() : 'Never'}
          </div>
        </div>

        {currentModel ? (
          <div className="space-y-8">
            {/* No-Show Risk Analysis */}
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                  No-Show Risk Analysis
                </CardTitle>
                <CardDescription>Guests at risk of not attending your event</CardDescription>
              </CardHeader>
              <CardContent>
                {currentModel.predictions.noShowRisk.length > 0 ? (
                  <div className="space-y-3">
                    {currentModel.predictions.noShowRisk.map((guest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium">{guest.guestName}</h4>
                          <p className="text-sm text-gray-600">Risk factors: {guest.factors.join(', ')}</p>
                          <p className="text-sm text-blue-600 mt-1">{guest.recommendation}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${guest.riskScore > 70 ? 'text-red-600' : guest.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {guest.riskScore}%
                            </div>
                            <div className="text-xs text-gray-500">Risk</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <UserCheck className="w-4 h-4 mr-1" />
                            Reach Out
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>All guests show low no-show risk!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preference Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Music Preferences */}
              <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Music className="w-5 h-5 mr-2 text-purple-600" />
                    Music Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentModel.predictions.preferenceAnalysis.musicGenres.map((genre, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{genre.genre}</span>
                          <span className="text-gray-600">{genre.confidence}% conf.</span>
                        </div>
                        <Progress value={genre.preference} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Drink Preferences */}
              <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Coffee className="w-5 h-5 mr-2 text-brown-600" />
                    Drink Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentModel.predictions.preferenceAnalysis.drinkTypes.map((drink, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{drink.type}</span>
                          <span className="text-gray-600">{drink.popularity}% pop.</span>
                        </div>
                        <Progress value={drink.preference} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Theme Preferences */}
              <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Palette className="w-5 h-5 mr-2 text-pink-600" />
                    Theme Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentModel.predictions.preferenceAnalysis.themePreferences.map((theme, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{theme.theme}</span>
                            {theme.trending && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Trending
                              </Badge>
                            )}
                          </div>
                          <Progress value={theme.score} className="h-1 mt-1" />
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{theme.score}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Recommendations */}
            <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Smart suggestions to enhance your event experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentModel.recommendations.map((rec) => (
                    <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${priorityColors[rec.priority]}`}></div>
                          <h4 className="font-medium">{rec.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {rec.confidence}% conf.
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <p className="text-sm text-blue-600 mb-3">Impact: {rec.impact}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => applyRecommendationMutation.mutate(rec.id)}
                          disabled={applyRecommendationMutation.isPending}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Apply
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Trending Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentModel.socialTrends.trending.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <div>
                          <span className="font-medium text-sm">{trend.item}</span>
                          <span className="text-xs text-gray-500 ml-2">({trend.category})</span>
                        </div>
                        <span className="text-green-600 font-bold">+{trend.growth}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur border-2 border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="w-5 h-5 mr-2 text-red-600 rotate-180" />
                    Declining Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentModel.socialTrends.declining.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div>
                          <span className="font-medium text-sm">{trend.item}</span>
                          <span className="text-xs text-gray-500 ml-2">({trend.category})</span>
                        </div>
                        <span className="text-red-600 font-bold">-{trend.decline}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Vibe Model Available</h3>
            <p className="text-white/70 mb-6">Generate AI predictions for your event to unlock intelligent insights and recommendations.</p>
            <Button 
              onClick={() => generatePredictionsMutation.mutate(selectedEventId)}
              className="bg-party-gradient-2 hover:bg-party-gradient-3 text-white font-bold py-3 px-8 rounded-full animate-neon-glow"
            >
              <Brain className="w-5 h-5 mr-2" />
              Generate Vibe Model
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}