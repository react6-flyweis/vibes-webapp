import { useState } from "react";
import {
  Heart,
  Share2,
  Download,
  Eye,
  Users,
  Star,
  Filter,
  Search,
  Plus,
  Palette,
  Clock,
  Zap,
  Copy,
  Edit3,
  Globe,
  Lock,
  ChevronDown,
  MoreHorizontal,
  Flag,
  Bookmark,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CommunityDesignCard from "@/components/CommunityDesignCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type {
  SharedDesign,
  DesignComment,
  CollaborationInvite,
} from "@/types/designs";

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
  const [newComment, setNewComment] = useState("");
  const [remixTitle, setRemixTitle] = useState("");
  const [remixDescription, setRemixDescription] = useState("");
  const [remixType, setRemixType] = useState<"full" | "partial" | "inspired">(
    "full"
  );
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaboratorRole, setCollaboratorRole] = useState<"editor" | "viewer">(
    "viewer"
  );

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
      setRemixTitle("");
      setRemixDescription("");
      setRemixType("full");
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

  const addCommentMutation = useMutation({
    mutationFn: async (data: { designId: string; content: string }) => {
      const response = await apiRequest(
        "POST",
        `/api/designs/${data.designId}/comments`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your feedback has been posted",
      });
    },
  });

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
      setCollaboratorEmail("");
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

  const designs: SharedDesign[] = sharedDesigns || [
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
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {design.title}
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {design.description}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Preview Images */}
                      <div className="space-y-4">
                        <img
                          src={design.previewImages[0]}
                          alt={design.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {design.previewImages.slice(1).map((img, index) => (
                            <img
                              key={index}
                              src={img}
                              alt={`Preview ${index + 2}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Design Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={design.creator.avatar} />
                            <AvatarFallback>
                              {design.creator.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {design.creator.name}
                              </span>
                              {design.creator.verified && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {design.creator.followers} followers
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Category:</span>
                            <span className="ml-2 text-white">
                              {design.category}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Difficulty:</span>
                            <span className="ml-2 text-white capitalize">
                              {design.difficulty}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Time:</span>
                            <span className="ml-2 text-white">
                              {design.timeToComplete} minutes
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">License:</span>
                            <span className="ml-2 text-white capitalize">
                              {design.license}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-gray-400 text-sm">
                            Tools used:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {design.tools.map((tool) => (
                              <Badge
                                key={tool}
                                variant="outline"
                                className="text-xs"
                              >
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-gray-400 text-sm">
                            Color palette:
                          </span>
                          <div className="flex gap-2">
                            {design.colors.map((color) => (
                              <div
                                key={color}
                                className="w-6 h-6 rounded border border-white/20"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {design.isRemix && design.originalDesign && (
                          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-orange-400 text-sm">
                              <Copy className="h-4 w-4" />
                              <span>
                                Remix of "{design.originalDesign.title}" by{" "}
                                {design.originalDesign.creator}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-4 gap-2 text-center p-3 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-lg font-bold text-white">
                              {design.stats.views}
                            </div>
                            <div className="text-xs text-gray-400">Views</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">
                              {design.stats.likes}
                            </div>
                            <div className="text-xs text-gray-400">Likes</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">
                              {design.stats.downloads}
                            </div>
                            <div className="text-xs text-gray-400">
                              Downloads
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">
                              {design.stats.remixes}
                            </div>
                            <div className="text-xs text-gray-400">Remixes</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => likeDesignMutation.mutate(design.id)}
                            className={`flex-1 ${
                              design.isLiked
                                ? "bg-red-500/20 border-red-500 text-red-400"
                                : "bg-white/10"
                            }`}
                            variant="outline"
                          >
                            <Heart
                              className={`h-4 w-4 mr-2 ${
                                design.isLiked ? "fill-current" : ""
                              }`}
                            />
                            {design.isLiked ? "Liked" : "Like"}
                          </Button>
                          <Button
                            onClick={() =>
                              downloadDesignMutation.mutate(design.id)
                            }
                            className="flex-1 bg-violet-600 hover:bg-violet-700"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => setShowRemixDialog(true)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Create Remix
                          </Button>
                          <Button
                            onClick={() =>
                              shareDesignMutation.mutate(design.id)
                            }
                            variant="outline"
                            className="flex-1"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-6 space-y-4">
                      <h3 className="text-xl font-semibold">
                        Comments ({comments.length})
                      </h3>

                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Share your thoughts on this design..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                          <Button
                            onClick={() =>
                              addCommentMutation.mutate({
                                designId: design.id,
                                content: newComment,
                              })
                            }
                            disabled={!newComment.trim()}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Post Comment
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex gap-3 p-3 bg-white/5 rounded-lg"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>
                                {comment.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">
                                  {comment.author.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">
                                {comment.content}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`text-xs ${
                                    comment.isLiked
                                      ? "text-red-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <Heart
                                    className={`h-3 w-3 mr-1 ${
                                      comment.isLiked ? "fill-current" : ""
                                    }`}
                                  />
                                  {comment.likes}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-xs text-gray-400"
                                >
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </DialogContent>
          </Dialog>
        )}

        {/* Remix Dialog */}
        <Dialog open={showRemixDialog} onOpenChange={setShowRemixDialog}>
          <DialogContent className="bg-black/90 border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle>Create a Remix</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create your own version of this design with your unique twist
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="remix-title">Remix Title</Label>
                <Input
                  id="remix-title"
                  value={remixTitle}
                  onChange={(e) => setRemixTitle(e.target.value)}
                  placeholder="Give your remix a name..."
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="remix-type">Remix Type</Label>
                <Select
                  value={remixType}
                  onValueChange={(value: "full" | "partial" | "inspired") =>
                    setRemixType(value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choose remix type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-purple-500/20">
                    <SelectItem
                      value="full"
                      className="text-white hover:bg-purple-500/20"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Full Remix</span>
                        <span className="text-xs text-gray-400">
                          Copy entire design and customize freely
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="partial"
                      className="text-white hover:bg-purple-500/20"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Partial Remix</span>
                        <span className="text-xs text-gray-400">
                          Use specific elements as inspiration
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="inspired"
                      className="text-white hover:bg-purple-500/20"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Inspired By</span>
                        <span className="text-xs text-gray-400">
                          Create new design inspired by concepts
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="remix-description">Description</Label>
                <Textarea
                  id="remix-description"
                  value={remixDescription}
                  onChange={(e) => setRemixDescription(e.target.value)}
                  placeholder="Describe what makes your remix unique..."
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-purple-400 mt-1" />
                  <div className="text-sm">
                    <p className="text-purple-300 font-medium">
                      Remix Features
                    </p>
                    <ul className="text-gray-400 text-xs space-y-1 mt-1">
                      <li>
                        • Attribution to original creator automatically added
                      </li>
                      <li>• Full design editor access with all tools</li>
                      <li>• Export in multiple formats (PNG, SVG, PDF)</li>
                      <li>• Share your remix with the community</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRemixDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedDesign &&
                  remixDesignMutation.mutate({
                    designId: selectedDesign,
                    title: remixTitle,
                    description: remixDescription,
                    remixType: remixType,
                  })
                }
                disabled={!remixTitle.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Create Remix
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Collaboration Dialog */}
        <Dialog open={showCollabDialog} onOpenChange={setShowCollabDialog}>
          <DialogContent className="bg-black/90 border-purple-500/20 text-white">
            <DialogHeader>
              <DialogTitle>Invite Collaborators</DialogTitle>
              <DialogDescription className="text-gray-400">
                Invite others to collaborate on your design project
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="collaborator-email">Email Address</Label>
                <Input
                  id="collaborator-email"
                  type="email"
                  value={collaboratorEmail}
                  onChange={(e) => setCollaboratorEmail(e.target.value)}
                  placeholder="teammate@example.com"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="collaborator-role">Permission Level</Label>
                <Select
                  value={collaboratorRole}
                  onValueChange={(value: "editor" | "viewer") =>
                    setCollaboratorRole(value)
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      Viewer - Can view and comment
                    </SelectItem>
                    <SelectItem value="editor">
                      Editor - Can edit and modify
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCollabDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedDesign &&
                  inviteCollaboratorMutation.mutate({
                    designId: selectedDesign,
                    email: collaboratorEmail,
                    role: collaboratorRole,
                  })
                }
                disabled={!collaboratorEmail.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
