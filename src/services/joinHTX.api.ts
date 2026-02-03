import apiClient from "./apiClient";

export const joinCooperative = async (cooperativeId: string) => {
  return await apiClient.post("/api/v1/join-requests", { cooperativeId });
};

export const getMyJoinRequests = async () => {
  return await apiClient.get("/api/v1/join-requests/my-requests");
};

export const getMyRequestsByStatus = async (status: string): Promise<any[]> => {
  try {
    const response = await apiClient.get<any>(
      `/api/v1/join-requests/my-requests/status/${status}`,
    );

    const data = response.data;

    return Array.isArray(data) ? data : data?.content || data?.data || [];
  } catch (error) {
    console.error(`❌ Lỗi fetch requests với status ${status}:`, error);
    return [];
  }
};
