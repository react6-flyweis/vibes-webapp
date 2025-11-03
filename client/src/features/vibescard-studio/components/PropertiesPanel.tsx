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
  // color scheme object from editor (primary/secondary/accent/background/text)
  colorScheme?: { [key: string]: string } | null;
}

export function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  colorScheme = null,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-[25%] bg-[#1F2937] text-white dark:bg-gray-800 dark:border-gray-700 p-4 flex items-center justify-center shrink-0">
        <p className="text-sm text-gray-400">Select an element to edit</p>
      </div>
    );
  }

  return (
    <div className="w-[25%] bg-[#1F2937] text-white dark:bg-gray-800 dark:border-gray-700 overflow-y-auto shrink-0">
      <div className="p-4">
        <Card className="bg-[#0A0A0A] text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Element Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Palette swatches (editor color scheme) */}
            {colorScheme && (
              <div>
                <Label>Design Palette</Label>
                <div className="flex gap-2 mt-2">
                  {Object.values(colorScheme).map((c) => (
                    <button
                      key={c}
                      title={`Use ${c}`}
                      onClick={() => {
                        // apply palette color depending on element type
                        if (selectedElement.type === "text") {
                          onUpdateElement(selectedElement.id, {
                            style: { ...selectedElement.style, color: c },
                          });
                        } else if (selectedElement.type === "shape") {
                          onUpdateElement(selectedElement.id, {
                            style: {
                              ...selectedElement.style,
                              backgroundColor: c,
                            },
                          });
                        } else if (selectedElement.type === "logo") {
                          onUpdateElement(selectedElement.id, {
                            style: { ...selectedElement.style, color: c },
                          });
                        } else if (selectedElement.type === "border") {
                          onUpdateElement(selectedElement.id, {
                            style: { ...selectedElement.style, borderColor: c },
                          });
                        } else {
                          // generic fallback - set background or color
                          onUpdateElement(selectedElement.id, {
                            style: {
                              ...selectedElement.style,
                              backgroundColor: c,
                            },
                          });
                        }
                      }}
                      className="w-8 h-8 rounded border border-white/20"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white text-black"
                onClick={() => onDuplicateElement(selectedElement.id)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 bg-white text-black"
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
                    className="bg-white text-black"
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
                    className="bg-white text-black"
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
                    className="bg-white text-black"
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
                    className="bg-white text-black"
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
                {/* Text content editor */}
                <div>
                  <Label>Text</Label>
                  <textarea
                    className="w-full p-2 rounded bg-white text-black text-sm"
                    rows={4}
                    value={selectedElement.content?.text || ""}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        content: {
                          ...selectedElement.content,
                          text: e.target.value,
                        },
                      })
                    }
                  />
                </div>
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
                <div>
                  <Label>Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.style?.color || "#000000"}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-8 p-0 border-0 rounded"
                      title="Pick text color"
                    />
                    <Input
                      value={selectedElement.style?.color || ""}
                      className="bg-white text-black flex-1"
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            color: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedElement.style?.fontWeight === "bold"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="bg-white text-black"
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
                    className="bg-white text-black"
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

            {/* Image properties */}
            {selectedElement.type === "image" && (
              <div className="space-y-3">
                <h4 className="font-medium">Image</h4>
                <div>
                  <Label>Source URL</Label>
                  <Input
                    value={selectedElement.content?.src || ""}
                    className="bg-white text-black"
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        content: {
                          ...selectedElement.content,
                          src: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Corner Radius</Label>
                  <Slider
                    value={[selectedElement.style?.borderRadius || 0]}
                    onValueChange={(value) =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          borderRadius: value[0],
                        },
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            )}

            {/* Shape properties */}
            {selectedElement.type === "shape" && (
              <div className="space-y-3">
                <h4 className="font-medium">Shape</h4>
                <div>
                  <Label>Shape</Label>
                  <select
                    value={selectedElement.content?.shape || "rectangle"}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        content: {
                          ...selectedElement.content,
                          shape: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 rounded bg-white text-black text-sm"
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="ellipse">Ellipse</option>
                    <option value="circle">Circle</option>
                  </select>
                </div>
                <div>
                  <Label>Fill Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        selectedElement.style?.backgroundColor || "#ffffff"
                      }
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            backgroundColor: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-8 p-0 border-0 rounded"
                      title="Pick fill color"
                    />
                    <Input
                      value={selectedElement.style?.backgroundColor || ""}
                      className="bg-white text-black flex-1"
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            backgroundColor: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Corner Radius</Label>
                  <Slider
                    value={[selectedElement.style?.borderRadius || 0]}
                    onValueChange={(value) =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          borderRadius: value[0],
                        },
                      })
                    }
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>
              </div>
            )}

            {/* Background properties */}
            {selectedElement.type === "background" && (
              <div className="space-y-3">
                <h4 className="font-medium">Background</h4>
                <div>
                  <Label>Background (color or gradient)</Label>
                  <Input
                    value={selectedElement.style?.background || ""}
                    className="bg-white text-black"
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          background: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Logo properties */}
            {selectedElement.type === "logo" && (
              <div className="space-y-3">
                <h4 className="font-medium">Logo</h4>
                <div>
                  <Label>Text</Label>
                  <Input
                    value={selectedElement.content?.text || ""}
                    className="bg-white text-black"
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        content: {
                          ...selectedElement.content,
                          text: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.style?.color || "#000000"}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-8 p-0 border-0 rounded"
                    />
                    <Input
                      value={selectedElement.style?.color || ""}
                      className="bg-white text-black flex-1"
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            color: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Slider
                    value={[selectedElement.style?.fontSize || 20]}
                    onValueChange={(value) =>
                      onUpdateElement(selectedElement.id, {
                        style: { ...selectedElement.style, fontSize: value[0] },
                      })
                    }
                    min={8}
                    max={96}
                    step={1}
                  />
                </div>
              </div>
            )}

            {/* Border properties */}
            {selectedElement.type === "border" && (
              <div className="space-y-3">
                <h4 className="font-medium">Border</h4>
                <div>
                  <Label>Stroke Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedElement.style?.borderColor || "#000000"}
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            borderColor: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-8 p-0 border-0 rounded"
                    />
                    <Input
                      value={selectedElement.style?.borderColor || ""}
                      className="bg-white text-black flex-1"
                      onChange={(e) =>
                        onUpdateElement(selectedElement.id, {
                          style: {
                            ...selectedElement.style,
                            borderColor: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Stroke Width</Label>
                  <Slider
                    value={[selectedElement.style?.strokeWidth || 4]}
                    onValueChange={(value) =>
                      onUpdateElement(selectedElement.id, {
                        style: {
                          ...selectedElement.style,
                          strokeWidth: value[0],
                        },
                      })
                    }
                    min={1}
                    max={40}
                    step={1}
                  />
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
