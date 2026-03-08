import { useQuery } from "@tanstack/react-query";
import { getMyRequestsByStatus } from "../services/joinHTX.api";

export const useMyJoinRequests = () => {
  return useQuery({
    queryKey: ["myJoinRequests"],
    queryFn: async () => {
      const [pendingRes, approvedRes] = await Promise.all([
        getMyRequestsByStatus("PENDING"),
        getMyRequestsByStatus("APPROVED"),
      ]);

      const pending = Array.isArray(pendingRes) ? pendingRes : [];
      const approved = Array.isArray(approvedRes) ? approvedRes : [];

      const raw = [...pending, ...approved];

      return raw.map((req: any) => {
        const coopId =
          req?.cooperative?.id ??
          req?.cooperative?.cooperativeId ??
          req?.cooperativeId;

        return {
          ...req,
          cooperativeId: String(coopId ?? ""),
          status: req?.status,
        };
      });
    },

    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 4000,
    retry: 1,
  });
};
