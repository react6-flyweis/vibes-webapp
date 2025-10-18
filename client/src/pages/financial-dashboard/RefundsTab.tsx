import React, { useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FinancialDashboardContext } from "@/pages/financial-dashboard";

export default function RefundsTab() {
  const ctx = useContext(FinancialDashboardContext);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refund Request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Backer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {ctx.refunds.map((r: any) => (
                <tr key={r.id}>
                  <td className="px-6 py-4 text-sm">{r.id}</td>
                  <td className="px-6 py-4 text-sm">{r.backer}</td>
                  <td className="px-6 py-4 text-sm">{r.campaign}</td>
                  <td className="px-6 py-4 text-sm">{r.amount}</td>
                  <td className="px-6 py-4 text-sm">{r.reason}</td>
                  <td
                    className={`px-6 py-4 text-sm ${
                      r.status === "Approved"
                        ? "text-green-600"
                        : r.status === "Pending"
                        ? "text-orange-500"
                        : "text-red-600"
                    }`}
                  >
                    {r.status}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {r.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => ctx.approveRefund(r.id)}
                          className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => ctx.denyRefund(r.id)}
                          className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
