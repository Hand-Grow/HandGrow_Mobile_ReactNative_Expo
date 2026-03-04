import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ArrowLeft, Mic, Square } from "lucide-react-native";
import { Audio } from "expo-av";
import dayjs from "dayjs";
import DiaryHistoryItem from "../components/common/DiaryHistoryItem";
import { voiceDiaryApi } from "../services/voiceDiary.api";
import {
  DiaryResponse,
  CreateDiaryRequest,
  ActivityType,
} from "../type/voiceDiary.type";
import { RootStackParamList } from "../navigation/AppNavigator";

export default function VoiceDiaryScreen() {
  const navigation = useNavigation();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const [diaries, setDiaries] = useState<DiaryResponse[]>([]);
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const route = useRoute<RouteProp<RootStackParamList, "Diary">>();
  const plotId = route.params?.plotId || "00000000-0000-0000-0000-000000000000";
  const plotName = route.params?.plotName || "Mặc định";

  useEffect(() => {
    fetchDiaries();
    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const fetchDiaries = async () => {
    try {
      setIsLoadingDiaries(true);
      const endDate = dayjs().format("YYYY-MM-DD");
      const startDate = dayjs().subtract(30, "day").format("YYYY-MM-DD");
      const data = await voiceDiaryApi.getDiariesByPlot(
        plotId,
        startDate,
        endDate,
      );
      setDiaries(data);
    } catch (error) {
      console.log("Error fetching diaries:", error);
    } finally {
      setIsLoadingDiaries(false);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Quyền microphone bị từ chối",
          "Vui lòng cấp quyền để sử dụng tính năng này.",
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Lỗi", "Không thể bắt đầu ghi âm.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      if (timerInterval) clearInterval(timerInterval);

      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      setRecording(null);
      setRecordingDuration(0);

      if (uri) {
        handleUploadAudio(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const handleUploadAudio = async (uri: string) => {
    try {
      setIsUploading(true);
      // 1. Upload to Gemini via backend
      const mimeType = Platform.OS === "ios" ? "audio/m4a" : "audio/mp4"; // Expo AV default extension is .m4a or .caf on iOS, .m4a/.mp4 on Android
      const result = await voiceDiaryApi.uploadVoiceDiary(uri, mimeType);

      if (result.status === "ok" && result.transcription) {
        // Parse the transcription to create standard Diary entry
        let extractedData: any = {};
        try {
          extractedData = JSON.parse(result.transcription);
        } catch (e) {
          console.log(
            "Failed to parse json transcription",
            result.transcription,
          );
        }

        if (extractedData.error) {
          Alert.alert(
            "Thông báo",
            "Nội dung không hợp lệ hoặc không liên quan đến nông nghiệp",
          );
          return;
        }

        const createReq: CreateDiaryRequest = {
          plotId: plotId,
          activityDate: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          activityType:
            (extractedData.activity_type as ActivityType) || "OTHER",
          expense: extractedData.expense || 0,
          aiExtractedData: JSON.stringify(extractedData.data || {}),
          originalTranscript: result.transcription,
        };

        await voiceDiaryApi.createDiary(createReq);
        Alert.alert("Thành công", "Đã lưu nhật ký!");
        fetchDiaries(); // Refresh list
      } else {
        Alert.alert("Lỗi", result.message || "Không thể trích xuất thông tin.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải lên file ghi âm.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Profile Section */}
      <View className="bg-blue-500 pt-12 pb-6 px-4 rounded-b-3xl">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View className="ml-2">
            <Text className="text-white text-xl font-bold">{plotName}</Text>
            <Text className="text-blue-100 text-sm">
              Ghi chép bằng giọng nói
            </Text>
          </View>
        </View>

        {/* Stats Card */}
        <View className="bg-white rounded-xl p-4 flex-row justify-between items-center shadow-sm">
          <View>
            <Text className="text-gray-500 mb-1">Tổng số ghi chép</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {diaries.length}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 mb-1">Tháng này</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {
                diaries.filter(
                  (d) => dayjs(d.activityDate).month() === dayjs().month(),
                ).length
              }
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 mt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Record Card */}
        <View className="bg-white rounded-2xl p-6 items-center shadow-sm mb-6 elevation-1">
          <View className="w-full flex-row justify-between mb-6">
            <View className="flex-row items-center">
              <Mic size={20} color="#6B7280" />
              <Text className="text-gray-700 ml-2 font-medium">
                Ghi chép mới
              </Text>
            </View>
            <Text className="text-gray-700 font-medium">
              {dayjs().format("DD/MM/YYYY")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
              isRecording ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : isRecording ? (
              <Square color="white" size={32} fill="white" />
            ) : (
              <Mic color="white" size={36} />
            )}
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-800 tracking-widest mb-4">
            {formatDuration(recordingDuration)}
          </Text>

          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={`px-8 py-3 rounded-full ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            } ${isUploading ? "opacity-50" : "opacity-100"}`}
          >
            <Text className="text-white font-medium text-lg">
              {isUploading
                ? "Đang xử lý..."
                : isRecording
                  ? "Dừng ghi"
                  : "Bắt đầu ghi"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* History Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Lịch sử ghi chép
          </Text>
          <TouchableOpacity className="bg-white px-4 py-1.5 rounded-lg border border-gray-200">
            <Text className="text-gray-600 font-medium">Lọc</Text>
          </TouchableOpacity>
        </View>

        {isLoadingDiaries ? (
          <ActivityIndicator size="large" color="#3B82F6" className="mt-4" />
        ) : diaries.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">
            Chưa có ghi chép nào.
          </Text>
        ) : (
          diaries.map((item) => <DiaryHistoryItem key={item.id} item={item} />)
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
