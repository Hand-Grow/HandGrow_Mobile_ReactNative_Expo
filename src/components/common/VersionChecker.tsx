import React from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Text, VStack, HStack } from "@gluestack-ui/themed";
import { RefreshCw, DownloadCloud } from "lucide-react-native";
import Constants from "expo-constants";
import { useOTAUpdate } from "../../hook/useOTAUpdate";

export const VersionChecker = () => {
  const {
    isChecking,
    isDownloading,
    updateAvailable,
    checkUpdate,
    downloadAndReload,
  } = useOTAUpdate();

  const version = Constants.expoConfig?.version ?? "1.0.0";
  const runtimeVersionObj = Constants.expoConfig?.runtimeVersion;
  const runtimeVersion =
    typeof runtimeVersionObj === "object"
      ? runtimeVersionObj.policy
      : (runtimeVersionObj ?? "Unknown");

  return (
    <VStack className="px-4 py-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
      <HStack
        justifyContent="space-between"
        alignItems="center"
        className="mb-2"
      >
        <Text className="text-sm font-semibold text-gray-700">Phiên bản</Text>
        <Text className="text-xs text-gray-500">
          v{version} (RT: {runtimeVersion})
        </Text>
      </HStack>

      {updateAvailable ? (
        <TouchableOpacity
          onPress={downloadAndReload}
          disabled={isDownloading}
          className="flex-row items-center justify-center p-2 bg-green-500 rounded-lg"
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#ffffff" className="mr-2" />
          ) : (
            <DownloadCloud size={16} color="#ffffff" className="mr-2" />
          )}
          <Text className="text-white font-medium text-sm">
            {isDownloading ? "Đang tải..." : "Tải và Khởi động lại"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={checkUpdate}
          disabled={isChecking}
          className="flex-row items-center justify-center p-2 bg-blue-50 rounded-lg border border-blue-100"
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#3B82F6" className="mr-2" />
          ) : (
            <RefreshCw size={16} color="#3B82F6" className="mr-2" />
          )}
          <Text className="text-blue-600 font-medium text-sm">
            {isChecking ? "Đang kiểm tra..." : "Kiểm tra cập nhật"}
          </Text>
        </TouchableOpacity>
      )}
    </VStack>
  );
};
