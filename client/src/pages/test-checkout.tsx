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
import { apiRequest } from "@/lib/queryClient";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

// Load Stripe with live keys
const stripePromise = loadStripe('pk_live_51QkIm6IG3GnT9n5tpNarRKMvaTv1NR9N9jodV2tjkQsW5O9G3qfCBWaaImKjQcnV4bbdI8B9NACqdRQYu93Jeh4O00TG13FGss');

interface TestAmount {
  label: string;
  amount: number;
  description: string;
}

const testAmounts: TestAmount[] = [
  { label: "Basic Plan", amount: 9.99, description: "Monthly subscription" },
  { label: "Premium Plan", amount: 29.99, description: "Premium features" },
  { label: "Enterprise Plan", amount: 99.99, description: "Full enterprise suite" },
  { label: "Event Booking", amount: 199.99, description: "Premium event booking" }
];

function CheckoutForm({ amount, planName }: { amount: number; planName: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      // Create payment intent
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

      // Check if payment gateway requires setup
      if (data.requiresSetup) {
        toast({
          title: "Payment Gateway Setup Required",
          description: "The payment system is being configured. Please try again shortly.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const { clientSecret } = data;

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (result.error) {
        setPaymentStatus('error');
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        setPaymentStatus('success');
        toast({
          title: "Payment Successful",
          description: `Successfully processed payment for ${planName}`,
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pay ${amount}
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
          <span className="text-red-800 dark:text-red-200">Payment failed. Please try again.</span>
        </div>
      )}
    </form>
  );
}

export default function TestCheckout() {
  const [selectedTest, setSelectedTest] = useState<TestAmount | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Gateway Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test the complete Stripe payment flow with live credentials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Test Amount
            </h2>
            
            {testAmounts.map((test) => (
              <Card 
                key={test.label}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTest?.label === test.label 
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : ''
                }`}
                onClick={() => setSelectedTest(test)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{test.label}</CardTitle>
                    <span className="text-2xl font-bold text-blue-600">${test.amount}</span>
                  </div>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Payment Details
            </h2>
            
            {selectedTest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Complete Payment</CardTitle>
                  <CardDescription>
                    Testing payment for {selectedTest.label} (${selectedTest.amount})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm 
                      amount={selectedTest.amount} 
                      planName={selectedTest.label}
                    />
                  </Elements>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Select a test amount to begin payment flow
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Test Card Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Card Information</CardTitle>
            <CardDescription>
              Use these test card numbers to simulate different payment scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Successful Payment
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Card: 4242 4242 4242 4242<br />
                  Expiry: Any future date<br />
                  CVC: Any 3 digits
                </p>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Declined Payment
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Card: 4000 0000 0000 0002<br />
                  Expiry: Any future date<br />
                  CVC: Any 3 digits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}