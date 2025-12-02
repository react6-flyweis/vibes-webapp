import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponse } from "@/types";

export type CreateEventTicketSeatsPayload = {
  event_entry_tickets_id: number;
  event_entry_userget_tickets_id: number[];
  event_id: number;
  seat_no: string[];
  capacity: number;
  status: boolean;
};

export type CreatedEventTicketSeatsResponse = {
  event_entry_tickets_id: number;
  event_entry_userget_tickets_id: number[];
  event_id: number;
  seat_no: string[];
  capacity: number;
  status: boolean;
  createdBy: number;
  updatedBy?: number | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  event_entry_tickets_seats_id: number;
};

type UseCreateEventTicketSeatsOptions = {
  onSuccess?: (data: CreatedEventTicketSeatsResponse) => void;
  onError?: (err: any) => void;
};

export function useCreateEventTicketSeats({
  onSuccess,
  onError,
}: UseCreateEventTicketSeatsOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEventTicketSeatsPayload) => {
      try {
        const res = await axiosInstance.post<
          IResponse<CreatedEventTicketSeatsResponse>
        >("/api/master/event-tickets-seats/create", payload);
        return res.data.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data) {
          throw (err as any).response.data;
        }
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate seat-related queries so UI refreshes
      if (variables?.event_id) {
        queryClient.invalidateQueries({
          queryKey: ["/api/master/event-tickets-seats", variables.event_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["/api/master/event-tickets-seats/all"],
        });
      }

      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
