import React from "react";
import { Card } from "@/components/ui/card";
// import { Download, Copy, TrendingUp } from "lucide-react";
import ElementActions from "./ElementActions";
import TextControls from "./TextControls";
import ShapeControls from "./ShapeControls";
import ImageControls from "./ImageControls";
import BackgroundControls from "./BackgroundControls";
import StageProperties from "./StageProperties";
import ExportShareCard from "./ExportShareCard";
import FontSizeControl from "./FontSizeControl";
import TextColorControl from "./TextColorControl";
import EffectControls from "./EffectControls";
// import CollaborationCard from "./CollaborationCard";
// import PerformanceCard from "./PerformanceCard";

export default function RightSidebar({
  selectedElement,
  setSelectedElement,
  elements,
  onUpdateElement,
  selectedPlatform,
  onShare,
  isSharing,
  onDownload,
  isExporting,
  onReplaceImage,
  onMoveUp,
  onMoveDown,
  onBringToFront,
  onSendToBack,
  onDeleteElement,
}: any) {
  return (
    <div className="col-span-3 space-y-4">
      {selectedElement ? (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Element Properties</h3>
          {selectedElement && (
            <ElementActions
              selectedElement={selectedElement}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onBringToFront={onBringToFront}
              onSendToBack={onSendToBack}
              onDeleteElement={onDeleteElement}
            />
          )}
          <div className="space-y-4">
            {selectedElement.type === "text" && (
              <TextControls
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            )}
            {/* Shape properties */}
            {selectedElement.type === "shape" && (
              <ShapeControls
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            )}
            {/* Font size controls for text elements */}
            <FontSizeControl
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
            {/* Color picker for text elements */}
            <TextColorControl
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />
            {/* Effect properties */}
            <EffectControls
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
            />

            {/* Image properties */}
            {selectedElement.type === "image" && (
              <ImageControls
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                onReplaceImage={onReplaceImage}
              />
            )}
            {/* Background / Stage properties */}
            {selectedElement.type === "background" && (
              <BackgroundControls
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            )}
          </div>
        </Card>
      ) : (
        // when nothing is selected, show Stage / Background properties
        // Manual verification: deselect all elements in the canvas and confirm this panel
        // shows "Stage Properties" and allows changing the background color/image when
        // a background element exists.
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Stage Properties</h3>
          <div className="space-y-3">
            <StageProperties
              elements={elements}
              onUpdateElement={onUpdateElement}
            />
          </div>
        </Card>
      )}

      <ExportShareCard
        selectedPlatform={selectedPlatform}
        onShare={onShare}
        isSharing={isSharing}
        onDownload={onDownload}
        isExporting={isExporting}
      />

      {/* Optional collaboration card (previously commented-out) */}
      {/* <CollaborationCard /> */}

      {/* Optional performance card (previously commented-out) */}
      {/* <PerformanceCard /> */}
    </div>
  );
}
