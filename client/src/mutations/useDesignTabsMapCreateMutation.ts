import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type DesignTabsMapPayload = {
  tabs_id: number | string;
  community_designs_id: number | string;
  status: boolean;
};

export async function createDesignTabsMap(payload: DesignTabsMapPayload) {
  return axiosInstance.post("/api/master/design-tabs-map/create", payload);
}

export function useDesignTabsMapCreateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createDesignTabsMap,
    onSuccess: () => {
      // keep caches coherent across community designs lists
      qc.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
      qc.invalidateQueries({ queryKey: ["/api/designs/my-designs"] });
    },
  });
}
