import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { Share2, Users, Palette, Globe, Bookmark } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  useCommunityDesignLikeMutation,
  useCommunityDesignDownloadMutation,
  DownloadPayload,
} from "@/mutations/interactions";
import RemixDialog from "@/components/design-community/RemixDialog";
import { useCommunityDesignByIdQuery } from "@/queries/communityDesigns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DesignDetailsDialog from "@/components/design-community/DesignDetailsDialog";
import type { SharedDesign } from "@/types/designs";

// Tabs (extracted)
import DiscoverTab from "@/components/design-community/DiscoverTab";
import MyDesignsTab from "@/components/design-community/MyDesignsTab";
import CollaborationsTab from "@/components/design-community/CollaborationsTab";
import BookmarksTab from "@/components/design-community/BookmarksTab";

export default function CollaborativeDesignSharing() {
  const [selectedTab, setSelectedTab] = useState("discover");
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  // Dialogs are now managed inside individual cards/tabs

  const { toast } = useToast();

  // If an id is present in the URL, fetch that community design and open details dialog
  const {
    data: designResp,
    isLoading: isDesignLoading,
    isError: isDesignError,
    error: designError,
  } = useCommunityDesignByIdQuery(id);

  // The query returns the raw API shape; try to map to SharedDesign if present
  const selectedDesign: SharedDesign | null = useMemo(() => {
    if (!designResp || !designResp.community_designs_id) return null;
    // Reuse mapping logic lightly here to match DiscoverDesignCard/DesignDetailsDialog expectations
    const extractColorsFromResp = (): string[] => {
      try {
        // design_json_data may be a JSON string saved from the editor which includes colorScheme
        const raw = (designResp as any)?.design_json_data;
        if (!raw) {
          // fallback: some templates may include a top-level palette
          if (Array.isArray((designResp as any)?.palette)) {
            return (designResp as any).palette as string[];
          }
          return [];
        }

        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;

        // If the saved JSON uses a colorScheme object, extract common fields
        if (parsed?.colorScheme) {
          const cs = parsed.colorScheme as any;
          const out: string[] = [];
          if (cs.primary) out.push(cs.primary);
          if (cs.secondary) out.push(cs.secondary);
          if (cs.accent) out.push(cs.accent);
          if (cs.background) out.push(cs.background);
          // remove duplicates and falsy
          return Array.from(new Set(out.filter(Boolean)));
        }

        // If template exported a palette array
        if (Array.isArray(parsed?.palette)) return parsed.palette;

        return [];
      } catch (err) {
        // parsing failed
        return [];
      }
    };

    return {
      id: designResp.community_designs_id,
      title: designResp.title ?? "",
      description: designResp.sub_title ?? "",
      creator: {
        id:
          typeof designResp.created_by === "number"
            ? String(designResp.created_by)
            : (designResp.created_by as any)?.user_id ??
              (designResp.created_by as any)?._id ??
              "0",
        name:
          typeof designResp.created_by === "number"
            ? "Unknown"
            : (designResp.created_by as any)?.name ?? "Unknown",
        avatar:
          typeof designResp.created_by === "number"
            ? ""
            : (designResp.created_by as any)?.avatar ?? "",
        verified: false,
        followers: 0,
      },
      category: "invitation",
      tags: designResp.hash_tag ?? [],
      thumbnail: designResp.image ?? "",
      previewImages: designResp.image ? [designResp.image] : [],
      createdAt: designResp.created_at ?? new Date().toISOString(),
      updatedAt: designResp.updated_at ?? new Date().toISOString(),
      stats: {
        views: designResp.views ?? 0,
        likes: designResp.likes ?? 0,
        downloads: designResp.downloads ?? 0,
        remixes: designResp.remixes ?? 0,
        shares: designResp.share ?? 0,
      },
      isLiked: false,
      isBookmarked: false,
      visibility: designResp.status ? "public" : "unlisted",
      license: (designResp.image_sell_type as any) ?? "free",
      difficulty: ((designResp.image_type || "beginner") as any) ?? "beginner",
      timeToComplete: 0,
      tools: [],
      colors: extractColorsFromResp(),
      isRemix: false,
      collaboration: {
        isCollaborative: false,
        collaborators: [],
      },
    } as SharedDesign;
  }, [designResp]);

  const [showDetailsOpen, setShowDetailsOpen] = useState<boolean>(Boolean(id));

  // Keep dialog open state in sync with route id
  React.useEffect(() => {
    setShowDetailsOpen(Boolean(id));
  }, [id]);

  // Apply template palette (colors) to root CSS variables when a design is selected.
  React.useEffect(() => {
    const root =
      typeof document !== "undefined" ? document.documentElement : null;
    if (!root) return;

    const applyPalette = (colors?: string[]) => {
      // we support up to 4 palette colors; map them to CSS variables
      const keys = [
        "--design-color-0",
        "--design-color-1",
        "--design-color-2",
        "--design-color-3",
      ];
      // clear all first
      keys.forEach((k) => root.style.removeProperty(k));
      if (!colors || colors.length === 0) return;
      colors.slice(0, 4).forEach((color, idx) => {
        if (color) root.style.setProperty(keys[idx], color);
      });
    };

    applyPalette(selectedDesign?.colors);
  }, [selectedDesign]);

  const handleCloseDetails = () => {
    setShowDetailsOpen(false);
    // navigate back to the base path without id
    navigate("/collaborative-design-sharing");
  };

  // Interaction mutations and handlers (reused from DiscoverDesignCard)
  const likeMutation = useCommunityDesignLikeMutation();
  const downloadMutation = useCommunityDesignDownloadMutation();

  const [showRemix, setShowRemix] = useState(false);

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

  const handleDownload = async (design: SharedDesign) => {
    const filename = `${slugify(design.title || "design")}.png`;

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
        downloadBlobUrl(src, filename);
        void downloadMutation
          .mutateAsync({
            community_designs_id: design.id,
            status: true,
          } as DownloadPayload)
          .catch(() => {});
        return;
      }

      const resp = await fetch(src, { mode: "cors" });
      if (!resp.ok) throw new Error(`Failed to fetch image (${resp.status})`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      try {
        downloadBlobUrl(url, filename);
        void downloadMutation
          .mutateAsync({
            community_designs_id: design.id,
            status: true,
          } as DownloadPayload)
          .catch(() => {});
      } finally {
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

  // const formatTimeAgo = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffInHours = Math.floor(
  //     (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  //   );

  //   if (diffInHours < 1) return "Just now";
  //   if (diffInHours < 24) return `${diffInHours}h ago`;
  //   const diffInDays = Math.floor(diffInHours / 24);
  //   if (diffInDays < 7) return `${diffInDays}d ago`;
  //   return date.toLocaleDateString();
  // };

  // const getDifficultyColor = (difficulty: string) => {
  //   switch (difficulty) {
  //     case "beginner":
  //       return "bg-green-500";
  //     case "intermediate":
  //       return "bg-yellow-500";
  //     case "advanced":
  //       return "bg-red-500";
  //     default:
  //       return "bg-gray-500";
  //   }
  // };

  // const getLicenseIcon = (license: string) => {
  //   switch (license) {
  //     case "free":
  //       return <Heart className="w-3 h-3" />;
  //     case "premium":
  //       return <Star className="w-3 h-3" />;
  //     case "commercial":
  //       return <Award className="w-3 h-3" />;
  //     default:
  //       return <Heart className="w-3 h-3" />;
  //   }
  // };

  // Inline tab components moved to separate files in ./tabs/

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <Share2 className="h-8 w-8 text-violet-400" />
            <h1 className="text-4xl font-bold text-white">Design Community</h1>
            <Palette className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Share your creative designs, collaborate with others, and remix
            amazing templates from our global community
          </p>
        </div>

        {/* Pending Invitations Alert */}
        {/* {invites.length > 0 && (
          <Card className="border-blue-500/20 bg-blue-500/10 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Collaboration Invitations ({invites.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={invite.inviterAvatar} />
                      <AvatarFallback>{invite.inviterName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-medium">
                        {invite.inviterName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        invited you to collaborate on "{invite.designTitle}"
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {invite.role}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Expires {formatTimeAgo(invite.expiresAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      // onClick={() =>
                      //   handleInviteResponse.mutate({
                      //     inviteId: invite.id,
                      //     action: "accept",
                      //   })
                      // }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      // onClick={() =>
                      //   handleInviteResponse.mutate({
                      //     inviteId: invite.id,
                      //     action: "decline",
                      //   })
                      // }
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )} */}

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/20">
            <TabsTrigger
              value="discover"
              className="data-[state=active]:bg-violet-600"
            >
              <Globe className="h-4 w-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="my-designs"
              className="data-[state=active]:bg-purple-600"
            >
              <Palette className="h-4 w-4 mr-2" />
              My Designs
            </TabsTrigger>
            <TabsTrigger
              value="collaborations"
              className="data-[state=active]:bg-indigo-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Collaborations
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-pink-600"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <DiscoverTab />
          </TabsContent>

          <TabsContent value="my-designs" className="space-y-6">
            <MyDesignsTab />
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <CollaborationsTab />
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <BookmarksTab />
          </TabsContent>
        </Tabs>

        {/* Open details dialog when route contains an id */}
        <Dialog
          open={showDetailsOpen}
          onOpenChange={(open) => !open && handleCloseDetails()}
        >
          <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-4xl">
            {isDesignLoading ? (
              <div className="p-6">Loading...</div>
            ) : isDesignError || !selectedDesign ? (
              <div className="p-6">
                Error loading design:{" "}
                {(designError as any)?.message ?? "Not found"}
              </div>
            ) : (
              <>
                <DesignDetailsDialog
                  design={selectedDesign}
                  onLike={() => handleLikeAction(String(selectedDesign.id))}
                  onDownload={() => handleDownload(selectedDesign)}
                  onOpenRemix={() => setShowRemix(true)}
                  onShare={() =>
                    shareMutation.mutate(String(selectedDesign.id))
                  }
                />

                {/* Remix dialog (opened from details) */}
                <Dialog open={showRemix} onOpenChange={setShowRemix}>
                  <DialogContent className="bg-black/90 border-purple-500/20 text-white max-w-lg">
                    <RemixDialog
                      onCreate={(payload) =>
                        remixMutation.mutate({
                          designId: String(selectedDesign.id),
                          ...payload,
                        })
                      }
                      onCancel={() => setShowRemix(false)}
                    />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Design Details Modal */}
        {/* Design Details Modal is now handled within individual cards/tabs */}

        {/* Remix & Collaboration dialogs are handled within individual cards/tabs */}
      </div>
    </div>
  );
}
