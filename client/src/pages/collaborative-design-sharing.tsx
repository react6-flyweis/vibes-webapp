import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Heart,
  Share2,
  Users,
  Star,
  Palette,
  Globe,
  Bookmark,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { CollaborationInvite } from "@/types/designs";

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
      colors: [],
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

  // const { data: sharedDesigns } = useQuery({
  //   queryKey: ["/api/designs/shared", selectedCategory, sortBy, searchQuery],
  //   refetchInterval: 30000,
  // });

  // const { data: myDesigns } = useQuery({
  //   queryKey: ["/api/designs/my-designs"],
  //   refetchInterval: 30000,
  // });

  // const { data: collaborations } = useQuery({
  //   queryKey: ["/api/designs/collaborations"],
  //   refetchInterval: 30000,
  // });

  // const { data: designComments } = useQuery({
  //   queryKey: ["/api/designs/comments", selectedDesign],
  //   enabled: !!selectedDesign,
  //   refetchInterval: 15000,
  // });

  // const { data: pendingInvites } = useQuery({
  //   queryKey: ["/api/designs/invites"],
  //   refetchInterval: 30000,
  // });

  // const likeDesignMutation = useMutation({
  //   mutationFn: async (designId: string) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${designId}/like`
  //     );
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Design Liked",
  //       description: "Added to your favorites",
  //     });
  //   },
  // });

  // const bookmarkDesignMutation = useMutation({
  //   mutationFn: async (designId: string) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${designId}/bookmark`
  //     );
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Design Bookmarked",
  //       description: "Saved for later reference",
  //     });
  //   },
  // });

  // const downloadDesignMutation = useMutation({
  //   mutationFn: async (designId: string) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${designId}/download`
  //     );
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Download Started",
  //       description: "Design files are being prepared",
  //     });
  //   },
  // });

  // const remixDesignMutation = useMutation({
  //   mutationFn: async (data: {
  //     designId: string;
  //     title: string;
  //     description: string;
  //     remixType: "full" | "partial" | "inspired";
  //     modifications?: {
  //       colors?: string[];
  //       elements?: any[];
  //       layout?: any;
  //       customizations?: any;
  //     };
  //   }) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${data.designId}/remix`,
  //       data
  //     );
  //     return response.json();
  //   },
  //   onSuccess: (data) => {
  //     toast({
  //       title: "Remix Created Successfully",
  //       description: `Your remix "${data.title}" is now available in your designs`,
  //     });
  //     setShowRemixDialog(false);
  //     // Invalidate queries to refresh data
  //     queryClient.invalidateQueries({ queryKey: ["/api/designs/my-designs"] });
  //     // Open the remix in design editor
  //     window.open(`/design-editor/${data.id}`, "_blank");
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Remix Creation Failed",
  //       description: "Unable to create remix. Please try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const shareDesignMutation = useMutation({
  //   mutationFn: async (designId: string) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${designId}/share`
  //     );
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast({
  //       title: "Share Link Created",
  //       description: "Design link copied to clipboard",
  //     });
  //   },
  // });

  // // Comment creation is handled inside DesignDetailsDialog now.

  // const inviteCollaboratorMutation = useMutation({
  //   mutationFn: async (data: {
  //     designId: string;
  //     email: string;
  //     role: string;
  //   }) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/${data.designId}/invite`,
  //       data
  //     );
  //     return response.json();
  //   },
  //   onSuccess: (data) => {
  //     toast({
  //       title: "Invitation Sent",
  //       description: `Collaborator invitation sent to ${
  //         data.invitation?.inviteeEmail || "the specified email"
  //       }`,
  //     });
  //     setShowCollabDialog(false);
  //     // Refresh collaboration data
  //     queryClient.invalidateQueries({ queryKey: ["/api/designs/invites"] });
  //     queryClient.invalidateQueries({
  //       queryKey: ["/api/designs/collaborations"],
  //     });
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Invitation Failed",
  //       description:
  //         "Unable to send collaboration invitation. Please check the email address and try again.",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const handleInviteResponse = useMutation({
  //   mutationFn: async (data: {
  //     inviteId: string;
  //     action: "accept" | "decline";
  //   }) => {
  //     const response = await apiRequest(
  //       "POST",
  //       `/api/designs/invites/${data.inviteId}/respond`,
  //       data
  //     );
  //     return response.json();
  //   },
  //   onSuccess: (_, variables) => {
  //     toast({
  //       title:
  //         variables.action === "accept"
  //           ? "Invitation Accepted"
  //           : "Invitation Declined",
  //       description:
  //         variables.action === "accept"
  //           ? "You can now collaborate on this design"
  //           : "Invitation declined",
  //     });
  //   },
  // });

  // const myDesignsList: SharedDesign[] = myDesigns || [
  //   {
  //     id: "my-design-birthday",
  //     title: "Retro Birthday Bash",
  //     description:
  //       "80s-inspired birthday party invitation with neon colors and retro typography.",
  //     creator: {
  //       id: "current-user",
  //       name: "You",
  //       avatar:
  //         "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  //       verified: false,
  //       followers: 45,
  //     },
  //     category: "invitation",
  //     tags: ["birthday", "retro", "80s", "neon"],
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400",
  //     previewImages: [
  //       "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
  //     ],
  //     createdAt: "2025-01-20T12:00:00Z",
  //     updatedAt: "2025-01-24T08:30:00Z",
  //     stats: {
  //       views: 234,
  //       likes: 18,
  //       downloads: 7,
  //       remixes: 2,
  //       shares: 5,
  //     },
  //     isLiked: false,
  //     isBookmarked: false,
  //     visibility: "public",
  //     license: "free",
  //     difficulty: "beginner",
  //     timeToComplete: 25,
  //     tools: ["Canva"],
  //     colors: ["#ff0099", "#00ff99", "#9900ff", "#ffff00"],
  //     isRemix: false,
  //     collaboration: {
  //       isCollaborative: true,
  //       collaborators: [
  //         {
  //           id: "current-user",
  //           name: "You",
  //           avatar:
  //             "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  //           role: "owner",
  //         },
  //         {
  //           id: "friend-jenny",
  //           name: "Jenny Wilson",
  //           avatar:
  //             "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
  //           role: "editor",
  //         },
  //       ],
  //       inviteCode: "RETRO80S",
  //     },
  //   },
  // ];

  // const collaborationsList: SharedDesign[] = collaborations || [
  //   {
  //     id: "collab-design-gala",
  //     title: "Charity Gala Invitation",
  //     description:
  //       "Sophisticated invitation design for charity fundraising events.",
  //     creator: {
  //       id: "creator-david",
  //       name: "David Park",
  //       avatar:
  //         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  //       verified: true,
  //       followers: 567,
  //     },
  //     category: "invitation",
  //     tags: ["charity", "gala", "formal", "elegant"],
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
  //     previewImages: [
  //       "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  //     ],
  //     createdAt: "2025-01-21T09:15:00Z",
  //     updatedAt: "2025-01-24T14:20:00Z",
  //     stats: {
  //       views: 892,
  //       likes: 76,
  //       downloads: 23,
  //       remixes: 5,
  //       shares: 12,
  //     },
  //     isLiked: false,
  //     isBookmarked: true,
  //     visibility: "unlisted",
  //     license: "free",
  //     difficulty: "intermediate",
  //     timeToComplete: 40,
  //     tools: ["InDesign", "Photoshop"],
  //     colors: ["#1a1a1a", "#ffffff", "#d4af37", "#8b0000"],
  //     isRemix: false,
  //     collaboration: {
  //       isCollaborative: true,
  //       collaborators: [
  //         {
  //           id: "creator-david",
  //           name: "David Park",
  //           avatar:
  //             "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  //           role: "owner",
  //         },
  //         {
  //           id: "current-user",
  //           name: "You",
  //           avatar:
  //             "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
  //           role: "editor",
  //         },
  //         {
  //           id: "collab-lisa",
  //           name: "Lisa Chen",
  //           avatar:
  //             "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  //           role: "viewer",
  //         },
  //       ],
  //       inviteCode: "GALA2025",
  //     },
  //   },
  // ];

  // const comments: DesignComment[] = designComments || [
  //   {
  //     id: "comment-1",
  //     designId: "design-neon-nights",
  //     author: {
  //       id: "user-sarah",
  //       name: "Sarah Kim",
  //       avatar:
  //         "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
  //     },
  //     content:
  //       "Absolutely love the color palette! The neon effects are perfectly executed. This would be perfect for our upcoming EDM event.",
  //     createdAt: "2025-01-24T14:30:00Z",
  //     likes: 12,
  //     isLiked: false,
  //   },
  //   {
  //     id: "comment-2",
  //     designId: "design-neon-nights",
  //     author: {
  //       id: "user-tom",
  //       name: "Tom Wilson",
  //       avatar:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
  //     },
  //     content:
  //       "Great work! Could you share how you achieved the glow effect on the text?",
  //     createdAt: "2025-01-24T12:15:00Z",
  //     likes: 8,
  //     isLiked: true,
  //   },
  // ];

  // const invites: CollaborationInvite[] = pendingInvites || [
  //   {
  //     id: "invite-1",
  //     designId: "design-corporate-event",
  //     designTitle: "Corporate Event Branding Package",
  //     inviterName: "Jennifer Lopez",
  //     inviterAvatar:
  //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
  //     role: "editor",
  //     expiresAt: "2025-01-30T23:59:59Z",
  //     status: "pending",
  //   },
  //   {
  //     id: "invite-2",
  //     designId: "design-music-festival",
  //     designTitle: "Music Festival Visual Identity",
  //     inviterName: "Chris Taylor",
  //     inviterAvatar:
  //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  //     role: "viewer",
  //     expiresAt: "2025-01-28T23:59:59Z",
  //     status: "pending",
  //   },
  // ];

  const invites: CollaborationInvite[] = [];

  // Bookmark mutation isn't implemented in this build; provide a harmless stub
  const bookmarkDesignMutation = { mutate: (id: string) => {} };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

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
    switch (license) {
      case "free":
        return <Heart className="w-3 h-3" />;
      case "premium":
        return <Star className="w-3 h-3" />;
      case "commercial":
        return <Award className="w-3 h-3" />;
      default:
        return <Heart className="w-3 h-3" />;
    }
  };

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
        {invites.length > 0 && (
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
        )}

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
