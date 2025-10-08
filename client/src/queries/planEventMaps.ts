import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { IResponseList } from "@/types";

// Types describing the plan event map response returned by
// GET /api/master/plan-event-map/event/:eventId
export type SetupRequirement = {
  setup_requirements_id: number;
  setup_status: string;
  _id: string;
};

export type VenueManagement = {
  venue_details: number;
  amenities_id: number[];
  setup_requirements: SetupRequirement[];
};

export type GuestEntry = {
  guest_id: number;
  invite_status: string;
  _id: string;
};

export type PlanEventMapData = {
  venue_management: VenueManagement;
  _id: string;
  event_id: number;
  menu_drinks: number[];
  menu_food: number[];
  menu_entertainment: number[];
  menu_decorations: number[];
  tasks: number[];
  chat: number[];
  budget_items_id: number[];
  event_gallery: number[];
  guests_id: GuestEntry[];
  transaction_id?: number | null;
  payment_status?: string;
  status?: boolean;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: string;
  updatedAt?: string;
  plan_event_id?: number;
  // allow extra fields without breaking callers
  //   [key: string]: unknown;
};

export const fetchPlanEventMapsByEvent = async (
  eventId?: string | number | null
) => {
  if (!eventId) return null;
  const res = await axiosInstance.get<IResponseList<PlanEventMapData>>(
    `/api/master/plan-event-map/event/${eventId}`
  );
  return res.data;
};

export function usePlanEventMapsByEventQuery(eventId?: string | number | null) {
  return useQuery({
    queryKey: [`/api/master/plan-event-map/event/${eventId}`],
    queryFn: () => fetchPlanEventMapsByEvent(eventId),
    enabled: !!eventId,
    // return the inner data array (same convention as events.ts)
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 2,
  });
}
