import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants";

export const saveSession = async (accessToken: string, expiresIn: number) => {
  const expiresAt = Date.now() + expiresIn * 1000;

  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

  await SecureStore.setItemAsync(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
};

export const getSession = async () => {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);

  const expiresAt = await SecureStore.getItemAsync(STORAGE_KEYS.EXPIRES_AT);

  if (!token || !expiresAt) return null;

  return {
    token,
    expiresAt: Number(expiresAt),
  };
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.EXPIRES_AT);
};
