import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useVibeFundCampaigns } from "@/queries/vibeFundCampaigns";

const DiscoverTab: React.FC = () => {
  const { data: campaigns, isLoading, isError, error } = useVibeFundCampaigns();

  return (
    <div>
      {/* Search / Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search campaigns..." className="pl-10" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="reward">Reward</SelectItem>
              <SelectItem value="equity">Equity</SelectItem>
              <SelectItem value="donation">Donation</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">Create</Button>
        </div>
      </div>

      <Separator />
      {/* Content */}
      <div className="py-6">
        {isLoading ? (
          <div className="text-center py-12">Loading campaigns…</div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">
            Error loading campaigns
          </div>
        ) : !campaigns || campaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl text-gray-400">🔍</div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                No campaigns found
              </h2>
              <p className="text-sm text-gray-500 max-w-2xl">
                Try adjusting your search filters
              </p>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
