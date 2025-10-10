import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Edit3, Eye, Play } from "lucide-react";
import { Button } from "../ui/button";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Group,
} from "react-konva";

export default function DesignCanvas(props: any) {
  const {
    elements,
    setElements,
    comments,
    setComments,
    showComments,
    commentPosition,
    setCommentPosition,
    newComment,
    setNewComment,
    selectedPlatform,
    previewMode,
    setSelectedElement,
    selectedElement,
    applyRemix,
  } = props;

  // allow parent to pass a ref so it can call stage.toDataURL() for downloads
  const stageRef = props.stageRef || useRef<any>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 450 });

  useEffect(() => {
    const resize = () => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.max(300, Math.floor(rect.width));

      // parse aspect ratio like "16:9" or fallback to 16/9
      let aspect = 16 / 9;
      try {
        if (
          selectedPlatform?.aspectRatio &&
          typeof selectedPlatform.aspectRatio === "string"
        ) {
          const parts = selectedPlatform.aspectRatio.split(":");
          if (parts.length === 2) {
            const a = parseFloat(parts[0]) || 16;
            const b = parseFloat(parts[1]) || 9;
            aspect = a / b;
          }
        }
      } catch (e) {
        aspect = 16 / 9;
      }

      // make the canvas square (user requested lower height and square)
      const height = 350;
      setStageSize({ width, height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [selectedPlatform]);

  const addComment = (x: number, y: number) => {
    if (!newComment?.trim()) return;
    const comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      userName: "Sarah Designer",
      userAvatar: "/api/placeholder/32/32",
      content: newComment,
      position: { x, y },
      timestamp: new Date().toISOString(),
      replies: [],
      resolved: false,
    };
    setComments([...comments, comment]);
    setNewComment("");
    setCommentPosition(null);
  };

  // image cache for Konva images (avoids calling hooks inside loops)
  const [imageCache, setImageCache] = useState<
    Record<string, HTMLImageElement | null>
  >({});
  useEffect(() => {
    const srcs = new Set<string>();
    elements.forEach((el: any) => {
      if (el.type === "image") {
        const s = el.src || el.content;
        if (s) srcs.add(s);
      }
      if (el.type === "background") {
        if (el.style?.backgroundImage) srcs.add(el.style.backgroundImage);
        if (
          el.style?.background &&
          String(el.style.background).trim().startsWith("linear-gradient")
        )
          srcs.add("__grad__" + el.style.background);
      }
    });

    srcs.forEach((src) => {
      if (!src || imageCache[src]) return;

      // generate gradient images for keys starting with __grad__
      if (src.startsWith("__grad__")) {
        const gradCss = src.replace("__grad__", "");
        // robust parser for linear-gradient contents and color stops (supports stops like "#ec4899 0%" and rgb(...))
        const inner = (function () {
          const start = gradCss.indexOf("(");
          const end = gradCss.lastIndexOf(")");
          if (start >= 0 && end > start)
            return gradCss.substring(start + 1, end).trim();
          return gradCss;
        })();
        const canvas = document.createElement("canvas");
        const w = Math.max(300, stageSize.width);
        const h = Math.max(300, stageSize.width);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // determine direction token if present (first token before first comma may be a direction)
          let dirToken = null as string | null;
          let stopsStr = inner;
          const firstComma = inner.indexOf(",");
          if (firstComma !== -1) {
            const possibleDir = inner.substring(0, firstComma).trim();
            // treat as direction if it starts with "to" or ends with "deg"
            if (/^to\b/i.test(possibleDir) || /deg$/.test(possibleDir)) {
              dirToken = possibleDir;
              stopsStr = inner.substring(firstComma + 1).trim();
            }
          }

          // split stops. This is a simple split by comma — accepts rgb() because it contains commas within parentheses,
          // so we need to split ignoring commas inside parentheses.
          const stops: string[] = [];
          let buf = "";
          let depth = 0;
          for (let i = 0; i < stopsStr.length; i++) {
            const ch = stopsStr[i];
            if (ch === "(") depth++;
            if (ch === ")") depth = Math.max(0, depth - 1);
            if (ch === "," && depth === 0) {
              stops.push(buf.trim());
              buf = "";
            } else {
              buf += ch;
            }
          }
          if (buf.trim()) stops.push(buf.trim());

          // parse stop color and optional position
          type Stop = { color: string; pos: number | null };
          const parsed: Stop[] = stops.map((s) => {
            const m = s.match(/(.+?)\s+([0-9]*\.?[0-9]+)%$/);
            if (m)
              return {
                color: m[1].trim(),
                pos: Math.max(0, Math.min(100, parseFloat(m[2]))) / 100,
              };
            return { color: s.trim(), pos: null };
          });

          // assign default positions if missing (spread evenly)
          const filled: Stop[] = parsed.map((p, idx) => ({ ...p }));
          const n = filled.length;
          // first, if first pos null -> 0, last if null ->1, otherwise evenly distribute nulls between known neighbors
          if (n === 1) {
            filled[0].pos = 0;
          } else {
            if (filled[0].pos == null) filled[0].pos = 0;
            if (filled[n - 1].pos == null) filled[n - 1].pos = 1;
            // fill any interior nulls by linear interpolation
            let i = 0;
            while (i < n) {
              if (filled[i].pos != null) {
                i++;
                continue;
              }
              // find j > i where pos != null
              let j = i + 1;
              while (j < n && filled[j].pos == null) j++;
              const startPos = filled[i - 1].pos ?? 0;
              const endPos = filled[j].pos ?? 1;
              const gap = j - i + 1;
              for (let k = i; k < j; k++) {
                const t = (k - (i - 1)) / gap; // fraction between startPos and endPos
                filled[k].pos = startPos + t * (endPos - startPos);
              }
              i = j;
            }
          }

          // determine gradient direction coords
          let x0 = 0,
            y0 = 0,
            x1 = w,
            y1 = 0;
          if (dirToken) {
            if (/to\s+bottom/i.test(dirToken)) {
              x0 = 0;
              y0 = 0;
              x1 = 0;
              y1 = h;
            }
            if (/to\s+top/i.test(dirToken)) {
              x0 = 0;
              y0 = h;
              x1 = 0;
              y1 = 0;
            }
            if (/to\s+left/i.test(dirToken)) {
              x0 = w;
              y0 = 0;
              x1 = 0;
              y1 = 0;
            }
            if (/to\s+right/i.test(dirToken)) {
              x0 = 0;
              y0 = 0;
              x1 = w;
              y1 = 0;
            }
            const degMatch = dirToken.match(/([0-9.]+)deg/);
            if (degMatch) {
              // angle-based gradients: convert angle degrees to vector
              const deg = parseFloat(degMatch[1]) * (Math.PI / 180);
              const cx = w / 2,
                cy = h / 2;
              const dx = Math.cos(deg),
                dy = Math.sin(deg);
              x0 = cx - dx * w;
              y0 = cy - dy * h;
              x1 = cx + dx * w;
              y1 = cy + dy * h;
            }
          }

          const g = ctx.createLinearGradient(x0, y0, x1, y1);
          filled.forEach((s) => {
            if (s.pos == null) return; // shouldn't happen
            // defensively remove trailing percent tokens that might remain in color
            let colorVal = s.color.replace(/\s+[0-9]*\.?[0-9]+%$/, "").trim();
            try {
              g.addColorStop(s.pos, colorVal);
            } catch (err) {
              // fallback: try first token only
              const colorOnly = colorVal.split(" ")[0];
              try {
                g.addColorStop(s.pos, colorOnly);
              } catch (e) {
                /* ignore */
              }
            }
          });
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
        // else if (ctx) {
        //   ctx.fillStyle = "#ffffff";
        //   ctx.fillRect(0, 0, w, h);
        // }
        const img = new window.Image();
        img.src = canvas.toDataURL();
        img.onload = () => setImageCache((prev) => ({ ...prev, [src]: img }));
        img.onerror = () => setImageCache((prev) => ({ ...prev, [src]: null }));
        return;
      }

      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = src;
      img.onload = () => setImageCache((prev) => ({ ...prev, [src]: img }));
      img.onerror = () => setImageCache((prev) => ({ ...prev, [src]: null }));
    });
  }, [elements, stageSize.width]);

  const updateElementPosition = useCallback(
    (id: string, xPx: number, yPx: number) => {
      // persist position into elements array and update selectedElement if it matches
      setElements((prev: any[]) => {
        const w = stageSize.width;
        const h = stageSize.height;
        const newArr = prev.map((el) => {
          if (el.id !== id) return el;
          // if this element uses center anchoring, the xPx/yPx we get are render coordinates (top-left)
          // convert back to stored percent coordinates by adding half of the element size
          const isCentered =
            el.position?.anchor === "center" || el.center === true;
          const offsetX = isCentered ? (el.size?.width || 100) / 2 : 0;
          const offsetY = isCentered ? (el.size?.height || 40) / 2 : 0;
          const storedX = ((xPx + offsetX) / w) * 100;
          const storedY = ((yPx + offsetY) / h) * 100;
          return {
            ...el,
            position: {
              x: Math.max(0, Math.min(100, storedX)),
              y: Math.max(0, Math.min(100, storedY)),
            },
          };
        });
        const updated = newArr.find((e) => e.id === id) || null;
        try {
          if (updated && selectedElement?.id === id)
            setSelectedElement(updated);
        } catch (e) {
          // ignore if setter not provided
        }
        return newArr;
      });
    },
    [stageSize.width, stageSize.height, setElements]
  );

  // helper to compute render (pixel) position from stored percent position
  const getRenderPosition = (el: any) => {
    const xPx = ((el.position?.x ?? 0) / 100) * stageSize.width;
    const yPx = ((el.position?.y ?? 0) / 100) * stageSize.height;
    const width = el.size?.width ?? 100;
    const height = el.size?.height ?? 40;
    const isCentered = el.position?.anchor === "center" || el.center === true;
    return {
      renderX: isCentered ? xPx - width / 2 : xPx,
      renderY: isCentered ? yPx - height / 2 : yPx,
      width,
      height,
      isCentered,
    };
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Design Canvas</h3>
        <div className="flex gap-2">
          <Button
            className={`px-3 py-1 border ${
              previewMode === "design" ? "bg-gray-200" : ""
            }`}
            onClick={() => {}}
          >
            <Edit3 /> Design
          </Button>
          <Button
            className={`px-3 py-1 border ${
              previewMode === "mockup" ? "bg-gray-200" : ""
            }`}
            onClick={() => {}}
          >
            <Eye /> Mockup
          </Button>
          <Button
            className={`px-3 py-1 border ${
              previewMode === "animation" ? "bg-gray-200" : ""
            }`}
            onClick={() => {}}
          >
            <Play /> Animation
          </Button>
        </div>
      </div>

      {previewMode === "design" && (
        <div
          ref={canvasRef}
          className="relative w-full bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-crosshair flex justify-center items-center"
        >
          <div style={{ width: stageSize.width, height: stageSize.height }}>
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={(e) => {
                if (commentPosition) {
                  const pos = e.target.getStage()?.getPointerPosition();
                  if (pos) {
                    const x = (pos.x / stageSize.width) * 100;
                    const y = (pos.y / stageSize.height) * 100;
                    addComment(x, y);
                  }
                }
              }}
            >
              <Layer>
                {elements
                  .filter((el: any) => el.type === "background")
                  .map((element: any) => {
                    if (
                      element.style?.backgroundImage ||
                      (element.style?.background &&
                        String(element.style.background)
                          .trim()
                          .startsWith("linear-gradient"))
                    ) {
                      const src =
                        element.style.backgroundImage ||
                        "__grad__" + element.style.background;
                      const img = imageCache[src];
                      return (
                        <KonvaImage
                          key={element.id}
                          image={img as any}
                          x={0}
                          y={0}
                          width={stageSize.width}
                          height={stageSize.height}
                          opacity={element.style.opacity ?? 1}
                        />
                      );
                    }
                    const bg = element.style?.background;
                    if (bg && String(bg).trim().startsWith("linear-gradient")) {
                      const gradKey = "__grad__" + bg;
                      const gradImg = imageCache[gradKey];
                      return (
                        <KonvaImage
                          key={element.id}
                          image={gradImg as any}
                          x={0}
                          y={0}
                          width={stageSize.width}
                          height={stageSize.height}
                          opacity={element.style.opacity ?? 1}
                        />
                      );
                    }

                    return (
                      <Rect
                        key={element.id}
                        x={0}
                        y={0}
                        width={stageSize.width}
                        height={stageSize.height}
                        fill={element.style?.background || "#ffffff"}
                        opacity={element.style?.opacity ?? 1}
                      />
                    );
                  })}

                {elements
                  .filter((el: any) => el.type !== "background")
                  .map((element: any) => {
                    const { renderX, renderY, width, height, isCentered } =
                      getRenderPosition(element);

                    if (element.type === "image") {
                      const src = element.src || element.content;
                      const img = imageCache[src];
                      return (
                        <KonvaImage
                          key={element.id}
                          x={renderX}
                          y={renderY}
                          image={img as any}
                          width={width}
                          height={height}
                          draggable
                          onDragMove={(e) => {
                            const nx = e.target.x();
                            const ny = e.target.y();
                            try {
                              if (selectedElement?.id === element.id) {
                                // when previewing live drag, show the stored percent position (account for center)
                                const offsetX = isCentered ? width / 2 : 0;
                                const offsetY = isCentered ? height / 2 : 0;
                                setSelectedElement({
                                  ...selectedElement,
                                  position: {
                                    x: ((nx + offsetX) / stageSize.width) * 100,
                                    y:
                                      ((ny + offsetY) / stageSize.height) * 100,
                                  },
                                });
                              }
                            } catch (err) {}
                          }}
                          onDragEnd={(e) =>
                            updateElementPosition(
                              element.id,
                              e.target.x(),
                              e.target.y()
                            )
                          }
                          onClick={(e) => {
                            e.cancelBubble = true;
                            setSelectedElement(element);
                          }}
                        />
                      );
                    }

                    return (
                      <Group
                        key={element.id}
                        x={renderX}
                        y={renderY}
                        draggable
                        onDragMove={(e) => {
                          const nx = e.target.x();
                          const ny = e.target.y();
                          try {
                            if (selectedElement?.id === element.id) {
                              const offsetX = isCentered ? width / 2 : 0;
                              const offsetY = isCentered ? height / 2 : 0;
                              setSelectedElement({
                                ...selectedElement,
                                position: {
                                  x: ((nx + offsetX) / stageSize.width) * 100,
                                  y: ((ny + offsetY) / stageSize.height) * 100,
                                },
                              });
                            }
                          } catch (err) {}
                        }}
                        onDragEnd={(e) =>
                          updateElementPosition(
                            element.id,
                            e.target.x(),
                            e.target.y()
                          )
                        }
                        onClick={(e) => {
                          e.cancelBubble = true;
                          setSelectedElement(element);
                        }}
                      >
                        <Text
                          text={element.content}
                          fontSize={parseInt(
                            String(element.style?.fontSize || 18),
                            10
                          )}
                          fontFamily={element.style?.fontFamily || "Arial"}
                          fill={element.style?.color || "#000"}
                          opacity={element.style?.opacity ?? 1}
                        />
                      </Group>
                    );
                  })}

                {selectedPlatform && (
                  <Group listening={false}>
                    <Rect
                      x={0}
                      y={0}
                      width={stageSize.width}
                      height={stageSize.height}
                      strokeWidth={0}
                      fillEnabled={false}
                    />
                    <Rect
                      x={
                        (selectedPlatform.specs.safeZones.left /
                          selectedPlatform.dimensions.width) *
                        stageSize.width
                      }
                      y={
                        (selectedPlatform.specs.safeZones.top /
                          selectedPlatform.dimensions.height) *
                        stageSize.height
                      }
                      width={
                        stageSize.width -
                        ((selectedPlatform.specs.safeZones.left +
                          selectedPlatform.specs.safeZones.right) /
                          selectedPlatform.dimensions.width) *
                          stageSize.width
                      }
                      height={
                        stageSize.height -
                        ((selectedPlatform.specs.safeZones.top +
                          selectedPlatform.specs.safeZones.bottom) /
                          selectedPlatform.dimensions.height) *
                          stageSize.height
                      }
                      stroke="#f59e0b"
                      dash={[6, 6]}
                      opacity={0.6}
                    />
                  </Group>
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      )}

      {previewMode === "mockup" && selectedPlatform && (
        <div className="flex justify-center">
          {/* Mockup rendering is handled by a separate component */}
        </div>
      )}

      {previewMode === "animation" && (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Animation Preview</h4>
              <p className="text-gray-600">
                Interactive animations and transitions for social media
              </p>
            </div>
          </div>
        </div>
      )}

      {/*
      Comment Input
      {commentPosition && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium">Add Comment</div>
          <div className="flex gap-2 mt-2">
            <textarea
              placeholder="Leave a comment or suggestion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
              rows={2}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    addComment(50, 50);
                  }
                }}
                className="p-2 bg-blue-600 text-white rounded"
              >
                <Send />
              </button>
              <button
                className="p-2 border rounded"
                onClick={() => setCommentPosition(null)}
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      )}
      */}
    </Card>
  );
}
