import apiClient from "./apiClient";
import {
  CreateDiaryRequest,
  DiaryResponse,
  ProfitResponse,
  VoiceDiaryResponse,
} from "../type/voiceDiary.type";

const VOICE_DIARY_BASE_URL = "/api/v1/voice-diary";

export const voiceDiaryApi = {
  // Upload audio file for AI transcription
  uploadVoiceDiary: async (
    audioUri: string,
    mimeType: string,
  ): Promise<VoiceDiaryResponse> => {
    // React Native typically uses FormData with a special `{ uri, name, type }` object for File
    const formData = new FormData();
    const filename = audioUri.split("/").pop() || "audio-record.m4a";

    formData.append("audio", {
      uri: audioUri,
      name: filename,
      type: mimeType,
    } as any);

    const response = await apiClient.post<VoiceDiaryResponse>(
      `${VOICE_DIARY_BASE_URL}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Create a new diary entry manually or after AI transcription
  createDiary: async (request: CreateDiaryRequest): Promise<DiaryResponse> => {
    const response = await apiClient.post<DiaryResponse>(
      VOICE_DIARY_BASE_URL,
      request,
    );
    return response.data;
  },

  // Get diaries by Plot ID and Date Range
  getDiariesByPlot: async (
    plotId: string,
    startDate: string, // ISO Date 'YYYY-MM-DD'
    endDate: string,
  ): Promise<DiaryResponse[]> => {
    const response = await apiClient.get<DiaryResponse[]>(
      `${VOICE_DIARY_BASE_URL}/plot/${plotId}`,
      {
        params: { startDate, endDate },
      },
    );
    console.log("Diaries fetched for plot:", response.data);
    return response.data;
  },

  // Get a specific diary
  getDiaryById: async (diaryId: string): Promise<DiaryResponse> => {
    const response = await apiClient.get<DiaryResponse>(
      `${VOICE_DIARY_BASE_URL}/${diaryId}`,
    );
    return response.data;
  },

  // Update a diary entry
  updateDiary: async (
    diaryId: string,
    request: CreateDiaryRequest,
  ): Promise<DiaryResponse> => {
    const response = await apiClient.put<DiaryResponse>(
      `${VOICE_DIARY_BASE_URL}/${diaryId}`,
      request,
    );
    return response.data;
  },

  // Delete a diary entry
  deleteDiary: async (
    diaryId: string,
  ): Promise<{ message: string; success: boolean }> => {
    const response = await apiClient.delete(
      `${VOICE_DIARY_BASE_URL}/${diaryId}`,
    );
    return response.data;
  },

  // Get profit calculation
  calculateProfit: async (
    plotId: string,
    startDate: string,
    endDate: string,
  ): Promise<ProfitResponse> => {
    const response = await apiClient.get<ProfitResponse>(
      `${VOICE_DIARY_BASE_URL}/plot/${plotId}/profit`,
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  },
};
