import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Users, 
  Music, 
  Heart, 
  Star,
  Zap,
  Camera,
  MessageCircle,
  Award,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VibeVerifiedGuests = () => {
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [userVibeScore, setUserVibeScore] = useState(420);
  const [userLevel, setUserLevel] = useState("Vibe Curator");
  const { toast } = useToast();

  const vibeCategories = [
    { 
      id: "hype-captain", 
      name: "Hype Captain", 
      icon: Zap, 
      color: "text-yellow-600", 
      description: "Gets the dance floor moving",
      requirements: "Get 5+ people dancing, boost energy by 20%"
    },
    { 
      id: "chill-connector", 
      name: "Chill Connector", 
      icon: Heart, 
      color: "text-pink-600", 
      description: "Introduces new friends",
      requirements: "Make 3+ successful introductions"
    },
    { 
      id: "vibe-curator", 
      name: "Vibe Curator", 
      icon: Music, 
      color: "text-purple-600", 
      description: "DJs and music curators",
      requirements: "Queue 5+ songs that get positive reactions"
    },
    { 
      id: "photo-master", 
      name: "Photo Master", 
      icon: Camera, 
      color: "text-blue-600", 
      description: "Captures perfect moments",
      requirements: "Take photos that get 10+ likes"
    },
    { 
      id: "conversation-starter", 
      name: "Conversation Starter", 
      icon: MessageCircle, 
      color: "text-green-600", 
      description: "Brings people together",
      requirements: "Start 5+ engaging conversations"
    }
  ];

  const topVibers = [
    {
      name: "Sarah Chen",
      score: 1250,
      badges: ["Hype Captain", "Photo Master"],
      level: "Vibe Legend",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      recentActivity: "Started epic dance circle at Mike's party"
    },
    {
      name: "Marcus Johnson",
      score: 980,
      badges: ["Vibe Curator", "Chill Connector"],
      level: "Vibe Master",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      recentActivity: "DJ'd surprise set that got everyone moving"
    },
    {
      name: "Emma Rodriguez",
      score: 875,
      badges: ["Conversation Starter", "Hype Captain"],
      level: "Vibe Expert",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      recentActivity: "Connected 8 new friendships in one night"
    },
    {
      name: "Alex Kim",
      score: 720,
      badges: ["Photo Master"],
      level: "Vibe Specialist",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      recentActivity: "Captured the perfect group shot"
    },
    {
      name: "Jordan Taylor",
      score: 650,
      badges: ["Chill Connector", "Conversation Starter"],
      level: "Vibe Specialist",
      avatar: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format",
      recentActivity: "Organized impromptu karaoke session"
    }
  ];

  const userBadges = [
    { name: "Vibe Curator", earned: true, date: "2 weeks ago" },
    { name: "Conversation Starter", earned: true, date: "1 month ago" },
    { name: "Hype Captain", earned: false, progress: 60 },
    { name: "Photo Master", earned: false, progress: 30 },
    { name: "Chill Connector", earned: false, progress: 80 }
  ];

  const recentEarnings = [
    { event: "Sarah's Birthday Party", badge: "Vibe Curator", points: 85, date: "2 days ago" },
    { event: "Weekend BBQ", badge: "Conversation Starter", points: 65, date: "1 week ago" },
    { event: "Game Night", badge: "Chill Connector", points: 50, date: "2 weeks ago" }
  ];

  const earnBadge = (badgeId: string) => {
    toast({
      title: "Badge Earned!",
      description: `Congratulations! You've unlocked the ${badgeId} badge.`,
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Trophy className="w-10 h-10 text-yellow-600 mr-4" />
                Vibe-Verified Guests
              </h1>
              <p className="text-gray-600 mt-2">Social reputation system that rewards great vibe contributors</p>
            </div>
            <div className="text-right">
              <Badge className="bg-yellow-600 text-white px-4 py-2 mb-2">
                <Star className="w-4 h-4 mr-2" />
                {userLevel}
              </Badge>
              <div className="text-2xl font-bold text-yellow-600">{userVibeScore} VP</div>
              <p className="text-sm text-gray-600">Vibe Points</p>
            </div>
          </div>

          {/* User Profile Card */}
          <Card className="mb-6 bg-linear-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format" />
                    <AvatarFallback>DU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">Demo User</h2>
                    <p className="opacity-90">{userLevel} • {userVibeScore} Vibe Points</p>
                    <div className="flex items-center mt-2">
                      {userBadges.filter(b => b.earned).map((badge, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 bg-white/20 text-white">
                          {badge.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-2">Next Level: Vibe Master</div>
                  <Progress value={75} className="w-32 h-2" />
                  <div className="text-xs opacity-75 mt-1">75% to next level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badge System
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Vibe Contributors</CardTitle>
                <CardDescription>Hall of fame for the best party contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVibers.map((vibe, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 font-bold">
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={vibe.avatar} />
                          <AvatarFallback>{vibe.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{vibe.name}</h4>
                          <p className="text-sm text-gray-600">{vibe.recentActivity}</p>
                          <div className="flex space-x-1 mt-1">
                            {vibe.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-600">{vibe.score} VP</div>
                        <div className="text-sm text-gray-600">{vibe.level}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badge System */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBadges.map((badge, index) => (
                <Card key={index} className={`${badge.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      {badge.earned ? (
                        <Badge className="bg-green-600 text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Earned
                        </Badge>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {badge.earned ? (
                      <div>
                        <p className="text-sm text-green-600 font-medium">Earned {badge.date}</p>
                        <p className="text-xs text-gray-600 mt-1">Keep up the great vibes!</p>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{badge.progress}%</span>
                          </div>
                          <Progress value={badge.progress} className="mt-1" />
                        </div>
                        <p className="text-xs text-gray-600">
                          {vibeCategories.find(c => c.name === badge.name)?.requirements}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Badge Benefits</CardTitle>
                <CardDescription>Unlock exclusive perks with your achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Hype Captain Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Priority playlist requests</li>
                      <li>• Exclusive DJ booth access</li>
                      <li>• VIP party invitations</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Vibe Curator Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Music curation privileges</li>
                      <li>• Host collaboration invites</li>
                      <li>• Sound system access</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Chill Connector Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Guest matchmaking tools</li>
                      <li>• Introduction credits</li>
                      <li>• Social analytics dashboard</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Photo Master Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Professional photo features</li>
                      <li>• Memory book creation</li>
                      <li>• Enhanced sharing options</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Point Earnings</CardTitle>
                <CardDescription>Your latest vibe contributions and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEarnings.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{earning.event}</h4>
                        <p className="text-sm text-gray-600">{earning.badge} badge activity</p>
                        <p className="text-xs text-gray-500">{earning.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">+{earning.points} VP</div>
                        <Badge variant="outline" className="text-xs">
                          {earning.badge}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">150 VP</div>
                  <p className="text-sm text-gray-600">Points earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">520 VP</div>
                  <p className="text-sm text-gray-600">Points earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">All Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">1,250 VP</div>
                  <p className="text-sm text-gray-600">Total points</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vibeCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <category.icon className={`w-8 h-8 ${category.color}`} />
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-sm mb-1">Requirements:</h4>
                        <p className="text-sm text-gray-600">{category.requirements}</p>
                      </div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => earnBadge(category.name)}
                      >
                        View Achievement Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VibeVerifiedGuests;