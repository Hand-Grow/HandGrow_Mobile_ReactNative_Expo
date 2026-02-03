import { create } from "zustand";
import { User } from "../type/auth.type";
import { putUserLocation } from "../services/user.api";
import { getMyJoinRequests } from "../services/joinHTX.api";

interface UserState {
  user: User | null;
  profiles: { farmer: User | null; coop: User | null; enterprise: User | null };
  joinRequests: any[]; // Danh sách yêu cầu đã gửi
  fetchMyRequests: () => Promise<void>;
  updateJoinRequestLocal: (newRequest: any) => void;
  updateProfile: (updatedUser: User) => Promise<void>;
  setProfileData: (role: "farmer" | "coop" | "enterprise", data: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  profiles: { farmer: null, coop: null, enterprise: null },
  joinRequests: [],

  fetchMyRequests: async () => {
    try {
      const data = await getMyJoinRequests();
      set({ joinRequests: Array.isArray(data) ? data : [] });
    } catch (error) {
      set({ joinRequests: [] });
    }
  },

  updateJoinRequestLocal: (newRequest) => {
    set((state) => ({
      joinRequests: [newRequest, ...state.joinRequests],
    }));
  },
  setProfileData: (role, data) =>
    set((state) => ({
      profiles: { ...state.profiles, [role]: data },
      user: data,
    })),

  updateProfile: async (updatedUser: User) => {
    try {
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
    } catch (error) {
      console.error("❌ Lỗi trong quá trình cập nhật:", error);
      throw error;
    }
  },
}));
