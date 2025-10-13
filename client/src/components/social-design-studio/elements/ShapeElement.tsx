import React from "react";
import { Group, Rect, Ellipse, RegularPolygon } from "react-konva";

export default function ShapeElement({
  element,
  stageSize,
  selectedElement,
  setSelectedElement,
  setElements,
  updateElementPosition,
  elements,
}: any) {
  const width = element.size?.width ?? 100;
  const height = element.size?.height ?? 40;
  const shapeType = element.shape || "rect";

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const scaleX = node.scaleX() || 1;
    const scaleY = node.scaleY() || 1;
    const newWidth = Math.max(1, width * scaleX);
    const newHeight = Math.max(1, height * scaleY);
    const newRotation = node.rotation() || 0;
    const centerX = node.x();
    const centerY = node.y();
    node.scaleX(1);
    node.scaleY(1);
    setElements((prev: any[]) =>
      prev.map((el) =>
        el.id === element.id
          ? {
              ...el,
              size: { width: newWidth, height: newHeight },
              rotation: newRotation,
              position: {
                x: (centerX / stageSize.width) * 100,
                y: (centerY / stageSize.height) * 100,
                anchor: "center",
              },
            }
          : el
      )
    );
    try {
      setSelectedElement({
        ...element,
        size: { width: newWidth, height: newHeight },
        rotation: newRotation,
        position: {
          x: (centerX / stageSize.width) * 100,
          y: (centerY / stageSize.height) * 100,
          anchor: "center",
        },
      });
    } catch (err) {}
  };

  return (
    <Group
      id={element.id}
      key={element.id}
      x={((element.position?.x ?? 0) / 100) * stageSize.width + width / 2}
      y={((element.position?.y ?? 0) / 100) * stageSize.height + height / 2}
      rotation={element.rotation || 0}
      draggable
      onTransformEnd={handleTransformEnd}
      onDragMove={(e) => {
        const nx = e.target.x();
        const ny = e.target.y();
        try {
          if (selectedElement?.id === element.id) {
            setSelectedElement({
              ...selectedElement,
              position: {
                x: (nx / stageSize.width) * 100,
                y: (ny / stageSize.height) * 100,
                anchor: "center",
              },
            });
          }
        } catch (err) {}
      }}
      onDragEnd={(e) =>
        updateElementPosition(
          element.id,
          e.target.x() - width / 2,
          e.target.y() - height / 2
        )
      }
      onMouseDown={(e) => {
        e.cancelBubble = true;
        const fresh =
          elements.find((el: any) => el.id === element.id) || element;
        setSelectedElement(fresh);
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        const fresh =
          elements.find((el: any) => el.id === element.id) || element;
        setSelectedElement(fresh);
      }}
    >
      {shapeType === "rect" ? (
        <Rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill={element.style?.background || "#fff"}
          opacity={element.style?.opacity ?? 1}
          cornerRadius={element.style?.cornerRadius || 0}
          stroke={element.style?.stroke}
          strokeWidth={element.style?.strokeWidth || 0}
          strokeEnabled={!!element.style?.strokeWidth}
          strokeScaleEnabled={false}
          dashEnabled={element.style?.strokeStyle === "dashed"}
          strokeDash={
            element.style?.strokeStyle === "dashed" ? [10, 6] : undefined
          }
        />
      ) : shapeType === "circle" ? (
        <Ellipse
          x={0}
          y={0}
          radiusX={width / 2}
          radiusY={height / 2}
          fill={element.style?.background || "#fff"}
          opacity={element.style?.opacity ?? 1}
          stroke={element.style?.stroke}
          strokeWidth={element.style?.strokeWidth || 0}
          strokeEnabled={!!element.style?.strokeWidth}
          strokeScaleEnabled={false}
          dashEnabled={element.style?.strokeStyle === "dashed"}
          strokeDash={
            element.style?.strokeStyle === "dashed" ? [10, 6] : undefined
          }
        />
      ) : shapeType === "triangle" ? (
        (() => {
          const baseR = 50;
          const naturalW = Math.sqrt(3) * baseR;
          const naturalH = 1.5 * baseR;
          const scaleX = width / naturalW || 1;
          const scaleY = height / naturalH || 1;
          return (
            <RegularPolygon
              x={0}
              y={0}
              sides={3}
              radius={baseR}
              scaleX={scaleX}
              scaleY={scaleY}
              fill={element.style?.background || "#fff"}
              stroke={element.style?.stroke}
              strokeWidth={element.style?.strokeWidth || 0}
              strokeEnabled={!!element.style?.strokeWidth}
              strokeScaleEnabled={false}
              dashEnabled={element.style?.strokeStyle === "dashed"}
              strokeDash={
                element.style?.strokeStyle === "dashed" ? [10, 6] : undefined
              }
              opacity={element.style?.opacity ?? 1}
            />
          );
        })()
      ) : (
        <Rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill={element.style?.background || "#fff"}
          cornerRadius={
            element.style?.cornerRadius || Math.min(width, height) / 2
          }
          opacity={element.style?.opacity ?? 1}
        />
      )}
    </Group>
  );
}
