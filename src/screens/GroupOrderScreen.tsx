import { ProductDetailModal } from "@/src/components/ProductDetailModal";
import { Button } from "@/src/components/ui/button/index";
import { groupOrderApi } from "@/src/services/groupOrder.api";
import { GroupBuyCampaign } from "@/src/type/groupOrder.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { ArrowLeft, Calendar, TrendingDown, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
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
  onEditCampaign?: (campaignId: string) => void;
  onViewDetails?: (campaignId: string) => void;
  isLoading?: boolean;
}

function Header() {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="bg-emerald-500 pt-14 pb-6 px-6 rounded-b-[45px]">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity className="w-10" onPress={handleBack}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="flex-1 font-bold text-2xl text-white text-center">
          Mua chung vật tư
        </Text>
        <View className="w-10" />
      </View>
    </View>
  );
}

const getProgressColor = (progressPercent: number) => {
  if (progressPercent === 0) {
    return "bg-gray-300"; // Không có ai đăng ký - xám
  } else if (progressPercent < 50) {
    return "bg-orange-400"; // Đăng ký ít - cam
  } else if (progressPercent < 100) {
    return "bg-emerald-500"; // Đăng ký vừa - xanh lá
  } else {
    return "bg-red-500"; // Đủ/Quá - đỏ
  }
};

function CampaignCard({
  campaign,
  onJoinCampaign,
  onLeaveCampaign,
  onEditCampaign,
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

  const handleEditPress = () => {
    if (onEditCampaign && !isLoading) {
      onEditCampaign(campaign.id);
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
      <Text className="mb-2 font-semibold text-2xl text-gray-900">
        {campaign.title}
      </Text>

      <Text className="mb-3 text-xl font-medium text-emerald-700">
        {campaign.productName}
      </Text>

      <Text className="mb-4 text-xl text-gray-600 line-clamp-2">
        {campaign.description}
      </Text>

      <View className="mb-3 flex flex-row items-center gap-2">
        <Users size={24} color="#6b7280" />
        <Text className="text-lg text-gray-500">
          {campaign.cooperativeName}
        </Text>
      </View>

      {hasJoined && (
        <View className="mb-3 rounded-lg bg-blue-50 p-3">
          <Text className="mb-1 text-base font-medium text-blue-800">
            Bạn đã tham gia
          </Text>
          <Text className="text-base text-blue-600">
            Số lượng: {campaign.userParticipation!.committedQty} kg
          </Text>
        </View>
      )}

      <View className="mb-3">
        <View className="mb-2 flex flex-row justify-between">
          <Text className="text-base text-gray-600">
            {campaign.totalCommittedQty} kg
          </Text>
          <Text className="text-base text-gray-600">
            {campaign.participationCount} người tham gia
          </Text>
        </View>
        <View className="mb-2 h-2 rounded-full bg-gray-200">
          <View
            className={`h-2 rounded-full ${getProgressColor(campaign.progressPercent)}`}
            style={{ width: `${Math.min(campaign.progressPercent, 100)}%` }}
          />
        </View>
      </View>

      <View className="mb-4 flex flex-row justify-between">
        <View>
          <Text className="text-3xl font-bold text-red-600">
            {campaign.currentUnitPrice.toLocaleString("vi-VN")} đ
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Calendar size={16} color="#6b7280" />
          <Text className="text-base text-gray-500">
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
              className="h-10 flex-1 rounded-lg bg-emerald-500"
              onPress={handleEditPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white text-base">
                  Chỉnh sửa
                </Text>
              )}
            </Button>
            <Button
              className="h-10 flex-1 rounded-lg bg-red-500"
              onPress={handleLeavePress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-semibold text-white text-base">
                  Rời chiến dịch
                </Text>
              )}
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
                <Text className="font-semibold text-white text-base">
                  Đăng ký tham gia
                </Text>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              className="h-10 flex-1 rounded-lg bg-gray-400 opacity-70"
              disabled={true}
            >
              <Text className="font-medium text-white text-base">Đã đóng</Text>
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

  const saveParticipationState = async (campaigns: GroupBuyCampaign[]) => {
    try {
      const stateToSave = campaigns
        .filter((c) => c.userParticipation)
        .map((c) => ({
          id: c.id,
          userParticipation: c.userParticipation,
          status: c.status,
          progressPercent: c.progressPercent, // Save calculated progressPercent
          totalCommittedQty: c.totalCommittedQty, // Save updated totalCommittedQty
          participationCount: c.participationCount, // Save updated participationCount
        }));

      await AsyncStorage.setItem(
        "campaignParticipationState",
        JSON.stringify(stateToSave),
      );
    } catch (error) {
      console.error("Error saving participation state:", error);
    }
  };

  const restoreParticipationState = async (
    serverCampaigns: GroupBuyCampaign[],
  ) => {
    try {
      const savedState = await AsyncStorage.getItem(
        "campaignParticipationState",
      );

      if (savedState) {
        const parsedState = JSON.parse(savedState);

        const restoredCampaigns = serverCampaigns.map((serverCampaign) => {
          const savedCampaign = parsedState.find(
            (c: any) => c.id === serverCampaign.id,
          );

          if (savedCampaign?.userParticipation) {
            return {
              ...serverCampaign,
              userParticipation: savedCampaign.userParticipation,
              status:
                savedCampaign.status === "COMPLETED"
                  ? "COMPLETED"
                  : serverCampaign.status,
              // Prioritize saved values over server values
              progressPercent: savedCampaign.progressPercent,
              totalCommittedQty: savedCampaign.totalCommittedQty,
              participationCount: savedCampaign.participationCount,
            };
          }

          return serverCampaign;
        });

        return restoredCampaigns;
      }
    } catch (error) {
      console.error("Error restoring participation state:", error);
    }
    return serverCampaigns;
  };

  const loadCampaigns = async () => {
    try {
      const response = await groupOrderApi.getCampaigns("gathering");
      if (response.success) {
        const mergedCampaigns = await restoreParticipationState(response.data);
        setCampaigns(mergedCampaigns);
      }
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
  };

  const handleJoinCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(
      (c: GroupBuyCampaign) => c.id === campaignId,
    );
    if (campaign) {
      setSelectedCampaignForJoin(campaign);
      setJoinModalVisible(true);
      setQuantity("");
    }
  };

  const handleEditCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(
      (c: GroupBuyCampaign) => c.id === campaignId,
    );
    if (campaign && campaign.userParticipation) {
      setSelectedCampaignForJoin(campaign);
      setJoinModalVisible(true);
      setQuantity(campaign.userParticipation.committedQty.toString());
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
        if (response.campaign) {
          const updatedCampaign = response.campaign;
          setCampaigns((prevCampaigns) =>
            prevCampaigns.map((c) =>
              c.id === selectedCampaignForJoin.id ? updatedCampaign || c : c,
            ),
          );
        } else {
          setCampaigns((prevCampaigns) => {
            const firstUpdate = prevCampaigns.map((c) =>
              c.id === selectedCampaignForJoin.id
                ? {
                    ...c,
                    userParticipation: {
                      id: `temp_${Date.now()}`,
                      committedQty: qty,
                      lockedUnitPrice: c.currentUnitPrice,
                      totalAmount: qty * c.currentUnitPrice,
                    },
                    totalCommittedQty:
                      c.totalCommittedQty +
                      (c.userParticipation
                        ? qty - c.userParticipation.committedQty
                        : qty),
                    participationCount:
                      c.participationCount + (c.userParticipation ? 0 : 1),
                  }
                : c,
            );

            // Calculate progressPercent after updating totalCommittedQty
            const updatedCampaigns = firstUpdate.map((c) => {
              if (c.id === selectedCampaignForJoin.id) {
                // Extract target quantity from nextTierLabel if available
                let estimatedTarget = 0;
                const currentNextTierLabel =
                  selectedCampaignForJoin.nextTierLabel;
                if (
                  currentNextTierLabel &&
                  currentNextTierLabel.includes("Còn")
                ) {
                  const match =
                    currentNextTierLabel.match(/Còn ([\d.]+) bao nữa/);
                  if (match) {
                    const remaining = parseFloat(match[1]);
                    estimatedTarget = c.totalCommittedQty + remaining;
                  }
                } else if (
                  currentNextTierLabel &&
                  currentNextTierLabel.includes("Đã đạt giá sàn")
                ) {
                  // If already reached target price, assume current total is the target
                  estimatedTarget = c.totalCommittedQty;
                }

                const newProgressPercent =
                  estimatedTarget > 0
                    ? (c.totalCommittedQty / estimatedTarget) * 100
                    : c.progressPercent; // Keep original if can't calculate

                return {
                  ...c,
                  progressPercent: newProgressPercent,
                };
              }
              return c;
            });

            // Save the updated campaigns to AsyncStorage
            saveParticipationState(updatedCampaigns);
            return updatedCampaigns;
          });
        }

        // Don't save old campaigns here, it's already saved in the else block above

        setJoinModalVisible(false);
        setSelectedCampaignForJoin(null);
        setQuantity("");

        const message = selectedCampaignForJoin.userParticipation
          ? "Cập nhật số lượng thành công!"
          : "Tham gia chiến dịch thành công!";

        alert(message);
      } else {
        throw new Error(response.message || "API call failed");
      }
    } catch (error: any) {
      console.error("Error joining campaign:", error);
      alert(
        error?.message ||
          error?.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại",
      );
    } finally {
      setJoiningCampaignId(null);
    }
  };

  const handleLeaveCampaign = async (campaignId: string) => {
    try {
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              userParticipation: undefined,
              totalCommittedQty:
                c.totalCommittedQty - (c.userParticipation?.committedQty || 0),
              participationCount: c.participationCount - 1,
            }
          : c,
      );

      setCampaigns(updatedCampaigns);
      await saveParticipationState(updatedCampaigns);

      alert("Rời chiến dịch thành công!");
    } catch (error) {
      console.error("Error leaving campaign:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
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
          <TrendingDown size={18} color="#059669" />
          <Text className="text-base font-semibold text-emerald-900">
            Tiết kiệm chi phí đến 30%
          </Text>
        </View>
        <Text className="text-sm text-emerald-800">
          Gom đơn với các nông dân khác để được giá sỉ tốt nhất từ nhà cung cấp
        </Text>
      </View>

      <ScrollView
        className="flex-1 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="mt-2 text-base text-gray-600">Đang tải...</Text>
          </View>
        ) : campaigns.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-base text-gray-500">
              Không có chiến dịch nào
            </Text>
          </View>
        ) : (
          campaigns.map((campaign: GroupBuyCampaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onJoinCampaign={handleJoinCampaign}
              onLeaveCampaign={handleLeaveCampaign}
              onEditCampaign={handleEditCampaign}
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
            <Text className="text-lg font-semibold text-gray-900 flex-1">
              {selectedCampaignForJoin?.userParticipation
                ? "Chỉnh sửa tham gia"
                : "Đăng ký tham gia"}
            </Text>

            {selectedCampaignForJoin && (
              <View className="mb-4">
                <Text className="mb-2 text-base font-medium text-gray-700">
                  {selectedCampaignForJoin.title}
                </Text>
                <Text className="mb-2 text-sm text-gray-500">
                  {selectedCampaignForJoin.productName}
                </Text>
                <Text className="text-sm text-emerald-600">
                  Giá hiện tại:{" "}
                  {selectedCampaignForJoin.currentUnitPrice.toLocaleString(
                    "vi-VN",
                  )}{" "}
                  đ/kg
                </Text>
              </View>
            )}

            <View className="mb-4">
              <Text className="mb-2 text-base font-medium text-gray-700">
                Số lượng (kg)
              </Text>
              <TextInput
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
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
                <Text className="font-semibold text-gray-700 text-base">
                  Hủy
                </Text>
              </Button>
              <Button
                className="h-10 flex-1 rounded-lg bg-emerald-500"
                onPress={confirmJoinCampaign}
                disabled={!quantity || joiningCampaignId !== null}
              >
                {joiningCampaignId ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-semibold text-white text-base">
                    Xác nhận
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
