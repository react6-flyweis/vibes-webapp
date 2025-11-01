import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export interface IVendorServiceType {
  _id: string;
  name: string;
  emoji?: string;
  status?: boolean;
  vendor_service_type_id: number;
  [key: string]: any;
}

export async function fetchVendorServiceTypes() {
  const url = `/api/admin/vendor-service-types/getAll`;
  return axiosInstance.get<IResponseList<IVendorServiceType>>(url);
}

export function useVendorServiceTypes() {
  const key = ["/api/admin/vendor-service-types/getAll"];
  return useQuery({
    queryKey: key,
    queryFn: () => fetchVendorServiceTypes(),
    select: (res) => res.data.data as IVendorServiceType[],
    staleTime: 1000 * 60 * 5,
  });
}
