import React from "react";
import { Image as KonvaImage } from "react-konva";

export default function ImageElement({
  element,
  imageCache,
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
  const src = element.src || element.content;
  const img = imageCache[src];

  return (
    <KonvaImage
      id={element.id}
      key={element.id}
      x={
        ((element.position?.x ?? 0) / 100) * stageSize.width -
        (isCentered ? width / 2 : 0)
      }
      y={
        ((element.position?.y ?? 0) / 100) * stageSize.height -
        (isCentered ? height / 2 : 0)
      }
      rotation={element.rotation || 0}
      image={img as any}
      width={width}
      height={height}
      opacity={element.style?.opacity ?? 1}
      draggable
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
    />
  );
}
