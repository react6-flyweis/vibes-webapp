import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function PerformanceCard() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> Performance
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Views</span>
          <span className="font-medium">1,247</span>
        </div>
        <div className="flex justify-between">
          <span>Shares</span>
          <span className="font-medium">83</span>
        </div>
        <div className="flex justify-between">
          <span>Comments</span>
          <span className="font-medium">—</span>
        </div>
        <div className="flex justify-between">
          <span>Engagement Rate</span>
          <span className="font-medium text-green-600">12.4%</span>
        </div>
      </div>
    </Card>
  );
}
