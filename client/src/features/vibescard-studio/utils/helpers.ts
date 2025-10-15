import { DesignElement, ColorScheme, CanvasSize, EventDetails } from "../types";

/**
 * Wait for all images in the stage to be fully loaded
 */
export const waitForImagesToLoad = async (
  elements: DesignElement[]
): Promise<void> => {
  const imageElements = elements.filter(
    (el) => el.type === "image" && el.content?.src
  );

  if (imageElements.length === 0) {
    console.log("No images to wait for");
    return;
  }

  console.log(`Waiting for ${imageElements.length} images to load...`);

  const imageLoadPromises = imageElements.map((element) => {
    const src = element.content?.src;
    if (!src) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      // If it's already a data URL, it should load quickly
      const img = new Image();

      // Set CORS for external images
      if (src.startsWith("http://") || src.startsWith("https://")) {
        img.crossOrigin = "anonymous";
      }

      const timeout = setTimeout(() => {
        console.warn(`Image load timeout for: ${src.substring(0, 50)}...`);
        resolve(); // Resolve anyway to not block the export
      }, 5000); // 5 second timeout per image

      img.onload = () => {
        clearTimeout(timeout);
        console.log(`Image loaded successfully: ${element.id}`);
        resolve();
      };

      img.onerror = (e) => {
        clearTimeout(timeout);
        console.error(`Image failed to load: ${src}`, e);
        resolve(); // Resolve anyway to not block the export
      };

      img.src = src;
    });
  });

  await Promise.all(imageLoadPromises);
  console.log("All images loaded or timed out");
};

export const exportDesignToPNG = async (stageRef: any) => {
  if (!stageRef || !stageRef.current) {
    console.error("Stage reference not available");
    throw new Error("Stage reference not available");
  }

  try {
    // Get the Konva stage
    const stage = stageRef.current;

    // Get all layers and log their info
    const layers = stage.getLayers();
    console.log("=== EXPORT DEBUG INFO ===");
    console.log("Total layers:", layers.length);

    layers.forEach((layer: any, index: number) => {
      console.log(`Layer ${index}:`, {
        visible: layer.visible(),
        children: layer.children?.length || 0,
        opacity: layer.opacity(),
      });
    });

    // Log canvas dimensions for debugging
    const stageInfo = {
      width: stage.width(),
      height: stage.height(),
      scale: stage.scale(),
      scaleX: stage.scaleX(),
      scaleY: stage.scaleY(),
      x: stage.x(),
      y: stage.y(),
      children: stage.children?.length || 0,
    };
    console.log("Stage info before export:", stageInfo);

    // Get the main layer
    const layer = layers[0];
    const elementsLayer = layers[1];

    if (layer) {
      const layerChildren = layer.children || [];
      console.log("Background layer children:", layerChildren.length);
    }

    if (elementsLayer) {
      const layerChildren = elementsLayer.children || [];
      console.log("Elements layer children:", layerChildren.length);

      // Log each child element
      layerChildren.forEach((child: any, index: number) => {
        if (child.className !== "Transformer") {
          console.log(`Element ${index}:`, {
            type: child.className,
            visible: child.visible(),
            opacity: child.opacity(),
            x: child.x(),
            y: child.y(),
            width: child.width?.(),
            height: child.height?.(),
          });
        }
      });
    }

    // Hide transformer before export
    const transformer = stage.find("Transformer")[0];
    const transformerWasVisible = transformer?.visible();
    if (transformer) {
      transformer.visible(false);
    }

    // Force complete redraw
    console.log("Forcing stage redraw...");
    stage.draw();

    layers.forEach((layer: any) => {
      layer.batchDraw();
    });

    // Wait for drawing to complete
    console.log("Waiting for render to complete...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Try to export
    console.log("Attempting to export canvas...");

    let dataURL;
    try {
      // Try with default settings first
      dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
      });
      console.log("Export with pixelRatio 2 successful");
    } catch (err) {
      console.error("First export attempt failed:", err);

      // Try with pixelRatio 1
      console.log("Trying with pixelRatio 1...");
      try {
        dataURL = stage.toDataURL({
          pixelRatio: 1,
          mimeType: "image/png",
        });
        console.log("Export with pixelRatio 1 successful");
      } catch (err2) {
        console.error("Second export attempt also failed:", err2);
        throw new Error(
          "Failed to export canvas. This may be due to CORS or rendering issues."
        );
      }
    }

    // Restore transformer
    if (transformer && transformerWasVisible) {
      transformer.visible(true);
      stage.batchDraw();
    }

    console.log("DataURL generated, length:", dataURL?.length || 0);
    if (dataURL) {
      console.log("DataURL preview:", dataURL.substring(0, 100));
    }

    // Check if dataURL is valid
    if (!dataURL) {
      console.error("DataURL is null or undefined");
      throw new Error(
        "Failed to generate image data. Please check if elements are visible on the canvas."
      );
    }

    if (dataURL === "data:," || dataURL === "data:image/png;base64,") {
      console.error("DataURL is empty:", dataURL);
      throw new Error(
        "Generated image is empty. The canvas may not have any visible content."
      );
    }

    // Check for minimum data
    if (dataURL.length < 100) {
      console.error("DataURL is too short:", dataURL.length, "bytes");
      console.error("DataURL content:", dataURL);
      throw new Error(
        "Generated image data is too small. The canvas may be blank."
      );
    }

    // Warn if small but proceed
    if (dataURL.length < 1000) {
      console.warn(
        "⚠️ Warning: DataURL is very small:",
        dataURL.length,
        "bytes"
      );
      console.warn("The exported image may be mostly blank");
    } else {
      console.log(
        "✅ Export successful! DataURL length:",
        dataURL.length,
        "bytes"
      );
    }

    console.log("=== END EXPORT DEBUG INFO ===");

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
    // If the error is due to CORS (tainted canvas), provide a helpful message
    if (error instanceof Error && error.message.includes("tainted")) {
      throw new Error(
        "Cannot export design with external images due to security restrictions. Please use images from the same domain or upload your own images."
      );
    }
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

/**
 * Convert an image URL to base64 data URL
 * This helps avoid CORS issues when exporting designs with external images
 */
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tryConvertToBase64 = (
      imgSrc: string,
      onSuccess: (dataUrl: string) => void,
      onError: () => void
    ) => {
      const img = new Image();

      // Only set CORS for external images
      if (imgSrc.startsWith("http://") || imgSrc.startsWith("https://")) {
        img.crossOrigin = "anonymous";
      }

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          onError();
          return;
        }

        ctx.drawImage(img, 0, 0);

        try {
          const dataUrl = canvas.toDataURL("image/png");
          onSuccess(dataUrl);
        } catch (error) {
          onError();
        }
      };

      img.onerror = onError;
      img.src = imgSrc;
    };

    // Try multiple path resolution strategies
    const pathsToTry: string[] = [];

    if (url.startsWith("/src/")) {
      pathsToTry.push(url);
      pathsToTry.push(url.replace("/src/", "/"));
      pathsToTry.push(url.substring(1));
    } else {
      pathsToTry.push(url);
    }

    let currentAttempt = 0;

    const tryNextPath = () => {
      if (currentAttempt >= pathsToTry.length) {
        reject(
          new Error(`Failed to load image after trying all paths: ${url}`)
        );
        return;
      }

      const pathToTry = pathsToTry[currentAttempt];
      currentAttempt++;

      tryConvertToBase64(
        pathToTry,
        (dataUrl) => resolve(dataUrl),
        () => {
          console.warn(
            `Failed to convert image at path: ${pathToTry}, trying next...`
          );
          tryNextPath();
        }
      );
    };

    tryNextPath();
  });
};

/**
 * Preload and convert all external images in the stage to base64
 * This ensures the canvas can be exported without CORS issues
 * Returns the updated elements array with base64 images
 */
export const preloadImagesForExport = async (
  elements: DesignElement[]
): Promise<DesignElement[]> => {
  const imageElements = elements.filter(
    (el) => el.type === "image" && el.content?.src
  );

  console.log(`Preloading ${imageElements.length} images for export...`);

  // Create a map to store the converted base64 images
  const base64Map = new Map<string, string>();

  const imageLoadPromises = imageElements.map(async (element) => {
    const src = element.content?.src;
    if (!src) return;

    // Skip if already a data URL
    if (src.startsWith("data:")) {
      console.log(`Image already in base64 format: ${element.id}`);
      return;
    }

    try {
      console.log(`Converting image to base64: ${src}`);
      // Try to convert to base64
      const base64 = await imageUrlToBase64(src);
      base64Map.set(element.id, base64);
      console.log(`Successfully converted image: ${element.id}`);
    } catch (error) {
      console.error(`Failed to convert image to base64: ${src}`, error);
      // Keep original src, might still work if it's a local image
    }
  });

  await Promise.all(imageLoadPromises);

  // Return a new array with updated elements
  const updatedElements = elements.map((element) => {
    if (element.type === "image" && base64Map.has(element.id)) {
      return {
        ...element,
        content: {
          ...element.content,
          src: base64Map.get(element.id)!,
        },
      };
    }
    return element;
  });

  console.log(`Preloading complete. Converted ${base64Map.size} images.`);
  return updatedElements;
};
