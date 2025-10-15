import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import type { IResponseList } from "@/types";
import type { SharedDesign } from "@/types/designs";

export interface CommunityDesignApiItem {
  categories_id: number;
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
  created_by?: number | { id: number; name?: string; avatar?: string };
  updated_by?: number | null;
  _id: string;
  created_at?: string;
  updated_at?: string;
  community_designs_id?: number;
}

async function fetchCommunityDesigns() {
  const res = await axiosInstance.get<IResponseList<CommunityDesignApiItem>>(
    "/api/master/community-designs/getAll"
  );
  return res.data;
}

function mapToSharedDesign(item: CommunityDesignApiItem): SharedDesign {
  return {
    id: item.community_designs_id,
    title: item.title ?? "",
    description: item.sub_title ?? "",
    creator: {
      id:
        item.created_by && typeof item.created_by === "object"
          ? String(item.created_by.id)
          : String(item.created_by ?? "0"),
      name:
        typeof item.created_by === "object" && item.created_by.name
          ? item.created_by.name
          : "Unknown",
      avatar:
        typeof item.created_by === "object" && item.created_by.avatar
          ? item.created_by.avatar
          : "",
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
      return map[item.categories_id] ?? "invitation";
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
  } as SharedDesign;
}

export function useCommunityDesignsQuery() {
  return useQuery({
    queryKey: ["/api/master/community-designs/getAll"],
    queryFn: fetchCommunityDesigns,
    select: (res) => (res?.data ?? []).map(mapToSharedDesign),
    staleTime: 1000 * 60 * 2,
  });
}

async function fetchDesignsByTab(tabId: number | string) {
  const res = await axiosInstance.get<IResponseList<CommunityDesignApiItem>>(
    `/api/master/design-tabs-map/getDesignsByTabId/${tabId}`
  );
  return res.data;
}

export function useDesignsByTabQuery(tabId: number | string | undefined) {
  return useQuery({
    queryKey: ["/api/master/design-tabs-map/getDesignsByTabId", tabId],
    queryFn: () => fetchDesignsByTab(tabId ?? ""),
    enabled: typeof tabId !== "undefined" && tabId !== null && tabId !== "",
    select: (res: IResponseList<CommunityDesignApiItem> | undefined) =>
      (res?.data ?? []).map(mapToSharedDesign),
    staleTime: 1000 * 60 * 2,
  });
}
