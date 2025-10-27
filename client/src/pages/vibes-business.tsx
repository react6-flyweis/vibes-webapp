import React, { useState } from "react";
import SubscribeDialog from "@/components/checkout/SubscribeDialog";
import PlanCard from "@/components/vibes-business/PlanCard";
import { useVibeBusinessSubscriptions } from "@/hooks/useVibeBusinessSubscriptions";
import { useVibeBusinessActiveSubscription } from "@/hooks/useVibeBusinessActiveSubscription";
import { Skeleton } from "@/components/ui/skeleton";

const VibesBusiness: React.FC = () => {
  // billing frequency toggle temporarily hidden — always show all plans

  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const {
    data: activeSubscription,
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
  } = useVibeBusinessActiveSubscription();

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isError: isError,
    error,
  } = useVibeBusinessSubscriptions({
    enabled: !isActiveLoading && !activeSubscription?.status,
  });

  const isLoading = isActiveLoading || isPlansLoading;
  // show all plans for now
  const filteredPlans = plans;

  return (
    <div className="vibes-business-page min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 to-purple-700 p-8">
      <div className="max-w-6xl w-full">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold">Vibe Business Subscription</h1>
          <p className="mt-2 opacity-80">Select your Plan</p>
        </header>

        {/* billing frequency toggle temporarily hidden — showing all plans */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isActiveLoading ? (
            // show a single skeleton while active-subscription check runs
            <div className="col-span-1 md:col-span-3">
              <div className="card rounded-xl p-6 shadow-2xl">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-10 w-56 mb-2" />
                <Skeleton className="h-5 w-full mb-4" />
              </div>
            </div>
          ) : activeSubscription?.status ? (
            // User already has an active subscription — show details and skip plan selection
            <div className="col-span-1 md:col-span-3 text-center text-white opacity-90">
              <div className="mx-auto max-w-xl bg-white bg-opacity-6 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold">
                      Active Subscription
                    </div>
                    <div className="text-sm opacity-80">
                      Plan ID: {activeSubscription.plan_id}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-70">
                      Status: {activeSubscription.transaction_status}
                    </div>
                    <div className="text-sm opacity-70">
                      Txn: #{activeSubscription.transaction_id}
                    </div>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  Starts:{" "}
                  {new Date(
                    activeSubscription.start_plan_date || ""
                  ).toLocaleDateString()}{" "}
                  — Ends:{" "}
                  {new Date(
                    activeSubscription.end_plan_date || ""
                  ).toLocaleDateString()}
                </div>
                <div className="mt-4 text-sm opacity-75">
                  You already have an active subscription. To change plans,
                  please manage your subscription from your account.
                </div>
              </div>
            </div>
          ) : isPlansLoading ? (
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
                    setOpen(true);
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <SubscribeDialog
        open={open}
        onOpenChange={(isOpen: boolean) => {
          setOpen(isOpen);
          if (!isOpen) setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
};

export default VibesBusiness;
