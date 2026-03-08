import { create } from "zustand";
import { getSession, clearSession } from "@/src/services/storage";
import { useUserStore } from "./user.store";
import { QueryClient } from "@tanstack/react-query";

type AuthState = {
  isAuthenticated: boolean;

  isBootstrapping: boolean;
  isSubmitting: boolean;

  bootstrap: () => Promise<void>;

  startAuthAction: () => void;
  finishAuthAction: () => void;

  loginSuccess: () => void;
  logout: () => Promise<void>;
};
export const queryClient = new QueryClient();
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  isBootstrapping: true,
  isSubmitting: false,

  bootstrap: async () => {
    const session = await getSession();

    if (session && session.expiresAt > Date.now()) {
      set({ isAuthenticated: true });
    } else {
      await clearSession();
      set({ isAuthenticated: false });
    }

    set({ isBootstrapping: false });
  },

  startAuthAction: () => set({ isSubmitting: true }),
  finishAuthAction: () => set({ isSubmitting: false }),

  loginSuccess: () =>
    set({
      isAuthenticated: true,
      isSubmitting: false,
    }),

  logout: async () => {
    await clearSession();

    useUserStore.getState().reset(); // 🔥 reset user store
    queryClient.clear();
    set({
      isAuthenticated: false,
      isBootstrapping: false,
      isSubmitting: false,
    });
  },
}));
