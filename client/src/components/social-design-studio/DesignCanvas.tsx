import React, { useRef, useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Stage, Layer, Group, Rect } from "react-konva";
import MockupPreview from "./MockupPreview";
import useImageCache from "./hooks/useImageCache";
import useStageSize from "./hooks/useStageSize";
import BackgroundLayer from "./BackgroundLayer";
import ElementsLayer from "./ElementsLayer";
import Controls from "./Controls";
import { Play } from "lucide-react";

export default function DesignCanvas(props: any) {
  const {
    elements,
    setElements,
    comments,
    setComments,
    showComments,
    commentPosition,
    setCommentPosition,
    newComment,
    setNewComment,
    selectedPlatform,
    previewMode,
    setSelectedElement,
    selectedElement,
    applyRemix,
  } = props;

  const stageRef = props.stageRef || useRef<any>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const stageSize = useStageSize(canvasRef, selectedPlatform);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const capture = () => {
      try {
        const stage = stageRef.current?.getStage
          ? stageRef.current.getStage()
          : stageRef.current;
        if (stage && typeof stage.toDataURL === "function") {
          // wait for next frame(s) to ensure Konva finished drawing
          requestAnimationFrame(() => {
            try {
              const dataUrl = stage.toDataURL({
                pixelRatio: window.devicePixelRatio || 1,
              });
              setPreviewImage(dataUrl);
            } catch (err) {
              setPreviewImage(null);
            }
          });
          return;
        }
      } catch (e) {
        // ignore
      }
      setPreviewImage(null);
    };

    // if (previewMode === "mockup") {
    //   // allow the stage a little time to settle, then capture
    //   const t = setTimeout(capture, 150);
    //   return () => clearTimeout(t);
    // }
    setPreviewImage(null);
  }, [previewMode, elements, stageSize.width, stageSize.height]);

  const imageCache = useImageCache(elements, stageSize);

  const addComment = (x: number, y: number) => {
    if (!newComment?.trim()) return;
    const comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      userName: "Sarah Designer",
      userAvatar: "/api/placeholder/32/32",
      content: newComment,
      position: { x, y },
      timestamp: new Date().toISOString(),
      replies: [],
      resolved: false,
    };
    setComments([...comments, comment]);
    setNewComment("");
    setCommentPosition(null);
  };

  const updateElementPosition = useCallback(
    (id: string, xPx: number, yPx: number) => {
      setElements((prev: any[]) => {
        const w = stageSize.width;
        const h = stageSize.height;
        const newArr = prev.map((el) => {
          if (el.id !== id) return el;
          const isCentered =
            el.type === "shape" ||
            el.position?.anchor === "center" ||
            el.center === true;
          const offsetX = isCentered ? (el.size?.width || 100) / 2 : 0;
          const offsetY = isCentered ? (el.size?.height || 40) / 2 : 0;
          const storedX = ((xPx + offsetX) / w) * 100;
          const storedY = ((yPx + offsetY) / h) * 100;
          return {
            ...el,
            position: {
              x: Math.max(0, Math.min(100, storedX)),
              y: Math.max(0, Math.min(100, storedY)),
            },
          };
        });
        const updated = newArr.find((e) => e.id === id) || null;
        try {
          if (updated && selectedElement?.id === id)
            setSelectedElement(updated);
        } catch (e) {}
        return newArr;
      });
    },
    [stageSize.width, stageSize.height, setElements]
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Design Canvas</h3>
        <Controls
          previewMode={previewMode}
          setPreviewMode={props.setPreviewMode}
        />
      </div>

      {previewMode === "design" && (
        <div
          ref={canvasRef}
          className="relative w-full bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden cursor-crosshair flex justify-center items-center"
        >
          <div style={{ width: stageSize.width, height: stageSize.height }}>
            <Stage
              ref={stageRef}
              width={stageSize.width}
              height={stageSize.height}
              onClick={(e) => {
                if (commentPosition) {
                  const pos = e.target.getStage()?.getPointerPosition();
                  if (pos) {
                    const x = (pos.x / stageSize.width) * 100;
                    const y = (pos.y / stageSize.height) * 100;
                    addComment(x, y);
                  }
                  return;
                }

                try {
                  const clickedId =
                    typeof e.target.id === "function" ? e.target.id() : null;
                  if (clickedId) {
                    const found = elements.find(
                      (el: any) => el.id === clickedId
                    );
                    if (found) {
                      setSelectedElement(found);
                      return;
                    }
                  }

                  setSelectedElement(null);
                } catch (err) {}
              }}
            >
              <BackgroundLayer
                elements={elements}
                imageCache={imageCache}
                stageSize={stageSize}
              />
              <ElementsLayer
                elements={elements}
                imageCache={imageCache}
                stageSize={stageSize}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                setElements={setElements}
                updateElementPosition={updateElementPosition}
                stageRef={stageRef}
              />

              {selectedPlatform && (
                <Layer listening={false}>
                  <Group>
                    <Rect
                      x={0}
                      y={0}
                      width={stageSize.width}
                      height={stageSize.height}
                      strokeWidth={0}
                      fillEnabled={false}
                    />
                    <Rect
                      x={
                        (selectedPlatform.specs.safeZones.left /
                          selectedPlatform.dimensions.width) *
                        stageSize.width
                      }
                      y={
                        (selectedPlatform.specs.safeZones.top /
                          selectedPlatform.dimensions.height) *
                        stageSize.height
                      }
                      width={
                        stageSize.width -
                        ((selectedPlatform.specs.safeZones.left +
                          selectedPlatform.specs.safeZones.right) /
                          selectedPlatform.dimensions.width) *
                          stageSize.width
                      }
                      height={
                        stageSize.height -
                        ((selectedPlatform.specs.safeZones.top +
                          selectedPlatform.specs.safeZones.bottom) /
                          selectedPlatform.dimensions.height) *
                          stageSize.height
                      }
                      stroke="#f59e0b"
                      dash={[6, 6]}
                      opacity={0.6}
                    />
                  </Group>
                </Layer>
              )}
            </Stage>
          </div>
        </div>
      )}

      {previewMode === "mockup" && selectedPlatform && (
        <div className="flex justify-center mt-4">
          <MockupPreview
            elements={elements}
            platform={selectedPlatform}
            previewImage={previewImage}
          />
        </div>
      )}

      {previewMode === "animation" && (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Animation Preview</h4>
              <p className="text-gray-600">
                Interactive animations and transitions for social media
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
