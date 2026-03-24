/* eslint-disable react-hooks/exhaustive-deps */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Newspaper, User } from "lucide-react-native"; // Icon minh họa
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import DetailScreen from "../screens/DetailScreen";
import GroupOrderScreen from "../screens/GroupOrderScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import PlotListScreen from "../screens/PlotListScreen";
import SignupScreen from "../screens/SignupScreen";
import VoiceDiaryScreen from "../screens/VoiceDiaryScreen";
import UpcomingScreen from "../screens/UpcomingScreen";
// import ProfileScreen from "../screens/ProfileScreen"; // Screen mới
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigatorScreenParams } from "@react-navigation/native";
import { CustomDrawer } from "../components/common/Sidebar";
import CooperativeFeedScreen from "../screens/CooperativeFeedScreen";
import HTXDiscoveryScreen from "../screens/HTXDiscoveryScreen";
import { useAuthStore } from "../store/auth.store";

export type TabParamList = {
  HomeTab: undefined;
  Profile: undefined;
  HTXDiscovery: undefined;
  CoopFeed: undefined;
};
export type MainDrawerParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  GroupOrder: undefined;
};
export type RootStackParamList = {
  MainDrawer: NavigatorScreenParams<MainDrawerParamList>; // ✅ đúng
  SignUp: undefined;
  Login: undefined;
  HTXDiscovery: undefined;
  Detail: { id: number };
  Diary: { plotId: string; plotName: string };
  PlotList: undefined;
  CoopFeed: undefined;
  GroupOrder: undefined;
  Upcoming:
    | {
        feature?: "scan" | "profile" | "diary" | "generic";
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      {/* <HomeStack.Screen name="Detail" component={DetailScreen} options={{ title: "Chi tiết" }} /> */}
    </HomeStack.Navigator>
  );
}

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
        component={HomeStackNavigator}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="HTXDiscovery"
        component={HTXDiscoveryScreen}
        options={{
          title: "Hợp tác xã",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CoopFeed"
        component={CooperativeFeedScreen}
        options={{
          title: "Bảng tin",
          tabBarIcon: ({ color, size }) => (
            <Newspaper color={color} size={size} />
          ),
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
      <Stack.Screen
        name="PlotList"
        component={PlotListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Diary"
        component={VoiceDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GroupOrder"
        component={GroupOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Upcoming"
        component={UpcomingScreen}
        options={{ headerShown: false }}
       />
    </Stack.Navigator>
  );
}
