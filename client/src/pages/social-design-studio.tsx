import { useState, useEffect, useRef } from "react";
import SDSHeader from "@/components/social-design-studio/Header";
import LeftSidebar from "@/components/social-design-studio/LeftSidebar";
import DesignCanvas from "@/components/social-design-studio/DesignCanvas";
import RightSidebar from "@/components/social-design-studio/RightSidebar";
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

  // generic element updater that updates elements array without changing selection
  const updateElement = (updated: any) => {
    if (!updated) return;
    setElements((prev) =>
      prev.map((el) => (el.id === updated.id ? { ...el, ...updated } : el))
    );
  };

  // layer reorder helpers
  const moveElementForward = (id: string) => {
    try {
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${id}`);
        if (node && typeof node.moveUp === "function") {
          node.moveUp();
          const layer = node.getLayer();
          if (layer && typeof layer.batchDraw === "function") layer.batchDraw();
        }
      }
    } catch (err) {}

    // keep elements order in sync
    setElements((prev) => {
      const i = prev.findIndex((el) => el.id === id);
      if (i === -1 || i === prev.length - 1) return prev;
      const next = [...prev];
      const [el] = next.splice(i, 1);
      next.splice(i + 1, 0, el);
      return next;
    });
  };

  const moveElementBackward = (id: string) => {
    try {
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${id}`);
        if (node && typeof node.moveDown === "function") {
          node.moveDown();
          const layer = node.getLayer();
          if (layer && typeof layer.batchDraw === "function") layer.batchDraw();
        }
      }
    } catch (err) {}

    setElements((prev) => {
      const i = prev.findIndex((el) => el.id === id);
      if (i <= 0) return prev;
      const next = [...prev];
      const [el] = next.splice(i, 1);
      next.splice(i - 1, 0, el);
      return next;
    });
  };

  const bringElementToFront = (id: string) => {
    try {
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${id}`);
        if (node && typeof node.moveToTop === "function") {
          node.moveToTop();
          const layer = node.getLayer();
          if (layer && typeof layer.batchDraw === "function") layer.batchDraw();
        }
      }
    } catch (err) {}

    setElements((prev) => {
      const i = prev.findIndex((el) => el.id === id);
      if (i === -1 || i === prev.length - 1) return prev;
      const next = [...prev];
      const [el] = next.splice(i, 1);
      next.push(el);
      return next;
    });
  };

  const sendElementToBack = (id: string) => {
    try {
      const stage = stageRef.current;
      if (stage) {
        const node = stage.findOne(`#${id}`);
        if (node && typeof node.moveToBottom === "function") {
          node.moveToBottom();
          const layer = node.getLayer();
          if (layer && typeof layer.batchDraw === "function") layer.batchDraw();
        }
      }
    } catch (err) {}

    setElements((prev) => {
      const i = prev.findIndex((el) => el.id === id);
      if (i <= 0) return prev;
      const next = [...prev];
      const [el] = next.splice(i, 1);
      // insert before first non-background element to avoid moving under backgrounds
      const firstNonBg = next.findIndex((e) => e.type !== "background");
      const insertAt = firstNonBg === -1 ? 0 : firstNonBg;
      next.splice(insertAt, 0, el);
      return next;
    });
  };

  // delete element helper
  const deleteElement = (id: string) => {
    if (!id) return;
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElement?.id === id) setSelectedElement(null);
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

  // helpers to add new elements from the LeftSidebar tools
  const addText = (text = "New Text") => {
    const id = `text-${Date.now()}`;
    const newEl = {
      id,
      type: "text",
      content: text,
      style: {
        fontSize: 20,
        color: "#000000",
        fontFamily: "Inter, sans-serif",
      },
      position: { x: 50, y: 50, anchor: "center" },
      size: { width: 200, height: 40 },
      rotation: 0,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElement(newEl);
  };

  const addImage = (src?: string) => {
    const id = `image-${Date.now()}`;
    const srcToUse = src || "/api/placeholder/300/200";

    // load image to preserve original aspect ratio
    try {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const natW = img.naturalWidth || img.width || 300;
        const natH = img.naturalHeight || img.height || 200;
        // choose a sensible max width to avoid huge images in the canvas
        const maxWidth = 640;
        const width = Math.min(natW, maxWidth);
        const height = Math.round((width * natH) / natW);
        const newEl = {
          id,
          type: "image",
          content: "",
          src: srcToUse,
          style: {
            aspectLocked: true,
            naturalWidth: natW,
            naturalHeight: natH,
            aspectRatio: natW > 0 ? natH / natW : 1,
          },
          position: { x: 50, y: 50, anchor: "center" },
          size: { width, height },
          rotation: 0,
          zIndex: elements.length + 1,
        };
        setElements((prev) => [...prev, newEl]);
        setSelectedElement(newEl);
      };
      img.onerror = () => {
        // fallback to adding the image without measuring
        const newEl = {
          id,
          type: "image",
          content: "",
          src: srcToUse,
          style: { aspectLocked: true, aspectRatio: 1 },
          position: { x: 50, y: 50, anchor: "center" },
          size: { width: 240, height: 160 },
          rotation: 0,
          zIndex: elements.length + 1,
        };
        setElements((prev) => [...prev, newEl]);
        setSelectedElement(newEl);
      };
      img.src = srcToUse;
    } catch (err) {
      const newEl = {
        id,
        type: "image",
        content: "",
        src: srcToUse,
        style: { aspectLocked: true, aspectRatio: 1 },
        position: { x: 50, y: 50, anchor: "center" },
        size: { width: 240, height: 160 },
        rotation: 0,
        zIndex: elements.length + 1,
      };
      setElements((prev) => [...prev, newEl]);
      setSelectedElement(newEl);
    }
  };

  // file input ref for selecting local images
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openImagePicker = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = ""; // reset
    fileInputRef.current.click();
  };

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      // if a image element is selected, replace its src & update natural size
      if (selectedElement && selectedElement.type === "image") {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const natW = img.naturalWidth || img.width || 300;
          const natH = img.naturalHeight || img.height || 200;
          const aspectRatio = natH / natW || 1;
          // if aspectLocked keep width and recompute height
          let width = selectedElement.size?.width || Math.min(natW, 640);
          let height =
            selectedElement.size?.height || Math.round(width * aspectRatio);
          if (selectedElement.style?.aspectLocked) {
            height = Math.round(width * aspectRatio);
          } else {
            // if user had custom sizes, keep them; otherwise compute sensible height
            if (!selectedElement.size?.height)
              height = Math.round(width * aspectRatio);
          }

          const updated = {
            ...selectedElement,
            src: dataUrl,
            style: {
              ...(selectedElement.style || {}),
              naturalWidth: natW,
              naturalHeight: natH,
              aspectRatio,
            },
            size: { ...(selectedElement.size || {}), width, height },
          };
          updateSelectedElement(updated);
        };
        img.onerror = () => {
          // fallback: just set src
          const updated = { ...selectedElement, src: dataUrl };
          updateSelectedElement(updated);
        };
        img.src = dataUrl;
      } else {
        addImage(dataUrl);
      }
    };
    reader.onerror = () => {
      // fallback: try object URL
      try {
        const url = URL.createObjectURL(file);
        addImage(url);
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (err) {
        console.error("Failed to read selected image", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const addShape = (shapeType: "rect" | "circle" | "triangle" = "rect") => {
    const id = `shape-${Date.now()}`;
    const newEl: any = {
      id,
      type: "shape",
      shape: shapeType,
      content: "",
      style: {
        // default fill for shapes
        background: "#ffffff",
        color: "#000000",
        stroke: "#000000",
        strokeWidth: 0,
      },
      position: { x: 50, y: 50, anchor: "center" },
      size: { width: 120, height: 120 },
      rotation: 0,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElement(newEl);
  };

  const addEffect = (effect = "glow") => {
    const id = `effect-${Date.now()}`;
    const newEl = {
      id,
      type: "effect",
      effect,
      content: "",
      style: { color: "#ffffff", opacity: 0.8 },
      position: { x: 50, y: 50, anchor: "center" },
      size: { width: 300, height: 300 },
      rotation: 0,
      zIndex: elements.length + 1,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElement(newEl);
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

      // If there's an active selection, temporarily clear it so the
      // Konva Transformer is detached/hidden during export. Then wait a
      // frame for Konva to update before generating the image. Restore
      // the selection afterwards.
      const prevSelected = selectedElement;
      if (prevSelected) {
        try {
          setSelectedElement(null);
          // wait one animation frame so Konva redraws without the transformer
          await new Promise((res) => requestAnimationFrame(res));
        } catch (e) {
          // ignore
        }
      }

      // get data URL (PNG). You can pass { pixelRatio: 2 } for higher res
      const dataUrl = stage.toDataURL({ pixelRatio: 2 });

      // restore previous selection
      if (prevSelected) {
        try {
          setSelectedElement(prevSelected);
        } catch (e) {
          // ignore
        }
      }

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
          onAddText={addText}
          onAddImage={openImagePicker}
          onAddShape={addShape}
          onAddEffect={addEffect}
          setPreviewMode={setPreviewMode}
        />

        {/* hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          className="hidden"
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
            setPreviewMode={setPreviewMode}
            setSelectedElement={updateSelectedElement}
            stageRef={stageRef}
            selectedElement={selectedElement}
            applyRemix={applyRemix}
          />
        </div>

        <RightSidebar
          selectedElement={selectedElement}
          setSelectedElement={updateSelectedElement}
          elements={elements}
          onUpdateElement={updateElement}
          onMoveUp={moveElementForward}
          onMoveDown={moveElementBackward}
          onBringToFront={bringElementToFront}
          onSendToBack={sendElementToBack}
          onDeleteElement={deleteElement}
          selectedPlatform={selectedPlatform}
          onShare={shareDesign}
          isSharing={isSharing}
          onDownload={() => downloadDesign("png")}
          isExporting={isExporting}
          onReplaceImage={openImagePicker}
        />
      </div>
    </div>
  );
}
