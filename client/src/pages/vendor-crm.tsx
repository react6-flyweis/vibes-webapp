import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/vendor-crm/Overview";
import Pipeline from "@/components/vendor-crm/Pipeline";
import Outreach from "@/components/vendor-crm/Outreach";
import Templates from "@/components/vendor-crm/Templates";
import Analytics from "@/components/vendor-crm/Analytics";
import Automation from "@/components/vendor-crm/Automation";

export default function VendorCRM() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">CRM Vendor Outreach</h1>
          <p className="text-sm text-muted-foreground">
            Manage your vendor pipeline from discovery to activation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button size="sm">+ Add Lead</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Overview />
        </TabsContent>

        <TabsContent value="pipeline">
          <Pipeline />
        </TabsContent>

        <TabsContent value="outreach">
          <Outreach />
        </TabsContent>

        <TabsContent value="templates">
          <Templates />
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="automation">
          <Automation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
