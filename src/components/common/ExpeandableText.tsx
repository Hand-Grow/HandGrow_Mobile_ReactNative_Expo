import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

export const ExpandableText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;

  if (content.length <= maxLength) {
    return (
      <Text className="text-gray-700 leading-6 text-md mb-4">{content}</Text>
    );
  }

  return (
    <Text className="text-gray-700 leading-6 text-md mb-4">
      {isExpanded ? content : `${content.substring(0, maxLength)}... `}

      <Text
        onPress={() => setIsExpanded(!isExpanded)}
        className="text-gray-700 font-bold"
      >
        {isExpanded ? " Thu gọn" : " Xem thêm"}
      </Text>
    </Text>
  );
};
