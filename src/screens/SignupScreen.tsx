import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { AppImage } from "../components/common/AppImage";
import SignupForm from "../components/common/SignupForm";
import { RootStackParamList } from "../navigation/AppNavigator";
import { signupSchema, SignupSchema } from "../schemas/auth.schema";
import { signup } from "../services/auth.api";
import { handleApiError } from "../util/apiError";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      produce: "RICE",
      agree: false,
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    try {
      await signup({
        fullName: data.fullName,
        username: data.username,
        phoneNumber: data.phoneNumber,
        password: data.password,
        produce: data.produce ?? "OTHER",
      });
      navigation.replace("Login");
    } catch (error: any) {
      if (error?.response?.status === 500) {
        form.setError("username", {
          type: "manual",
          message: "Email này đã được đăng ký. Vui lòng sử dụng email khác.",
        });
      } else {
        handleApiError(error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white">
          <View className="flex-1 px-6">
            <View className="w-64 h-64 self-center mb-6">
              <AppImage
                source={require("../assets/imgs/logo.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>

            <SignupForm form={form} onSubmit={onSubmit} />
          </View>
          <View className="flex-row justify-center items-center pb-6 mt-6">
            <Text className="text-lg text-gray-500">Đã có tài khoản?</Text>
            <Pressable hitSlop={6} onPress={() => navigation.navigate("Login")}>
              <Text className="text-lg font-semibold text-info">
                {" "}
                Đăng nhập
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
