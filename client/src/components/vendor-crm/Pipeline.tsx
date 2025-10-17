import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Pipeline({ pipeline }: any) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">CRM Pipeline Stages</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Configure your vendor outreach pipeline stages and automation
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pipeline.map((p: any, idx: number) => (
          <Card key={p.stage} className="border hover:shadow">
            <CardContent>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{p.stage}</div>
                  <div className="text-xs text-muted-foreground">
                    Vendor identified via Etsy, social media, or referral
                  </div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {idx + 1}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground text-[11px]">
                    Expected Duration
                  </div>
                  <div className="font-medium">1 days</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-[11px]">
                    Conversion Rate
                  </div>
                  <div className="font-medium">{p.pct}%</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  add to crm
                </Button>
                <Button variant="outline" size="sm">
                  research vendor
                </Button>
                <Button variant="outline" size="sm">
                  assign priority
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
