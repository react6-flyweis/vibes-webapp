import React, { useState } from "react";
// import SubscribeDialog from "@/components/checkout/SubscribeDialog";
import PlanCard from "@/components/vibes-business/PlanCard";
import ActiveSubscriptionCard from "@/components/vibes-business/ActiveSubscriptionCard";
import PriceConfirmationDialog from "@/components/PriceConfirmationDialog";
import PaymentSuccessDialog from "@/components/checkout/PaymentSuccessDialog";
import { useVibeBusinessSubscriptions } from "@/hooks/useVibeBusinessSubscriptions";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { axiosInstance } from "@/lib/queryClient";
import { useVibeBusinessActiveSubscription } from "@/hooks/useVibeBusinessActiveSubscription";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";

const VibesBusiness: React.FC = () => {
  // billing frequency toggle temporarily hidden — always show all plans

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPayload, setSuccessPayload] = useState<{
    amount?: string;
    ref?: string;
    method?: string;
    sender?: string;
    time?: string;
  } | null>(null);
  const createSubscriptionMutation = useCreateSubscription();
  const { data: activeSubscriptions, isLoading: isActiveLoading } =
    useVibeBusinessActiveSubscription();

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isError,
    error,
  } = useVibeBusinessSubscriptions({
    enabled: !isActiveLoading && !activeSubscriptions?.length,
  });

  const filteredPlans = plans;

  const authUse = useAuthStore((state) => state.user);

  if (isActiveLoading) {
    return (
      <div className="vibes-business-page min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 to-purple-600 p-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <div className="card rounded-xl p-6 shadow-2xl">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-10 w-56 mb-2" />
                <Skeleton className="h-5 w-full mb-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vibes-business-page min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 to-purple-600 p-8">
      <div className="max-w-6xl w-full">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold">Vibe Business Subscription</h1>
          {/* <p className="mt-2 opacity-80">Select your Plan</p> */}
        </header>

        {/* If active subscription exists, show only the ActiveSubscriptionCard and return early */}
        {activeSubscriptions?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3 text-white opacity-95">
              <ActiveSubscriptionCard subscription={activeSubscriptions[0]} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isPlansLoading ? (
              // show 3 skeleton cards to match grid layout
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card rounded-xl p-6 shadow-2xl">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-10 w-56 mb-2" />
                  <Skeleton className="h-5 w-full mb-4" />
                  <div className="space-y-2 mb-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))
            ) : isError ? (
              <div className="col-span-1 md:col-span-3 text-center text-red-400">
                {(error as any)?.message || "Failed to load plans"}
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="col-span-1 md:col-span-3 text-center text-white opacity-80">
                <div className="inline-block bg-white bg-opacity-6 rounded-full p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m4-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-lg font-semibold">
                  No subscriptions found
                </div>
                <div className="text-sm opacity-70 mt-2">
                  Try switching billing frequency or check back later.
                </div>
              </div>
            ) : (
              <>
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={plan._id}
                    plan={plan}
                    onSelect={() => {
                      setSelectedPlan(plan);
                      // derive a numeric price estimate (fallback 0)
                      setPriceEstimate(Number(plan.price ?? 0));
                      setOpen(true);
                    }}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Only render dialogs when there is no active subscription */}
      {!activeSubscriptions?.length && (
        <>
          <PriceConfirmationDialog
            open={open}
            onOpenChange={(isOpen: boolean) => {
              setOpen(isOpen);
              if (!isOpen) setSelectedPlan(null);
            }}
            priceEstimate={priceEstimate}
            onConfirm={async (payment: any) => {
              // payment is the final payload returned from the backend or Stripe
              // create subscription record using the existing hook
              if (!selectedPlan) return;

              try {
                const payload = {
                  user_id: authUse?.user_id || 0,
                  plan_id: Number(
                    selectedPlan.plan_id ?? selectedPlan.plan_id ?? 0
                  ),
                  payment_method_id:
                    (payment?.payment_method_id as number) || 1,
                  start_plan_date: new Date().toISOString(),
                  end_plan_date: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  ).toISOString(),
                  status: true,
                };

                const res = await createSubscriptionMutation.mutateAsync(
                  payload
                );

                // try to extract useful success details to show in the success dialog
                const amountStr =
                  (payment?.amount ||
                    payment?.paymentIntent?.amount ||
                    priceEstimate) + "";

                const ref = res?.data?.transaction?.transaction_id;

                setSuccessPayload({
                  amount: `$${amountStr}`,
                  ref: String(ref),
                  method: payment?.payment_method || "Card",
                  sender: payment?.payer_name || "You",
                  time: new Date().toLocaleString(),
                });
                setShowSuccess(true);
              } catch (err) {
                // swallow here; the dialog already closed. In a real app show toast.
                console.error(
                  "Failed to create subscription after payment:",
                  err
                );
              }
            }}
            onPrevious={() => setOpen(false)}
            onMethodSelect={async (method: number) => {
              // call the payment creation endpoint
              if (!selectedPlan) throw new Error("No plan selected");

              const body = {
                vibe_business_plan_subscribed_id: Number(
                  selectedPlan.vibe_business_plan_subscribed_id ??
                    selectedPlan.plan_id ??
                    0
                ),
                payment_method_id: method,
                billingDetails: {},
              };

              const res = await axiosInstance.post(
                "/api/master/vibe-business-plan-subscribed/payment",
                body
              );

              // Expect the API to return the payment intent payload
              return res.data?.data?.paymentIntent;
            }}
          />

          <PaymentSuccessDialog
            open={showSuccess}
            onOpenChange={(open) => {
              setShowSuccess(open);
              if (!open) {
                setSuccessPayload(null);
                // reload the page to reflect new subscription state
                window.location.reload();
              }
            }}
            amount={successPayload?.amount || "$0"}
            refNumber={successPayload?.ref || ""}
            paymentMethod={successPayload?.method}
            senderName={successPayload?.sender}
            time={successPayload?.time}
          />
        </>
      )}
    </div>
  );
};

export default VibesBusiness;
