import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";
import PlanCard from "@/components/vibes-business/PlanCard";
import { useVibeBusinessSubscriptions } from "@/hooks/useVibeBusinessSubscriptions";
import { Skeleton } from "@/components/ui/skeleton";

const VibesBusiness: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const [open, setOpen] = useState(false);
  const {
    data: plans,
    isLoading,
    isError,
    error,
  } = useVibeBusinessSubscriptions();
  const filteredPlans = (plans || []).filter((p) => {
    if (isAnnual) return /ann/i.test(p.planDuration || "");
    return !/ann/i.test(p.planDuration || "");
  });

  return (
    <div className="vibes-business-page min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-950 to-purple-700 p-8">
      <div className="max-w-6xl w-full">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold">Vibe Business Subscription</h1>
          <p className="mt-2 opacity-80">Select your Plan</p>
        </header>

        <div className="flex items-center justify-center space-x-6 mb-8">
          <span className="text-white mr-3 font-semibold">Monthly</span>

          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="bg-black"
          />

          <span className="text-white ml-3 font-semibold">Annually</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
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
                  onSelect={() => setOpen(true)}
                />
              ))}
            </>
          )}
        </div>
      </div>
      {/* Checkout dialog extracted to component */}
      <React.Suspense>
        {/* lazy-loading unnecessary here but keeps parity with other code-split pages */}
        {/* import locally to avoid circular imports at top-level */}
        <CheckoutDialog open={open} onOpenChange={setOpen} />
      </React.Suspense>
    </div>
  );
};

export default VibesBusiness;
