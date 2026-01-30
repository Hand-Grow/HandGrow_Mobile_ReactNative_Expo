/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { View } from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import { useAuthStore } from "../store/auth.store";

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  Detail: { id: number };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isBootstrapping, bootstrap } = useAuthStore();
  const isLoading = isBootstrapping;
  useEffect(() => {
    bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
          </>
        )}
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: "Detail Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
