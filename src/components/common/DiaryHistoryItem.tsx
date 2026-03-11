import React from "react";
import { View, Text } from "react-native";
import { Sun, CloudRain, Clock, Package, Timer } from "lucide-react-native";
import { DiaryResponse } from "../../type/voiceDiary.type";
import dayjs from "dayjs";

interface Props {
  item: DiaryResponse;
}

// const getActivityLabel = (type: string) => {
//   switch (type) {
//     case "FERTILIZING":
//       return "Bón phân";
//     case "PESTICIDE":
//       return "Phun thuốc";
//     case "PLANTING":
//       return "Gieo hạt";
//     case "HARVESTING":
//       return "Thu hoạch";
//     case "WATERING":
//       return "Tưới nước";
//     case "WEEDING":
//       return "Làm cỏ";
//     default:
//       return "Khác";
//   }
// };

const ACTIVITY_CONFIG: any = {
  FERTILIZING: {
    label: "Bón phân",
    icon: "🌿",
    color: "#15803d",
    bg: "bg-green-50",
  },
  PESTICIDE: {
    label: "Phun thuốc",
    icon: "🧪",
    color: "#1d4ed8",
    bg: "bg-blue-50",
  },
  PLANTING: {
    label: "Gieo hạt",
    icon: "🌱",
    color: "#047857",
    bg: "bg-emerald-50",
  },
  HARVESTING: {
    label: "Thu hoạch",
    icon: "🧺",
    color: "#b45309",
    bg: "bg-amber-50",
  },
  WATERING: {
    label: "Tưới nước",
    icon: "💧",
    color: "#0369a1",
    bg: "bg-sky-50",
  },
  WEEDING: {
    label: "Làm cỏ",
    icon: "✂️",
    color: "#4f46e5",
    bg: "bg-indigo-50",
  },
  DEFAULT: { label: "Khác", icon: "📝", color: "#374151", bg: "bg-gray-50" },
};

const renderFormattedUI = (rawData: string | object) => {
  if (!rawData)
    return <Text className="text-gray-400 italic">Không có nội dung</Text>;

  try {
    const data = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    const type = data.activity_type;
    const config = ACTIVITY_CONFIG[type] || ACTIVITY_CONFIG.DEFAULT;
    const details = data.data || {};

    const productName =
      details.product_name || details.product || details.seed_type || "N/A";

    return (
      <View>
        <View className="flex-row justify-between  items-center mb-3">
          <Text className="text-gray-800 text-base font-medium mb-3 leading-6">
            Hôm nay đã {config.label.toLowerCase()}{" "}
            <Text className="font-bold text-gray-900">
              {productName !== "N/A" ? productName : ""}
            </Text>
            .
          </Text>
          <View
            className={`${config.bg} rounded-full px-3 py-1 border ${config.border} flex-row items-center`}
          >
            <Text className="mr-1.5 text-xs">{config.icon}</Text>
            <Text
              className="font-bold text-[11px] uppercase"
              style={{ color: config.color }}
            >
              {config.label}
            </Text>
          </View>
        </View>

        <View className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex-row flex-wrap">
          {details.quantity && (
            <View className="w-1/2 mb-2 flex-row items-center">
              <Package size={14} color="#9CA3AF" />
              <View className="ml-2">
                <Text className="text-[10px] text-gray-400 uppercase font-bold">
                  Lượng
                </Text>
                <Text className="text-gray-700 font-bold">
                  {details.quantity} {details.unit}
                </Text>
              </View>
            </View>
          )}

          {details.duration && (
            <View className="w-1/2 mb-2 flex-row items-center">
              <Timer size={14} color="#9CA3AF" />
              <View className="ml-2">
                <Text className="text-[10px] text-gray-400 uppercase font-bold">
                  Thời gian
                </Text>
                <Text className="text-gray-700 font-bold">
                  {details.duration} {details.duration_unit}
                </Text>
              </View>
            </View>
          )}

          <View className="w-full mt-1 pt-2 border-t border-gray-200 flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] text-gray-400 font-bold uppercase">
                Tổng chi phí
              </Text>
              <Text className="text-red-600 font-black text-base">
                {data.expense?.toLocaleString()}đ
              </Text>
            </View>
            {details.revenue > 0 && (
              <View className="items-end">
                <Text className="text-[10px] text-gray-400 font-bold uppercase">
                  Thu về
                </Text>
                <Text className="text-green-600 font-black text-base">
                  +{details.revenue?.toLocaleString()}đ
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  } catch (e) {
    return <Text className="text-gray-500 italic">{String(rawData)}</Text>;
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
        {renderFormattedUI(
          item.originalTranscript ||
            item.aiExtractedData ||
            "Không có nội dung",
        )}
      </Text>
    </View>
  );
}
