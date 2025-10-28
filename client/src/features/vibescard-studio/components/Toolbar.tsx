import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  RotateCcw,
  RotateCw,
  Plus,
  Minus,
  Save,
  Download,
  Share2,
} from "lucide-react";

interface ToolbarProps {
  eventTitle: string;
  onEventTitleChange: (value: string) => void;
  previewMode: boolean;
  onTogglePreview: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  onExport: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function Toolbar({
  eventTitle,
  onEventTitleChange,
  previewMode,
  onTogglePreview,
  zoom,
  onZoomIn,
  onZoomOut,
  onSave,
  isSaving = false,
  saveLabel = "Save",
  onExport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: ToolbarProps) {
  return (
    <div className="bg-[#1F2937] border-gray-300 border-b text-white dark:bg-gray-800 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            value={eventTitle || "Untitled Design"}
            onChange={(e) => onEventTitleChange(e.target.value)}
            className="text-lg font-semibold border-none bg-transparent focus:ring-0 focus:border-none p-0"
          />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onTogglePreview}>
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl/Cmd+Z)"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y / Ctrl/Cmd+Shift+Z)"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            <span className="text-sm text-gray-500">{zoom}%</span>

            <Button variant="ghost" size="sm" onClick={onZoomOut}>
              <Minus className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onZoomIn}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onSave} disabled={isSaving} size="sm">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : saveLabel}
          </Button>

          <Button onClick={onExport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" size="sm" className="text-black">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
