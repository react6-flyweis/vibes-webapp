import React from "react";
import { Layer } from "react-konva";
import SelectionTransformer from "./SelectionTransformer";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import EffectElement from "./elements/EffectElement";
import TextElement from "./elements/TextElement";

export default function ElementsLayer({
  elements,
  imageCache,
  stageSize,
  selectedElement,
  setSelectedElement,
  setElements,
  updateElementPosition,
  stageRef,
}: any) {
  const getRenderPosition = (el: any) => {
    const xPx = ((el.position?.x ?? 0) / 100) * stageSize.width;
    const yPx = ((el.position?.y ?? 0) / 100) * stageSize.height;
    const width = el.size?.width ?? 100;
    const height = el.size?.height ?? 40;
    const isCentered =
      el.type === "shape" ||
      el.position?.anchor === "center" ||
      el.center === true;
    return {
      renderX: isCentered ? xPx - width / 2 : xPx,
      renderY: isCentered ? yPx - height / 2 : yPx,
      width,
      height,
      isCentered,
    };
  };

  return (
    <Layer>
      {elements
        .filter((el: any) => el.type !== "background")
        .map((element: any) => {
          if (element.type === "image") {
            return (
              <ImageElement
                key={element.id}
                element={element}
                imageCache={imageCache}
                stageSize={stageSize}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setElements={setElements}
                updateElementPosition={updateElementPosition}
                elements={elements}
              />
            );
          }

          if (element.type === "shape") {
            return (
              <ShapeElement
                key={element.id}
                element={element}
                stageSize={stageSize}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setElements={setElements}
                updateElementPosition={updateElementPosition}
                elements={elements}
              />
            );
          }

          if (element.type === "effect") {
            return (
              <EffectElement
                key={element.id}
                element={element}
                stageSize={stageSize}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setElements={setElements}
                updateElementPosition={updateElementPosition}
                elements={elements}
              />
            );
          }

          return (
            <TextElement
              key={element.id}
              element={element}
              stageSize={stageSize}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              setElements={setElements}
              updateElementPosition={updateElementPosition}
              elements={elements}
            />
          );
        })}
      {/* place Transformer inside the same layer as elements to avoid Konva runtime error */}
      <SelectionTransformer
        stageRef={stageRef}
        selectedElement={selectedElement}
        elements={elements}
        setSelectedElement={setSelectedElement}
      />
    </Layer>
  );
}
