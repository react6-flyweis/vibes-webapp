import React from "react";
import { Button } from "../ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ElementActions({
  selectedElement,
  onMoveUp,
  onMoveDown,
  onBringToFront,
  onSendToBack,
  onDeleteElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div className="flex gap-2 mb-3">
      <Button
        type="button"
        title="Move Up"
        className="p-2 border rounded text-sm"
        onClick={() => {
          if (selectedElement?.id && typeof onMoveUp === "function")
            onMoveUp(selectedElement.id);
        }}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        title="Move Down"
        className="p-2 border rounded text-sm"
        onClick={() => {
          if (selectedElement?.id && typeof onMoveDown === "function")
            onMoveDown(selectedElement.id);
        }}
      >
        <ArrowDown className="w-4 h-4" />
      </Button>

      <Button
        type="button"
        className="p-2 border rounded text-sm"
        onClick={() => {
          if (selectedElement?.id && typeof onBringToFront === "function")
            onBringToFront(selectedElement.id);
        }}
      >
        Front
      </Button>

      <Button
        type="button"
        className="p-2 border rounded text-sm"
        onClick={() => {
          if (selectedElement?.id && typeof onSendToBack === "function")
            onSendToBack(selectedElement.id);
        }}
      >
        Back
      </Button>

      <Button
        type="button"
        variant="destructive"
        className="p-2 border rounded text-sm"
        onClick={() => {
          if (selectedElement?.id && typeof onDeleteElement === "function")
            onDeleteElement(selectedElement.id);
        }}
      >
        Delete
      </Button>
    </div>
  );
}
