import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { invitationsQueryKey } from "@/queries/invitations";

type CreateInvitationPayload = {
  eventId: string | number;
  templateId?: string;
  customizations?: any;
  guests?: any[];
};

export function useCreateInvitation({ onSuccess, onError }: any = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateInvitationPayload) => {
      const res = await axiosInstance.post(`/api/invitations/create`, payload);
      return res.data;
    },
    onSuccess: (data: any, variables: CreateInvitationPayload) => {
      // invalidate invitations for this event
      qc.invalidateQueries({
        queryKey: invitationsQueryKey(variables.eventId),
      });
      qc.invalidateQueries({ queryKey: ["/api/invitations"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}

type SendInvitationsPayload = {
  eventId: string | number;
  recipients: any[];
  method?: string;
  scheduledTime?: string;
  personalizations?: Record<string, string>;
};

export function useSendInvitations({ onSuccess, onError }: any = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendInvitationsPayload) => {
      const res = await axiosInstance.post(
        `/api/events/${payload.eventId}/invitations/send`,
        payload
      );
      return res.data;
    },
    onSuccess: (data: any, variables: SendInvitationsPayload) => {
      qc.invalidateQueries({
        queryKey: invitationsQueryKey(variables.eventId),
      });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
