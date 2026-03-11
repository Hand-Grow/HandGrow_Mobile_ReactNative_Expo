/* eslint-disable react-hooks/exhaustive-deps */
import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import { ArrowLeft, ShoppingBag, Users } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AnnouncementCard } from "../components/common/AnnouncementCard";
import { CollectionCard } from "../components/common/CollectionCard";
import { FeedFilter } from "../components/common/FeedFilter";
import { StatCard } from "../components/common/StatCard";

import { RootStackParamList } from "../navigation/AppNavigator";

import { FeedItemDTO } from "../type/forumFeed.type";

import { useForumFeed } from "../hook/useForumFeed";
import { useMyJoinRequests } from "../hook/useMyJoinRequests";

const CooperativeFeedScreen = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const { data: joinRequests, isLoading } = useMyJoinRequests();
  const safeJoinRequests = joinRequests ?? [];

  const currentCoop = useMemo(
    () => safeJoinRequests.find((req) => req.status === "APPROVED"),
    [safeJoinRequests],
  );
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | "ANNOUNCEMENT" | "CAMPAIGN"
  >("ALL");

  const coopId = currentCoop?.cooperativeId;

  const {
    data: feedData,
    isFetching,
    isLoading: loadingFeed,
    refetch,
  } = useForumFeed(coopId);

  const filteredPosts = useMemo(() => {
    const safeData = feedData ?? ([] as any);

    if (selectedFilter === "ALL") return safeData;

    return safeData.filter((post: FeedItemDTO) => post.type === selectedFilter);
  }, [selectedFilter, feedData]);

  const navigateBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else
      navigation.navigate("MainDrawer", {
        screen: "MainTabs",
        params: {
          screen: "HomeTab",
        },
      });
  };

  const navigateToGroupOrder = () => {
    navigation.navigate("GroupOrder");
  };

  const renderItem = ({ item }: { item: FeedItemDTO }) => (
    <Box className="px-4">
      {item.type === "CAMPAIGN" ? (
        <CollectionCard item={item} />
      ) : (
        <AnnouncementCard item={item} />
      )}
    </Box>
  );

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-4 text-gray-500">
          Đang kiểm tra quyền truy cập...
        </Text>
      </Box>
    );
  }

  if (!currentCoop) {
    return (
      <Box className="flex-1 bg-gray-50 justify-center items-center p-6">
        <Text className="text-gray-500 text-center text-lg mb-4">
          Bạn cần tham gia Hợp tác xã để xem bảng tin nội bộ này.
        </Text>

        <TouchableOpacity
          className="bg-emerald-500 px-6 py-3 rounded-full"
          onPress={navigateBack}
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-50">
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            tintColor="#10b981"
          />
        }
        ListHeaderComponent={
          <VStack className="mb-6">
            <Box className="flex-row bg-primary pt-12 pb-24 px-6 rounded-b-[30px]">
              <TouchableOpacity className="mb-4 w-10" onPress={navigateBack}>
                <ArrowLeft color="white" size={28} />
              </TouchableOpacity>

              <View>
                <Text color="white" className="mb-1 font-bold text-xl">
                  {currentCoop.cooperativeName}
                </Text>

                <Text color="white" className="opacity-90 text-md italic">
                  {currentCoop.address || "Khu vực thành viên nội bộ"}
                </Text>
              </View>
            </Box>

            <HStack className="flex-row px-4 -mt-12 mb-8">
              <StatCard label="Mùa vụ" value="40" />
              <StatCard label="Thành viên" value="350" />
              <StatCard label="Đơn Chung" value="20" />
            </HStack>

            <HStack className="flex-row px-6 mb-8 gap-4">
              <ActionButton
                label="Mua chung"
                icon={<ShoppingBag size={24} color="#10b981" />}
                onPress={navigateToGroupOrder}
              />
              <ActionButton
                label="Thành viên"
                icon={<Users size={24} color="#3b82f6" />}
              />
            </HStack>

            <HStack className="px-5 mb-4">
              <Text className="font-bold text-gray-800 text-lg mb-6">
                Tin tức & Vận hành
              </Text>

              <FeedFilter
                selectedFilter={selectedFilter}
                onSelect={setSelectedFilter}
              />
            </HStack>
          </VStack>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          loadingFeed ? (
            <ActivityIndicator color="#10b981" size="large" className="mt-10" />
          ) : (
            <Text className="text-center text-gray-500 mt-10">
              Chưa có bài viết nào
            </Text>
          )
        }
      />
    </Box>
  );
};

const ActionButton = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 items-center shadow-sm active:opacity-70"
    onPress={onPress}
  >
    <View className="bg-emerald-100 p-3 rounded-full mb-2">{icon}</View>
    <Text className="font-bold text-gray-700">{label}</Text>
  </TouchableOpacity>
);

export default CooperativeFeedScreen;
