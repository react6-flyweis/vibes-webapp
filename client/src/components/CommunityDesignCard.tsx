import React from "react";
import {
  Heart,
  Share2,
  Download,
  Eye,
  Copy,
  MoreHorizontal,
  Flag,
  Bookmark,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

type SharedDesign = any;

type Props = {
  design: SharedDesign;
  onViewDetails: (id: string) => void;
  onCreateRemix: (id: string) => void;
};

export default function CommunityDesignCard({
  design,
  onViewDetails,
  onCreateRemix,
}: Props) {
  const likeMutation = useMutation({
    mutationFn: async (designId: string) => {
      const res = await apiRequest(`/api/designs/${designId}/like`, "POST");
      return res;
    },
    onSuccess: () => {
      toast({ title: "Design Liked", description: "Added to your favorites" });
      queryClient.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (designId: string) => {
      const res = await apiRequest(`/api/designs/${designId}/bookmark`, "POST");
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Design Bookmarked",
        description: "Saved for later reference",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (designId: string) => {
      const res = await apiRequest(`/api/designs/${designId}/share`, "POST");
      return res;
    },
    onSuccess: (data: any) => {
      try {
        void navigator.clipboard.writeText(
          data?.shareUrl ?? window.location.href
        );
      } catch (e) {
        // ignore
      }
      toast({
        title: "Share Link Created",
        description: "Design link copied to clipboard",
      });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (designId: string) => {
      const res = await apiRequest(`/api/designs/${designId}/download`, "POST");
      return res;
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Design files are being prepared",
      });
    },
  });
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLicenseIcon = (license: string) => {
    // Keep simple placeholders for the icons used in the page environment
    switch (license) {
      case "free":
        return <span className="w-3 h-3 inline-block">♥</span>;
      case "premium":
        return <span className="w-3 h-3 inline-block">★</span>;
      case "commercial":
        return <span className="w-3 h-3 inline-block">🏆</span>;
      default:
        return <span className="w-3 h-3 inline-block">♥</span>;
    }
  };

  return (
    <Card
      key={design.id}
      className="border-purple-500/20 bg-black/40 backdrop-blur-lg hover:bg-black/60 transition-all duration-300 group overflow-hidden"
    >
      <div className="relative">
        <img
          src={design.thumbnail}
          alt={design.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge
            className={`${getDifficultyColor(
              design.difficulty
            )} text-white text-xs`}
          >
            {design.difficulty}
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/60 text-white border-white/20 text-xs"
          >
            {getLicenseIcon(design.license)}
            <span className="ml-1">{design.license}</span>
          </Badge>
        </div>
        {design.isRemix && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 text-white text-xs">
              <Copy className="w-3 h-3 mr-1" />
              Remix
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg line-clamp-1">
              {design.title}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-2 mt-1">
              {design.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onViewDetails(design.id)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onCreateRemix(design.id);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Create Remix
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareMutation.mutate(design.id)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Design
              </DropdownMenuItem>

              {/* Mutations: like, bookmark, download, share */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-400">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={design.creator.avatar} />
            <AvatarFallback>{design.creator.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-gray-300 text-sm">{design.creator.name}</span>
          {design.creator.verified && (
            <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
              ✓
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {design.tags.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs text-gray-400 border-gray-600"
            >
              #{tag}
            </Badge>
          ))}
          {design.tags.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs text-gray-400 border-gray-600"
            >
              +{design.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {design.stats.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {design.stats.likes}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {design.stats.downloads}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {design.timeToComplete}min
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => likeMutation.mutate(design.id)}
            className={`flex-1 ${
              design.isLiked
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "border-gray-600 text-gray-400"
            }`}
          >
            <Heart
              className={`h-3 w-3 mr-1 ${design.isLiked ? "fill-current" : ""}`}
            />
            Like
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => bookmarkMutation.mutate(design.id)}
            className={`flex-1 ${
              design.isBookmarked
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                : "border-gray-600 text-gray-400"
            }`}
          >
            <Bookmark
              className={`h-3 w-3 mr-1 ${
                design.isBookmarked ? "fill-current" : ""
              }`}
            />
            Save
          </Button>
          <Button
            size="sm"
            onClick={() => downloadMutation.mutate(design.id)}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
