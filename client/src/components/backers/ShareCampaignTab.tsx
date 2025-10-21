import React from "react";
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
import { ShareLink } from "./types";
import { copyFullLink, downloadQR } from "./utils";

export default function ShareCampaignTab({
  shareLinks,
}: {
  shareLinks: ShareLink[];
}) {
  async function onCopy(short: string) {
    try {
      await copyFullLink(short);
      alert("Link copied to clipboard");
    } catch {
      alert("Failed to copy link");
    }
  }

  function onDownload(short: string) {
    downloadQR(short);
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Share Campaign</h3>
      <p className="text-sm text-muted-foreground">
        Quick links to share your campaign and track clicks/conversions.
      </p>

      <div className="mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Short Link</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Conversions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shareLinks.map((s: ShareLink) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.platform}</TableCell>
                <TableCell>{s.short}</TableCell>
                <TableCell>{s.clicks}</TableCell>
                <TableCell>{s.conversions}</TableCell>
                <TableCell>
                  {s.action === "copy" ? (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onCopy(s.short)}
                    >
                      Copy
                    </Button>
                  ) : (
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onDownload(s.short)}
                    >
                      Download QR
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
