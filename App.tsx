import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { GluestackUIProvider } from "./src/components/ui/gluestack-ui-provider";
import Toast from "react-native-toast-message";
import "@/global.css";
import { toastConfig } from "./src/components/ui/CustomToast";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,

      gcTime: 1000 * 60 * 10,

      retry: 1,

      refetchOnMount: false,

      refetchOnWindowFocus: false,

      refetchOnReconnect: true,
    },

    mutations: {
      retry: 0,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <AppNavigator />
            <Toast config={toastConfig} />
          </NavigationContainer>
        </QueryClientProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
