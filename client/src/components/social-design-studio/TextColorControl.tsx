import React from "react";

export default function TextColorControl({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
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
  );
}
