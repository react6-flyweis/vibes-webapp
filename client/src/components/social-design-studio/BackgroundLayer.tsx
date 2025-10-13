import React from "react";
import { Layer, Rect, Image as KonvaImage } from "react-konva";

export default function BackgroundLayer({
  elements,
  imageCache,
  stageSize,
}: any) {
  return (
    <Layer>
      {elements
        .filter((el: any) => el.type === "background")
        .map((element: any) => {
          if (
            element.style?.backgroundImage ||
            (element.style?.background &&
              String(element.style.background)
                .trim()
                .startsWith("linear-gradient"))
          ) {
            const src =
              element.style.backgroundImage ||
              "__grad__" + element.style.background;
            const img = imageCache[src];
            return (
              <KonvaImage
                key={element.id}
                image={img as any}
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                opacity={element.style.opacity ?? 1}
              />
            );
          }

          const bg = element.style?.background;
          if (bg && String(bg).trim().startsWith("linear-gradient")) {
            const gradKey = "__grad__" + bg;
            const gradImg = imageCache[gradKey];
            return (
              <KonvaImage
                key={element.id}
                image={gradImg as any}
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                opacity={element.style.opacity ?? 1}
              />
            );
          }

          return (
            <Rect
              key={element.id}
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              fill={element.style?.background || "#ffffff"}
              opacity={element.style?.opacity ?? 1}
            />
          );
        })}
    </Layer>
  );
}
