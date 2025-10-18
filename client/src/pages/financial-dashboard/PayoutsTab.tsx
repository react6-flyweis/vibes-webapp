import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PayoutsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="bg-blue-600 text-white">Update Bank Details</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auto Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Linked Bank</div>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm text-muted-foreground">
                ***HDFC*** - **5432
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">
                Next Schedule Payout
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm text-muted-foreground">
                15 December 2025
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Event type</div>
              <select className="w-full border rounded-md px-3 py-2">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div className="flex items-center justify-start md:justify-end">
              <div>
                <div className="text-sm font-medium mb-2">
                  Enable Auto-Payout
                </div>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>History table</CardTitle>
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-sm">01 - Sep - 2025</td>
                  <td className="px-6 py-4 text-sm">$4,000</td>
                  <td className="px-6 py-4 text-sm text-green-600">
                    Completed
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">10 - Aug - 2025</td>
                  <td className="px-6 py-4 text-sm">$4,500</td>
                  <td className="px-6 py-4 text-sm text-green-600">
                    Completed
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm">10 - Jul - 2025</td>
                  <td className="px-6 py-4 text-sm">$4,500</td>
                  <td className="px-6 py-4 text-sm text-green-600">
                    Completed
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
