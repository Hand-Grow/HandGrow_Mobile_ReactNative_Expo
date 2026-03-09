import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import { Send } from "lucide-react-native";

import { FeedType } from "@/src/type/forumFeed.type";
import { useFeedComments, usePostComment } from "@/src/hook/useForumFeed";
import { timeAgo } from "@/src/util/timeAgo";
import { ExpandableText } from "./ExpeandableText";

interface Props {
  feedId: string;
  type: FeedType;
}

export const CommentSection = ({ feedId, type }: Props) => {
  const [content, setContent] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const inputRef = useRef<TextInput>(null);

  const { data, isLoading } = useFeedComments(type, feedId);
  const { mutate: postComment, isPending } = usePostComment();

  const comments = data || ([] as any);

  const sortedComments = [...comments].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const visibleComments = sortedComments.slice(0, visibleCount);

  const handleSend = () => {
    if (!content.trim()) return;

    postComment(
      {
        type,
        id: feedId,
        content,
      },
      {
        onSuccess: () => {
          setContent("");
          inputRef.current?.focus();
        },
      },
    );
  };

  return (
    <Box className="mt-3 border-t border-gray-200 pt-3">
      {isLoading ? (
        <Text>Đang tải bình luận...</Text>
      ) : (
        visibleComments.map((c: any) => (
          <Box key={c.id} className="mb-4">
            <HStack alignItems="flex-start">
              <VStack className="flex-1">
                <Box className="bg-gray-100 rounded-xl px-4 py-2">
                  <Text className="font-bold text-md">
                    {c.farmerName || "Farmer"}
                  </Text>

                  <ExpandableText content={c.content} />
                </Box>

                <HStack className="flex-row gap-4 mt-1 ml-2 items-center">
                  <Text className="text-gray-400 text-lg">
                    {timeAgo(c.createdAt)}
                  </Text>

                  <TouchableOpacity>
                    <Text className="text-gray-500 text-lg font-medium">
                      Thích
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text className="text-gray-500 text-lg font-medium">
                      Trả lời
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ))
      )}

      {sortedComments.length > visibleCount && (
        <TouchableOpacity
          onPress={() => setVisibleCount((prev) => prev + 3)}
          className="mb-3"
        >
          <Text className="text-gray-500 text-lg font-medium">
            Xem thêm {sortedComments.length - visibleCount} bình luận
          </Text>
        </TouchableOpacity>
      )}

      <HStack className="flex-row items-center mt-2">
        <TextInput
          ref={inputRef}
          value={content}
          onChangeText={setContent}
          placeholder="Viết bình luận..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-lg"
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={isPending}
          className="bg-amber-500 p-2 rounded-full"
        >
          <Send size={18} color="white" />
        </TouchableOpacity>
      </HStack>
    </Box>
  );
};
