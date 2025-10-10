import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Layers,
  Palette,
  Shuffle,
  Plus,
  Camera,
  Sparkles,
  Star,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { socialPlatforms } from "./sampleData";

export default function LeftSidebar({
  currentDesignType,
  onSwitchDesign,
  remixSettings,
  setRemixSettings,
  applyRemix,
  onSelectPlatform,
  selectedPlatform,
}: any) {
  // Build colorful gradients for the remix sliders so the tracks visually match the setting.
  // hue: rainbow across 0-360
  const hueStops = Array.from({ length: 13 }).map((_, i) => {
    return `hsl(${Math.round((i * 360) / 12)}, 100%, 50%)`;
  });
  // party purple tint (approximation of project's `bg-party-purple`)
  const partyPurple = "rgba(124,58,237,0.9)";
  const partyPurpleSubtle = "rgba(124,58,237,0.28)";
  const hueStyle: React.CSSProperties = {
    // add a subtle purple at the ends so the track reads as 'party purple' themed
    background: `linear-gradient(90deg, ${partyPurpleSubtle}, ${hueStops.join(
      ", "
    )}, ${partyPurpleSubtle})`,
  };

  // saturation: from desaturated (gray) to full saturation of the selected hue
  const satStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${partyPurpleSubtle}, hsl(${remixSettings.colorHue}, 0%, 50%), hsl(${remixSettings.colorHue}, 100%, 50%), ${partyPurpleSubtle})`,
  };

  // brightness: from black through the hue (at mid lightness) to white
  const safeSat = Math.max(
    0,
    Math.min(Number(remixSettings.saturation) || 100, 100)
  );
  const brightStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${partyPurpleSubtle}, black, hsl(${remixSettings.colorHue}, ${safeSat}%, 50%), white, ${partyPurpleSubtle})`,
  };

  return (
    <div className="col-span-3 space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Design Templates
        </h3>
        <div className="space-y-2">
          <Button
            variant={
              currentDesignType === "birthday-celebration"
                ? "default"
                : "outline"
            }
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onSwitchDesign("birthday-celebration")}
          >
            <Star className="w-4 h-4 mr-2" />
            Sarah's Birthday Bash
          </Button>
          <Button
            variant={
              currentDesignType === "corporate-gala" ? "default" : "outline"
            }
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onSwitchDesign("corporate-gala")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Innovation Summit
          </Button>
          <Button
            variant={
              currentDesignType === "wedding-announcement"
                ? "default"
                : "outline"
            }
            size="sm"
            className="w-full justify-start text-xs"
            onClick={() => onSwitchDesign("wedding-announcement")}
          >
            <Star className="w-4 h-4 mr-2" />
            Michael & Jennifer
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Design Tools
        </h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            Add Text
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Camera className="w-4 h-4 mr-2" />
            Add Image
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Layers className="w-4 h-4 mr-2" />
            Add Shape
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Sparkles className="w-4 h-4 mr-2" />
            Add Effect
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shuffle className="w-5 h-5" />
          Interactive Remix
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm">Color Hue</div>
            <input
              type="range"
              value={remixSettings.colorHue}
              min={0}
              max={360}
              onChange={(e) =>
                setRemixSettings({
                  ...remixSettings,
                  colorHue: Number(e.target.value),
                })
              }
              className="w-full mt-2"
              style={hueStyle}
            />
          </div>

          <div>
            <div className="text-sm">Saturation</div>
            <input
              type="range"
              value={remixSettings.saturation}
              min={0}
              max={200}
              onChange={(e) =>
                setRemixSettings({
                  ...remixSettings,
                  saturation: Number(e.target.value),
                })
              }
              className="w-full mt-2"
              style={satStyle}
            />
          </div>

          <div>
            <div className="text-sm">Brightness</div>
            <input
              type="range"
              value={remixSettings.brightness}
              min={0}
              max={200}
              onChange={(e) =>
                setRemixSettings({
                  ...remixSettings,
                  brightness: Number(e.target.value),
                })
              }
              className="w-full mt-2"
              style={brightStyle}
            />
          </div>

          <Button size="sm" onClick={applyRemix} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Apply Remix
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Social Platforms
        </h3>
        <div className="space-y-2">
          {socialPlatforms.map((platform) => (
            <Button
              key={platform.id}
              variant={
                selectedPlatform?.id === platform.id ? "default" : "outline"
              }
              size="sm"
              className="w-full justify-start"
              onClick={() => onSelectPlatform(platform)}
            >
              <platform.icon className="w-4 h-4 mr-2" />
              {platform.name}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
