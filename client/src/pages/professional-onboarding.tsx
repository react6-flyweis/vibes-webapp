import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, Users, CheckCircle, ArrowRight, Star, 
  Globe, Shield, Zap, Crown, Target, Sparkles,
  Calendar, BarChart3, Award, Palette
} from "lucide-react";

export default function ProfessionalOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: "",
    companyName: "",
    website: "",
    teamSize: "",
    monthlyEvents: "",
    targetMarkets: [],
    services: [],
    branding: {
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      logo: "",
      companyDescription: ""
    },
    integrations: [],
    plan: "professional"
  });
  const { toast } = useToast();

  const onboardingMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/professional/onboard", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Professional account created successfully!" });
      window.location.href = "/professional-tools";
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create account", variant: "destructive" });
    },
  });

  const steps = [
    { id: 1, title: "Business Info", icon: Building2 },
    { id: 2, title: "Services", icon: Users },
    { id: 3, title: "Branding", icon: Palette },
    { id: 4, title: "Plan Selection", icon: Crown },
    { id: 5, title: "Setup Complete", icon: CheckCircle }
  ];

  const businessTypes = [
    "Event Planning Agency",
    "Wedding Planner",
    "Corporate Event Manager",
    "Venue Manager",
    "Catering Company",
    "Entertainment Agency",
    "Non-Profit Organization",
    "Other"
  ];

  const serviceOptions = [
    "Event Planning & Coordination",
    "Venue Management",
    "Catering Services",
    "Entertainment Booking",
    "Photography & Videography",
    "Floral & Decoration",
    "Audio/Visual Services",
    "Transportation",
    "Security Services",
    "Marketing & Promotion"
  ];

  const targetMarkets = [
    "Corporate Events",
    "Weddings",
    "Social Celebrations",
    "Conferences & Trade Shows",
    "Non-Profit Fundraisers",
    "Government Events",
    "Educational Events",
    "Entertainment & Concerts"
  ];

  const integrationOptions = [
    { name: "Salesforce CRM", description: "Sync customer data and leads" },
    { name: "QuickBooks", description: "Financial tracking and invoicing" },
    { name: "Mailchimp", description: "Email marketing automation" },
    { name: "Zoom", description: "Virtual event integration" },
    { name: "Google Workspace", description: "Calendar and document sync" },
    { name: "Slack", description: "Team communication" }
  ];

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter Pro",
      price: "$99",
      period: "/month",
      features: [
        "Up to 10 events per month",
        "Basic guest analytics",
        "Standard white-label dashboard",
        "Email support",
        "5% booking commission"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: "$299", 
      period: "/month",
      features: [
        "Up to 50 events per month",
        "Advanced AI guest analytics", 
        "Custom white-label branding",
        "NFT loyalty program access",
        "Priority support",
        "3% booking commission"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$999",
      period: "/month",
      features: [
        "Unlimited events",
        "Full AI analytics suite",
        "Complete white-label customization",
        "Advanced NFT loyalty features",
        "Dedicated account manager",
        "1% booking commission"
      ],
      popular: false
    }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onboardingMutation.mutate(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBranding = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        [field]: value
      }
    }));
  };

  const toggleArrayItem = (array: string[], item: string) => {
    const currentArray = formData[array as keyof typeof formData] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateFormData(array, newArray);
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Professional Onboarding
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Set up your professional event management platform in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            Step {currentStep} of 5: {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-xs">
            <CardContent className="p-8">
              {/* Step 1: Business Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Tell us about your business
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Help us customize the platform to your needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => updateFormData("companyName", e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website"
                        value={formData.website}
                        onChange={(e) => updateFormData("website", e.target.value)}
                        placeholder="https://yourcompany.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Select value={formData.teamSize} onValueChange={(value) => updateFormData("teamSize", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Just me</SelectItem>
                          <SelectItem value="2-5">2-5 people</SelectItem>
                          <SelectItem value="6-20">6-20 people</SelectItem>
                          <SelectItem value="21-50">21-50 people</SelectItem>
                          <SelectItem value="50+">50+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="monthlyEvents">Monthly Events</Label>
                      <Select value={formData.monthlyEvents} onValueChange={(value) => updateFormData("monthlyEvents", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How many events do you manage per month?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 events</SelectItem>
                          <SelectItem value="6-15">6-15 events</SelectItem>
                          <SelectItem value="16-30">16-30 events</SelectItem>
                          <SelectItem value="31-50">31-50 events</SelectItem>
                          <SelectItem value="50+">50+ events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Target Markets</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {targetMarkets.map((market) => (
                        <div key={market} className="flex items-center space-x-2">
                          <Checkbox 
                            id={market}
                            checked={formData.targetMarkets.includes(market)}
                            onCheckedChange={() => toggleArrayItem("targetMarkets", market)}
                          />
                          <Label htmlFor={market} className="text-sm">{market}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Services */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      What services do you offer?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select all services that apply to your business
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceOptions.map((service) => (
                      <Card key={service} className={`cursor-pointer transition-all ${
                        formData.services.includes(service)
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                      }`} onClick={() => toggleArrayItem("services", service)}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              checked={formData.services.includes(service)}
                              readOnly
                            />
                            <span className="font-medium">{service}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div>
                    <Label>Preferred Integrations</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      {integrationOptions.map((integration) => (
                        <Card key={integration.name} className={`cursor-pointer transition-all ${
                          formData.integrations.includes(integration.name)
                            ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
                        }`} onClick={() => toggleArrayItem("integrations", integration.name)}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox 
                                checked={formData.integrations.includes(integration.name)}
                                readOnly
                              />
                              <div>
                                <p className="font-medium">{integration.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{integration.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Branding */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Customize your brand
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Set up your white-label dashboard appearance
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Input 
                          type="color"
                          value={formData.branding.primaryColor}
                          onChange={(e) => updateBranding("primaryColor", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={formData.branding.primaryColor}
                          onChange={(e) => updateBranding("primaryColor", e.target.value)}
                          placeholder="#6366f1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Input 
                          type="color"
                          value={formData.branding.secondaryColor}
                          onChange={(e) => updateBranding("secondaryColor", e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input 
                          value={formData.branding.secondaryColor}
                          onChange={(e) => updateBranding("secondaryColor", e.target.value)}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="companyDescription">Company Description</Label>
                      <Textarea 
                        id="companyDescription"
                        value={formData.branding.companyDescription}
                        onChange={(e) => updateBranding("companyDescription", e.target.value)}
                        placeholder="Brief description of your company for client-facing dashboards"
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="border rounded-lg p-6" style={{ 
                    borderColor: formData.branding.primaryColor,
                    background: `linear-gradient(135deg, ${formData.branding.primaryColor}10, ${formData.branding.secondaryColor}10)`
                  }}>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: formData.branding.primaryColor }}>
                      Dashboard Preview
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {formData.branding.companyDescription || "Your company description will appear here"}
                    </p>
                    <Button style={{ backgroundColor: formData.branding.primaryColor }}>
                      Sample Button
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Plan Selection */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Choose your plan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Select the plan that best fits your business needs
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {pricingPlans.map((plan) => (
                      <Card key={plan.id} className={`cursor-pointer transition-all relative ${
                        formData.plan === plan.id
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'hover:shadow-lg'
                      } ${plan.popular ? 'scale-105' : ''}`} 
                      onClick={() => updateFormData("plan", plan.id)}>
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-linear-to-r from-purple-600 to-blue-600">
                              Most Popular
                            </Badge>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline justify-center gap-1 mt-2">
                              <span className="text-3xl font-bold">{plan.price}</span>
                              <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                            </div>
                          </div>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 5 && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Setup Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your professional event management platform is ready to use
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {[
                      { icon: BarChart3, title: "Analytics Dashboard", description: "AI-powered insights" },
                      { icon: Palette, title: "White-Label Branding", description: "Custom client portals" },
                      { icon: Award, title: "NFT Loyalty Program", description: "Blockchain-verified rewards" },
                      { icon: Users, title: "Client Management", description: "Professional tools" }
                    ].map((feature, index) => (
                      <Card key={index} className="p-4">
                        <feature.icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-center">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-1">
                          {feature.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  Previous
                </Button>
                
                {currentStep === 5 ? (
                  <Button 
                    onClick={handleSubmit}
                    disabled={onboardingMutation.isPending}
                    className="bg-linear-to-r from-purple-600 to-blue-600 flex items-center gap-2"
                  >
                    {onboardingMutation.isPending ? "Setting up..." : "Get Started"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNext}
                    className="bg-linear-to-r from-purple-600 to-blue-600 flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}