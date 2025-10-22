import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export interface IPipelineStage {
  totalCount: number;
  conversionRate?: number;
  totalEstimatedValue?: number;
}

export interface IVendorPipelineData {
  leadDiscovered: IPipelineStage;
  leadContacted: IPipelineStage;
  onboardingStarted: IPipelineStage;
  activatedLeads: IPipelineStage;
  featured: IPipelineStage;
}

export interface IVendorPipelineResponse {
  success: boolean;
  message: string;
  data: IVendorPipelineData;
  timestamp?: string;
}

export async function fetchVendorPipeline() {
  const url = `/api/vendor/overview/pipeline-overview`;
  return axiosInstance.get<IVendorPipelineResponse>(url);
}

export function useVendorPipeline() {
  const key = ["/api/vendor/overview/pipeline-overview"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorPipeline(),
    select: (res) => res.data.data as IVendorPipelineData,
    staleTime: 1000 * 60 * 1,
  });
}
