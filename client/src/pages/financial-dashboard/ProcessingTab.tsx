import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProcessingTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="default">Export PDF</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Free Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <div>
                <div className="text-sm font-medium mb-2">Filter Table</div>
                <div className="flex items-center gap-3">
                  <input
                    className="border rounded px-3 py-2 w-40"
                    placeholder="dd/mm/yyy"
                  />
                  <span className="text-lg text-muted-foreground">-</span>
                  <input
                    className="border rounded px-3 py-2 w-40"
                    placeholder="dd/mm/yyy"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground">Net Payouts</div>
                <div className="text-2xl font-semibold">$118,200</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Fee Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Campaign
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-sm">01 - Sep - 2025</td>
                  <td className="px-6 py-4 text-sm">Eco-Bottle</td>
                  <td className="px-6 py-4 text-sm">Completed</td>
                  <td className="px-6 py-4 text-sm">$4,000</td>
                  <td className="px-6 py-4 text-sm">$4,000</td>
                </tr>

                <tr>
                  <td className="px-6 py-4 text-sm">10 - Aug - 2025</td>
                  <td className="px-6 py-4 text-sm">Smart lamp</td>
                  <td className="px-6 py-4 text-sm">Completed</td>
                  <td className="px-6 py-4 text-sm">$4,500</td>
                  <td className="px-6 py-4 text-sm">$4,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
