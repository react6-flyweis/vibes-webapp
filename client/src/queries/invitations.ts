import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

export type Invitation = {
  id: string;
  eventId?: string | number;
  templateId?: string;
  status?: string;
  recipients?: any[];
  createdAt?: string;
  updatedAt?: string;
};

export const invitationsQueryKey = (eventId?: string | number) =>
  [`/api/events/${eventId}/invitations`] as const;

async function fetchInvitations(eventId?: string | number) {
  if (!eventId) return [];
  const res = await axiosInstance.get<IResponseList<Invitation>>(
    `/api/events/${eventId}/invitations`
  );
  return (res.data as any).data ?? res.data;
}

export function useInvitationsByEvent(eventId?: string | number | null) {
  return useQuery({
    queryKey: invitationsQueryKey(eventId ?? ""),
    queryFn: () => fetchInvitations(eventId as string | number),
    enabled: !!eventId,
    staleTime: 1000 * 60, // 1 minute
  });
}
