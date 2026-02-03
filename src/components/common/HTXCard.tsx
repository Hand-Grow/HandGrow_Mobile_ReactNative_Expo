import React, { useState } from "react";
import { Text, View, ActivityIndicator, Alert } from "react-native";
import {
  Box,
  HStack,
  VStack,
  Badge,
  BadgeText,
  Button,
} from "@gluestack-ui/themed";
import { AppImage } from "./AppImage";
import { joinCooperative } from "../../services/joinHTX.api";
import {
  JOIN_REQUEST_COLORS,
  JOIN_REQUEST_LABELS,
  JoinRequestStatus,
} from "@/src/constants/enums/joinRequest";
import { useUserStore } from "@/src/store/user.store";
import { PRODUCE_LABELS } from "@/src/constants/enums/produce.enum";

export const HTXCard = ({ item }: { item: any }) => {
  const [loading, setLoading] = useState(false);
  const { updateJoinRequestLocal } = useUserStore();

  const renderLocation = (data: any) => {
    if (!data) return "";
    return typeof data === "object" ? data.name : data;
  };

  const handleJoin = async () => {
    if (!item.id) return;
    setLoading(true);
    try {
      const response = await joinCooperative(item.id);
      if (response?.data) {
        updateJoinRequestLocal(response.data);
      }
      Alert.alert("Thành công", `Lily đã gửi yêu cầu tham gia ${item.name}!`);
    } catch (error: any) {
      Alert.alert("Thông báo", "Gửi yêu cầu thất bại hoặc đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };
  const getProduceLabel = (key: string) => {
    return (
      PRODUCE_LABELS[key as keyof typeof PRODUCE_LABELS] || key || "Nông sản"
    );
  };
  const currentStatus =
    (item.status as JoinRequestStatus) || JoinRequestStatus.NOT_JOINED;
  // console.log(item.status);
  const theme = JOIN_REQUEST_COLORS[currentStatus];
  const label = JOIN_REQUEST_LABELS[currentStatus];

  return (
    <Box className="bg-white m-4 p-4 rounded-2xl shadow-sm border border-gray-200">
      <HStack className="flex-row gap-4 items-start">
        <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
          <AppImage
            source={
              item.avatarUrl
                ? { uri: item.avatarUrl }
                : require("../../assets/imgs/logo-sm.png")
            }
            className="w-12 h-12 rounded-full"
            resizeMode="contain"
          />
        </View>
        <VStack className="flex-1">
          <Text className="font-bold text-gray-800 text-xl">{item.name}</Text>
          <Text className="text-gray-400 text-md">{`${renderLocation(item.commune)}, ${renderLocation(item.province)}`}</Text>
          <HStack className="flex-row mt-2 items-center justify-between">
            <Text className="text-gray-600 font-medium">
              {item.distance ?? "2.5 km"}
            </Text>
            <Text className="text-gray-600">
              ⭐ {item.rating ?? 4.5} ({item.reviews ?? 0})
            </Text>
          </HStack>
          <Badge className="bg-green-100 self-start mt-2 px-3 py-1 border-0">
            <BadgeText className="text-green-700 font-bold uppercase">
              {getProduceLabel(item.produce) || "Nông sản"}
            </BadgeText>
          </Badge>
        </VStack>
      </HStack>
      <Box className="h-[1px] bg-gray-100 my-4" />
      <VStack className="mb-2">
        <Text className="text-gray-400 mb-1">Dịch vụ cung cấp:</Text>
        <Box className="bg-gray-50 self-start px-3 py-1 rounded-lg">
          <Text className="text-gray-700 font-medium">
            {item.service || "Hỗ trợ kỹ thuật & Tiêu thụ"}
          </Text>
        </Box>
        <HStack gap={12} className="flex-row mt-4">
          <Button
            className={`flex-1 ${theme.bg} h-12 rounded-xl justify-center items-center shadow-sm`}
            onPress={handleJoin}
            disabled={currentStatus !== JoinRequestStatus.NOT_JOINED || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className={`${theme.text} font-bold`}>{label}</Text>
            )}
          </Button>
          <Button className="flex-1 bg-gray-100 h-12 rounded-xl justify-center items-center">
            <Text className="text-gray-700 font-bold">Xem</Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
