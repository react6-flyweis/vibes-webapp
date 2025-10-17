import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm">Total Outreach</div>
            <div className="text-2xl font-semibold">1247</div>
            <div className="text-sm text-muted-foreground">
              Messages sent this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Response Rate</div>
            <div className="text-2xl font-semibold">34.2%</div>
            <div className="text-sm text-green-600">+5.2% from last month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Conversion Rate</div>
            <div className="text-2xl font-semibold">18.4%</div>
            <div className="text-sm text-muted-foreground">
              Leads to activated vendors
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-sm">Avg Response Time</div>
            <div className="text-2xl font-semibold">4.7h</div>
            <div className="text-sm text-muted-foreground">
              Average vendor response time
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
          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  ✉️
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    892 sent • 287 responses
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">32.2%</div>
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
                    234 sent • 96 responses
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">41%</div>
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
                    121 sent • 38 responses
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">31.4%</div>
                <div className="text-sm text-muted-foreground">
                  Response Rate
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
