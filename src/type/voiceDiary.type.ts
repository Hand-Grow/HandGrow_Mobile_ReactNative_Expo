export type ActivityType =
  | "FERTILIZING"
  | "PESTICIDE"
  | "PLANTING"
  | "HARVESTING"
  | "WATERING"
  | "WEEDING";

export interface CreateDiaryRequest {
  plotId: string;
  activityDate: string;
  activityType: ActivityType;
  expense: number;
  aiExtractedData: string;
  originalTranscript: string;
}

export interface DiaryResponse {
  id: string;
  plotName: string;
  activityDate: string;
  activityType: ActivityType;
  expense: number;
  aiExtractedData: string;
  originalTranscript: string;
}

export interface VoiceDiaryResponse {
  status: string;
  message: string;
  transcription: string;
}

export interface ProfitResponse {
  totalRevenue: number;
  totalExpense: number;
  profit: number;
  expenseBreakdown: Record<string, number>;
}
