import React from "react";
import { View, Text } from "react-native";
import { Box } from "@gluestack-ui/themed";

interface StatCardProps {
  label: string;
  value: string;
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <Box className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm border border-gray-100">
    <Text className={`text-xl font-extrabold`}>{value}</Text>
    <Text className="text-gray-400 text-[10px] mt-1 uppercase font-medium text-center">
      {label}
    </Text>
  </Box>
);
