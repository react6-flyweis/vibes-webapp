import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiRequest, axiosInstance } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth-store";

type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    message: string;
    expiresIn: string; // e.g. "10 minutes"
    nextStep: string; // e.g. "verify-otp"
    otp?: string; // OTP may be returned in some environments (e.g. dev)
  };
  timestamp: string; // ISO timestamp
};

// response returned after successful OTP verification / final login
export type VerifyResponse = {
  success: boolean;
  message: string;
  data: {
    user: Record<string, any>;
    accessToken: string;
    refreshToken?: string;
  };
  timestamp: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginData) =>
      axiosInstance.post<LoginResponse>("/api/users/login", data),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: async (data: {
      email?: string | undefined;
      otp: string;
      remember?: boolean;
    }) => axiosInstance.post<VerifyResponse>("/api/users/verify-otp", data),

    onSuccess: (res, variables) => {
      try {
        const auth = useAuthStore.getState();
        const token = res?.data?.data.accessToken;
        const user = res?.data?.data.user;
        console.log("Storing token and user in auth store via login", {
          token,
          user,
          remember: variables?.remember,
        });
        // call the store's login helper honoring remember flag passed from caller
        auth.login &&
          auth.login(user || null, token || null, !!variables?.remember);
        // Mark store as hydrated so consumers relying on isHydrated can proceed
        auth.setIsHydrated && auth.setIsHydrated(true);
      } catch (e) {
        // swallow any errors setting store
      }
    },
  });
}

export function useResendOtpMutation(
  options?: UseMutationOptions<unknown, unknown, { email?: string | undefined }>
) {
  return useMutation<unknown, unknown, { email?: string | undefined }>({
    mutationFn: async (data) => {
      return await apiRequest("/api/users/resend-otp", "POST", data);
    },
    ...options,
  });
}

export function useForgotPasswordMutation(
  options?: UseMutationOptions<unknown, unknown, { email?: string | undefined }>
) {
  return useMutation<unknown, unknown, { email?: string | undefined }>({
    mutationFn: async (data) => {
      return await apiRequest("/api/users/forgot-password", "POST", data);
    },
    ...options,
  });
}

export function useResetPasswordMutation(
  options?: UseMutationOptions<
    unknown,
    unknown,
    {
      email?: string | undefined;
      otp?: string | undefined;
      newPassword?: string | undefined;
    }
  >
) {
  return useMutation<
    unknown,
    unknown,
    {
      email?: string | undefined;
      otp?: string | undefined;
      newPassword?: string | undefined;
    }
  >({
    mutationFn: async (data) => {
      return await apiRequest("/api/users/reset-password", "POST", data);
    },
    ...options,
  });
}

// Create user / signup mutation for the new endpoint
export function useCreateUserMutation(
  options?: UseMutationOptions<
    unknown,
    unknown,
    {
      name: string;
      email: string;
      password: string;
      agreePrivacyPolicy: boolean;
    }
  >
) {
  return useMutation<
    unknown,
    unknown,
    {
      name: string;
      email: string;
      password: string;
      agreePrivacyPolicy: boolean;
    }
  >({
    mutationFn: async (data) => {
      // Using axiosInstance to keep consistency with other auth mutations
      return await axiosInstance.post("/api/users/create", data);
    },
    ...options,
  });
}
