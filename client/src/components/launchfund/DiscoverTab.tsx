import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { useVibeFundCampaigns } from "@/queries/vibeFundCampaigns";
import { BusinessCategorySelect } from "@/components/campaign/BusinessCategorySelect";
import { CampaignTypeSelect } from "@/components/campaign/CampaignTypeSelect";
import { useState } from "react";

const DiscoverTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [selectedCampaignType, setSelectedCampaignType] = useState<
    string | undefined
  >(undefined);

  // paging / search / sort state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);
  const params = {
    page,
    limit,
    search: debouncedSearch,
    status: true,
    approved_status: "",
    business_category_id: selectedCategory,
    compaign_type_id: selectedCampaignType,
    sortBy,
    sortOrder,
  };

  const {
    data: campaigns,
    isLoading,
    isError,
    error,
  } = useVibeFundCampaigns(params as any);

  return (
    <div>
      {/* Search / Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-40">
            <BusinessCategorySelect
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
            />
          </div>

          <div className="w-36">
            <CampaignTypeSelect
              value={selectedCampaignType}
              onChange={(val) => setSelectedCampaignType(val)}
            />
          </div>

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
