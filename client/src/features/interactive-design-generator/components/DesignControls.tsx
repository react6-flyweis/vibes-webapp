import { MoodType, DesignStyle } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings, Sparkles, Camera, Share2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MOOD_PALETTES } from "../constants";
import { MoodIcon } from "./MoodIcon";
import { useRef } from "react";

interface DesignControlsProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  designStyle: DesignStyle;
  onStyleChange: (style: DesignStyle) => void;
  moodIntensity: number[];
  onIntensityChange: (value: number[]) => void;
  onGeneratePalette: () => void;
  onImportImage?: (file: File) => void;
}

export function DesignControls({
  currentMood,
  onMoodChange,
  designStyle,
  onStyleChange,
  moodIntensity,
  onIntensityChange,
  onGeneratePalette,
  onImportImage,
}: DesignControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportImage) {
      onImportImage(file);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Design Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Current Mood</label>
          <Select value={currentMood} onValueChange={onMoodChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(MOOD_PALETTES).map((mood) => (
                <SelectItem key={mood} value={mood}>
                  <div className="flex items-center gap-2">
                    <MoodIcon mood={mood as MoodType} />
                    <span className="capitalize">{mood}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Design Style</label>
          <Select value={designStyle} onValueChange={onStyleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="artistic">Artistic</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="whimsical">Whimsical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Mood Intensity: {moodIntensity[0]}%
          </label>
          <Slider
            value={moodIntensity}
            onValueChange={onIntensityChange}
            max={100}
            min={10}
            step={5}
            className="w-full"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-semibold">Quick Actions</h4>
          <Button className="w-full" onClick={onGeneratePalette}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate New Palette
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4 mr-2" />
            Import Image
          </Button>
          <Button variant="outline" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share Design
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
