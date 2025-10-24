import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sliders,
  Zap,
  Camera,
  Crown,
  Gamepad2,
  Globe,
  Bot,
  Wand2,
  Eye,
  Calendar,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvitationEvent, InvitationTemplate, Guest } from "@/types/invitation";

interface Props {
  selectedTemplate: InvitationTemplate;
  selectedEvent: InvitationEvent | null;
  customizations: any;
  setCustomizations: (c: any) => void;
  previewMode: string;
  setPreviewMode: (m: any) => void;
}

const CustomizeStep: React.FC<Props> = ({
  selectedTemplate,
  selectedEvent,
  customizations,
  setCustomizations,
  previewMode,
  setPreviewMode,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#EB6F71]" />
            Customize Your Invitation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Color Scheme</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[
                ["#6366f1", "#8b5cf6"],
                ["#ef4444", "#f97316"],
                ["#10b981", "#06b6d4"],
                ["#f59e0b", "#eab308"],
              ].map((colors, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg cursor-pointer ring-2 ${
                    JSON.stringify(customizations.colors) ===
                    JSON.stringify(colors)
                      ? "ring-gray-900"
                      : "ring-transparent"
                  }`}
                  style={{
                    background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
                  }}
                  onClick={() =>
                    setCustomizations((prev: any) => ({ ...prev, colors }))
                  }
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Features</Label>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Animations</span>
              </div>
              <Switch
                checked={customizations.animations}
                onCheckedChange={(checked: any) =>
                  setCustomizations((prev: any) => ({
                    ...prev,
                    animations: checked,
                  }))
                }
              />
            </div>

            {selectedTemplate.arElements && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>AR Experience</span>
                </div>
                <Switch
                  checked={customizations.arExperience}
                  onCheckedChange={(checked: any) =>
                    setCustomizations((prev: any) => ({
                      ...prev,
                      arExperience: checked,
                    }))
                  }
                />
              </div>
            )}

            {selectedTemplate.nftIntegration && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  <span>NFT Pass Preview</span>
                </div>
                <Switch
                  checked={customizations.nftPassPreview}
                  onCheckedChange={(checked: any) =>
                    setCustomizations((prev: any) => ({
                      ...prev,
                      nftPassPreview: checked,
                    }))
                  }
                />
              </div>
            )}

            {selectedTemplate.gamificationLevel && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Gamification Elements</span>
                </div>
                <Switch
                  checked={customizations.gamificationElements}
                  onCheckedChange={(checked: any) =>
                    setCustomizations((prev: any) => ({
                      ...prev,
                      gamificationElements: checked,
                    }))
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Sustainability Badges</span>
              </div>
              <Switch
                checked={customizations.sustainabilityBadges}
                onCheckedChange={(checked: any) =>
                  setCustomizations((prev: any) => ({
                    ...prev,
                    sustainabilityBadges: checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-purple-600" />
              <span className="font-medium">AI Enhancement</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Let AI optimize your invitation design based on your event type
              and audience
            </p>
            <Button size="sm" variant="outline" className="w-full">
              <Wand2 className="w-4 h-4 mr-2" />
              Enhance with AI
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview
          </CardTitle>
          <div className="flex gap-2">
            {["desktop", "mobile", "ar", "nft"].map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={previewMode === mode ? "default" : "outline"}
                onClick={() => setPreviewMode(mode as any)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-3/4 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-800 rounded-lg p-6 relative overflow-hidden">
            <div
              className="w-full h-full rounded-lg shadow-lg relative"
              style={{
                background: `linear-gradient(135deg, ${customizations.colors[0]}, ${customizations.colors[1]})`,
              }}
            >
              <div className="absolute inset-0 bg-black/20 rounded-lg" />
              <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedEvent?.title || "Your Event"}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {selectedEvent?.description || "Event description here..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {selectedEvent?.date || "Date"} at{" "}
                    {selectedEvent?.time || "Time"}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {selectedEvent?.venue || "Venue"}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    RSVP Now
                  </Button>
                  {customizations.arExperience && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white text-white hover:bg-white/20"
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      AR
                    </Button>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  {customizations.nftPassPreview && (
                    <Badge className="bg-yellow-500">NFT</Badge>
                  )}
                  {customizations.gamificationElements && (
                    <Badge className="bg-green-500">Quest</Badge>
                  )}
                  {customizations.sustainabilityBadges && (
                    <Badge className="bg-blue-500">Eco</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizeStep;
