/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { Text } from "@/src/components/ui/text";
import {
  CheckCircle,
  AlertCircle,
  Info,
  TriangleAlert,
} from "lucide-react-native";

const ProgressBar = ({
  duration,
  color,
}: {
  duration: number;
  color: string;
}) => {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [duration]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
      <Animated.View
        style={{ width, backgroundColor: color, height: "100%" }}
      />
    </View>
  );
};

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-white rounded-lg p-4 flex-row items-center shadow-lg border-l-4 border-[#4CAF50] overflow-hidden">
      <CheckCircle size={24} color="#4CAF50" />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-[#333]">{text1}</Text>
        {text2 && <Text className="text-gray-600 text-sm">{text2}</Text>}
      </View>
      <ProgressBar duration={3000} color="#4CAF50" />
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-white rounded-lg p-4 flex-row items-center shadow-lg border-l-4 border-[#E53935] overflow-hidden">
      <AlertCircle size={24} color="#E53935" />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-[#333]">{text1}</Text>
        {text2 && <Text className="text-gray-600 text-sm">{text2}</Text>}
      </View>
      <ProgressBar duration={4000} color="#E53935" />
    </View>
  ),
  warning: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-white rounded-lg p-4 flex-row items-center shadow-lg border-l-4 border-[#FBC02D] overflow-hidden">
      <TriangleAlert size={24} color="#FBC02D" />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-[#333]">{text1}</Text>
        {text2 && <Text className="text-gray-600 text-sm">{text2}</Text>}
      </View>
      <ProgressBar duration={3500} color="#FBC02D" />
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View className="w-[90%] bg-white rounded-lg p-4 flex-row items-center shadow-lg border-l-4 border-[#2196F3] overflow-hidden">
      <Info size={24} color="#2196F3" />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-[#333]">{text1}</Text>
        {text2 && <Text className="text-gray-600 text-sm">{text2}</Text>}
      </View>
      <ProgressBar duration={3000} color="#2196F3" />
    </View>
  ),
};
