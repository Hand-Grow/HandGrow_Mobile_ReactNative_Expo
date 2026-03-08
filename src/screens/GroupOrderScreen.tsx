import { ProductDetailModal } from "@/src/components/ProductDetailModal";
import { Button } from "@/src/components/ui/button/index";
import { groupOrderApi } from "@/src/services/groupOrder.api";
import { GroupOrderProduct } from "@/src/type/groupOrder.type";
import { ArrowLeft, TrendingDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductCardProps {
  product: GroupOrderProduct;
  onJoinOrder?: (productId: string) => void;
  onLeaveOrder?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
  isLoading?: boolean;
}

function Header() {
  return (
    <SafeAreaView className="bg-emerald-500">
      <View className="flex flex-row items-center gap-3 px-4 py-3">
        <TouchableOpacity className="p-1">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-white">
            Mua chung vật tư tại HTX Nông nghiệp An Phước
          </Text>
          <Text className="text-xs text-white opacity-90">
            125 thành viên • Tân Phú, TP.HCM
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProductCard({
  product,
  onJoinOrder,
  onLeaveOrder,
  onViewDetails,
  isLoading = false,
}: ProductCardProps) {
  const handleJoinPress = () => {
    if (onJoinOrder && !isLoading) {
      onJoinOrder(product.id);
    }
  };

  const handleLeavePress = () => {
    if (onLeaveOrder && !isLoading) {
      onLeaveOrder(product.id);
    }
  };

  const handleDetailsPress = () => {
    if (onViewDetails) {
      onViewDetails(product.id);
    }
  };

  return (
    <View className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4">
      {/* Product Name */}
      <Text className="mb-3 font-semibold text-gray-900">{product.name}</Text>

      {/* Product Description */}
      {product.description && (
        <Text className="mb-3 text-xs text-gray-600">
          {product.description}
        </Text>
      )}

      {/* Info rows */}
      {product.status === "joined" ? (
        <View className="mb-1 flex flex-row justify-between">
          <Text className="text-xs text-gray-500">
            Bạn đã tham gia • Số lượng: {product.joinedQuantity}
            {product.unit || "kg"}
          </Text>
        </View>
      ) : (
        <View className="mb-1 flex flex-row justify-between">
          <Text className="text-xs text-gray-500">
            {product.supplier && `Nhà cung cấp: ${product.supplier}`}
          </Text>
          {product.minOrderQuantity && (
            <Text className="text-xs text-gray-500">
              Tối thiểu: {product.minOrderQuantity}
              {product.unit || "kg"}
            </Text>
          )}
        </View>
      )}

      <View className="mb-1 flex flex-row justify-between">
        <Text className="text-xs text-gray-600">Giá dự kiến</Text>
        <Text className="text-sm font-bold text-red-600">
          {product.expectedPrice.toLocaleString("vi-VN")} đ/
          {product.unit || "kg"}
        </Text>
      </View>

      <View className="mb-1 flex flex-row justify-between">
        <Text className="text-xs text-gray-600">Tiết kiệm</Text>
        <Text className="text-xs font-semibold text-emerald-600">
          -{product.discount}% ({product.discountAmount.toLocaleString("vi-VN")}{" "}
          đ/{product.unit || "kg"})
        </Text>
      </View>

      <View className="mb-4 flex flex-row justify-between">
        <Text className="text-xs text-gray-500">
          {product.membersCount} người tham gia
        </Text>
        <Text className="text-xs text-gray-500">
          {product.days > 0
            ? `Còn ${product.days} ngày`
            : product.status === "closed"
              ? "Đã đóng"
              : "Hôm nay"}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex flex-row gap-3">
        {product.status === "joined" ? (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-blue-500 opacity-70"
              disabled={true}
            >
              <Text className="font-medium text-white">Đã tham gia</Text>
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-lg border-gray-300"
              onPress={handleDetailsPress}
            >
              <Text className="font-medium text-gray-700">Xem chi tiết</Text>
            </Button>
          </>
        ) : product.status === "active" ? (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-emerald-500"
              onPress={handleJoinPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-medium text-white">Đăng ký tham gia</Text>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-lg border-gray-300"
              onPress={handleDetailsPress}
            >
              <Text className="font-medium text-gray-700">Xem chi tiết</Text>
            </Button>
          </>
        ) : (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-gray-400 opacity-70"
              disabled={true}
            >
              <Text className="font-medium text-white">Đã đóng</Text>
            </Button>
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-lg border-gray-300"
              onPress={handleDetailsPress}
            >
              <Text className="font-medium text-gray-700">Xem chi tiết</Text>
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

export default function GroupOrderScreen() {
  const [activeTab, setActiveTab] = useState<"active" | "joined" | "closed">(
    "active",
  );
  const [products, setProducts] = useState<GroupOrderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningProductId, setJoiningProductId] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const tabs: { key: "active" | "joined" | "closed"; label: string }[] = [
    { key: "active", label: "Đang hoạt động" },
    { key: "joined", label: "Đã tham gia" },
    { key: "closed", label: "Đã đóng" },
  ];

  const loadProducts = async (tab: "active" | "joined" | "closed") => {
    try {
      const response = await groupOrderApi.getProducts(tab);
      if (response.success) {
        setProducts(response.data);
      } else {
        console.error("Failed to load products:", response.message);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProducts(activeTab);
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts(activeTab);
  };

  const handleJoinOrder = async (productId: string) => {
    setJoiningProductId(productId);
    try {
      const response = await groupOrderApi.joinOrder({
        productId,
        quantity: 100,
      });
      if (response.success) {
        // Refresh the current tab to show updated status
        await loadProducts(activeTab);
        console.log("Successfully joined order:", response.message);
      } else {
        console.error("Failed to join order:", response.message);
      }
    } catch (error) {
      console.error("Error joining order:", error);
    } finally {
      setJoiningProductId(null);
    }
  };

  const handleLeaveOrder = async (productId: string) => {
    try {
      const response = await groupOrderApi.leaveOrder(productId);
      if (response.success) {
        // Refresh the current tab to show updated status
        await loadProducts(activeTab);
        console.log("Successfully left order:", response.message);
      } else {
        console.error("Failed to leave order:", response.message);
      }
    } catch (error) {
      console.error("Error leaving order:", error);
    }
  };

  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    setDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedProductId(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header />

      {/* Info Banner */}
      <View className="mx-4 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <View className="mb-1 flex flex-row items-center gap-2">
          <TrendingDown size={16} color="#059669" />
          <Text className="text-sm font-semibold text-emerald-900">
            Tiết kiệm chi phí đến 30%
          </Text>
        </View>
        <Text className="text-xs text-emerald-800">
          Gom đơn với các nông dân khác để được giá sỉ tốt nhất từ nhà cung cấp
        </Text>
      </View>

      {/* Filter Tabs */}
      <View className="flex flex-row gap-2 px-4 pt-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`rounded-full px-4 py-2 ${
              activeTab === tab.key
                ? "bg-emerald-600"
                : "border border-gray-300 bg-white"
            }`}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              className={`text-xs font-medium ${
                activeTab === tab.key ? "text-white" : "text-gray-700"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products List */}
      <ScrollView
        className="flex-1 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="mt-2 text-sm text-gray-600">Đang tải...</Text>
          </View>
        ) : products.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-sm text-gray-500">Không có sản phẩm nào</Text>
          </View>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onJoinOrder={handleJoinOrder}
              onLeaveOrder={handleLeaveOrder}
              onViewDetails={handleViewDetails}
              isLoading={joiningProductId === product.id}
            />
          ))
        )}
      </ScrollView>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={detailModalVisible}
        onClose={handleCloseModal}
        productId={selectedProductId}
      />
    </View>
  );
}
