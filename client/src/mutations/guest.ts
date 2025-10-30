import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { useUpdatePlanEventMap } from "@/mutations/planEventMap";
import { guestsQueryKey } from "@/queries/guests";

type InviteGuestPayload = {
  name: string;
  email: string;
  mobileno?: string;
  specialnote?: string;
  img?: string;
  event_id: string | number;
  status?: boolean;
};

export function useInviteGuest({ onSuccess, onError }: any = {}) {
  const qc = useQueryClient();
  const updatePlanMap = useUpdatePlanEventMap({});

  return useMutation({
    mutationFn: async (payload: InviteGuestPayload) => {
      try {
        const res = await axiosInstance.post(
          "/api/master/guest/create",
          payload
        );
        return res.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: async (data: any, variables: InviteGuestPayload) => {
      // extract created guest id from response
      const created = data?.data ?? data ?? {};
      const guestId =
        created?.guest_id ?? created?.id ?? created?._id ?? undefined;

      // if we have a guest id and the event id, attempt to link to plan event map
      if (guestId && variables?.event_id) {
        try {
          // fetch existing plan map for this event via query cache if present
          const key = `/api/master/plan-event-map/event/${variables.event_id}`;
          const cached = qc.getQueryData<any>([key]);
          const planMap = Array.isArray(cached?.data)
            ? cached.data[0]
            : cached?.data;

          if (planMap && (planMap as any).event_id) {
            const existing = Array.isArray((planMap as any).guests_id)
              ? (planMap as any).guests_id
              : [];
            const updated = [
              ...existing,
              { guest_id: String(guestId), invite_status: "Pending" },
            ];
            updatePlanMap.mutate({
              id:
                (planMap as any)._id ??
                (planMap as any).plan_event_id ??
                undefined,
              event_id: (planMap as any).event_id,
              guests_id: updated,
            });
          } else {
            // no plan map: create one via the same mutation endpoint
            // Attempt to create a minimal plan map with guest linked
            // Reuse updatePlanMap mutate for create isn't ideal, but we'll call create endpoint via axios if needed.
            // For now, if there's no planMap in cache, we skip automatic creation to avoid unexpected side effects.
          }
        } catch (e) {
          console.warn("Failed to link guest to plan map", e);
        }
      }

      qc.invalidateQueries({
        queryKey: [`/api/events/${variables.event_id}/participants`],
      });
      // Also invalidate the guests-by-event query so the guest list refreshes
      qc.invalidateQueries({ queryKey: guestsQueryKey(variables.event_id) });
      qc.invalidateQueries({ queryKey: ["/api/master/plan-event-map/event/"] });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
