import React from "react";
import { View, Text } from "react-native";
import { Sun, CloudRain, Clock } from "lucide-react-native";
import { DiaryResponse } from "../../type/voiceDiary.type";
import dayjs from "dayjs";

interface Props {
  item: DiaryResponse;
}

const getActivityLabel = (type: string) => {
  switch (type) {
    case "FERTILIZING":
      return "Bón phân";
    case "PESTICIDE":
      return "Phun thuốc";
    case "PLANTING":
      return "Gieo hạt";
    case "HARVESTING":
      return "Thu hoạch";
    case "WATERING":
      return "Tưới nước";
    case "WEEDING":
      return "Làm cỏ";
    default:
      return "Khác";
  }
};

export default function DiaryHistoryItem({ item }: Props) {
  // Mock weather for now, or extract from AI if available later
  const isSunny = Math.random() > 0.5;

  return (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm elevation-1">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center space-x-2">
          {isSunny ? (
            <Sun size={20} color="#F59E0B" />
          ) : (
            <CloudRain size={20} color="#3B82F6" />
          )}
          <Text className="text-gray-800 font-medium ml-2">
            {dayjs(item.activityDate).format("DD/MM/YYYY")}
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          <Clock size={16} color="#6B7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {dayjs(item.activityDate).format("HH:mm")}
          </Text>
          <View className="bg-gray-100 rounded-full px-3 py-1 ml-2">
            <Text className="text-gray-700 text-xs font-medium">
              {isSunny ? "Nắng" : "Mưa"}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-gray-700 text-base leading-relaxed mb-3">
        {item.originalTranscript || item.aiExtractedData || "Không có nội dung"}
      </Text>

      <View className="flex-row">
        <View className="bg-blue-100 rounded-lg px-3 py-1.5">
          <Text className="text-blue-700 font-medium text-sm">
            {getActivityLabel(item.activityType)}
          </Text>
        </View>
      </View>
    </View>
  );
}
