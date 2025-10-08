import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type SetupRequirement = {
  _id: string;
  name: string;
  quantity?: number | null;
  image?: string | null;
  emozi?: string | null;
  status?: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  setup_requirements_id?: number | null;
};

export const fetchEventSetupRequirements = async () => {
  const res = await axiosInstance.get<IResponse<SetupRequirement[]>>(
    "/api/master/event-setup-requirements/all"
  );
  return res.data;
};

export function useEventSetupRequirementsQuery() {
  return useQuery({
    queryKey: ["/api/master/event-setup-requirements/all"],
    queryFn: fetchEventSetupRequirements,
    select: (data) => data?.data ?? [],
    staleTime: 1000 * 60 * 5,
  });
}
