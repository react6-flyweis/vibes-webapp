import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import type { IResponse, IResponseList } from "@/types";
import type { SharedDesign } from "@/types/designs";

export interface CategoryApiItem {
  _id: string;
  category_name: string;
  emozi?: string;
  status?: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  category_id?: number;
}

export interface CreatorApiItem {
  _id?: string;
  name?: string;
  email?: string;
  user_id?: number;
  avatar?: string;
  business_name?: string;
  role_id?: number;
  status?: boolean;
}

export interface CommunityDesignApiItem {
  categories_id: number | CategoryApiItem;
  image: string;
  title: string;
  sub_title?: string | null;
  image_type?: string | null;
  image_sell_type?: string | null;
  hash_tag?: string[];
  likes?: number;
  views?: number;
  share?: number;
  remixes?: number;
  downloads?: number;
  status?: boolean;
  created_by?: number | CreatorApiItem;
  updated_by?: number | null;
  _id: string;
  created_at?: string;
  updated_at?: string;
  design_json_data?: string;
  collaborators_user_id?: any[];
  community_designs_id: number;
}

async function fetchCommunityDesigns() {
  const res = await axiosInstance.get<IResponseList<CommunityDesignApiItem>>(
    "/api/master/community-designs/getAll"
  );
  return res.data;
}

interface DesignTabMapApiItem {
  _id: string;
  tabs_id: number;
  community_designs_id: CommunityDesignApiItem;
  status: boolean;
  created_by: number | { id: number; name?: string; avatar?: string };
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

function mapToSharedDesign(item: CommunityDesignApiItem): SharedDesign {
  return {
    id: item.community_designs_id,
    title: item.title ?? "",
    description: item.sub_title ?? "",
    creator: {
      id: (() => {
        if (!item.created_by) return "0";
        if (typeof item.created_by === "number") return String(item.created_by);
        return String(
          (item.created_by as CreatorApiItem).user_id ??
            (item.created_by as CreatorApiItem)._id ??
            "0"
        );
      })(),
      name: (() => {
        if (!item.created_by) return "Unknown";
        if (typeof item.created_by === "number") return "Unknown";
        return (item.created_by as CreatorApiItem).name ?? "Unknown";
      })(),
      avatar: (() => {
        if (!item.created_by || typeof item.created_by === "number") return "";
        return (item.created_by as CreatorApiItem).avatar ?? "";
      })(),
      verified: false,
      followers: 0,
    },
    category: ((): any => {
      const map: Record<number, SharedDesign["category"]> = {
        1: "invitation",
        2: "decoration",
        3: "layout",
        4: "theme",
        5: "logo",
        6: "poster",
      };
      // categories_id can be a number or an object
      const catId =
        typeof item.categories_id === "number"
          ? item.categories_id
          : (item.categories_id as CategoryApiItem)?.category_id ??
            (item.categories_id as CategoryApiItem)?._id
          ? undefined
          : undefined;
      if (typeof catId === "number") return map[catId] ?? "invitation";
      // fallback: try to map common category names
      const catObj =
        typeof item.categories_id === "object"
          ? (item.categories_id as CategoryApiItem)
          : undefined;
      if (catObj && catObj.category_name) {
        const name = catObj.category_name.toLowerCase();
        if (name.includes("invitation")) return "invitation";
        if (name.includes("decor")) return "decoration";
        if (name.includes("layout")) return "layout";
        if (name.includes("theme")) return "theme";
        if (name.includes("logo")) return "logo";
        if (name.includes("poster")) return "poster";
      }
      return "invitation";
    })(),
    tags: item.hash_tag ?? [],
    thumbnail: item.image ?? "",
    previewImages: item.image ? [item.image] : [],
    createdAt: item.created_at ?? new Date().toISOString(),
    updatedAt: item.updated_at ?? new Date().toISOString(),
    stats: {
      views: item.views ?? 0,
      likes: item.likes ?? 0,
      downloads: item.downloads ?? 0,
      remixes: item.remixes ?? 0,
      shares: item.share ?? 0,
    },
    isLiked: false,
    isBookmarked: false,
    visibility: item.status ? "public" : "unlisted",
    license: (item.image_sell_type as any) ?? "free",
    difficulty:
      ((item.image_type || "beginner").toLowerCase() as any) ?? "beginner",
    timeToComplete: 0,
    tools: [],
    colors: [],
    isRemix: false,
    collaboration: {
      isCollaborative: false,
      collaborators: [],
    },
    designData: item.design_json_data,
  } as SharedDesign;
}

export function useCommunityDesignsQuery() {
  return useQuery({
    queryKey: [
      "/api/master/community-designs/getAll?sortBy=created_at&sortOrder=desc",
    ],
    queryFn: fetchCommunityDesigns,
    select: (res) => (res?.data ?? []).map(mapToSharedDesign),
    staleTime: 1000 * 60 * 2,
  });
}

async function fetchDesignsByTab(tabId: number | string) {
  const res = await axiosInstance.get<IResponseList<DesignTabMapApiItem>>(
    `/api/master/design-tabs-map/getDesignsByTabId/${tabId}`
  );
  return res.data;
}

export function useDesignsByTabQuery(tabId: number | string | undefined) {
  return useQuery({
    queryKey: ["/api/master/design-tabs-map/getDesignsByTabId", tabId],
    queryFn: () => fetchDesignsByTab(tabId ?? ""),
    enabled: typeof tabId !== "undefined" && tabId !== null && tabId !== "",
    select: (res) =>
      (res?.data ?? []).map((i) => ({
        ...mapToSharedDesign(i.community_designs_id),
        raw: i,
      })),

    staleTime: 1000 * 60 * 2,
  });
}

// Fetch a single community design by id
async function fetchCommunityDesignById(id: string | number) {
  const res = await axiosInstance.get<IResponse<CommunityDesignApiItem>>(
    `/api/master/community-designs/getCommunityDesignById/${id}`
  );
  return res.data;
}

export function useCommunityDesignByIdQuery(id: string | number | undefined) {
  return useQuery({
    queryKey: ["/api/master/community-designs/getCommunityDesignById", id],
    queryFn: () => fetchCommunityDesignById(id ?? ""),
    enabled: typeof id !== "undefined" && id !== null && id !== "",
    select: (res) => res?.data,
    staleTime: 1000 * 60 * 2,
  });
}
