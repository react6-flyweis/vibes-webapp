import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function EscrowContractsTab({
  escrowContracts,
  downloadContract,
}: any) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Escrow/Contract Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track legally binding escrow agreements between campaign
            creators and backers.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-md overflow-hidden border">
        <Table className="text-sm table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/6">Contract ID</TableHead>
              <TableHead className="w-1/3">Related Campaign</TableHead>
              <TableHead className="w-1/6">Created Date</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escrowContracts.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="py-4 px-3">{c.id}</TableCell>
                <TableCell className="px-3">{c.campaign}</TableCell>
                <TableCell className="px-3">{c.createdOn}</TableCell>
                <TableCell className="px-3">{c.status}</TableCell>
                <TableCell className="px-3">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => downloadContract(c.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {escrowContracts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-sm text-muted-foreground"
                >
                  No contracts available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
