import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CreditCard, 
  DollarSign, 
  Building2, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Banknote as Bank,
  Smartphone,
  Globe,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Settings,
  Eye,
  Download,
  RefreshCw
} from "lucide-react";

interface PaymentMethod {
  id: string;
  type: string;
  provider: string;
  accountNumber: string;
  status: 'active' | 'pending' | 'suspended';
  isDefault: boolean;
  setupDate: string;
  fees: {
    percentage: number;
    fixed: number;
  };
}

interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  eventName: string;
}

interface VendorAccount {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  accountStatus: 'verified' | 'pending' | 'incomplete';
  totalRevenue: number;
  monthlyRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
}

export default function VendorPaymentSetup() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("setup");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showAccountForm, setShowAccountForm] = useState(false);

  // Form states
  const [accountInfo, setAccountInfo] = useState({
    businessName: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
    businessType: ""
  });

  const [bankInfo, setBankInfo] = useState({
    accountType: "checking",
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: ""
  });

  const [stripeInfo, setStripeInfo] = useState({
    email: "",
    country: "US",
    currency: "USD"
  });

  const [paypalInfo, setPaypalInfo] = useState({
    email: "",
    businessType: "individual"
  });

  // Fetch vendor account data
  const { data: vendorAccount, isLoading: accountLoading } = useQuery({
    queryKey: ["/api/vendor/account"],
    retry: false,
  });

  // Fetch payment methods
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ["/api/vendor/payment-methods"],
    retry: false,
  });

  // Fetch transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["/api/vendor/transactions"],
    retry: false,
  });

  // Mutations
  const setupAccountMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendor/setup-account", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Setup Complete",
        description: "Your vendor account has been successfully configured.",
      });
      setShowAccountForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup vendor account.",
        variant: "destructive",
      });
    },
  });

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/vendor/add-payment-method", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been successfully added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to add payment method.",
        variant: "destructive",
      });
    },
  });

  const handleAccountSetup = () => {
    setupAccountMutation.mutate(accountInfo);
  };

  const handlePaymentMethodSetup = () => {
    let paymentData = { type: selectedPaymentMethod };
    
    switch (selectedPaymentMethod) {
      case "bank":
        paymentData = { ...paymentData, ...bankInfo };
        break;
      case "stripe":
        paymentData = { ...paymentData, ...stripeInfo };
        break;
      case "paypal":
        paymentData = { ...paymentData, ...paypalInfo };
        break;
    }

    addPaymentMethodMutation.mutate(paymentData);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      incomplete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (accountLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          <Building2 className="inline-block mr-3 h-10 w-10 text-green-600" />
          Vendor Payment Center
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Set up your payment processing to collect payments from customers. 
          Manage your account, track transactions, and monitor your revenue.
        </p>
      </div>

      {/* Account Status Overview */}
      {vendorAccount && (
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{vendorAccount.businessName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusBadge(vendorAccount.accountStatus)}>
                    {vendorAccount.accountStatus.toUpperCase()}
                  </Badge>
                  {vendorAccount.accountStatus === 'verified' && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </CardDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(vendorAccount.totalRevenue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Revenue</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(vendorAccount.monthlyRevenue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">This Month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {vendorAccount.transactionCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Transactions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(vendorAccount.averageOrderValue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Order</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Account Setup</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          {!vendorAccount || vendorAccount.accountStatus === 'incomplete' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Business Account Setup
                </CardTitle>
                <CardDescription>
                  Complete your business information to start collecting payments from customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        value={accountInfo.businessName}
                        onChange={(e) => setAccountInfo({...accountInfo, businessName: e.target.value})}
                        placeholder="Your Business Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={accountInfo.email}
                        onChange={(e) => setAccountInfo({...accountInfo, email: e.target.value})}
                        placeholder="business@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={accountInfo.phone}
                        onChange={(e) => setAccountInfo({...accountInfo, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="businessType">Business Type *</Label>
                      <Select value={accountInfo.businessType} onValueChange={(value) => setAccountInfo({...accountInfo, businessType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="nonprofit">Non-profit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID / EIN</Label>
                      <Input
                        id="taxId"
                        value={accountInfo.taxId}
                        onChange={(e) => setAccountInfo({...accountInfo, taxId: e.target.value})}
                        placeholder="12-3456789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Business Address *</Label>
                      <Input
                        id="address"
                        value={accountInfo.address}
                        onChange={(e) => setAccountInfo({...accountInfo, address: e.target.value})}
                        placeholder="123 Business St, City, State 12345"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handleAccountSetup}
                  disabled={setupAccountMutation.isPending || !accountInfo.businessName || !accountInfo.email}
                  className="w-full"
                >
                  {setupAccountMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Setting up account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Account Setup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Account Verified
                </CardTitle>
                <CardDescription>
                  Your business account is set up and ready to accept payments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold">{vendorAccount.businessName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {vendorAccount.email} • {vendorAccount.phone}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setShowAccountForm(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Existing Payment Methods */}
          {paymentMethods && paymentMethods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Payment Methods</CardTitle>
                <CardDescription>
                  Manage your connected payment processing methods.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method: PaymentMethod) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {method.type === 'bank' && <Bank className="h-6 w-6 text-blue-600" />}
                        {method.type === 'stripe' && <CreditCard className="h-6 w-6 text-purple-600" />}
                        {method.type === 'paypal' && <DollarSign className="h-6 w-6 text-blue-500" />}
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {method.provider}
                            {method.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            ****{method.accountNumber.slice(-4)} • {method.fees.percentage}% + ${method.fees.fixed}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadge(method.status)}>
                          {method.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add New Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Add Payment Method</CardTitle>
              <CardDescription>
                Set up a new way to receive payments from your customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${selectedPaymentMethod === 'bank' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPaymentMethod('bank')}
                >
                  <CardContent className="p-6 text-center">
                    <Bank className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold mb-2">Bank Account</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Direct bank transfers with low fees
                    </p>
                    <Badge variant="secondary">2.9% + $0.30</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${selectedPaymentMethod === 'stripe' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPaymentMethod('stripe')}
                >
                  <CardContent className="p-6 text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold mb-2">Stripe</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Accept cards, digital wallets & more
                    </p>
                    <Badge variant="secondary">2.9% + $0.30</Badge>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${selectedPaymentMethod === 'paypal' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedPaymentMethod('paypal')}
                >
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold mb-2">PayPal</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Popular payment option worldwide
                    </p>
                    <Badge variant="secondary">3.5% + $0.35</Badge>
                  </CardContent>
                </Card>
              </div>

              {selectedPaymentMethod && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {selectedPaymentMethod === 'bank' && <Bank className="h-5 w-5" />}
                      {selectedPaymentMethod === 'stripe' && <CreditCard className="h-5 w-5" />}
                      {selectedPaymentMethod === 'paypal' && <DollarSign className="h-5 w-5" />}
                      Setup {selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPaymentMethod === 'bank' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name *</Label>
                          <Input
                            id="bankName"
                            value={bankInfo.bankName}
                            onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                            placeholder="Bank of America"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountType">Account Type *</Label>
                          <Select value={bankInfo.accountType} onValueChange={(value) => setBankInfo({...bankInfo, accountType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="routingNumber">Routing Number *</Label>
                          <Input
                            id="routingNumber"
                            value={bankInfo.routingNumber}
                            onChange={(e) => setBankInfo({...bankInfo, routingNumber: e.target.value})}
                            placeholder="123456789"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number *</Label>
                          <Input
                            id="accountNumber"
                            value={bankInfo.accountNumber}
                            onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                            placeholder="123456789012"
                          />
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'stripe' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="stripeEmail">Stripe Account Email *</Label>
                          <Input
                            id="stripeEmail"
                            type="email"
                            value={stripeInfo.email}
                            onChange={(e) => setStripeInfo({...stripeInfo, email: e.target.value})}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Select value={stripeInfo.country} onValueChange={(value) => setStripeInfo({...stripeInfo, country: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {selectedPaymentMethod === 'paypal' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="paypalEmail">PayPal Email *</Label>
                          <Input
                            id="paypalEmail"
                            type="email"
                            value={paypalInfo.email}
                            onChange={(e) => setPaypalInfo({...paypalInfo, email: e.target.value})}
                            placeholder="your@paypal.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="paypalBusinessType">Account Type *</Label>
                          <Select value={paypalInfo.businessType} onValueChange={(value) => setPaypalInfo({...paypalInfo, businessType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Personal</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handlePaymentMethodSetup}
                      disabled={addPaymentMethodMutation.isPending}
                      className="w-full"
                    >
                      {addPaymentMethodMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Add Payment Method
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    View and manage your customer payments.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((transaction: Transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{transaction.customerName}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {transaction.eventName} • {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()} • via {transaction.paymentMethod}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(transaction.netAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Fee: {formatCurrency(transaction.fee)}
                        </div>
                        <Badge className={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Transactions Yet</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your customer payments will appear here once you start receiving orders.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <Badge variant="secondary">+12%</Badge>
                </div>
                <div className="text-2xl font-bold mb-2">$12,450</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Revenue This Month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <Badge variant="secondary">+5%</Badge>
                </div>
                <div className="text-2xl font-bold mb-2">234</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Customers</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <Badge variant="secondary">+8%</Badge>
                </div>
                <div className="text-2xl font-bold mb-2">$53.20</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Order</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-orange-600" />
                  <Badge variant="secondary">+15%</Badge>
                </div>
                <div className="text-2xl font-bold mb-2">18</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Events Served</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method Performance</CardTitle>
              <CardDescription>
                See which payment methods your customers prefer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span>Credit Cards</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-sm font-semibold w-12">65%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <span>Mobile Payments</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-sm font-semibold w-12">25%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span>Bank Transfers</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm font-semibold w-12">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}