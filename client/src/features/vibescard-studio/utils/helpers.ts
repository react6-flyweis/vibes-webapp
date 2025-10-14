import { DesignElement, ColorScheme, CanvasSize, EventDetails } from "../types";

export const exportDesignToPNG = (stageRef: any) => {
  if (!stageRef || !stageRef.current) {
    console.error("Stage reference not available");
    return;
  }

  try {
    // Get the Konva stage
    const stage = stageRef.current;

    // Export as data URL
    const dataURL = stage.toDataURL({
      pixelRatio: 2, // Higher quality
      mimeType: "image/png",
    });

    // Create download link
    const link = document.createElement("a");
    link.download = `vibescard-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataURL;
  } catch (error) {
    console.error("Error exporting design:", error);
    throw error;
  }
};

export const exportDesignToJPEG = (stageRef: any, quality: number = 0.9) => {
  if (!stageRef || !stageRef.current) {
    console.error("Stage reference not available");
    return;
  }

  try {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL({
      pixelRatio: 2,
      mimeType: "image/jpeg",
      quality,
    });

    const link = document.createElement("a");
    link.download = `vibescard-design-${Date.now()}.jpg`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataURL;
  } catch (error) {
    console.error("Error exporting design:", error);
    return null;
  }
};

export const exportDesignToJSON = (
  elements: DesignElement[],
  colorScheme: ColorScheme,
  canvasSize: CanvasSize,
  eventDetails: EventDetails,
  selectedTemplate: string | null
) => {
  const designData = {
    version: "1.0",
    elements,
    colorScheme,
    canvasSize,
    eventDetails,
    template: selectedTemplate,
    exportedAt: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(designData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.download = `vibescard-design-${Date.now()}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const saveDesignData = (
  elements: DesignElement[],
  colorScheme: ColorScheme,
  canvasSize: CanvasSize,
  eventDetails: EventDetails,
  selectedTemplate: string | null
) => {
  return {
    id: `design_${Date.now()}`,
    name: eventDetails.title || "Untitled Design",
    elements,
    colorScheme,
    canvasSize,
    metadata: {
      ...eventDetails,
      template: selectedTemplate,
    },
    createdAt: new Date().toISOString(),
  };
};

export const calculateZoomLevel = (
  currentZoom: number,
  direction: "in" | "out",
  step: number = 25
): number => {
  if (direction === "in") {
    return Math.min(200, currentZoom + step);
  } else {
    return Math.max(25, currentZoom - step);
  }
};

export const generateElementId = (): string => {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const cloneElement = (
  element: DesignElement,
  offset: number = 20
): DesignElement => {
  return {
    ...element,
    id: generateElementId(),
    x: element.x + offset,
    y: element.y + offset,
  };
};
