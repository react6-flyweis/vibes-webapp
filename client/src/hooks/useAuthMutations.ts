import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export function useLoginMutation(options?: Parameters<typeof useMutation>[0]) {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest<LoginResponse>("/api/users/login", "POST", data);
    },
    ...options,
  });
}

export function useVerifyOtpMutation(
  options?: Parameters<typeof useMutation>[0]
) {
  return useMutation({
    mutationFn: async (data: { email?: string | undefined; otp: string }) => {
      return await apiRequest("/api/users/verify-otp", "POST", data);
    },
    ...options,
  });
}

export function useResendOtpMutation(
  options?: Parameters<typeof useMutation>[0]
) {
  return useMutation({
    mutationFn: async (data: { email?: string | undefined }) => {
      return await apiRequest("/api/users/resend-otp", "POST", data);
    },
    ...options,
  });
}
