import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type Guest = {
  _id: string;
  name?: string;
  mobileno?: string;
  email?: string;
  specialnote?: string;
  img?: string;
  event_id?: number;
  status?: boolean;
  createdBy?: number | null;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  guest_id?: number;
};

export const guestsQueryKey = (eventId: string | number) =>
  [`/api/master/guest/event/${eventId}`] as const;

async function fetchGuests(eventId: string | number) {
  const res = await axiosInstance.get<IResponseList<Guest>>(
    `/api/master/guest/event/${eventId}`
  );
  return res.data.data;
}

export function useGuestsByEvent(eventId?: string | number | null) {
  return useQuery({
    queryKey: guestsQueryKey(eventId ?? ""),
    queryFn: () => fetchGuests(eventId as string | number),
    enabled: !!eventId,
    staleTime: 1000 * 60, // 1 minute
  });
}
