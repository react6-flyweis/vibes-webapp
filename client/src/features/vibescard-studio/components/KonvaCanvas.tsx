import { useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Rect,
  Group,
  Transformer,
} from "react-konva";
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
  stageRef?: React.RefObject<any>;
}

// Image component wrapper to handle loading
function ImageElement({ src, ...props }: any) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
    return () => {
      img.onload = null;
    };
  }, [src]);

  if (!image) return null;
  return <KonvaImage image={image} {...props} />;
}

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
}: KonvaCanvasProps) {
  const localStageRef = useRef<any>(null);
  const effectiveStageRef = stageRef || localStageRef;
  const transformerRef = useRef<any>(null);
  const selectedNodeRef = useRef<any>(null);

  // Scale factor for zoom
  const scale = zoom / 100;

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedElement && transformerRef.current && selectedNodeRef.current) {
      // Attach transformer to the selected node
      transformerRef.current.nodes([selectedNodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElement]);

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
      // Attach ref to selected element for transformer
      ref: isSelected ? selectedNodeRef : null,
      // Remove stroke since transformer will show handles
      name: element.id,
    };

    switch (element.type) {
      case "text":
        return (
          <Text
            {...commonProps}
            text={element.content?.text || "Click to edit"}
            fontSize={(element.style?.fontSize || 18) * elementScale}
            fontFamily={element.style?.fontFamily || "Inter"}
            fontStyle={
              element.style?.fontWeight === "bold"
                ? "bold"
                : element.style?.fontStyle || "normal"
            }
            fill={element.style?.color || colorScheme.text}
            align={element.style?.textAlign || "left"}
            verticalAlign="middle"
            wrap="word"
          />
        );

      case "logo":
        return (
          <Text
            {...commonProps}
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
              listening={false}
            />
          );
        }

        // Fallback to solid color
        return (
          <Rect
            {...commonProps}
            fill={colorMatches?.[0] || bgStyle || "#ffffff"}
            listening={false}
          />
        );

      case "image":
        if (element.content?.src) {
          return (
            <ImageElement
              {...commonProps}
              src={element.content.src}
              cornerRadius={element.style?.borderRadius || 0}
            />
          );
        }
        return null;

      case "shape":
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
            stroke={element.style?.borderColor || colorScheme.accent}
            strokeWidth={4}
            cornerRadius={element.style?.borderRadius || 0}
            fill="transparent"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-[#111827] dark:bg-gray-900 p-8 overflow-auto flex items-center justify-center">
      <div
        className="relative rounded-lg shadow-2xl"
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

          {/* Event Details Overlay Layer */}
          {(eventDetails.title ||
            eventDetails.message ||
            eventDetails.date ||
            eventDetails.location) && (
            <Layer listening={false}>
              <Group
                x={canvasSize.width * scale * 0.5}
                y={canvasSize.height * scale * 0.5}
              >
                {eventDetails.title && (
                  <Text
                    text={eventDetails.title}
                    fontSize={32 * scale}
                    fontFamily="sans-serif"
                    fontStyle="bold"
                    fill={colorScheme.text}
                    align="center"
                    x={-200 * scale}
                    y={-100 * scale}
                    width={400 * scale}
                  />
                )}
                {eventDetails.message && (
                  <Text
                    text={eventDetails.message}
                    fontSize={16 * scale}
                    fontFamily="sans-serif"
                    fill={colorScheme.text}
                    align="center"
                    x={-200 * scale}
                    y={-40 * scale}
                    width={400 * scale}
                    wrap="word"
                  />
                )}
                {eventDetails.date && (
                  <Text
                    text={new Date(eventDetails.date).toLocaleDateString()}
                    fontSize={18 * scale}
                    fontFamily="sans-serif"
                    fontStyle="bold"
                    fill={colorScheme.primary}
                    align="center"
                    x={-200 * scale}
                    y={20 * scale}
                    width={400 * scale}
                  />
                )}
                {eventDetails.location && (
                  <Text
                    text={eventDetails.location}
                    fontSize={16 * scale}
                    fontFamily="sans-serif"
                    fill={colorScheme.text}
                    align="center"
                    x={-200 * scale}
                    y={50 * scale}
                    width={400 * scale}
                  />
                )}
              </Group>
            </Layer>
          )}
        </Stage>
      </div>
    </div>
  );
}
