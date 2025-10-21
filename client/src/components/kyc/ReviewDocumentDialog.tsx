import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DocumentItem = {
  name?: string;
  url?: string;
};

type RecordType = {
  id?: string | number;
  documents?: DocumentItem[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: RecordType | null;
  remarks: string;
  onChangeRemarks: (v: string) => void;
  onApprove?: (id: string | number | undefined, remarks?: string) => void;
  onReject?: (id: string | number | undefined, remarks?: string) => void;
  onRequestResubmission?: (
    id: string | number | undefined,
    remarks?: string
  ) => void;
};

export default function ReviewDocumentDialog({
  open,
  onOpenChange,
  record,
  remarks,
  onChangeRemarks,
  onApprove,
  onReject,
  onRequestResubmission,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Document</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <h4 className="font-medium mb-3">Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border rounded-md bg-yellow-50">
              <CardContent className="flex items-center justify-between p-2">
                <div className="font-medium">{record?.documents?.[0]?.name || "Government ID"}</div>
                {record?.documents?.[0]?.url ? (
                  <a
                    href={record.documents[0].url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Download Government ID"
                    className="text-muted-foreground"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                ) : (
                  <Download className="h-5 w-5 opacity-40" aria-hidden />
                )}
              </CardContent>
            </Card>

            <Card className="border rounded-md bg-yellow-50">
              <CardContent className="flex items-center justify-between p-2">
                <div className="font-medium">{record?.documents?.[1]?.name || "ID Proof"}</div>
                {record?.documents?.[1]?.url ? (
                  <a
                    href={record.documents[1].url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Download ID Proof"
                    className="text-muted-foreground"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                ) : (
                  <Download className="h-5 w-5 opacity-40" aria-hidden />
                )}
              </CardContent>
            </Card>
          </div>

          <h4 className="font-medium mt-6 mb-3">Remarks</h4>
          <Textarea
            value={remarks}
            onChange={(e) => onChangeRemarks((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter remarks"
            className="min-h-[120px]"
          />

          <div className="flex gap-4 mt-6 justify-end">
            <Button
              variant="default"
              onClick={() => {
                if (onRequestResubmission)
                  onRequestResubmission(record?.id, remarks);
                onOpenChange(false);
              }}
            >
              Request Resubmission
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (onReject) onReject(record?.id, remarks);
                onOpenChange(false);
              }}
            >
              Reject
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                if (onApprove) onApprove(record?.id, remarks);
                onOpenChange(false);
              }}
            >
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
