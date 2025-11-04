import { useRef, useEffect, useState, forwardRef } from "react";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Rect,
  Group,
  Ellipse,
  Transformer,
} from "react-konva";
import Konva from "konva";
import { DesignElement, ColorScheme, EventDetails } from "../types";

interface KonvaCanvasProps {
  elements: DesignElement[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  canvasSize: { width: number; height: number };
  zoom: number;
  gridVisible: boolean;
  colorScheme: ColorScheme;
  eventDetails: EventDetails;
  stageRef?: React.RefObject<Konva.Stage>;
  initialKonvaJSON?: string | null;
}

// Image component wrapper to handle loading with CORS support
const ImageElement = forwardRef<any, any>(({ src, ...props }: any, ref) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadImage = (
      imgSrc: string,
      onSuccess: (img: HTMLImageElement) => void,
      onError: (err: any) => void
    ) => {
      const img = new Image();

      // Set a timeout for image loading
      const timeout = setTimeout(() => {
        console.warn(`⚠️  Image load timeout: ${imgSrc.substring(0, 50)}...`);
        onError(new Error("Image load timeout"));
      }, 10000);

      // Always set crossOrigin for better compatibility
      // This is important for both external images AND local SVG files
      img.crossOrigin = "anonymous";

      img.onload = () => {
        clearTimeout(timeout);
        console.log(
          `✅ Image loaded successfully: ${imgSrc.substring(0, 50)}...`
        );
        onSuccess(img);
      };

      img.onerror = (err) => {
        clearTimeout(timeout);
        console.error(
          `❌ Image load error: ${imgSrc.substring(0, 50)}...`,
          err
        );
        onError(err);
      };

      img.src = imgSrc;

      return img;
    };

    // Try multiple path resolution strategies
    const pathsToTry: string[] = [src];

    // Add alternative paths for local images
    if (src.startsWith("/src/")) {
      pathsToTry.push(src.replace("/src/", "/"));
      pathsToTry.push(src.substring(1));
    } else if (src.startsWith("/") && !src.startsWith("//")) {
      pathsToTry.push(src.substring(1));
    }

    let currentAttempt = 0;
    let currentImage: HTMLImageElement | null = null;

    const tryNextPath = () => {
      if (currentAttempt >= pathsToTry.length) {
        console.error(
          "❌ All image load attempts failed for:",
          src,
          "\nTried paths:",
          pathsToTry
        );
        setError(true);
        setLoading(false);
        return;
      }

      const pathToTry = pathsToTry[currentAttempt];
      currentAttempt++;

      console.log(
        `🔄 Loading image (attempt ${currentAttempt}/${
          pathsToTry.length
        }): ${pathToTry.substring(0, 60)}...`
      );

      currentImage = loadImage(
        pathToTry,
        (img) => {
          setImage(img);
          setError(false);
          setLoading(false);
        },
        (err) => {
          console.warn(
            `Image load failed for path: ${pathToTry.substring(
              0,
              50
            )}..., trying next...`
          );
          tryNextPath();
        }
      );
    };

    setLoading(true);
    setError(false);
    tryNextPath();

    return () => {
      if (currentImage) {
        currentImage.onload = null;
        currentImage.onerror = null;
      }
    };
  }, [src]);

  if (error && !image) {
    // Return a placeholder rectangle with error indication if image fails to load
    return (
      <Group>
        <Rect
          {...props}
          fill="#f3f4f6"
          stroke="#ef4444"
          strokeWidth={2}
          dash={[5, 5]}
        />
        <Text
          {...props}
          text="❌ Image\nFailed"
          fontSize={14}
          fill="#ef4444"
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      </Group>
    );
  }

  if (loading || !image) {
    // Show loading placeholder
    return (
      <Group>
        <Rect
          {...props}
          fill="#e5e7eb"
          stroke="#9ca3af"
          strokeWidth={1}
          dash={[3, 3]}
        />
        <Text
          {...props}
          text="⏳ Loading..."
          fontSize={12}
          fill="#6b7280"
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      </Group>
    );
  }

  return <KonvaImage ref={ref} image={image} {...props} />;
});

export function KonvaCanvas({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  canvasSize,
  zoom,
  gridVisible,
  colorScheme,
  eventDetails,
  stageRef,
  initialKonvaJSON,
}: KonvaCanvasProps) {
  const localStageRef = useRef<Konva.Stage>(null);
  const effectiveStageRef = stageRef || localStageRef;
  const transformerRef = useRef<any>(null);
  const selectedNodeRef = useRef<any>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Scale factor for zoom
  const scale = zoom / 100;

  // Update transformer when selection changes
  useEffect(() => {
    const stage = effectiveStageRef && (effectiveStageRef as any).current;

    // If initial Konva JSON was loaded, we need to find nodes by id on the stage
    if (initialLoaded && selectedElement && transformerRef.current && stage) {
      const node = stage.findOne(`#${selectedElement}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
        selectedNodeRef.current = node;
      } else {
        transformerRef.current.nodes([]);
        selectedNodeRef.current = null;
      }
      return;
    }

    if (selectedElement && transformerRef.current && selectedNodeRef.current) {
      // Attach transformer to the selected node
      transformerRef.current.nodes([selectedNodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElement]);

  // Load initial Konva JSON into the stage once when provided
  useEffect(() => {
    if (!initialKonvaJSON) return;
    const stage = effectiveStageRef && effectiveStageRef.current;
    if (!stage) return;
    try {
      Konva.Node.create(initialKonvaJSON, stage.container());

      setInitialLoaded(true);
    } catch (err) {
      console.error("Failed to load initial Konva JSON:", err);
    }
  }, [initialKonvaJSON]);

  // Handle clicking on stage to deselect
  const handleStageClick = (e: any) => {
    // Check if clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelectElement(null);
    }
  };

  // Handle element drag end
  const handleDragEnd = (elementId: string, e: any) => {
    const node = e.target;
    onUpdateElement(elementId, {
      x: node.x() / scale,
      y: node.y() / scale,
    });
  };

  // Handle element transform end
  const handleTransformEnd = (elementId: string, e: any) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale to 1 and update width/height instead
    node.scaleX(1);
    node.scaleY(1);

    onUpdateElement(elementId, {
      x: node.x() / scale,
      y: node.y() / scale,
      width: Math.max(5, node.width() * scaleX) / scale,
      height: Math.max(5, node.height() * scaleY) / scale,
      rotation: node.rotation(),
    });
  };

  // Helper function to get dynamic text based on dataField
  const getDynamicText = (element: DesignElement): string => {
    if (element.dataField) {
      const fieldValue = eventDetails[element.dataField];
      if (fieldValue) {
        // Format date if it's the date field
        if (element.dataField === "date") {
          try {
            const dateObj = new Date(fieldValue);
            return dateObj.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });
          } catch {
            return fieldValue;
          }
        }
        return fieldValue;
      }
    }
    return element.content?.text || "Click to edit";
  };

  // Render individual element based on type
  const renderElement = (element: DesignElement) => {
    const isSelected = selectedElement === element.id;
    const elementScale = scale;

    // Common props for all elements
    const commonProps = {
      key: element.id,
      id: element.id,
      x: element.x * elementScale,
      y: element.y * elementScale,
      width: element.width * elementScale,
      height: element.height * elementScale,
      rotation: element.rotation,
      opacity: element.opacity,
      draggable: true,
      onClick: () => onSelectElement(element.id),
      onTap: () => onSelectElement(element.id),
      onDragEnd: (e: any) => handleDragEnd(element.id, e),
      onTransformEnd: (e: any) => handleTransformEnd(element.id, e),
      // Attach ref to selected element for transformer (added per-node below)
      // Remove stroke since transformer will show handles
      name: element.id,
    };

    switch (element.type) {
      case "text": {
        const rawStops = element.style?.fillLinearGradientColorStops;
        // compute scaled start/end points in pixels relative to the element
        const startPoint = element.style?.fillLinearGradientStartPoint || {
          x: 0,
          y: 0,
        };
        const endPoint = element.style?.fillLinearGradientEndPoint || {
          x: 0,
          y: element.height * elementScale,
        };

        // normalize color stops to a flat array [offset, color, offset, color, ...]
        let normalizedStops: Array<number | string> | undefined = undefined;
        if (Array.isArray(rawStops) && rawStops.length > 0) {
          normalizedStops = rawStops.map((s: any) => {
            // keep strings (colors) as-is, coerce numeric-like to numbers
            if (typeof s === "number") return s;
            if (typeof s === "string" && !isNaN(Number(s))) return Number(s);
            return s;
          });
        }

        // If we have normalizedStops, do not pass a solid `fill` so Konva uses the gradient
        const fillProp = normalizedStops
          ? undefined
          : element.style?.color || colorScheme.text;

        // Get the text to display - either from dataField mapping or content
        const displayText = getDynamicText(element);

        return (
          <Text
            {...commonProps}
            ref={isSelected ? selectedNodeRef : null}
            text={displayText}
            fontSize={(element.style?.fontSize || 18) * elementScale}
            fontFamily={element.style?.fontFamily || "Inter"}
            fontStyle={
              element.style?.fontWeight === "bold"
                ? "bold"
                : element.style?.fontStyle || "normal"
            }
            {...(fillProp ? { fill: fillProp } : {})}
            align={element.style?.textAlign || "left"}
            verticalAlign="middle"
            wrap="word"
            {...(normalizedStops
              ? {
                  fillLinearGradientStartPoint: {
                    x: startPoint.x,
                    y: startPoint.y,
                  },
                  fillLinearGradientEndPoint: { x: endPoint.x, y: endPoint.y },
                  fillLinearGradientColorStops: normalizedStops,
                }
              : {})}
          />
        );
      }

      case "logo":
        return (
          <Text
            {...commonProps}
            ref={isSelected ? selectedNodeRef : null}
            text={element.content?.text || element.content?.emblem || "LOGO"}
            fontSize={(element.style?.fontSize || 20) * elementScale}
            fontFamily={element.style?.fontFamily || "sans-serif"}
            fontStyle={element.style?.fontWeight === "bold" ? "bold" : "normal"}
            fill={element.style?.color || colorScheme.primary}
            align="center"
            verticalAlign="middle"
          />
        );

      case "background":
        // Extract colors from gradient if present
        const bgStyle = element.style?.background || colorScheme.background;
        const colorMatches = bgStyle.match(/#[0-9a-fA-F]{6}/g);

        if (
          bgStyle.includes("gradient") &&
          colorMatches &&
          colorMatches.length >= 2
        ) {
          // Create Konva linear gradient
          return (
            <Rect
              {...commonProps}
              ref={isSelected ? selectedNodeRef : null}
              fillLinearGradientStartPoint={{ x: 0, y: 0 }}
              fillLinearGradientEndPoint={{
                x: element.width * elementScale,
                y: element.height * elementScale,
              }}
              fillLinearGradientColorStops={[
                0,
                colorMatches[0],
                1,
                colorMatches[colorMatches.length - 1],
              ]}
            />
          );
        }

        // Fallback to solid color
        return (
          <Rect
            {...commonProps}
            fill={colorMatches?.[0] || bgStyle || "#ffffff"}
          />
        );

      case "image":
        if (element.content?.src) {
          return (
            <ImageElement
              {...commonProps}
              ref={isSelected ? selectedNodeRef : null}
              src={element.content.src}
              cornerRadius={element.style?.borderRadius || 0}
            />
          );
        }
        return null;

      case "shape":
        // Support rectangle, ellipse and circle shapes
        if (
          element.content?.shape === "ellipse" ||
          element.content?.shape === "circle"
        ) {
          const w = element.width * elementScale;
          const h =
            element.content?.shape === "circle"
              ? element.width * elementScale
              : element.height * elementScale;

          return (
            <Group {...commonProps}>
              <Ellipse
                x={w / 2}
                y={h / 2}
                radiusX={w / 2}
                radiusY={h / 2}
                fill={element.style?.backgroundColor || colorScheme.primary}
                listening={false}
              />
            </Group>
          );
        }

        return (
          <Rect
            {...commonProps}
            fill={element.style?.backgroundColor || colorScheme.primary}
            cornerRadius={element.style?.borderRadius || 0}
          />
        );

      case "border":
        return (
          <Rect
            {...commonProps}
            ref={isSelected ? selectedNodeRef : null}
            stroke={element.style?.borderColor || colorScheme.accent}
            strokeWidth={element.style?.strokeWidth || 4}
            cornerRadius={element.style?.borderRadius || 0}
            fill={element.style?.fill || "transparent"}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-[#111827] dark:bg-gray-900 p-8 overflow-auto flex items-start justify-center min-h-0">
      <div
        className="relative rounded-lg shadow-2xl flex-shrink-0"
        style={{
          width: canvasSize.width * scale,
          height: canvasSize.height * scale,
        }}
      >
        <Stage
          ref={effectiveStageRef}
          width={canvasSize.width * scale}
          height={canvasSize.height * scale}
          scale={{ x: 1, y: 1 }}
          className="rounded-lg"
          onMouseDown={handleStageClick}
          onTouchStart={handleStageClick}
        >
          {/* Background Layer */}
          <Layer>
            {(() => {
              const bgColor = colorScheme.background;
              const colorMatches = bgColor.match(/#[0-9a-fA-F]{6}/g);

              if (
                bgColor.includes("gradient") &&
                colorMatches &&
                colorMatches.length >= 2
              ) {
                // Create Konva linear gradient for main background
                return (
                  <Rect
                    x={0}
                    y={0}
                    width={canvasSize.width * scale}
                    height={canvasSize.height * scale}
                    fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                    fillLinearGradientEndPoint={{
                      x: canvasSize.width * scale,
                      y: canvasSize.height * scale,
                    }}
                    fillLinearGradientColorStops={[
                      0,
                      colorMatches[0],
                      1,
                      colorMatches[colorMatches.length - 1],
                    ]}
                    listening={false}
                  />
                );
              }

              // Fallback to solid color
              return (
                <Rect
                  x={0}
                  y={0}
                  width={canvasSize.width * scale}
                  height={canvasSize.height * scale}
                  fill={colorMatches?.[0] || bgColor || "#ffffff"}
                  listening={false}
                />
              );
            })()}

            {/* Grid */}
            {gridVisible && (
              <Group>
                {Array.from({ length: Math.ceil(canvasSize.width / 20) }).map(
                  (_, i) => (
                    <Rect
                      key={`grid-v-${i}`}
                      x={i * 20 * scale}
                      y={0}
                      width={1}
                      height={canvasSize.height * scale}
                      fill="#e5e7eb"
                      opacity={0.5}
                      listening={false}
                    />
                  )
                )}
                {Array.from({ length: Math.ceil(canvasSize.height / 20) }).map(
                  (_, i) => (
                    <Rect
                      key={`grid-h-${i}`}
                      x={0}
                      y={i * 20 * scale}
                      width={canvasSize.width * scale}
                      height={1}
                      fill="#e5e7eb"
                      opacity={0.5}
                      listening={false}
                    />
                  )
                )}
              </Group>
            )}
          </Layer>

          {/* Elements Layer */}
          <Layer>
            {/* Sort elements by zIndex before rendering */}
            {[...elements]
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => renderElement(element))}

            {/* Transformer for selected element */}
            {selectedElement && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize to minimum size
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
                enabledAnchors={[
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]}
                rotateEnabled={true}
                borderStroke="#3b82f6"
                borderStrokeWidth={2}
                anchorStroke="#3b82f6"
                anchorFill="#ffffff"
                anchorSize={8}
                anchorCornerRadius={4}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
