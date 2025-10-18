import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useDesignsByTabQuery } from "@/queries/communityDesigns";

export default function CollaborationsTab() {
  // prefer designs from tabId 3 (community collaborations) when available
  const { data: tabDesigns, isLoading } = useDesignsByTabQuery(3);
  const hasData = Array.isArray(tabDesigns) && tabDesigns.length > 0;

  return (
    <>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Active Collaborations</h2>
        <p className="text-gray-400">Designs you're working on with others</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading || !tabDesigns ? (
          // render 6 skeleton cards while loading
          Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={`skeleton-${i}`}
              className="border-purple-500/20 bg-black/40 backdrop-blur-lg animate-pulse"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gray-800 rounded-sm" />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-500 text-white text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Collaboration
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-full max-w-sm" />
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gray-700" />
                  <div className="h-4 bg-gray-700 rounded w-24" />
                  <div className="h-4 bg-gray-700 rounded w-12 ml-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="h-3 bg-gray-700 rounded w-24" />
                    <div className="h-3 bg-gray-700 rounded w-8" />
                  </div>
                  <div className="h-2 bg-gray-700 rounded w-full" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gray-700 border-2 border-black" />
                    <div className="h-6 w-6 rounded-full bg-gray-700 border-2 border-black" />
                    <div className="h-6 w-6 rounded-full bg-gray-700 border-2 border-black" />
                  </div>
                  <div className="h-8 w-24 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : // not loading
        hasData ? (
          tabDesigns.map((design) => (
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
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-500 text-white text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Collaboration
                  </Badge>
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
                    by {design.creator.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {
                      design.collaboration.collaborators.find(
                        (c) => c.id === "current-user"
                      )?.role
                    }
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Team Progress</span>
                    <span className="text-white">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {design.collaboration.collaborators.map((collab) => (
                      <Avatar
                        key={collab.id}
                        className="h-6 w-6 border-2 border-black"
                      >
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>{collab.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Open Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // empty state when there are no collaborations
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card className="border-dashed border-gray-700 bg-black/30">
              <CardContent className="p-8 text-center">
                <Users className="mx-auto mb-4 text-gray-400 w-8 h-8" />
                <h3 className="text-white text-xl font-semibold">
                  No collaborations yet
                </h3>
                <p className="text-gray-400 mt-2">
                  You don't have any active collaborations. Invite teammates or
                  explore community designs to get started.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Button size="sm" variant="secondary">
                    Create Project
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
