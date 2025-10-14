import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Mail, QrCode } from "lucide-react";

interface ExportTabProps {
  onSave: () => void;
  onExport: () => void;
}

export function ExportTab({ onSave, onExport }: ExportTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Save & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" onClick={onSave}>
            Save Design
          </Button>
          <Button className="w-full" variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <Button className="w-full" variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send via Email
          </Button>
          <Button className="w-full" variant="outline">
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR Code
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
