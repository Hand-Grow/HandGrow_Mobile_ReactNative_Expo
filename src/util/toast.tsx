import Toast from "react-native-toast-message";

export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    visibilityTime: 3000,
    swipeable: true,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    visibilityTime: 4000,
    swipeable: true,
  });
};

export const showWarningToast = (title: string, message?: string) => {
  Toast.show({
    type: "warning",
    text1: title,
    text2: message,
    visibilityTime: 3500,
    swipeable: true,
  });
};

export const showInfoToast = (title: string, message?: string) => {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    visibilityTime: 3000,
    swipeable: true,
  });
};
