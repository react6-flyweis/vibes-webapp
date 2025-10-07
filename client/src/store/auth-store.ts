import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "homvill_auth";
const REMEMBERED_KEY = "homvill_auth_remembered";

interface AuthState {
  isHydrated: boolean;
  setIsHydrated: (val: boolean) => void;
  token: string | null;
  user: unknown | null;
  remember: boolean;
  login: (
    user: unknown | null,
    token: string | null,
    remember?: boolean
  ) => void;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setUser: (user: unknown | null) => void;
  clearUser: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // indicates whether persisted state has been rehydrated from storage
      isHydrated: false,
      setIsHydrated(val: boolean) {
        set((state: AuthState) => {
          state.isHydrated = val;
        });
      },
      token: null,
      user: null,
      // remember controls whether we persist to localStorage (true) or sessionStorage (false)
      remember: false,
      setToken(token: string | null) {
        set((state: AuthState) => {
          state.token = token;
        });
      },
      clearToken() {
        set((state: AuthState) => {
          state.token = null;
        });
      },
      setUser(user: unknown | null) {
        set((state: AuthState) => {
          state.user = user;
        });
      },
      login(user: unknown | null, token: string | null, remember = false) {
        try {
          set((state: AuthState) => {
            state.user = user;
            state.token = token;
            state.remember = !!remember;
          });

          // persist remembered session into localStorage if requested
          if (remember && typeof window !== "undefined") {
            try {
              window.localStorage.setItem(
                REMEMBERED_KEY,
                JSON.stringify({ token, user, remember: true })
              );
            } catch (e) {
              // ignore localStorage errors
            }
          }
        } catch (e) {
          // ignore
        }
      },
      clearUser() {
        set((state: AuthState) => {
          state.user = null;
        });
      },
      // fully clear auth state and persisted storage
      logout() {
        try {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(REMEMBERED_KEY);
            window.sessionStorage.removeItem(STORAGE_KEY);
          }
        } catch (e) {
          // noop
        }

        set((state: AuthState) => {
          state.token = null;
          state.user = null;
          state.isHydrated = true;
        });
      },
      isAuthenticated() {
        return !!get().token;
      },
    })),
    {
      name: STORAGE_KEY,
      // persist into sessionStorage by default
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : ({} as Storage)
      ),
      // only persist full auth when remember === true; otherwise persist just the flag
      partialize: (state: Partial<AuthState>) => {
        if ((state as any).remember) {
          const { isHydrated, setIsHydrated, ...rest } = state as any;
          return rest;
        }
        return { remember: !!(state as any).remember } as Partial<AuthState>;
      },
      onRehydrateStorage: () => (state, error) => {
        // after rehydration mark hydrated
        state && state.setIsHydrated && state.setIsHydrated(true);
        if (error) {
          // optionally log
        }
        try {
          if (typeof window !== "undefined") {
            const hasToken = (state && (state as any).token) || null;
            if (!hasToken) {
              const remembered = window.localStorage.getItem(REMEMBERED_KEY);
              if (remembered) {
                try {
                  const parsed = JSON.parse(remembered);
                  // restore token/user and remember flag
                  // restore via login so the remember flag and any side-effects happen through the existing login action
                  state &&
                    state.login &&
                    state.login(
                      (parsed && parsed.user) || null,
                      (parsed && parsed.token) || null,
                      true
                    );
                } catch (e) {
                  // ignore parse errors
                }
              }
            }
          }
        } catch (e) {
          // ignore
        }
      },
    }
  )
);
