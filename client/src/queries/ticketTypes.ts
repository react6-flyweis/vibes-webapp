import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type TicketType = {
  _id: string;
  ticket_type: string;
  status: boolean;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  ticket_type_id: number;
};

/**
 * Returns a react-query result whose `data` is an array of TicketType objects.
 */
export function useTicketTypesQuery() {
  return useQuery({
    queryKey: ["/api/master/ticket-types/getAll"],
    queryFn: async () =>
      axiosInstance.get<IResponseList<TicketType>>(
        "/api/master/ticket-types/getAll"
      ),
    select: (res) => res.data.data,
  });
}
