import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type AvailabilityCalendarEntry = {
  _id: string;
  Year: number;
  Month: number;
  Date_start: string;
  Start_time: string;
  End_time: string;
  End_date: string;
  Event_id: number;
  User_availabil: string;
  user_id: number;
  Status: boolean;
  CreateBy: number;
  CreateAt: string;
  UpdatedBy: number | null;
  UpdatedAt: string;
  Availability_Calender_id: number;
  event_details: {
    Event_type: string;
    EntryPrice: number;
    _id: string;
    name_title: string;
    event_type_id: number;
    ticketed_events: boolean;
    description: string;
    venue_name: string;
    street_address: string;
    country_id: number;
    state_id: number;
    city_id: number;
    event_category_tags_id: number;
    tags: string[];
    date: string;
    time: string;
    max_capacity: number;
    event_image: string;
    live_vibes_invite_videos: string[];
    live_vibes_invite_venue_tour: string[];
    live_vibes_invite_music_preview: string[];
    live_vibes_invite_vip_perks: string[];
    status: boolean;
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    event_id: number;
    venue_details_id: number;
  };
  user_details: {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    user_id: number;
  };
  created_by_details: {
    _id: string;
    name: string;
    email: string;
    user_id: number;
  };
};

export type AvailabilityCalendarResponse = {
  success: boolean;
  message: string;
  data: AvailabilityCalendarEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
};

// Fetch availability calendar entries for the authenticated user
export const fetchAvailabilityCalendarByAuth = async () => {
  const res = await axiosInstance.get<AvailabilityCalendarResponse>(
    `/api/master/availability-calender/getByAuth`
  );
  return res.data;
};

export function useAvailabilityCalendarByAuthQuery() {
  return useQuery<
    AvailabilityCalendarResponse,
    Error,
    AvailabilityCalendarEntry[]
  >({
    queryKey: ["/api/master/availability-calender/getByAuth"],
    queryFn: fetchAvailabilityCalendarByAuth,
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
