import { JOIN_API } from "../constants/api";
import apiClient from "./apiClient";

export const joinCooperative = async (cooperativeId: string) => {
  return await apiClient.post(JOIN_API.BASE, { cooperativeId });
};

export const getMyJoinRequests = async () => {
  const response = await apiClient.get(JOIN_API.MY_REQUESTS);
  return response.data;
};

export const getMyRequestsByStatus = async (status: string): Promise<any[]> => {
  try {
    const response = await apiClient.get<any>(JOIN_API.STATUS(status));

    const data = response.data;

    return Array.isArray(data) ? data : data?.content || data?.data || [];
  } catch (error) {
    console.error(`❌ Lỗi fetch requests với status ${status}:`, error);
    return [];
  }
};
