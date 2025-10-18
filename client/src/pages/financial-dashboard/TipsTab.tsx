import React, { useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinancialDashboardContext } from "@/pages/financial-dashboard";

export default function TipsTab() {
  const ctx = useContext(FinancialDashboardContext);

  return (
    <div className="space-y-6">
      <div className="bg-purple-100 border border-purple-300 rounded-md p-3 text-center text-purple-700">
        <span className="text-sm">
          ℹ️ Set a default tip percentage suggested to backers.
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Tip Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={ctx.tipPercent}
                  onChange={(e) =>
                    ctx.setTipPercent(parseInt(e.target.value, 10))
                  }
                  className="w-full"
                />
                <div className="w-12 text-right font-medium">
                  {ctx.tipPercent}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Custom Message</div>
              <textarea
                value={ctx.customMessage}
                onChange={(e) => ctx.setCustomMessage(e.target.value)}
                className="w-full border rounded-md p-2 h-20"
                placeholder=""
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button className="bg-blue-600 text-white">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
