/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, HStack, Text, VStack } from "@gluestack-ui/themed";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { FeedActions } from "./FeedActions";
import { AppImage } from "./AppImage";
import { UserIcon } from "lucide-react-native";
import { timeAgo } from "@/src/util/timeAgo";
import { useMyJoinRequests } from "@/src/hook/useMyJoinRequests";

export const AnnouncementCard = ({ item }: any) => {
  const [expanded, setExpanded] = React.useState(false);
  const { data: joinRequests } = useMyJoinRequests();

  const safeJoinRequests = joinRequests ?? [];

  const currentCoop = useMemo(() => {
    return safeJoinRequests.find((req) => req.status === "APPROVED");
  }, [safeJoinRequests]);

  return (
    <Box className="bg-white p-4 mb-4 rounded-3xl shadow-sm border border-gray-50 relative overflow-hidden">
      <Box className="absolute top-0 right-0 bg-emerald-100 px-3 py-1 rounded-bl-2xl">
        <Text className="text-md text-emerald-700 font-bold uppercase">
          Thông báo
        </Text>
      </Box>

      <HStack className="flex-row mb-4 mt-2">
        <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center border border-orange-200">
          {item?.avatarUrl ? (
            <AppImage
              source={{ uri: item?.avatarUrl }}
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <UserIcon size={30} color="#846b65" />
          )}
        </View>

        <VStack className="ml-4" gap={2}>
          <HStack alignItems="center" className="gap-2">
            <Text className="font-bold text-gray-900 text-base mr-2">
              {currentCoop?.cooperativeName || "Hợp tác xã ABC"}
            </Text>
          </HStack>
          <Text className="text-md text-gray-400">
            {timeAgo(item.createdAt)}
          </Text>
        </VStack>
      </HStack>
      <View className="mt-2 mb-2">
        <Text className="font-bold text-gray-900 leading-6 text-lg mb-2">
          {item.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setExpanded(!expanded)}
        >
          <Text
            numberOfLines={expanded ? undefined : 4}
            className="text-gray-700 leading-6 text-md mb-4"
          >
            {item.content}
          </Text>

          {!expanded && item.content.length > 100 && (
            <Text className="text-gray-600 font-bold mb-4 mt-[-12px]">
              Xem thêm...
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {/* Image
      {item.image && (
        <Box className="mb-4">
          <Image
            source={{ uri: item.image }}
            className="w-full h-56 rounded-2xl"
            resizeMode="cover"
          />
        </Box>
      )} */}

      <Divider className="bg-gray-100 mb-3" />

      <FeedActions item={item} type="ANNOUNCEMENT" />
    </Box>
  );
};
