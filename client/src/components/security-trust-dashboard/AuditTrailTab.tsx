import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function AuditTrailTab({ auditTrail }: any) {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>

      <div className="bg-white shadow rounded">
        <Table className="text-sm table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Date & Time</TableHead>
              <TableHead className="w-1/2">Event Description</TableHead>
              <TableHead className="w-1/6">User</TableHead>
              <TableHead className="w-1/6">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditTrail.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="py-4 px-3">{a.dateTime}</TableCell>
                <TableCell className="px-3">{a.description}</TableCell>
                <TableCell className="px-3">{a.user}</TableCell>
                <TableCell className="px-3">{a.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
