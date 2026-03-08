export interface GroupOrderProduct {
  id: string;
  name: string;
  description?: string;
  joinedQuantity: number;
  expectedPrice: number;
  originalPrice: number;
  discount: number;
  discountAmount: number;
  membersCount: number;
  days: number;
  status: "joined" | "active" | "closed";
  category?: string;
  unit?: string;
  supplier?: string;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface JoinOrderRequest {
  productId: string;
  quantity: number;
}

export interface JoinOrderResponse {
  success: boolean;
  message: string;
  order?: GroupOrderProduct;
}
