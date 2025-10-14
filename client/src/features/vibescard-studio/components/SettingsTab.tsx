import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsTabProps {
  zoom: number;
  setZoom: (value: number) => void;
  gridVisible: boolean;
  setGridVisible: (value: boolean) => void;
}

export function SettingsTab({
  zoom,
  setZoom,
  gridVisible,
  setGridVisible,
}: SettingsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Canvas Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Canvas Size</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="800x600">800 x 600 (4:3)</SelectItem>
                <SelectItem value="1200x800">1200 x 800 (3:2)</SelectItem>
                <SelectItem value="1920x1080">1920 x 1080 (16:9)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Zoom: {zoom}%</Label>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={50}
              max={200}
              step={10}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="grid"
              checked={gridVisible}
              onCheckedChange={(checked) => setGridVisible(!!checked)}
            />
            <Label htmlFor="grid">Show Grid</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
