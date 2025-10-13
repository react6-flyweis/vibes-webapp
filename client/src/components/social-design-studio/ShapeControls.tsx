import React from "react";
import { Lock, Unlock } from "lucide-react";

export default function ShapeControls({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm">Shape Size</div>
        <button
          type="button"
          className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${
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
          {selectedElement.style?.linkSize ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </button>
      </div>

      <div className="mt-1">
        <div className="text-xs text-gray-500">Width</div>
        <input
          type="range"
          min={20}
          max={1200}
          value={selectedElement.size?.width || 120}
          onChange={(e) => {
            const w = Number(e.target.value || 120);
            const prevW = selectedElement.size?.width || w;
            const prevH = selectedElement.size?.height || w;
            let newH = prevH;
            if (selectedElement.style?.linkSize) {
              const ratio = prevW > 0 ? w / prevW : 1;
              newH = Math.max(1, Math.round(prevH * ratio));
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
          value={selectedElement.size?.height || 120}
          onChange={(e) => {
            const h = Number(e.target.value || 120);
            const prevW = selectedElement.size?.width || h;
            const prevH = selectedElement.size?.height || h;
            let newW = prevW;
            if (selectedElement.style?.linkSize) {
              const ratio = prevH > 0 ? h / prevH : 1;
              newW = Math.max(1, Math.round(prevW * ratio));
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
        <div className="text-sm">Fill Color</div>
        <input
          type="color"
          value={selectedElement.style?.background || "#ffffff"}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                background: e.target.value,
              },
            })
          }
          className="mt-1 h-8 w-12 p-0 border rounded"
        />
      </div>

      <div className="mt-3">
        <div className="text-sm">Stroke Color</div>
        <input
          type="color"
          value={selectedElement.style?.stroke || "#000000"}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                stroke: e.target.value,
              },
            })
          }
          className="mt-1 h-8 w-12 p-0 border rounded"
        />
      </div>

      <div className="mt-3">
        <div className="text-sm">Stroke Width</div>
        <input
          type="range"
          min={0}
          max={50}
          value={selectedElement.style?.strokeWidth || 0}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                strokeWidth: Number(e.target.value || 0),
              },
            })
          }
          className="w-full mt-2"
        />
      </div>

      <div className="mt-3">
        <div className="text-sm">Stroke Style</div>
        <select
          value={selectedElement.style?.strokeStyle || "solid"}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                strokeStyle: e.target.value,
              },
            })
          }
          className="mt-1 w-full border p-2 rounded"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
        </select>
      </div>

      {selectedElement.shape === "triangle" && (
        <div className="mt-3">
          <div className="text-sm">Pointing Direction</div>
          <select
            value={(() => {
              const rot = selectedElement.rotation || 0;
              if (rot % 360 === 0) return "up";
              if (rot % 360 === 90) return "right";
              if (rot % 360 === 180) return "down";
              if (rot % 360 === 270) return "left";
              return "up";
            })()}
            onChange={(e) => {
              const map: any = { up: 0, right: 90, down: 180, left: 270 };
              setSelectedElement({
                ...selectedElement,
                rotation: map[e.target.value],
              });
            }}
            className="mt-1 w-full border p-2 rounded"
          >
            <option value="up">Up</option>
            <option value="right">Right</option>
            <option value="down">Down</option>
            <option value="left">Left</option>
          </select>
        </div>
      )}

      <div className="mt-3">
        <div className="text-sm">Corner Radius</div>
        <input
          type="range"
          min={0}
          max={600}
          value={selectedElement.style?.cornerRadius || 0}
          onChange={(e) =>
            setSelectedElement({
              ...selectedElement,
              style: {
                ...(selectedElement.style || {}),
                cornerRadius: Number(e.target.value || 0),
              },
            })
          }
          className="w-full mt-2"
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
    </div>
  );
}
