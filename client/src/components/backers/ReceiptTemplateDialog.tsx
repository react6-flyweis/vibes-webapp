import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type Props = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (payload: { footerText: string; logo?: File | null }) => void;
};

export default function ReceiptTemplateDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSave,
}: Props) {
  const [open, setOpen] = useState<boolean>(controlledOpen ?? false);
  const [footerText, setFooterText] = useState<string>(
    "\u201CThank you supporting Eco Bottle!\u201D"
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    onOpenChange?.(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setLogoFile(f ?? null);
  };

  const handleSave = () => {
    onSave?.({ footerText, logo: logoFile });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm">Configure Receipt Template</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Receipt Template</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Card className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Upload Logo
            </label>
            <div className="rounded-lg border border-neutral-300 bg-neutral-100 p-8 text-center">
              <div className="mx-auto max-w-xs">
                <svg
                  className="mx-auto h-8 w-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16v-6m0 0l5-5 5 5M12 10v10"
                  />
                </svg>
                <p className="mt-4 text-sm text-neutral-600">
                  Drag & drop or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-3 w-full text-sm"
                />
                {logoFile && (
                  <p className="mt-2 text-xs text-neutral-700">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Add Footer Text
            </label>
            <Textarea
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
            />
          </div>
        </Card>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="mr-2"
          >
            Close
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
