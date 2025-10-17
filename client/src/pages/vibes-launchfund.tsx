import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import launchFundIcon from "@/assets/icons/lauchfund.svg";
import {
  DiscoverTab,
  FeaturedTab,
  CreateTab,
  MyCampaignsTab,
  SmartAITab,
} from "@/components/launchfund";

const tabs = ["Discover", "Featured", "Create", "My Campaigns", "Smart AI"];

export default function VibesLaunchFund() {
  const [active, setActive] = useState<string>("Discover");

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
          <Tabs value={active} onValueChange={(v) => setActive(v)}>
            {/* Tabs (centered) */}
            <div className="flex justify-center">
              <TabsList className="inline-flex items-center gap-2 bg-transparent rounded-lg p-1">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {t}
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

            <TabsContent value="Smart AI">
              <SmartAITab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
