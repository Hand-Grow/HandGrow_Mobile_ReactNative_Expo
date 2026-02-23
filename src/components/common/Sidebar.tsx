import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Home,
  BookOpen,
  Camera,
  MapPin,
  User as UserIcon,
  LogOut,
  User,
} from "lucide-react-native";
import { VStack, HStack, Divider } from "@gluestack-ui/themed";
import { useAuthStore } from "../../store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppImage } from "./AppImage";

export function CustomDrawer(props: any) {
  const { logout } = useAuthStore();
  const user = {
    fullName: "Y Xa Bế",
    address: "An Hai - Da Nang",
    avatar: "https://i.pravatar.cc/150?img=1",
  };

  const menuItems = [
    { label: "Trang chủ", icon: Home, target: "HomeTab", active: true },
    { label: "Nhật ký", icon: BookOpen, target: "Diary", active: false },
    { label: "Quét bệnh", icon: Camera, target: "Scan", active: false },
    {
      label: "Hợp tác xã gần đây",
      icon: MapPin,
      target: "Cooperative",
      active: false,
    },
    {
      label: "Hồ Sơ Cá Nhân",
      icon: User,
      target: "profile",
      active: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6 flex-1">
        <HStack gap={12} alignItems="center" className="mb-8 mt-4">
          <View className="w-14 h-14 bg-orange-100 rounded-full items-center justify-center border border-orange-200">
            {user.avatar ? (
              <AppImage
                source={{ uri: user.avatar }}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <UserIcon size={30} color="#846b65" />
            )}
          </View>
          <VStack>
            <Text className="text-lg font-bold text-slate-900">
              {user?.fullName ?? "Y Xa Bế"}
            </Text>
            <Text className="text-gray-500 text-xs">
              Nông dân - {user?.address ?? "Da Nang"}
            </Text>
          </VStack>
        </HStack>

        <Divider className="mb-6 bg-gray-100" />

        <VStack gap={8} className="flex-1">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => props.navigation.navigate(item.target)}
              className={`flex-row items-center p-4 rounded-2xl ${item.active ? "bg-green-50" : "bg-transparent"}`}
            >
              <item.icon
                size={22}
                color={item.active ? "#4dae57" : "#475569"}
              />
              <Text
                className={`ml-4 font-bold ${item.active ? "text-green-700" : "text-slate-600"}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </VStack>

        <TouchableOpacity
          onPress={() => logout()}
          className="flex-row items-center p-4 mt-auto border-t border-gray-100"
        >
          <LogOut size={22} color="#EF4444" />
          <Text className="ml-4 font-bold text-red-500">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
