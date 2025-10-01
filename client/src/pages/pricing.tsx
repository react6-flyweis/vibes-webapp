import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Building, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubscribe = (tier: string) => {
    if (tier === 'free') return;
    setLocation(`/checkout?plan=${tier}`);
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for small gatherings",
      features: [
        "Up to 20 guests",
        "Basic menu creation",
        "Guest contributions",
        "Simple RSVP tracking",
        "Basic themes",
        "Email support"
      ],
      limitations: [
        "No AI suggestions",
        "Limited analytics",
        "No custom branding"
      ],
      buttonText: "Current Plan",
      isPopular: false,
      tier: "free"
    },
    {
      name: "Premium",
      price: "$8.99",
      period: "month",
      description: "For hosts who want it all",
      features: [
        "Unlimited guests",
        "AI menu suggestions & pairings",
        "Custom themes & branding",
        "Advanced RSVP tracking",
        "Auto reminders",
        "Downloadable event sheets",
        "Advanced analytics",
        "Priority support",
        "Event templates",
        "Music playlist integration"
      ],
      buttonText: "Upgrade to Premium",
      isPopular: true,
      tier: "premium"
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "month",
      description: "For teams and organizations",
      features: [
        "Everything in Premium",
        "White-label branding",
        "API access",
        "Team management",
        "Corporate dashboard",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced security",
        "SSO integration",
        "Custom contracts"
      ],
      buttonText: "Contact Sales",
      isPopular: false,
      tier: "enterprise"
    }
  ];

  const addOns = [
    {
      name: "Guest Pack +10",
      price: "$2.00",
      description: "Add 10 more guests to any event"
    },
    {
      name: "Premium Templates",
      price: "$1.99",
      description: "Seasonal and themed invitation designs"
    },
    {
      name: "Host Tools Pack",
      price: "$4.99",
      description: "Music playlists, trivia builder, scavenger hunt generator"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as your events grow. Unlock premium features to create unforgettable experiences.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.isPopular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  {plan.tier === 'free' && <Zap className="w-6 h-6 text-gray-500 mr-2" />}
                  {plan.tier === 'premium' && <Crown className="w-6 h-6 text-blue-500 mr-2" />}
                  {plan.tier === 'enterprise' && <Building className="w-6 h-6 text-purple-500 mr-2" />}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                </div>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price}
                  <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                </div>
                <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full mt-6 ${plan.isPopular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  variant={plan.isPopular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={plan.tier === 'free'}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Event Add-ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">{addon.price}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{addon.description}</p>
                  <Button variant="outline" className="w-full">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Building className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise Solutions</h2>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Need a custom solution for your organization? We offer white-label licensing, 
            API access, and enterprise features for event planners, wedding coordinators, 
            and corporate teams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$99-$499</div>
              <div className="text-gray-600">Monthly licensing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Custom</div>
              <div className="text-gray-600">Branding options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">API</div>
              <div className="text-gray-600">Full integration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-gray-600">Priority support</div>
            </div>
          </div>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Schedule Demo
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I access premium features?</h3>
              <p className="text-gray-600">Premium features will be available soon! Currently, you can enjoy all our free features without any limitations.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Our free plan is permanent! Upgrade to premium anytime to unlock advanced features.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer discounts?</h3>
              <p className="text-gray-600">Yes! Save 17% with annual billing, and we offer special rates for nonprofits and students.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;