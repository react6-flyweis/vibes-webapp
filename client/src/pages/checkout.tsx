import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import Navigation from "@/components/navigation";

// Load Stripe with live keys
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  planName: string;
  onSuccess: () => void;
}

function CheckoutForm({ amount, planName, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
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
          amount,
          currency: "usd",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Payment setup failed: ${errorText}`);
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("Payment configuration error");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card information required");
      }

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "Vibes Customer",
          },
        },
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${planName}! Your premium features are now active.`,
        });
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description:
          error.message || "An error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <CardElement options={cardStyle} />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          "Processing..."
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${amount}
          </>
        )}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [planDetails, setPlanDetails] = useState<{
    name: string;
    price: number;
    features: string[];
  } | null>(null);

  useEffect(() => {
    // Get booking data from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get("plan");
    const eventId = urlParams.get("eventId");
    const ticketType = urlParams.get("ticketType");
    const quantity = urlParams.get("quantity");
    const price = urlParams.get("price");

    // Handle event booking
    if (eventId && ticketType && quantity && price) {
      setPlanDetails({
        name: `${ticketType} Ticket`,
        price: parseFloat(price) * parseInt(quantity),
        features: [
          "Event entry",
          "Digital ticket",
          "Email confirmation",
          "Customer support",
          "Mobile ticket access",
        ],
      });
      return;
    }

    // Handle subscription plans
    switch (plan) {
      case "premium":
        setPlanDetails({
          name: "Premium",
          price: 8.99,
          features: [
            "Unlimited guests",
            "AI-powered suggestions",
            "Advanced analytics",
            "Custom branding",
            "Priority support",
            "Export capabilities",
          ],
        });
        break;
      case "enterprise":
        setPlanDetails({
          name: "Enterprise",
          price: 29.99,
          features: [
            "Everything in Premium",
            "Team collaboration",
            "Advanced integrations",
            "Custom workflows",
            "Dedicated support",
            "SLA guarantee",
          ],
        });
        break;
      default:
        navigate("/pricing");
        return;
    }
  }, [navigate]);

  const handlePaymentSuccess = () => {
    navigate("/premium");
  };

  if (!planDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/pricing")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Upgrade to {planDetails.name} and unlock powerful features for your
            events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{planDetails.name} Plan</span>
                <span className="font-bold">${planDetails.price}/month</span>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4 flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>${planDetails.price}/month</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Your payment information is secure and encrypted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={planDetails.price}
                  planName={planDetails.name}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-2">Secured by Stripe</p>
                <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                  <span>🔒 SSL Encrypted</span>
                  <span>•</span>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
