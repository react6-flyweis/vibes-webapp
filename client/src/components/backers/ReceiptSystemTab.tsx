import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReceiptTemplateDialog from "./ReceiptTemplateDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function ReceiptSystemTab({ receipts }: any) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Table of Transactions</h3>
        <ReceiptTemplateDialog
          trigger={
            <Button className="bg-blue-600 text-white" size="sm">
              Configure Receipt Template
            </Button>
          }
          onSave={(payload) => {
            // TODO: wire up upload/save behaviour
            console.log("Saved receipt template:", payload);
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Backer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.transactionId}</TableCell>
                <TableCell>{r.backer}</TableCell>
                <TableCell>{r.amount}</TableCell>
                <TableCell>{r.provider}</TableCell>
                <TableCell>
                  <span
                    className={
                      r.status === "Success" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {r.status}
                  </span>
                </TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>
                  {r.action === "download" ? (
                    <Button variant="link" size="sm">
                      Download
                    </Button>
                  ) : (
                    <Button variant="link" size="sm" className="text-red-600">
                      Retry
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
