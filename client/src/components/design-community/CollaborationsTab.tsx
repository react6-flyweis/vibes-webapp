import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { SharedDesign } from "@/types/designs";

interface Props {
  collaborationsList: SharedDesign[];
}

export default function CollaborationsTab({ collaborationsList }: Props) {
  return (
    <>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Active Collaborations</h2>
        <p className="text-gray-400">Designs you're working on with others</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborationsList.map((design) => (
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
        ))}
      </div>
    </>
  );
}
