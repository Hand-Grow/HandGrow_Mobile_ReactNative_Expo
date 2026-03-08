// hooks/useForumFeed.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getForumFeed,
  toggleFeedLike,
  getFeedComments,
  postFeedComment,
  createCampaignCommitment,
  getCampaignCommitments,
} from "@/src/services/forumFeed.api";
import { FeedType } from "@/src/type/forumFeed.type";

export const useForumFeed = (
  coopId: string,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
) => {
  return useQuery({
    queryKey: ["forum-feed", coopId, page, sort],
    queryFn: () => getForumFeed(coopId, page, size, sort),
    enabled: !!coopId,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: FeedType; id: string }) => {
      console.log("CALL LIKE API", type, id);
      return toggleFeedLike(type, id);
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["forum-feed"] });

      const previousData = queryClient.getQueryData(["forum-feed"]);

      queryClient.setQueryData(["forum-feed"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: old.data?.map((item: any) => {
            if (item.id !== id) return item;

            const newLiked = !item.liked;

            return {
              ...item,
              liked: newLiked,
              likeCount: newLiked ? item.likeCount + 1 : item.likeCount - 1,
            };
          }),
        };
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["forum-feed"], context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-feed"] });
    },
  });
};

export const useFeedComments = (
  type: FeedType,
  id: string,
  page = 0,
  size = 10,
) => {
  return useQuery({
    queryKey: ["feed-comments", type, id, page],
    queryFn: () => getFeedComments(type, id, page, size),
    enabled: !!id,
  });
};

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
      content,
    }: {
      type: FeedType;
      id: string;
      content: string;
    }) => postFeedComment(type, id, content),

    onSuccess: (newComment, variables) => {
      queryClient.setQueriesData(
        { queryKey: ["feed-comments", variables.type, variables.id] },
        (oldData: any[] = []) => [newComment, ...oldData],
      );

      queryClient.setQueriesData({ queryKey: ["forum-feed"] }, (old: any) => {
        if (!old) return old;

        if (old.data) {
          return {
            ...old,
            data: old.data.map((feed: any) =>
              feed.id === variables.id
                ? {
                    ...feed,
                    commentCount: (feed.commentCount || 0) + 1,
                  }
                : feed,
            ),
          };
        }

        if (Array.isArray(old)) {
          return old.map((feed: any) =>
            feed.id === variables.id
              ? {
                  ...feed,
                  commentCount: (feed.commentCount || 0) + 1,
                }
              : feed,
          );
        }

        return old;
      });
    },
  });
};

export const useCreateCommitment = () => {
  return useMutation({
    mutationFn: ({
      campaignId,
      payload,
    }: {
      campaignId: string;
      payload: any;
    }) => createCampaignCommitment(campaignId, payload),
  });
};

export const useCampaignCommitments = (
  campaignId: string,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
) => {
  return useQuery({
    queryKey: ["campaign-commitments", campaignId, page, size, sort],
    queryFn: () => getCampaignCommitments(campaignId, page, size, sort),
    enabled: !!campaignId,
    select: (data) => data,
  });
};
