import React from "react";
import { View, Text } from "react-native";
import {
  Sun,
  CloudRain,
  Clock,
  Package,
  Timer,
  Droplet,
  Users,
  TrendingUp,
  User,
  Tractor,
  Sprout,
  Bug,
  Leaf,
  DollarSign,
} from "lucide-react-native";
import { DiaryResponse } from "../../type/voiceDiary.type";
import dayjs from "dayjs";
import { getUnitDisplay } from "../../util/unitMapper";

interface Props {
  item: DiaryResponse;
}

const ACTIVITY_CONFIG: any = {
  FERTILIZING: {
    label: "Bón phân",
    icon: "🌿",
    color: "#15803d",
    bg: "bg-green-50",
    defaultSentence: "bón phân",
  },
  PESTICIDE: {
    label: "Phun thuốc",
    icon: "🧪",
    color: "#1d4ed8",
    bg: "bg-blue-50",
    defaultSentence: "phun thuốc",
  },
  PLANTING: {
    label: "Gieo hạt",
    icon: "🌱",
    color: "#047857",
    bg: "bg-emerald-50",
    defaultSentence: "gieo hạt",
  },
  HARVESTING: {
    label: "Thu hoạch",
    icon: "🧺",
    color: "#b45309",
    bg: "bg-amber-50",
    defaultSentence: "thu hoạch",
  },
  WATERING: {
    label: "Tưới nước",
    icon: "💧",
    color: "#0369a1",
    bg: "bg-sky-50",
    defaultSentence: "tưới nước",
  },
  WEEDING: {
    label: "Làm cỏ",
    icon: "✂️",
    color: "#4f46e5",
    bg: "bg-indigo-50",
    defaultSentence: "làm cỏ",
  },
  DEFAULT: {
    label: "Khác",
    icon: "📝",
    color: "#374151",
    bg: "bg-gray-50",
    defaultSentence: "thực hiện",
  },
};

// Helper để lấy dữ liệu chi tiết từ item
const getDetailsFromItem = (
  item: DiaryResponse,
): { activityType: string; expense: number; details: any } => {
  let activityType = item.activityType;
  let expense = item.expense || 0;
  let details = {};

  // Ưu tiên dùng originalTranscript nếu có
  let rawData = item.originalTranscript;
  if (!rawData) rawData = item.aiExtractedData;

  if (rawData && typeof rawData === "string") {
    try {
      const parsed = JSON.parse(rawData);
      // Nếu parsed có activity_type (cấu trúc Gemini) thì lấy từ đó
      if (parsed.activity_type) {
        activityType = parsed.activity_type;
        expense = parsed.expense || 0;
        details = parsed.data || {};
      } else {
        // Nếu không có activity_type, coi parsed là data trực tiếp (aiExtractedData)
        details = parsed;
      }
    } catch (e) {
      // Không parse được
    }
  }

  return { activityType, expense, details };
};

// Helper để tạo câu mô tả tự nhiên
const buildSentence = (activityType: string, details: any): string => {
  const config = ACTIVITY_CONFIG[activityType] || ACTIVITY_CONFIG.DEFAULT;
  let extra = "";

  switch (activityType) {
    case "FERTILIZING":
      if (details.product_name) extra = details.product_name;
      break;
    case "PESTICIDE":
      if (details.product_name) extra = details.product_name;
      else if (details.target_pest) extra = `diệt ${details.target_pest}`;
      break;
    case "PLANTING":
      if (details.seed_type) extra = details.seed_type;
      break;
    case "HARVESTING":
      if (details.product) extra = details.product;
      break;
    case "WATERING":
      // Không cần extra
      break;
    case "WEEDING":
      // Không cần extra
      break;
    default:
      break;
  }

  if (extra) {
    return `Hôm nay đã ${config.defaultSentence} ${extra}.`;
  }
  return `Hôm nay đã ${config.defaultSentence}.`;
};

// Hàm render các dòng chi tiết
const renderDetails = (activityType: string, details: any) => {
  const unit = details.unit ? getUnitDisplay(details.unit) : "";
  const durationUnit = details.duration_unit
    ? getUnitDisplay(details.duration_unit)
    : "";
  const areaUnit = details.area_unit ? getUnitDisplay(details.area_unit) : "";

  switch (activityType) {
    case "FERTILIZING":
      return (
        <>
          {details.product_name && (
            <View className="flex-row items-center mb-2">
              <Leaf size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Sản phẩm: {details.product_name}
              </Text>
            </View>
          )}
          {details.quantity && (
            <View className="flex-row items-center mb-2">
              <Package size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Lượng: {details.quantity} {unit}
              </Text>
            </View>
          )}
          {details.unit_price && (
            <View className="flex-row items-center mb-2">
              <DollarSign size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Đơn giá: {details.unit_price.toLocaleString()}đ
              </Text>
            </View>
          )}
        </>
      );
    case "PESTICIDE":
      return (
        <>
          {details.product_name && (
            <View className="flex-row items-center mb-2">
              <Bug size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Thuốc: {details.product_name}
              </Text>
            </View>
          )}
          {details.target_pest && (
            <View className="flex-row items-center mb-2">
              <Bug size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Đối tượng: {details.target_pest}
              </Text>
            </View>
          )}
          {details.quantity && (
            <View className="flex-row items-center mb-2">
              <Package size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Lượng: {details.quantity} {unit}
              </Text>
            </View>
          )}
          {details.unit_price && (
            <View className="flex-row items-center mb-2">
              <DollarSign size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Đơn giá: {details.unit_price.toLocaleString()}đ
              </Text>
            </View>
          )}
        </>
      );
    case "PLANTING":
      return (
        <>
          {details.seed_type && (
            <View className="flex-row items-center mb-2">
              <Sprout size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Giống: {details.seed_type}
              </Text>
            </View>
          )}
          {details.quantity && (
            <View className="flex-row items-center mb-2">
              <Package size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Số lượng: {details.quantity} {unit}
              </Text>
            </View>
          )}
          {details.area && (
            <View className="flex-row items-center mb-2">
              <Tractor size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Diện tích: {details.area} {areaUnit}
              </Text>
            </View>
          )}
        </>
      );
    case "HARVESTING":
      return (
        <>
          {details.product && (
            <View className="flex-row items-center mb-2">
              <Leaf size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Sản phẩm: {details.product}
              </Text>
            </View>
          )}
          {details.quantity && (
            <View className="flex-row items-center mb-2">
              <Package size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Sản lượng: {details.quantity} {unit}
              </Text>
            </View>
          )}
          {details.unit_price && (
            <View className="flex-row items-center mb-2">
              <DollarSign size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Đơn giá: {details.unit_price.toLocaleString()}đ
              </Text>
            </View>
          )}
          {details.buyer && (
            <View className="flex-row items-center mb-2">
              <User size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Người mua: {details.buyer}
              </Text>
            </View>
          )}
          {details.revenue && (
            <View className="flex-row items-center mb-2">
              <TrendingUp size={14} color="#10b981" />
              <Text className="ml-2 text-green-600 font-medium">
                Doanh thu: {details.revenue.toLocaleString()}đ
              </Text>
            </View>
          )}
        </>
      );
    case "WATERING":
      return (
        <>
          {details.duration && (
            <View className="flex-row items-center mb-2">
              <Timer size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Thời gian: {details.duration} {durationUnit}
              </Text>
            </View>
          )}
          {details.water_source && (
            <View className="flex-row items-center mb-2">
              <Droplet size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Nguồn nước: {details.water_source}
              </Text>
            </View>
          )}
          {details.electricity_cost && (
            <View className="flex-row items-center mb-2">
              <DollarSign size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Tiền điện: {details.electricity_cost.toLocaleString()}đ
              </Text>
            </View>
          )}
        </>
      );
    case "WEEDING":
      return (
        <>
          {details.method && (
            <View className="flex-row items-center mb-2">
              <Tractor size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Phương pháp:{" "}
                {details.method === "MAY_MOC" ? "Máy móc" : "Thủ công"}
              </Text>
            </View>
          )}
          {details.labor_count && (
            <View className="flex-row items-center mb-2">
              <Users size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Số lao động: {details.labor_count}
              </Text>
            </View>
          )}
          {details.wage_per_person && (
            <View className="flex-row items-center mb-2">
              <DollarSign size={14} color="#9CA3AF" />
              <Text className="ml-2 text-gray-700">
                Tiền công/người: {details.wage_per_person.toLocaleString()}đ
              </Text>
            </View>
          )}
        </>
      );
    default:
      return (
        <Text className="text-gray-500 italic">
          Không có thông tin chi tiết
        </Text>
      );
  }
};

export default function DiaryHistoryItem({ item }: Props) {
  const { activityType, expense, details } = getDetailsFromItem(item);
  const config = ACTIVITY_CONFIG[activityType] || ACTIVITY_CONFIG.DEFAULT;
  const sentence = buildSentence(activityType, details);
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

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-800 text-base font-medium leading-6 flex-1">
          {sentence}
        </Text>
        <View
          className={`${config.bg} rounded-full px-3 py-1 border flex-row items-center ml-2`}
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

      {Object.keys(details).length > 0 &&
      Object.values(details).some((v) => v !== null) ? (
        <>
          <Text className="text-gray-500 text-sm mb-2 font-medium">
            Chi tiết:
          </Text>
          <View className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            {renderDetails(activityType, details)}
          </View>
        </>
      ) : null}

      <View className="mt-3 pt-2 border-t border-gray-200 flex-row justify-between items-center">
        <View>
          <Text className="text-[10px] text-gray-400 font-bold uppercase">
            Tổng chi phí
          </Text>
          <Text className="text-red-600 font-black text-base">
            {expense?.toLocaleString()}đ
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
  );
}
