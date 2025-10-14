import { useState, useCallback } from "react";
import { DesignElement, ColorScheme, CanvasSize } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useDesignElements(
  initialColorScheme: ColorScheme,
  canvasSize: CanvasSize
) {
  const { toast } = useToast();
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(initialColorScheme);

  const addElement = useCallback(
    (type: DesignElement["type"], content: any = {}) => {
      const newElement: DesignElement = {
        id: `element_${Date.now()}`,
        type,
        x: Math.random() * (canvasSize.width - 200),
        y: Math.random() * (canvasSize.height - 100),
        width: type === "text" ? 200 : 150,
        height: type === "text" ? 50 : 100,
        rotation: 0,
        opacity: 1,
        zIndex: elements.length + 1,
        content: {
          ...content,
          text: type === "text" ? content.text || "Click to edit" : undefined,
          src:
            type === "image"
              ? content.src ||
                "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=150&h=100&fit=crop&auto=format"
              : undefined,
          shape: type === "shape" ? content.shape || "rectangle" : undefined,
          color: content.color || colorScheme.primary,
        },
        style: {
          fontSize: type === "text" ? 18 : undefined,
          fontFamily: type === "text" ? "Inter" : undefined,
          fontWeight: type === "text" ? "normal" : undefined,
          color: type === "text" ? colorScheme.text : colorScheme.primary,
          backgroundColor:
            type === "shape" ? colorScheme.primary : "transparent",
          borderRadius: type === "shape" ? 4 : 0,
          border:
            type === "border" ? `2px solid ${colorScheme.accent}` : "none",
        },
      };

      setElements((prev) => [...prev, newElement]);
      setSelectedElement(newElement.id);

      toast({
        title: "Element Added",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } element added to canvas`,
      });
    },
    [elements.length, canvasSize, colorScheme, toast]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<DesignElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      toast({
        title: "Element Deleted",
        description: "Element removed from canvas",
      });
    },
    [selectedElement, toast]
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const element = elements.find((el) => el.id === id);
      if (element) {
        const duplicate = {
          ...element,
          id: `element_${Date.now()}`,
          x: element.x + 20,
          y: element.y + 20,
          zIndex: Math.max(...elements.map((el) => el.zIndex)) + 1,
        };
        setElements((prev) => [...prev, duplicate]);
        setSelectedElement(duplicate.id);
      }
    },
    [elements]
  );

  return {
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    colorScheme,
    setColorScheme,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
  };
}
