import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart } from "@/components/charts/AreaChart";

const stats = [
  { title: "Total Fund Raised", value: "$125,000" },
  { title: "Net Payouts", value: "$118,200" },
  { title: "Pending Escrow", value: "$7,300" },
  { title: "Refund Request", value: "12" },
];

const sampleData = [
  { name: "Jan", value: 80 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 70 },
  { name: "Apr", value: 100 },
  { name: "May", value: 120 },
  { name: "Jun", value: 110 },
  { name: "Jul", value: 115 },
  { name: "Aug", value: 105 },
  { name: "Sep", value: 95 },
  { name: "Oct", value: 75 },
  { name: "Nov", value: 130 },
  { name: "Dec", value: 140 },
];

export default function DashboardTab() {
  return (
    <div>
      <div className="flex justify-end mb-2">
        <button className="btn btn-sm">Export PDF</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.title} className="p-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{s.title}</CardTitle>
                <div className="text-xl font-semibold">{s.value}</div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Pledges over time chart</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AreaChart data={sampleData} />
        </CardContent>
      </Card>
    </div>
  );
}
