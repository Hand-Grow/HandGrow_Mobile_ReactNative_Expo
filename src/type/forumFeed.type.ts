export type FeedType = "ANNOUNCEMENT" | "CAMPAIGN";
export type FeedApiType = "announcements" | "campaigns";

export interface FeedItemDTO {
  id: string;
  type: FeedType;
  title: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  attachments?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  number?: number; // Some backends return `number` for current page.
  size?: number;
  pageable?: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface CommentDTO {
  id: string;
  farmerName: string;
  content: string;
  createdAt: string;
}

export interface CommitmentRequest {
  plotId: string;
  committedQuantity: number;
}

export interface CommitmentDTO {
  id: string;
  farmerName: string;
  plotName: string;
  quantity: number;
  createdAt: string;
}
