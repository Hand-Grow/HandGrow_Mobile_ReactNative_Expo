import { GROUP_ORDER_API } from "../constants/api";
import {
  ApiResponse,
  GroupBuyCampaign,
  JoinCampaignRequest,
  JoinCampaignResponse,
} from "../type/groupOrder.type";
import apiClient from "./apiClient";

// Real API service for farmer
class GroupOrderApiService {
  async getCampaigns(
    filter?: "gathering" | "closed",
  ): Promise<ApiResponse<GroupBuyCampaign[]>> {
    try {
      const params = new URLSearchParams();
      if (filter) params.append("status", filter);

      console.log("🔍 Fetching campaigns with params:", params.toString());
      const response = await apiClient.get(
        `${GROUP_ORDER_API.CAMPAIGNS}?${params}`,
      );
      console.log("🔍 Campaigns API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (Array.isArray(responseData)) {
        // If response is directly an array
        return {
          success: true,
          data: responseData,
          total: responseData.length,
          page: 1,
          limit: 10,
        };
      } else if (responseData && typeof responseData === "object") {
        // If response is an object with data property
        return responseData;
      } else {
        // Fallback for unexpected response
        console.warn("Unexpected API response structure:", responseData);
        return {
          success: true,
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        };
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  }

  async getCampaignById(id: string): Promise<ApiResponse<GroupBuyCampaign>> {
    try {
      const response = await apiClient.get(GROUP_ORDER_API.CAMPAIGN_BY_ID(id));
      console.log("🔍 Campaign by ID API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        if (responseData.data) {
          // Response has data property
          return {
            success: true,
            data: responseData.data,
            message: responseData.message,
          };
        } else {
          // Response is directly the campaign object
          return {
            success: true,
            data: responseData,
            message: "Lấy thông tin chiến dịch thành công",
          };
        }
      } else {
        // Fallback for unexpected response
        return {
          success: false,
          data: null as any,
          message: "Không thể lấy thông tin chiến dịch",
        };
      }
    } catch (error: any) {
      console.error("Error fetching campaign:", error);

      // Extract error message from response if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể lấy thông tin chiến dịch";

      return {
        success: false,
        data: null as any,
        message: errorMessage,
      };
    }
  }

  async joinCampaign(
    campaignId: string,
    request: JoinCampaignRequest,
  ): Promise<JoinCampaignResponse> {
    try {
      const response = await apiClient.post(
        GROUP_ORDER_API.JOIN_CAMPAIGN(campaignId),
        request,
      );
      console.log("🔍 Join campaign API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        return {
          success: responseData.success !== false,
          message: responseData.message || "Tham gia chiến dịch thành công",
          campaign: responseData.campaign,
        };
      } else {
        // Fallback for unexpected response
        return {
          success: true,
          message: "Tham gia chiến dịch thành công",
        };
      }
    } catch (error: any) {
      console.error("Error joining campaign:", error);

      // Extract error message from response if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể tham gia chiến dịch";

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async updateParticipation(
    campaignId: string,
    request: JoinCampaignRequest,
  ): Promise<JoinCampaignResponse> {
    try {
      // PUT to update existing participation (BE needs to create this endpoint)
      const response = await apiClient.put(
        GROUP_ORDER_API.UPDATE_PARTICIPATION(campaignId),
        request,
      );
      console.log("🔍 Update participation API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        return {
          success: responseData.success !== false,
          message: responseData.message || "Cập nhật tham gia thành công",
          campaign: responseData.campaign,
        };
      } else {
        // Fallback for unexpected response
        return {
          success: true,
          message: "Cập nhật tham gia thành công",
        };
      }
    } catch (error: any) {
      console.error("Error updating participation:", error);

      // Extract error message from response if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể cập nhật tham gia";

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async closeCampaign(campaignId: string): Promise<JoinCampaignResponse> {
    try {
      const response = await apiClient.post(
        GROUP_ORDER_API.CLOSE_CAMPAIGN(campaignId),
      );
      console.log("🔍 Close campaign API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        return {
          success: responseData.success !== false,
          message: responseData.message || "Đóng chiến dịch thành công",
          campaign: responseData.campaign,
        };
      } else {
        // Fallback for unexpected response
        return {
          success: true,
          message: "Đóng chiến dịch thành công",
        };
      }
    } catch (error: any) {
      console.error("Error closing campaign:", error);

      // Extract error message from response if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể đóng chiến dịch";

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  async leaveCampaign(campaignId: string): Promise<JoinCampaignResponse> {
    try {
      // Note: API doesn't have leave endpoint, this would need to be implemented
      // For now, we'll use a DELETE request to remove participation
      const response = await apiClient.delete(
        `/api/v1/group-buy/campaigns/${campaignId}/participations/me`,
      );
      console.log("🔍 Leave campaign API response:", response.data);

      // Handle different response structures
      const responseData = response.data;
      if (responseData && typeof responseData === "object") {
        return {
          success: responseData.success !== false,
          message: responseData.message || "Rời chiến dịch thành công",
          campaign: responseData.campaign,
        };
      } else {
        // Fallback for unexpected response
        return {
          success: true,
          message: "Rời chiến dịch thành công",
        };
      }
    } catch (error: any) {
      console.error("Error leaving campaign:", error);

      // Extract error message from response if available
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể rời chiến dịch";

      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  // Legacy methods for backward compatibility
  async getProducts(
    filter?: "active" | "joined" | "closed",
  ): Promise<ApiResponse<GroupBuyCampaign[]>> {
    // Map old filter names to new ones
    const newFilter =
      filter === "active"
        ? "gathering"
        : filter === "joined"
          ? "gathering"
          : "closed";
    return this.getCampaigns(newFilter as any);
  }

  async getProductById(id: string): Promise<ApiResponse<GroupBuyCampaign>> {
    return this.getCampaignById(id);
  }

  async joinOrder(request: {
    productId: string;
    quantity: number;
  }): Promise<JoinCampaignResponse> {
    return this.joinCampaign(request.productId, {
      committedQty: request.quantity,
    });
  }

  async leaveOrder(productId: string): Promise<JoinCampaignResponse> {
    return this.leaveCampaign(productId);
  }
}

export const groupOrderApi = new GroupOrderApiService();
export default groupOrderApi;
