import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useCreateDesign } from "@/api/designs";
import Navigation from "@/components/navigation";
import PublishDialog from "@/components/PublishDialog";

import { Sidebar } from "@/features/vibescard-studio/components/Sidebar";
import { KonvaCanvas } from "@/features/vibescard-studio/components/KonvaCanvas";
import { Toolbar } from "@/features/vibescard-studio/components/Toolbar";
import { PropertiesPanel } from "@/features/vibescard-studio/components/PropertiesPanel";

import { useDesignElements } from "@/features/vibescard-studio/hooks/useDesignElements";
import { useEventDetails } from "@/features/vibescard-studio/hooks/useEventDetails";
import { useTemplate } from "@/features/vibescard-studio/hooks/useTemplate";

import {
  saveDesignData,
  calculateZoomLevel,
  exportDesignToPNG,
} from "@/features/vibescard-studio/utils/helpers";

export default function VibesCardStudioNew() {
  const { toast } = useToast();
  const stageRef = useRef<any>(null);

  // Canvas state
  const [canvasSize] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(100);
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

  const {
    eventTitle,
    setEventTitle,
    eventMessage,
    setEventMessage,
    eventDate,
    setEventDate,
    eventLocation,
    setEventLocation,
    hostName,
    setHostName,
    eventDetails,
  } = useEventDetails();

  const { selectedTemplate, applyTemplate } = useTemplate();

  // Template application handler
  const handleApplyTemplate = useCallback(
    (template: any) => {
      applyTemplate(template, setElements, setColorScheme, setSelectedElement);
    },
    [applyTemplate, setElements, setColorScheme, setSelectedElement]
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
        eventDetails,
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
    onSuccess: () => {
      toast({
        title: "Design Published",
        description: "Your design has been published to the community.",
      });
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
  const handleExport = useCallback(() => {
    try {
      exportDesignToPNG(stageRef);
      toast({
        title: "Export Success",
        description: "Your invitation has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export design. Please try again.",
        variant: "destructive",
      });
    }
  }, [stageRef, toast]);

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
      // Export to dataURL (reuse helper which returns dataURL)
      const dataURL = exportDesignToPNG(stageRef);

      if (!dataURL) {
        toast({
          title: "Export Failed",
          description: "Could not generate image for publish",
          variant: "destructive",
        });
        return;
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
        status: true,
      } as any;

      createDesignMutation.mutate(payload);
      setShowSaveDialog(false);
    } catch (err) {
      toast({
        title: "Publish Error",
        description: "An error occurred while publishing",
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
        <div className="flex-1 flex flex-col">
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
            eventDetails={eventDetails}
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
