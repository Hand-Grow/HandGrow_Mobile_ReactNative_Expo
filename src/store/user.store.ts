import { create } from "zustand";
import { JoinRequestStatus } from "../constants/enums/joinRequest";
import { getMyJoinRequests } from "../services/joinHTX.api";
import { putUserLocation } from "../services/user.api";
import { User } from "../type/auth.type";

interface UserState {
  user: User | null;
  profiles: { farmer: User | null; coop: User | null; enterprise: User | null };
  joinRequests: any[];
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
      const raw = Array.isArray(data) ? data : data?.data || [];
      const normalized = raw.map((req: any) => {
        const idVal = req.cooperative?.id ?? req.cooperativeId ?? req.id ?? "";
        return {
          ...req,
          cooperativeId: idVal ? String(idVal) : undefined,
          cooperativeName:
            req.cooperative?.name ?? req.cooperativeName ?? undefined,
          status: req.status || JoinRequestStatus.PENDING,
        };
      });
      console.log("Fetched and normalized join requests:", normalized);
      set({ joinRequests: normalized });
    } catch (error) {
      set({ joinRequests: [] });
    }
  },

  updateJoinRequestLocal: (newRequest) => {
    const rawId =
      newRequest.cooperative?.id ||
      newRequest.cooperativeId ||
      newRequest.id ||
      "";

    const normalized = {
      ...newRequest,
      cooperativeId: String(rawId),
      status: newRequest.status || JoinRequestStatus.PENDING,
    };

    set((state) => {
      const filtered = state.joinRequests.filter((r: any) => {
        const existingId = String(r.cooperativeId || "");
        return existingId !== normalized.cooperativeId;
      });

      return { joinRequests: [normalized, ...filtered] };
    });
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
