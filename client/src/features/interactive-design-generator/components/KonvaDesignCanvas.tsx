import { Button } from "@/components/ui/button";
import {
  Undo,
  Redo,
  Layers,
  Download,
  Move,
  Brush,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Stage,
  Layer,
  Line,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import React, { useEffect, useRef, useState } from "react";

interface CanvasProps {
  colorPalette: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onExport: () => void;
  tool: "draw" | "move";
  onToolChange: (tool: "draw" | "move") => void;
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    type: "image" | "drawing";
  }>;
  onToggleLayer: (layerId: string) => void;
  lines: any[];
  importedImages: any[];
  onMouseDown: (e: any) => void;
  onMouseMove: (e: any) => void;
  onMouseUp: (e: any) => void;
  stageRef: any;
  drawingLayerRef: any;
  imageLayerRef: any;
}

export function KonvaDesignCanvas({
  colorPalette,
  selectedColor,
  onColorSelect,
  onUndo,
  onRedo,
  onClear,
  onExport,
  tool,
  onToolChange,
  layers,
  onToggleLayer,
  lines,
  importedImages,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  stageRef,
  drawingLayerRef,
  imageLayerRef,
}: CanvasProps) {
  const imageRefs = useRef<any>({});
  const transformerRef = useRef<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDimensions({
          width: width,
          height: 400, // Fixed height
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Update transformer when image is selected in move mode
  useEffect(() => {
    if (transformerRef.current && selectedNodeId && tool === "move") {
      const selectedNode = imageRefs.current[selectedNodeId];
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedNodeId, tool]);

  // Update all images' draggable state when tool changes
  useEffect(() => {
    Object.values(imageRefs.current).forEach((imageRef: any) => {
      if (imageRef) {
        imageRef.draggable(tool === "move");
      }
    });

    // Clear selection when switching to draw mode
    if (tool === "draw") {
      setSelectedNodeId(null);
    }
  }, [tool]);

  // Handle click on stage to deselect
  const handleStageClick = (e: any) => {
    // If clicked on empty area, deselect
    if (e.target === e.target.getStage()) {
      setSelectedNodeId(null);
    }
  };

  // Handle image click in move mode
  const handleImageClick = (imageId: string) => {
    if (tool === "move") {
      setSelectedNodeId(imageId);
    }
  };

  // Get layer visibility by image ID
  const getImageLayerVisibility = (imageId: string) => {
    const layer = layers.find((l) => l.id === imageId);
    return layer?.visible !== false;
  };

  // Get layer visibility
  const getLayerVisibility = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    return layer?.visible !== false;
  };

  return (
    <div className="space-y-4">
      {/* Konva Stage */}
      <div
        ref={containerRef}
        className={`border-2 border-dashed rounded-lg ${
          tool === "draw"
            ? "border-purple-400 dark:border-purple-600"
            : "border-blue-400 dark:border-blue-600"
        }`}
      >
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={(e) => {
            handleStageClick(e);
            onMouseDown(e);
          }}
          onMousemove={onMouseMove}
          onMouseup={onMouseUp}
          onTouchStart={(e) => {
            handleStageClick(e);
            onMouseDown(e);
          }}
          onTouchMove={onMouseMove}
          onTouchEnd={onMouseUp}
          ref={stageRef}
          className={tool === "draw" ? "cursor-crosshair" : "cursor-move"}
        >
          {/* Image Layer */}
          <Layer ref={imageLayerRef}>
            {importedImages.map((img) => (
              <React.Fragment key={img.id}>
                {getImageLayerVisibility(img.id) && (
                  <KonvaImage
                    ref={(node) => {
                      if (node) {
                        imageRefs.current[img.id] = node;
                      }
                    }}
                    image={img.image}
                    x={img.x}
                    y={img.y}
                    width={img.width}
                    height={img.height}
                    rotation={img.rotation}
                    scaleX={img.scaleX}
                    scaleY={img.scaleY}
                    draggable={tool === "move"}
                    onClick={() => handleImageClick(img.id)}
                    onTap={() => handleImageClick(img.id)}
                  />
                )}
              </React.Fragment>
            ))}
            {tool === "move" && selectedNodeId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize to prevent image from being too small
                  if (newBox.width < 20 || newBox.height < 20) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>

          {/* Drawing Layer */}
          <Layer
            ref={drawingLayerRef}
            visible={getLayerVisibility("drawing-layer")}
          >
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.size}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Tool Selection */}
      <div className="flex gap-2 items-center">
        <Button
          variant={tool === "move" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("move")}
          className={tool === "move" ? "bg-blue-600 hover:bg-blue-700" : ""}
        >
          <Move className="h-4 w-4 mr-2" />
          Move
        </Button>
        <Button
          variant={tool === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => onToolChange("draw")}
          className={tool === "draw" ? "bg-purple-600 hover:bg-purple-700" : ""}
        >
          <Brush className="h-4 w-4 mr-2" />
          Draw
        </Button>
        <div className="ml-2 text-sm text-gray-500">
          {tool === "move"
            ? "Click and drag layers to reposition"
            : "Click to select color and start drawing"}
        </div>
      </div>

      {/* Color Palette */}
      <div className="flex gap-2 flex-wrap">
        {colorPalette.map((color, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-lg border-2 shadow-lg cursor-pointer transform hover:scale-110 transition-all ${
              selectedColor === color && tool === "draw"
                ? "border-purple-500 ring-2 ring-purple-300 scale-110"
                : "border-white"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorSelect(color);
              onToolChange("draw"); // Auto-switch to draw mode when color is selected
            }}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onUndo}>
          <Undo className="h-4 w-4 mr-2" />
          Undo
        </Button>
        <Button variant="outline" onClick={onRedo}>
          <Redo className="h-4 w-4 mr-2" />
          Redo
        </Button>

        {/* Layers Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Layers className="h-4 w-4 mr-2" />
              Layers {layers.length > 0 && `(${layers.length})`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm mb-3">Canvas Layers</h4>
              {layers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No layers yet. Import an image or start drawing!
                </p>
              ) : (
                layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Badge
                        variant={
                          layer.type === "image" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {layer.type === "image" ? "🖼️" : "✏️"}
                      </Badge>
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleLayer(layer.id)}
                      className="h-8 w-8 p-0"
                    >
                      {layer.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
        <Button onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
