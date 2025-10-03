import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, Users, Eye, DollarSign, Star, Crown, 
  Plus, Edit, Trash2, BarChart3, Target, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newListingTitle, setNewListingTitle] = useState("");
  const [newListingDescription, setNewListingDescription] = useState("");
  const [newListingPrice, setNewListingPrice] = useState("");
  const [selectedTier, setSelectedTier] = useState("basic");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock vendor data (in production, fetch from API based on current vendor)
  const vendorStats = {
    totalViews: 1247,
    totalLeads: 89,
    conversionRate: 7.1,
    monthlyRevenue: 3400,
    rating: 4.8,
    totalReviews: 156
  };

  const listings = [
    {
      id: 1,
      title: "Premium DJ Services",
      description: "Professional DJ with premium sound system and lighting",
      price: 50000, // $500 in cents
      tier: "featured",
      isActive: true,
      views: 234,
      leads: 12,
      createdAt: "2024-05-01"
    },
    {
      id: 2,
      title: "Wedding Package Special",
      description: "Complete wedding entertainment package with MC services",
      price: 120000, // $1200 in cents
      tier: "premium",
      isActive: true,
      views: 456,
      leads: 23,
      createdAt: "2024-05-15"
    }
  ];

  const monthlyData = [
    { month: "Jan", views: 180, leads: 12, revenue: 2400 },
    { month: "Feb", views: 220, leads: 18, revenue: 2800 },
    { month: "Mar", views: 290, leads: 25, revenue: 3200 },
    { month: "Apr", views: 340, leads: 31, revenue: 3600 },
    { month: "May", views: 410, leads: 38, revenue: 4100 },
  ];

  const createListingMutation = useMutation({
    mutationFn: async (listingData: any) => {
      return apiRequest('/api/vendor-listings', {
        method: 'POST',
        body: JSON.stringify(listingData),
      });
    },
    onSuccess: () => {
      toast({ title: "Listing created successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/vendor-listings'] });
      setNewListingTitle("");
      setNewListingDescription("");
      setNewListingPrice("");
    },
  });

  const upgradeListingMutation = useMutation({
    mutationFn: async ({ listingId, tier }: { listingId: number; tier: string }) => {
      return apiRequest(`/api/vendor-listings/${listingId}/upgrade`, {
        method: 'POST',
        body: JSON.stringify({ tier }),
      });
    },
    onSuccess: () => {
      toast({ title: "Listing upgraded successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/vendor-listings'] });
    },
  });

  const handleCreateListing = () => {
    if (newListingTitle && newListingDescription && newListingPrice) {
      createListingMutation.mutate({
        title: newListingTitle,
        description: newListingDescription,
        price: Math.round(parseFloat(newListingPrice) * 100), // Convert to cents
        tier: selectedTier,
        vendorId: 1, // In real app, get from auth
      });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-gray-500';
      case 'featured': return 'bg-blue-500';
      case 'premium': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierPrice = (tier: string) => {
    switch (tier) {
      case 'basic': return 'Free';
      case 'featured': return '$25/month';
      case 'premium': return '$50/month';
      default: return 'Free';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your listings and track performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-yellow-500 text-white px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              {vendorStats.rating} Rating
            </Badge>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Listing
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorStats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorStats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorStats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${vendorStats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+$400 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Vendor Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade Plans</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance</CardTitle>
                  <CardDescription>Your listings performance this month</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Views</span>
                      <span>410 this month</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lead Generation</span>
                      <span>38 leads</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Rate</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Listing</CardTitle>
                  <CardDescription>Your best performing service this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Wedding Package Special</h4>
                      <Badge className={`${getTierColor('premium')} text-white`}>Premium</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">456</div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">23</div>
                        <div className="text-xs text-gray-600">Leads</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">5.0%</div>
                        <div className="text-xs text-gray-600">Conversion</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest inquiries from potential clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Sarah Johnson</h4>
                        <span className="text-sm text-gray-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-gray-600">Interested in DJ services for June 15th wedding...</p>
                      <Button size="sm" className="mt-2">Reply</Button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Mike Chen</h4>
                        <span className="text-sm text-gray-500">1 day ago</span>
                      </div>
                      <p className="text-sm text-gray-600">Looking for corporate event entertainment package...</p>
                      <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Listing</CardTitle>
                <CardDescription>Add a new service to attract more clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Service Title</label>
                    <Input
                      placeholder="e.g., Premium DJ Services"
                      value={newListingTitle}
                      onChange={(e) => setNewListingTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={newListingPrice}
                      onChange={(e) => setNewListingPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe your service in detail..."
                    value={newListingDescription}
                    onChange={(e) => setNewListingDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Listing Tier</label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (Free)</SelectItem>
                      <SelectItem value="featured">Featured ($25/month)</SelectItem>
                      <SelectItem value="premium">Premium ($50/month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateListing} disabled={createListingMutation.isPending}>
                  {createListingMutation.isPending ? 'Creating...' : 'Create Listing'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Active Listings</CardTitle>
                <CardDescription>Manage your current service offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{listing.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTierColor(listing.tier)} text-white`}>
                            {listing.tier}
                          </Badge>
                          <Badge variant={listing.isActive ? "default" : "secondary"}>
                            {listing.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{listing.description}</p>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <div className="font-semibold text-lg">{formatCurrency(listing.price)}</div>
                          <div className="text-xs text-gray-500">Price</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{listing.views}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{listing.leads}</div>
                          <div className="text-xs text-gray-500">Leads</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg">{((listing.leads / listing.views) * 100).toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">Conversion</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => upgradeListingMutation.mutate({ listingId: listing.id, tier: 'premium' })}
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          Upgrade
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Track your business growth and optimize your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Detailed analytics coming soon!</p>
                  <p className="text-sm">Track views, leads, conversion rates, and revenue trends.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upgrade Plans Tab */}
          <TabsContent value="upgrade" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <div className="text-3xl font-bold">Free</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Basic listing visibility</li>
                    <li>• Standard search placement</li>
                    <li>• Email support</li>
                    <li>• Basic analytics</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">Current Plan</Button>
                </CardContent>
              </Card>

              <Card className="ring-2 ring-blue-500">
                <CardHeader>
                  <CardTitle>Featured</CardTitle>
                  <div className="text-3xl font-bold">$25<span className="text-lg">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Featured placement in search</li>
                    <li>• 3x more visibility</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                    <li>• Lead notifications</li>
                  </ul>
                  <Button className="w-full mt-4">Upgrade Now</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <div className="text-3xl font-bold">$50<span className="text-lg">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Top placement guarantee</li>
                    <li>• Custom branding options</li>
                    <li>• Unlimited photos/videos</li>
                    <li>• Lead contact details</li>
                    <li>• Marketing tools</li>
                    <li>• Dedicated account manager</li>
                  </ul>
                  <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">
                    <Crown className="w-4 h-4 mr-2" />
                    Go Premium
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

export default VendorDashboard;