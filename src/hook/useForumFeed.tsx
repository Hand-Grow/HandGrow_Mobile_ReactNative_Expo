// hooks/useForumFeed.ts

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getForumFeed,
  toggleFeedLike,
  getFeedComments,
  postFeedComment,
  createCampaignCommitment,
  getCampaignCommitments,
} from "@/src/services/forumFeed.api";
import { FeedType } from "@/src/type/forumFeed.type";
import { useUserStore } from "../store/user.store";

export const useForumFeed = (
  coopId: string,
  page = 0,
  size = 10,
  sort = "createdAt,desc",
) => {
  return useInfiniteQuery({
    queryKey: ["forum-feed", coopId, page, size, sort],
    queryFn: ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : page;
      return getForumFeed(coopId, currentPage, size, sort);
    },
    initialPageParam: page,
    getNextPageParam: (lastPage) => {
      const pageNumber =
        lastPage?.pageable?.pageNumber ?? lastPage?.number ?? 0;

      if (lastPage?.last === true) return undefined;

      if (typeof lastPage?.totalPages === "number") {
        const next = pageNumber + 1;
        return next >= lastPage.totalPages ? undefined : next;
      }

      const contentLength = Array.isArray(lastPage?.content)
        ? lastPage.content.length
        : 0;
      if (contentLength < size) return undefined;

      return pageNumber + 1;
    },
    enabled: !!coopId,
    placeholderData: (prev) => prev,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, id }: { type: FeedType; id: string }) => {
      return toggleFeedLike(type, id);
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["forum-feed"] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["forum-feed"],
      });

      queryClient.setQueriesData({ queryKey: ["forum-feed"] }, (old: any) => {
        if (!old) return old;

        const updateItem = (item: any) => {
          if (item?.id !== id) return item;

          const newLiked = !item.liked;

          return {
            ...item,
            liked: newLiked,
            likeCount: newLiked ? item.likeCount + 1 : item.likeCount - 1,
          };
        };

        if (Array.isArray(old?.pages)) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              content: Array.isArray(p?.content)
                ? p.content.map(updateItem)
                : p,
            })),
          };
        }

        if (Array.isArray(old?.content)) {
          return { ...old, content: old.content.map(updateItem) };
        }

        if (Array.isArray(old)) {
          return old.map(updateItem);
        }

        if (Array.isArray(old?.data)) {
          return { ...old, data: old.data.map(updateItem) };
        }

        return old;
      });

      return { previousQueries };
    },

    onError: (err, variables, context) => {
      if (!context?.previousQueries) return;
      for (const [key, data] of context.previousQueries) {
        queryClient.setQueryData(key, data);
      }
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

        const bumpCommentCount = (feed: any) =>
          feed?.id === variables.id
            ? {
                ...feed,
                commentCount: (feed.commentCount || 0) + 1,
              }
            : feed;

        if (Array.isArray(old?.pages)) {
          return {
            ...old,
            pages: old.pages.map((p: any) => ({
              ...p,
              content: Array.isArray(p?.content)
                ? p.content.map(bumpCommentCount)
                : p?.content,
            })),
          };
        }

        if (Array.isArray(old?.content)) {
          return { ...old, content: old.content.map(bumpCommentCount) };
        }

        if (Array.isArray(old?.data)) {
          return { ...old, data: old.data.map(bumpCommentCount) };
        }

        if (Array.isArray(old)) {
          return old.map(bumpCommentCount);
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
  const userId = useUserStore((state) => state.user?.id);
  return useQuery({
    queryKey: ["campaign-commitments", campaignId, userId, page, size, sort],
    queryFn: () => getCampaignCommitments(campaignId, page, size, sort),
    enabled: !!campaignId && !!userId,
    select: (data) => data,
  });
};
