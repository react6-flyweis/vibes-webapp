import React from "react";

export default function StageProperties({ elements, onUpdateElement }: any) {
  const bg = Array.isArray(elements)
    ? elements.find((e: any) => e.type === "background")
    : undefined;

  if (bg) {
    return (
      <div>
        <div className="text-sm">Background Color</div>
        <input
          type="color"
          value={bg.style?.background || "#ffffff"}
          onChange={(e) =>
            onUpdateElement &&
            onUpdateElement({
              ...bg,
              style: { ...(bg.style || {}), background: e.target.value },
            })
          }
          className="mt-1 h-8 w-12 p-0 border rounded"
        />

        <div className="mt-3">
          <div className="text-sm">Background Type</div>
          <select
            value={bg.style?.backgroundType || "solid"}
            onChange={(e) =>
              onUpdateElement &&
              onUpdateElement({
                ...bg,
                style: { ...(bg.style || {}), backgroundType: e.target.value },
              })
            }
            className="mt-1 w-full border p-2 rounded"
          >
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>

          {bg.style?.backgroundType === "gradient" ? (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-sm">Gradient From</div>
                <input
                  type="color"
                  value={
                    bg.style?.gradientFrom || bg.style?.background || "#ffffff"
                  }
                  onChange={(e) =>
                    onUpdateElement &&
                    onUpdateElement({
                      ...bg,
                      style: {
                        ...(bg.style || {}),
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
                  value={bg.style?.gradientTo || "#000000"}
                  onChange={(e) =>
                    onUpdateElement &&
                    onUpdateElement({
                      ...bg,
                      style: {
                        ...(bg.style || {}),
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
                  value={bg.style?.gradientDirection || "to bottom"}
                  onChange={(e) =>
                    onUpdateElement &&
                    onUpdateElement({
                      ...bg,
                      style: {
                        ...(bg.style || {}),
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
              <div className="text-sm">Background Opacity</div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round((bg.style?.opacity ?? 1) * 100)}
                onChange={(e) =>
                  onUpdateElement &&
                  onUpdateElement({
                    ...bg,
                    style: {
                      ...(bg.style || {}),
                      opacity: Number(e.target.value || 100) / 100,
                    },
                  })
                }
                className="w-full mt-2"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm">Canvas Width & Height</div>
      <div className="flex gap-2 mt-2">
        <input className="w-1/2 border p-2 rounded" placeholder="Width" />
        <input className="w-1/2 border p-2 rounded" placeholder="Height" />
      </div>
      <div className="mt-3 text-sm text-gray-600">
        No background element found — add one to control background color/image
        directly.
      </div>
    </div>
  );
}
