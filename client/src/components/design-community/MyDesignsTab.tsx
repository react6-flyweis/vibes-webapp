import React, { useState } from "react";
import { useDesignsByTabQuery } from "@/queries/communityDesigns";
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
import { Link } from "react-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CollaborationDialog from "@/components/design-community/CollaborationDialog";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Props {
  // kept for backward compatibility; not required
  setShowCollabDialog?: (v: boolean) => void;
}

export default function MyDesignsTab({ setShowCollabDialog }: Props) {
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [showCollabLocal, setShowCollabLocal] = useState(false);
  const { toast } = useToast();

  const inviteCollaboratorMutation = useMutation({
    mutationFn: async (payload: {
      designId: string;
      email: string;
      role: string;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/designs/${payload.designId}/invite`,
        payload
      );
      return res;
    },
    onSuccess: () => {
      toast({ title: "Invitation Sent", description: "Collaborator invited" });
      setShowCollabLocal(false);
    },
    onError: () => {
      toast({
        title: "Invitation Failed",
        description: "Unable to send invitation",
        variant: "destructive",
      });
    },
  });

  // fetch shared designs for tab id 2
  const { data: myDesignsList, isLoading, isError } = useDesignsByTabQuery(2);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Design Portfolio</h2>
        <Link to="/vibescard-studio">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Design
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading ? (
          // Skeleton loading grid: 6 placeholder cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={`skeleton-${i}`}
                className="border-purple-500/20 bg-black/30 backdrop-blur-lg animate-pulse"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gray-700/40" />
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="h-5 bg-gray-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-600 rounded w-full" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="h-3 bg-gray-600 rounded w-20" />
                    <div className="h-4 bg-gray-600 rounded w-16" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-sm text-gray-400">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx}>
                        <div className="h-5 bg-gray-600 rounded w-8 mx-auto" />
                        <div className="h-3 bg-gray-600 rounded w-12 mx-auto mt-1" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="h-3 w-3 rounded-full bg-gray-600" />
                      <div className="h-3 bg-gray-600 rounded w-24" />
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full bg-gray-600 border-2 border-black" />
                      <div className="h-6 w-6 rounded-full bg-gray-600 border-2 border-black" />
                      <div className="h-6 w-6 rounded-full bg-gray-600 border-2 border-black" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-400">Failed to load designs.</div>
        ) : myDesignsList?.length === 0 ? (
          <div className="text-gray-400">No designs found for this tab.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDesignsList?.map((design) => (
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
                    {showCollabLocal && selectedDesign && (
                      <Dialog
                        open={showCollabLocal}
                        onOpenChange={setShowCollabLocal}
                      >
                        <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-lg">
                          <CollaborationDialog
                            onSend={(payload) =>
                              inviteCollaboratorMutation.mutate({
                                designId: design.id.toString(),
                                email: payload.email,
                                role: payload.role,
                              })
                            }
                            onCancel={() => setShowCollabLocal(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
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
                            setShowCollabLocal(true);
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Manage Collaborators
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        // onClick={() => shareDesignMutation.mutate(design.id)}
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
                    <span>
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </span>
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
                          Collaborators (
                          {design.collaboration.collaborators.length})
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
        )}
      </div>
    </>
  );
}
