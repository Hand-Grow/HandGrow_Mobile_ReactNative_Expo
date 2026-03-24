import { USER_API } from "../constants";
import { User } from "../type/auth.type";
import apiClient from "./apiClient";

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get(USER_API.GET_PROFILE);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Profile:", error);
    throw error;
  }
};

export const putUserLocation = async (data: any): Promise<any> => {
  try {
    const formattedData = {
      ...data,
      commune: data.address?.wardName || data.commune,
      province: data.address?.provinceName || data.province,
      address: data.address?.full || data.address,
    };

    const response = await apiClient.put(
      USER_API.UPDATE_LOCATION,
      formattedData,
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật vị trí:", error);
    throw error;
  }
};
