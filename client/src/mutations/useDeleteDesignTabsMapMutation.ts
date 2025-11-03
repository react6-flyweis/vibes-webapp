import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export async function deleteDesignTabsMapById(id: number | string) {
  // The API expects the id in the URL as shown: /deleteDesignTabsMapById/{id}
  return axiosInstance.delete(
    `/api/master/design-tabs-map/deleteDesignTabsMapById/${id}`
  );
}

export function useDeleteDesignTabsMapMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDesignTabsMapById,
    onSuccess: () => {
      // Invalidate community designs and designs-by-tab to refresh bookmarks lists
      qc.invalidateQueries({
        queryKey: ["/api/master/community-designs/getAll"],
      });
      qc.invalidateQueries({ queryKey: ["/api/designs/my-designs"] });
      // Invalidate the designs-by-tab queries (prefix) so BookmarksTab refetches
      qc.invalidateQueries({
        queryKey: ["/api/master/design-tabs-map/getDesignsByTabId"],
        exact: false,
      });
    },
  });
}
