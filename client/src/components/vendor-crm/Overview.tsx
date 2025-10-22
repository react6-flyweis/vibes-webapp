import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVendorOverview } from "@/hooks/useVendorOverview";
import { useVendorPipeline } from "@/hooks/useVendorPipeline";
import { useVendorRecentActivities } from "@/hooks/useVendorRecentActivities";
import { useVendorUpcomingFollowups } from "@/hooks/useVendorUpcomingFollowups";

export default function Overview() {
  const { data: overview, isLoading, isError, error } = useVendorOverview();
  const {
    data: pipelineData,
    isLoading: pipelineLoading,
    isError: pipelineError,
  } = useVendorPipeline();
  const {
    data: recentData,
    isLoading: recentLoading,
    isError: recentError,
  } = useVendorRecentActivities();
  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    isError: upcomingError,
  } = useVendorUpcomingFollowups();

  // prefer remote data if available, otherwise fallback to provided stats
  const displayStats = [
    {
      title: "Leads (Last Month)",
      value: overview?.totalLeadsLastMonth,
      sub: "Total leads in last 30 days",
    },
    {
      title: "Active Leads",
      value: overview?.activeLeads,
      sub: "Leads currently active",
    },
    {
      title: "Conversion Rate",
      value: `${overview?.conversionRate}%`,
      sub: "Overall conversion",
    },
    {
      title: "Avg Time to Convert",
      value: `${overview?.avgTimeToConvert} days`,
      sub: "Average days to convert",
    },
  ];

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-sm text-muted-foreground">
          Loading vendor overview...
        </div>
      )}
      {isError && (
        <div className="text-sm text-destructive">
          Failed to load vendor overview: {(error as any)?.message ?? "Unknown"}
        </div>
      )}
      {pipelineLoading && (
        <div className="text-sm text-muted-foreground">
          Loading pipeline overview...
        </div>
      )}
      {pipelineError && (
        <div className="text-sm text-destructive">
          Failed to load pipeline overview
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {displayStats.map((s: any) => (
          <Card key={s.title}>
            <CardHeader>
              <CardTitle className="text-sm">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
              <div>
                <Button size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                stage: "Lead Discovered",
                count: pipelineData?.leadDiscovered.totalCount,
                pct: pipelineData?.leadDiscovered.conversionRate ?? 0,
              },
              {
                stage: "Lead Contacted",
                count: pipelineData?.leadContacted.totalCount,
                pct: pipelineData?.leadContacted.conversionRate ?? 0,
              },
              {
                stage: "Onboarding Started",
                count: pipelineData?.onboardingStarted.totalCount,
                pct: pipelineData?.onboardingStarted.conversionRate ?? 0,
              },
              {
                stage: "Activated Leads",
                count: pipelineData?.activatedLeads.totalCount,
                pct: pipelineData?.activatedLeads.conversionRate ?? 0,
              },
              {
                stage: "Featured",
                count: pipelineData?.featured.totalCount,
                pct: pipelineData?.featured.conversionRate ?? 0,
              },
            ].map((p: any) => (
              <div key={p.stage} className="space-y-1">
                <div className="flex justify-between">
                  <div className="text-sm">{p.stage}</div>
                  <div className="text-sm">
                    {p.count} — {p.pct}% convert
                  </div>
                </div>
                <Progress value={Math.min(100, Math.round(p.pct))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Outreach Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentData?.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell>{r.channel}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Follow-ups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingData?.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.png" alt={u.name} />
                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{u.priority}</Badge>
                  <Button size="sm">Contact</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
