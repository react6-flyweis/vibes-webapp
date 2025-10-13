import React from "react";
import { Group, Rect } from "react-konva";

export default function EffectElement({
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
  const isCentered =
    element.type === "shape" ||
    element.position?.anchor === "center" ||
    element.center === true;

  return (
    <Group
      key={element.id}
      x={
        ((element.position?.x ?? 0) / 100) * stageSize.width -
        (width * 0.25) / 2
      }
      y={
        ((element.position?.y ?? 0) / 100) * stageSize.height -
        (height * 0.25) / 2
      }
      draggable
      onDragMove={(e) => {
        const nx = e.target.x();
        const ny = e.target.y();
        try {
          if (selectedElement?.id === element.id) {
            const offsetX = isCentered ? width / 2 : 0;
            const offsetY = isCentered ? height / 2 : 0;
            setSelectedElement({
              ...selectedElement,
              position: {
                x: ((nx + offsetX) / stageSize.width) * 100,
                y: ((ny + offsetY) / stageSize.height) * 100,
              },
            });
          }
        } catch (err) {}
      }}
      onDragEnd={(e) =>
        updateElementPosition(element.id, e.target.x(), e.target.y())
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
      <Rect
        id={element.id}
        rotation={element.rotation || 0}
        width={width * 1.5}
        height={height * 1.5}
        fill={element.style?.color || "#fff"}
        opacity={element.style?.opacity ?? 0.18}
        shadowColor={element.style?.color || "#fff"}
        shadowBlur={element.style?.shadowBlur ?? 60}
        cornerRadius={element.style?.cornerRadius || Math.min(width, height)}
        onTransformEnd={(e) => {
          const node = e.target;
          const newWidth = Math.max(1, node.width() * node.scaleX());
          const newHeight = Math.max(1, node.height() * node.scaleY());
          const newRotation = node.rotation() || 0;
          node.scaleX(1);
          node.scaleY(1);
          setElements((prev: any[]) =>
            prev.map((el) =>
              el.id === element.id
                ? {
                    ...el,
                    size: { width: newWidth, height: newHeight },
                    rotation: newRotation,
                  }
                : el
            )
          );
          try {
            setSelectedElement({
              ...element,
              size: { width: newWidth, height: newHeight },
              rotation: newRotation,
            });
          } catch (err) {}
        }}
      />
    </Group>
  );
}
