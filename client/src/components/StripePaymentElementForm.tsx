import React from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

type Props = {
  clientSecret: string;
  onComplete?: (result: any) => void;
};

export default function StripePaymentElementForm({
  clientSecret,
  onComplete,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [elementMounted, setElementMounted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    // Ensure the PaymentElement has been mounted inside Elements.
    const paymentElement = elements.getElement(PaymentElement);
    if (!paymentElement || !elementMounted) {
      setError("Payment form is still loading. Please wait a moment and try again.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        onComplete && onComplete({ error: result.error });
      } else {
        // success
        onComplete && onComplete({ paymentIntent: result.paymentIntent });
      }
    } catch (err) {
      setError((err as any)?.message || String(err));
      onComplete && onComplete({ error: err });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <PaymentElement
            onReady={() => setElementMounted(true)}
        />
        {!elementMounted && (
          <div className="text-sm text-gray-500 mt-2">Loading payment form…</div>
        )}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex justify-end">
        {/* Disable submit while Stripe hasn't loaded, while processing, or
            while the PaymentElement hasn't mounted yet. This prevents the
            "elements should have a mounted Payment Element" error. */}
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing || !elements.getElement(PaymentElement)}
        >
          {isProcessing ? "Processing..." : "Confirm Payment"}
        </Button>
      </div>
    </form>
  );
}
