import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useVendorOverview } from "@/hooks/useVendorOverview";

export default function Analytics() {
  const { data, isLoading, isError, error } = useVendorOverview();

  const totalOutreach = data?.totalLeadsLastMonth ?? 0;
  const activeLeads = data?.activeLeads ?? 0;
  const conversionRate = data?.conversionRate ?? 0;
  const avgTimeToConvert = data?.avgTimeToConvert ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm">Total Outreach</div>
            <div className="text-2xl font-semibold">
              {isLoading ? "…" : totalOutreach ?? "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              Messages sent this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Active Leads</div>
            <div className="text-2xl font-semibold">
              {isLoading ? "…" : activeLeads ?? "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              Leads currently in pipeline
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Conversion Rate</div>
            <div className="text-2xl font-semibold">
              {isLoading
                ? "…"
                : conversionRate != null
                ? `${conversionRate}%`
                : "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              Leads to activated vendors
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Avg Time to Convert</div>
            <div className="text-2xl font-semibold">
              {isLoading
                ? "…"
                : avgTimeToConvert != null
                ? `${avgTimeToConvert}h`
                : "—"}
            </div>
            <div className="text-sm text-muted-foreground">
              Average time to convert
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track leads through each stage of the vendor onboarding process
          </p>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="text-sm text-destructive">
              Error loading overview: {String((error as any)?.message ?? error)}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    ✉️
                  </div>
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">
                      {isLoading ? "Loading…" : `sent • responses`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {isLoading ? "…" : "32.2%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border rounded p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    💬
                  </div>
                  <div>
                    <div className="font-medium">Instagram DM</div>
                    <div className="text-sm text-muted-foreground">
                      {isLoading ? "Loading…" : `sent • responses`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {isLoading ? "…" : "41%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border rounded p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    💬
                  </div>
                  <div>
                    <div className="font-medium">LinkedIn</div>
                    <div className="text-sm text-muted-foreground">
                      {isLoading ? "Loading…" : `sent • responses`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {isLoading ? "…" : "31.4%"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
