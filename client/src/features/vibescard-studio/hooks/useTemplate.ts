import { useState, useCallback } from "react";
import { Template, DesignElement, ColorScheme } from "../types";
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
      setSelectedElement: (id: string | null) => void
    ) => {
      setSelectedTemplate(template.id);
      setElements(template.elements || []);
      setSelectedElement(null);

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
