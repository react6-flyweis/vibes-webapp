import React from "react";
import { Plus, MoreHorizontal, Edit3, Users, Share2, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { SharedDesign } from "@/types/designs";

interface Props {
  myDesignsList: SharedDesign[];
  setSelectedDesign: (id: string | null) => void;
  setShowCollabDialog: (v: boolean) => void;
  shareDesignMutation: any;
}

export default function MyDesignsTab({
  myDesignsList,
  setSelectedDesign,
  setShowCollabDialog,
  shareDesignMutation,
}: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Design Portfolio</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Design
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDesignsList.map((design) => (
          <Card
            key={design.id}
            className="border-purple-500/20 bg-black/40 backdrop-blur-lg"
          >
            <div className="relative">
              <img
                src={design.thumbnail}
                alt={design.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-black/60 border-white/20"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Design
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDesign(design.id);
                        setShowCollabDialog(true);
                      }}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Manage Collaborators
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => shareDesignMutation.mutate(design.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Lock className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {design.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {design.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{new Date(design.updatedAt).toLocaleDateString()}</span>
                <Badge variant="outline" className="text-xs">
                  {design.visibility}
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-sm text-gray-400">
                <div>
                  <div className="text-white font-medium">
                    {design.stats.views}
                  </div>
                  <div className="text-xs">Views</div>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {design.stats.likes}
                  </div>
                  <div className="text-xs">Likes</div>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {design.stats.downloads}
                  </div>
                  <div className="text-xs">Downloads</div>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {design.stats.remixes}
                  </div>
                  <div className="text-xs">Remixes</div>
                </div>
              </div>

              {design.collaboration.isCollaborative && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Users className="h-3 w-3" />
                    <span>
                      Collaborators ({design.collaboration.collaborators.length}
                      )
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {design.collaboration.collaborators
                      .slice(0, 3)
                      .map((collab) => (
                        <Avatar
                          key={collab.id}
                          className="h-6 w-6 border-2 border-black"
                        >
                          <AvatarImage src={collab.avatar} />
                          <AvatarFallback>{collab.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    {design.collaboration.collaborators.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-gray-600 border-2 border-black flex items-center justify-center text-xs text-white">
                        +{design.collaboration.collaborators.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
