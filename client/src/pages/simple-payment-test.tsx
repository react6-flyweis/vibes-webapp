import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, CreditCard } from "lucide-react";

const testAmounts = [
  { label: "Basic Plan", amount: 9.99, description: "Monthly subscription" },
  { label: "Premium Plan", amount: 29.99, description: "Premium features" },
  { label: "Enterprise Plan", amount: 99.99, description: "Full enterprise suite" },
  { label: "Event Booking", amount: 199.99, description: "Premium event booking" }
];

export default function SimplePaymentTest() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResults, setPaymentResults] = useState<{ [key: string]: 'success' | 'error' | null }>({});
  const { toast } = useToast();

  const testPaymentIntent = async (amount: number, planName: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "usd"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.clientSecret && data.paymentIntentId) {
        setPaymentResults(prev => ({ ...prev, [planName]: 'success' }));
        toast({
          title: "Payment Intent Created",
          description: `Successfully created payment intent for ${planName} ($${amount})`,
        });
      } else {
        throw new Error("Invalid response from payment gateway");
      }
    } catch (error: any) {
      console.error('Payment intent error:', error);
      setPaymentResults(prev => ({ ...prev, [planName]: 'error' }));
      toast({
        title: "Payment Intent Failed",
        description: error.message || "Failed to create payment intent",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const testAllPayments = async () => {
    setPaymentResults({});
    for (const test of testAmounts) {
      await testPaymentIntent(test.amount, test.label);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Gateway Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test payment intent creation with live Stripe credentials
          </p>
        </div>

        {/* Test All Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={testAllPayments}
            disabled={isProcessing}
            size="lg"
            className="px-8"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Test All Payment Intents
              </div>
            )}
          </Button>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testAmounts.map((test) => (
            <Card 
              key={test.label}
              className={`transition-all ${
                paymentResults[test.label] === 'success' 
                  ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' 
                  : paymentResults[test.label] === 'error'
                  ? 'ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20'
                  : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{test.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">${test.amount}</span>
                    {paymentResults[test.label] === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {paymentResults[test.label] === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => testPaymentIntent(test.amount, test.label)}
                  disabled={isProcessing}
                  variant="outline"
                  className="w-full"
                >
                  Test Individual Payment
                </Button>
                
                {paymentResults[test.label] === 'success' && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-800 dark:text-green-200 text-sm">
                        Payment intent created successfully
                      </span>
                    </div>
                  </div>
                )}
                
                {paymentResults[test.label] === 'error' && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800 dark:text-red-200 text-sm">
                        Payment intent creation failed
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gateway Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Gateway Status</CardTitle>
            <CardDescription>
              Live Stripe integration test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Gateway URL:</span>
                <span className="font-mono text-sm">/api/create-payment-intent</span>
              </div>
              <div className="flex justify-between">
                <span>Stripe Mode:</span>
                <span className="font-semibold text-green-600">Live</span>
              </div>
              <div className="flex justify-between">
                <span>Currency:</span>
                <span>USD</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}