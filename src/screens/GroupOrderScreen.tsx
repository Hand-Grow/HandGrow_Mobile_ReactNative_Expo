import { ProductDetailModal } from "@/src/components/ProductDetailModal";
import { Button } from "@/src/components/ui/button/index";
import { groupOrderApi } from "@/src/services/groupOrder.api";
import { GroupBuyCampaign } from "@/src/type/groupOrder.type";
import { ArrowLeft, Calendar, TrendingDown, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CampaignCardProps {
  campaign: GroupBuyCampaign;
  onJoinCampaign?: (campaignId: string) => void;
  onLeaveCampaign?: (campaignId: string) => void;
  onViewDetails?: (campaignId: string) => void;
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

function CampaignCard({
  campaign,
  onJoinCampaign,
  onLeaveCampaign,
  onViewDetails,
  isLoading = false,
}: CampaignCardProps) {
  const handleJoinPress = () => {
    if (onJoinCampaign && !isLoading) {
      onJoinCampaign(campaign.id);
    }
  };

  const handleLeavePress = () => {
    if (onLeaveCampaign && !isLoading) {
      onLeaveCampaign(campaign.id);
    }
  };

  const handleDetailsPress = () => {
    if (onViewDetails) {
      onViewDetails(campaign.id);
    }
  };

  const hasJoined = !!campaign.userParticipation;
  const daysLeft = Math.ceil(
    (new Date(campaign.deadlineDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <View className="mx-4 mb-4 rounded-2xl border border-gray-200 bg-white p-4">
      <Text className="mb-2 font-semibold text-gray-900">{campaign.title}</Text>

      <Text className="mb-3 text-sm font-medium text-emerald-700">
        {campaign.productName}
      </Text>

      <Text className="mb-4 text-xs text-gray-600 line-clamp-2">
        {campaign.description}
      </Text>

      <View className="mb-3 flex flex-row items-center gap-2">
        <Users size={14} color="#6b7280" />
        <Text className="text-xs text-gray-500">
          {campaign.cooperativeName}
        </Text>
      </View>

      {hasJoined && (
        <View className="mb-3 rounded-lg bg-blue-50 p-3">
          <Text className="mb-1 text-xs font-medium text-blue-800">
            Bạn đã tham gia
          </Text>
          <Text className="text-xs text-blue-600">
            Số lượng: {campaign.userParticipation!.committedQty} kg
          </Text>
        </View>
      )}

      <View className="mb-3">
        <View className="mb-2 flex flex-row justify-between">
          <Text className="text-xs text-gray-600">
            {campaign.totalCommittedQty} kg
          </Text>
          <Text className="text-xs text-gray-600">
            {campaign.participationCount} người tham gia
          </Text>
        </View>
        <View className="mb-2 h-2 rounded-full bg-gray-200">
          <View
            className="h-2 rounded-full bg-emerald-500"
            style={{ width: `${Math.min(campaign.progressPercent, 100)}%` }}
          />
        </View>
        <Text className="text-xs text-gray-500">{campaign.nextTierLabel}</Text>
      </View>

      <View className="mb-4 flex flex-row justify-between">
        <View>
          <Text className="text-xs text-gray-600">Giá hiện tại</Text>
          <Text className="text-lg font-bold text-red-600">
            {campaign.currentUnitPrice.toLocaleString("vi-VN")} đ
          </Text>
          <Text className="text-xs text-gray-600">/kg</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500">
            {daysLeft > 0
              ? `Còn ${daysLeft} ngày`
              : campaign.status === "CLOSED"
                ? "Đã đóng"
                : "Hôm nay"}
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-3">
        {hasJoined ? (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-blue-500 opacity-70"
              disabled={true}
            >
              <Text className="font-medium text-white">Đã tham gia</Text>
            </Button>
          </>
        ) : campaign.status === "GATHERING" ? (
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
          </>
        ) : (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-gray-400 opacity-70"
              disabled={true}
            >
              <Text className="font-medium text-white">Đã đóng</Text>
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

export default function GroupOrderScreen() {
  const [campaigns, setCampaigns] = useState<GroupBuyCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [joiningCampaignId, setJoiningCampaignId] = useState<string | null>(
    null,
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedCampaignForJoin, setSelectedCampaignForJoin] =
    useState<GroupBuyCampaign | null>(null);
  const [quantity, setQuantity] = useState("");

  const loadCampaigns = async () => {
    try {
      const response = await groupOrderApi.getCampaigns("gathering");
      if (response.success) {
        setCampaigns(response.data);
      } else {
        console.error("Failed to load campaigns:", response.message);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadCampaigns();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
  };

  const handleJoinCampaign = async (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign) {
      setSelectedCampaignForJoin(campaign);
      setJoinModalVisible(true);
      setQuantity("");
    }
  };

  const confirmJoinCampaign = async () => {
    if (!selectedCampaignForJoin || !quantity) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      alert("Vui lòng nhập số lượng hợp lệ");
      return;
    }

    setJoiningCampaignId(selectedCampaignForJoin.id);
    try {
      const response = await groupOrderApi.joinCampaign(
        selectedCampaignForJoin.id,
        {
          committedQty: qty,
        },
      );
      if (response.success) {
        await loadCampaigns();
        setJoinModalVisible(false);
        setSelectedCampaignForJoin(null);
        setQuantity("");
        alert("Tham gia chiến dịch thành công!");
      } else {
        console.error("Failed to join campaign:", response.message);
        alert(response.message || "Không thể tham gia chiến dịch");
      }
    } catch (error: any) {
      console.error("Error joining campaign:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại";
      alert(errorMessage);
    } finally {
      setJoiningCampaignId(null);
    }
  };

  const handleLeaveCampaign = async (campaignId: string) => {
    try {
      const response = await groupOrderApi.leaveCampaign(campaignId);
      if (response.success) {
        await loadCampaigns();
      } else {
        console.error("Failed to leave campaign:", response.message);
      }
    } catch (error) {
      console.error("Error leaving campaign:", error);
    }
  };

  const handleViewDetails = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setDetailModalVisible(false);
    setSelectedCampaignId(null);
  };

  const handleCloseJoinModal = () => {
    setJoinModalVisible(false);
    setSelectedCampaignForJoin(null);
    setQuantity("");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Header />

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
        ) : campaigns.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-sm text-gray-500">
              Không có chiến dịch nào
            </Text>
          </View>
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onJoinCampaign={handleJoinCampaign}
              onLeaveCampaign={handleLeaveCampaign}
              onViewDetails={handleViewDetails}
              isLoading={joiningCampaignId === campaign.id}
            />
          ))
        )}
      </ScrollView>

      <ProductDetailModal
        visible={detailModalVisible}
        onClose={handleCloseModal}
        campaignId={selectedCampaignId}
      />

      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseJoinModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Tham gia chiến dịch mua chung
            </Text>

            {selectedCampaignForJoin && (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  {selectedCampaignForJoin.title}
                </Text>
                <Text className="mb-2 text-xs text-gray-500">
                  {selectedCampaignForJoin.productName}
                </Text>
                <Text className="text-xs text-emerald-600">
                  Giá hiện tại:{" "}
                  {selectedCampaignForJoin.currentUnitPrice.toLocaleString(
                    "vi-VN",
                  )}{" "}
                  đ/kg
                </Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Số lượng (kg)
              </Text>
              <TextInput
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Nhập số lượng muốn mua"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>

            <View className="flex flex-row gap-3">
              <Button
                variant="outline"
                className="h-10 flex-1 rounded-lg"
                onPress={handleCloseJoinModal}
              >
                <Text className="font-medium text-gray-700">Hủy</Text>
              </Button>
              <Button
                className="h-10 flex-1 rounded-lg bg-emerald-500"
                onPress={confirmJoinCampaign}
                disabled={!quantity || joiningCampaignId !== null}
              >
                {joiningCampaignId ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-medium text-white">Xác nhận</Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
