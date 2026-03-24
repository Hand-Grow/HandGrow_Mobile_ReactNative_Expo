import React from "react";
import { Text } from "react-native";
import { Box } from "@gluestack-ui/themed";

interface StatCardProps {
  label: string;
  value: string;
}

export const StatCard = ({ label, value }: StatCardProps) => (
  <Box className="bg-white rounded-2xl p-4 items-center flex-1 mx-1 shadow-sm border border-gray-100">
    <Text className={`text-xl font-extrabold`}>{value}</Text>
    <Text className="font-bold text-gray-700 text-sm text-center">{label}</Text>
  </Box>
);
