import { Button, ButtonText } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input, InputField, InputSlot } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { LoginSchema } from "@/src/schemas/auth.schema";
import { Eye, EyeOff, Lock, User } from "lucide-react-native";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Pressable, View } from "react-native";
import { AppImage } from "./AppImage";
import { useAuthStore } from "@/src/store/auth.store";

type Props = {
  form: UseFormReturn<LoginSchema>;
  onSubmit: (data: LoginSchema) => void;
};
export default function LoginForm({ form, onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isSubmitting = useAuthStore((s) => s.isSubmitting);
  return (
    <Form {...form}>
      <View className="gap-6 px-2">
        <Text className="text-4xl font-bold text-center">Đăng nhập</Text>

        <FormField
          control={form.control}
          name="username"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <User size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Tên đăng nhập bằng email đã đăng ký"
                  className="text-lg"
                  value={value}
                  onChangeText={onChange}
                />
              </Input>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <Lock size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Mật khẩu"
                  secureTextEntry={!showPassword}
                  className="text-lg"
                  value={value}
                  onChangeText={onChange}
                />
                <InputSlot className="mr-3">
                  <Pressable
                    hitSlop={8}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#777B84" />
                    ) : (
                      <Eye size={20} color="#777B84" />
                    )}
                  </Pressable>
                </InputSlot>
              </Input>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Pressable hitSlop={8}>
          <Text className="text-right text-lg text-gray-500">
            Quên mật khẩu?
          </Text>
        </Pressable>

        <Button
          className="h-[55px] rounded-xl bg-primary mt-2"
          disabled={isSubmitting}
          onPress={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ButtonText className="text-white text-lg font-bold">
              Đang đăng nhập...
            </ButtonText>
          ) : (
            <ButtonText className="text-white text-lg font-bold">
              Tiếp tục
            </ButtonText>
          )}
        </Button>

        <Button className="h-[55px] rounded-xl bg-blue-500 px-4">
          <View className="flex-row items-center justify-center gap-3">
            <AppImage
              source={require("../../assets/imgs/googleIcon.png")}
              className="w-6 h-6"
              resizeMode="contain"
            />
            <ButtonText className="text-lg text-white font-bold">
              Tiếp tục bằng Google
            </ButtonText>
          </View>
        </Button>
      </View>
    </Form>
  );
}
