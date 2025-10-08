import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { PlanEventMapData } from "@/queries/planEventMaps";

export type CreatePlanEventMapPayload = {
  event_id: string | number;
  menu_drinks?: Array<string | number>;
  menu_food?: Array<string | number>;
  menu_entertainment?: Array<string | number>;
  menu_decorations?: Array<string | number>;
  tasks?: Array<string | number>;
  chat?: Array<string | number>;
  budget_items_id?: Array<string | number>;
  venue_management?: any;
  event_gallery?: Array<string | number>;
  guests_id?: any;
  status?: boolean;
};

export type UpdatePlanEventMapPayload = Partial<{
  id: string | number;
  event_id: string | number;
  menu_drinks: Array<string | number>;
  menu_food: Array<string | number>;
  menu_entertainment: Array<string | number>;
  menu_decorations: Array<string | number>;
  tasks: Array<string | number>;
  chat: Array<string | number>;
  budget_items_id: Array<string | number>;
  venue_management: any;
  event_gallery: Array<string | number>;
  guests_id: any;
  status: boolean;
}>;

type UsePlanEventMapOptions = {
  onSuccess?: (data: any) => void;
  onError?: (err: any) => void;
};

export function useCreatePlanEventMap({
  onSuccess,
  onError,
}: UsePlanEventMapOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePlanEventMapPayload) => {
      try {
        const res = await axiosInstance.post<{ data: PlanEventMapData }>(
          "/api/master/plan-event-map/create",
          payload
        );
        return res.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      // invalidate queries for this event so UI picks up the new plan map
      if (variables && (variables as any).event_id) {
        queryClient.invalidateQueries({
          queryKey: [
            `/api/master/plan-event-map/event/${(variables as any).event_id}`,
          ],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["/api/master/plan-event-map/event/"],
      });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}

export function useUpdatePlanEventMap({
  onSuccess,
  onError,
}: UsePlanEventMapOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePlanEventMapPayload) => {
      try {
        const res = await axiosInstance.put<{ data: PlanEventMapData }>(
          "/api/master/plan-event-map/update",
          payload
        );
        return res.data;
      } catch (err) {
        if (err && (err as any).response && (err as any).response.data)
          throw (err as any).response.data;
        throw err;
      }
    },
    onSuccess: (data, variables) => {
      if (variables && (variables as any).event_id) {
        queryClient.invalidateQueries({
          queryKey: [
            `/api/master/plan-event-map/event/${(variables as any).event_id}`,
          ],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["/api/master/plan-event-map/event/"],
      });
      if (onSuccess) onSuccess(data);
    },
    onError: (err: any) => {
      if (onError) onError(err);
    },
  });
}
