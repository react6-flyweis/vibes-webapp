import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ReviewDocumentDialog from "@/components/kyc/ReviewDocumentDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function KYCVerificationTab({
  auditTrail,
  reviewVerification,
}: any) {
  const [showReviewDialog, setShowReviewDialog] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [remarks, setRemarks] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Helper to parse submittedOn into a Date if possible
  const parseSubmittedOn = (s: string) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  const filtered = auditTrail.filter((r: any) => {
    // Status filter
    if (statusFilter && statusFilter !== "All" && r.status !== statusFilter) {
      return false;
    }

    // Date range filter (only apply if input provided and parsed)
    const submitted = parseSubmittedOn(r.submittedOn);
    if (submitted) {
      if (startDate) {
        const sd = new Date(startDate);
        if (!isNaN(sd.getTime()) && submitted < sd) return false;
      }
      if (endDate) {
        const ed = new Date(endDate);
        if (!isNaN(ed.getTime()) && submitted > ed) return false;
      }
    }

    return true;
  });

  return (
    <Card className="p-4 rounded-md">
      <h3 className="font-semibold mb-3">Filter Panel</h3>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1 ">
          <Label className="mb-3">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-full text-sm">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="All">All</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="">
          <h3 className="font-semibold mb-3">Filter Table</h3>
          <div className="flex gap-3 items-center">
            <Input
              type="date"
              value={startDate}
              onChange={(e: any) => setStartDate(e.target.value)}
              className="w-48"
            />
            <span className="text-sm text-muted-foreground">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e: any) => setEndDate(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded">
        <Table className="text-sm table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">User Name</TableHead>
              <TableHead className="w-1/6">User type</TableHead>
              <TableHead className="w-1/6">Verification ID</TableHead>
              <TableHead className="w-1/6">Submitted On</TableHead>
              <TableHead className="w-1/6">Status</TableHead>
              <TableHead className="w-1/6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="py-4 px-3">{r.user}</TableCell>
                <TableCell className="px-3">{r.userType}</TableCell>
                <TableCell className="px-3">{r.verificationId}</TableCell>
                <TableCell className="px-3">{r.submittedOn}</TableCell>
                <TableCell className="px-3">{r.status}</TableCell>
                <TableCell className="px-3">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => {
                      // open local review dialog with record
                      setSelectedRecord(r);
                      setRemarks("");
                      setShowReviewDialog(true);
                      // keep calling external handler in case it does other work
                      if (typeof reviewVerification === "function")
                        reviewVerification(r.id);
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-sm text-muted-foreground"
                >
                  No results match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ReviewDocumentDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        record={selectedRecord}
        remarks={remarks}
        onChangeRemarks={setRemarks}
        onApprove={(id, r) => {
          console.log("approve", id, r);
          // If parent passed a reviewVerification handler, call it as well
          if (typeof reviewVerification === "function")
            reviewVerification(id, "approve", r);
        }}
        onReject={(id, r) => {
          console.log("reject", id, r);
          if (typeof reviewVerification === "function")
            reviewVerification(id, "reject", r);
        }}
        onRequestResubmission={(id, r) => {
          console.log("request resubmission", id, r);
          if (typeof reviewVerification === "function")
            reviewVerification(id, "resubmit", r);
        }}
      />
    </Card>
  );
}
