import { useState, useRef, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useCreateDesign,
  createDesignTabMap,
  useUpdateDesign,
} from "@/mutations/designs";
import PublishDialog from "@/components/PublishDialog";

import { Sidebar } from "./components/Sidebar";
import { KonvaCanvas } from "./components/KonvaCanvas";
import { Toolbar } from "./components/Toolbar";
import { PropertiesPanel } from "./components/PropertiesPanel";

import { useDesignElements } from "./hooks/useDesignElements";
import { useTemplate } from "./hooks/useTemplate";

import {
  saveDesignData,
  calculateZoomLevel,
  exportDesignToPNG,
  preloadImagesForExport,
  waitForImagesToLoad,
} from "./utils/helpers";
import { CommunityDesignApiItem } from "@/queries/communityDesigns";

interface EditorPageProps {
  initialDesign?: CommunityDesignApiItem;
}

export default function EditorPage({ initialDesign }: EditorPageProps) {
  const { toast } = useToast();
  const stageRef = useRef<any>(null);

  // Canvas state
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1027 });
  const [zoom, setZoom] = useState(50);
  const [gridVisible, setGridVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState("design");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Custom hooks for state management
  const {
    elements,
    setElements,
    setElementsWithHistory,
    selectedElement,
    setSelectedElement,
    colorScheme,
    setColorScheme,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDesignElements(
    {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#ffffff",
      text: "#1f2937",
    },
    canvasSize
  );

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isEditable) return; // allow native undo in text inputs

      // Undo: Ctrl/Cmd+Z
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        try {
          undo();
        } catch (err) {
          // ignore
        }
        return;
      }

      // Redo: Ctrl+Y or Ctrl/Cmd+Shift+Z
      if (
        (mod && e.key.toLowerCase() === "y") ||
        (mod && e.key.toLowerCase() === "z" && e.shiftKey)
      ) {
        e.preventDefault();
        try {
          redo();
        } catch (err) {
          // ignore
        }
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const [eventTitle, setEventTitle] = useState("New Design");
  const [eventMessage, setEventMessage] = useState("You're Invited!");
  const [eventDate, setEventDate] = useState("2025-12-25T18:00");
  const [eventLocation, setEventLocation] = useState(
    "Grand Ballroom, The Plaza Hotel"
  );
  const [hostName, setHostName] = useState("Sarah & Michael");

  const { selectedTemplate, applyTemplate } = useTemplate();

  // If an initialDesign is provided, attempt to load it into the editor
  useEffect(() => {
    if (!initialDesign) return;
    try {
      // Try to restore top-level metadata
      if (initialDesign.title) setEventTitle(initialDesign.title);
      if (initialDesign.sub_title) setEventMessage(initialDesign.sub_title);
      if (initialDesign.hash_tag) {
        // nothing to do now, but preserved in design object
      }
    } catch (err) {
      console.warn("Failed to load initial design into editor", err);
      toast({
        title: "Load Failed",
        description: "Could not load design into editor",
      });
    }
  }, [initialDesign, setElements, toast, canvasSize]);

  // Sync event details with elements that have dataField mappings
  useEffect(() => {
    const eventDetailsMap = {
      title: eventTitle,
      message: eventMessage,
      date: eventDate,
      location: eventLocation,
      hostName: hostName,
    };

    // Update elements that have dataField mappings (record in history)
    setElementsWithHistory((prevElements) =>
      prevElements.map((element) => {
        if (element.dataField && eventDetailsMap[element.dataField]) {
          return {
            ...element,
            content: {
              ...element.content,
              text: eventDetailsMap[element.dataField],
            },
          };
        }
        return element;
      })
    );
  }, [
    eventTitle,
    eventMessage,
    eventDate,
    eventLocation,
    hostName,
    setElements,
  ]);

  // Template application handler
  const handleApplyTemplate = useCallback(
    (template: any) => {
      // Show toast that template is being applied
      toast({
        title: "Applying Template",
        description: "Loading template elements...",
      });

      // Clear selection and reset zoom for better UX
      setSelectedElement(null);
      setZoom(50);

      // Prepare event details
      const eventDetailsData = {
        title: eventTitle,
        message: eventMessage,
        date: eventDate,
        location: eventLocation,
        hostName: hostName,
      };

      // Apply the template with event details (record in history)
      applyTemplate(
        template,
        setElementsWithHistory,
        setColorScheme,
        setSelectedElement,
        setCanvasSize,
        eventDetailsData
      );
    },
    [
      applyTemplate,
      setElements,
      setColorScheme,
      setSelectedElement,
      setCanvasSize,
      toast,
      setZoom,
      eventTitle,
      eventMessage,
      eventDate,
      eventLocation,
      hostName,
    ]
  );

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => calculateZoomLevel(prev, "in"));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => calculateZoomLevel(prev, "out"));
  }, []);

  // Community design create mutation (for export + publish)
  const createDesignMutation = useCreateDesign({
    onSuccess: async (data) => {
      toast({
        title: "Design Published",
        description: "Your design has been published to the community.",
      });

      try {
        const createdId = data?.data?.community_designs_id || 0;
        await createDesignTabMap({
          tabs_id: 2,
          community_designs_id: createdId,
          status: true,
        });
      } catch (err) {
        console.error("Failed to map design to tab:", err);
        toast({
          title: "Mapping Failed",
          description: "Design was published but mapping to tabs failed.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Publish Failed",
        description: "Unable to publish design. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateDesignMutation = useUpdateDesign({
    onSuccess: async (data) => {
      toast({
        title: "Design Updated",
        description: "Your design has been updated in the community.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to update design. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Export handler
  const handleExport = useCallback(async () => {
    try {
      toast({
        title: "Preparing Export",
        description: "Loading images and preparing canvas...",
      });

      // First, wait for all current images to load
      await waitForImagesToLoad(elements);

      // Preload and convert external images to base64
      const updatedElements = await preloadImagesForExport(elements);

      // Update the elements state with base64 images (record in history)
      setElementsWithHistory(updatedElements);

      // Wait for React to re-render and Konva to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      await exportDesignToPNG(stageRef);

      toast({
        title: "Export Success",
        description: "Your invitation has been downloaded",
      });
    } catch (error) {
      console.error("Export error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to export design. Please try again.";

      toast({
        title: "Export Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [stageRef, toast, elements, setElements]);

  // Save dialog state for publishing/exporting to community
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishSubTitle, setPublishSubTitle] = useState("");
  const [publishTags, setPublishTags] = useState(""); // comma separated

  const handleOpenPublishDialog = useCallback(() => {
    setPublishTitle(eventTitle || "Untitled Design");
    setPublishSubTitle(eventMessage || "");
    setPublishTags("");
    setShowSaveDialog(true);
  }, [eventTitle, eventMessage]);

  const handlePublish = useCallback(async () => {
    try {
      toast({
        title: "Preparing Design",
        description: "Loading images and preparing canvas...",
      });

      // First, wait for all current images to load
      await waitForImagesToLoad(elements);

      // Preload and convert external images to base64
      const updatedElements = await preloadImagesForExport(elements);

      // Update the elements state with base64 images (record in history)
      setElementsWithHistory(updatedElements);

      // Wait for React to re-render and Konva to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Export to dataURL (reuse helper which returns dataURL)
      const dataURL = await exportDesignToPNG(stageRef);

      if (!dataURL) {
        toast({
          title: "Export Failed",
          description: "Could not generate image for publish",
          variant: "destructive",
        });
        return;
      }

      let designJsonString = "";
      try {
        const stage = stageRef?.current;
        if (stage && typeof stage.toJSON === "function") {
          designJsonString = stage.toJSON();
        } else {
          const designJsonObject = saveDesignData(
            elements,
            colorScheme,
            canvasSize,
            {
              title: eventTitle,
              message: eventMessage,
              date: eventDate,
              location: eventLocation,
              hostName: hostName,
            },
            selectedTemplate
          );
          designJsonString = JSON.stringify(designJsonObject);
        }
      } catch (e) {
        console.warn(
          "Failed to generate stage JSON, falling back to saveDesignData",
          e
        );
        const designJsonObject = saveDesignData(
          elements,
          colorScheme,
          canvasSize,
          {
            title: eventTitle,
            message: eventMessage,
            date: eventDate,
            location: eventLocation,
            hostName: hostName,
          },
          selectedTemplate
        );
        designJsonString = JSON.stringify(designJsonObject);
      }

      const payload = {
        categories_id: 1,
        image: dataURL,
        title: publishTitle || "Amazing Design",
        sub_title: publishSubTitle || "",
        image_type: "Beginner",
        image_sell_type: "free",
        hash_tag: publishTags
          ? publishTags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        design_json_data: designJsonString,
        status: true,
      } as any;

      createDesignMutation.mutate(payload);
      setShowSaveDialog(false);
    } catch (err) {
      console.error("Publish error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while publishing";

      toast({
        title: "Publish Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    stageRef,
    publishTitle,
    publishSubTitle,
    publishTags,
    createDesignMutation,
    toast,
    elements,
    setElements,
  ]);

  // Update handler: similar to publish but updates existing design directly
  const handleUpdate = useCallback(async () => {
    if (
      !initialDesign ||
      typeof initialDesign.community_designs_id === "undefined"
    ) {
      toast({
        title: "Update Error",
        description: "No initial design ID to update.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For updates we do NOT re-export or re-encode the image.
      // Use existing `initialDesign.image` if present; otherwise leave image blank.
      const imageForUpdate = initialDesign?.image || "";

      // Generate updated design JSON (stage.toJSON when available)
      let designJsonString = "";
      try {
        const stage = stageRef?.current;
        if (stage && typeof stage.toJSON === "function") {
          designJsonString = stage.toJSON();
        } else {
          const designJsonObject = saveDesignData(
            elements,
            colorScheme,
            canvasSize,
            {
              title: initialDesign.title || eventTitle,
              message: initialDesign.sub_title || eventMessage,
              date: eventDate,
              location: eventLocation,
              hostName: hostName,
            },
            selectedTemplate
          );
          designJsonString = JSON.stringify(designJsonObject);
        }
      } catch (e) {
        const designJsonObject = saveDesignData(
          elements,
          colorScheme,
          canvasSize,
          {
            title: eventTitle,
            message: eventMessage,
            date: eventDate,
            location: eventLocation,
            hostName: hostName,
          },
          selectedTemplate
        );
        designJsonString = JSON.stringify(designJsonObject);
      }

      const payload = {
        categories_id:
          initialDesign && typeof initialDesign.categories_id === "number"
            ? initialDesign.categories_id
            : 1,
        image: imageForUpdate,
        title: eventTitle || initialDesign?.title || "Amazing Design",
        sub_title: eventMessage || initialDesign?.sub_title || "",
        image_type: initialDesign?.image_type || "Beginner",
        image_sell_type: initialDesign?.image_sell_type || "free",
        hash_tag:
          publishTags && publishTags.length > 0
            ? publishTags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : initialDesign?.hash_tag || [],
        design_json_data: designJsonString,
        status:
          typeof initialDesign?.status === "boolean"
            ? initialDesign.status
            : true,
      } as any;

      const id = initialDesign.community_designs_id;
      updateDesignMutation.mutate({ id, payload });
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred while updating";

      toast({
        title: "Update Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [
    initialDesign,
    stageRef,
    elements,
    setElements,
    colorScheme,
    canvasSize,
    eventTitle,
    eventMessage,
    eventDate,
    eventLocation,
    hostName,
    selectedTemplate,
    updateDesignMutation,
    toast,
  ]);

  // Get selected element object
  const selectedEl = elements.find((el) => el.id === selectedElement) || null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <PublishDialog
        open={showSaveDialog}
        title={publishTitle}
        subTitle={publishSubTitle}
        tags={publishTags}
        loading={createDesignMutation.isPending}
        onClose={() => setShowSaveDialog(false)}
        onChangeTitle={setPublishTitle}
        onChangeSubTitle={setPublishSubTitle}
        onChangeTags={setPublishTags}
        onPublish={handlePublish}
      />

      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTemplate={selectedTemplate}
        onApplyTemplate={handleApplyTemplate}
        onAddElement={addElement}
        colorScheme={colorScheme}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventMessage={eventMessage}
        setEventMessage={setEventMessage}
        eventDate={eventDate}
        setEventDate={setEventDate}
        eventLocation={eventLocation}
        setEventLocation={setEventLocation}
        hostName={hostName}
        setHostName={setHostName}
        zoom={zoom}
        setZoom={setZoom}
        gridVisible={gridVisible}
        setGridVisible={setGridVisible}
        onSave={() =>
          initialDesign ? handleUpdate() : handleOpenPublishDialog()
        }
        onExport={handleExport}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Toolbar */}
        <Toolbar
          eventTitle={eventTitle}
          onEventTitleChange={setEventTitle}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onSave={() =>
            initialDesign ? handleUpdate() : handleOpenPublishDialog()
          }
          isSaving={
            createDesignMutation.isPending || updateDesignMutation.isPending
          }
          saveLabel={initialDesign ? "Update" : "Save"}
          //   isSaving={saveDesign.isPending}
          onExport={handleExport}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          designId={initialDesign?.community_designs_id ?? null}
          onShare={(sharedUrl: string) =>
            toast({
              title: "Link Copied",
              description: `Share link copied to clipboard: ${sharedUrl}`,
            })
          }
        />

        {/* Canvas */}
        <KonvaCanvas
          stageRef={stageRef}
          elements={elements}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateElement={updateElement}
          canvasSize={canvasSize}
          zoom={zoom}
          gridVisible={gridVisible}
          colorScheme={colorScheme}
          eventDetails={{
            title: eventTitle,
            message: eventMessage,
            date: eventDate,
            location: eventLocation,
            hostName: hostName,
          }}
          initialKonvaJSON={initialDesign?.design_json_data}
        />
      </div>

      {/* Right Sidebar - Properties Panel */}
      <PropertiesPanel
        selectedElement={selectedEl}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
        onDuplicateElement={duplicateElement}
      />
    </div>
  );
}
