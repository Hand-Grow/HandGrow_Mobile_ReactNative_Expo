import {
  ApiResponse,
  GroupOrderProduct,
  JoinOrderRequest,
  JoinOrderResponse,
} from "../type/groupOrder.type";

// Mock data for development
const mockProducts: GroupOrderProduct[] = [
  {
    id: "1",
    name: "Phân NPK 16-16-8",
    description: "Phân NPK cân đối, phù hợp cho nhiều loại cây trồng",
    joinedQuantity: 100,
    expectedPrice: 10500,
    originalPrice: 12500,
    discount: 15,
    discountAmount: 2000,
    membersCount: 12,
    days: 2,
    status: "joined",
    category: "Phân bón",
    unit: "kg",
    supplier: "Công ty Phân bón An Phát",
    minOrderQuantity: 50,
    maxOrderQuantity: 1000,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "Phân NPK 20-20-15",
    description: "Phân NPK hàm lượng cao, chuyên dùng cho cây ăn trái",
    joinedQuantity: 0,
    expectedPrice: 16500,
    originalPrice: 19500,
    discount: 15,
    discountAmount: 2900,
    membersCount: 8,
    days: 5,
    status: "active",
    category: "Phân bón",
    unit: "kg",
    supplier: "Công ty Phân bón Việt Phú",
    minOrderQuantity: 100,
    maxOrderQuantity: 2000,
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "3",
    name: "Thuốc trừ sâu Coni F",
    description: "Thuốc trừ sâu phổ rộng, hiệu quả cao",
    joinedQuantity: 0,
    expectedPrice: 85000,
    originalPrice: 95000,
    discount: 10,
    discountAmount: 10000,
    membersCount: 5,
    days: 3,
    status: "active",
    category: "Thuốc bảo vệ thực vật",
    unit: "chai",
    supplier: "Công ty CP Nông nghiệp Sông Đà",
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    createdAt: "2024-01-13T14:30:00Z",
    updatedAt: "2024-01-13T14:30:00Z",
  },
  {
    id: "4",
    name: "Hạt giống rau sạch",
    description: "Hạt giống rau sạch, không biến đổi gen",
    joinedQuantity: 200,
    expectedPrice: 45000,
    originalPrice: 55000,
    discount: 18,
    discountAmount: 10000,
    membersCount: 15,
    days: 1,
    status: "joined",
    category: "Hạt giống",
    unit: "gói",
    supplier: "Công ty Hạt giống Nông nghiệp",
    minOrderQuantity: 10,
    maxOrderQuantity: 100,
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
  },
  {
    id: "5",
    name: "Phân hữu cơ vi sinh",
    description: "Phân hữu cơ vi sinh cải tạo đất",
    joinedQuantity: 0,
    expectedPrice: 12000,
    originalPrice: 15000,
    discount: 20,
    discountAmount: 3000,
    membersCount: 3,
    days: 0,
    status: "closed",
    category: "Phân bón",
    unit: "kg",
    supplier: "Công ty Phân hữu cơ Xanh",
    minOrderQuantity: 200,
    maxOrderQuantity: 5000,
    createdAt: "2024-01-10T11:00:00Z",
    updatedAt: "2024-01-10T11:00:00Z",
  },
  {
    id: "6",
    name: "Vôi bột nông nghiệp",
    description: "Vôi bột cải tạo đất, tăng pH cho đất chua",
    joinedQuantity: 0,
    expectedPrice: 2500,
    originalPrice: 3000,
    discount: 17,
    discountAmount: 500,
    membersCount: 20,
    days: 7,
    status: "active",
    category: "Vật tư cải tạo đất",
    unit: "bao",
    supplier: "Công ty Vôi Nông nghiệp Tiên Phong",
    minOrderQuantity: 10,
    maxOrderQuantity: 100,
    createdAt: "2024-01-16T07:30:00Z",
    updatedAt: "2024-01-16T07:30:00Z",
  },
  {
    id: "7",
    name: "Màng phủ nông nghiệp",
    description: "Màng phủ chống dột, giữ ẩm cho cây trồng",
    joinedQuantity: 0,
    expectedPrice: 35000,
    originalPrice: 42000,
    discount: 17,
    discountAmount: 7000,
    membersCount: 6,
    days: 4,
    status: "active",
    category: "Vật tư nông nghiệp",
    unit: "cuộn",
    supplier: "Công ty Nhựa Nông nghiệp Sông Đồng",
    minOrderQuantity: 5,
    maxOrderQuantity: 50,
    createdAt: "2024-01-15T15:45:00Z",
    updatedAt: "2024-01-15T15:45:00Z",
  },
  {
    id: "8",
    name: "Phân urê 46%",
    description: "Phân urê hàm lượng đạm cao, phù hợp cho giai đoạn phát triển",
    joinedQuantity: 0,
    expectedPrice: 22000,
    originalPrice: 26000,
    discount: 15,
    discountAmount: 4000,
    membersCount: 18,
    days: 6,
    status: "active",
    category: "Phân bón",
    unit: "kg",
    supplier: "Công ty Phân đạm Cà Mau",
    minOrderQuantity: 100,
    maxOrderQuantity: 3000,
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "9",
    name: "Thuốc diệt cỏ Lontrel",
    description: "Thuốc diệt cỏ chọn lọc, an toàn cho cây trồng",
    joinedQuantity: 0,
    expectedPrice: 120000,
    originalPrice: 145000,
    discount: 17,
    discountAmount: 25000,
    membersCount: 4,
    days: 3,
    status: "active",
    category: "Thuốc bảo vệ thực vật",
    unit: "chai",
    supplier: "Công ty Syngenta Việt Nam",
    minOrderQuantity: 2,
    maxOrderQuantity: 20,
    createdAt: "2024-01-13T11:20:00Z",
    updatedAt: "2024-01-13T11:20:00Z",
  },
  {
    id: "10",
    name: "Tưới nhỏ giọt",
    description: "Hệ thống tưới nhỏ giọt tiết kiệm nước, tăng năng suất",
    joinedQuantity: 0,
    expectedPrice: 85000,
    originalPrice: 100000,
    discount: 15,
    discountAmount: 15000,
    membersCount: 7,
    days: 5,
    status: "active",
    category: "Thiết bị tưới",
    unit: "bộ",
    supplier: "Công ty Nông nghiệp Công nghệ cao",
    minOrderQuantity: 3,
    maxOrderQuantity: 30,
    createdAt: "2024-01-12T16:30:00Z",
    updatedAt: "2024-01-12T16:30:00Z",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API service that uses existing apiClient structure
class GroupOrderApiService {
  async getProducts(
    filter?: "active" | "joined" | "closed",
  ): Promise<ApiResponse<GroupOrderProduct[]>> {
    await delay(800); // Simulate network delay

    let filteredProducts = mockProducts;

    if (filter) {
      filteredProducts = mockProducts.filter(
        (product) => product.status === filter,
      );
    }

    return {
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
      page: 1,
      limit: 10,
    };
  }

  async getProductById(id: string): Promise<ApiResponse<GroupOrderProduct>> {
    await delay(500);

    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return {
        success: false,
        data: null as any,
        message: "Product not found",
      };
    }

    return {
      success: true,
      data: product,
    };
  }

  async joinOrder(request: JoinOrderRequest): Promise<JoinOrderResponse> {
    await delay(1000);

    const product = mockProducts.find((p) => p.id === request.productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (product.status !== "active") {
      return {
        success: false,
        message: "Product is not available for joining",
      };
    }

    if (request.quantity < (product.minOrderQuantity || 1)) {
      return {
        success: false,
        message: `Minimum order quantity is ${product.minOrderQuantity || 1} ${product.unit || "unit"}`,
      };
    }

    // Update product status and quantities
    product.status = "joined";
    product.joinedQuantity = request.quantity;
    product.membersCount += 1;
    product.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: "Successfully joined the order",
      order: product,
    };
  }

  async leaveOrder(productId: string): Promise<JoinOrderResponse> {
    await delay(800);

    const product = mockProducts.find((p) => p.id === productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    if (product.status !== "joined") {
      return {
        success: false,
        message: "You have not joined this order",
      };
    }

    // Update product status
    product.status = "active";
    product.joinedQuantity = 0;
    product.membersCount -= 1;
    product.updatedAt = new Date().toISOString();

    return {
      success: true,
      message: "Successfully left the order",
      order: product,
    };
  }

  // Real API methods (commented out for now, ready for BE integration)
  /*
  async getProducts(filter?: 'active' | 'joined' | 'closed'): Promise<ApiResponse<GroupOrderProduct[]>> {
    const params = new URLSearchParams();
    if (filter) params.append('status', filter);
    
    const response = await apiClient.get(`${GROUP_ORDER_API.PRODUCTS}?${params}`);
    return response.data;
  }

  async getProductById(id: string): Promise<ApiResponse<GroupOrderProduct>> {
    const response = await apiClient.get(GROUP_ORDER_API.PRODUCT_BY_ID(id));
    return response.data;
  }

  async joinOrder(request: JoinOrderRequest): Promise<JoinOrderResponse> {
    const response = await apiClient.post(GROUP_ORDER_API.JOIN_ORDER, request);
    return response.data;
  }

  async leaveOrder(productId: string): Promise<JoinOrderResponse> {
    const response = await apiClient.post(GROUP_ORDER_API.LEAVE_ORDER, { productId });
    return response.data;
  }
  */
}

export const groupOrderApi = new GroupOrderApiService();
export default groupOrderApi;
