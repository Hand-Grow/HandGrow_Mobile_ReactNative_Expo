import axios from "axios";
import { clearSession, getSession } from "./storage";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (!session) return config;

  const { token, expiresAt } = session;

  if (Date.now() > expiresAt) {
    await clearSession();
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
