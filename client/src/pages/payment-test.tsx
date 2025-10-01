import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle, CheckCircle, CreditCard, Settings } from "lucide-react";

export default function PaymentTest() {
  const [amount, setAmount] = useState("10.00");
  const [email, setEmail] = useState("test@example.com");
  const [testResult, setTestResult] = useState<any>(null);

  const paymentIntentMutation = useMutation({
    mutationFn: async (data: { amount: number }) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", data);
      return response;
    },
    onSuccess: (data) => {
      setTestResult({ type: "success", data, message: "Payment intent created successfully!" });
    },
    onError: (error: any) => {
      setTestResult({ type: "error", error, message: error.message || "Payment failed" });
    },
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (data: { email: string; name: string; priceId: string }) => {
      const response = await apiRequest("POST", "/api/create-subscription", data);
      return response;
    },
    onSuccess: (data) => {
      setTestResult({ type: "success", data, message: "Subscription created successfully!" });
    },
    onError: (error: any) => {
      setTestResult({ type: "error", error, message: error.message || "Subscription failed" });
    },
  });

  const testPaymentIntent = () => {
    const amountNum = parseFloat(amount);
    if (amountNum < 0.50) {
      setTestResult({ type: "error", message: "Amount must be at least $0.50" });
      return;
    }
    paymentIntentMutation.mutate({ amount: amountNum });
  };

  const testSubscription = () => {
    subscriptionMutation.mutate({
      email,
      name: "Test User",
      priceId: "price_test_123"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payment System Test</h1>
          <p className="text-slate-400">Test payment gateway functionality and error handling</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Intent Test */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Intent Test
              </CardTitle>
              <CardDescription className="text-slate-400">
                Test one-time payment creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="10.00"
                />
              </div>
              <Button
                onClick={testPaymentIntent}
                disabled={paymentIntentMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {paymentIntentMutation.isPending ? "Testing..." : "Test Payment Intent"}
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Test */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Subscription Test
              </CardTitle>
              <CardDescription className="text-slate-400">
                Test subscription creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="test@example.com"
                />
              </div>
              <Button
                onClick={testSubscription}
                disabled={subscriptionMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {subscriptionMutation.isPending ? "Testing..." : "Test Subscription"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResult && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {testResult.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className={`border ${
                testResult.type === "success" 
                  ? "border-green-500/50 bg-green-500/10" 
                  : "border-red-500/50 bg-red-500/10"
              }`}>
                <AlertDescription className="text-white">
                  {testResult.message}
                </AlertDescription>
              </Alert>

              {testResult.type === "error" && testResult.error && (
                <div className="space-y-2">
                  <Badge variant="destructive" className="mb-2">
                    Error Details
                  </Badge>
                  <pre className="bg-slate-900 p-3 rounded text-red-400 text-sm overflow-auto">
                    {JSON.stringify(testResult.error, null, 2)}
                  </pre>
                </div>
              )}

              {testResult.type === "success" && testResult.data && (
                <div className="space-y-2">
                  <Badge variant="secondary" className="mb-2">
                    Success Response
                  </Badge>
                  <pre className="bg-slate-900 p-3 rounded text-green-400 text-sm overflow-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Payment System Status</CardTitle>
            <CardDescription className="text-slate-400">
              Current configuration and health check
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Stripe Config
                </Badge>
                <p className="text-slate-400 text-sm">Environment-based</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  API Version
                </Badge>
                <p className="text-slate-400 text-sm">2023-10-16</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Error Handling
                </Badge>
                <p className="text-slate-400 text-sm">Enhanced</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Graceful Degradation
                </Badge>
                <p className="text-slate-400 text-sm">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}