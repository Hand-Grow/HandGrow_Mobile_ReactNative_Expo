import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
});
console.log("API:", process.env.EXPO_PUBLIC_API_BASE_URL);

// apiClient.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
//   if (accessToken && config.headers) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });
export default apiClient;
