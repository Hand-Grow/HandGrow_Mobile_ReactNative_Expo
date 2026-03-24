export interface GroupBuyCampaign {
  id: string;
  cooperativeId: string;
  cooperativeName: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  title: string;
  description: string;
  status: "GATHERING" | "CLOSED" | "COMPLETED";
  deadlineDate: string;
  totalCommittedQty: number;
  targetQuantity: number;
  currentUnitPrice: number;
  participationCount: number;
  progressPercent: number;
  nextTierLabel: string;
  userParticipation?: {
    id: string;
    committedQty: number;
    lockedUnitPrice: number;
    totalAmount: number;
  };
}

export interface JoinCampaignRequest {
  committedQty: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface JoinCampaignResponse {
  success: boolean;
  message: string;
  campaign?: GroupBuyCampaign;
}
