import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { axiosInstance } from "@/lib/queryClient";
import { useAuthStore, User } from "@/store/auth-store";

/**
 * Request payload for updating profile
 */
export interface UpdateProfileInput {
  id: string | number;
  name?: string;
  mobile?: string;
  address?: string;
  role_id?: number;
  online_status?: boolean;
  gender?: string;
  [key: string]: any;
}

/**
 * User object returned by the API (matches `User` in auth store, but keep explicit type here)
 */
export type UpdateProfileUser = User;

/**
 * API response shape for the updateProfile endpoint
 */
export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  data?: UpdateProfileUser | null;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Hook: useUpdateProfileMutation
 * Calls PUT /api/users/updateProfile with the provided payload and, on success,
 * updates the auth store `user` with the returned `data` object.
 */
export function useUpdateProfileMutation(
  options?: UseMutationOptions<
    AxiosResponse<UpdateProfileResponse>,
    unknown,
    UpdateProfileInput
  >
) {
  return useMutation<
    AxiosResponse<UpdateProfileResponse>,
    unknown,
    UpdateProfileInput
  >({
    mutationFn: (data: UpdateProfileInput) =>
      axiosInstance.put<UpdateProfileResponse>(
        "/api/users/updateProfile",
        data
      ),
    onSuccess: (res) => {
      try {
        // response.data.data is expected to be the updated user object
        const payload = res?.data;
        const updatedUser = payload?.data ?? null;
        if (updatedUser) {
          useAuthStore.getState().setUser(updatedUser as UpdateProfileUser);
        }
      } catch (e) {
        // swallow errors updating store
      }
    },
    ...options,
  });
}

export default useUpdateProfileMutation;
