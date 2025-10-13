import React from "react";

export default function TextControls({
  selectedElement,
  setSelectedElement,
}: any) {
  if (!selectedElement) return null;
  return (
    <div>
      <div className="text-sm">Content</div>
      <input
        value={selectedElement.content}
        onChange={(e) =>
          setSelectedElement({ ...selectedElement, content: e.target.value })
        }
        className="mt-1 w-full border p-2 rounded"
      />

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="text-sm">Font</div>
          <select
            value={selectedElement.style?.fontFamily || "Inter"}
            onChange={(e) =>
              setSelectedElement({
                ...selectedElement,
                style: {
                  ...(selectedElement.style || {}),
                  fontFamily: e.target.value,
                },
              })
            }
            className="ml-2 w-1/2 border p-1 rounded"
          >
            <option>Inter</option>
            <option>Arial</option>
            <option>Helvetica</option>
            <option>Roboto</option>
            <option>Georgia</option>
            <option>Times New Roman</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Bold"
            className={`p-2 border rounded ${
              selectedElement.style?.fontWeight === "bold" ? "bg-gray-200" : ""
            }`}
            onClick={() =>
              setSelectedElement({
                ...selectedElement,
                style: {
                  ...(selectedElement.style || {}),
                  fontWeight:
                    selectedElement.style?.fontWeight === "bold"
                      ? "normal"
                      : "bold",
                },
              })
            }
          >
            <strong>B</strong>
          </button>

          <button
            type="button"
            title="Italic"
            className={`p-2 border rounded ${
              selectedElement.style?.fontStyle === "italic" ? "bg-gray-200" : ""
            }`}
            onClick={() =>
              setSelectedElement({
                ...selectedElement,
                style: {
                  ...(selectedElement.style || {}),
                  fontStyle:
                    selectedElement.style?.fontStyle === "italic"
                      ? "normal"
                      : "italic",
                },
              })
            }
          >
            <em>I</em>
          </button>

          <button
            type="button"
            title="Underline"
            className={`p-2 border rounded ${
              selectedElement.style?.textDecoration === "underline"
                ? "bg-gray-200"
                : ""
            }`}
            onClick={() =>
              setSelectedElement({
                ...selectedElement,
                style: {
                  ...(selectedElement.style || {}),
                  textDecoration:
                    selectedElement.style?.textDecoration === "underline"
                      ? "none"
                      : "underline",
                },
              })
            }
          >
            <span className="underline">U</span>
          </button>

          <div className="ml-3 flex items-center gap-1 text-sm text-gray-600">
            Align:
            <select
              value={selectedElement.style?.textAlign || "left"}
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    textAlign: e.target.value,
                  },
                })
              }
              className="ml-1 border p-1 rounded"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500">Line height</div>
            <input
              type="range"
              min={8}
              max={300}
              value={
                selectedElement.style?.lineHeight
                  ? Number(selectedElement.style.lineHeight)
                  : 120
              }
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    lineHeight: Number(e.target.value || 120),
                  },
                })
              }
              className="w-full mt-1"
            />
          </div>

          <div className="w-1/3">
            <div className="text-xs text-gray-500">Letter</div>
            <input
              type="range"
              min={-5}
              max={20}
              value={
                selectedElement.style?.letterSpacing !== undefined
                  ? Number(
                      String(selectedElement.style.letterSpacing).replace(
                        /[^0-9\-\.]/g,
                        ""
                      )
                    )
                  : 0
              }
              onChange={(e) =>
                setSelectedElement({
                  ...selectedElement,
                  style: {
                    ...(selectedElement.style || {}),
                    letterSpacing: Number(e.target.value || 0),
                  },
                })
              }
              className="w-full mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
