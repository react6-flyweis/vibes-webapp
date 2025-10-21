import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router";
import launchFundIcon from "@/assets/icons/lauchfund.svg";
import {
  DiscoverTab,
  FeaturedTab,
  CreateTab,
  MyCampaignsTab,
  // SmartAITab,
} from "@/components/launchfund";

const tabs = [
  { key: "discover", label: "Discover" },
  { key: "featured", label: "Featured" },
  { key: "create", label: "Create" },
  { key: "my-campaigns", label: "My Campaigns" },
  // { key: "smart-ai", label: "Smart AI" },
];

export default function VibesLaunchFund() {
  const location = useLocation();

  // Determine active tab from current pathname. Expect routes like /vibes-fund/:tab
  const parts = location.pathname.split("/").filter(Boolean);
  const activeTab = parts[1] || "discover"; // if path is /vibes-fund or /vibes-fund/

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl bg-gray-50 ">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2">
            <img
              src={launchFundIcon}
              alt="Vibes LaunchFund"
              className="w-12 h-12"
            />
            <h1 className="text-3xl font-extrabold bg-gradient-primary text-transparent bg-clip-text">
              Vibes LaunchFund
            </h1>
          </div>
          <p className="max-w-2xl text-gray-500 dark:text-gray-300">
            Raise pre-seed capital from friends, fans, and the community with
            rewards, equity, or donation-based crowdfunding campaigns.
          </p>
        </div>

        <div className="space-y-4">
          {/* Use Radix Tabs but control active state via route. Tabs value must match label to maintain styling, so map keys to labels */}
          <Tabs
            value={
              // find label for activeTab key, fallback to Discover
              tabs.find((t) => t.key === activeTab)?.label || "Discover"
            }
          >
            {/* Tabs (centered) */}
            <div className="flex justify-center">
              <TabsList className="inline-flex items-center gap-2 bg-transparent rounded-lg p-1">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.label}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {/* Link to the subroute so clicking updates the URL */}
                    <Link to={`/vibes-fund/${t.key}`}>{t.label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="Discover">
              <DiscoverTab />
            </TabsContent>

            {/* Placeholder contents for other tabs to avoid UI jump */}
            <TabsContent value="Featured">
              <FeaturedTab />
            </TabsContent>

            <TabsContent value="Create">
              <CreateTab />
            </TabsContent>

            <TabsContent value="My Campaigns">
              <MyCampaignsTab />
            </TabsContent>

            {/* <TabsContent value="Smart AI">
              <SmartAITab />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
