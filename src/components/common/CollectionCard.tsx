import { useCampaignCommitments } from "@/src/hook/useForumFeed";
import { useMyJoinRequests } from "@/src/hook/useMyJoinRequests";
import { createCampaignCommitment } from "@/src/services/forumFeed.api";
import { plotApi } from "@/src/services/plot.api";
import { timeAgo } from "@/src/util/timeAgo";
import { Box, Divider, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useQueryClient } from "@tanstack/react-query";
import { UserIcon } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppImage } from "./AppImage";
import { FeedActions } from "./FeedActions";

export const CollectionCard = ({ item }: any) => {
  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [fields, setFields] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);

  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [quantity, setQuantity] = useState("");
  const [showFieldList, setShowFieldList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: commitmentsData } = useCampaignCommitments(item.id);

  const commitment = useMemo(() => {
    return commitmentsData?.[0] || null;
  }, [commitmentsData]);

  const hasCommitted = !!commitment;

  const { data: joinRequests } = useMyJoinRequests();

  const safeJoinRequests = joinRequests ?? [];

  const currentCoop = useMemo(() => {
    return safeJoinRequests.find((req) => req.status === "APPROVED");
  }, [safeJoinRequests]);

  const fetchMyPlots = async () => {
    try {
      setLoadingFields(true);
      const res = await plotApi.getMyPlots();
      setFields(res || []);
    } catch (error) {
      console.log("getMyPlots error", error);
    } finally {
      setLoadingFields(false);
    }
  };

  const openReportModal = async () => {
    await fetchMyPlots();

    if (commitment) {
      setSelectedField(commitment.plotName);
      setQuantity(String(commitment.quantity));
    }

    setIsReportModalVisible(true);
  };

  const closeModal = () => {
    setIsReportModalVisible(false);
    setSelectedField(null);
    setQuantity("");
    setShowFieldList(false);
  };

  const handleSubmitReport = async () => {
    if (!selectedField || !quantity) {
      alert("Vui lòng chọn mảnh ruộng và nhập sản lượng");
      return;
    }

    const quantityNumber = Number(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      alert("Vui lòng nhập số");
      return;
    }

    try {
      setIsSubmitting(true);

      await createCampaignCommitment(item.id, {
        plotId: selectedField,
        committedQuantity: quantityNumber,
      });

      queryClient.invalidateQueries({
        queryKey: ["campaign-commitments", item.id],
      });

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="bg-white p-5 mb-4 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden">
      <Box className="absolute top-0 right-0 bg-amber-500 px-3 py-1 rounded-bl-2xl">
        <Text className="text-md text-white font-bold uppercase">
          Đợt thu gom
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
          <Text className="font-bold text-gray-900 text-base">
            {currentCoop?.cooperativeName || "Hợp tác xã ABC"}
          </Text>

          <Text className="text-md text-gray-400">
            {timeAgo(item.createdAt)}
          </Text>
        </VStack>
      </HStack>

      {/* CONTENT */}
      <View className="mt-2 mb-2">
        <Text className="mb-2 text-gray-800 font-medium text-lg leading-6">
          Sản phẩm thu: {item.title}
        </Text>

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text
            numberOfLines={expanded ? undefined : 4}
            className="text-gray-700 leading-6 text-md mb-4"
          >
            {item.content}
          </Text>

          {!expanded && item.content?.length > 100 && (
            <Text className="text-emerald-600 font-bold mb-4 mt-[-12px]">
              Xem thêm...
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={openReportModal}
        className={`py-1.5 rounded-xl items-center shadow-sm mb-3 w-[200px] ${
          hasCommitted ? "bg-gray-300 w-[220px] text-gray-700" : "bg-primary"
        }`}
      >
        <Text
          className={`font-medium ${
            hasCommitted ? "text-gray-700" : "text-white"
          }`}
        >
          {hasCommitted
            ? "Đã báo cáo! Click để xem chi tiết "
            : "Báo cáo sản lượng của tôi"}
        </Text>
      </TouchableOpacity>

      <Divider className="bg-gray-50 mb-3" />

      <FeedActions item={item} type="CAMPAIGN" />

      {/* MODAL */}
      <Modal visible={isReportModalVisible} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              {hasCommitted
                ? "Thông tin sản lượng đã báo cáo"
                : "Báo cáo sản lượng"}
            </Text>

            {hasCommitted && commitment ? (
              <View className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <Text className="font-semibold text-emerald-700 mb-2 text-xl">
                  Thông tin của bạn
                </Text>

                <Text className="text-xl">
                  Mảnh ruộng: {commitment.plotName}
                </Text>

                <Text className="text-xl">
                  Sản lượng: {Number(commitment.quantity).toLocaleString()} kg
                </Text>
              </View>
            ) : (
              <>
                {/* FIELD SELECT */}
                <Text className="text-gray-600 font-medium mb-2">
                  Chọn mảnh ruộng
                </Text>

                <TouchableOpacity
                  onPress={() => setShowFieldList(!showFieldList)}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3"
                >
                  <Text className="text-gray-700">
                    {selectedField
                      ? fields.find((f) => f.id === selectedField)?.name
                      : "Chọn mảnh ruộng"}
                  </Text>
                </TouchableOpacity>

                {showFieldList && (
                  <View className="mb-3">
                    {loadingFields ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      fields.map((field) => (
                        <TouchableOpacity
                          key={field.id}
                          onPress={() => {
                            setSelectedField(field.id);
                            setShowFieldList(false);
                          }}
                          className="p-3 border border-gray-200 rounded-lg mb-2 bg-white"
                        >
                          <Text>{field.name}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}

                {/* QUANTITY */}
                <Text className="text-gray-600 font-medium mb-1">
                  Sản lượng (kg)
                </Text>

                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Vd: 120"
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6"
                />

                {/* BUTTON */}
                <View className="items-center">
                  <TouchableOpacity
                    onPress={handleSubmitReport}
                    className="bg-amber-500 py-3 rounded-lg items-center flex-row justify-center w-[200px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-bold">Lưu báo cáo</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity
              onPress={closeModal}
              className="mt-3 items-center"
            >
              <Text className="text-gray-500">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Box>
  );
};
