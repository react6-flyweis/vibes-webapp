import { useState, useRef } from "react";

interface KonvaImage {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: "image" | "drawing";
}

interface Line {
  tool: string;
  points: number[];
  color: string;
  size: number;
}

export function useKonvaCanvas() {
  const stageRef = useRef<any>(null);
  const drawingLayerRef = useRef<any>(null);
  const imageLayerRef = useRef<any>(null);
  const [importedImages, setImportedImages] = useState<KonvaImage[]>([]);

  const [tool, setTool] = useState<"draw" | "move">("move");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize] = useState(3);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[][]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    if (tool === "draw") {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();

      // Add drawing layer if it doesn't exist
      if (!layers.find((l) => l.id === "drawing-layer")) {
        setLayers([
          ...layers,
          {
            id: "drawing-layer",
            name: "Drawing",
            visible: true,
            type: "drawing",
          },
        ]);
      }

      setLines([
        ...lines,
        {
          tool: "pen",
          points: [pos.x, pos.y],
          color: brushColor,
          size: brushSize,
        },
      ]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || tool !== "draw") {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];

    // Add point to the last line
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Replace the last line
    setLines(lines.slice(0, lines.length - 1).concat([lastLine]));
  };

  const handleMouseUp = () => {
    if (isDrawing.current && tool === "draw") {
      isDrawing.current = false;
      // Save to history for undo
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...lines]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setLines(history[historyStep - 1] || []);
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setLines(history[historyStep + 1] || []);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const exportCanvas = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL();
      const link = document.createElement("a");
      link.download = "canvas.png";
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const importImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Generate unique ID for this image
        const imageId = `image-${Date.now()}`;

        // Add image layer if not exists
        if (!layers.find((l) => l.id === imageId)) {
          setLayers([
            ...layers,
            {
              id: imageId,
              name: `Image ${importedImages.length + 1}`,
              visible: true,
              type: "image",
            },
          ]);
        }

        // Calculate dimensions while maintaining aspect ratio
        // Canvas will be responsive, so use larger max dimensions
        const maxWidth = 700;
        const maxHeight = 350;
        const aspectRatio = img.width / img.height;

        let width = img.width;
        let height = img.height;

        // Scale down if image is too large
        if (width > maxWidth || height > maxHeight) {
          if (aspectRatio > 1) {
            // Landscape
            width = maxWidth;
            height = maxWidth / aspectRatio;
          } else {
            // Portrait or square
            height = maxHeight;
            width = maxHeight * aspectRatio;
          }
        }

        // Add new image to the array
        const newImage: KonvaImage = {
          id: imageId,
          image: img,
          x: 50 + importedImages.length * 20, // Offset each new image
          y: 50 + importedImages.length * 20,
          width: width,
          height: height,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        };

        setImportedImages([...importedImages, newImage]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleLayer = (layerId: string) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  return {
    stageRef,
    drawingLayerRef,
    imageLayerRef,
    tool,
    setTool,
    brushColor,
    setBrushColor,
    brushSize,
    lines,
    layers,
    importedImages,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    undo,
    redo,
    clearCanvas,
    exportCanvas,
    importImage,
    toggleLayer,
  };
}
