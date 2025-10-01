import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  MapPin, 
  Calendar, 
  Award,
  TrendingUp,
  Clock,
  FileText,
  Camera,
  Globe,
  Zap,
  Heart
} from "lucide-react";

export default function EventVerificationBadges() {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    eventType: "",
    venueAddress: "",
    contactInfo: "",
    description: "",
    capacity: "",
    safetyMeasures: "",
    insurance: "",
    permits: "",
    socialMedia: "",
    previousEvents: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user events for verification
  const { data: userEventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events/user"],
  });

  // Fetch verification badges
  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ["/api/verification/badges"],
  });

  // Fetch verification stats
  const { data: verificationStatsData } = useQuery({
    queryKey: ["/api/verification/stats"],
  });

  const userEvents = Array.isArray(userEventsData) ? userEventsData : [];
  const badges = Array.isArray(badgesData) ? badgesData : [];
  const verificationStats = verificationStatsData || {
    totalBadges: 0,
    verificationRate: 0,
    avgProcessingTime: 0,
    verifiedHosts: 0
  };

  // Submit verification request
  const submitVerification = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/verification/submit", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/badges"] });
      setVerificationStep(1);
      setSelectedEvent("");
      setVerificationData({
        eventType: "",
        venueAddress: "",
        contactInfo: "",
        description: "",
        capacity: "",
        safetyMeasures: "",
        insurance: "",
        permits: "",
        socialMedia: "",
        previousEvents: ""
      });
    },
  });

  // One-click verification for qualifying events
  const quickVerification = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiRequest("POST", "/api/verification/quick-verify", { eventId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Quick Verification Complete",
        description: `Your event received ${data.badgesEarned} verification badges!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/badges"] });
    },
  });

  const handleSubmitVerification = () => {
    if (!selectedEvent) return;

    submitVerification.mutate({
      eventId: selectedEvent,
      ...verificationData
    });
  };

  const handleQuickVerify = (eventId: string) => {
    quickVerification.mutate(eventId);
  };

  const badgeTypes = [
    {
      id: "verified_host",
      name: "Verified Host",
      icon: Shield,
      color: "bg-blue-500",
      description: "Host identity and reputation verified",
      criteria: ["Identity verification", "Previous event history", "Community standing"]
    },
    {
      id: "safety_certified",
      name: "Safety Certified",
      icon: CheckCircle,
      color: "bg-green-500",
      description: "Event meets all safety standards",
      criteria: ["Safety protocols", "Insurance coverage", "Emergency planning"]
    },
    {
      id: "premium_venue",
      name: "Premium Venue",
      icon: Star,
      color: "bg-yellow-500",
      description: "High-quality, verified venue",
      criteria: ["Venue inspection", "Quality standards", "Guest reviews"]
    },
    {
      id: "crowd_favorite",
      name: "Crowd Favorite",
      icon: Users,
      color: "bg-purple-500",
      description: "Highly rated by attendees",
      criteria: ["4.5+ star rating", "High attendance", "Positive feedback"]
    },
    {
      id: "local_gem",
      name: "Local Gem",
      icon: MapPin,
      color: "bg-pink-500",
      description: "Celebrates local culture and community",
      criteria: ["Local business support", "Community involvement", "Cultural significance"]
    },
    {
      id: "eco_friendly",
      name: "Eco-Friendly",
      icon: Heart,
      color: "bg-emerald-500",
      description: "Environmentally conscious event",
      criteria: ["Sustainable practices", "Waste reduction", "Green initiatives"]
    }
  ];

  const renderVerificationForm = () => {
    switch (verificationStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Event to Verify</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event..." />
                </SelectTrigger>
                <SelectContent>
                  {userEvents.map((event: any) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title} - {event.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Event Type</Label>
              <Select value={verificationData.eventType} onValueChange={(value) => 
                setVerificationData(prev => ({ ...prev, eventType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private_party">Private Party</SelectItem>
                  <SelectItem value="corporate_event">Corporate Event</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="public_event">Public Event</SelectItem>
                  <SelectItem value="fundraiser">Fundraiser</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Venue Address</Label>
              <Input
                value={verificationData.venueAddress}
                onChange={(e) => setVerificationData(prev => ({ ...prev, venueAddress: e.target.value }))}
                placeholder="Full venue address..."
              />
            </div>

            <div>
              <Label>Contact Information</Label>
              <Input
                value={verificationData.contactInfo}
                onChange={(e) => setVerificationData(prev => ({ ...prev, contactInfo: e.target.value }))}
                placeholder="Phone number and email..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Event Description</Label>
              <Textarea
                value={verificationData.description}
                onChange={(e) => setVerificationData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed event description..."
                rows={4}
              />
            </div>

            <div>
              <Label>Expected Capacity</Label>
              <Input
                type="number"
                value={verificationData.capacity}
                onChange={(e) => setVerificationData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="Number of guests..."
              />
            </div>

            <div>
              <Label>Safety Measures</Label>
              <Textarea
                value={verificationData.safetyMeasures}
                onChange={(e) => setVerificationData(prev => ({ ...prev, safetyMeasures: e.target.value }))}
                placeholder="Describe safety protocols, security, emergency procedures..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Insurance Coverage</Label>
              <Input
                value={verificationData.insurance}
                onChange={(e) => setVerificationData(prev => ({ ...prev, insurance: e.target.value }))}
                placeholder="Insurance policy details..."
              />
            </div>

            <div>
              <Label>Permits & Licenses</Label>
              <Input
                value={verificationData.permits}
                onChange={(e) => setVerificationData(prev => ({ ...prev, permits: e.target.value }))}
                placeholder="Required permits and licenses..."
              />
            </div>

            <div>
              <Label>Social Media Presence</Label>
              <Input
                value={verificationData.socialMedia}
                onChange={(e) => setVerificationData(prev => ({ ...prev, socialMedia: e.target.value }))}
                placeholder="Social media links..."
              />
            </div>

            <div>
              <Label>Previous Event Experience</Label>
              <Textarea
                value={verificationData.previousEvents}
                onChange={(e) => setVerificationData(prev => ({ ...prev, previousEvents: e.target.value }))}
                placeholder="Describe previous events you've organized..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (eventsLoading || badgesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading verification badges...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold">Event Verification Badges</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Build trust and credibility with verified event badges. Get instant verification for qualifying events.
        </p>
      </div>

      {/* Stats Overview */}
      {verificationStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{verificationStats.totalBadges}</div>
              <div className="text-sm text-muted-foreground">Total Badges Earned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{verificationStats.verificationRate}%</div>
              <div className="text-sm text-muted-foreground">Verification Rate</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{verificationStats.avgProcessingTime}h</div>
              <div className="text-sm text-muted-foreground">Avg Processing</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{verificationStats.verifiedHosts}</div>
              <div className="text-sm text-muted-foreground">Verified Hosts</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="verify" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verify">Request Verification</TabsTrigger>
          <TabsTrigger value="badges">Badge Types</TabsTrigger>
          <TabsTrigger value="my-badges">My Badges</TabsTrigger>
        </TabsList>

        {/* Verification Request Tab */}
        <TabsContent value="verify" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  One-Click Verification
                </CardTitle>
                <CardDescription>
                  Instantly verify qualifying events based on your profile and event history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userEvents.length > 0 ? (
                  <div className="space-y-3">
                    {userEvents.slice(0, 3).map((event: any) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.date}</div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleQuickVerify(event.id.toString())}
                          disabled={quickVerification.isPending}
                        >
                          {quickVerification.isPending ? "Verifying..." : "Quick Verify"}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No events available for quick verification
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Manual Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Manual Verification
                </CardTitle>
                <CardDescription>
                  Complete verification process for maximum credibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Step {verificationStep} of 3</span>
                    <span>{Math.round((verificationStep / 3) * 100)}%</span>
                  </div>
                  <Progress value={(verificationStep / 3) * 100} />
                </div>

                {/* Form Steps */}
                {renderVerificationForm()}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setVerificationStep(Math.max(1, verificationStep - 1))}
                    disabled={verificationStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {verificationStep < 3 ? (
                    <Button
                      onClick={() => setVerificationStep(verificationStep + 1)}
                      disabled={!selectedEvent || !verificationData.eventType}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitVerification}
                      disabled={submitVerification.isPending || !selectedEvent}
                    >
                      {submitVerification.isPending ? "Submitting..." : "Submit for Review"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Badge Types Tab */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeTypes.map((badgeType) => {
              const IconComponent = badgeType.icon;
              return (
                <Card key={badgeType.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${badgeType.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      {badgeType.name}
                    </CardTitle>
                    <CardDescription>{badgeType.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Requirements:</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {badgeType.criteria.map((criterion, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* My Badges Tab */}
        <TabsContent value="my-badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earned Badges</CardTitle>
                <CardDescription>Your verified achievements and credentials</CardDescription>
              </CardHeader>
              <CardContent>
                {badges.length > 0 ? (
                  <div className="space-y-3">
                    {badges.map((badge: any) => (
                      <div key={badge.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={badge.color}>
                            {badge.name}
                          </Badge>
                          <div>
                            <div className="font-medium">{badge.eventTitle}</div>
                            <div className="text-sm text-muted-foreground">
                              Earned on {badge.earnedDate}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{badge.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No badges earned yet. Submit events for verification to earn your first badge!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
                <CardDescription>Track your verification journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Host Identity</span>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Event History</span>
                    <Badge variant="outline">3 Events</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Community Rating</span>
                    <Badge variant="outline">4.8 ⭐</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Safety Compliance</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Next Badge Progress</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Safety Certified</span>
                      <span>2/3 Requirements</span>
                    </div>
                    <Progress value={67} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}