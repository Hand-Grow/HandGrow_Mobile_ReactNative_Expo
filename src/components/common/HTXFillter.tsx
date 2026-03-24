import { Box, HStack, Text } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

const FILTER_OPTIONS = [
  { id: "joined", label: "Đã tham gia" },
  { id: "not_joined", label: "Chưa tham gia" },
  { id: "pending", label: "Đã gửi" },
];

export const HTXFilter = ({
  onFilterChange,
  selectedValues,
}: {
  onFilterChange: (filters: string[]) => void;
  selectedValues?: string[];
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(
    selectedValues ?? [],
  );

  useEffect(() => {
    if (selectedValues) setLocalSelected(selectedValues);
  }, [selectedValues]);

  const toggleFilter = (id: string) => {
    const source = selectedValues ?? localSelected;
    // Nếu id đang được chọn thì bỏ chọn tất cả, ngược lại chỉ chọn id này
    const newValues = source.includes(id) ? [] : [id];

    if (!selectedValues) setLocalSelected(newValues);
    onFilterChange(newValues);
  };

  const current = selectedValues ?? localSelected;

  return (
    <Box className="py-2 mt-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = current.includes(option.id);
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
