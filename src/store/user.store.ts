import { create } from "zustand";
import { putUserLocation } from "../services/user.api";
import { User } from "../type/auth.type";

interface UserState {
  user: User | null;
  profiles: {
    farmer: User | null;
    coop: User | null;
    enterprise: User | null;
  };

  setProfileData: (role: "farmer" | "coop" | "enterprise", data: any) => void;

  updateProfile: (updatedUser: User) => Promise<void>;

  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  profiles: {
    farmer: null,
    coop: null,
    enterprise: null,
  },

  setProfileData: (role, data) =>
    set((state) => ({
      profiles: { ...state.profiles, [role]: data },
      user: data,
    })),

  updateProfile: async (updatedUser: User) => {
    const finalData: User = {
      ...updatedUser,
      commune:
        updatedUser.commune || (updatedUser.address as any)?.wardName || "",
      province:
        updatedUser.province ||
        (updatedUser.address as any)?.provinceName ||
        "",
      address:
        typeof updatedUser.address === "object"
          ? (updatedUser.address as any)?.full
          : updatedUser.address || "",
    };

    await putUserLocation(finalData);

    set((state) => ({
      user: finalData,
      profiles: { ...state.profiles, farmer: finalData },
    }));
  },

  reset: () =>
    set({
      user: null,
      profiles: {
        farmer: null,
        coop: null,
        enterprise: null,
      },
    }),
}));
