import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { GluestackUIProvider } from "./src/components/ui/gluestack-ui-provider";
import Toast from "react-native-toast-message";
import "@/global.css";
import { toastConfig } from "./src/components/ui/CustomToast";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <AppNavigator />
          {/* Đưa Toast vào đây để nó dùng được navigation nếu cần */}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
