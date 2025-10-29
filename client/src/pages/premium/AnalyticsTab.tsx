import React from "react";
import type { Reports } from "@/api/premiumDashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const eventAnalytics = [
  { name: "Jan", events: 12, guests: 240, revenue: 1200 },
  { name: "Feb", events: 18, guests: 360, revenue: 1800 },
  { name: "Mar", events: 24, guests: 480, revenue: 2400 },
  { name: "Apr", events: 30, guests: 600, revenue: 3000 },
  { name: "May", events: 36, guests: 720, revenue: 3600 },
];

const categoryData = [
  { name: "Birthday Parties", value: 45, color: "#3b82f6" },
  { name: "Corporate Events", value: 25, color: "#10b981" },
  { name: "Weddings", value: 20, color: "#f59e0b" },
  { name: "Other", value: 10, color: "#ef4444" },
];

const performanceMetrics = [
  { label: "Guest Satisfaction", value: 94, color: "#1db954" },
  { label: "Menu Completion Rate", value: 87, color: "#3b82f6" },
  { label: "Task Completion", value: 92, color: "#4f46e5" },
  { label: "Budget Accuracy", value: 78, color: "#fbbf24" },
];

const cardClasses =
  "bg-white/10 text-slate-200 border-slate-700 backdrop-blur-xs";

export default function AnalyticsTab({ reports }: { reports?: Reports }) {
  // map API event analytics into chart-friendly shape
  const barData =
    reports?.analytics?.event_analytics?.map((e) => ({
      name: String(e._id),
      events: e.count,
      avgCapacity: Math.round(e.avgCapacity),
      totalCapacity: e.totalCapacity,
    })) || eventAnalytics;

  // map RSVP breakdown to pie chart format
  const rsvpData =
    reports?.analytics?.rsvp_breakdown?.map((r) => ({
      name: String(r._id),
      value: r.count,
      color: undefined,
    })) || categoryData;

  // derive performance metrics from automation report when available
  const performanceMetricsFromReports = (() => {
    const autom = (reports && reports.automation) as any | undefined;
    if (!autom) return performanceMetrics;

    const vals = [
      autom.automated_emails_sent ?? 0,
      autom.automated_reminders ?? 0,
      autom.automated_follow_ups ?? 0,
      autom.time_saved_hours ?? 0,
    ];
    const max = Math.max(...vals, 1);

    return [
      {
        label: "Auto RSVP Tracking",
        value:
          autom.auto_rsvp_tracking ??
          Math.min(100, Math.round((vals[0] / max) * 100)),
        color: "#1db954",
      },
      {
        label: "Auto Emails",
        value: Math.min(
          100,
          Math.round(((autom.automated_emails_sent ?? 0) / max) * 100)
        ),
        color: "#3b82f6",
      },
      {
        label: "Reminders Sent",
        value: Math.min(
          100,
          Math.round(((autom.automated_reminders ?? 0) / max) * 100)
        ),
        color: "#4f46e5",
      },
      {
        label: "Time Saved",
        value: Math.min(
          100,
          Math.round(((autom.time_saved_hours ?? 0) / max) * 100)
        ),
        color: "#fbbf24",
      },
    ];
  })();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="text-white">Event Growth Trends</CardTitle>
            <CardDescription className="text-white">
              Monthly event and guest statistics
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.2)"
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="name" tick={{ fill: "#fff" }} />
                <YAxis tick={{ fill: "#fff" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="events" fill="#3b82f6" name="Events" />
                <Bar dataKey="avgCapacity" fill="#10b981" name="Avg Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardHeader>
            <CardTitle className="text-white">Event Categories</CardTitle>
            <CardDescription className="text-white">
              Distribution of event types
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rsvpData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {rsvpData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.color ??
                        categoryData[index % categoryData.length].color
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className={cardClasses}>
        <CardHeader>
          <CardTitle className="text-white">Performance Metrics</CardTitle>
          <CardDescription className="text-gray-300">
            Key performance indicators for your events
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {performanceMetricsFromReports.map((m, i) => (
            <div className="space-y-2" key={i}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-200">{m.label}</span>
                <span className="text-gray-100">{m.value}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${m.value}%`,
                    backgroundColor: m.color,
                    height: "100%",
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
