import React from "react";

export default function FontSizeControl({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="text-sm">Font size</div>
      <input
        type="range"
        min={8}
        max={72}
        value={
          selectedElement.style?.fontSize
            ? parseInt(
                String(selectedElement.style.fontSize).replace(/[^0-9]/g, "")
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
  );
}
