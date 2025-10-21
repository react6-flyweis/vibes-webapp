import React from "react";
import { Card } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function RegionalComplianceTab({ regionalCompliance }: any) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Regional Compliance</h2>

      <div className="bg-white shadow rounded">
        <Table className="text-sm table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Region</TableHead>
              <TableHead className="w-1/3">Framework</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Last Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regionalCompliance.map((r: any, idx: number) => (
              <TableRow key={r.region + idx}>
                <TableCell className="py-4 px-3">{r.region}</TableCell>
                <TableCell className="px-3">{r.framework}</TableCell>
                <TableCell className="px-3">
                  {r.status === "Compliant" ? (
                    <span className="inline-flex items-center text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600 mr-2" />
                      <span>Compliant</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm text-gray-700">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
                      <span>{r.status}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-3">{r.lastChecked}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
