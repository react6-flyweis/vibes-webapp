import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import CommentDialog from "./CommentDialog";

export default function CommentsQATab({ comments }: any) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Comments & Q&A</h3>

      {comments.length === 0 ? (
        <p className="text-muted-foreground">No public comments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.user}</TableCell>
                  <TableCell className="max-w-xl truncate">{c.text}</TableCell>
                  <TableCell>
                    <span
                      className={
                        c.status === "Approved"
                          ? "text-green-600"
                          : c.status === "Pending"
                          ? "text-orange-500"
                          : "text-red-600"
                      }
                    >
                      {c.status}
                    </span>
                  </TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell>
                    {c.actions?.type === "view" ? (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setSelected(c);
                          setOpen(true);
                        }}
                      >
                        View
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-green-600"
                        >
                          Approve
                        </Button>
                        <span className="mx-2">/</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-red-600"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CommentDialog
        open={open}
        onOpenChange={(v: boolean) => setOpen(v)}
        comment={selected}
        onPostReply={(id: any, r: string) => {
          console.log("post reply", id, r);
        }}
      />
    </Card>
  );
}
