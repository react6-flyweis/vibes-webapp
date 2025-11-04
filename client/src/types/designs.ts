export interface SharedDesign {
  id: number;
  title: string;
  description: string;
  designData?: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followers: number;
  };
  category:
    | "invitation"
    | "decoration"
    | "layout"
    | "theme"
    | "logo"
    | "poster";
  tags: string[];
  thumbnail: string;
  previewImages: string[];
  createdAt: string;
  updatedAt: string;
  stats: {
    views: number;
    likes: number;
    downloads: number;
    remixes: number;
    shares: number;
  };
  isLiked: boolean;
  isBookmarked: boolean;
  visibility: "public" | "private" | "unlisted";
  license: "free" | "premium" | "commercial";
  difficulty: "beginner" | "intermediate" | "advanced";
  timeToComplete: number;
  tools: string[];
  colors: string[];
  isRemix: boolean;
  originalDesign?: {
    id: string;
    title: string;
    creator: string;
  };
  collaboration: {
    isCollaborative: boolean;
    collaborators: Array<{
      id: string;
      name: string;
      avatar: string;
      role: "owner" | "editor" | "viewer";
    }>;
    inviteCode?: string;
  };
}

export interface DesignComment {
  id: string;
  designId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: DesignComment[];
}

export interface CollaborationInvite {
  id: string;
  designId: string;
  designTitle: string;
  inviterName: string;
  inviterAvatar: string;
  role: "editor" | "viewer";
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
}
