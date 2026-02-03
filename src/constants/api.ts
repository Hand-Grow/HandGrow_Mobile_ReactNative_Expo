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
