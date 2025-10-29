import { axiosInstance } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export type RevenueImpact = {
  _id: null | string | number;
  totalRevenue: number;
  transactionCount: number;
  avgTransactionValue: number;
};

export type EventAnalyticsItem = {
  _id: number | string;
  count: number;
  avgCapacity: number;
  totalCapacity: number;
};

export type PremiumTheme = {
  theme_id: number;
  name: string;
  category: string;
  usage_count: number;
  revenue_generated: number;
  // optional UI fields used by ThemesTab
  previewImg?: string;
  description?: string;
  colors?: string[];
  features?: string[];
};

export type Reports = {
  analytics: {
    event_analytics: EventAnalyticsItem[];
    guest_analytics: any[];
    rsvp_breakdown: { _id: string; count: number }[];
    revenue_breakdown: RevenueImpact;
  };
  premium_themes: PremiumTheme[];
  automation: Record<string, number>;
  export_tools: Record<string, number>;
};

export type PremiumDashboardData = {
  total_events: number;
  total_guests: number;
  avg_rsvp_rate: number;
  revenue_impact: RevenueImpact;
  growth_metrics: {
    event_growth_rate: number;
    current_month_events: number;
    last_month_events: number;
  };
  reports: Reports;
  period: {
    current_month: { start: string; end: string };
    last_month: { start: string; end: string };
  };
};

export type PremiumDashboardResponse = {
  success: true;
  message: string;
  data: PremiumDashboardData;
  timestamp: string;
};

async function fetchPremiumDashboard(): Promise<PremiumDashboardData> {
  const res = await axiosInstance.get<PremiumDashboardResponse>(
    "/api/vendor/premium-dashboard/"
  );
  return res.data.data;
}

export function usePremiumDashboardQuery() {
  return useQuery<PremiumDashboardData>({
    queryKey: ["premiumDashboard"],
    queryFn: fetchPremiumDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    // cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
