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

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
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
}

export function DesignCanvas({
  canvasRef,
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
}: CanvasProps) {
  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className={`w-full h-64 border-2 border-dashed rounded-lg bg-white dark:bg-gray-900 ${
          tool === "draw" ? "cursor-crosshair" : "cursor-move"
        } ${
          tool === "draw"
            ? "border-purple-400 dark:border-purple-600"
            : "border-blue-400 dark:border-blue-600"
        }`}
        width={600}
        height={300}
      />

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
