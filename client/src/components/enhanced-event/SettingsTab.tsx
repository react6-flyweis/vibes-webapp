import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePlanEventMap } from "@/mutations/planEventMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventTypeSelector from "@/components/event-type-select";
import { Input } from "@/components/ui/input";
import ThemeSelector from "@/components/theme-selector";
import DressCodeSelector from "@/components/dress-code-selector";
import { PlanEventMapData } from "@/queries/planEventMaps";
import { EventData } from "@/queries/events";

export default function SettingsTab({
  event,
  planMap,
}: {
  event: EventData;
  planMap?: PlanEventMapData;
}) {
  console.log("SettingsTab planMap:", planMap);
  const { toast } = useToast();
  const updatePlanMapMutation = useUpdatePlanEventMap({
    onSuccess: () => {
      toast({ title: "Settings saved", description: "Plan map updated." });
    },
    onError: (err: any) => {
      toast({
        title: "Save failed",
        description: (err && err.message) || "Failed to update plan map.",
        variant: "destructive",
      });
    },
  });

  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();
  const [selectedEventType, setSelectedEventType] = useState<
    string | undefined
  >();
  const [selectedDressCode, setSelectedDressCode] = useState<
    string | undefined
  >();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Settings</CardTitle>
        <CardDescription>
          Configure event details and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <EventTypeSelector
              event={event}
              value={selectedEventType}
              onChange={(v: string) => setSelectedEventType(v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <ThemeSelector
              value={selectedTheme}
              onChange={(v) => setSelectedTheme(v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dress Code</label>
            <DressCodeSelector
              value={selectedDressCode}
              onChange={(v) => setSelectedDressCode(v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Music Playlist URL
            </label>
            <Input
              type="url"
              placeholder="Spotify, Apple Music, or YouTube playlist URL..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Budget
            </label>
            <Input type="number" placeholder="Enter total budget..." />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              const eid =
                planMap?.event_id ?? event?.event_id ?? event?._id ?? null;
              if (!eid) {
                toast({
                  title: "Missing event id",
                  description: "Cannot save settings: event id is missing.",
                  variant: "destructive",
                });
                return;
              }
              const pmId = planMap?.plan_event_id ?? "";
              updatePlanMapMutation.mutate({ id: pmId, event_id: eid });
            }}
            disabled={updatePlanMapMutation.isPending}
          >
            {updatePlanMapMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
