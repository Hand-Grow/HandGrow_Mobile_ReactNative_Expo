/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { Home, User } from "lucide-react-native"; // Icon minh họa

import HomeScreen from "../screens/HomeScreen";
import DetailScreen from "../screens/DetailScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
// import ProfileScreen from "../screens/ProfileScreen"; // Screen mới
import { useAuthStore } from "../store/auth.store";
import { CustomDrawer } from "../components/common/Sidebar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HTXDiscoveryScreen from "../screens/HTXDiscoveryScreen";

export type TabParamList = {
  HomeTab: undefined;
  Profile: undefined;
  HTXDiscovery: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  MainDrawer: undefined;
  SignUp: undefined;
  Login: undefined;
  HTXDiscovery: undefined;
  Detail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2f95dc",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="HTXDiscovery"
        component={HTXDiscoveryScreen}
        options={{
          title: "Tìm HTX",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
const Drawer = createDrawerNavigator();

function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { width: "80%" },
        drawerPosition: "right",
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isBootstrapping, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, []);

  if (isBootstrapping) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainDrawer" component={MainDrawerNavigator} />
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
        options={{ headerShown: true, title: "Chi tiết" }}
      />
    </Stack.Navigator>
  );
}
