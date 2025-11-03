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
import { useToast } from "@/hooks/use-toast";
import {
  useCommunityDesignLikeMutation,
  useCommunityDesignDownloadMutation,
  useCommunityDesignShareMutation,
  DownloadPayload,
} from "@/mutations/interactions";
import { useDesignTabsMapCreateMutation } from "@/mutations/useDesignTabsMapCreateMutation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DesignDetailsDialog from "@/components/design-community/DesignDetailsDialog";
import RemixDialog from "@/components/design-community/RemixDialog";
import { SharedDesign } from "@/types/designs";
import { LoadingButton } from "../ui/loading-button";

type Props = {
  design: SharedDesign;
};

// Helper to download an image given a dataURL or URL
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "design";

const downloadBlobUrl = (blobUrl: string, filename: string) => {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export function DiscoverDesignCard({ design }: Props) {
  const { toast } = useToast();

  const [showDetails, setShowDetails] = React.useState(false);
  const [showRemix, setShowRemix] = React.useState(false);
  // removed collaboration UI: manage collaborators option hidden

  // Use centralized interaction mutation for likes (mutation hook without toasts)
  const likeMutation = useCommunityDesignLikeMutation();

  // Local handler keeps UI-side effects (toasts, optimistic UI, etc.) here
  const handleLikeAction = async (designId: string) => {
    try {
      const payload = {
        community_designs_id: designId,
        status: true,
      };
      await likeMutation.mutateAsync(payload);
      toast({ title: "Design Liked", description: "Added to your favorites" });
      queryClient.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
    } catch (err: any) {
      toast({
        title: "Like Failed",
        description: err?.message || "Unable to like design",
        variant: "destructive",
      });
    }
  };

  const downloadMutation = useCommunityDesignDownloadMutation();

  // Use dedicated mutation hook for creating a design-tabs-map entry
  const bookmarkMutation = useDesignTabsMapCreateMutation();

  const shareMutation = useCommunityDesignShareMutation();

  // Local share handler: copies a predictable client URL to clipboard and shows a toast.
  const handleShare = async (designId: string) => {
    const sharePath = `/collaborative-design-sharing/${designId}`;
    const shareUrl = `${window.location.origin}${sharePath}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Share Link Copied",
        description: shareUrl,
      });
    } catch (err) {
      console.error("Clipboard write failed:", err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      });
    }

    // Fire-and-forget server record (optional analytics)
    try {
      void shareMutation.mutate({
        community_designs_id: designId,
        status: true,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDownload = async () => {
    const filename = `${slugify(design.title || "design")}.png`;

    // Prefer explicit image attribute; fall back to previewImages[0], then thumbnail
    const src = design.previewImages?.[0] || design.thumbnail;
    if (!src) {
      toast({
        title: "Download Failed",
        description: "No image available to download",
        variant: "destructive",
      });
      return;
    }

    try {
      if (typeof src === "string" && src.startsWith("data:")) {
        // data URL - download directly
        downloadBlobUrl(src, filename);
        // track download
        void downloadMutation
          .mutateAsync({
            community_designs_id: design.id,
            status: true,
          } as DownloadPayload)
          .catch(() => {});
        return;
      }

      // Otherwise, fetch the image and create a blob URL
      const resp = await fetch(src, { mode: "cors" });
      if (!resp.ok) throw new Error(`Failed to fetch image (${resp.status})`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      try {
        downloadBlobUrl(url, filename);
        // track download (fire-and-forget)
        void downloadMutation
          .mutateAsync({
            community_designs_id: design.id,
            status: true,
          } as DownloadPayload)
          .catch(() => {});
      } finally {
        // revoke after short delay to ensure download started
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) {
      console.error("Download error:", err);
      toast({
        title: "Download Failed",
        description: (err as any)?.message || "Unable to download image",
        variant: "destructive",
      });
    }
  };

  // Remix mutation (create remix based on this design)
  const remixMutation = useMutation({
    mutationFn: async (data: {
      designId: string;
      title: string;
      description: string;
      remixType: string;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/designs/${data.designId}/remix`,
        data
      );
      return res;
    },
    onSuccess: (data: any) => {
      toast({
        title: "Remix Created Successfully",
        description: `Your remix "${data.title}" is available in your designs`,
      });
      setShowRemix(false);
      queryClient.invalidateQueries({ queryKey: ["/api/designs/my-designs"] });
      if (data?.id) {
        window.open(`/design-editor/${data.id}`, "_blank");
      }
    },
    onError: () => {
      toast({
        title: "Remix Creation Failed",
        description: "Unable to create remix. Please try again.",
        variant: "destructive",
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
    <>
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
                <DropdownMenuItem onClick={() => setShowDetails(true)}>
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowRemix(true)}>
                  <Copy className="w-4 h-4 mr-2" /> Create Remix
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleShare(design.id.toString())}
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share Design
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-400">
                  <Flag className="w-4 h-4 mr-2" /> Report
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
              onClick={() => handleLikeAction(design.id.toString())}
              className={`flex-1 ${
                design.isLiked
                  ? "bg-red-500/20 border-red-500 text-red-400"
                  : "border-gray-600 text-gray-400"
              }`}
            >
              <Heart
                className={`h-3 w-3 mr-1 ${
                  design.isLiked ? "fill-current" : ""
                }`}
              />
              Like
            </Button>
            <LoadingButton
              isLoading={bookmarkMutation.isPending}
              size="sm"
              variant="outline"
              onClick={() =>
                bookmarkMutation.mutate(
                  {
                    tabs_id: 4,
                    community_designs_id: design.id,
                    status: true,
                  },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Design Bookmarked",
                        description: "Saved for later reference",
                      });
                    },
                    onError: (err: any) => {
                      toast({
                        title: "Bookmark Failed",
                        description: err?.message || "Unable to save design",
                        variant: "destructive",
                      });
                    },
                  }
                )
              }
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
            </LoadingButton>
            <Button
              size="sm"
              onClick={() => handleDownload()}
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-4xl">
          <DesignDetailsDialog
            design={design}
            onLike={() => handleLikeAction(design.id.toString())}
            onDownload={() => handleDownload()}
            onOpenRemix={() => setShowRemix(true)}
            onShare={() => handleShare(design.id.toString())}
          />
        </DialogContent>
      </Dialog>

      {/* Remix Dialog */}
      <Dialog open={showRemix} onOpenChange={setShowRemix}>
        <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-lg">
          <RemixDialog
            onCreate={(payload) =>
              remixMutation.mutate({
                designId: design.id.toString(),
                ...payload,
              })
            }
            onCancel={() => setShowRemix(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Collaboration UI removed */}
    </>
  );
}
