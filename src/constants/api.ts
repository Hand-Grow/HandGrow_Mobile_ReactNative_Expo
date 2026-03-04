const API_V1 = "/api/v1";

export const AUTH_API = {
  LOGIN: `${API_V1}/auth/login`,
  SIGNUP: `${API_V1}/auth/register/farmer`,
  REFRESH_TOKEN: `${API_V1}/auth/refresh`,
  LOGOUT: `${API_V1}/auth/logout`,
};

export const USER_API = {
  GET_PROFILE: `${API_V1}/user/profile`,
  UPDATE_LOCATION: `${API_V1}/user/location`,
  GET_SEARCH: `${API_V1}/cooperatives/search`,
};
export const ADDRESS_API = {
  BASE_ADDRESS_API: `https://provinces.open-api.vn/api/v2`,
};

export const JOIN_API = {
  BASE: `${API_V1}/join-requests`,
  MY_REQUESTS: `${API_V1}/join-requests/my-requests`,
  STATUS: (status: string) =>
    `${API_V1}/join-requests/my-requests/status/${status}`,
};
