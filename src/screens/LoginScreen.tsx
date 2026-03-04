import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";

import LoginForm from "@/src/components/common/LoginForm";
import { AppImage } from "../components/common/AppImage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../services/auth.api";
import { handleApiError } from "../util/apiError";
import { useAuthStore } from "../store/auth.store";
import { showSuccessToast } from "../util/toast";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { startAuthAction, finishAuthAction, loginSuccess } = useAuthStore();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      startAuthAction();
      await login(data);
      loginSuccess();
      // showSuccessToast("Đăng nhập thành công", "Chào mừng bạn quay trở lại 👋");
    } catch (error) {
      handleApiError(error);
      console.log("Login error:", error);
    } finally {
      finishAuthAction();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      >
        <View className="flex-1 bg-white">
          <View className="mt-8 px-4">
            <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#111" />
            </Pressable>
          </View>

          <View className="flex-1 px-6 justify-start">
            <AppImage
              source={require("../assets/imgs/logo.png")}
              className="w-logo h-logo self-center"
              resizeMode="contain"
            />
            <LoginForm
              form={form}
              onSubmit={(data) => form.handleSubmit(onSubmit)()}
            />
          </View>

          <View className="pb-6 items-center">
            <View className="flex-row">
              <Text className="text-xl text-gray-500">
                Bạn chưa có tài khoản?
              </Text>
              <Pressable
                hitSlop={6}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text className="text-xl font-semibold text-info">Đăng ký</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
