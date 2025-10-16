import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MessageSquare,
  Lightbulb,
  Palette,
  BookOpen,
  Users,
  Trophy,
  Share2,
} from "lucide-react";
import {
  GroupMember,
  EventContext,
  SharedContent,
  MoodType,
  DesignStyle,
} from "../types";

interface GroupIntegrationProps {
  eventContext: EventContext | null;
  groupMembers: GroupMember[];
  sharedContent: SharedContent[];
  onShareContent: (
    content: Omit<SharedContent, "id" | "sharedAt" | "sharedBy">
  ) => void;
  currentMood: MoodType;
  designStyle: DesignStyle;
  colorPalette: string[];
}

export function GroupIntegration({
  eventContext,
  groupMembers,
  sharedContent,
  onShareContent,
  currentMood,
  designStyle,
  colorPalette,
}: GroupIntegrationProps) {
  const handleSharePalette = () => {
    onShareContent({
      type: "palette",
      content: `Mood: ${currentMood}, Colors: ${colorPalette.join(", ")}`,
      mood: currentMood,
      style: designStyle,
      colorPalette: colorPalette,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Event Context: {eventContext?.title || "Sarah's Birthday Bash"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
              <h4 className="font-semibold mb-2">Connected Features</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-500" />
                  <span>Mood Palettes</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span>AI Stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span>Collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>Achievements</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">
                Group Members ({groupMembers.length})
              </h4>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {groupMembers.slice(0, 5).map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {member.name?.charAt(0) || "G"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {member.name || "Group Member"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.email || "Active"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.rsvpStatus || "Going"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleSharePalette}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Current Palette with Group
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Shared Content Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {sharedContent.length === 0 ? (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No shared content yet</p>
                  <p className="text-sm text-gray-400">
                    Create and share designs, stories, or palettes with your
                    group
                  </p>
                </div>
              ) : (
                sharedContent.map((content) => (
                  <div
                    key={content.id}
                    className="p-3 border rounded-lg bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {content.type === "story" ? (
                        <BookOpen className="h-4 w-4" />
                      ) : (
                        <Palette className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm capitalize">
                        {content.type}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {content.mood}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      {content.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Shared by {content.sharedBy}</span>
                      <span>
                        {new Date(content.sharedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-green-600 dark:text-green-400 font-semibold">
                Event Connection
              </div>
              <div className="text-green-700 dark:text-green-300">✓ Active</div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">
                Group Members
              </div>
              <div className="text-blue-700 dark:text-blue-300">
                ✓ {groupMembers.length} Connected
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="text-purple-600 dark:text-purple-400 font-semibold">
                AI Features
              </div>
              <div className="text-purple-700 dark:text-purple-300">
                ✓ Enabled
              </div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
                Real-time Sync
              </div>
              <div className="text-yellow-700 dark:text-yellow-300">✓ Live</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
