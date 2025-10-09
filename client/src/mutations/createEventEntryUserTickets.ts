import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

// Payload expected by the API based on provided example
export type UserGetTicketItem = {
  event_entry_tickets_id: number | string;
  quantity: number;
};

export type CreateEventEntryUserTicketsPayload = {
  event_id: number | string;
  tickets: UserGetTicketItem[];
};

// Response data shape based on the example
export type CreatedEventEntryUserGetTicketsData = {
  event_id: number;
  tickets: Array<{
    event_entry_tickets_id: number;
    quantity: number;
    _id: string;
  }>;
  createdBy: number;
  updatedBy: number | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  event_entry_userget_tickets_id: number;
};

type UseCreateEventEntryUserTicketsOptions = {
  onSuccess?: (data: CreatedEventEntryUserGetTicketsData) => void;
  onError?: (err: any) => void;
};

export function useCreateEventEntryUserTickets({
  onSuccess,
  onError,
}: UseCreateEventEntryUserTicketsOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEventEntryUserTicketsPayload) => {
      try {
        const res = await axiosInstance.post<
          IResponse<CreatedEventEntryUserGetTicketsData>
        >("/api/master/event-entry-userget-tickets/create", payload);
        console.log(res);
        return res.data.data;
      } catch (err) {
        // rethrow server validation payload if present
        if (err && (err as any).response && (err as any).response.data) {
          throw (err as any).response.data;
        }
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate ticket-related queries so UI refreshes
      if (variables && (variables as any).event_id) {
        queryClient.invalidateQueries({
          queryKey: [
            "/api/master/event-entry-tickets/all",
            (variables as any).event_id,
          ],
        });
        queryClient.invalidateQueries({
          queryKey: ["/api/master/event-entry-tickets/all"],
        });
      }

      if (onSuccess) onSuccess(data as CreatedEventEntryUserGetTicketsData);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
