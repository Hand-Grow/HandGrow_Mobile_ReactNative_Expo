import { Button, ButtonText } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input, InputField, InputSlot } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { SignupSchema } from "@/src/schemas/auth.schema";
import {
  CheckIcon,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PhoneCall,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Pressable, View } from "react-native";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../ui/checkbox";
import ProduceSelect from "./ProduceSelect";

type Props = {
  form: UseFormReturn<SignupSchema>;
  onSubmit: (data: SignupSchema) => void;
};
export default function SignupForm({ form, onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <View className="gap-6 px-2">
        <Text className="text-4xl font-bold text-center">Đăng Ký</Text>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <User size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Nhập tên người dùng"
                  className="text-xl"
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
          name="username"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <Mail size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Nhập email của bạn"
                  className="text-xl"
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
          name="phoneNumber"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <PhoneCall size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Nhập số điện thoại"
                  className="text-xl"
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
                  placeholder="Nhập mật khẩu"
                  secureTextEntry={!showPassword}
                  className="text-xl"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Input className="h-[60px] rounded-lg border-border">
                <InputSlot className="ml-3">
                  <Lock size={20} color="#777B84" />
                </InputSlot>
                <InputField
                  placeholder="Xác nhận mật khẩu"
                  secureTextEntry={!showPassword}
                  className="text-xl"
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

        <FormField
          control={form.control}
          name="produce"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View>
              <ProduceSelect selectedValue={value} onValueChange={onChange} />
              {error && (
                <Text className="text-red-500 text-xl mt-1">
                  {error.message}
                </Text>
              )}
            </View>
          )}
        />
        <FormField
          control={form.control}
          name="agree"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormItem isInvalid={!!error}>
              <Checkbox value="agree" isChecked={value} onChange={onChange}>
                <CheckboxIndicator className="border-gray-600 ml-1">
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>

                <CheckboxLabel className="text-lg text-gray-600">
                  Tôi đồng ý với Điều khoản dịch vụ
                </CheckboxLabel>
              </Checkbox>
              <FormMessage>{error?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          className="h-[55px] rounded-xl bg-primary mt-2"
          onPress={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          <ButtonText className="text-white text-xl font-bold">
            {form.formState.isSubmitting ? "Đang đăng ký..." : "Đăng Ký"}
          </ButtonText>
        </Button>
      </View>
    </Form>
  );
}
