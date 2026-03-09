import * as Updates from "expo-updates";
import { useState } from "react";
import Toast from "react-native-toast-message";

export const useOTAUpdate = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkUpdate = async () => {
    try {
      if (__DEV__) {
        Toast.show({
          type: "info",
          text1: "Môi trường Dev",
          text2: "Tính năng cập nhật OTA chỉ hoạt động ở bản build (EAS).",
        });
        return;
      }

      setIsChecking(true);

      // Timeout fallback for checkForUpdateAsync
      const checkPromise = Updates.checkForUpdateAsync();
      const timeoutPromise = new Promise<{ isAvailable: boolean }>(
        (_, reject) =>
          setTimeout(
            () =>
              reject(new Error("Yêu cầu kiểm tra cập nhật quá hạn (timeout)")),
            15000,
          ),
      );

      const update = await Promise.race([checkPromise, timeoutPromise]);

      if (update.isAvailable) {
        setUpdateAvailable(true);
        Toast.show({
          type: "success",
          text1: "Có bản cập nhật mới",
          text2: "Nhấn để tải về và cài đặt.",
        });
      } else {
        setUpdateAvailable(false);
        Toast.show({
          type: "info",
          text1: "Đã cập nhật",
          text2: "Bạn đang sử dụng phiên bản mới nhất.",
        });
      }
    } catch (error: any) {
      console.error("Lỗi khi kiểm tra cập nhật:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error?.message || "Không thể kiểm tra cập nhật lúc này.",
      });
      // Nếu có lỗi, reset trạng thái
      setUpdateAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const downloadAndReload = async () => {
    try {
      setIsDownloading(true);

      const fetchPromise = Updates.fetchUpdateAsync();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Tải xuống quá hạn (timeout)")),
          30000,
        ),
      );

      await Promise.race([fetchPromise, timeoutPromise]);

      Toast.show({
        type: "success",
        text1: "Tải xong",
        text2: "Đang khởi động lại ứng dụng...",
      });

      await Updates.reloadAsync();
    } catch (error: any) {
      console.error("Lỗi khi tải bản cập nhật:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error?.message || "Không thể tải bản cập nhật.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isChecking,
    isDownloading,
    updateAvailable,
    checkUpdate,
    downloadAndReload,
  };
};
