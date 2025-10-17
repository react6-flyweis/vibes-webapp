import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export default function useCreateVibeFundCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) =>
      axiosInstance.post("/api/vendor/business-information/create", data),
    onSuccess: () => {
      // Invalidate any vibe fund campaign related lists so UI can refresh
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/business-information"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/vendor/business-information/create"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vibe-fund-campaigns"] });
    },
  });
}
