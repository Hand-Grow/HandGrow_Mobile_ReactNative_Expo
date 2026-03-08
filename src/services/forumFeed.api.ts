import { FORUM_FEED_API } from "@/src/constants/api";
import type {
  FeedItemDTO,
  CommentDTO,
  CommitmentRequest,
  CommitmentDTO,
  FeedType,
} from "@/src/type/forumFeed.type";
import apiClient from "./apiClient";

export const getForumFeed = async (
  coopId: string,
  page: number = 0,
  size: number = 10,
  sort: string = "createdAt,desc",
): Promise<FeedItemDTO> => {
  const { data } = await apiClient.get<FeedItemDTO>(
    FORUM_FEED_API.GET_FEED(coopId),
    {
      params: { page, size, sort },
    },
  );
  console.log("🔍 FULL API RESPONSE for Forum Feed:", data); // LOG DÒNG NÀY
  return data;
};

export const toggleFeedLike = async (
  type: FeedType,
  id: string,
): Promise<{ liked: boolean; like_count: number }> => {
  const { data } = await apiClient.post(FORUM_FEED_API.TOGGLE_LIKE(type, id));
  console.log("🔍 FULL API RESPONSE for Toggle Like:", data); // LOG DÒNG NÀY
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
  console.log("🔍 FULL API RESPONSE for Campaign Commitments:", data); // LOG DÒNG NÀY
  return data;
};
