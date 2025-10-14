import { forwardRef, useRef, useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Transformer,
  Group,
} from "react-konva";
import { DesignElement, ColorScheme, EventDetails } from "../types";

interface CanvasProps {
  elements: DesignElement[];
  selectedElement: string | null;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  canvasSize: { width: number; height: number };
  zoom: number;
  gridVisible: boolean;
  colorScheme: ColorScheme;
  eventDetails: EventDetails;
}

// Component for rendering individual elements with Konva
function CanvasElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: {
  element: DesignElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: (e: any) => void;
}) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Setup transformer for selected element
  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Load images for image elements
  useEffect(() => {
    if (element.type === "image" && element.content?.src) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = element.content.src;
      img.onload = () => setImage(img);
    }
  }, [element.type, element.content?.src]);

  const commonProps = {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    rotation: element.rotation,
    opacity: element.opacity,
    draggable: true,
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd,
    onTransformEnd,
  };

  return (
    <Group>
      {element.type === "text" && (
        <Text
          ref={shapeRef}
          {...commonProps}
          text={element.content?.text || "Text"}
          fontSize={element.style?.fontSize || 16}
          fontFamily={element.style?.fontFamily || "Arial"}
          fontStyle={`${element.style?.fontWeight || "normal"} ${
            element.style?.fontStyle || "normal"
          }`}
          fill={element.style?.color || "#000000"}
          align={element.style?.textAlign || "left"}
          verticalAlign="middle"
          wrap="word"
        />
      )}

      {element.type === "logo" && (
        <Text
          ref={shapeRef}
          {...commonProps}
          text={element.content?.text || element.content?.emblem || "LOGO"}
          fontSize={element.style?.fontSize || 20}
          fontFamily={element.style?.fontFamily || "Arial"}
          fontStyle={`bold ${element.style?.fontStyle || "normal"}`}
          fill={element.style?.color || "#000000"}
          align="center"
          verticalAlign="middle"
        />
      )}

      {element.type === "shape" && (
        <Rect
          ref={shapeRef}
          {...commonProps}
          fill={element.style?.backgroundColor || "#cccccc"}
          cornerRadius={element.style?.borderRadius || 0}
        />
      )}

      {element.type === "border" && (
        <Rect
          ref={shapeRef}
          {...commonProps}
          stroke={element.style?.borderColor || "#000000"}
          strokeWidth={element.style?.borderWidth || 2}
          cornerRadius={element.style?.borderRadius || 0}
          fill="transparent"
        />
      )}

      {element.type === "background" && (
        <Rect
          ref={shapeRef}
          {...commonProps}
          fill={element.style?.background || "#ffffff"}
          listening={false}
        />
      )}

      {element.type === "image" && image && (
        <KonvaImage
          ref={shapeRef}
          {...commonProps}
          image={image}
          cornerRadius={element.style?.borderRadius || 0}
        />
      )}

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit resize
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Group>
  );
}

export const Canvas = forwardRef<any, CanvasProps>(
  (
    {
      elements,
      selectedElement,
      onSelectElement,
      onUpdateElement,
      canvasSize,
      zoom,
      gridVisible,
      colorScheme,
      eventDetails,
    },
    ref
  ) => {
    const stageRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose stage to parent via ref
    useEffect(() => {
      if (typeof ref === "function") {
        ref(stageRef.current);
      } else if (ref) {
        ref.current = stageRef.current;
      }
    }, [ref]);

    const handleDragEnd = (element: DesignElement, e: any) => {
      onUpdateElement(element.id, {
        x: e.target.x(),
        y: e.target.y(),
      });
    };

    const handleTransformEnd = (element: DesignElement, e: any) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      // Reset scale and update width/height instead
      node.scaleX(1);
      node.scaleY(1);

      onUpdateElement(element.id, {
        x: node.x(),
        y: node.y(),
        width: Math.max(10, node.width() * scaleX),
        height: Math.max(10, node.height() * scaleY),
        rotation: node.rotation(),
      });
    };

    const checkDeselect = (e: any) => {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        onSelectElement("");
      }
    };

    const scaledWidth = canvasSize.width * (zoom / 100);
    const scaledHeight = canvasSize.height * (zoom / 100);

    return (
      <div className="flex-1 bg-[#111827] dark:bg-gray-900 p-8 overflow-auto">
        <div className="flex items-center justify-center min-h-full">
          <div
            ref={containerRef}
            className="relative rounded-lg shadow-lg"
            style={{
              width: scaledWidth,
              height: scaledHeight,
            }}
          >
            <Stage
              ref={stageRef}
              width={scaledWidth}
              height={scaledHeight}
              scaleX={zoom / 100}
              scaleY={zoom / 100}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              className="rounded-lg"
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  fill={
                    colorScheme.background.includes("gradient")
                      ? "#ffffff"
                      : colorScheme.background
                  }
                  listening={false}
                />

                {/* Grid */}
                {gridVisible && (
                  <>
                    {Array.from({
                      length: Math.ceil(canvasSize.width / 20),
                    }).map((_, i) => (
                      <Rect
                        key={`grid-v-${i}`}
                        x={i * 20}
                        y={0}
                        width={1}
                        height={canvasSize.height}
                        fill="#cccccc"
                        opacity={0.3}
                        listening={false}
                      />
                    ))}
                    {Array.from({
                      length: Math.ceil(canvasSize.height / 20),
                    }).map((_, i) => (
                      <Rect
                        key={`grid-h-${i}`}
                        x={0}
                        y={i * 20}
                        width={canvasSize.width}
                        height={1}
                        fill="#cccccc"
                        opacity={0.3}
                        listening={false}
                      />
                    ))}
                  </>
                )}

                {/* Elements */}
                {elements
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((element) => (
                    <CanvasElement
                      key={element.id}
                      element={element}
                      isSelected={element.id === selectedElement}
                      onSelect={() => onSelectElement(element.id)}
                      onDragEnd={(e) => handleDragEnd(element, e)}
                      onTransformEnd={(e) => handleTransformEnd(element, e)}
                    />
                  ))}

                {/* Event Details Overlay */}
                {eventDetails.title && (
                  <Text
                    x={canvasSize.width / 2}
                    y={canvasSize.height / 2 - 100}
                    text={eventDetails.title}
                    fontSize={32}
                    fontFamily="Arial"
                    fontStyle="bold"
                    fill={colorScheme.text}
                    align="center"
                    offsetX={200}
                    width={400}
                    listening={false}
                  />
                )}

                {eventDetails.message && (
                  <Text
                    x={canvasSize.width / 2}
                    y={canvasSize.height / 2 - 40}
                    text={eventDetails.message}
                    fontSize={16}
                    fontFamily="Arial"
                    fill={colorScheme.text}
                    align="center"
                    offsetX={200}
                    width={400}
                    listening={false}
                  />
                )}

                {eventDetails.date && (
                  <Text
                    x={canvasSize.width / 2}
                    y={canvasSize.height / 2 + 20}
                    text={new Date(eventDetails.date).toLocaleDateString()}
                    fontSize={18}
                    fontFamily="Arial"
                    fontStyle="bold"
                    fill={colorScheme.primary}
                    align="center"
                    offsetX={150}
                    width={300}
                    listening={false}
                  />
                )}

                {eventDetails.location && (
                  <Text
                    x={canvasSize.width / 2}
                    y={canvasSize.height / 2 + 50}
                    text={eventDetails.location}
                    fontSize={16}
                    fontFamily="Arial"
                    fill={colorScheme.text}
                    align="center"
                    offsetX={150}
                    width={300}
                    listening={false}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
