import React from "react";
import { Bookmark, Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDesignsByTabQuery } from "@/queries/communityDesigns";
import { useDeleteDesignTabsMapMutation } from "@/mutations/useDeleteDesignTabsMapMutation";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "../ui/loading-button";

export default function BookmarksTab() {
  const { data: designs, isLoading } = useDesignsByTabQuery(4);
  const { toast } = useToast();
  const deleteMutation = useDeleteDesignTabsMapMutation();

  return (
    <>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Saved Designs</h2>
        <p className="text-gray-400">Your bookmarked designs for inspiration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || !designs ? (
          // render 6 skeleton cards while loading
          Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={`skeleton-${i}`}
              className="border-purple-500/20 bg-black/40 backdrop-blur-lg animate-pulse"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gray-800 rounded-sm" />
                <div className="absolute top-2 right-2">
                  <div className="h-8 w-8 rounded bg-yellow-600/30" />
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="h-5 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full max-w-sm mt-2" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-700" />
                  <div className="h-4 bg-gray-700 rounded w-24" />
                </div>

                <div className="flex gap-2">
                  <div className="h-8 bg-gray-700 rounded flex-1" />
                  <div className="h-8 bg-gray-700 rounded flex-1" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : designs.length > 0 ? (
          designs.map((design) => (
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
                  <LoadingButton
                    size="sm"
                    variant="outline"
                    className="bg-yellow-500/20 border-yellow-500 text-yellow-400"
                    isLoading={deleteMutation.isPending}
                    onClick={() => {
                      // If a design_tabs_map_id exists, remove it
                      console.log("Design raw data:", design);
                      if ((design as any).raw.design_tabs_map_id) {
                        deleteMutation.mutate(design.raw.design_tabs_map_id, {
                          onSuccess: () => {
                            toast({
                              title: "Bookmark Removed",
                              description:
                                "Design removed from your saved list",
                            });
                          },
                          onError: (err: any) => {
                            toast({
                              title: "Remove Failed",
                              description:
                                err?.message || "Unable to remove bookmark",
                              variant: "destructive",
                            });
                          },
                        });
                      }
                    }}
                  >
                    <Bookmark className="h-3 w-3 fill-current" />
                  </LoadingButton>
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

                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={design.creator.avatar} />
                    <AvatarFallback>{design.creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-gray-300 text-sm">
                    {design.creator.name}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="border-dashed border-gray-700 bg-black/30">
              <CardContent className="p-8 text-center">
                <Bookmark className="mx-auto mb-4 text-gray-400 w-8 h-8" />
                <h3 className="text-white text-xl font-semibold">
                  No bookmarks yet
                </h3>
                <p className="text-gray-400 mt-2">
                  You haven't saved any designs. Browse community designs to
                  find inspiration.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary">
                    Explore Designs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
