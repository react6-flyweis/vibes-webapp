import React, { useState } from "react";
import { useDesignsByTabQuery } from "@/queries/communityDesigns";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Dialog } from "@/components/ui/dialog";
import CollaborationDialog from "@/components/design-community/CollaborationDialog";
import { MyDesignCard } from "@/components/design-community/MyDesignCard";
import { useAddDesignCollaboratorMutation } from "@/queries/designCollaborators";
import { useToast } from "@/hooks/use-toast";

export default function MyDesignsTab() {
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null);
  const [showCollabLocal, setShowCollabLocal] = useState(false);
  const { toast } = useToast();

  // Use the shared mutation hook that posts to /api/master/design-tabs-map/addCollaborator
  const addCollaboratorMutation = useAddDesignCollaboratorMutation({
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
  console.log("My Designs List:", myDesignsList);
  const navigate = useNavigate();

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
              <MyDesignCard
                key={design.id}
                design={design}
                onEdit={(d) => {
                  navigate(`/vibescard-studio/${d.id}`);
                }}
                onManageCollaborators={(d) => {
                  setSelectedDesign(Number(d.id));
                  setShowCollabLocal(true);
                }}
                onShare={() => {
                  /* placeholder for share action */
                }}
                onPrivacy={() => {
                  /* placeholder for privacy action */
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Collaboration dialog rendered once for the selected design */}
      <Dialog open={showCollabLocal} onOpenChange={setShowCollabLocal}>
        {selectedDesign != null && (
          <CollaborationDialog
            onSend={(payload) =>
              // map the dialog payload to the API payload shape
              addCollaboratorMutation.mutate({
                community_designs_id: Number(selectedDesign),
                // NOTE: assuming design_tabs_map_id 3 (collaborations tab) as default
                design_tabs_map_id: 3,
                email: payload.email,
                permission: payload.role,
              })
            }
            onCancel={() => setShowCollabLocal(false)}
          />
        )}
      </Dialog>
    </>
  );
}
