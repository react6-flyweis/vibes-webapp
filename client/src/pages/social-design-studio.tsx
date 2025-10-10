import { useState, useEffect, useRef } from "react";
import SDSHeader from "@/components/social-design-studio/Header";
import LeftSidebar from "@/components/social-design-studio/LeftSidebar";
import DesignCanvas from "@/components/social-design-studio/DesignCanvas";
import RightSidebar from "@/components/social-design-studio/RightSidebar";
import MockupPreview from "@/components/social-design-studio/MockupPreview";
import {
  socialPlatforms,
  sampleDesigns,
  sampleComments,
} from "@/components/social-design-studio/sampleData";

export default function SocialDesignStudio() {
  const [elements, setElements] = useState<any[]>([]);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentPosition, setCommentPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [remixSettings, setRemixSettings] = useState({
    colorHue: 0,
    saturation: 100,
    brightness: 100,
    contrast: 100,
    blur: 0,
  });
  const [selectedPlatform, setSelectedPlatform] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "design" | "mockup" | "animation"
  >("design");
  const [isSharing, setIsSharing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentDesignType, setCurrentDesignType] = useState(
    "birthday-celebration"
  );

  const stageRef = useRef<any>(null);

  useEffect(() => {
    setElements(sampleDesigns["birthday-celebration"].elements);
    setComments(sampleComments as any);
    setSelectedPlatform(socialPlatforms[0]);
  }, []);

  const triggerConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const shareDesign = async (platformId: string) => {
    setIsSharing(true);
    triggerConfetti();
    setTimeout(() => setIsSharing(false), 2000);
  };

  // when updating selected element properties from the sidebar, persist changes into the elements array
  const updateSelectedElement = (updated: any | null) => {
    if (!updated) {
      setSelectedElement(null);
      return;
    }
    setSelectedElement(updated);
    setElements((prev) =>
      prev.map((el) => (el.id === updated.id ? { ...el, ...updated } : el))
    );
  };

  const switchDesign = (designType: string) => {
    if (sampleDesigns[designType]) {
      setCurrentDesignType(designType);
      setElements(sampleDesigns[designType].elements);
      setComments(
        designType === "birthday-celebration" ? (sampleComments as any) : []
      );
    }
  };

  const applyRemix = () => {
    const remixedElements = elements.map((element) => {
      if (element.type === "background") {
        return {
          ...element,
          style: {
            ...element.style,
            filter: `hue-rotate(${remixSettings.colorHue}deg) saturate(${remixSettings.saturation}%) brightness(${remixSettings.brightness}%) contrast(${remixSettings.contrast}%) blur(${remixSettings.blur}px)`,
          },
        };
      }
      return element;
    });
    setElements(remixedElements);
  };

  // export the visible stage as PNG and trigger download
  const downloadDesign = async (format = "png") => {
    try {
      setIsExporting(true);
      // ensure stageRef exists and has a reference to Konva Stage
      const stage = stageRef.current?.getStage
        ? stageRef.current.getStage()
        : stageRef.current;
      if (!stage || typeof stage.toDataURL !== "function") {
        console.warn("Stage ref not available for export");
        setIsExporting(false);
        return;
      }

      // get data URL (PNG). You can pass { pixelRatio: 2 } for higher res
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });

      // convert to blob and download
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `vibes-design-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      {confettiActive && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-linear-to-r from-purple-400 to-pink-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <SDSHeader
        commentsCount={comments.length}
        onToggleComments={() => setShowComments(!showComments)}
        onShare={() => shareDesign("instagram")}
      />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-6">
        <LeftSidebar
          currentDesignType={currentDesignType}
          onSwitchDesign={switchDesign}
          remixSettings={remixSettings}
          setRemixSettings={setRemixSettings}
          applyRemix={applyRemix}
          onSelectPlatform={setSelectedPlatform}
          selectedPlatform={selectedPlatform}
        />

        <div className="col-span-6">
          <DesignCanvas
            elements={elements}
            setElements={setElements}
            comments={comments}
            setComments={setComments}
            showComments={showComments}
            commentPosition={commentPosition}
            setCommentPosition={setCommentPosition}
            newComment={newComment}
            setNewComment={setNewComment}
            selectedPlatform={selectedPlatform}
            previewMode={previewMode}
            setSelectedElement={updateSelectedElement}
            stageRef={stageRef}
            selectedElement={selectedElement}
            applyRemix={applyRemix}
          />

          {previewMode === "mockup" && selectedPlatform && (
            <div className="flex justify-center mt-4">
              <MockupPreview elements={elements} platform={selectedPlatform} />
            </div>
          )}
        </div>

        <RightSidebar
          selectedElement={selectedElement}
          setSelectedElement={updateSelectedElement}
          selectedPlatform={selectedPlatform}
          onShare={shareDesign}
          isSharing={isSharing}
          onDownload={() => downloadDesign("png")}
          isExporting={isExporting}
        />
      </div>
    </div>
  );
}
