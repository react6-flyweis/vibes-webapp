import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Star, Heart, Zap, Share2 } from "lucide-react";
import { Collaborator } from "../types";

interface CollaborationPanelProps {
  collaborators: Collaborator[];
  onAddCollaborator: (collaborator: Collaborator) => void;
  onTriggerSparkle: () => void;
}

export function CollaborationPanel({
  collaborators,
  onAddCollaborator,
  onTriggerSparkle,
}: CollaborationPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {collaborators.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active collaborators</p>
              <Button
                className="mt-4"
                onClick={() =>
                  onAddCollaborator({
                    id: Date.now(),
                    name: "Design Partner",
                    avatar: "DP",
                    status: "online",
                  })
                }
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Invite Collaborator
              </Button>
            </div>
          ) : (
            collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {collaborator.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{collaborator.name}</p>
                  <p className="text-sm text-gray-500">{collaborator.status}</p>
                </div>
                <Badge variant="default">Online</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Real-time Effects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
            <h4 className="font-semibold mb-2">Collaboration Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Real-time cursor tracking
              </li>
              <li className="flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                Live design updates
              </li>
              <li className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Collaborative reactions
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Sparkle animations
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={onTriggerSparkle}>
              <Sparkles className="h-4 w-4 mr-2" />
              Trigger Sparkle Effect
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
