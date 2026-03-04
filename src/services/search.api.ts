import axios from "axios";
import { ADDRESS_API, USER_API } from "../constants";
import apiClient from "./apiClient";

export const searchCooperatives = async (
  commune: string,
  province: string,
  produce?: string,
): Promise<any> => {
  try {
    const response = await apiClient.get(USER_API.GET_SEARCH, {
      params: {
        commune: commune,
        province: province,
        produce: produce || undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm HTX:", error);
    throw error;
  }
};

export const getaddressAPI = axios.create({
  baseURL: ADDRESS_API.BASE_ADDRESS_API,
});
