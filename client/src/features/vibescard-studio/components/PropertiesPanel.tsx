import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy, Bold, Italic } from "lucide-react";
import { DesignElement } from "../types";

interface PropertiesPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1F2937] text-white dark:bg-gray-800 dark:border-gray-700 p-4 flex items-center justify-center">
        <p className="text-sm text-gray-400">Select an element to edit</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#1F2937] text-white dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <Card className="bg-[#0A0A0A] text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Element Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onDuplicateElement(selectedElement.id)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => onDeleteElement(selectedElement.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>

            <Separator />

            {/* Position & Size */}
            <div className="space-y-3">
              <h4 className="font-medium">Position & Size</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>X</Label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        x: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Y</Label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        y: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Width</Label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        width: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        height: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Style Properties */}
            {selectedElement.type === "text" && (
              <div className="space-y-3">
                <h4 className="font-medium">Text Style</h4>
                <div>
                  <Label>Font Size</Label>
                  <Slider
                    value={[selectedElement.style?.fontSize || 18]}
                    onValueChange={(value) =>
                      onUpdateElement(selectedElement.id, {
                        style: { ...selectedElement.style, fontSize: value[0] },
                      })
                    }
                    min={12}
                    max={72}
                    step={1}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedElement.style?.fontWeight === "bold"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          fontWeight:
                            selectedElement.style?.fontWeight === "bold"
                              ? "normal"
                              : "bold",
                        },
                      })
                    }
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={
                      selectedElement.style?.fontStyle === "italic"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          fontStyle:
                            selectedElement.style?.fontStyle === "italic"
                              ? "normal"
                              : "italic",
                        },
                      })
                    }
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            {/* Opacity */}
            <div className="space-y-3">
              <h4 className="font-medium">Opacity</h4>
              <Slider
                value={[selectedElement.opacity * 100]}
                onValueChange={(value) =>
                  onUpdateElement(selectedElement.id, {
                    opacity: value[0] / 100,
                  })
                }
                min={0}
                max={100}
                step={1}
              />
            </div>

            <Separator />

            {/* Rotation */}
            <div className="space-y-3">
              <h4 className="font-medium">Rotation</h4>
              <Slider
                value={[selectedElement.rotation]}
                onValueChange={(value) =>
                  onUpdateElement(selectedElement.id, { rotation: value[0] })
                }
                min={-180}
                max={180}
                step={1}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
