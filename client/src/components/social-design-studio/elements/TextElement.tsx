import React from "react";
import { Group, Text } from "react-konva";

export default function TextElement({
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
        (isCentered ? width / 2 : 0)
      }
      y={
        ((element.position?.y ?? 0) / 100) * stageSize.height -
        (isCentered ? height / 2 : 0)
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
      <Text
        id={element.id}
        text={element.content}
        fontSize={parseInt(String(element.style?.fontSize || 18), 10)}
        fontFamily={element.style?.fontFamily || "Arial"}
        fill={element.style?.color || "#000"}
        opacity={element.style?.opacity ?? 1}
        fontStyle={(() => {
          const isItalic =
            element.style?.fontStyle === "italic" || element.style?.italic;
          const isBold =
            (element.style?.fontWeight &&
              String(element.style.fontWeight).toLowerCase() === "bold") ||
            element.style?.bold;
          if (isItalic && isBold) return "italic bold";
          if (isItalic) return "italic";
          if (isBold) return "bold";
          return "normal";
        })()}
        textDecoration={
          element.style?.textDecoration === "underline" ||
          element.style?.underline
            ? "underline"
            : undefined
        }
        letterSpacing={
          typeof element.style?.letterSpacing !== "undefined"
            ? Number(element.style?.letterSpacing)
            : undefined
        }
        lineHeight={
          typeof element.style?.lineHeight !== "undefined"
            ? Number(element.style.lineHeight) / 100
            : undefined
        }
        align={
          element.style?.textAlign === "center"
            ? "center"
            : element.style?.textAlign === "right"
            ? "right"
            : "left"
        }
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
        }}
      />
    </Group>
  );
}
