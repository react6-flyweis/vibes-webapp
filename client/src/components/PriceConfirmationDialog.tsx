import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";
import { usePaymentMethods } from "@/queries/getPaymentMethods";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentIntent } from "@/mutations/useCreateEntryTicketsPayment";
import { useConfirmPayment } from "@/mutations/useConfirmPayment";
import StripePaymentElementForm from "./StripePaymentElementForm";
import { useCheckPaymentStatus } from "@/mutations/useCheckPaymentStatus";
import { extractApiErrorMessage } from "@/lib/apiErrors";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  priceEstimate: number;
  onConfirm: (payment: any) => void;
  onPrevious: () => void;
  orderResponse?: any;
  paymentIntent?: any;
  onMethodSelect: (method: number) => Promise<PaymentIntent>;
};

export default function PriceConfirmationDialog({
  open,
  onOpenChange,
  priceEstimate,
  onConfirm,
  onPrevious,
  onMethodSelect,
}: Props) {
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [method, setMethod] = React.useState<number>(1);
  const [stripePromise, setStripePromise] = React.useState<any>(null);
  const [showStripeElements, setShowStripeElements] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [createdPaymentIntent, setCreatedPaymentIntent] =
    React.useState<PaymentIntent | null>(null);
  const confirmPaymentMutation = useConfirmPayment();
  const [pollPaymentIntentId, setPollPaymentIntentId] = React.useState<
    string | null
  >(null);
  const [confirmResponse, setConfirmResponse] = React.useState<any | null>(
    null
  );

  const checkQuery = useCheckPaymentStatus(
    pollPaymentIntentId,
    !!pollPaymentIntentId
  );

  // watch the polling query and finalize when payment reaches a terminal state
  React.useEffect(() => {
    if (!checkQuery.data) return;

    // normalize where the backend might put the status
    const payloadAny: any = checkQuery.data?.data.data;

    console.log("Polling payment status:", payloadAny);

    const status =
      payloadAny?.payment_status ||
      payloadAny?.status ||
      payloadAny?.payment_intent?.status ||
      payloadAny?.paymentIntent?.status ||
      null;

    if (!status) return;

    // success / confirmed states
    if (
      status === "succeeded" ||
      status === "confirmed" ||
      status === "confirm"
    ) {
      // bubble up the original confirm response if present, otherwise the check payload
      onConfirm(confirmResponse?.data ?? payloadAny ?? checkQuery.data);
      // stop polling and clear stored confirm response
      setPollPaymentIntentId(null);
      setConfirmResponse(null);
      // close dialog
      onOpenChange(false);
      return;
    }

    // handle terminal failure states
    if (
      status === "requires_payment_method" ||
      status === "canceled" ||
      status === "failed"
    ) {
      setPaymentError(`Payment ${status}`);
      setPollPaymentIntentId(null);
      setConfirmResponse(null);
    }
  }, [checkQuery.data]);

  const { data: methods, isLoading, isError } = usePaymentMethods();

  const clientSecret = createdPaymentIntent?.clientSecret;
  const elementsOptions = React.useMemo(
    () => ({ clientSecret }),
    [clientSecret]
  );

  // Clear transient UI state when the dialog is closed so errors don't persist
  React.useEffect(() => {
    if (!open) {
      setPaymentError(null);
      setShowStripeElements(false);
      setCreatedPaymentIntent(null);
      setPollPaymentIntentId(null);
      setConfirmResponse(null);
      setIsProcessing(false);
    }
  }, [open]);

  const handleMethodSelect = async () => {
    setPaymentError(null);
    // if (!onMethodSelect) {
    //   setPaymentError("Payment method selection is not available.");
    //   return;
    // }
    setIsProcessing(true);
    try {
      console.log("Selected method:", method);
      const paymentIntent = await onMethodSelect(method);
      console.log("Created Payment Intent:", paymentIntent);
      setCreatedPaymentIntent(paymentIntent);
      setShowStripeElements(true);
    } catch (err) {
      const errorMessage = extractApiErrorMessage(err);
      setPaymentError(errorMessage || "Failed to process payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Always preload Stripe when the dialog opens so Elements are ready regardless of method
  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!stripePromise && open) {
          const { loadStripe } = await import("@stripe/stripe-js");
          const key =
            import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
            import.meta.env.VITE_STRIPE_PUBLIC ||
            undefined;
          const publicKey = key || undefined;

          if (!publicKey) {
            // If the public key isn't configured, surface a helpful error so
            // developers know why Stripe Elements won't load.
            setPaymentError(
              "Stripe public key is not configured (VITE_STRIPE_PUBLIC_KEY)."
            );
            return;
          }

          const promise = loadStripe(publicKey as string);
          if (mounted) setStripePromise(promise);
        }
      } catch (err) {
        // ignore preload errors here; they'll be surfaced on actual use
        // but set payment error for visibility
        setPaymentError((err as any)?.message || String(err));
      }
    };

    if (open) load();
    return () => {
      mounted = false;
    };
    // only run when dialog opens/closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-start justify-between">
          <DialogTitle className="text-lg font-semibold">
            Price & Confirmation
          </DialogTitle>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-6">
            <div className="text-sm text-gray-700">Price Estimation:</div>
            <div className="text-2xl font-bold">{priceEstimate}$</div>
          </div>

          <div className="mb-4">
            {/* Only show payment options and navigation when the Stripe form is not visible */}
            {!showStripeElements ? (
              <>
                <div className="text-sm mb-3">Payment Options:</div>
                {isLoading && (
                  <div className="text-sm text-gray-500">Loading...</div>
                )}
                {isError && (
                  <div className="text-sm text-red-500">
                    Failed to load payment methods
                  </div>
                )}
                {!isLoading && !isError && (
                  <div className="flex gap-4">
                    {methods && methods.length > 0 ? (
                      methods.map((m) => {
                        // derive a safe key for method
                        const key = m.payment_methods_id;
                        return (
                          <button
                            key={m._id}
                            className={`flex-1 p-4 border rounded ${
                              method === key
                                ? "border-blue-500"
                                : "border-gray-300"
                            }`}
                            onClick={() => setMethod(key)}
                            type="button"
                          >
                            <span className="mr-2">{m.emoji ?? ""}</span>
                            {m.payment_method}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-sm text-gray-500">
                        No payment methods available
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onPrevious();
                      onOpenChange(false);
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={handleMethodSelect} disabled={isProcessing}>
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Pay
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : null}

            {/* Always show payment errors */}
            {paymentError && (
              <div className="text-sm text-red-500 mt-3">{paymentError}</div>
            )}

            {/* Stripe form or pending UI */}
            {pollPaymentIntentId ? (
              <div className="mt-4 flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-sm text-gray-700">Payment pending…</div>
              </div>
            ) : (
              showStripeElements &&
              stripePromise &&
              clientSecret && (
                <div className="mt-4">
                  <Elements
                    key={clientSecret}
                    stripe={stripePromise}
                    options={elementsOptions}
                  >
                    <StripePaymentElementForm
                      clientSecret={clientSecret}
                      onComplete={async (result: any) => {
                        if (!result) return;
                        if (result.error) {
                          setPaymentError(
                            result.error?.message || "Payment failed"
                          );
                          return;
                        }

                        const paymentIntent = result.paymentIntent;
                        if (!paymentIntent || !paymentIntent.id) {
                          setPaymentError(
                            "No payment intent returned from Stripe."
                          );
                          return;
                        }

                        // Confirm the payment on our backend and start polling
                        setPaymentError(null);
                        setIsProcessing(true);
                        try {
                          const payment_method_id =
                            paymentIntent.payment_method ||
                            paymentIntent.latest_payment_method ||
                            null;

                          const payload = {
                            payment_intent_id: paymentIntent.id,
                            payment_method_id,
                          } as any;

                          const res = await confirmPaymentMutation.mutateAsync(
                            payload
                          );
                          setConfirmResponse(res);
                          setPollPaymentIntentId(paymentIntent.id);
                        } catch (err) {
                          setPaymentError(
                            (err as any)?.message || "Failed to confirm payment"
                          );
                        } finally {
                          setIsProcessing(false);
                        }
                      }}
                    />
                  </Elements>
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
