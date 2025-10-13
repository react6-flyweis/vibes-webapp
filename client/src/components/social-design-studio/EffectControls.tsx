import React from "react";

export default function EffectControls({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="text-sm">Effect Color</div>
      <input
        type="color"
        value={selectedElement.style?.color || "#ffffff"}
        onChange={(e) => {
          const updated = {
            ...selectedElement,
            style: { ...(selectedElement.style || {}), color: e.target.value },
          };
          setSelectedElement(updated);
        }}
        className="mt-1 h-8 w-12 p-0 border rounded"
      />

      <div className="mt-3">
        <div className="text-sm">Opacity</div>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((selectedElement.style?.opacity ?? 0.8) * 100)}
          onChange={(e) => {
            const v = Number(e.target.value || 80) / 100;
            const updated = {
              ...selectedElement,
              style: { ...(selectedElement.style || {}), opacity: v },
            };
            setSelectedElement(updated);
          }}
          className="w-full mt-2"
        />
      </div>

      <div className="mt-3">
        <div className="text-sm">Glow / Shadow Blur</div>
        <input
          type="range"
          min={0}
          max={200}
          value={selectedElement.style?.shadowBlur || 60}
          onChange={(e) => {
            const v = Number(e.target.value || 60);
            const updated = {
              ...selectedElement,
              style: { ...(selectedElement.style || {}), shadowBlur: v },
            };
            setSelectedElement(updated);
          }}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
}
