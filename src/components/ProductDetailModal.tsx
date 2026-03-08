import { groupOrderApi } from "@/src/services/groupOrder.api";
import { GroupOrderProduct } from "@/src/type/groupOrder.type";
import { X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProductDetailModalProps {
  visible: boolean;
  onClose: () => void;
  productId: string | null;
}

function DetailRow({
  label,
  value,
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex flex-row justify-between py-2 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-sm font-medium ${valueClassName}`}>{value}</Text>
    </View>
  );
}

export function ProductDetailModal({
  visible,
  onClose,
  productId,
}: ProductDetailModalProps) {
  const [product, setProduct] = React.useState<GroupOrderProduct | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [joining, setJoining] = React.useState(false);

  // Load product details when modal opens
  React.useEffect(() => {
    if (visible && productId) {
      loadProductDetails();
    }
  }, [visible, productId]);

  const loadProductDetails = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await groupOrderApi.getProductById(productId);
      if (response.success) {
        setProduct(response.data);
      } else {
        console.error("Failed to load product details:", response.message);
      }
    } catch (error) {
      console.error("Error loading product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrder = async () => {
    if (!product) return;

    setJoining(true);
    try {
      const response = await groupOrderApi.joinOrder({
        productId: product.id,
        quantity: product.minOrderQuantity || 100,
      });
      if (response.success) {
        // Reload product details to show updated status
        await loadProductDetails();
        console.log("Successfully joined order:", response.message);
      } else {
        console.error("Failed to join order:", response.message);
      }
    } catch (error) {
      console.error("Error joining order:", error);
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveOrder = async () => {
    if (!product) return;

    try {
      const response = await groupOrderApi.leaveOrder(product.id);
      if (response.success) {
        // Reload product details to show updated status
        await loadProductDetails();
        console.log("Successfully left order:", response.message);
      } else {
        console.error("Failed to leave order:", response.message);
      }
    } catch (error) {
      console.error("Error leaving order:", error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white m-4 rounded-2xl w-[90%] max-h-[80%]">
          {/* Modal Header */}
          <View className="flex flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
            <Text className="text-base font-semibold text-gray-900">
              {loading ? "Đang tải..." : product?.name || "Chi tiết sản phẩm"}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-4"
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          >
            {loading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="mt-2 text-sm text-gray-600">
                  Đang tải chi tiết...
                </Text>
              </View>
            ) : product ? (
              <>
                {/* Joined info */}
                {product.status === "joined" ? (
                  <Text className="text-xs text-gray-500 mt-3 mb-1">
                    Bạn đã tham gia • Số lượng: {product.joinedQuantity}
                    {product.unit || "kg"}
                  </Text>
                ) : (
                  <Text className="text-xs text-gray-500 mt-3 mb-1">
                    {product.supplier && `Nhà cung cấp: ${product.supplier}`}
                  </Text>
                )}

                {/* Price Section */}
                <View className="bg-red-50 border border-red-100 rounded-xl p-4 mt-2 mb-4">
                  <View className="flex flex-row justify-between items-baseline mb-1">
                    <Text className="text-sm text-gray-600">Giá dự kiến</Text>
                    <Text className="text-xl font-bold text-red-600">
                      {product.expectedPrice.toLocaleString("vi-VN")} đ/
                      {product.unit || "kg"}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between items-center">
                    <Text className="text-sm text-gray-500">Chi tiết</Text>
                    <Text className="text-sm font-semibold text-emerald-600">
                      -{product.discount}% (
                      {product.discountAmount.toLocaleString("vi-VN")} đ/
                      {product.unit || "kg"})
                    </Text>
                  </View>
                </View>

                {/* Description */}
                {product.description && (
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-800 mb-1">
                      Mô tả
                    </Text>
                    <Text className="text-sm text-gray-600 leading-5">
                      {product.description}
                    </Text>
                  </View>
                )}

                {/* Details */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-800 mb-1">
                    Thông tin đơn hàng
                  </Text>

                  <DetailRow
                    label="Số lượng tối thiểu"
                    value={`${product.minOrderQuantity || 1} ${product.unit || "kg"}`}
                  />
                  {product.category && (
                    <DetailRow label="Danh mục" value={product.category} />
                  )}
                  <DetailRow
                    label="Số người tham gia"
                    value={`${product.membersCount} người`}
                  />
                  <DetailRow
                    label="Thời gian còn lại"
                    value={
                      product.days > 0
                        ? `Còn ${product.days} ngày`
                        : product.status === "closed"
                          ? "Đã đóng"
                          : "Hôm nay"
                    }
                    valueClassName={
                      product.days <= 1
                        ? "text-orange-500 font-semibold"
                        : "text-gray-900"
                    }
                  />
                  {product.maxOrderQuantity && (
                    <DetailRow
                      label="Số lượng tối đa"
                      value={`${product.maxOrderQuantity} ${product.unit || "kg"}`}
                    />
                  )}
                </View>

                {/* Divider */}
                <View className="h-px bg-gray-100 my-2" />

                {/* Product preview summary */}
                <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                  <Text className="text-xs text-gray-500 mb-1">
                    {product.status === "joined"
                      ? `Bạn đã tham gia • Số lượng: ${product.joinedQuantity}${product.unit || "kg"}`
                      : `${product.membersCount} người tham gia`}
                  </Text>
                  <View className="flex flex-row justify-between items-baseline mb-1">
                    <Text className="text-sm text-gray-600">Giá dự kiến</Text>
                    <Text className="text-base font-bold text-red-600">
                      {product.expectedPrice.toLocaleString("vi-VN")} đ/
                      {product.unit || "kg"}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
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
                </View>
              </>
            ) : (
              <View className="items-center justify-center py-8">
                <Text className="text-sm text-gray-500">
                  Không thể tải thông tin sản phẩm
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Buttons */}
          {product && !loading && (
            <View className="px-4 pt-2 pb-4 border-t border-gray-100 bg-white">
              <View className="flex flex-row gap-3">
                {product.status === "joined" ? (
                  <>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl bg-blue-500 opacity-70"
                      disabled={true}
                    >
                      <Text className="text-white font-semibold text-sm">
                        Đã tham gia
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                      onPress={onClose}
                    >
                      <Text className="text-gray-700 font-semibold text-sm">
                        Đóng
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : product.status === "active" ? (
                  <>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl bg-emerald-500"
                      onPress={handleJoinOrder}
                      disabled={joining}
                    >
                      {joining ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white font-semibold text-sm">
                          Đăng ký tham gia
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                      onPress={onClose}
                    >
                      <Text className="text-gray-700 font-semibold text-sm">
                        Đóng
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl bg-gray-400 opacity-70"
                      disabled={true}
                    >
                      <Text className="text-white font-semibold text-sm">
                        Đã đóng
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 h-12 items-center justify-center rounded-xl border border-gray-300 bg-white"
                      onPress={onClose}
                    >
                      <Text className="text-gray-700 font-semibold text-sm">
                        Đóng
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
