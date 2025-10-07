import React, { useState } from "react";
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

// EventTypeSelector extracted to its own file

export default function SettingsTab({ event }: any) {
  // Try to use event.event_theme_id first (API id), fallback to event.theme
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();
  const [selectedEventType, setSelectedEventType] = useState<
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
            <Input
              placeholder="Enter dress code..."
              defaultValue={event.dressCode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Music Playlist URL
            </label>
            <Input
              type="url"
              placeholder="Spotify, Apple Music, or YouTube playlist URL..."
              defaultValue={event.musicPlaylistUrl}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Total Budget
            </label>
            <Input type="number" placeholder="Enter total budget..." />
          </div>

          <Button className="w-full">Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
