import { useState } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DesignDetailsDialog from "@/components/design-community/DesignDetailsDialog";
import RemixDialog from "@/components/design-community/RemixDialog";
import CollaborationDialog from "@/components/design-community/CollaborationDialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SharedDesign, CollaborationInvite } from "@/types/designs";

// Tabs (extracted)
import DiscoverTab from "@/components/design-community/DiscoverTab";
import MyDesignsTab from "@/components/design-community/MyDesignsTab";
import CollaborationsTab from "@/components/design-community/CollaborationsTab";
import BookmarksTab from "@/components/design-community/BookmarksTab";

export default function CollaborativeDesignSharing() {
  const [selectedTab, setSelectedTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  // const [showShareDialog, setShowShareDialog] = useState(false);
  const [showRemixDialog, setShowRemixDialog] = useState(false);
  const [showCollabDialog, setShowCollabDialog] = useState(false);

  const { toast } = useToast();

  const { data: sharedDesigns } = useQuery({
    queryKey: ["/api/designs/shared", selectedCategory, sortBy, searchQuery],
    refetchInterval: 30000,
  });

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

  const likeDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${designId}/like`
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Design Liked",
        description: "Added to your favorites",
      });
    },
  });

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

  const downloadDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${designId}/download`
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Design files are being prepared",
      });
    },
  });

  const remixDesignMutation = useMutation({
    mutationFn: async (data: {
      designId: string;
      title: string;
      description: string;
      remixType: "full" | "partial" | "inspired";
      modifications?: {
        colors?: string[];
        elements?: any[];
        layout?: any;
        customizations?: any;
      };
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${data.designId}/remix`,
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Remix Created Successfully",
        description: `Your remix "${data.title}" is now available in your designs`,
      });
      setShowRemixDialog(false);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/designs/my-designs"] });
      // Open the remix in design editor
      window.open(`/design-editor/${data.id}`, "_blank");
    },
    onError: (error) => {
      toast({
        title: "Remix Creation Failed",
        description: "Unable to create remix. Please try again.",
        variant: "destructive",
      });
    },
  });

  const shareDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${designId}/share`
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Share Link Created",
        description: "Design link copied to clipboard",
      });
    },
  });

  // Comment creation is handled inside DesignDetailsDialog now.

  const inviteCollaboratorMutation = useMutation({
    mutationFn: async (data: {
      designId: string;
      email: string;
      role: string;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${data.designId}/invite`,
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Invitation Sent",
        description: `Collaborator invitation sent to ${
          data.invitation?.inviteeEmail || "the specified email"
        }`,
      });
      setShowCollabDialog(false);
      // Refresh collaboration data
      queryClient.invalidateQueries({ queryKey: ["/api/designs/invites"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/designs/collaborations"],
      });
    },
    onError: (error) => {
      toast({
        title: "Invitation Failed",
        description:
          "Unable to send collaboration invitation. Please check the email address and try again.",
        variant: "destructive",
      });
    },
  });

  const handleInviteResponse = useMutation({
    mutationFn: async (data: {
      inviteId: string;
      action: "accept" | "decline";
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/invites/${data.inviteId}/respond`,
        data
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title:
          variables.action === "accept"
            ? "Invitation Accepted"
            : "Invitation Declined",
        description:
          variables.action === "accept"
            ? "You can now collaborate on this design"
            : "Invitation declined",
      });
    },
  });

  const designs: SharedDesign[] = (sharedDesigns as SharedDesign[]) || [
    {
      id: "design-neon-nights",
      title: "Neon Nights Party Invitation",
      description:
        "A vibrant, cyberpunk-inspired invitation template perfect for nightclub events and electronic music parties.",
      creator: {
        id: "creator-alex",
        name: "Alex Chen",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        verified: true,
        followers: 1247,
      },
      category: "invitation",
      tags: ["neon", "cyberpunk", "nightclub", "electronic", "futuristic"],
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
      previewImages: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
        "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800",
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      ],
      createdAt: "2025-01-24T10:30:00Z",
      updatedAt: "2025-01-24T15:45:00Z",
      stats: {
        views: 2847,
        likes: 456,
        downloads: 189,
        remixes: 23,
        shares: 67,
      },
      isLiked: false,
      isBookmarked: true,
      visibility: "public",
      license: "free",
      difficulty: "intermediate",
      timeToComplete: 45,
      tools: ["Photoshop", "Illustrator", "Figma"],
      colors: ["#ff0080", "#00ffff", "#ffff00", "#ff4000", "#8000ff"],
      isRemix: false,
      collaboration: {
        isCollaborative: true,
        collaborators: [
          {
            id: "creator-alex",
            name: "Alex Chen",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
            role: "owner",
          },
          {
            id: "collab-sarah",
            name: "Sarah Kim",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150",
            role: "editor",
          },
        ],
        inviteCode: "NEON2025",
      },
    },
    {
      id: "design-minimalist-wedding",
      title: "Elegant Minimalist Wedding Suite",
      description:
        "Clean, sophisticated wedding invitation and decoration templates with modern typography and subtle gold accents.",
      creator: {
        id: "creator-emma",
        name: "Emma Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        verified: true,
        followers: 892,
      },
      category: "invitation",
      tags: ["wedding", "minimalist", "elegant", "typography", "gold"],
      thumbnail:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
      previewImages: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      ],
      createdAt: "2025-01-23T14:20:00Z",
      updatedAt: "2025-01-24T09:15:00Z",
      stats: {
        views: 1923,
        likes: 321,
        downloads: 156,
        remixes: 18,
        shares: 89,
      },
      isLiked: true,
      isBookmarked: false,
      visibility: "public",
      license: "premium",
      difficulty: "beginner",
      timeToComplete: 30,
      tools: ["Canva", "InDesign", "Figma"],
      colors: ["#ffffff", "#f8f8f8", "#d4af37", "#333333"],
      isRemix: false,
      collaboration: {
        isCollaborative: false,
        collaborators: [
          {
            id: "creator-emma",
            name: "Emma Rodriguez",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            role: "owner",
          },
        ],
      },
    },
    {
      id: "design-tropical-vibes",
      title: "Tropical Summer Vibes (Remix)",
      description:
        "A vibrant remix of the classic summer party theme with enhanced tropical elements and animated backgrounds.",
      creator: {
        id: "creator-mike",
        name: "Mike Johnson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        verified: false,
        followers: 234,
      },
      category: "theme",
      tags: ["tropical", "summer", "beach", "animated", "colorful"],
      thumbnail:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
      previewImages: [
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      ],
      createdAt: "2025-01-22T16:45:00Z",
      updatedAt: "2025-01-23T11:30:00Z",
      stats: {
        views: 1456,
        likes: 198,
        downloads: 87,
        remixes: 12,
        shares: 34,
      },
      isLiked: false,
      isBookmarked: false,
      visibility: "public",
      license: "free",
      difficulty: "advanced",
      timeToComplete: 60,
      tools: ["After Effects", "Photoshop", "Figma"],
      colors: ["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5", "#1fb3d3"],
      isRemix: true,
      originalDesign: {
        id: "design-summer-original",
        title: "Classic Summer Party Theme",
        creator: "Emma Rodriguez",
      },
      collaboration: {
        isCollaborative: true,
        collaborators: [
          {
            id: "creator-mike",
            name: "Mike Johnson",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            role: "owner",
          },
        ],
        inviteCode: "TROPICAL25",
      },
    },
  ];

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
                      onClick={() =>
                        handleInviteResponse.mutate({
                          inviteId: invite.id,
                          action: "accept",
                        })
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleInviteResponse.mutate({
                          inviteId: invite.id,
                          action: "decline",
                        })
                      }
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
            <DiscoverTab
              setSelectedDesign={setSelectedDesign}
              setShowRemixDialog={setShowRemixDialog}
            />
          </TabsContent>

          <TabsContent value="my-designs" className="space-y-6">
            <MyDesignsTab
              myDesignsList={designs}
              setSelectedDesign={setSelectedDesign}
              setShowCollabDialog={setShowCollabDialog}
              shareDesignMutation={shareDesignMutation}
            />
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <CollaborationsTab
              collaborationsList={designs.filter(
                (d) => d.collaboration?.isCollaborative
              )}
            />
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-6">
            <BookmarksTab
              designs={designs}
              bookmarkDesignMutation={bookmarkDesignMutation}
              downloadDesignMutation={downloadDesignMutation}
            />
          </TabsContent>
        </Tabs>

        {/* Design Details Modal */}
        {selectedDesign && (
          <Dialog
            open={!!selectedDesign}
            onOpenChange={() => setSelectedDesign(null)}
          >
            <DialogContent className="max-w-4xl bg-black/90 border-purple-500/20 text-white">
              {(() => {
                const design = designs.find((d) => d.id === selectedDesign);
                if (!design) return null;

                return (
                  <DesignDetailsDialog
                    design={design}
                    onLike={() => likeDesignMutation.mutate(design.id)}
                    onDownload={() => downloadDesignMutation.mutate(design.id)}
                    onOpenRemix={() => setShowRemixDialog(true)}
                    onShare={() => shareDesignMutation.mutate(design.id)}
                  />
                );
              })()}
            </DialogContent>
          </Dialog>
        )}

        {/* Remix Dialog */}
        <Dialog open={showRemixDialog} onOpenChange={setShowRemixDialog}>
          <RemixDialog
            onCreate={(payload) =>
              selectedDesign &&
              remixDesignMutation.mutate({
                designId: selectedDesign,
                title: payload.title,
                description: payload.description,
                remixType: payload.remixType,
              })
            }
            onCancel={() => setShowRemixDialog(false)}
          />
        </Dialog>

        {/* Collaboration Dialog */}
        <Dialog open={showCollabDialog} onOpenChange={setShowCollabDialog}>
          <CollaborationDialog
            onSend={(payload) =>
              selectedDesign &&
              inviteCollaboratorMutation.mutate({
                designId: selectedDesign,
                email: payload.email,
                role: payload.role,
              })
            }
            onCancel={() => setShowCollabDialog(false)}
          />
        </Dialog>
      </div>
    </div>
  );
}
