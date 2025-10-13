import React, { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

export default function SelectionTransformer({
  stageRef,
  selectedElement,
  elements,
  setSelectedElement,
}: any) {
  const trRef = useRef<any>(null);

  useEffect(() => {
    try {
      if (!trRef.current) return;
      const stage = stageRef.current?.getStage
        ? stageRef.current.getStage()
        : stageRef.current;
      if (!stage) return;
      const selId = selectedElement?.id;
      if (!selId) {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
        return;
      }

      const node = stage.findOne(`#${selId}`);
      if (node) {
        trRef.current.nodes([node]);
        const keepRatio = !!selectedElement?.style?.aspectLocked;
        trRef.current.keepRatio(keepRatio);

        const handleTransformStart = () => {
          const active =
            typeof trRef.current.getActiveAnchor === "function"
              ? trRef.current.getActiveAnchor()
              : null;
          if (!active) return;
          const isCorner =
            /top|bottom/.test(active) && /left|right/.test(active);
          const isTriangle = selectedElement?.shape === "triangle";
          trRef.current.keepRatio(
            !!selectedElement?.style?.aspectLocked || (!isTriangle && isCorner)
          );
        };
        const handleTransformEnd = () => {
          trRef.current.keepRatio(!!selectedElement?.style?.aspectLocked);
        };
        trRef.current.on("transformstart", handleTransformStart);
        trRef.current.on("transformend", handleTransformEnd);
        trRef.current.anchorStroke("#ffffff");
        trRef.current.anchorFill("#2563eb");
        trRef.current.anchorSize(10);
        trRef.current.borderStroke("#2563eb");
        trRef.current.borderDash([6, 4]);
        trRef.current.getLayer()?.batchDraw();
      } else {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
      return () => {
        try {
          trRef.current.off && trRef.current.off("transformstart");
          trRef.current.off && trRef.current.off("transformend");
        } catch (e) {}
      };
    } catch (err) {
      // ignore transformer attach errors
    }
  }, [selectedElement, elements, stageRef]);

  return <Transformer ref={trRef} />;
}
