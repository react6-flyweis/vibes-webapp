import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  BarChart3,
  Target,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- TYPE DEFINITIONS ---

interface CorporateClient {
  id: string;
  companyName: string;
  industry: string;
  employeeCount: number;
  plan: string;
  monthlyFee: number;
  status: 'active' | 'trial' | 'suspended'; // Using union types for better type safety
  eventsThisMonth: number;
  totalEmployees: number;
  joinDate: string;
}

interface CorporateEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  attendees: number;
  department: string;
  budget: number;
  status: 'completed' | 'upcoming'; // Using union types
}

// FIX: Added interface for stats data
interface CorporateStats {
  totalClients: number;
  monthlyRevenue: number;
  eventsThisMonth: number;
  growthRate: number;
}

// FIX: Added interface for pricing plan data
interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

// FIX: Added interface for the new client form state
interface NewClientFormData {
  companyName: string;
  industry: string;
  employeeCount: string; // Stored as string from input, converted on submit
  contactEmail: string;
  plan: string;
}

// FIX: Added interface for the data sent to the API (mutation payload)
interface ApiNewClientData {
    companyName: string;
    industry: string;
    employeeCount: number;
    contactEmail: string;
    plan: string;
}


export default function CorporateDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState("");
  
  // FIX: Typed the form state
  const [newClientForm, setNewClientForm] = useState<NewClientFormData>({
    companyName: "",
    industry: "",
    employeeCount: "",
    contactEmail: "",
    plan: ""
  });

  // FIX: Added generic type and queryFn to useQuery
  const { data: corporateClients = [], isLoading: clientsLoading } = useQuery<CorporateClient[]>({
    queryKey: ["/api/corporate/clients"],
    queryFn: () => apiRequest("GET", "/api/corporate/clients"),
  });

  // FIX: Added generic type and queryFn to useQuery
  const { data: corporateEvents = [], isLoading: eventsLoading } = useQuery<CorporateEvent[]>({
    queryKey: ["/api/corporate/events"],
    queryFn: () => apiRequest("GET", "/api/corporate/events"),
  });

  // FIX: Added generic type and queryFn to useQuery
  const { data: corporateStats, isLoading: statsLoading } = useQuery<CorporateStats>({
    queryKey: ["/api/corporate/stats"],
    queryFn: () => apiRequest("GET", "/api/corporate/stats"),
  });

  // FIX: Added generic type and queryFn to useQuery
  const { data: pricingPlans = [] } = useQuery<PricingPlan[]>({
    queryKey: ["/api/corporate/pricing-plans"],
    queryFn: () => apiRequest("GET", "/api/corporate/pricing-plans"),
  });

  const addClientMutation = useMutation({
    // FIX: Typed the mutation function parameter
    mutationFn: (clientData: ApiNewClientData) => {
      return apiRequest("POST", "/api/corporate/clients", clientData);
    },
    onSuccess: () => {
      toast({
        title: "Client Added Successfully",
        description: "New corporate client has been onboarded.",
      });
      setNewClientForm({
        companyName: "",
        industry: "",
        employeeCount: "",
        contactEmail: "",
        plan: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/corporate/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/corporate/stats"] });
    },
    // FIX: Typed the error parameter
    onError: (error: Error) => {
      toast({
        title: "Failed to Add Client",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // FIX: Added data validation and transformation
  const handleAddClient = () => {
    const { companyName, industry, employeeCount, contactEmail, plan } = newClientForm;

    if (!companyName || !contactEmail || !plan || !employeeCount) {
        toast({ title: "Error", description: "Please fill out all fields.", variant: "destructive" });
        return;
    }

    const parsedEmployeeCount = parseInt(employeeCount, 10);
    if (isNaN(parsedEmployeeCount)) {
        toast({ title: "Error", description: "Employee count must be a valid number.", variant: "destructive" });
        return;
    }

    const clientDataForApi: ApiNewClientData = {
      companyName,
      industry,
      contactEmail,
      plan,
      employeeCount: parsedEmployeeCount,
    };

    addClientMutation.mutate(clientDataForApi);
  };

  const getStatusColor = (status: CorporateClient['status']) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-300";
      case "trial": return "bg-yellow-500/20 text-yellow-300 border-yellow-300";
      case "suspended": return "bg-red-500/20 text-red-300 border-red-300";
      default: return "bg-gray-500/20 text-gray-300 border-gray-300";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "team-building": return <Users className="h-4 w-4 text-slate-300" />;
      case "client-event": return <Briefcase className="h-4 w-4 text-slate-300" />;
      case "company-party": return <Calendar className="h-4 w-4 text-slate-300" />;
      default: return <Calendar className="h-4 w-4 text-slate-300" />;
    }
  };

  if (clientsLoading || eventsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Corporate Dashboard</h1>
          <p className="text-xl text-slate-200">
            Manage white-label corporate event platform clients
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Total Clients</p>
                  <p className="text-white text-2xl font-bold">
                    {corporateStats?.totalClients || 0}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Monthly Revenue</p>
                  <p className="text-white text-2xl font-bold">
                    ${corporateStats?.monthlyRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Events This Month</p>
                  <p className="text-white text-2xl font-bold">
                    {corporateStats?.eventsThisMonth || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-sm">Growth Rate</p>
                  <p className="text-white text-2xl font-bold">
                    +{corporateStats?.growthRate || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur border-white/20 text-slate-200">
            <TabsTrigger value="clients" className="">
              Clients
            </TabsTrigger>
            <TabsTrigger value="events" className="">
              Events
            </TabsTrigger>
            <TabsTrigger value="pricing" className="e">
              Pricing Plans
            </TabsTrigger>
            <TabsTrigger value="analytics" className="">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <div className="space-y-6">
              {/* Add New Client */}
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Corporate Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      placeholder="Company Name"
                      value={newClientForm.companyName}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    />
                    <Input
                      placeholder="Industry"
                      value={newClientForm.industry}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, industry: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    />
                    <Input
                      placeholder="Employee Count"
                      type="number"
                      value={newClientForm.employeeCount}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, employeeCount: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    />
                    <Input
                      placeholder="Contact Email"
                      type="email"
                      value={newClientForm.contactEmail}
                      onChange={(e) => setNewClientForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-300"
                    />
                    <Select
                      value={newClientForm.plan}
                      onValueChange={(value) => setNewClientForm(prev => ({ ...prev, plan: value }))}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* FIX: Removed 'any' type, it's inferred from the typed useQuery hook */}
                        {pricingPlans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - ${plan.price}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleAddClient}
                      disabled={addClientMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 text-white col-span-1 md:col-span-2 lg:col-span-1"
                    >
                      {addClientMutation.isPending ? "Adding..." : "Add Client"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Clients List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {corporateClients.map((client) => (
                  <Card key={client.id} className="bg-white/10 backdrop-blur border-white/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{client.companyName}</CardTitle>
                          <p className="text-slate-300">{client.industry}</p>
                        </div>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Plan:</span>
                          <span className="text-white font-semibold">{client.plan}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Monthly Fee:</span>
                          <span className="text-white font-semibold">${client.monthlyFee}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Employees:</span>
                          <span className="text-white">{client.employeeCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Events This Month:</span>
                          <span className="text-white">{client.eventsThisMonth}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Corporate Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {corporateEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        {getEventTypeIcon(event.type)}
                        <div>
                          <h4 className="text-white font-semibold">{event.title}</h4>
                          <p className="text-slate-300 text-sm">{event.department} • {event.attendees} attendees</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-white">{new Date(event.date).toLocaleDateString()}</p>
                          <p className="text-slate-300 text-sm">${event.budget.toLocaleString()}</p>
                        </div>
                        <Badge className={event.status === "completed" ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"}>
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <Card key={plan.id} className="bg-white/10 backdrop-blur border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <p className="text-slate-300">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-white">${plan.price}</p>
                        <p className="text-slate-300">per month</p>
                      </div>
                      <div className="space-y-2">
                        {plan.features?.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-300">
                    Revenue chart would be displayed here
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Client Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-300">
                    Client growth chart would be displayed here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}