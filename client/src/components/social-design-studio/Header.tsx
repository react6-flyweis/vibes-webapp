import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2 } from "lucide-react";

export default function SDSHeader({
  commentsCount,
  onToggleComments,
  onShare,
}: {
  commentsCount: number;
  onToggleComments: () => void;
  onShare: () => void;
}) {
  return (
    <div className="bg-[#192133] shadow-xs ">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Social Design Studio
            </h1>
            <p className="text-white">
              Create, collaborate, and share stunning social media designs
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/*
            <Button variant="outline" onClick={onToggleComments}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Comments ({commentsCount})
            </Button>
            */}
            <Button onClick={onShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Design
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
