import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import ClientsTab from "./corporate/ClientsTab";
import EventsTab from "./corporate/EventsTab";
import PricingTab from "./corporate/PricingTab";
import AnalyticsTab from "./corporate/AnalyticsTab";
import { useCorporateDashboard } from "@/hooks/useCorporateDashboard";

export default function CorporateDashboard() {
  const navigate = useNavigate();

  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const routeTab = pathSegments[1]; // index 0: 'corporate-dashboard', index 1: tab
  const allowed = ["clients", "events", "pricing", "analytics"];
  const initialTab = allowed.includes(routeTab || "")
    ? (routeTab as string)
    : "clients";
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const {
    data: dashboardData,
    isLoading,
    isError,
    error,
  } = useCorporateDashboard();

  function goToTab(tab: string) {
    setActiveTab(tab);
    // navigate to URL with param, keep base path
    // Use absolute path to avoid relative navigation which can concatenate
    // segments repeatedly (e.g. /pricing/pricing/analytics/...)
    navigate(`/corporate-dashboard/${tab}`, { replace: false });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Corporate Dashboard
          </h1>
          <p className="text-xl text-slate-200">
            Manage white-label corporate event platform clients
          </p>
        </div>

        {/* Stats Overview (generated from a small config) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <div className="col-span-full text-center text-slate-300">
              Loading corporate dashboard...
            </div>
          ) : isError ? (
            <div className="col-span-full text-center text-red-400">
              Failed to load dashboard: {String((error as any)?.message)}
            </div>
          ) : (
            [
              {
                id: "totalClients",
                label: "Total Clients",
                value: dashboardData?.totalClients ?? 0,
                icon: <Building2 className="h-8 w-8 text-purple-400" />,
              },
              {
                id: "monthlyRevenue",
                label: "Monthly Revenue",
                value: `$${(
                  dashboardData?.monthlyRevenue ?? 0
                ).toLocaleString()}`,
                icon: <DollarSign className="h-8 w-8 text-green-400" />,
              },
              {
                id: "eventsThisMonth",
                label: "Events This Month",
                value: dashboardData?.eventsThisMonth ?? 0,
                icon: <Calendar className="h-8 w-8 text-blue-400" />,
              },
              {
                id: "growthRate",
                label: "Growth Rate",
                value: `+${dashboardData?.growthRate ?? 0}%`,
                icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
              },
            ].map((s) => (
              <Card
                key={s.id}
                className="bg-white/10 backdrop-blur-sm border-white/20"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm">{s.label}</p>
                      <p className="text-white text-2xl font-bold">{s.value}</p>
                    </div>
                    {s.icon}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => goToTab(v)}
          className="space-y-6"
        >
          {/* Centered white tab bar with rounded triggers */}
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white/10 text-slate-200 backdrop-blur-xs border-[#FFFFFF1A] border mx-auto max-w-3xl">
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Pricing Plans
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="pricing">
            <PricingTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
