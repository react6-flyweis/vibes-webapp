import { useState, useCallback, useRef } from "react";
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

  // History stacks for undo/redo
  const undoStack = useRef<DesignElement[][]>([]);
  const redoStack = useRef<DesignElement[][]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);

  const pushHistory = useCallback((nextElements: DesignElement[]) => {
    // Push a deep-cloned snapshot of the provided elements to undo stack
    // Note: callers should pass the PREVIOUS state (before change)
    undoStack.current.push(JSON.parse(JSON.stringify(nextElements)));
    // Clear redo on new action
    redoStack.current = [];
    // Cap history to 50 entries
    if (undoStack.current.length > 50) undoStack.current.shift();
    // Trigger re-render so interested components can read canUndo/canRedo
    setHistoryVersion((v) => v + 1);
  }, []);

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

      setElements((prev) => {
        // record previous snapshot
        pushHistory(prev);
        const next = [...prev, newElement];
        return next;
      });
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
      setElements((prev) => {
        pushHistory(prev);
        const next = prev.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        );
        return next;
      });
    },
    []
  );

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => {
        pushHistory(prev);
        const next = prev.filter((el) => el.id !== id);
        return next;
      });
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
        setElements((prev) => {
          pushHistory(prev);
          const next = [...prev, duplicate];
          return next;
        });
        setSelectedElement(duplicate.id);
      }
    },
    [elements]
  );

  // Direct setElements wrapper that records history
  const setElementsWithHistory = useCallback(
    (next: DesignElement[] | ((prev: DesignElement[]) => DesignElement[])) => {
      setElements((prev) => {
        // push the previous snapshot before applying the new state
        pushHistory(prev);
        const resolved =
          typeof next === "function" ? (next as any)(prev) : next;
        return resolved as DesignElement[];
      });
    },
    [pushHistory]
  );

  const canUndo = () => undoStack.current.length > 0;
  const canRedo = () => redoStack.current.length > 0;
  // Expose booleans that update when historyVersion changes so components re-render
  const canUndoFlag = historyVersion >= 0 ? canUndo() : canUndo();
  const canRedoFlag = historyVersion >= 0 ? canRedo() : canRedo();

  const undo = useCallback(() => {
    if (!canUndo()) return;
    // Move current state to redo and restore last undo
    setElements((current) => {
      redoStack.current.push(JSON.parse(JSON.stringify(current)));
      const previous = undoStack.current.pop() as DesignElement[];
      setHistoryVersion((v) => v + 1);
      return JSON.parse(JSON.stringify(previous));
    });
  }, []);

  const redo = useCallback(() => {
    if (!canRedo()) return;
    setElements((current) => {
      undoStack.current.push(JSON.parse(JSON.stringify(current)));
      const next = redoStack.current.pop() as DesignElement[];
      setHistoryVersion((v) => v + 1);
      return JSON.parse(JSON.stringify(next));
    });
  }, []);

  return {
    elements,
    setElements: setElements,
    setElementsWithHistory,
    selectedElement,
    setSelectedElement,
    colorScheme,
    setColorScheme,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    // history API
    undo,
    redo,
    canUndo: canUndoFlag,
    canRedo: canRedoFlag,
  };
}
