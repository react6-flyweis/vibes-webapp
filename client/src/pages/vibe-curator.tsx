import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Music, 
  Clock, 
  Users, 
  Wine, 
  Lightbulb,
  TrendingUp,
  Sparkles,
  Heart,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VibeCurator = () => {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [curatorLevel, setCuratorLevel] = useState(3);
  const [personalityProfile, setPersonalityProfile] = useState({
    energy: 78,
    social: 85,
    creative: 92,
    organized: 67
  });
  const { toast } = useToast();

  const vibeInsights = [
    {
      type: "timing",
      title: "Optimal Party Start Time",
      suggestion: "7:30 PM - Based on your guest demographics and past events",
      confidence: 94,
      reasoning: "Your guests typically arrive fashionably late, and energy peaks around 8:30 PM",
      icon: Clock,
      action: "Apply to Event"
    },
    {
      type: "music",
      title: "Dynamic Playlist Strategy",
      suggestion: "Start with Lo-Fi House, transition to Tech House by 9 PM",
      confidence: 89,
      reasoning: "Your crowd responds well to gradual energy build-up",
      icon: Music,
      action: "Generate Playlist"
    },
    {
      type: "engagement",
      title: "Guest Connection Opportunity",
      suggestion: "Introduce Sarah and Mike - both love indie music and travel",
      confidence: 92,
      reasoning: "Similar interests detected from social profiles and past interactions",
      icon: Users,
      action: "Send Introduction"
    },
    {
      type: "drinks",
      title: "Signature Cocktail Pairing",
      suggestion: "Cucumber Gin Fizz with your Mediterranean menu",
      confidence: 87,
      reasoning: "Flavor profile analysis suggests perfect complement to your planned appetizers",
      icon: Wine,
      action: "Add to Menu"
    }
  ];

  const learningInsights = [
    { metric: "Music Taste Analysis", progress: 92, description: "Learned from 24 events" },
    { metric: "Guest Preference Mapping", progress: 78, description: "15 regular attendees profiled" },
    { metric: "Timing Optimization", progress: 85, description: "Peak engagement patterns identified" },
    { metric: "Vibe Flow Prediction", progress: 67, description: "Energy transition modeling active" }
  ];

  const applySuggestion = (suggestion: any) => {
    toast({
      title: "Suggestion Applied",
      description: `${suggestion.title} has been implemented in your event planning.`,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Brain className="w-10 h-10 text-purple-600 mr-4" />
                AI Vibe Curator
              </h1>
              <p className="text-gray-600 mt-2">Your personal party strategist that learns and evolves with every event</p>
            </div>
            <div className="text-right">
              <Badge className="bg-purple-600 text-white px-4 py-2 mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Curator Level {curatorLevel}
              </Badge>
              <p className="text-sm text-gray-600">Learned from 24 events</p>
            </div>
          </div>

          {/* Personality Profile */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Your Party Personality Profile
              </CardTitle>
              <CardDescription>AI-analyzed hosting style based on your event history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{personalityProfile.energy}%</div>
                  <div className="text-sm text-gray-600">High Energy</div>
                  <Progress value={personalityProfile.energy} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{personalityProfile.social}%</div>
                  <div className="text-sm text-gray-600">Social Connector</div>
                  <Progress value={personalityProfile.social} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{personalityProfile.creative}%</div>
                  <div className="text-sm text-gray-600">Creative Curator</div>
                  <Progress value={personalityProfile.creative} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{personalityProfile.organized}%</div>
                  <div className="text-sm text-gray-600">Strategic Planner</div>
                  <Progress value={personalityProfile.organized} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Live Suggestions
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Learning Progress
            </TabsTrigger>
            <TabsTrigger value="evolution" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Curator Evolution
            </TabsTrigger>
          </TabsList>

          {/* Live Suggestions */}
          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid gap-6">
              {vibeInsights.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <insight.icon className="w-6 h-6 text-purple-600 mr-3" />
                        <div>
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {insight.confidence}% Confidence
                          </Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => applySuggestion(insight)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {insight.action}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendation:</h4>
                      <p className="text-gray-700">{insight.suggestion}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">AI Reasoning:</h4>
                      <p className="text-gray-600 text-sm">{insight.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Progress */}
          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Learning Analytics</CardTitle>
                <CardDescription>How the Vibe Curator understands your style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {learningInsights.map((insight, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{insight.metric}</span>
                      <span className="text-sm text-gray-600">{insight.progress}%</span>
                    </div>
                    <Progress value={insight.progress} className="h-3" />
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Learning Events</CardTitle>
                <CardDescription>Key insights gained from your latest parties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold">Sarah's Birthday Party</h4>
                    <p className="text-sm text-gray-600">Learned: Your guests prefer interactive games during dinner</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">Game Night Gathering</h4>
                    <p className="text-sm text-gray-600">Learned: Low-key lighting increases engagement by 40%</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">Weekend BBQ</h4>
                    <p className="text-sm text-gray-600">Learned: Your crowd loves collaborative playlist building</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curator Evolution */}
          <TabsContent value="evolution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Curator Level Progression</CardTitle>
                <CardDescription>Unlock new features as your AI learns more about your style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <h4 className="font-semibold text-green-800">Level 3 - Social Strategist</h4>
                      <p className="text-sm text-green-600">Current Level - Guest matching and mood prediction active</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Unlocked</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-semibold text-blue-800">Level 4 - Vibe Master</h4>
                      <p className="text-sm text-blue-600">Next: Advanced environment control and predictive analytics</p>
                      <Progress value={67} className="mt-2 w-32" />
                    </div>
                    <Badge variant="outline">3 events to unlock</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-semibold text-gray-800">Level 5 - Party Oracle</h4>
                      <p className="text-sm text-gray-600">Future: Cross-event learning and global vibe insights</p>
                    </div>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VibeCurator;