import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SecureCheckoutTab from "@/components/backers/SecureCheckoutTab";
import CommentsQATab from "@/components/backers/CommentsQATab";
import NotificationsTab from "@/components/backers/NotificationsTab";
import ReceiptSystemTab from "@/components/backers/ReceiptSystemTab";
import ShareCampaignTab from "@/components/backers/ShareCampaignTab";

const tabs = [
  { key: "secure-checkout", label: "Secure Checkout" },
  { key: "comments-qa", label: "Comments & Q&A" },
  { key: "share-campaign", label: "Share Campaign" },
  { key: "notifications", label: "Notifications" },
  { key: "receipt-system", label: "Receipt System" },
];

export default function BackersDashboard() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const activeTabKey = parts[1] || "secure-checkout";

  const [providers, setProviders] = useState<any[]>([
    {
      id: "p_stripe",
      name: "Stripe",
      status: "Active",
      lastTested: "26 Sep 2025",
      editable: true,
    },
    {
      id: "p_flutter",
      name: "Flutter wave",
      status: "Pending",
      lastTested: null,
      editable: false,
    },
    {
      id: "p_paystack",
      name: "Paystack",
      status: "Disabled",
      lastTested: "20 Sep 2025",
      editable: true,
    },
  ]);

  const [comments, setComments] = useState<any[]>([
    {
      id: "c_raj",
      user: "Raj",
      date: "26 Sep 2025",
      text: "Excited to support this project!",
      status: "Approved",
      actions: { type: "view" },
    },
    {
      id: "c_anu",
      user: "Anu",
      date: "26 Sep 2025",
      text: "How are shipping costs handled?",
      status: "Pending",
      actions: { type: "moderate" },
    },
  ]);

  const [notifications] = useState<any[]>([
    {
      id: "n_milestone_50",
      title: "50% Milestone Reached",
      date: "24 Sep 2025",
      type: "Milestone",
      sentTo: "All",
      status: "Sent",
      actions: [{ label: "View", className: "text-blue-600" }],
    },
    {
      id: "n_campaign_update",
      title: "New Update Available",
      date: "28 Sep 2025",
      type: "Campaign",
      sentTo: "Tier 1",
      status: "Scheduled",
      actions: [
        { label: "Edit", className: "text-blue-600" },
        { label: "Cancel", className: "text-red-600" },
      ],
    },
  ]);

  const [receipts] = useState<any[]>([
    {
      id: "trx001",
      transactionId: "TRX001",
      backer: "Priya",
      amount: "$200",
      provider: "Stripe",
      status: "Success",
      date: "24 Sep 2025",
      action: "download",
    },
    {
      id: "trx002",
      transactionId: "TRX002",
      backer: "John",
      amount: "$60",
      provider: "Pay stack",
      status: "Failed",
      date: "23 Sep 2025",
      action: "retry",
    },
    {
      id: "trx003",
      transactionId: "TRX003",
      backer: "Meena",
      amount: "$300",
      provider: "Flutter wave",
      status: "Success",
      date: "22 Sep 2025",
      action: "download",
    },
  ]);

  const [shareLinks] = useState<any[]>([
    {
      id: "s_whatsapp",
      platform: "WhatsApp",
      short: "/eco-wa",
      clicks: 243,
      conversions: 12,
      action: "copy",
    },
    {
      id: "s_facebook",
      platform: "Facebook",
      short: "/eco-fb",
      clicks: 180,
      conversions: 8,
      action: "copy",
    },
    {
      id: "s_qr",
      platform: "QR Code",
      short: "/eco-qr",
      clicks: 50,
      conversions: 4,
      action: "download",
    },
  ]);

  function handleConnect(id: string) {
    setProviders((ps) =>
      ps.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Disabled" : "Pending" }
          : p
      )
    );
  }

  function handleEdit(id: string) {
    // placeholder: open modal or navigate to provider settings
    alert(`Edit provider ${id}`);
  }

  return (
    <div className="bg-gray-50 py-5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 py-10 text-center">
          <h1 className="text-5xl mb-2 font-bold text-transparent bg-clip-text bg-gradient-primary">
            Backers Experience
          </h1>
          <p className="text-muted-foreground">
            Manage backer interactions, payments, notifications, and receipts to
            deliver a seamless and trustworthy supporter journey.
          </p>
        </div>

        <div className="mb-6">
          <Tabs
            value={
              tabs.find((t) => t.key === activeTabKey)?.label ||
              "Secure Checkout"
            }
          >
            <div className="flex justify-center">
              <TabsList className="inline-flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.label}
                    className="px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Link to={`/backer-experience/${t.key}`}>{t.label}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="Secure Checkout">
              <SecureCheckoutTab
                providers={providers}
                onConnect={handleConnect}
                onEdit={handleEdit}
              />
            </TabsContent>

            <TabsContent value="Comments & Q&A">
              <CommentsQATab comments={comments} />
            </TabsContent>

            <TabsContent value="Share Campaign">
              <ShareCampaignTab shareLinks={shareLinks} />
            </TabsContent>

            <TabsContent value="Notifications">
              <NotificationsTab notifications={notifications} />
            </TabsContent>

            <TabsContent value="Receipt System">
              <ReceiptSystemTab receipts={receipts} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
