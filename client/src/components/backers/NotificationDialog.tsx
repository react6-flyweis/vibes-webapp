import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Audience = "All" | "Tier 1 Backers" | "Tier 2 Backers";
type Delivery = "Email" | "SMS" | "In-App";

interface Props {
  onCreate?: (n: any) => void;
  /** If true the dialog will be opened when the component mounts */
  defaultOpen?: boolean;
  /** Controlled open state — if provided the dialog becomes controlled */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, hide the built-in trigger button (useful when parent controls opening) */
  showTrigger?: boolean;
  /** If provided the dialog will be populated with this notification (view/edit) */
  initialNotification?: any | null;
  /** When true the dialog renders in read-only/view mode */
  readOnly?: boolean;
}

export function NotificationDialog({
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  showTrigger = true,
  initialNotification = null,
  readOnly = false,
}: Props) {
  const [internalOpen, setInternalOpen] = useState<boolean>(!!defaultOpen);
  const isControlled = typeof controlledOpen !== "undefined";
  const open = isControlled ? controlledOpen! : internalOpen;
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("All");
  const [delivery, setDelivery] = useState<Delivery>("Email");
  const [saving, setSaving] = useState(false);

  function reset() {
    setTitle("");
    setMessage("");
    setAudience("All");
    setDelivery("Email");
  }

  // when initialNotification changes (parent opened dialog for viewing/editing), populate fields
  React.useEffect(() => {
    if (initialNotification) {
      setTitle(initialNotification.title || "");
      setMessage(initialNotification.message || "");
      setAudience((initialNotification.sentTo as Audience) || "All");
      setDelivery((initialNotification.type as Delivery) || "Email");
    } else {
      // only reset when there's no initial notification
      reset();
    }
  }, [initialNotification]);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    // Simulate API save delay
    await new Promise((r) => setTimeout(r, 300));

    // If an initialNotification was provided we treat this as an update
    const payload = initialNotification
      ? {
          ...initialNotification,
          title,
          message,
          type: delivery,
          sentTo: audience,
          // update date to reflect save time
          date: new Date().toLocaleString(),
        }
      : {
          id: `local-${Date.now()}`,
          title,
          message,
          type: delivery,
          sentTo: audience,
          status: "Scheduled",
          date: new Date().toLocaleString(),
          actions: [
            { label: "Edit", className: "" },
            { label: "Send Now", className: "" },
          ],
        };

    setSaving(false);

    // close via controlled callback if provided, otherwise internal state
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }

    reset();
  }

  function handleOpenChange(v: boolean) {
    if (isControlled) {
      onOpenChange?.(v);
    } else {
      setInternalOpen(v);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="bg-blue-600 text-white" size="sm">
            + Create Notification
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>
            {readOnly ? "Notification" : "Create Notification"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`"New Update Available"`}
              readOnly={readOnly}
            />

            <label className="block text-sm font-medium mt-4 mb-2">
              Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`"We added a stretch goal: free shipping!"`}
              rows={5}
              readOnly={readOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Audience</label>
            <Select onValueChange={(v) => setAudience(v as Audience)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Tier 1 Backers">Tier 1 Backers</SelectItem>
                <SelectItem value="Tier 2 Backers">Tier 2 Backers</SelectItem>
              </SelectContent>
            </Select>

            <label className="block text-sm font-medium mt-4 mb-2">
              Delivery
            </label>
            <Select onValueChange={(v) => setDelivery(v as Delivery)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="In-App">In-App</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="mr-2"
          >
            Close
          </Button>
          {!readOnly && (
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              Save
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
