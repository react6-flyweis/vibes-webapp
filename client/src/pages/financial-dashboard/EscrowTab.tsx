import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EscrowTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="px-2 py-1">
              <h3 className="text-lg font-semibold">
                List of campaigns with escrow
              </h3>
            </div>

            <div className="mt-4 border border-transparent rounded-lg overflow-hidden">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium">
                      Ecox-Bottle Initiative
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Funds Held: $4,000
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    2 Release Request
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />

                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium">Smart Lamp</div>
                    <div className="text-sm text-muted-foreground">
                      Funds Held: $4,000
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Creator:
                    </div>
                    <div className="font-medium">Green Tech Studio</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total Raised:
                    </div>
                    <div className="font-medium">$ 40,000</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  Current Escrow:
                </div>
                <div className="text-2xl font-semibold mb-4">$ 7,300</div>

                <div className="flex gap-3">
                  <button className="btn btn-primary flex-1">
                    Approve Release
                  </button>
                  <button className="btn btn-ghost flex-1">
                    Request Audit
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Table</CardTitle>
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
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <tr>
                  <td className="px-6 py-4 text-sm">01 - Sep - 2025</td>
                  <td className="px-6 py-4 text-sm">Release Requested</td>
                  <td className="px-6 py-4 text-sm">Creator</td>
                  <td className="px-6 py-4 text-sm">$2,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
