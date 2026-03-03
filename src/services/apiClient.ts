import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});
console.log("API:", process.env.EXPO_PUBLIC_API_BASE_URL);

import { getSession } from "./storage";

apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.token && config.headers) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default apiClient;
