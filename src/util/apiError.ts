import { isAxiosError } from "axios";
import { showErrorToast } from "./toast";

export const handleApiError = (error: unknown) => {
  if (!isAxiosError(error)) {
    showErrorToast("Lỗi hệ thống", "Có lỗi không xác định xảy ra");
    return;
  }

  if (!error.response) {
    showErrorToast(
      "Lỗi kết nối",
      "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.",
    );
    return;
  }

  const status = error.response.status;
  const data = error.response.data as any;

  switch (status) {
    case 401:
      showErrorToast("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu");
      break;
    case 422:
      const firstErr = data?.errors ? Object.values(data.errors)[0] : null;
      showErrorToast(
        "Dữ liệu không hợp lệ",
        (firstErr as string) || "Vui lòng kiểm tra lại",
      );
      break;
    case 500:
      showErrorToast(
        "Lỗi máy chủ",
        "Server đang bảo trì, vui lòng quay lại sau",
      );
      break;
    default:
      showErrorToast("Thông báo", data?.message || "Đã có lỗi xảy ra");
  }
};
