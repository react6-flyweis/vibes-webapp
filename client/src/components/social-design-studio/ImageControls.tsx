import React from "react";

export default function ImageControls({
  selectedElement,
  setSelectedElement,
  onReplaceImage,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm">Size</div>
        <button
          type="button"
          className={`text-xs px-2 py-1 rounded border ${
            selectedElement.style?.linkSize ? "bg-gray-200" : ""
          }`}
          onClick={() =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                linkSize: !selectedElement.style?.linkSize,
              },
            })
          }
        >
          {selectedElement.style?.linkSize ? "Linked" : "Link"}
        </button>
      </div>

      <div className="mt-1">
        <div className="text-xs text-gray-500">Width</div>
        <input
          type="range"
          min={20}
          max={1200}
          value={selectedElement.size?.width || 240}
          onChange={(e) => {
            const w = Number(e.target.value || 240);
            const prevW = selectedElement.size?.width || w;
            const prevH =
              selectedElement.size?.height ||
              Math.round(w * (selectedElement.style?.aspectRatio || 1));
            let newH = prevH;
            if (selectedElement.style?.linkSize) {
              const ratio = prevW > 0 ? w / prevW : 1;
              newH = Math.max(1, Math.round(prevH * ratio));
            } else if (selectedElement.style?.aspectLocked) {
              newH = Math.round(w * (selectedElement.style?.aspectRatio || 1));
            }
            setSelectedElement({
              ...selectedElement,
              size: { ...(selectedElement.size || {}), width: w, height: newH },
            });
          }}
          className="w-full"
        />
      </div>

      <div className="mt-2">
        <div className="text-xs text-gray-500">Height</div>
        <input
          type="range"
          min={20}
          max={1200}
          value={selectedElement.size?.height || 160}
          onChange={(e) => {
            const h = Number(e.target.value || 160);
            const prevW =
              selectedElement.size?.width ||
              Math.round(h / (selectedElement.style?.aspectRatio || 1));
            const prevH = selectedElement.size?.height || h;
            let newW = prevW;
            if (selectedElement.style?.linkSize) {
              const ratio = prevH > 0 ? h / prevH : 1;
              newW = Math.max(1, Math.round(prevW * ratio));
            } else if (selectedElement.style?.aspectLocked) {
              newW = Math.round(h / (selectedElement.style?.aspectRatio || 1));
            }
            setSelectedElement({
              ...selectedElement,
              size: { ...(selectedElement.size || {}), width: newW, height: h },
            });
          }}
          className="w-full"
        />
      </div>

      <div className="mt-3">
        <div className="text-sm">Opacity</div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((selectedElement.style?.opacity ?? 1) * 100)}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                opacity: Number(e.target.value || 100) / 100,
              },
            })
          }
          className="w-full mt-2"
        />
      </div>

      <div className="mt-3">
        <button
          className="p-2 w-full border rounded"
          onClick={() =>
            typeof onReplaceImage === "function" && onReplaceImage()
          }
        >
          Replace Image
        </button>
      </div>
    </div>
  );
}
