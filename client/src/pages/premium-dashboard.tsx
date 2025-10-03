import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  TrendingUp, Users, Calendar, DollarSign, Star, Brain,
  Palette, Download, Mail, BarChart3, Crown, Zap
} from "lucide-react";
import { Check, ArrowRight } from "lucide-react";
import theme1 from '../../assests/theme1.png'
import theme2 from '../../assests/theme2.png'

const PremiumDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock analytics data (in production, fetch from API)
  const eventAnalytics = [
    { name: "Jan", events: 12, guests: 240, revenue: 1200 },
    { name: "Feb", events: 18, guests: 360, revenue: 1800 },
    { name: "Mar", events: 24, guests: 480, revenue: 2400 },
    { name: "Apr", events: 30, guests: 600, revenue: 3000 },
    { name: "May", events: 36, guests: 720, revenue: 3600 },
  ];

  interface Theme {
    name: string;
    description: string;
    category: string;
    colors: string[];
    features: string[];
    previewImg: string;
  }
  const themes: Theme[] = [
    {
      name: "Wedding Classic",
      description: "Lorem Ipsum is simply dummy text of the printing",
      category: "Wedding",
      colors: [
        "bg-linear-to-br from-yellow-400 to-yellow-200",
        "bg-purple-500",
        "bg-orange-500",
      ],
      features: [
        "RSVP Tracking",
        "Gift Registry Link",
        "Photo Sharing",
        "Music Requests",
      ],
      previewImg: theme1, // replace with your preview image
    },
    {
      name: "Wedding Classic",
      description: "Lorem Ipsum is simply dummy text of the printing",
      category: "Wedding",
      colors: [
        "bg-linear-to-br from-yellow-400 to-yellow-200",
        "bg-purple-500",
        "bg-orange-500",
      ],
      features: [
        "RSVP Tracking",
        "Gift Registry Link",
        "Photo Sharing",
        "Music Requests",
      ],
      previewImg: theme2, // replace with your preview image
    },
  ];


  const categoryData = [
    { name: "Birthday Parties", value: 45, color: "#3b82f6" },
    { name: "Corporate Events", value: 25, color: "#10b981" },
    { name: "Weddings", value: 20, color: "#f59e0b" },
    { name: "Other", value: 10, color: "#ef4444" },
  ];

  const aiSuggestions = [
    {
      category: "Food Pairing",
      suggestion: "Add Caesar salad to complement the Italian theme",
      confidence: 92,
      reasoning: "Guests who added pasta dishes often include salads for balance"
    },
    {
      category: "Drink Recommendation",
      suggestion: "Consider adding a signature cocktail with gin",
      confidence: 87,
      reasoning: "Based on guest preferences and seasonal trends"
    },
    {
      category: "Entertainment",
      suggestion: "Add background jazz playlist for dinner hour",
      confidence: 79,
      reasoning: "Similar events had 40% higher satisfaction with ambient music"
    }
  ];


  const cardClasses = "bg-white/10 text-slate-200 border-slate-700 backdrop-blur-xs";

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0F172A 0%, #581C87 50%, #0F172A 100%)",
      }}
    >

      {/* <Navigation /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Crown className="w-8 h-8 text-yellow-500 mr-3" />
              Premium Dashboard
            </h1>
            <p className="text-white mt-2">Advanced insights and premium features for your events</p>
          </div>
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Premium Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-slate-400">+20% from last month</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-slate-400">+15% from last month</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. RSVP Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-slate-400">+5% from last month</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-slate-400">Cost saving from premium tools</p>
            </CardContent>
          </Card>
        </div>


        {/* Premium Features Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white/10 text-slate-200  backdrop-blur-xs border-[#FFFFFF1A] border">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Premium Themes
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="exports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Tools
            </TabsTrigger>
          </TabsList>



          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Event Growth Trends</CardTitle>
                  <CardDescription className="text-white">
                    Monthly event and guest statistics
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={eventAnalytics}>
                      <CartesianGrid stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: "#fff" }} />
                      <YAxis tick={{ fill: "#fff" }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar dataKey="events" fill="#3b82f6" name="Events" />
                      <Bar dataKey="guests" fill="#10b981" name="Guests" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="text-white">Event Categories</CardTitle>
                  <CardDescription className="text-white">
                    Distribution of event types
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>

            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
                <CardDescription className="text-gray-300">
                  Key performance indicators for your events
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Guest Satisfaction</span>
                    <span className="text-gray-100">94%</span>
                  </div>
                  <Progress
                    value={94}
                    className="h-2 bg-slate-700 [&>div]:bg-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Menu Completion Rate</span>
                    <span className="text-gray-100">87%</span>
                  </div>
                  <Progress
                    value={87}
                    className="h-2 bg-slate-700 [&>div]:bg-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Task Completion</span>
                    <span className="text-gray-100">92%</span>
                  </div>
                  <Progress
                    value={92}
                    className="h-2 bg-slate-700 [&>div]:bg-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-200">Budget Accuracy</span>
                    <span className="text-gray-100">78%</span>
                  </div>
                  <Progress
                    value={78}
                    className="h-2 bg-slate-700 [&>div]:bg-yellow-500"
                  />
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className={`${cardClasses} text-white`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  AI-Powered Suggestions
                </CardTitle>
                <CardDescription className="text-gray-200">
                  Smart recommendations based on your event patterns and guest preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-4 border-gray-400">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-white border-white">
                        {suggestion.category}
                      </Badge>
                      <div className="flex items-center">
                        <span className="text-sm mr-2 text-gray-300">Confidence:</span>
                        <span className="font-semibold text-green-400">
                          {suggestion.confidence}%
                        </span>
                      </div>
                    </div>
                    <h4 className="font-medium mb-2">{suggestion.suggestion}</h4>
                    <p className="text-sm text-gray-300 mb-3">{suggestion.reasoning}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent border border-white text-white hover:bg-gray-800 hover:text-white"
                        disabled={
                          appliedSuggestions.includes(index) ||
                          dismissedSuggestions.includes(index)
                        }
                        onClick={() => {
                          setAppliedSuggestions([...appliedSuggestions, index]);
                          toast({
                            title: "Suggestion Applied",
                            description: `${suggestion.suggestion} has been added to your event.`,
                          });
                        }}
                      >
                        {appliedSuggestions.includes(index) ? "Applied" : "Apply Suggestion"}
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white"
                        disabled={
                          appliedSuggestions.includes(index) ||
                          dismissedSuggestions.includes(index)
                        }
                        onClick={() => {
                          setDismissedSuggestions([...dismissedSuggestions, index]);
                          toast({
                            title: "Suggestion Dismissed",
                            description:
                              "We'll learn from your preferences for future recommendations.",
                          });
                        }}
                      >
                        {dismissedSuggestions.includes(index) ? "Dismissed" : "Dismiss"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>


          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            <div className="relative w-full min-h-[650px] bg-white/10 text-slate-200  backdrop-blur-xs p-6">
              {/* Heading */}
              <h2 className="text-white text-2xl font-bold mb-1">Premium Themes</h2>
              <p className="text-slate-200 text-sm mb-8">
                Customize your events with professional theme and branding options
              </p>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {themes.map((theme, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden "
                  >
                    {/* Theme Preview */}
                    <img
                      src={theme.previewImg}
                      alt={theme.name}
                      className="w-full h-[500px] object-fit"
                    />

                    {/* Overlay Card */}
                    <div className="absolute bottom-0 left-1/2 h-[300px]  -translate-x-1/2 w-[90%] bg-black/40 backdrop-blur-md rounded-lg p-4">
                      <h3 className="text-white text-lg font-semibold">{theme.name}</h3>
                      <p className="text-gray-300 text-sm">{theme.description}</p>

                      {/* Category */}
                      <div className="border border-gray-400/50 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mt-3">
                        {theme.category}
                      </div>

                      {/* Colors */}
                      <div className="mt-3 flex flex-row items-center gap-2">
                        <span className="text-gray-300 text-xs">Colors: </span>
                        <div className="flex gap-2 mt-1">
                          {theme.colors.map((color, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full border border-gray-200 ${color}`}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mt-3">
                        <span className="text-gray-300 text-xs font-medium">
                          Features:
                        </span>
                        <div className="grid grid-cols-2 gap-y-2 mt-2">
                          {theme.features.map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center text-gray-300 text-xs"
                            >
                              <Check className="w-3 h-3 text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center justify-between mt-4 gap-2">
                        <button
                          onClick={() => setSelectedTheme(theme.name)}
                          className="flex items-center justify-center bg-blue-500 w-[277px] hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md"
                        >
                          {selectedTheme === theme.name ? " Preview" : "Preview"}
                        </button>
                        <button className="flex items-center justify-center bg-white text-black border px-4 py-2 rounded-md">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-blue-500" />
                    RSVP Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Auto-reminders</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Follow-up messages</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Thank you notes</span>
                    <Badge className="text-white" variant="outline">Setup Required</Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Automation Configured",
                        description: "RSVP automation settings have been updated successfully.",
                      });
                    }}
                  >
                    Configure Automation
                  </Button>
                </CardContent>
              </Card>

              <Card className={cardClasses}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Smart Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Low RSVP alerts</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Budget overrun warnings</span>
                    <Badge className="bg-green-500 text-white">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Task deadline alerts</span>
                    <Badge className="text-white" variant="outline">Setup Required</Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Notifications Updated",
                        description: "Smart notification preferences have been saved.",
                      });
                    }}
                  >
                    Manage Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tools Tab */}
          <TabsContent value="exports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={`${cardClasses} text-black`}>
                <CardHeader>
                  <CardTitle className="text-white">Export Options</CardTitle>
                  <CardDescription className="text-white">Download your event data in various formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const csvData = "Name,Email,RSVP Status\nJohn Doe,john@example.com,Confirmed\nJane Smith,jane@example.com,Pending";
                      const blob = new Blob([csvData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'guest-list.csv';
                      a.click();
                      toast({
                        title: "Export Complete",
                        description: "Guest list has been downloaded successfully.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Guest List (PDF/CSV)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const menuData = "Item,Contributor,Category\nBirthday Cake,Sarah Miller,Desserts\nPizza,Mike Johnson,Main Course";
                      const blob = new Blob([menuData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'menu-contributions.csv';
                      a.click();
                      toast({
                        title: "Export Complete",
                        description: "Menu and contributions data downloaded.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Menu & Contributions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const budgetData = "Category,Planned,Actual\nFood,$500,$450\nDecorations,$200,$180\nEntertainment,$300,$320";
                      const blob = new Blob([budgetData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'budget-report.csv';
                      a.click();
                      toast({
                        title: "Export Complete",
                        description: "Budget report has been downloaded.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Budget Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const scheduleData = "Time,Activity\n6:00 PM,Guest Arrival\n6:30 PM,Dinner Service\n8:00 PM,Entertainment\n10:00 PM,Event Conclusion";
                      const blob = new Blob([scheduleData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'event-schedule.csv';
                      a.click();
                      toast({
                        title: "Export Complete",
                        description: "Event schedule has been downloaded.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Event Schedule
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const analyticsData = "Month,Events,Guests,RSVP Rate\nJan,12,240,85%\nFeb,18,360,87%\nMar,24,480,89%";
                      const blob = new Blob([analyticsData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'analytics-report.csv';
                      a.click();
                      toast({
                        title: "Export Complete",
                        description: "Analytics report has been downloaded.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Analytics Report
                  </Button>
                </CardContent>
              </Card>

              <Card className={`${cardClasses} text-black`}>
                <CardHeader>
                  <CardTitle className="text-white">Print-Ready Templates</CardTitle>
                  <CardDescription className="text-white">Professional printables for your events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Welcome Signs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Menu Cards
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Place Cards
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Thank You Cards
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Event Timeline
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PremiumDashboard;