import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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

export function useLoginMutation(
  options?: UseMutationOptions<LoginResponse, unknown, LoginData>
) {
  return useMutation<LoginResponse, unknown, LoginData>({
    mutationFn: async (data: LoginData) => {
      return await apiRequest<LoginResponse>("/api/users/login", "POST", data);
    },
    ...options,
  });
}

export function useVerifyOtpMutation(
  options?: UseMutationOptions<
    VerifyResponse,
    unknown,
    { email?: string | undefined; otp: string }
  >
) {
  // preserve any user-provided onSuccess to call after our handler
  const userOnSuccess = options?.onSuccess as any;

  return useMutation<
    VerifyResponse,
    unknown,
    { email?: string | undefined; otp: string }
  >({
    mutationFn: async (data) => {
      return await apiRequest<VerifyResponse>(
        "/api/users/verify-otp",
        "POST",
        data
      );
    },
    onSuccess: (res: any, variables: any, context: any) => {
      try {
        console.log(res);
        const auth = useAuthStore.getState();
        const token = res?.data?.accessToken;
        const user = res?.data?.user;
        if (token) {
          auth.setToken(token);
        }
        if (user) {
          auth.setUser(user);
        }
        // Mark store as hydrated so consumers relying on isHydrated can proceed
        auth.setIsHydrated && auth.setIsHydrated(true);
      } catch (e) {
        // swallow any errors setting store
      }

      // call user-provided onSuccess if present
      if (typeof userOnSuccess === "function") {
        try {
          userOnSuccess(res, variables, context);
        } catch (e) {
          // ignore
        }
      }
    },
    ...options,
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
