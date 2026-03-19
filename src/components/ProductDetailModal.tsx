import { groupOrderApi } from "@/src/services/groupOrder.api";
import { GroupBuyCampaign } from "@/src/type/groupOrder.type";
import {
  CheckCircle,
  Clock,
  TrendingDown,
  Users,
  X,
} from "lucide-react-native";
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
  campaignId: string | null;
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
    <View className="flex flex-row justify-between py-3 border-b border-gray-100">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-sm font-medium ${valueClassName}`}>{value}</Text>
    </View>
  );
}

export function ProductDetailModal({
  visible,
  onClose,
  campaignId,
}: ProductDetailModalProps) {
  const [campaign, setCampaign] = React.useState<GroupBuyCampaign | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (visible && campaignId) {
      loadCampaignDetails();
    }
  }, [visible, campaignId]);

  const loadCampaignDetails = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const response = await groupOrderApi.getCampaignById(campaignId);

      if (response && response.success) {
        setCampaign(response.data);
      } else {
        setCampaign(null);
      }
    } catch (error) {
      setCampaign(null);
    } finally {
      setLoading(false);
    }
  };

  const daysLeft = campaign
    ? Math.ceil(
        (new Date(campaign.deadlineDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="mx-4 w-full max-w-md bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <View className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-white flex-1">
                Chi tiết chiến dịch
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full bg-white/20"
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6 py-4">
            {loading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="mt-2 text-sm text-gray-600">Đang tải...</Text>
              </View>
            ) : campaign ? (
              <View>
                <View className="mb-6">
                  <Text className="text-xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </Text>
                  <View className="flex-row items-center gap-2 mb-3">
                    <View className="px-2 py-1 rounded-lg bg-emerald-100">
                      <Text className="text-xs font-semibold text-emerald-700">
                        {campaign.productName}
                      </Text>
                    </View>
                  </View>

                  {/* Key Info */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-lg font-bold text-red-600">
                        {campaign.currentUnitPrice.toLocaleString("vi-VN")} đ/kg
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Clock size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600">
                          {daysLeft > 0
                            ? `Còn ${daysLeft} ngày`
                            : campaign.status === "CLOSED"
                              ? "Đã đóng"
                              : "Hôm nay"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-2">
                        <Users size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-700">
                          {campaign.participationCount} người tham gia
                        </Text>
                      </View>
                      <Text className="text-sm font-bold text-emerald-600">
                        {campaign.totalCommittedQty} kg
                      </Text>
                    </View>
                  </View>
                </View>

                {/* User Participation Status */}
                {campaign.userParticipation && (
                  <View className="mb-4">
                    <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <View className="flex-row items-center gap-2 mb-2">
                        <CheckCircle size={16} color="#3b82f6" />
                        <Text className="text-sm font-semibold text-blue-800">
                          Bạn đã tham gia chiến dịch
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-blue-600">
                          Số lượng: {campaign.userParticipation.committedQty} kg
                        </Text>
                        <Text className="text-xs font-semibold text-blue-800">
                          {campaign.userParticipation.totalAmount.toLocaleString(
                            "vi-VN",
                          )}{" "}
                          đ
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Description */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-900 mb-2">
                    Mô tả
                  </Text>
                  <Text className="text-sm text-gray-600 leading-relaxed">
                    {campaign.description}
                  </Text>
                </View>

                {/* HTX Info */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-900 mb-3">
                    Thông tin hợp tác xã
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <View className="p-3 rounded-lg bg-gray-100">
                      <Users size={16} color="#6b7280" />
                    </View>
                    <View>
                      <Text className="text-sm font-medium text-gray-900">
                        {campaign.cooperativeName}
                      </Text>
                      <Text className="text-xs text-gray-500">Hợp tác xã</Text>
                    </View>
                  </View>
                </View>

                {/* Progress Info */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-900 mb-3">
                    Tiến độ chiến dịch
                  </Text>
                  <View className="bg-gray-50 rounded-xl p-4">
                    <View className="mb-2">
                      <View className="mb-2 flex-row justify-between">
                        <Text className="text-xs text-gray-500">Tiến độ</Text>
                        <Text className="text-xs font-bold text-emerald-600">
                          {campaign.progressPercent.toFixed(0)}%
                        </Text>
                      </View>
                      <View className="h-3 rounded-full bg-gray-200 overflow-hidden">
                        <View
                          className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                          style={{
                            width: `${Math.min(campaign.progressPercent, 100)}%`,
                          }}
                        />
                      </View>
                    </View>
                    <Text className="text-xs text-gray-600 italic">
                      {campaign.nextTierLabel}
                    </Text>
                  </View>
                </View>

                {/* Price and Deadline Details */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-900 mb-3">
                    Thông tin giá và thời gian
                  </Text>
                  <View>
                    <DetailRow
                      label="Giá hiện tại"
                      value={`${campaign.currentUnitPrice.toLocaleString("vi-VN")} đ/kg`}
                      valueClassName="text-red-600 font-bold"
                    />
                    <DetailRow
                      label="Thời gian còn lại"
                      value={
                        daysLeft > 0
                          ? `Còn ${daysLeft} ngày`
                          : campaign.status === "CLOSED"
                            ? "Đã đóng"
                            : "Hôm nay"
                      }
                    />
                    <DetailRow
                      label="Hạn chót"
                      value={new Date(campaign.deadlineDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    />
                  </View>
                </View>

                {/* Benefits */}
                <View className="mb-6">
                  <Text className="text-sm font-medium text-gray-900 mb-3">
                    Lợi ích khi tham gia
                  </Text>
                  <View className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <View className="flex-row items-center gap-2 mb-2">
                      <TrendingDown size={16} color="#059669" />
                      <Text className="text-sm font-semibold text-emerald-900">
                        Tiết kiệm chi phí đến 30%
                      </Text>
                    </View>
                    <Text className="text-xs text-emerald-800">
                      Gom đơn với các nông dân khác để được giá sỉ tốt nhất từ
                      nhà cung cấp
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="py-8 items-center">
                <Text className="text-sm text-gray-500">
                  Không tìm thấy thông tin chiến dịch
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
