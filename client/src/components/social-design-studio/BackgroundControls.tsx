import React from "react";

export default function BackgroundControls({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="text-sm">Background Type</div>
      <select
        value={selectedElement.style?.backgroundType || "solid"}
        onChange={(e) =>
          setSelectedElement({
            ...selectedElement,
            style: {
              ...(selectedElement.style || {}),
              backgroundType: e.target.value,
            },
          })
        }
        className="mt-1 w-full border p-2 rounded"
      >
        <option value="solid">Solid</option>
        <option value="gradient">Gradient</option>
      </select>

      {selectedElement.style?.backgroundType === "gradient" ? (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-sm">Gradient From</div>
            <input
              type="color"
              value={
                selectedElement.style?.gradientFrom ||
                selectedElement.style?.background ||
                "#ffffff"
              }
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    gradientFrom: e.target.value,
                  },
                })
              }
              className="mt-1 h-8 w-12 p-0 border rounded"
            />
          </div>

          <div>
            <div className="text-sm">Gradient To</div>
            <input
              type="color"
              value={selectedElement.style?.gradientTo || "#000000"}
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    gradientTo: e.target.value,
                  },
                })
              }
              className="mt-1 h-8 w-12 p-0 border rounded"
            />
          </div>

          <div>
            <div className="text-sm">Direction</div>
            <select
              value={selectedElement.style?.gradientDirection || "to bottom"}
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    gradientDirection: e.target.value,
                  },
                })
              }
              className="mt-1 w-full border p-2 rounded"
            >
              <option value="to bottom">Vertical</option>
              <option value="to right">Horizontal</option>
              <option value="to bottom right">Diagonal (BR)</option>
              <option value="to top right">Diagonal (TR)</option>
            </select>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="text-sm">Background Color</div>
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
      )}

      <div className="mt-3">
        <div className="text-sm">Background Opacity</div>
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
