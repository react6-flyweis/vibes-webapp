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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Shield, DollarSign } from "lucide-react";

// Use the live Stripe public key
const STRIPE_PUBLIC_KEY = 'pk_live_51QkIm6IG3GnT9n5tpNarRKMvaTv1NR9N9jodV2tjkQsW5O9G3qfCBWaaImKjQcnV4bbdI8B9NACqdRQYu93Jeh4O00TG13FGss';
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("29.99");
  const [customerName, setCustomerName] = useState("Test Customer");
  const [email, setEmail] = useState("customer@example.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load",
        variant: "destructive",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast({
        title: "Card Information Required",
        description: "Please enter your card information",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment setup failed: ${errorText}`);
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("Payment configuration error");
      }

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: email,
          },
        }
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message || "Payment could not be processed",
          variant: "destructive",
        });
      } else {
        setPaymentSuccess(true);
        toast({
          title: "Payment Successful!",
          description: `Payment of $${amount} has been processed successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800">Payment Successful!</h3>
            <p className="text-gray-600">
              Your payment of ${amount} has been processed successfully.
            </p>
            <Button 
              onClick={() => {
                setPaymentSuccess(false);
                setAmount("29.99");
              }}
              variant="outline"
              className="w-full"
            >
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Enter your payment information below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  placeholder="29.99"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Card Information</Label>
            <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900">
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
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
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
                Processing Payment...
              </div>
            ) : (
              `Pay $${amount}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function WorkingPayment() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Working Payment System
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Live Stripe integration with proper error handling
          </p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>

        {/* Test Card Information */}
        <Card className="mt-8 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-sm">Test Card Numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-green-700">Success Card:</p>
                <p className="font-mono">4242 4242 4242 4242</p>
              </div>
              <div>
                <p className="font-medium text-red-700">Decline Card:</p>
                <p className="font-mono">4000 0000 0000 0002</p>
              </div>
            </div>
            <p className="text-gray-500">
              Use any future date for expiry and any 3 digits for CVC
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}