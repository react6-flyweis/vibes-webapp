import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMyVibeFundCampaigns } from "@/queries/myVibeFundCampaigns";

const MyCampaignsTab: React.FC = () => {
  const { data: campaigns, isLoading, isError } = useMyVibeFundCampaigns();

  if (isLoading) {
    // show skeleton grid matching the final layout
    return (
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border rounded-lg overflow-hidden shadow-sm bg-white p-4 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded" />

                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-8 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-600">
        Error loading your campaigns
      </div>
    );
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <PlusCircle className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          My Campaigns
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          You don't have any campaigns yet. Create your first campaign to get
          started.
        </p>

        <Button className="mt-6">
          <PlusCircle className="w-4 h-4 mr-2" /> Create Your First Campaign
        </Button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
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
                <h3 className="text-lg font-semibold">{c.title}</h3>
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
    </div>
  );
};

export default MyCampaignsTab;
