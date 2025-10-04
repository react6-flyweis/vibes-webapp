import axios, { AxiosError, AxiosInstance } from "axios";
import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth-store";

const baseURL = import.meta.env.VITE_API_BASE_URL || "";
console.log("API Base URL:", baseURL);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach auth token from zustand store (if present)
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const token = useAuthStore.getState().token;
      if (token) {
        if (!config.headers) config.headers = {} as any;
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore errors reading the store
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if we get a 401, clear auth state so app can react (optional)
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        useAuthStore.getState().logout();
      } catch (e) {
        // noop
      }
    }
    return Promise.reject(error);
  }
);

function normalizeAxiosError(err: unknown): never {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;
    const message =
      (data && (typeof data === "string" ? data : (data as any).message)) ||
      axiosErr.message ||
      `Request failed${status ? ` (${status})` : ""}`;
    throw new Error(message);
  }

  // Fallback for non-axios errors
  throw new Error(String(err));
}

export async function apiRequest(
  url: string,
  method: string = "GET",
  data?: unknown | undefined
): Promise<any> {
  try {
    const res = await axiosInstance.request({ url, method, data });
    return res.data;
  } catch (err) {
    normalizeAxiosError(err);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await axiosInstance.get(queryKey[0] as string);
      return res.data as T;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        if (unauthorizedBehavior === "returnNull") return null as any;
      }
      normalizeAxiosError(err);
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
