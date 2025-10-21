import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Comment = any;

export default function CommentDialog({
  open,
  onOpenChange,
  comment,
  onPostReply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  comment: Comment | null;
  onPostReply?: (id: any, reply: string) => void;
}) {
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!open) setReply("");
  }, [open, comment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="">Comments</DialogTitle>
        </DialogHeader>

        {comment ? (
          <div className="py-4">
            <div className="flex items-start gap-4">
              <img
                src={comment.avatar || "/images/default-avatar.png"}
                alt={comment.user}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user}</span>
                  {comment.contribution ? (
                    <span className="text-muted-foreground">
                      (Contributed ${comment.contribution})
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 bg-yellow-100 rounded-lg px-6 py-4 max-w-[70%]">
                  {comment.text}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3 items-center">
              <Input
                placeholder={`Reply to ${comment.user}`}
                value={reply}
                onChange={(e: any) => setReply(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (onPostReply) onPostReply(comment.id, reply);
                  setReply("");
                }}
              >
                Post
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No comment selected.</p>
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
