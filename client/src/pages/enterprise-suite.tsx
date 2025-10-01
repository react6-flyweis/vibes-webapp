import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  Calendar, 
  BarChart3, 
  Shield, 
  Zap, 
  Crown,
  TrendingUp,
  Target,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Briefcase,
  Settings,
  Lock,
  Database,
  Headphones,
  Palette
} from "lucide-react";
import { Link } from "wouter";

export default function EnterpriseSuite() {
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const enterpriseFeatures = [
    {
      category: "Corporate Event Management",
      icon: Building2,
      features: [
        {
          name: "Corporate Dashboard",
          description: "Comprehensive analytics and management for enterprise events",
          path: "/corporate-dashboard",
          tier: "enterprise"
        },
        {
          name: "Professional Tools",
          description: "Advanced planning tools for professional event managers",
          path: "/professional-tools",
          tier: "professional"
        },
        {
          name: "Professional Onboarding",
          description: "Streamlined onboarding for enterprise teams",
          path: "/professional-onboarding",
          tier: "professional"
        }
      ]
    },
    {
      category: "Vendor & Marketplace Solutions",
      icon: Briefcase,
      features: [
        {
          name: "Vendor Dashboard",
          description: "Complete vendor management and performance tracking",
          path: "/vendor-dashboard",
          tier: "professional"
        },
        {
          name: "Vendor Marketplace",
          description: "Curated marketplace for enterprise-grade vendors",
          path: "/vendors",
          tier: "professional"
        },
        {
          name: "Vendor Onboarding",
          description: "Professional vendor registration and verification",
          path: "/vendor-onboarding",
          tier: "enterprise"
        },
        {
          name: "Enhanced Staffing Marketplace",
          description: "Premium staffing solutions for large events",
          path: "/staffing-marketplace",
          tier: "enterprise"
        },
        {
          name: "Catering Marketplace",
          description: "Enterprise catering solutions and management",
          path: "/catering-marketplace",
          tier: "professional"
        },
        {
          name: "Vendor Liquidity Solutions",
          description: "Financial solutions for vendor partnerships",
          path: "/vendor-liquidity",
          tier: "enterprise"
        }
      ]
    },
    {
      category: "Advanced Technology Platform",
      icon: Zap,
      features: [
        {
          name: "AI Party Designer",
          description: "Advanced AI-powered event design and planning",
          path: "/ai-party-designer",
          tier: "enterprise"
        },
        {
          name: "AI Theme Generator",
          description: "Intelligent theme creation for corporate events",
          path: "/ai-theme-generator",
          tier: "professional"
        },
        {
          name: "AI Vibe Analyzer",
          description: "Real-time sentiment analysis for events",
          path: "/ai-vibe-analyzer",
          tier: "enterprise"
        },
        {
          name: "AI Vibe Modeling",
          description: "Predictive modeling for event success",
          path: "/ai-vibe-modeling",
          tier: "enterprise"
        },
        {
          name: "Smart Scheduling",
          description: "Intelligent scheduling and resource optimization",
          path: "/smart-scheduling",
          tier: "professional"
        },
        {
          name: "Adaptive Environment",
          description: "Dynamic environment adjustments based on data",
          path: "/adaptive-environment",
          tier: "enterprise"
        }
      ]
    },
    {
      category: "Immersive Experience Technologies",
      icon: Globe,
      features: [
        {
          name: "AR Space Planner",
          description: "Augmented reality space planning and visualization",
          path: "/ar-space-planner",
          tier: "enterprise"
        },
        {
          name: "AR/VR Immersive Experiences",
          description: "Complete virtual and augmented reality solutions",
          path: "/ar-vr-immersive",
          tier: "enterprise"
        },
        {
          name: "Virtual Party Twin",
          description: "Digital twin technology for event simulation",
          path: "/virtual-party-twin",
          tier: "enterprise"
        },
        {
          name: "AR Preview",
          description: "Preview events in augmented reality",
          path: "/ar-preview",
          tier: "professional"
        }
      ]
    },
    {
      category: "Premium Content & Design",
      icon: Palette,
      features: [
        {
          name: "VibesCard Studio",
          description: "Professional invitation design studio",
          path: "/vibescard-studio",
          tier: "professional"
        },
        {
          name: "Interactive Live Vibes Invite",
          description: "Dynamic interactive invitation system",
          path: "/interactive-live-vibes-invite",
          tier: "enterprise"
        },
        {
          name: "Social Story Templates",
          description: "Professional social media content templates",
          path: "/social-story-templates",
          tier: "professional"
        },
        {
          name: "Event Soundtrack Generator",
          description: "AI-powered soundtrack creation",
          path: "/event-soundtrack-generator",
          tier: "enterprise"
        }
      ]
    },
    {
      category: "Analytics & Intelligence",
      icon: BarChart3,
      features: [
        {
          name: "Premium Dashboard",
          description: "Advanced analytics and business intelligence",
          path: "/premium",
          tier: "professional"
        },
        {
          name: "Interactive Mood Visualizer",
          description: "Real-time mood tracking and visualization",
          path: "/interactive-mood-visualizer",
          tier: "enterprise"
        },
        {
          name: "Host Achievements",
          description: "Performance tracking and achievement system",
          path: "/host-achievements",
          tier: "professional"
        },
        {
          name: "Event Verification Badges",
          description: "Trust and verification system for events",
          path: "/event-verification-badges",
          tier: "enterprise"
        }
      ]
    },
    {
      category: "Web3 & Blockchain Solutions",
      icon: Shield,
      features: [
        {
          name: "Smart Contract Escrow",
          description: "Blockchain-based payment security",
          path: "/smart-contract-escrow",
          tier: "enterprise"
        },
        {
          name: "NFT Guest Passes",
          description: "Blockchain-based exclusive access management",
          path: "/nft-guest-passes",
          tier: "enterprise"
        },
        {
          name: "Token Gated VIP",
          description: "Cryptocurrency-based VIP access control",
          path: "/token-gated-vip",
          tier: "enterprise"
        },
        {
          name: "Event DAO",
          description: "Decentralized autonomous organization for events",
          path: "/event-dao",
          tier: "enterprise"
        }
      ]
    },
    {
      category: "Sustainability & CSR",
      icon: Award,
      features: [
        {
          name: "Sustainability Tracker",
          description: "Environmental impact monitoring and reporting",
          path: "/sustainability-tracker",
          tier: "professional"
        },
        {
          name: "Sustainability Badges",
          description: "Achievement system for environmental goals",
          path: "/sustainability-badges",
          tier: "professional"
        }
      ]
    },
    {
      category: "Entertainment & Engagement",
      icon: Star,
      features: [
        {
          name: "Enhanced DJ Booth",
          description: "Professional DJ management system",
          path: "/enhanced-dj-booth",
          tier: "professional"
        },
        {
          name: "Live Music Voting",
          description: "Interactive music selection for guests",
          path: "/live-music-voting",
          tier: "professional"
        },
        {
          name: "Adaptive Music Engine",
          description: "AI-powered music adaptation system",
          path: "/adaptive-music-engine",
          tier: "enterprise"
        },
        {
          name: "Nightclub Experience",
          description: "Premium nightclub-style event experiences",
          path: "/nightclub-experience",
          tier: "enterprise"
        },
        {
          name: "Gamified Attendance Rewards",
          description: "Engagement system with rewards",
          path: "/gamified-attendance-rewards",
          tier: "professional"
        }
      ]
    },
    {
      category: "Support & Assistance",
      icon: Headphones,
      features: [
        {
          name: "VibeBot Assistant",
          description: "AI-powered event planning assistant",
          path: "/vibebot-assistant",
          tier: "professional"
        },
        {
          name: "Voice Activated Assistant",
          description: "Voice-controlled event management",
          path: "/voice-activated-assistant",
          tier: "enterprise"
        }
      ]
    }
  ];

  const pricingPlans = [
    {
      id: "payperuse",
      name: "Pay-As-You-Go",
      price: "Pay per use",
      period: "no subscriptions",
      description: "Use any feature when you need it, pay only for what you use",
      features: [
        "No monthly commitments",
        "Access to all features on-demand",
        "Transparent per-use pricing",
        "Scale up or down instantly",
        "No hidden fees",
        "Pay after successful event completion",
        "Volume discounts available",
        "Enterprise support included"
      ],
      highlighted: true
    },
    {
      id: "credits",
      name: "Credit Packages",
      price: "From $50",
      period: "credit bundles",
      description: "Pre-purchase credits for better rates and convenience",
      features: [
        "Better rates with credit bundles",
        "Credits never expire",
        "Use across all features",
        "Bonus credits with larger packages",
        "Flexible credit allocation",
        "Team credit sharing",
        "Usage analytics included",
        "Priority feature access"
      ],
      highlighted: false
    },
    {
      id: "enterprise",
      name: "Enterprise Agreement",
      price: "Custom pricing",
      period: "volume discounts",
      description: "Large-scale usage with significant volume discounts",
      features: [
        "Custom volume pricing",
        "Dedicated account management",
        "Advanced usage analytics",
        "Custom integration support",
        "Priority feature development",
        "White-label solutions",
        "On-premise deployment options",
        "Regulatory compliance support"
      ],
      highlighted: false
    }
  ];

  const getFeaturesByTier = (tier: string) => {
    return enterpriseFeatures.flatMap(category => 
      category.features.filter(feature => 
        tier === "enterprise" ? true : feature.tier === tier
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Vibes Enterprise Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Complete enterprise-grade party planning platform with advanced AI, Web3 technology, 
            and immersive experiences for professional event management
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              Enterprise Ready
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Web3 Enabled
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              AI Powered
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="features" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="features">Enterprise Features</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="comparison">Feature Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-8">
            {enterpriseFeatures.map((category, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <category.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.features.map((feature, featureIndex) => (
                      <Link key={featureIndex} href={feature.path}>
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 dark:hover:border-blue-800">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-sm">{feature.name}</h4>
                              <Badge 
                                variant={feature.tier === "enterprise" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {feature.tier}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {feature.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                Explore Feature
                              </span>
                              <ArrowRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.highlighted ? 'border-blue-500 border-2 shadow-xl scale-105' : ''}`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">{plan.period}</div>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.id === "custom" ? "Contact Sales" : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <span>Professional Features</span>
                  </CardTitle>
                  <CardDescription>
                    {getFeaturesByTier("professional").length} features included
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getFeaturesByTier("professional").map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>Enterprise Features</span>
                  </CardTitle>
                  <CardDescription>
                    {getFeaturesByTier("enterprise").length} features included (All Professional + Enterprise)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getFeaturesByTier("enterprise").map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{feature.name}</span>
                          <Badge 
                            variant={feature.tier === "enterprise" ? "default" : "secondary"}
                            className="text-xs ml-2"
                          >
                            {feature.tier}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Events?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join leading enterprises using Vibes for unforgettable experiences
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" variant="secondary">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}