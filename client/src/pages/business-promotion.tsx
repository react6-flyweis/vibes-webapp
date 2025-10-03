import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { AdvertisingTerms } from "@/components/advertising-terms";
import { 
  Store, 
  Upload, 
  Star, 
  CheckCircle, 
  Zap,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Globe
} from "lucide-react";

export default function BusinessPromotionPage() {
  const [adForm, setAdForm] = useState({
    businessName: "",
    serviceTitle: "",
    description: "",
    category: "",
    websiteUrl: "",
    contactEmail: "",
    image: null as File | null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const submitAdMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulate ad submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "🎉 Ad Submitted Successfully!",
        description: "Thank you! Your ad has been submitted and is under review. You will be notified once it's live."
      });
      setIsModalOpen(false);
      setAdForm({
        businessName: "",
        serviceTitle: "",
        description: "",
        category: "",
        websiteUrl: "",
        contactEmail: "",
        image: null
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.businessName || !adForm.serviceTitle || !adForm.description || !adForm.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    if (!agreedToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please read and agree to the advertising terms and conditions.",
        variant: "destructive"
      });
      return;
    }
    submitAdMutation.mutate(adForm);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdForm(prev => ({ ...prev, image: file }));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Promote Your Business on <span className="text-violet-600">Vibely</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with event hosts and guests in your area. Showcase your services to thousands of party planners 
            looking for vendors just like you.
          </p>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-4 bg-violet-600 hover:bg-violet-700">
                <Store className="h-5 w-5 mr-2" />
                Promote Your Business
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Submit Your Business Ad</DialogTitle>
                <DialogDescription>
                  Fill out the form below to promote your business to Vibely users planning events in your area.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={adForm.businessName}
                      onChange={(e) => setAdForm(prev => ({ ...prev, businessName: e.target.value }))}
                      placeholder="e.g., Mike's DJ Services"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceTitle">Product/Service Title *</Label>
                    <Input
                      id="serviceTitle"
                      value={adForm.serviceTitle}
                      onChange={(e) => setAdForm(prev => ({ ...prev, serviceTitle: e.target.value }))}
                      placeholder="e.g., Professional Wedding & Party DJ"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setAdForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="food">Food & Catering</SelectItem>
                        <SelectItem value="drinks">Beverages & Bar Services</SelectItem>
                        <SelectItem value="decorations">Decorations & Design</SelectItem>
                        <SelectItem value="photography">Photography & Video</SelectItem>
                        <SelectItem value="venues">Venues & Locations</SelectItem>
                        <SelectItem value="planning">Event Planning</SelectItem>
                        <SelectItem value="supplies">Party Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description * (200-300 characters)</Label>
                    <Textarea
                      id="description"
                      value={adForm.description}
                      onChange={(e) => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your service and what makes you special..."
                      maxLength={300}
                      rows={3}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">{adForm.description.length}/300 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="websiteUrl">Website or Booking Link</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={adForm.websiteUrl}
                      onChange={(e) => setAdForm(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://yourbusiness.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={adForm.contactEmail}
                      onChange={(e) => setAdForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="contact@yourbusiness.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Business Logo or Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      />
                      {adForm.image && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          {adForm.image.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="text-violet-600 hover:underline"
                          >
                            Advertising Terms and Conditions
                          </button>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Required to submit your business advertisement
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    disabled={submitAdMutation.isPending}
                    className="flex-1"
                  >
                    {submitAdMutation.isPending ? "Submitting..." : "Submit Ad"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Target className="h-12 w-12 text-violet-600 mx-auto mb-4" />
              <CardTitle>Targeted Reach</CardTitle>
              <CardDescription>
                Connect directly with event hosts and guests actively planning celebrations in your area
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Boost Your Business</CardTitle>
              <CardDescription>
                Increase bookings and brand awareness through strategic placement in our event planning platform
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Quality Leads</CardTitle>
              <CardDescription>
                Reach motivated customers who are actively seeking vendors for their upcoming events
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Promotion Level</h2>
            <p className="text-gray-600">Start with our free basic listing or upgrade for premium visibility</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Basic */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Basic Listing
                </CardTitle>
                <div className="text-3xl font-bold">Free</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Business name & logo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Category placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic contact info</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Start with Basic
                </Button>
              </CardContent>
            </Card>

            {/* Premium Featured */}
            <Card className="relative border-violet-200 shadow-lg">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-violet-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Ad
                </CardTitle>
                <div className="text-3xl font-bold">$25<span className="text-base font-normal">/month</span></div>
                <CardDescription>Enhanced visibility and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Everything in Basic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority placement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">High-quality images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Click-through analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-violet-600 hover:bg-violet-700">
                  Go Premium
                </Button>
              </CardContent>
            </Card>

            {/* Event Sponsorship */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  Event Sponsorship
                </CardTitle>
                <div className="text-3xl font-bold">$50<span className="text-base font-normal">/month</span></div>
                <CardDescription>Maximum exposure and targeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Everything in Featured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Event-specific targeting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Custom promotional offers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits */}
        <Card className="bg-linear-to-r from-violet-600 to-purple-600 text-white">
          <CardContent className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Why Choose Vibely for Your Business?</h2>
              <p className="text-xl opacity-90">Join hundreds of successful vendors already growing their business with us</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="font-semibold mb-2">Increase Revenue</h3>
                <p className="text-sm opacity-80">Average 40% increase in bookings within first 3 months</p>
              </div>
              
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="font-semibold mb-2">Stay Booked</h3>
                <p className="text-sm opacity-80">Connect with customers planning events year-round</p>
              </div>
              
              <div className="text-center">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="font-semibold mb-2">Local Focus</h3>
                <p className="text-sm opacity-80">Target customers specifically in your service area</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="font-semibold mb-2">Track Results</h3>
                <p className="text-sm opacity-80">Real-time analytics to measure your ad performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AdvertisingTerms 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  );
}