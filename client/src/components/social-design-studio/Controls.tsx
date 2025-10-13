import React from "react";
import { Button } from "../ui/button";
import { Edit3, Eye, Play } from "lucide-react";

export default function Controls({ previewMode, setPreviewMode }: any) {
  return (
    <div className="flex gap-2">
      <Button
        className="px-3 py-1 border"
        variant={previewMode === "design" ? "outline" : "default"}
        onClick={() => setPreviewMode?.("design")}
      >
        <Edit3 /> Design
      </Button>
      <Button
        className={"px-3 py-1 border"}
        variant={previewMode === "mockup" ? "outline" : "default"}
        onClick={() => setPreviewMode?.("mockup")}
      >
        <Eye /> Mockup
      </Button>
      {/*
      <Button className={`px-3 py-1 border ${previewMode === "animation" ? "bg-gray-200" : ""}`} onClick={() => setPreviewMode?.("animation")}>
        <Play /> Animation
      </Button>
      */}
    </div>
  );
}
