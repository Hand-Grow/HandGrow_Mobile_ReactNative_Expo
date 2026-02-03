import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react-native";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { AppImage } from "../components/common/AppImage";
import SignupForm from "../components/common/SignupForm";
import { signupSchema, SignupSchema } from "../schemas/auth.schema";
import { handleApiError } from "../util/apiError";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { signup } from "../services/auth.api";

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
    } catch (error) {
      handleApiError(error);
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
          <View className="mt-8 px-4">
            <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#111" />
            </Pressable>
          </View>

          <View className="flex-1 px-6">
            <AppImage
              source={require("../assets/imgs/logo.png")}
              className="w-logo h-logo self-center"
              resizeMode="contain"
            />

            <SignupForm form={form} onSubmit={onSubmit} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
