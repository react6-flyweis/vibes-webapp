import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  provider: any;
  open?: boolean;
  trigger?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  onSave: (id: string, data: { apiKey: string }) => void;
};

export default function EditProviderDialog({
  provider,
  open,
  trigger,
  onOpenChange,
  onSave,
}: Props) {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (open) {
      setApiKey(provider?.apiKey || "");
    }
  }, [open, provider]);

  const handleSave = () => {
    if (!provider) return;
    onSave(provider.id, { apiKey });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit({provider?.name || "Provider"})</DialogTitle>
          <DialogDescription>Update your API Key</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label>API Key</Label>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API_KEY_..."
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
