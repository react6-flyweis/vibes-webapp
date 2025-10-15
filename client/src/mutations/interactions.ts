import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type LikePayload = {
  community_designs_id: number | string;
  status: boolean;
};

// Plain API function — no toasts or side-effects here.
export async function createCommunityDesignLike(payload: LikePayload) {
  return axiosInstance.post(
    "/api/master/community-designs-likes/create",
    payload
  );
}

// Hook that exposes the mutation (no built-in toasts) so components can
// decide how to handle success/failure side-effects.
export function useCommunityDesignLikeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCommunityDesignLike,
    // keep generic: caller will handle toast and additional invalidation
    onSuccess: () => {
      // still helpful to provide a default invalidation for cache coherence
      qc.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
    },
  });
}

export type DownloadPayload = {
  community_designs_id: number | string;
  status: boolean;
};

export async function createCommunityDesignDownload(payload: DownloadPayload) {
  return axiosInstance.post(
    "/api/master/community-designs-downloads/create",
    payload
  );
}

export function useCommunityDesignDownloadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCommunityDesignDownload,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
    },
  });
}
