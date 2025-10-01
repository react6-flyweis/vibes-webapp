import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, AlertCircle, Info } from "lucide-react";

// Load Stripe with live keys
const stripePromise = loadStripe('pk_live_51QkIm6IG3GnT9n5tpNarRKMvaTv1NR9N9jodV2tjkQsW5O9G3qfCBWaaImKjQcnV4bbdI8B9NACqdRQYu93Jeh4O00TG13FGss');

function PaymentDebugForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const addDebugInfo = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, { timestamp, message, data }]);
    console.log(`[${timestamp}] ${message}`, data);
  };

  const testPayment = async () => {
    if (!stripe || !elements) {
      addDebugInfo("Stripe or Elements not loaded");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');
    setDebugInfo([]);

    try {
      addDebugInfo("Starting payment test with amount: $29.99");

      // Create payment intent
      addDebugInfo("Creating payment intent...");
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 29.99,
          currency: "usd"
        })
      });

      addDebugInfo("Payment intent response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addDebugInfo("Payment intent data received:", data);

      if (!data.clientSecret) {
        throw new Error("No client secret received");
      }

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        addDebugInfo("Card element not found");
        throw new Error("Card element not found");
      }

      addDebugInfo("Card element found, confirming payment...");

      // Confirm payment with test card
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
            email: 'test@example.com',
          },
        }
      });

      addDebugInfo("Payment confirmation result:", result);

      if (result.error) {
        setPaymentStatus('error');
        addDebugInfo("Payment error:", result.error);
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        setPaymentStatus('success');
        addDebugInfo("Payment successful:", result.paymentIntent);
        toast({
          title: "Payment Successful",
          description: `Payment completed: ${result.paymentIntent?.id}`,
        });
      }
    } catch (error: any) {
      setPaymentStatus('error');
      addDebugInfo("Payment exception:", error);
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Test with Debug Info</CardTitle>
          <CardDescription>
            Test payment with detailed logging to identify rejection cause
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
          
          <Button 
            onClick={testPayment}
            disabled={!stripe || isProcessing} 
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Test Payment ($29.99)
              </div>
            )}
          </Button>

          {paymentStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200">Payment completed successfully!</span>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">Payment failed. Check debug info below.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {debugInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded border">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                      {info.timestamp}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="font-medium">{info.message}</div>
                    {info.data && (
                      <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                        {JSON.stringify(info.data, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PaymentDebug() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Debug Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Debug payment rejections with detailed logging
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentDebugForm />
        </Elements>

        {/* Test Card Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Card Numbers</CardTitle>
            <CardDescription>
              Use these test cards to simulate different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Successful Payment
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 font-mono">
                  4242 4242 4242 4242<br />
                  Expiry: 12/28<br />
                  CVC: 123
                </p>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Declined Payment
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                  4000 0000 0000 0002<br />
                  Expiry: 12/28<br />
                  CVC: 123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}