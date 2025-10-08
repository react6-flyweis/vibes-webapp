import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";

export type AddItemFormPayload = {
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  price?: number;
  color?: string;
  type?: string;
  brandName?: string;
  status?: boolean;
  eventId?: string | number; // optional, used for fallback event-specific menu-items
};

export type MasterCreateResponse = {
  success?: boolean;
  message?: string;
  data?: any;
};

type Options = {
  onSuccess?: UseMutationOptions<
    MasterCreateResponse,
    unknown,
    AddItemFormPayload
  >["onSuccess"];
  onError?: UseMutationOptions<
    MasterCreateResponse,
    unknown,
    AddItemFormPayload
  >["onError"];
};

export default function useCreateMasterMenuItem({
  onSuccess,
  onError,
}: Options = {}) {
  const queryClient = useQueryClient();

  return useMutation<MasterCreateResponse, unknown, AddItemFormPayload>({
    mutationFn: async (data: AddItemFormPayload) => {
      const category = data.category;
      let url = "";
      let payload: Record<string, any> = {};

      switch (category) {
        case "drinks":
          url = `/api/master/drinks/create`;
          payload = {
            drinks_name: data.name,
            drinks_price: data.price ?? 0,
            drinks_color: data.color || "",
            brand_name: data.brandName || "",
            status: true,
          };
          break;
        case "food":
          url = `/api/master/food/create`;
          payload = {
            food_name: data.name,
            food_price: data.price ?? 0,
            food_color: data.color || "",
            food_type: data.type || "",
            brand_name: data.brandName || "",
            status: true,
          };
          break;
        case "entertainment":
          url = `/api/master/entertainment/create`;
          payload = {
            entertainment_name: data.name,
            entertainment_price: data.price ?? 0,
            entertainment_type: data.type || "",
            brand_name: data.brandName || "",
            status: true,
          };
          break;
        case "decorations":
          url = `/api/master/decorations/create`;
          payload = {
            decorations_name: data.name,
            decorations_price: data.price ?? 0,
            decorations_type: data.type || "",
            brand_name: data.brandName || "",
            status: true,
          };
          break;
        default:
          // fallback to event-specific menu item endpoint
          url = `/api/events/${(data as any).eventId || ""}/menu-items`;
          payload = {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl || undefined,
          };
      }

      const res = await axiosInstance.post<MasterCreateResponse>(url, payload);
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate master lists for the created category
      const cat = variables?.category;
      try {
        if (cat === "drinks") {
          queryClient.invalidateQueries({
            queryKey: ["/api/master/drinks/getAll"],
          });
        } else if (cat === "food") {
          queryClient.invalidateQueries({
            queryKey: ["/api/master/food/getAll"],
          });
        } else if (cat === "entertainment") {
          queryClient.invalidateQueries({
            queryKey: ["/api/master/entertainment/getAll"],
          });
        } else if (cat === "decorations") {
          queryClient.invalidateQueries({
            queryKey: ["/api/master/decorations/getAll"],
          });
        }

        // If eventId was provided (fallback case), invalidate event-specific menu and stats
        if (variables && (variables as any).eventId) {
          const eventId = (variables as any).eventId;
          queryClient.invalidateQueries({
            queryKey: [`/api/events/${eventId}/menu-items`],
          });
          queryClient.invalidateQueries({
            queryKey: [`/api/events/${eventId}/stats`],
          });
        }
      } catch (e) {
        // ignore invalidation errors
      }

      //   if (onSuccess) onSuccess(data, variables, context);
    },
    onError,
  });
}
