import React from "react";
import { Container } from "../components/common/Container";
import { Button, ButtonText } from "@/src/components/ui/button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/auth.store";
import { View } from "react-native";
import { Text } from "../components/ui/text";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const clearSession = useAuthStore((state) => state.logout);

  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-gray-800">
          Đây là màn hình Home
        </Text>
        <Button
          className="mt-4 bg-red-500"
          onPress={() => {
            clearSession();
            // navigation.replace("Login");
          }}
        >
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </View>
    </Container>
  );
}
