import React from "react";
import { Bookmark, Eye, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SharedDesign } from "@/types/designs";

interface Props {
  designs: SharedDesign[];
  bookmarkDesignMutation: any;
  downloadDesignMutation: any;
}

export default function BookmarksTab({
  designs,
  bookmarkDesignMutation,
  downloadDesignMutation,
}: Props) {
  const bookmarked = (designs || []).filter((d) => d.isBookmarked);

  return (
    <>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Saved Designs</h2>
        <p className="text-gray-400">Your bookmarked designs for inspiration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarked.map((design) => (
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bookmarkDesignMutation.mutate(design.id)}
                  className="bg-yellow-500/20 border-yellow-500 text-yellow-400"
                >
                  <Bookmark className="h-3 w-3 fill-current" />
                </Button>
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
                  onClick={() => downloadDesignMutation.mutate(design.id)}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
