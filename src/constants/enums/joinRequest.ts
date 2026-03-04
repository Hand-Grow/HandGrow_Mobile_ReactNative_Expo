export enum JoinRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NOT_JOINED = "NOT_JOINED",
}

export const JOIN_REQUEST_LABELS: Record<JoinRequestStatus, string> = {
  [JoinRequestStatus.PENDING]: "Đã gửi",
  [JoinRequestStatus.APPROVED]: "Đã gia nhập",
  [JoinRequestStatus.REJECTED]: "Bị từ chối",
  [JoinRequestStatus.NOT_JOINED]: "Tham gia",
};

export const JOIN_REQUEST_COLORS: Record<
  JoinRequestStatus,
  { bg: string; text: string }
> = {
  [JoinRequestStatus.PENDING]: { bg: "bg-blue-100", text: "text-blue-600" },
  [JoinRequestStatus.APPROVED]: { bg: "bg-gray-100", text: "text-gray-500" },
  [JoinRequestStatus.REJECTED]: { bg: "bg-red-100", text: "text-red-600" },
  [JoinRequestStatus.NOT_JOINED]: { bg: "bg-emerald-600", text: "text-white" },
};
