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
    return;
  }

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
  // debug logs removed
};

export const exportDesignToPNG = async (stageRef: any) => {
  if (!stageRef || !stageRef.current) {
    console.error("Stage reference not available");
    throw new Error("Stage reference not available");
  }

  try {
    // Get the Konva stage
    const stage = stageRef.current;

    // Get all layers
    const layers = stage.getLayers();

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
    // stage info available in stageInfo (debug logs removed)

    // Get the main layer
    const layer = layers[0];
    const elementsLayer = layers[1];

    if (layer) {
      const layerChildren = layer.children || [];
      // debug logs removed
    }

    if (elementsLayer) {
      const layerChildren = elementsLayer.children || [];
      // debug logs removed

      // Count image elements (no debug logs)
      let imageCount = 0;
      layerChildren.forEach((child: any) => {
        if (child.className !== "Transformer") {
          if (child.className === "Image") {
            imageCount++;
          }
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
    stage.draw();

    layers.forEach((layer: any) => {
      layer.batchDraw();
    });

    // Wait for drawing to complete (debug logs removed)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Try to export (debug logs removed)

    let dataURL;
    let pixelRatio = 2;

    try {
      // Try with pixelRatio 2 first for high quality
      dataURL = stage.toDataURL({
        pixelRatio: 2,
        mimeType: "image/png",
      });
      // export with pixelRatio 2 successful
    } catch (err) {
      console.error("❌ First export attempt (pixelRatio 2) failed:", err);

      // Check if it's a CORS error
      if (
        err instanceof Error &&
        (err.message.includes("tainted") ||
          err.message.includes("cross-origin") ||
          err.message.includes("CORS"))
      ) {
        console.error(
          "🚫 CORS error detected. Cannot export with external images."
        );
        throw new Error(
          "Cannot export design due to CORS restrictions. External images must be converted to base64 first. " +
            "This should have been handled automatically - please check the console for image loading errors."
        );
      }

      // Try with pixelRatio 1
      // trying with pixelRatio 1
      try {
        dataURL = stage.toDataURL({
          pixelRatio: 1,
          mimeType: "image/png",
        });
        pixelRatio = 1;
      } catch (err2) {
        console.error(
          "❌ Second export attempt (pixelRatio 1) also failed:",
          err2
        );

        // Try without any options as last resort
        // trying basic export without options
        try {
          dataURL = stage.toDataURL();
          pixelRatio = 1;
        } catch (err3) {
          console.error("❌ All export attempts failed:", err3);
          throw new Error(
            "Failed to export canvas after multiple attempts. This may be due to CORS issues, " +
              "browser limitations, or rendering problems. Please check the console for details."
          );
        }
      }
    }

    // Restore transformer
    if (transformer && transformerWasVisible) {
      transformer.visible(true);
      stage.batchDraw();
    }

    // dataURL generated (debug logs removed)

    // Check if dataURL is valid
    if (!dataURL) {
      console.error("❌ DataURL is null or undefined");
      throw new Error(
        "Failed to generate image data. Please check if elements are visible on the canvas."
      );
    }

    if (dataURL === "data:," || dataURL === "data:image/png;base64,") {
      console.error("❌ DataURL is empty:", dataURL);
      throw new Error(
        "Generated image is empty. The canvas may not have any visible content."
      );
    }

    // Check for minimum data
    if (dataURL.length < 100) {
      console.error("❌ DataURL is too short:", dataURL.length, "bytes");
      console.error("DataURL content:", dataURL);
      throw new Error(
        "Generated image data is too small. The canvas may be blank."
      );
    }

    // Warn if small but proceed
    if (dataURL.length < 1000) {
      console.warn(
        "⚠️  Warning: DataURL is very small:",
        dataURL.length,
        "bytes (" + (dataURL.length / 1024).toFixed(2) + " KB)"
      );
      console.warn("The exported image may be mostly blank");
    } else {
      // export successful (log removed)
    }

    // end export debug info (logs removed)

    // Create download link
    const link = document.createElement("a");
    link.download = `vibescard-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // file download initiated (log removed)

    return dataURL;
  } catch (error) {
    console.error("\n❌ Error exporting design:", error);
    // If the error is due to CORS (tainted canvas), provide a helpful message
    if (
      error instanceof Error &&
      (error.message.includes("tainted") ||
        error.message.includes("cross-origin") ||
        error.message.toLowerCase().includes("cors"))
    ) {
      throw new Error(
        "❌ CORS Error: Cannot export design with external images due to browser security restrictions. " +
          "Images must be:\n" +
          "1. From the same domain as your application\n" +
          "2. Served with proper CORS headers (Access-Control-Allow-Origin)\n" +
          "3. Converted to base64 before export (which should happen automatically)\n\n" +
          "Check the console for image loading errors."
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
 * Convert SVG to base64 data URL by fetching the content
 * This avoids the tainted canvas issue with SVG files
 */
const svgToBase64DataURL = async (url: string): Promise<string> => {
  try {
    // fetching SVG content (debug log removed)
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch SVG: ${response.status} ${response.statusText}`
      );
    }

    const svgText = await response.text();

    // Ensure it's valid SVG
    if (!svgText.includes("<svg")) {
      throw new Error("Fetched content is not valid SVG");
    }

    // Convert to base64 data URL
    const base64 = btoa(unescape(encodeURIComponent(svgText)));
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    // SVG converted to base64 (log removed)
    return dataUrl;
  } catch (error) {
    console.error(`❌ Failed to fetch SVG:`, error);
    throw error;
  }
};

/**
 * Convert an image URL to base64 data URL
 * This helps avoid CORS issues when exporting designs with external images
 */
export const imageUrlToBase64 = async (url: string): Promise<string> => {
  // Special handling for SVG files
  if (
    url.toLowerCase().endsWith(".svg") ||
    url.includes(".svg?") ||
    url.includes(".svg#")
  ) {
    // detected SVG file (debug log removed)

    // Try multiple paths for local SVG files
    const pathsToTry: string[] = [];

    if (url.startsWith("/src/")) {
      pathsToTry.push(url);
      pathsToTry.push(url.replace("/src/", "/"));
      pathsToTry.push(url.substring(1));
    } else if (url.startsWith("/")) {
      pathsToTry.push(url);
      pathsToTry.push(url.substring(1));
    } else {
      pathsToTry.push(url);
    }

    let lastError: any;
    for (const path of pathsToTry) {
      try {
        return await svgToBase64DataURL(path);
      } catch (error) {
        lastError = error;
        console.warn(`Failed to fetch SVG from ${path}, trying next...`);
      }
    }

    throw new Error(
      `Failed to load SVG after trying all paths. Last error: ${
        lastError?.message || "Unknown error"
      }`
    );
  }

  // For non-SVG images, use the canvas approach
  return new Promise((resolve, reject) => {
    const tryConvertToBase64 = (
      imgSrc: string,
      onSuccess: (dataUrl: string) => void,
      onError: (error: any) => void
    ) => {
      const img = new Image();

      // Set a reasonable timeout for image loading
      const timeout = setTimeout(() => {
        console.warn(`Image load timeout for: ${imgSrc.substring(0, 50)}...`);
        onError(new Error("Image load timeout"));
      }, 10000); // 10 second timeout

      // Always set crossOrigin for better compatibility
      // Use anonymous to avoid sending credentials
      img.crossOrigin = "anonymous";

      img.onload = () => {
        clearTimeout(timeout);

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          onError(new Error("Failed to get canvas context"));
          return;
        }

        try {
          ctx.drawImage(img, 0, 0);

          // Try to convert to data URL
          try {
            const dataUrl = canvas.toDataURL("image/png");

            // Verify the data URL is valid and not empty
            if (dataUrl && dataUrl !== "data:," && dataUrl.length > 100) {
              // image converted to base64 (log removed)
              onSuccess(dataUrl);
            } else {
              throw new Error("Generated data URL is empty or invalid");
            }
          } catch (canvasError) {
            console.error("Canvas toDataURL failed:", canvasError);
            onError(canvasError);
          }
        } catch (drawError) {
          console.error("Canvas drawing failed:", drawError);
          onError(drawError);
        }
      };

      img.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`Image load error for: ${imgSrc}`, error);
        onError(error);
      };

      img.src = imgSrc;
    };

    // Try multiple path resolution strategies
    const pathsToTry: string[] = [];

    if (url.startsWith("/src/")) {
      pathsToTry.push(url);
      pathsToTry.push(url.replace("/src/", "/"));
      pathsToTry.push(url.substring(1));
    } else if (url.startsWith("/")) {
      pathsToTry.push(url);
      pathsToTry.push(url.substring(1));
    } else {
      pathsToTry.push(url);
    }

    let currentAttempt = 0;
    const errors: any[] = [];

    const tryNextPath = () => {
      if (currentAttempt >= pathsToTry.length) {
        console.error(
          `❌ Failed to load image after trying ${pathsToTry.length} paths:`,
          url,
          "\nPaths tried:",
          pathsToTry,
          "\nErrors:",
          errors
        );
        reject(
          new Error(
            `Failed to load image after trying all paths: ${url}. Last error: ${
              errors[errors.length - 1]?.message || "Unknown error"
            }`
          )
        );
        return;
      }

      const pathToTry = pathsToTry[currentAttempt];
      currentAttempt++;

      // attempting to load image (debug log removed)

      tryConvertToBase64(
        pathToTry,
        (dataUrl) => resolve(dataUrl),
        (error) => {
          errors.push(error);
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

  // preloading images for export (log removed)

  if (imageElements.length === 0) {
    return elements;
  }

  // Create a map to store the converted base64 images
  const base64Map = new Map<string, string>();
  const errors: Array<{ id: string; src: string; error: any }> = [];

  const imageLoadPromises = imageElements.map(async (element) => {
    const src = element.content?.src;
    if (!src) return;

    // Skip if already a data URL
    if (src.startsWith("data:")) {
      return;
    }

    try {
      // converting image to base64 (log removed)

      // Try to convert to base64 with timeout
      const base64 = await Promise.race([
        imageUrlToBase64(src),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("Overall timeout")), 15000)
        ),
      ]);

      base64Map.set(element.id, base64);
    } catch (error) {
      console.error(`❌ Failed to convert image to base64: ${src}`, error);
      errors.push({
        id: element.id,
        src: src.substring(0, 100),
        error: error instanceof Error ? error.message : String(error),
      });

      // For CORS errors, provide specific guidance
      if (
        error instanceof Error &&
        (error.message.includes("CORS") ||
          error.message.includes("tainted") ||
          error.message.includes("cross-origin"))
      ) {
        console.warn(
          `⚠️  CORS issue detected for image ${element.id}. This image may not export correctly.`
        );
      }
    }
  });

  await Promise.all(imageLoadPromises);

  // preloading results (logs removed)
  if (errors.length > 0) {
    console.error(`Failed to convert: ${errors.length} images`);
    console.error("Failed images:", errors);
  }

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

  // If some images failed to convert, warn the user
  if (errors.length > 0 && errors.length < imageElements.length) {
    console.warn(
      `⚠️  Warning: ${errors.length} image(s) could not be converted. The export may be incomplete.`
    );
  } else if (
    errors.length === imageElements.length &&
    imageElements.length > 0
  ) {
    throw new Error(
      `Failed to convert all images to base64. This is likely due to CORS restrictions or network issues. ` +
        `Please ensure images are from the same domain or properly configured for CORS.`
    );
  }

  // preloading complete (log removed)
  return updatedElements;
};
