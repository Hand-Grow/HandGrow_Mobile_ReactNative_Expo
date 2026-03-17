import { FORUM_FEED_API } from "@/src/constants/api";
import type {
  FeedItemDTO,
  CommentDTO,
  CommitmentRequest,
  CommitmentDTO,
  FeedType,
  PageResponse,
} from "@/src/type/forumFeed.type";
import apiClient from "./apiClient";

const normalizePageResponse = <T>(
  payload: any,
  requestedPage: number,
  requestedSize: number,
): PageResponse<T> => {
  if (!payload) {
    return {
      content: [],
      number: requestedPage,
      size: requestedSize,
      last: true,
    };
  }

  if (Array.isArray(payload)) {
    return {
      content: payload,
      number: requestedPage,
      size: requestedSize,
      last: payload.length < requestedSize,
    };
  }

  const unwrapped = payload?.data ?? payload;

  if (Array.isArray(unwrapped)) {
    return {
      content: unwrapped,
      number: requestedPage,
      size: requestedSize,
      last: unwrapped.length < requestedSize,
    };
  }

  if (Array.isArray(unwrapped?.content)) {
    return {
      ...unwrapped,
      number:
        unwrapped?.number ?? unwrapped?.pageable?.pageNumber ?? requestedPage,
      size: unwrapped?.size ?? unwrapped?.pageable?.pageSize ?? requestedSize,
    };
  }

  const items =
    (Array.isArray(unwrapped?.items) ? unwrapped.items : undefined) ??
    (Array.isArray(unwrapped?.results) ? unwrapped.results : undefined);

  if (items) {
    return {
      content: items,
      number: requestedPage,
      size: requestedSize,
      last: items.length < requestedSize,
      totalElements: unwrapped?.totalElements ?? unwrapped?.total ?? undefined,
      totalPages: unwrapped?.totalPages ?? unwrapped?.pages ?? undefined,
    };
  }

  return {
    content: [],
    number: requestedPage,
    size: requestedSize,
    last: true,
  };
};

export const getForumFeed = async (
  coopId: string,
  page: number = 0,
  size: number = 10,
  sort: string = "createdAt,desc",
  type?: FeedType,
): Promise<PageResponse<FeedItemDTO>> => {
  const { data } = await apiClient.get<any>(FORUM_FEED_API.GET_FEED(coopId), {
    params: { page, size, sort, type },
  });
  return normalizePageResponse<FeedItemDTO>(data, page, size);
};

export const toggleFeedLike = async (
  type: FeedType,
  id: string,
): Promise<{ liked: boolean; like_count: number }> => {
  const { data } = await apiClient.post(FORUM_FEED_API.TOGGLE_LIKE(type, id));
  return data;
};

export const getFeedComments = async (
  type: FeedType,
  id: string,
  page: number = 0,
  size: number = 20,
): Promise<CommentDTO> => {
  const { data } = await apiClient.get<CommentDTO>(
    FORUM_FEED_API.GET_COMMENTS(type, id),
    {
      params: { page, size },
    },
  );

  return data;
};

export const postFeedComment = async (
  type: FeedType,
  id: string,
  content: string,
): Promise<CommentDTO> => {
  const { data } = await apiClient.post<CommentDTO>(
    FORUM_FEED_API.POST_COMMENT(type, id),
    { content },
  );

  return data;
};

export const createCampaignCommitment = async (
  campaignId: string,
  payload: CommitmentRequest,
): Promise<CommitmentDTO> => {
  const { data } = await apiClient.post<CommitmentDTO>(
    FORUM_FEED_API.CREATE_COMMITMENT(campaignId),
    payload,
  );

  return data;
};

export const getCampaignCommitments = async (
  campaignId: string,
  page: number = 0,
  size: number = 10,
  sort: string = "createdAt,desc",
): Promise<CommitmentDTO[]> => {
  const { data } = await apiClient.get<CommitmentDTO[]>(
    FORUM_FEED_API.GET_COMMITMENTS(campaignId),
    {
      params: { page, size, sort },
    },
  );
  return data;
};
