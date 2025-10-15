import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DesignTab } from "./DesignTab";
import { ContentTab } from "./ContentTab";
import { SettingsTab } from "./SettingsTab";
import { ExportTab } from "./ExportTab";
import { Template, DesignElement, ColorScheme } from "../types";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;

  // Design Tab
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTemplate: string | null;
  onApplyTemplate: (template: Template) => void;
  onAddElement: (type: DesignElement["type"]) => void;
  colorScheme: ColorScheme;

  // Content Tab
  eventTitle: string;
  setEventTitle: (value: string) => void;
  eventMessage: string;
  setEventMessage: (value: string) => void;
  eventDate: string;
  setEventDate: (value: string) => void;
  eventLocation: string;
  setEventLocation: (value: string) => void;
  hostName: string;
  setHostName: (value: string) => void;

  // Settings Tab
  zoom: number;
  setZoom: (value: number) => void;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;

  // Export Tab
  onSave: () => void;
  onExport: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  activeTab,
  onTabChange,
  selectedCategory,
  setSelectedCategory,
  selectedTemplate,
  onApplyTemplate,
  onAddElement,
  colorScheme,
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
  zoom,
  setZoom,
  gridVisible,
  setGridVisible,
  onSave,
  onExport,
}: SidebarProps) {
  return (
    <div
      className={`${
        collapsed ? "w-16" : "w-[23%]"
      } bg-[#1F2937] text-white dark:bg-gray-800 dark:border-gray-300 flex flex-col transition-all duration-300 shrink-0`}
    >
      {/* Sidebar Header */}
      <div className="p-4 dark:border-gray-700 border-gray-300 border-b mb-1">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-white">
              VibesCard Studio
            </h2>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {collapsed ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 m-2">
              <TabsTrigger value="design" className="text-xs">
                Design
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs">
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                Settings
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs">
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="px-4 pb-4">
              <DesignTab
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedTemplate={selectedTemplate}
                onApplyTemplate={onApplyTemplate}
                onAddElement={onAddElement}
                colorScheme={colorScheme}
              />
            </TabsContent>

            <TabsContent value="content" className="px-4 pb-4">
              <ContentTab
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
              />
            </TabsContent>

            <TabsContent value="settings" className="px-4 pb-4">
              <SettingsTab
                zoom={zoom}
                setZoom={setZoom}
                gridVisible={gridVisible}
                setGridVisible={setGridVisible}
              />
            </TabsContent>

            <TabsContent value="export" className="px-4 pb-4">
              <ExportTab onSave={onSave} onExport={onExport} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
