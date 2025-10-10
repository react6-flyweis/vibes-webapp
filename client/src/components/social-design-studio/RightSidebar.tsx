import React from "react";
import { Card } from "@/components/ui/card";
import { Download, Copy, TrendingUp } from "lucide-react";

export default function RightSidebar({
  selectedElement,
  setSelectedElement,
  selectedPlatform,
  onShare,
  isSharing,
  onDownload,
  isExporting,
}: any) {
  return (
    <div className="col-span-3 space-y-4">
      {selectedElement && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Element Properties</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm">Content</div>
              <input
                value={selectedElement.content}
                onChange={(e) => {
                  const updated = {
                    ...selectedElement,
                    content: e.target.value,
                  };
                  setSelectedElement(updated);
                }}
                className="mt-1 w-full border p-2 rounded"
              />
            </div>
            {/* Font size controls for text elements */}
            {(selectedElement.type === "text" ||
              selectedElement.style?.fontSize) && (
              <div>
                <div className="text-sm">Font size</div>
                <input
                  type="range"
                  min={8}
                  max={72}
                  value={
                    selectedElement.style?.fontSize
                      ? parseInt(
                          String(selectedElement.style.fontSize).replace(
                            /[^0-9]/g,
                            ""
                          )
                        )
                      : 16
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value || 16);
                    const updated = {
                      ...selectedElement,
                      style: {
                        ...selectedElement.style,
                        fontSize: `${val}px`,
                      },
                    };
                    setSelectedElement(updated);
                  }}
                  className="w-full mt-2"
                />
              </div>
            )}
            {/* Color picker for text elements */}
            {selectedElement.type === "text" && (
              <div>
                <div className="text-sm">Color</div>
                <input
                  type="color"
                  value={selectedElement.style?.color || "#000000"}
                  onChange={(e) => {
                    const updated = {
                      ...selectedElement,
                      style: {
                        ...selectedElement.style,
                        color: e.target.value,
                      },
                    };
                    setSelectedElement(updated);
                  }}
                  className="mt-1 h-8 w-12 p-0 border rounded"
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export & Share
        </h3>

        {selectedPlatform && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <selectedPlatform.icon className="w-4 h-4" />
                <span className="font-medium text-sm">
                  {selectedPlatform.name}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  Size: {selectedPlatform.dimensions.width}×
                  {selectedPlatform.dimensions.height}
                </div>
                <div>Ratio: {selectedPlatform.aspectRatio}</div>
                <div>Max: {selectedPlatform.specs.maxFileSize}</div>
              </div>
            </div>

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

      {/*
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaboration
        </h3>
        <div className="space-y-3">
          <button className="w-full p-2 border rounded">Add Comment</button>
          <button className="w-full p-2 border rounded">Report Issue</button>
          <button className="w-full p-2 border rounded">Version History</button>
        </div>
      </Card>
      */}

      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> Performance
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Views</span>
            <span className="font-medium">1,247</span>
          </div>
          <div className="flex justify-between">
            <span>Shares</span>
            <span className="font-medium">83</span>
          </div>
          <div className="flex justify-between">
            <span>Comments</span>
            <span className="font-medium">—</span>
          </div>
          <div className="flex justify-between">
            <span>Engagement Rate</span>
            <span className="font-medium text-green-600">12.4%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
