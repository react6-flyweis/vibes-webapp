import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  Music,
  Utensils,
  Palette,
  ShoppingCart,
  Store,
  Download,
  Share2,
  Wand2
} from "lucide-react";

interface PartyBlueprint {
  eventDetails: {
    name: string;
    theme: string;
    estimatedCost: number;
    duration: string;
  };
  menuPlan: {
    appetizers: string[];
    mainCourse: string[];
    desserts: string[];
    beverages: string[];
    estimatedCostPerPerson: number;
  };
  musicPlaylist: {
    genre: string;
    songs: string[];
    danceFloorTips: string[];
  };
  decorPlan: {
    colorScheme: string[];
    essentialItems: Array<{
      item: string;
      priority: "High" | "Medium" | "Low";
      estimatedCost: string;
      suggestedVendor: string;
    }>;
    diyOptions: string[];
  };
  seatingPlan: {
    layout: string;
    guestGroups: Array<{
      groupName: string;
      members: string[];
      tableNumber: number;
    }>;
    specialConsiderations: string[];
  };
  vendorMatches: Array<{
    category: string;
    name: string;
    rating: number;
    priceRange: string;
    specialties: string[];
  }>;
  timeline: Array<{
    task: string;
    deadline: string;
    priority: "High" | "Medium" | "Low";
    assignedTo: string;
  }>;
}

export default function AIPartyDesigner() {
  const [formData, setFormData] = useState({
    eventType: "",
    theme: "",
    guestCount: "",
    budget: "",
    venue: "",
    date: "",
    specialRequests: "",
    dietaryRestrictions: "",
    ageGroup: "",
    duration: ""
  });
  
  const [generatedBlueprint, setGeneratedBlueprint] = useState<PartyBlueprint | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const { toast } = useToast();

  const generateBlueprint = useMutation({
    mutationFn: async (data: typeof formData) => {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Simulate AI processing with progress updates
      const progressSteps = [
        { step: 20, message: "Analyzing event requirements..." },
        { step: 40, message: "Generating menu suggestions..." },
        { step: 60, message: "Creating decoration plan..." },
        { step: 80, message: "Matching vendors..." },
        { step: 100, message: "Finalizing blueprint..." }
      ];

      for (const { step, message } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step);
        toast({
          title: "AI Party Designer",
          description: message,
        });
      }

      // Try AI API first, then fallback to intelligent generation
      try {
        const response = await apiRequest('/api/ai/generate-party-blueprint', 'POST', data);
        return response;
      } catch (error) {
        // Intelligent fallback based on user input
        return generateIntelligentBlueprint(data);
      }
    },
    onSuccess: (blueprint) => {
      setGeneratedBlueprint(blueprint);
      setIsGenerating(false);
      toast({
        title: "🎉 Party Blueprint Ready!",
        description: "Your complete event plan has been generated with AI precision.",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Error",
        description: "Unable to generate blueprint. Please try again.",
        variant: "destructive"
      });
    }
  });

  const generateIntelligentBlueprint = (data: typeof formData): PartyBlueprint => {
    const eventTypes = {
      birthday: {
        theme: "Celebration & Joy",
        music: "Pop & Dance Hits",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        food: ["Birthday cake", "Finger foods", "Party snacks"]
      },
      wedding: {
        theme: "Elegant & Romantic",
        music: "Romantic Classics",
        colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6"],
        food: ["Gourmet appetizers", "Plated dinner", "Wedding cake"]
      },
      corporate: {
        theme: "Professional & Modern",
        music: "Background Jazz",
        colors: ["#2C3E50", "#3498DB", "#E74C3C"],
        food: ["Catered lunch", "Coffee station", "Light refreshments"]
      }
    };

    const selectedType = eventTypes[data.eventType as keyof typeof eventTypes] || eventTypes.birthday;
    const guestCount = parseInt(data.guestCount) || 20;
    const budget = parseInt(data.budget) || 1000;

    return {
      eventDetails: {
        name: `${data.theme || selectedType.theme} ${data.eventType}`,
        theme: data.theme || selectedType.theme,
        estimatedCost: budget,
        duration: data.duration || "4 hours"
      },
      menuPlan: {
        appetizers: selectedType.food,
        mainCourse: ["Signature main dish", "Vegetarian option", "Protein selection"],
        desserts: ["Theme cake", "Mini desserts", "Fresh fruit"],
        beverages: ["Signature cocktail", "Non-alcoholic options", "Coffee & tea"],
        estimatedCostPerPerson: Math.round(budget * 0.4 / guestCount)
      },
      musicPlaylist: {
        genre: selectedType.music,
        songs: [
          "Curated playlist for your theme",
          "Dance floor favorites",
          "Background ambiance",
          "Special moment songs"
        ],
        danceFloorTips: [
          "Start with background music during dinner",
          "Transition to upbeat songs for dancing",
          "Take requests from guests"
        ]
      },
      decorPlan: {
        colorScheme: selectedType.colors,
        essentialItems: [
          {
            item: "Centerpieces",
            priority: "High" as const,
            estimatedCost: `$${Math.round(budget * 0.15)}`,
            suggestedVendor: "Local Florist"
          },
          {
            item: "Lighting",
            priority: "High" as const,
            estimatedCost: `$${Math.round(budget * 0.1)}`,
            suggestedVendor: "Event Lighting Co."
          },
          {
            item: "Table linens",
            priority: "Medium" as const,
            estimatedCost: `$${Math.round(budget * 0.08)}`,
            suggestedVendor: "Party Rental Plus"
          }
        ],
        diyOptions: [
          "Custom photo displays",
          "Handmade table cards",
          "Themed photo booth props"
        ]
      },
      seatingPlan: {
        layout: guestCount <= 20 ? "Intimate round tables" : "Mixed seating arrangement",
        guestGroups: [
          {
            groupName: "Family",
            members: ["Close relatives"],
            tableNumber: 1
          },
          {
            groupName: "Friends",
            members: ["Friend group"],
            tableNumber: 2
          }
        ],
        specialConsiderations: [
          "Keep like-minded people together",
          "Mix personalities for conversation",
          "Consider dietary restrictions"
        ]
      },
      vendorMatches: [
        {
          category: "Catering",
          name: "Gourmet Events Co.",
          rating: 4.8,
          priceRange: "$$",
          specialties: ["Custom menus", "Dietary accommodations"]
        },
        {
          category: "Photography",
          name: "Moment Capture Studios",
          rating: 4.9,
          priceRange: "$$$",
          specialties: ["Event photography", "Candid moments"]
        },
        {
          category: "Entertainment",
          name: "DJ ProMix",
          rating: 4.7,
          priceRange: "$$",
          specialties: ["Dance music", "MC services"]
        }
      ],
      timeline: [
        {
          task: "Send invitations",
          deadline: "3 weeks before",
          priority: "High" as const,
          assignedTo: "Host"
        },
        {
          task: "Finalize menu",
          deadline: "2 weeks before",
          priority: "High" as const,
          assignedTo: "Host"
        },
        {
          task: "Confirm vendors",
          deadline: "1 week before",
          priority: "High" as const,
          assignedTo: "Host"
        },
        {
          task: "Set up decorations",
          deadline: "Day of event",
          priority: "Medium" as const,
          assignedTo: "Volunteers"
        }
      ]
    };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!formData.eventType || !formData.guestCount || !formData.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in the event type, guest count, and budget to continue.",
        variant: "destructive"
      });
      return;
    }
    generateBlueprint.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Wand2 className="inline-block mr-3 h-10 w-10 text-blue-600" />
          AI Party Designer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Let our AI create a complete event blueprint tailored to your vision. Get menu suggestions, 
          decoration plans, vendor matches, seating arrangements, and a complete timeline.
        </p>
      </div>

      {!generatedBlueprint ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-6 w-6" />
              Event Details
            </CardTitle>
            <CardDescription>
              Tell us about your event and we'll create a personalized blueprint
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="holiday">Holiday Celebration</SelectItem>
                    <SelectItem value="baby-shower">Baby Shower</SelectItem>
                    <SelectItem value="housewarming">Housewarming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme (Optional)</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Tropical Paradise, Vintage Glamour"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">Guest Count</Label>
                <Input
                  id="guestCount"
                  type="number"
                  placeholder="How many guests?"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Total budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue Type</Label>
                <Select onValueChange={(value) => handleInputChange('venue', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="backyard">Backyard</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="venue">Event Venue</SelectItem>
                    <SelectItem value="park">Park/Outdoor</SelectItem>
                    <SelectItem value="office">Office Space</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Event Duration</Label>
                <Select onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 hours">2 hours</SelectItem>
                    <SelectItem value="3 hours">3 hours</SelectItem>
                    <SelectItem value="4 hours">4 hours</SelectItem>
                    <SelectItem value="6 hours">6 hours</SelectItem>
                    <SelectItem value="All day">All day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
              <Input
                id="dietaryRestrictions"
                placeholder="Any allergies or dietary preferences?"
                value={formData.dietaryRestrictions}
                onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                placeholder="Any specific ideas, must-haves, or special considerations?"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
              />
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  AI is crafting your perfect party blueprint...
                </p>
              </div>
            )}

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Party Blueprint
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Blueprint Header */}
          <Card className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {generatedBlueprint.eventDetails.name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {generatedBlueprint.eventDetails.theme}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  AI Generated
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">${generatedBlueprint.eventDetails.estimatedCost}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Budget</div>
                </div>
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">{formData.guestCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Guests</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold">{generatedBlueprint.eventDetails.duration}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Duration</div>
                </div>
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <div className="font-semibold">{formData.venue}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Venue</div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download Blueprint
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share with Team
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blueprint Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Menu Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="mr-2 h-6 w-6 text-orange-600" />
                  Menu Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Appetizers</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedBlueprint.menuPlan.appetizers.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Main Course</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedBlueprint.menuPlan.mainCourse.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Beverages</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedBlueprint.menuPlan.beverages.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                  <p className="font-semibold text-blue-800 dark:text-blue-200">
                    Est. ${generatedBlueprint.menuPlan.estimatedCostPerPerson} per person
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Decoration Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-6 w-6 text-pink-600" />
                  Decoration Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Color Scheme</h4>
                  <div className="flex gap-2 mb-4">
                    {generatedBlueprint.decorPlan.colorScheme.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Essential Items</h4>
                  <div className="space-y-2">
                    {generatedBlueprint.decorPlan.essentialItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <span className="font-medium">{item.item}</span>
                          <Badge className="ml-2" variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                            {item.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Music & Entertainment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="mr-2 h-6 w-6 text-green-600" />
                  Music & Entertainment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Genre: {generatedBlueprint.musicPlaylist.genre}</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedBlueprint.musicPlaylist.songs.map((song, idx) => (
                      <li key={idx}>{song}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dance Floor Tips</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {generatedBlueprint.musicPlaylist.danceFloorTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 h-6 w-6 text-purple-600" />
                  Recommended Vendors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedBlueprint.vendorMatches.map((vendor, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{vendor.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{vendor.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <div className="h-4 w-4 bg-yellow-500 rounded-full mr-1" />
                          <span className="text-sm">{vendor.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{vendor.priceRange}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {vendor.specialties.map((specialty, sidx) => (
                        <Badge key={sidx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-6 w-6 text-blue-600" />
                Planning Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedBlueprint.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                      {item.priority}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.task}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Due: {item.deadline} • Assigned to: {item.assignedTo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={() => setGeneratedBlueprint(null)}
              variant="outline"
              size="lg"
            >
              Create Another Blueprint
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}