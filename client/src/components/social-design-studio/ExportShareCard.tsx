import React from "react";
import { Card } from "@/components/ui/card";
import { Download, Copy } from "lucide-react";

export default function ExportShareCard({
  selectedPlatform,
  onShare,
  isSharing,
  onDownload,
  isExporting,
}: any) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Export & Share
      </h3>

      {selectedPlatform && (
        <div className="space-y-4">
          <div className="space-y-2">
            <button
              className="w-full p-2 bg-blue-600 text-white rounded"
              onClick={() => onShare(selectedPlatform.id)}
              disabled={isSharing}
            >
              {isSharing ? "Sharing..." : `Share to ${selectedPlatform.name}`}
            </button>

            <button
              className="w-full p-2 border rounded flex items-center justify-center"
              onClick={() => onDownload && onDownload()}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting
                ? "Preparing..."
                : `Download ${selectedPlatform.specs.formats[0]}`}
            </button>

            <button className="w-full p-2 border rounded flex items-center justify-center">
              <Copy className="w-4 h-4 mr-2" /> Copy Link
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
