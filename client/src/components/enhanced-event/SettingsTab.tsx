import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SettingsTab({ event }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Settings</CardTitle>
        <CardDescription>Configure event details and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birthday">Birthday Party</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="baby-shower">Baby Shower</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <Input placeholder="Enter event theme..." defaultValue={event.theme} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dress Code</label>
            <Input placeholder="Enter dress code..." defaultValue={event.dressCode} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Music Playlist URL</label>
            <Input type="url" placeholder="Spotify, Apple Music, or YouTube playlist URL..." defaultValue={event.musicPlaylistUrl} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Total Budget</label>
            <Input type="number" placeholder="Enter total budget..." />
          </div>

          <Button className="w-full">Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
