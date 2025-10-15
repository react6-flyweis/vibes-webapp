import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCreateDesign, createDesignTabMap } from "@/mutations/designs";
import Navigation from "@/components/navigation";
import PublishDialog from "@/components/PublishDialog";

import { Sidebar } from "@/features/vibescard-studio/components/Sidebar";
import { KonvaCanvas } from "@/features/vibescard-studio/components/KonvaCanvas";
import { Toolbar } from "@/features/vibescard-studio/components/Toolbar";
import { PropertiesPanel } from "@/features/vibescard-studio/components/PropertiesPanel";

import { useDesignElements } from "@/features/vibescard-studio/hooks/useDesignElements";
import { useTemplate } from "@/features/vibescard-studio/hooks/useTemplate";

import {
  saveDesignData,
  calculateZoomLevel,
  exportDesignToPNG,
  preloadImagesForExport,
  waitForImagesToLoad,
} from "@/features/vibescard-studio/utils/helpers";

export default function VibesCardStudioNew() {
  const { toast } = useToast();
  const stageRef = useRef<any>(null);
  const navigate = useNavigate();

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
    selectedElement,
    setSelectedElement,
    colorScheme,
    setColorScheme,
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
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

  const [eventTitle, setEventTitle] = useState("New Design");
  const [eventMessage, setEventMessage] = useState("You're Invited!");
  const [eventDate, setEventDate] = useState("2025-12-25T18:00");
  const [eventLocation, setEventLocation] = useState(
    "Grand Ballroom, The Plaza Hotel"
  );
  const [hostName, setHostName] = useState("Sarah & Michael");

  const { selectedTemplate, applyTemplate } = useTemplate();

  // Sync event details with elements that have dataField mappings
  useEffect(() => {
    const eventDetailsMap = {
      title: eventTitle,
      message: eventMessage,
      date: eventDate,
      location: eventLocation,
      hostName: hostName,
    };

    // Update elements that have dataField mappings
    setElements((prevElements) =>
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

      // Apply the template with event details
      applyTemplate(
        template,
        setElements,
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

  // Save design mutation
  const saveDesign = useMutation({
    mutationFn: async () => {
      const designData = saveDesignData(
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
      return await apiRequest("POST", "/api/vibescard-designs", designData);
    },
    onSuccess: () => {
      toast({
        title: "Design Saved",
        description: "Your invitation design has been saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Unable to save design. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Community design create mutation (for export + publish)
  const createDesignMutation = useCreateDesign({
    onSuccess: async (data) => {
      // data is the response from the create design API - expect it to include the created id
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
        // Redirect to collaborative design sharing page after successful publish
        try {
          navigate("/collaborative-design-sharing");
        } catch (err) {
          console.warn("Navigation after publish failed:", err);
        }
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

  // Export handler
  const handleExport = useCallback(async () => {
    try {
      // Show loading toast
      toast({
        title: "Preparing Export",
        description: "Loading images and preparing canvas...",
      });

      console.log("Starting export process with elements:", elements.length);

      // First, wait for all current images to load
      await waitForImagesToLoad(elements);

      // Preload and convert external images to base64
      const updatedElements = await preloadImagesForExport(elements);

      // Update the elements state with base64 images
      setElements(updatedElements);

      console.log("Elements updated with base64 images");

      // Wait for React to re-render and Konva to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Attempting export...");
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
      // Show loading toast
      toast({
        title: "Preparing Design",
        description: "Loading images and preparing canvas...",
      });

      console.log("Starting publish process with elements:", elements.length);

      // First, wait for all current images to load
      await waitForImagesToLoad(elements);

      // Preload and convert external images to base64
      const updatedElements = await preloadImagesForExport(elements);

      // Update the elements state with base64 images
      setElements(updatedElements);

      console.log("Elements updated with base64 images");

      // Wait for React to re-render and Konva to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Attempting to generate image for publish...");

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

      // Build design JSON so it can be loaded/edited later.
      // Prefer Konva's stage.toJSON() when available (captures Konva node state),
      // otherwise fall back to the structured saveDesignData object.
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

  // Get selected element object
  const selectedEl = elements.find((el) => el.id === selectedElement) || null;

  return (
    <div className="min-h-screen bg-[#111827]">
      <Navigation />

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

      <div className="flex h-[calc(100vh-64px)]">
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
          onSave={() => handleOpenPublishDialog()}
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
            onSave={() => handleOpenPublishDialog()}
            isSaving={saveDesign.isPending}
            onExport={handleExport}
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
    </div>
  );
}
