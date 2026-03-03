import {
  JOIN_REQUEST_COLORS,
  JOIN_REQUEST_LABELS,
  JoinRequestStatus,
} from "@/src/constants/enums/joinRequest";
import { PRODUCE_LABELS } from "@/src/constants/enums/produce.enum";
import { useUserStore } from "@/src/store/user.store";
import {
  Badge,
  BadgeText,
  Box,
  Button,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { joinCooperative } from "../../services/joinHTX.api";
import { AppImage } from "./AppImage";

export const HTXCard = ({ item }: { item: any }) => {
  const [loading, setLoading] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState<string | undefined>(
    undefined,
  );
  const { joinRequests, updateJoinRequestLocal, fetchMyRequests } =
    useUserStore();

  const renderLocation = (data: any) => {
    if (!data) return "";
    return typeof data === "object" ? data.name : data;
  };

  const navigation = useNavigation<any>();

  const handleChat = () => {
    navigation.navigate("Detail", { coopId: item.id, screen: "Chat" });
  };

  const handleViewPosts = () => {
    navigation.navigate("Detail", { coopId: item.id, screen: "Posts" });
  };

  const handleJoin = async () => {
    if (!item.id) return;
    setLoading(true);
    try {
      const response = await joinCooperative(item.id);
      if (response?.data) {
        const respData = { ...response.data, cooperativeId: item.id };
        updateJoinRequestLocal(respData);
        fetchMyRequests();
        setOptimisticStatus(respData.status || JoinRequestStatus.PENDING);
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

  const extractCoopId = (r: any) =>
    r.cooperative?.id ?? r.cooperativeId ?? r.id ?? "";

  const matchedRequest = joinRequests.find((r: any) => {
    return String(extractCoopId(r)) === String(item.id);
  });
  const currentStatus =
    (optimisticStatus as JoinRequestStatus) ||
    (matchedRequest?.status as JoinRequestStatus) ||
    (item.status as JoinRequestStatus) ||
    JoinRequestStatus.NOT_JOINED;

  const theme = JOIN_REQUEST_COLORS[currentStatus as JoinRequestStatus];
  const label = JOIN_REQUEST_LABELS[currentStatus as JoinRequestStatus];

  // determine primary and secondary button behavior
  let primaryLabel = label;
  let primaryDisabled =
    currentStatus !== JoinRequestStatus.NOT_JOINED || loading;
  let primaryOnPress = handleJoin;

  if (currentStatus === JoinRequestStatus.PENDING) {
    primaryLabel = JOIN_REQUEST_LABELS[JoinRequestStatus.PENDING];
    primaryDisabled = true;
  } else if (currentStatus === JoinRequestStatus.APPROVED) {
    primaryLabel = JOIN_REQUEST_LABELS[JoinRequestStatus.APPROVED];
    primaryDisabled = true;
  }

  let secondaryLabel = "Nhắn tin";
  let secondaryOnPress = handleChat;

  if (currentStatus === JoinRequestStatus.APPROVED) {
    secondaryLabel = "Xem";
    secondaryOnPress = handleViewPosts;
  }

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
            onPress={primaryOnPress}
            disabled={primaryDisabled}
          >
            {loading && currentStatus === JoinRequestStatus.NOT_JOINED ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className={`${theme.text} font-bold`}>{primaryLabel}</Text>
            )}
          </Button>
          <Button
            className="flex-1 bg-gray-100 h-12 rounded-xl justify-center items-center"
            onPress={secondaryOnPress}
          >
            <Text className="text-gray-700 font-bold">{secondaryLabel}</Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};
