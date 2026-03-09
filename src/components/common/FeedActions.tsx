import { useToggleLike } from "@/src/hook/useForumFeed";
import { Text, HStack } from "@gluestack-ui/themed";
import { MessageSquare, ThumbsUp } from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { FeedType } from "@/src/type/forumFeed.type";
import { CommentSection } from "./CommentSection";

interface FeedActionsProps {
  item: any;
  type: FeedType;
}

export const FeedActions = ({ item, type }: FeedActionsProps) => {
  const { mutate: toggleLike } = useToggleLike();

  const [liked, setLiked] = useState(item.liked ?? item.is_liked ?? false);
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    const newLiked = !liked;

    setLiked(newLiked);
    setLikeCount((prev: number) => (newLiked ? prev + 1 : prev - 1));

    toggleLike({
      type,
      id: item.id,
    });
  };

  return (
    <View>
      <HStack justifyContent="space-around" className="flex-row">
        <TouchableOpacity
          className="flex-row items-center py-1 px-4"
          onPress={handleLike}
        >
          <ThumbsUp
            size={18}
            color={liked ? "#f59e0b" : "#6b7280"}
            fill={liked ? "#f59e0b" : "none"}
          />

          <Text
            className={`ml-2 text-md font-medium ${
              liked ? "text-amber-500" : "text-gray-500"
            }`}
          >
            Thích ({likeCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-1 px-4"
          onPress={() => setShowComments((prev) => !prev)}
        >
          <MessageSquare size={18} color="#6b7280" />
          <Text className="ml-2 text-gray-500 text-md font-medium">
            Bình luận ({item.commentCount || 0})
          </Text>
        </TouchableOpacity>
      </HStack>

      {/* COMMENT SECTION */}
      {showComments && (
        <View className="mt-3">
          <CommentSection feedId={item.id} type={type} />
        </View>
      )}
    </View>
  );
};
