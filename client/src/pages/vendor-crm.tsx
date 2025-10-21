import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Overview from "@/components/vendor-crm/Overview";
import Pipeline from "@/components/vendor-crm/Pipeline";
import Outreach from "@/components/vendor-crm/Outreach";
import Templates from "@/components/vendor-crm/Templates";
import Analytics from "@/components/vendor-crm/Analytics";
import Automation from "@/components/vendor-crm/Automation";

const stats = [
  { title: "Total Leads", value: "847", sub: "+12% from last month" },
  { title: "Active Leads", value: "234", sub: "Currently in pipeline" },
  { title: "Conversion Rate", value: "18.4%", sub: "+2.3% improvement" },
  {
    title: "Avg. Time to Convert",
    value: "12.3 days",
    sub: "-1.2 days faster",
  },
];

const pipeline = [
  { stage: "Lead Discovered", count: 145, pct: 15.2 },
  { stage: "Contacted", count: 89, pct: 28.1 },
  { stage: "Interested", count: 67, pct: 42.7 },
  { stage: "Onboarding Started", count: 43, pct: 67.4 },
  { stage: "Activated", count: 29, pct: 85.2 },
  { stage: "Featured", count: 18, pct: 94.1 },
];

const recent = [
  {
    id: 1,
    title: "Partnership Opportunity with Vibes Event Platform",
    channel: "Email",
    date: "1/30/2025",
    status: "Pending Response",
  },
  {
    id: 2,
    title: "Collaboration Invite - Event Photography",
    channel: "Instagram",
    date: "1/30/2025",
    status: "Interested",
  },
];

const upcoming = [
  {
    id: 1,
    name: "Enchanted Gardens Florals",
    category: "Wedding Florals & Arrangements",
    priority: "High",
    eta: "1/31/2025",
  },
];

export default function VendorCRM() {
  const [templatesState, setTemplatesState] = React.useState(() => [
    {
      id: 1,
      title: "Initial Wedding Vendor Outreach",
      category: "Initial Contact",
      subject: "Partnership Opportunity: Join Vibes Premier Wedding Network",
      preview:
        "Hi {vendor_name}, I discovered your beautiful {product_type} on {platform} and was impressed by your {unique_selling_point}. Vibes is building a premium network of wedding vendors, and I believe yo...",
    },
    {
      id: 2,
      title: "Follow-up for Non-Responders",
      category: "Follow-up",
      subject: "Partnership Opportunity: Join Vibes Premier Wedding Network",
      preview:
        "Hi {vendor_name}, I discovered your beautiful {product_type} on {platform} and was impressed by your {unique_selling_point}. Vibes is building a premium network of wedding vendors, and I believe yo...",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newSubject, setNewSubject] = React.useState("");
  const [newMessage, setNewMessage] = React.useState("");

  function handleSaveTemplate() {
    const next = {
      id: Date.now(),
      title: newSubject || "Untitled Template",
      category: "Custom",
      subject: newSubject,
      preview: newMessage.slice(0, 120),
    };
    setTemplatesState((s) => [next, ...s]);
    setNewSubject("");
    setNewMessage("");
    setIsDialogOpen(false);
  }
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
          <Overview
            stats={stats}
            pipeline={pipeline}
            recent={recent}
            upcoming={upcoming}
          />
        </TabsContent>

        <TabsContent value="pipeline">
          <Pipeline pipeline={pipeline} />
        </TabsContent>

        <TabsContent value="outreach">
          <Outreach />
        </TabsContent>

        <TabsContent value="templates">
          <Templates
            templatesState={templatesState}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            newSubject={newSubject}
            setNewSubject={setNewSubject}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSaveTemplate={handleSaveTemplate}
          />
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
