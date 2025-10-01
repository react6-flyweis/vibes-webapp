import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Leaf,
  Recycle,
  TreePine,
  Droplets,
  Car,
  Award,
  TrendingDown,
  MapPin,
  ShoppingCart,
  Users,
  Calculator,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface SustainabilityMetrics {
  carbonFootprint: number;
  wasteGenerated: number;
  waterUsage: number;
  localSourcing: number;
  recyclingRate: number;
  sustainabilityScore: number;
  grade: string;
  improvements: string[];
}

interface EcoChoice {
  category: string;
  option: string;
  impact: number;
  carbonSaved: number;
  description: string;
  isSelected: boolean;
}

interface EcoVendor {
  id: string;
  name: string;
  category: string;
  sustainabilityRating: number;
  certifications: string[];
  localDistance: number;
  priceRange: string;
  ecoFeatures: string[];
}

export default function SustainabilityTracker() {
  const [eventDetails, setEventDetails] = useState({
    guestCount: 50,
    venue: "outdoor",
    catering: "local",
    decorations: "reusable",
    transportation: "carpooling"
  });

  const [sustainabilityMetrics, setSustainabilityMetrics] = useState<SustainabilityMetrics>({
    carbonFootprint: 2.3,
    wasteGenerated: 15.2,
    waterUsage: 125,
    localSourcing: 78,
    recyclingRate: 85,
    sustainabilityScore: 82,
    grade: "B+",
    improvements: [
      "Switch to 100% renewable energy venue",
      "Increase local vendor usage to 90%",
      "Implement zero-waste catering options"
    ]
  });

  const [ecoChoices, setEcoChoices] = useState<EcoChoice[]>([
    {
      category: "Catering",
      option: "Local organic menu",
      impact: 35,
      carbonSaved: 1.2,
      description: "Sourced within 50 miles, organic ingredients",
      isSelected: true
    },
    {
      category: "Decorations",
      option: "Potted plants instead of cut flowers",
      impact: 25,
      carbonSaved: 0.8,
      description: "Guests can take plants home after event",
      isSelected: true
    },
    {
      category: "Transportation",
      option: "Encourage carpooling",
      impact: 40,
      carbonSaved: 2.1,
      description: "Coordinate ride-sharing among guests",
      isSelected: false
    },
    {
      category: "Waste",
      option: "Compostable plates and utensils",
      impact: 30,
      carbonSaved: 0.9,
      description: "100% biodegradable serving materials",
      isSelected: true
    }
  ]);

  const [ecoVendors, setEcoVendors] = useState<EcoVendor[]>([
    {
      id: "1",
      name: "Green Earth Catering",
      category: "Catering",
      sustainabilityRating: 9.2,
      certifications: ["Organic Certified", "Carbon Neutral", "Zero Waste"],
      localDistance: 12,
      priceRange: "$$",
      ecoFeatures: ["Local sourcing", "Compostable packaging", "Plant-based options"]
    },
    {
      id: "2",
      name: "EcoFlower Arrangements",
      category: "Decorations",
      sustainabilityRating: 8.8,
      certifications: ["Fair Trade", "Locally Grown"],
      localDistance: 8,
      priceRange: "$",
      ecoFeatures: ["Seasonal flowers", "Reusable containers", "No foam"]
    },
    {
      id: "3",
      name: "Solar Sound Systems",
      category: "Entertainment",
      sustainabilityRating: 9.5,
      certifications: ["Renewable Energy", "Green Business"],
      localDistance: 25,
      priceRange: "$$",
      ecoFeatures: ["Solar powered", "LED lighting", "Minimal transport"]
    }
  ]);

  const { toast } = useToast();

  const calculateImpact = useMutation({
    mutationFn: async (choices: EcoChoice[]) => {
      try {
        const response = await apiRequest('/api/sustainability/calculate', 'POST', {
          eventDetails,
          ecoChoices: choices,
          guestCount: eventDetails.guestCount
        });
        return response;
      } catch (error) {
        return calculateSustainabilityMetrics(choices);
      }
    },
    onSuccess: (metrics) => {
      setSustainabilityMetrics(metrics);
      toast({
        title: "Impact Calculated",
        description: "Your sustainability metrics have been updated.",
      });
    }
  });

  const calculateSustainabilityMetrics = (choices: EcoChoice[]): SustainabilityMetrics => {
    const selectedChoices = choices.filter(c => c.isSelected);
    const totalImpact = selectedChoices.reduce((sum, choice) => sum + choice.impact, 0);
    const totalCarbonSaved = selectedChoices.reduce((sum, choice) => sum + choice.carbonSaved, 0);
    
    const baseFootprint = eventDetails.guestCount * 0.08;
    const carbonFootprint = Math.max(0.5, baseFootprint - totalCarbonSaved);
    
    const sustainabilityScore = Math.min(100, 50 + totalImpact);
    const grade = sustainabilityScore >= 90 ? "A" : 
                 sustainabilityScore >= 80 ? "B+" :
                 sustainabilityScore >= 70 ? "B" :
                 sustainabilityScore >= 60 ? "C+" : "C";

    return {
      carbonFootprint,
      wasteGenerated: Math.max(5, 20 - (totalImpact * 0.2)),
      waterUsage: Math.max(50, 150 - (totalImpact * 1.5)),
      localSourcing: Math.min(100, 60 + (totalImpact * 0.5)),
      recyclingRate: Math.min(100, 70 + (totalImpact * 0.4)),
      sustainabilityScore,
      grade,
      improvements: [
        "Consider renewable energy options",
        "Increase local vendor partnerships",
        "Implement water conservation measures"
      ]
    };
  };

  const toggleEcoChoice = (index: number) => {
    const newChoices = [...ecoChoices];
    newChoices[index].isSelected = !newChoices[index].isSelected;
    setEcoChoices(newChoices);
    calculateImpact.mutate(newChoices);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-100";
      case "B+": return "text-blue-600 bg-blue-100";
      case "B": return "text-yellow-600 bg-yellow-100";
      default: return "text-orange-600 bg-orange-100";
    }
  };

  const getImpactIcon = (category: string) => {
    switch (category) {
      case "Catering": return <ShoppingCart className="h-5 w-5" />;
      case "Decorations": return <TreePine className="h-5 w-5" />;
      case "Transportation": return <Car className="h-5 w-5" />;
      case "Waste": return <Recycle className="h-5 w-5" />;
      default: return <Leaf className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Leaf className="inline-block mr-3 h-10 w-10 text-green-600" />
          Sustainability Tracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Track your event's environmental impact and discover eco-friendly options. 
          Make informed choices that create memorable experiences while protecting our planet.
        </p>
      </div>

      {/* Sustainability Score Overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getGradeColor(sustainabilityMetrics.grade)}`}>
                {sustainabilityMetrics.grade}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">Sustainability Grade</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{sustainabilityMetrics.sustainabilityScore}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Eco Score</div>
              <Progress value={sustainabilityMetrics.sustainabilityScore} className="mt-2" />
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sustainabilityMetrics.carbonFootprint} kg</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">CO₂ per guest</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{sustainabilityMetrics.localSourcing}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Local sourcing</div>
            </div>

            <div className="text-center">
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Award className="h-4 w-4 mr-1" />
                Green Event Badge
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Event Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-6 w-6" />
                Event Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Guest Count</Label>
                  <Input
                    type="number"
                    value={eventDetails.guestCount}
                    onChange={(e) => {
                      const newDetails = { ...eventDetails, guestCount: parseInt(e.target.value) || 0 };
                      setEventDetails(newDetails);
                      calculateImpact.mutate(ecoChoices);
                    }}
                  />
                </div>
                <div>
                  <Label>Venue Type</Label>
                  <Select value={eventDetails.venue} onValueChange={(value) => {
                    const newDetails = { ...eventDetails, venue: value };
                    setEventDetails(newDetails);
                    calculateImpact.mutate(ecoChoices);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eco Choices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6" />
                Sustainable Choices
              </CardTitle>
              <CardDescription>
                Select eco-friendly options to improve your sustainability score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ecoChoices.map((choice, index) => (
                <div key={index} className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  choice.isSelected ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 hover:border-gray-300'
                }`} onClick={() => toggleEcoChoice(index)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getImpactIcon(choice.category)}
                      <div>
                        <h4 className="font-semibold">{choice.option}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {choice.description}
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            -{choice.carbonSaved} kg CO₂
                          </Badge>
                          <Badge variant="outline">
                            +{choice.impact} points
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      choice.isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {choice.isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="mr-2 h-6 w-6" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{sustainabilityMetrics.waterUsage}L</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Water usage</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Recycle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{sustainabilityMetrics.wasteGenerated} kg</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Waste generated</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Recycling Rate</span>
                    <span>{sustainabilityMetrics.recyclingRate}%</span>
                  </div>
                  <Progress value={sustainabilityMetrics.recyclingRate} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Local Sourcing</span>
                    <span>{sustainabilityMetrics.localSourcing}%</span>
                  </div>
                  <Progress value={sustainabilityMetrics.localSourcing} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Eco Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="mr-2 h-6 w-6" />
                Eco-Friendly Vendors
              </CardTitle>
              <CardDescription>
                Verified sustainable partners in your area
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ecoVendors.map((vendor) => (
                <div key={vendor.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{vendor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{vendor.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold">{vendor.sustainabilityRating}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{vendor.localDistance} miles</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {vendor.certifications.map((cert, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-1">
                    {vendor.ecoFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Contact Vendor
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvement Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-6 w-6" />
                Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sustainabilityMetrics.improvements.map((improvement, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <span className="text-sm">{improvement}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Carbon Offset Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="mr-2 h-6 w-6" />
                Carbon Offset
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${(sustainabilityMetrics.carbonFootprint * eventDetails.guestCount * 0.05).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Cost to offset your event's carbon footprint
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Purchase Carbon Credits
                </Button>
              </div>
              
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p>• Funds reforestation projects</p>
                <p>• Supports renewable energy initiatives</p>
                <p>• Verified by international standards</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}