import { useState, useCallback } from "react";
import { Template, DesignElement, ColorScheme, EventDetails } from "../types";
import { useToast } from "@/hooks/use-toast";

export function useTemplate() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const applyTemplate = useCallback(
    (
      template: Template,
      setElements: (elements: DesignElement[]) => void,
      setColorScheme: (
        scheme: ColorScheme | ((prev: ColorScheme) => ColorScheme)
      ) => void,
      setSelectedElement: (id: string | null) => void,
      setCanvasSize?: (size: { width: number; height: number }) => void,
      eventDetails?: EventDetails
    ) => {
      // Clear the stage first
      setSelectedElement(null);
      setElements([]);

      // Small delay to ensure clean state before applying template
      setTimeout(() => {
        setSelectedTemplate(template.id);

        // If event details are provided, populate them into template elements
        let templateElements = template.elements || [];
        if (eventDetails) {
          const eventDetailsMap = {
            title: eventDetails.title,
            message: eventDetails.message,
            date: eventDetails.date,
            location: eventDetails.location,
            hostName: eventDetails.hostName,
          };

          templateElements = templateElements.map((element) => {
            if (element.dataField && eventDetailsMap[element.dataField]) {
              return {
                ...element,
                content: {
                  ...element.content,
                  text: eventDetailsMap[element.dataField],
                },
              };
            }
            return element;
          });
        }

        setElements(templateElements);
      }, 50);

      // If template provides a canvas size, apply it
      try {
        const canvasSize = template.style?.canvasSize;
        if (canvasSize && setCanvasSize) {
          setCanvasSize(canvasSize);
        }
      } catch (err) {
        // ignore
      }

      // Extract colors from template background or first background element
      const backgroundElement = template.elements?.find(
        (el) => el.type === "background"
      );
      const templateBackground =
        backgroundElement?.style?.background || template.style?.background;

      // Parse gradient to extract colors
      let primaryColor = "#667eea";
      let secondaryColor = "#764ba2";
      let backgroundColor = templateBackground || "#ffffff";

      if (templateBackground?.includes("gradient")) {
        // Extract first and last colors from gradient
        const colorMatches = templateBackground.match(/#[0-9a-fA-F]{6}/g);
        if (colorMatches && colorMatches.length >= 2) {
          primaryColor = colorMatches[0];
          secondaryColor = colorMatches[colorMatches.length - 1];
        }
      }

      // Apply comprehensive color scheme from template
      setColorScheme((prev) => ({
        ...prev,
        primary: primaryColor,
        secondary: secondaryColor,
        background: backgroundColor,
        accent: template.style?.accent || primaryColor,
        text: template.style?.color || "#1f2937",
      }));

      toast({
        title: "Template Applied",
        description: `${template.name} template loaded successfully`,
      });
    },
    [toast]
  );

  return {
    selectedTemplate,
    setSelectedTemplate,
    applyTemplate,
  };
}
