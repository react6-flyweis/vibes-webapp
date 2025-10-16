import { useEffect, useRef, useState } from "react";
import {
  setupCanvas,
  getCanvasPosition,
  drawLine,
  clearCanvas as clearCanvasUtil,
  exportCanvasAsDataURL,
  restoreCanvasFromDataURL,
  createCanvasSnapshot,
} from "../utils/canvas-utils";
import { DEFAULT_BRUSH_SIZE, MAX_UNDO_STACK_SIZE } from "../constants";

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const brushColorRef = useRef("#000000");
  const brushSizeRef = useRef(DEFAULT_BRUSH_SIZE);

  // Image state
  const importedImageRef = useRef<HTMLImageElement | null>(null);
  const imagePositionRef = useRef<{ x: number; y: number }>({ x: 50, y: 50 });
  const imageSizeRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const isDraggingImageRef = useRef(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drawing layer (separate from image)
  const drawingLayerRef = useRef<string | null>(null);
  const redrawCanvasRef = useRef<(() => void) | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize] = useState(DEFAULT_BRUSH_SIZE);
  const [hasImage, setHasImage] = useState(false);
  const [tool, setTool] = useState<"draw" | "move">("move"); // Default to move mode
  const [layers, setLayers] = useState<
    Array<{
      id: string;
      name: string;
      visible: boolean;
      type: "image" | "drawing";
    }>
  >([]);

  // Keep refs in sync with state
  useEffect(() => {
    brushColorRef.current = brushColor;
    brushSizeRef.current = brushSize;
  }, [brushColor, brushSize]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initCanvas = () => {
      const ctx = setupCanvas(canvas);
      if (ctx) {
        ctxRef.current = ctx;
      }
    };

    initCanvas();

    const handleResize = () => {
      const ctx = ctxRef.current;
      if (!ctx) return initCanvas();

      // Preserve existing drawing
      const temp = document.createElement("canvas");
      const rect = canvas.getBoundingClientRect();
      temp.width = rect.width;
      temp.height = rect.height;
      const tctx = temp.getContext("2d");

      if (tctx) {
        tctx.drawImage(canvas, 0, 0, temp.width, temp.height);
      }

      initCanvas();
      const newCtx = ctxRef.current;

      if (newCtx && tctx) {
        newCtx.drawImage(temp, 0, 0, temp.width, temp.height);
      }
    };

    const start = (ev: PointerEvent) => {
      const pos = getCanvasPosition(canvas, ev);

      // In move mode, check if clicking on the image
      if (tool === "move" && importedImageRef.current && hasImage) {
        const imgPos = imagePositionRef.current;
        const imgSize = imageSizeRef.current;

        if (
          pos.x >= imgPos.x &&
          pos.x <= imgPos.x + imgSize.width &&
          pos.y >= imgPos.y &&
          pos.y <= imgPos.y + imgSize.height
        ) {
          // Save the drawing layer before moving the image
          const ctx = ctxRef.current;
          if (ctx) {
            const tempCanvas = document.createElement("canvas");
            const rect = canvas.getBoundingClientRect();
            tempCanvas.width = rect.width;
            tempCanvas.height = rect.height;
            const tempCtx = tempCanvas.getContext("2d");

            if (tempCtx) {
              // Draw only the drawing layer (copy canvas and remove image)
              tempCtx.drawImage(canvas, 0, 0);
              // Clear the area where the image was
              tempCtx.clearRect(
                imgPos.x,
                imgPos.y,
                imgSize.width,
                imgSize.height
              );
              drawingLayerRef.current = tempCanvas.toDataURL();
            }
          }

          // Start dragging the image
          isDraggingImageRef.current = true;
          dragOffsetRef.current = {
            x: pos.x - imgPos.x,
            y: pos.y - imgPos.y,
          };
          try {
            (ev.target as Element).setPointerCapture(ev.pointerId);
          } catch {}
          return;
        }
      }

      // In draw mode, start drawing
      if (tool === "draw") {
        saveSnapshot();
        try {
          (ev.target as Element).setPointerCapture(ev.pointerId);
        } catch {}
        setIsDrawing(true);
        isDrawingRef.current = true;
        lastPosRef.current = pos;
      }
    };

    const move = (ev: PointerEvent) => {
      const pos = getCanvasPosition(canvas, ev);

      // Handle image dragging
      if (isDraggingImageRef.current) {
        imagePositionRef.current = {
          x: pos.x - dragOffsetRef.current.x,
          y: pos.y - dragOffsetRef.current.y,
        };
        redrawCanvas();
        return;
      }

      // Handle drawing
      if (!isDrawingRef.current) return;
      const ctx = ctxRef.current;
      if (!ctx || !lastPosRef.current) return;

      drawLine(
        ctx,
        lastPosRef.current,
        pos,
        brushColorRef.current,
        brushSizeRef.current
      );
      lastPosRef.current = pos;
    };

    const end = (ev: PointerEvent) => {
      try {
        (ev.target as Element).releasePointerCapture(ev.pointerId);
      } catch {}

      // If was dragging image, save state
      if (isDraggingImageRef.current) {
        isDraggingImageRef.current = false;
        saveSnapshot();
        return;
      }

      setIsDrawing(false);
      isDrawingRef.current = false;
      lastPosRef.current = null;
    };

    // Function to redraw canvas with image
    const redrawCanvas = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Clear the entire canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw the image at current position first (as background layer)
      if (importedImageRef.current && hasImage) {
        ctx.drawImage(
          importedImageRef.current,
          imagePositionRef.current.x,
          imagePositionRef.current.y,
          imageSizeRef.current.width,
          imageSizeRef.current.height
        );
      }

      // Draw the saved drawing layer on top (if exists)
      if (drawingLayerRef.current) {
        const drawingImg = new Image();
        drawingImg.onload = () => {
          ctx.drawImage(drawingImg, 0, 0);
        };
        drawingImg.src = drawingLayerRef.current;
      }
    };

    // Store redraw function in ref so it can be accessed outside useEffect
    redrawCanvasRef.current = redrawCanvas;

    canvas.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("resize", handleResize);
    };
  }, [tool, hasImage]); // Re-attach event handlers when tool or hasImage changes

  const saveSnapshot = (limit = MAX_UNDO_STACK_SIZE) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const data = createCanvasSnapshot(canvas);
    if (data) {
      undoStackRef.current.push(data);
      if (undoStackRef.current.length > limit) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
    }
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || undoStackRef.current.length === 0) return;

    const currentData = createCanvasSnapshot(canvas);
    const last = undoStackRef.current.pop() as string;
    redoStackRef.current.push(currentData);
    restoreCanvasFromDataURL(canvas, ctx, last);
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || redoStackRef.current.length === 0) return;

    const currentData = createCanvasSnapshot(canvas);
    const next = redoStackRef.current.pop() as string;
    undoStackRef.current.push(currentData);
    restoreCanvasFromDataURL(canvas, ctx, next);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    saveSnapshot();
    clearCanvasUtil(canvas, ctx);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = exportCanvasAsDataURL(canvas);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importImage = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Save current state for undo
      saveSnapshot();

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const rect = canvas.getBoundingClientRect();

          // Calculate scaling to fit image within canvas while maintaining aspect ratio
          const maxWidth = rect.width * 0.6; // Use 60% of canvas width
          const maxHeight = rect.height * 0.6; // Use 60% of canvas height
          const scale = Math.min(
            maxWidth / img.width,
            maxHeight / img.height,
            1 // Don't scale up, only down
          );

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Center the image
          const x = (rect.width - scaledWidth) / 2;
          const y = (rect.height - scaledHeight) / 2;

          // Store image and its properties in refs
          importedImageRef.current = img;
          imagePositionRef.current = { x, y };
          imageSizeRef.current = { width: scaledWidth, height: scaledHeight };
          setHasImage(true);

          // Add image layer
          setLayers((prev) => {
            const imageLayer = {
              id: "image-layer",
              name: "Imported Image",
              visible: true,
              type: "image" as const,
            };
            const drawingLayer = {
              id: "drawing-layer",
              name: "Drawing",
              visible: true,
              type: "drawing" as const,
            };

            // Remove existing layers and add fresh ones
            return prev.some((l) => l.id === "image-layer")
              ? prev
              : [imageLayer, ...(prev.length === 0 ? [drawingLayer] : prev)];
          });

          // Draw the image on canvas
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    };

    // Trigger file selector
    input.click();
  };

  const toggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
    // Call redraw function if it exists
    if (redrawCanvasRef.current) {
      redrawCanvasRef.current();
    }
  };

  return {
    canvasRef,
    isDrawing,
    brushColor,
    setBrushColor,
    brushSize,
    undo,
    redo,
    clearCanvas,
    exportCanvas,
    importImage,
    tool,
    setTool,
    layers,
    toggleLayer,
  };
}
