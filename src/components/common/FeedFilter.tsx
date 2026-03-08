// src/components/common/FeedFilter.tsx
import { Box, HStack, Text } from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";

export const FeedFilter = ({ selectedFilter, onSelect }: any) => {
  const options = [
    { id: "ALL", label: "Tất cả" },
    { id: "ANNOUNCEMENT", label: "Thông báo" },
    { id: "CAMPAIGN", label: "Thu gom" },
  ];

  return (
    <HStack className="flex-row items-center gap-4">
      {options.map((option) => {
        const isActive = selectedFilter === option.id;
        return (
          <TouchableOpacity key={option.id} onPress={() => onSelect(option.id)}>
            <Box
              className={`px-3 py-1 rounded-full ${isActive ? "bg-primary" : "bg-gray-200"}`}
            >
              <Text
                className={`text-md font-bold ${isActive ? "text-white" : "text-gray-600"}`}
              >
                {option.label}
              </Text>
            </Box>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};
