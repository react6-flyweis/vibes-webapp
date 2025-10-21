import React from "react";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVibeFundCampaigns } from "@/queries/vibeFundCampaigns";

const SkeletonCard: React.FC = () => (
  <div className="border rounded-lg overflow-hidden shadow-sm bg-white p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-20 h-20 bg-gray-200 rounded" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const FeaturedTab: React.FC = () => {
  const { data: campaigns = [], isLoading, isError } = useVibeFundCampaigns();

  // show latest 5 by created_at (fallback to original order)
  const latestFive = React.useMemo(() => {
    if (!campaigns || campaigns.length === 0) return [];
    return [...campaigns]
      .sort((a, b) => {
        const ta = a.created_at ? Date.parse(a.created_at) : 0;
        const tb = b.created_at ? Date.parse(b.created_at) : 0;
        return tb - ta;
      })
      .slice(0, 5);
  }, [campaigns]);

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Featured Campaigns
          </h3>
          <p className="mt-1 text-sm text-gray-500 max-w-xl">
            Hand-picked exceptional campaigns making a difference
          </p>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-red-600">Error loading campaigns</div>
        ) : latestFive.length === 0 ? (
          <div className="text-center py-6 text-gray-600">No featured campaigns</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestFive.map((c) => (
              <div
                key={c._id}
                className="border rounded-lg overflow-hidden shadow-sm bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  {c.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.cover_image}
                      alt={c.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-2xl">
                      {c.emozi ?? "🎯"}
                    </div>
                  )}

                  <div className="flex-1">
                    <h4 className="text-md font-semibold">{c.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {c.campaign_description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Goal: ${c.funding_goal ?? "—"}
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedTab;
