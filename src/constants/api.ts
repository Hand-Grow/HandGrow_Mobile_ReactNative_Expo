import { FeedType } from "../type/forumFeed.type";

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

export const FORUM_FEED_API = {
  GET_FEED: (coopId: string) => `${API_V1}/coops/${coopId}/feed`,

  TOGGLE_LIKE: (type: FeedType, id: string) =>
    `${API_V1}/feed/${type}/${id}/likes`,

  GET_COMMENTS: (type: FeedType, id: string) =>
    `${API_V1}/feed/${type}/${id}/comments`,

  POST_COMMENT: (type: FeedType, id: string) =>
    `${API_V1}/feed/${type}/${id}/comments`,

  CREATE_COMMITMENT: (campaignId: string) =>
    `${API_V1}/campaigns/${campaignId}/commitments`,
  GET_COMMITMENTS: (campaignId: string) =>
    `${API_V1}/campaigns/${campaignId}/commitments`,
};

export const GROUP_ORDER_API = {
  CAMPAIGNS: `${API_V1}/group-buy/campaigns`,
  CAMPAIGNS_COOPERATIVE_ME: `${API_V1}/group-buy/campaigns/cooperative/me`,
  CAMPAIGN_BY_ID: (id: string) => `${API_V1}/group-buy/campaigns/${id}`,
  JOIN_CAMPAIGN: (id: string) => `${API_V1}/group-buy/campaigns/${id}/join`,
  CLOSE_CAMPAIGN: (id: string) => `${API_V1}/group-buy/campaigns/${id}/close`,
  CAMPAIGN_PARTICIPATIONS: (id: string) =>
    `${API_V1}/group-buy/campaigns/${id}/participations`,
  // Legacy endpoints for backward compatibility
  PRODUCTS: `${API_V1}/group-orders/products`,
  PRODUCT_BY_ID: (id: string) => `${API_V1}/group-orders/products/${id}`,
  JOIN_ORDER: `${API_V1}/group-orders/join`,
  LEAVE_ORDER: `${API_V1}/group-orders/leave`,
};
