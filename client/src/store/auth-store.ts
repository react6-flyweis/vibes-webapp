import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

type StorageType = "local" | "session";

const STORAGE_KEY = "homvill_auth";
const STORAGE_TYPE_KEY = "homvill_auth_persist_type"; // values: 'local' | 'session'

interface MinimalStorage {
  getItem(name: string): string | null;
  setItem(name: string, value: string): void;
  removeItem(name: string): void;
}

interface AuthState {
  isHydrated: boolean;
  setIsHydrated: (val: boolean) => void;
  token: string | null;
  user: unknown | null;
  remember: boolean;
  setRemember: (val?: boolean) => void;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setUser: (user: unknown | null) => void;
  clearUser: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

function getStorageByType(type: StorageType): MinimalStorage {
  try {
    if (typeof window === "undefined") throw new Error("no window");
    if (type === "local") return window.localStorage;
    return window.sessionStorage;
  } catch (err) {
    // fallback to sessionStorage-like in-memory if storage isn't available
    const store: Record<string, string> = {};
    return {
      getItem(name: string) {
        return Object.prototype.hasOwnProperty.call(store, name)
          ? store[name]
          : null;
      },
      setItem(name: string, value: string) {
        store[name] = value;
      },
      removeItem(name: string) {
        delete store[name];
      },
    };
  }
}

// custom storage wrapper that delegates to chosen storage at call time
const customStorage: MinimalStorage = {
  getItem: (name: string) => {
    try {
      const type =
        (typeof window !== "undefined" &&
          window.localStorage.getItem(STORAGE_TYPE_KEY)) ||
        "session";
      return getStorageByType(type as StorageType).getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      const type =
        (typeof window !== "undefined" &&
          window.localStorage.getItem(STORAGE_TYPE_KEY)) ||
        "session";
      return getStorageByType(type as StorageType).setItem(name, value);
    } catch {
      // noop
    }
  },
  removeItem: (name: string) => {
    try {
      const type =
        (typeof window !== "undefined" &&
          window.localStorage.getItem(STORAGE_TYPE_KEY)) ||
        "session";
      return getStorageByType(type as StorageType).removeItem(name);
    } catch {
      // noop
    }
  },
};

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
      setRemember(val = false) {
        // when toggling remember, migrate existing persisted entry to the other storage type
        try {
          const currentType =
            (typeof window !== "undefined" &&
              window.localStorage.getItem(STORAGE_TYPE_KEY)) ||
            "session";
          const newType = val ? "local" : "session";
          if (currentType !== newType) {
            const from = getStorageByType(currentType as StorageType);
            const to = getStorageByType(newType as StorageType);
            const existing = from.getItem(STORAGE_KEY);
            if (existing != null) {
              to.setItem(STORAGE_KEY, existing);
              from.removeItem(STORAGE_KEY);
            }
            if (typeof window !== "undefined") {
              window.localStorage.setItem(STORAGE_TYPE_KEY, newType);
            }
          }
        } catch (e) {
          // ignore storage migration errors
        }
        set((state: AuthState) => {
          state.remember = !!val;
        });
      },
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
      clearUser() {
        set((state: AuthState) => {
          state.user = null;
        });
      },
      // fully clear auth state and persisted storage
      logout() {
        try {
          // remove persisted entry from both storages to be safe
          if (typeof window !== "undefined") {
            try {
              window.localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
              // ignore
            }
            try {
              window.sessionStorage.removeItem(STORAGE_KEY);
            } catch (e) {
              // ignore
            }
            try {
              window.localStorage.removeItem(STORAGE_TYPE_KEY);
            } catch (e) {
              // ignore
            }
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
      // use our custom storage wrapper so we can delegate to session/local based on flag
      // PersistOptions typing expects `storage` — cast to any to avoid type mismatch
      storage: customStorage as unknown as any,
      onRehydrateStorage: () => (state, error) => {
        // if there was an error during rehydration, still mark hydrated so app can proceed
        state && state.setIsHydrated && state.setIsHydrated(true);
        if (error) {
          // optionally log or handle the error here
          // console.error('authStore rehydrate error', error);
        }
      },
    }
  )
);
