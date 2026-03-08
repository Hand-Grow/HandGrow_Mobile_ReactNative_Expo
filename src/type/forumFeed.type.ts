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
}

// export interface PageResponse<T> {
//   plotName(plotName: any): unknown;
//   committedQuantity(committedQuantity: any): import("react").SetStateAction<string>;
//   content: T[];
//   totalElements: number;
//   totalPages: number;
//   last: boolean;
//   pageable: {
//     pageNumber: number;
//     pageSize: number;
//   };
// }

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
