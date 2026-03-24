import {
  JOIN_REQUEST_COLORS,
  JOIN_REQUEST_LABELS,
  JoinRequestStatus,
} from "@/src/constants/enums/joinRequest";

import { PRODUCE_LABELS } from "@/src/constants/enums/produce.enum";

import {
  Badge,
  BadgeText,
  Box,
  Button,
  HStack,
  VStack,
} from "@gluestack-ui/themed";

import { useNavigation } from "@react-navigation/native";

import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

import { joinCooperative } from "../../services/joinHTX.api";

import { AppImage } from "./AppImage";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const HTXCard = ({ item }: { item: any }) => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  /**
   * React Query mutation
   */
  const joinMutation = useMutation({
    mutationFn: () => joinCooperative(item.id),

    /**
     * Optimistic update
     */
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["myJoinRequests"] });

      const prev = queryClient.getQueryData(["myJoinRequests"]);

      queryClient.setQueryData(["myJoinRequests"], (old: any[] = []) => [
        ...old,
        {
          cooperativeId: String(item.id),
          status: JoinRequestStatus.PENDING,
        },
      ]);

      return { prev };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(["myJoinRequests"], context?.prev);

      Alert.alert("Thông báo", "Không thể gửi yêu cầu.");
    },

    onSuccess: () => {
      Alert.alert("Thành công", `Đã gửi yêu cầu tham gia ${item.name}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["myJoinRequests"],
      });
    },
  });

  /**
   * Status hiện tại
   */
  const currentStatus =
    (item.status as JoinRequestStatus) || JoinRequestStatus.NOT_JOINED;

  const theme = JOIN_REQUEST_COLORS[currentStatus];
  const label = JOIN_REQUEST_LABELS[currentStatus];

  /**
   * Helpers
   */
  const renderLocation = (data: any) => {
    if (!data) return "";
    return typeof data === "object" ? data.name : data;
  };

  const getProduceLabel = (key: string) => {
    return (
      PRODUCE_LABELS[key as keyof typeof PRODUCE_LABELS] || key || "Nông sản"
    );
  };

  /**
   * Navigation
   */
  const handleChat = () => {
    navigation.navigate("CoopFeed", {
      coopId: item.id,
      screen: "Chat",
    });
  };

  const handleViewPosts = () => {
    navigation.navigate("CoopFeed", {
      coopId: item.id,
      screen: "Posts",
      isJoinedHTX: true,
    });
  };

  const handleJoin = () => {
    if (joinMutation.isPending) return;
    joinMutation.mutate();
  };

  /**
   * Primary button config
   */
  let primaryLabel = label;
  let primaryDisabled =
    currentStatus !== JoinRequestStatus.NOT_JOINED || joinMutation.isPending;

  let primaryOnPress = handleJoin;

  /**
   * Secondary button
   */
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
                : require("../../assets/imgs/default-avatar.jpg")
            }
            className="w-12 h-12 rounded-full"
            resizeMode="contain"
          />
        </View>

        <VStack className="flex-1">
          <Text className="font-bold text-gray-800 text-xl">{item.name}</Text>

          <Text className="text-gray-400 text-xl">
            {`${renderLocation(item.commune)}, ${renderLocation(
              item.province,
            )}`}
          </Text>

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
              {getProduceLabel(item.produce)}
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
            {joinMutation.isPending ? (
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
