import React, { useState } from "react";
import { View } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "../ui/select";
import { ChevronDown } from "lucide-react-native";
import {
  PRODUCE_LABELS,
  PRODUCE_VALUES,
} from "@/src/constants/enums/produce.enum";
import { Text } from "../ui/text";

interface ProduceSelectProps {
  selectedValue?: string;
  onValueChange: (value: string) => void;
}

export default function ProduceSelect({
  selectedValue,
  onValueChange,
}: ProduceSelectProps) {
  return (
    <Select
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      hitSlop={50}
    >
      <SelectTrigger className="h-[60px] rounded-lg border border-border bg-white px-4 flex-row items-center justify-between">
        <Text
          className={`text-xl ${selectedValue ? "text-slate-900" : "text-gray-400"}`}
        >
          {selectedValue
            ? PRODUCE_LABELS[selectedValue as keyof typeof PRODUCE_LABELS]
            : "Loại hình sản xuất"}
        </Text>
        <SelectIcon as={ChevronDown} className="text-gray-400" />
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent className="bg-white rounded-t-[32px] pb-10">
          <SelectDragIndicatorWrapper className="py-4">
            <SelectDragIndicator className="bg-gray-200" />
          </SelectDragIndicatorWrapper>

          {PRODUCE_VALUES.map((item) => (
            <SelectItem
              key={item}
              label={PRODUCE_LABELS[item]}
              value={item}
              className="px-6 py-4"
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
