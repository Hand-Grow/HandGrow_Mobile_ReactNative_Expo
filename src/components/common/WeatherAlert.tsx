import React from "react";
import { View, Text } from "react-native";
import { Bell, ShieldAlert, Info } from "lucide-react-native";

const alertConfig = {
  warning: { color: "#EAB308", bg: "#FEFCE8", label: "Cảnh báo", icon: Bell },
  critical: {
    color: "#EF4444",
    bg: "#FEF2F2",
    label: "Nghiêm trọng",
    icon: ShieldAlert,
  },
  info: { color: "#3B82F6", bg: "#EFF6FF", label: "Thông tin", icon: Info },
};

type AlertType = "warning" | "critical" | "info";

export const WeatherAlert = ({
  type,
  title,
  description,
}: {
  type: AlertType;
  title: string;
  description: string;
}) => {
  const config = alertConfig[type];

  return (
    <View
      className="flex-row items-start p-6 bg-white rounded-[24px] border border-gray-100 shadow-sm"
      style={{ borderLeftWidth: 6, borderLeftColor: config.color }}
    >
      <View
        className="p-2.5 rounded-2xl mr-3"
        style={{ backgroundColor: config.bg }}
      >
        <config.icon size={22} color={config.color} />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-800 font-bold text-lg">{title}</Text>
          <Text
            style={{ color: config.color }}
            className="text-sm font-bold uppercase tracking-wider"
          >
            {config.label}
          </Text>
        </View>

        <Text className="text-slate-500 text-md mt-1 leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
};
