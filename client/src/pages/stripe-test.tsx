import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";

export default function StripeTest() {
  const [amount, setAmount] = useState("29.99");
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const addResult = (message: string, data?: any, success?: boolean) => {
    const timestamp = new Date().toLocaleTimeString();
    setResults(prev => [...prev, { timestamp, message, data, success }]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  const testPaymentIntent = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setResults([]);

    try {
      addResult("Starting payment intent test");
      addResult(`Testing amount: $${amount}`);

      // Test payment intent creation
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: "usd"
        })
      });

      addResult(`Response status: ${response.status}`, { status: response.status });

      if (!response.ok) {
        const errorText = await response.text();
        addResult("Payment intent creation failed", { error: errorText }, false);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addResult("Payment intent created successfully", data, true);

      if (data.clientSecret) {
        addResult("Client secret received", { 
          clientSecretPrefix: data.clientSecret.substring(0, 20) + "...",
          paymentIntentId: data.paymentIntentId 
        }, true);
        
        toast({
          title: "Payment Intent Created",
          description: `Successfully created payment intent for $${amount}`,
        });
      } else {
        addResult("No client secret in response", data, false);
        throw new Error("No client secret received");
      }

      // Test Stripe configuration
      addResult("Testing Stripe configuration");
      if (typeof window !== 'undefined' && window.Stripe) {
        addResult("Stripe.js is loaded globally", null, true);
      } else {
        addResult("Stripe.js not found globally", null, false);
      }

    } catch (error: any) {
      addResult("Payment intent test failed", { error: error.message }, false);
      toast({
        title: "Test Failed",
        description: error.message || "Payment intent creation failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const testStripeKeys = async () => {
    setIsProcessing(true);
    setResults([]);

    try {
      addResult("Testing Stripe key configuration");
      
      const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      if (publicKey) {
        addResult("Public key found in environment", { 
          keyPrefix: publicKey.substring(0, 20) + "..." 
        }, true);
      } else {
        addResult("No public key found in environment", null, false);
      }

      // Test if we can load Stripe
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(publicKey || 'pk_live_51QkIm6IG3GnT9n5tpNarRKMvaTv1NR9N9jodV2tjkQsW5O9G3qfCBWaaImKjQcnV4bbdI8B9NACqdRQYu93Jeh4O00TG13FGss');
      
      if (stripe) {
        addResult("Stripe instance created successfully", null, true);
      } else {
        addResult("Failed to create Stripe instance", null, false);
      }

    } catch (error: any) {
      addResult("Stripe configuration test failed", { error: error.message }, false);
    } finally {
      setIsProcessing(false);
    }
  };

  const testBackendHealth = async () => {
    setIsProcessing(true);
    setResults([]);

    try {
      addResult("Testing backend health");

      // Test basic connectivity
      const healthResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1.00,
          currency: "usd"
        })
      });

      if (healthResponse.ok) {
        const data = await healthResponse.json();
        addResult("Backend is responding correctly", data, true);
        
        if (data.clientSecret && data.paymentIntentId) {
          addResult("Payment intent structure is correct", {
            hasClientSecret: !!data.clientSecret,
            hasPaymentIntentId: !!data.paymentIntentId
          }, true);
        }
      } else {
        const errorText = await healthResponse.text();
        addResult("Backend health check failed", { 
          status: healthResponse.status, 
          error: errorText 
        }, false);
      }

    } catch (error: any) {
      addResult("Backend health test failed", { error: error.message }, false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stripe Integration Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive testing of payment gateway components
          </p>
        </div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Intent Test</CardTitle>
              <CardDescription>Test payment intent creation with custom amount</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="29.99"
                />
              </div>
              <Button 
                onClick={testPaymentIntent}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? "Testing..." : "Test Payment Intent"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Tests</CardTitle>
              <CardDescription>Test individual system components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={testStripeKeys}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                Test Stripe Configuration
              </Button>
              <Button 
                onClick={testBackendHealth}
                disabled={isProcessing}
                variant="outline"
                className="w-full"
              >
                Test Backend Health
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded border ${
                      result.success === true 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : result.success === false
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {result.success === true && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {result.success === false && <AlertCircle className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">{result.message}</span>
                      </div>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                    {result.data && (
                      <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Stripe Mode:</span>
                <span className="ml-2 text-green-600">Live</span>
              </div>
              <div>
                <span className="font-medium">API Endpoint:</span>
                <span className="ml-2 font-mono">/api/create-payment-intent</span>
              </div>
              <div>
                <span className="font-medium">Currency:</span>
                <span className="ml-2">USD</span>
              </div>
              <div>
                <span className="font-medium">Environment:</span>
                <span className="ml-2">Development</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}