import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { HStack, Box, Text } from "@gluestack-ui/themed";

const FILTER_OPTIONS = [
  { id: "joined", label: "Đã tham gia" },
  { id: "not_joined", label: "Chưa tham gia" },
  { id: "pending", label: "Đã gửi" },
];

export const HTXFilter = ({
  onFilterChange,
}: {
  onFilterChange: (filters: string[]) => void;
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleFilter = (id: string) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter((v) => v !== id)
      : [...selectedValues, id];

    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  return (
    <Box className="py-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => toggleFilter(option.id)}
              activeOpacity={0.8}
            >
              <HStack
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? "bg-primary border-secondary"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? "text-white" : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Text>
              </HStack>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Box>
  );
};
