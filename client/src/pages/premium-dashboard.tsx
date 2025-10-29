import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Crown,
  Star,
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  BarChart2,
  Cpu,
  Palette,
  Zap,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnalyticsTab from "./premium/AnalyticsTab";
// import AiTab from "./premium/AiTab";
import ThemesTab from "./premium/ThemesTab";
import AutomationTab from "./premium/AutomationTab";
import ExportsTab from "./premium/ExportsTab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePremiumDashboardQuery } from "@/api/premiumDashboard";

const tabs = [
  { id: "analytics", label: "Analytics", path: "analytics" },
  // { id: "ai", label: "AI Insights", path: "ai" },
  { id: "themes", label: "Premium Themes", path: "themes" },
  { id: "automation", label: "Automation", path: "automation" },
  { id: "exports", label: "Export Tools", path: "exports" },
];

// default placeholder stats (will be replaced by API data when loaded)
const stats = [
  {
    id: "total-events",
    label: "Total Events",
    value: "--",
    hint: "",
    icon: <Calendar className="w-4 h-4 text-slate-100" />,
  },
  {
    id: "total-guests",
    label: "Total Guests",
    value: "--",
    hint: "",
    icon: <Users className="w-4 h-4 text-slate-100" />,
  },
  {
    id: "avg-rsvp",
    label: "Avg. RSVP Rate",
    value: "--",
    hint: "",
    icon: <TrendingUp className="w-4 h-4 text-slate-100" />,
  },
  {
    id: "revenue-impact",
    label: "Revenue Impact",
    value: "--",
    hint: "",
    icon: <DollarSign className="w-4 h-4 text-slate-100" />,
  },
];

export default function PremiumDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // derive active tab from pathname (last segment)
  const pathname = location.pathname;
  const initialTab = useMemo(() => {
    const segs = pathname.split("/").filter(Boolean);
    const last = segs[segs.length - 1] || "analytics";
    return tabs.find((t) => t.path === last) ? last : "analytics";
  }, [pathname]);

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const { data, isLoading, isError, error } = usePremiumDashboardQuery();

  // keep state in sync when url changes externally
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  function goToTab(tabPath: string) {
    setActiveTab(tabPath);
    // update URL to reflect active tab without full page reload
    // if current pathname already endsWith tabPath, do nothing
    if (!pathname.endsWith(tabPath)) {
      navigate(tabPath, { replace: false });
    }
  }

  function renderActive() {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsTab />;
      // case "ai":
      //   return <AiTab />;
      case "themes":
        return <ThemesTab />;
      case "automation":
        return <AutomationTab />;
      case "exports":
        return <ExportsTab />;
      default:
        return <AnalyticsTab />;
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0F172A 0%, #581C87 50%, #0F172A 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Crown className="w-8 h-8 text-yellow-500 mr-3" />
              Premium Dashboard
            </h1>
            <p className="text-white mt-2">
              Advanced insights and premium features for your events
            </p>
          </div>
          <Badge className="bg-yellow-500 text-white px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Premium Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s) => {
            // derive values from API data when present
            let value = s.value;
            let hint = s.hint;
            if (data) {
              if (s.id === "total-events") value = String(data.total_events);
              if (s.id === "total-guests") value = String(data.total_guests);
              if (s.id === "avg-rsvp") value = `${data.avg_rsvp_rate}%`;
              if (s.id === "revenue-impact")
                value = `$${data.revenue_impact?.totalRevenue ?? "0"}`;
              // small hints from growth metrics
              if (s.id === "total-events" && data.growth_metrics) {
                hint = `${data.growth_metrics.event_growth_rate}% from last month`;
              }
            }

            return (
              <div
                key={s.id}
                className="relative bg-white/10 text-slate-200 border-slate-700 backdrop-blur-xs p-4 rounded"
              >
                <div className="absolute top-3 right-3 bg-white/5 rounded p-2">
                  {s.icon}
                </div>
                <div className="text-sm text-gray-300">{s.label}</div>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : value}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {isLoading ? "Loading" : hint}
                </div>
              </div>
            );
          })}
        </div>

        {isError && (
          <div className="mb-6 p-4 rounded bg-red-600 text-white">
            {(error as any)?.message || "Failed to load premium dashboard"}
          </div>
        )}

        <nav className="mb-6">
          <Tabs value={activeTab} onValueChange={(v) => goToTab(v)}>
            <TabsList className="h-auto items-stretch grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white/10 text-slate-200  backdrop-blur-xs border-[#FFFFFF1A] border rounded">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.path}
                  className="p-3 text-center"
                >
                  <span className="inline-flex items-center justify-center mr-2">
                    {t.path === "analytics" && (
                      <BarChart2 className="w-4 h-4" />
                    )}
                    {t.path === "ai" && <Cpu className="w-4 h-4" />}
                    {t.path === "themes" && <Palette className="w-4 h-4" />}
                    {t.path === "automation" && <Zap className="w-4 h-4" />}
                    {t.path === "exports" && <Download className="w-4 h-4" />}
                  </span>
                  <span>{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>

        <div className="space-y-6">{renderActive()}</div>
      </div>
    </div>
  );
}
