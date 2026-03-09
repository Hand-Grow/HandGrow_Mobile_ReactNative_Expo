import React, { useEffect } from "react";
import { ScrollView, SafeAreaView, TouchableOpacity, View } from "react-native";
import { VStack, HStack, Text } from "@gluestack-ui/themed";
import {
  Camera,
  Mic,
  MapPin,
  User,
  Bell,
  Menu,
  ChevronRight,
  Users,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppImage } from "../components/common/AppImage";
import { WeatherAlertCarousel } from "../components/common/WeatherAlertCarousel";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../store/user.store";
import { useUserActions } from "../hook/useProfile";

type NavigationProp = DrawerNavigationProp<RootStackParamList>;
export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const farmer = useUserStore((state: any) => state.profiles.farmer);
  const { fetchProfile } = useUserActions();

  useEffect(() => {
    if (!farmer) {
      fetchProfile("farmer");
    }
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false} className="px-5">
        <HStack
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          className="py-12"
        >
          <HStack gap={12} alignItems="center" flexDirection="row">
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
              <AppImage
                source={require("../assets/imgs/logo-sm.png")}
                className="w-12 h-12 self-center"
                resizeMode="contain"
              />
            </View>
            <VStack justifyContent="center">
              <Text className="text-gray-400 text-md font-medium">
                Xin chào,
              </Text>
              <Text className="text-xl font-extrabold text-slate-900 leading-6">
                {farmer?.fullName ?? "Không Xác Định"}
              </Text>
            </VStack>
          </HStack>

          <HStack gap={10} alignItems="center" flexDirection="row">
            <TouchableOpacity className="p-2.5 bg-white rounded-full border border-gray-100 shadow-sm">
              <Bell size={20} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              className="p-2.5 bg-white rounded-full border border-gray-100 shadow-sm"
            >
              <Menu size={20} color="#475569" />
            </TouchableOpacity>
          </HStack>
        </HStack>
        <WeatherAlertCarousel />
        <View className="flex-row flex-wrap justify-between mb-6">
          <MenuCard
            icon={Mic}
            label="Ghi nhật ký"
            color="#FFFF"
            bg="#f7c328"
            onPress={() => navigation.navigate("PlotList")}
          />
          <MenuCard
            icon={MapPin}
            label="Hợp tác xã"
            color="#FFFF"
            bg="#4dae57"
            onPress={() => {
              navigation.navigate("HTXDiscovery");
            }}
          />
          <MenuCard
            icon={Camera}
            label="Quét bệnh cây"
            color="#FFFF"
            bg="#32c08a"
            onPress={() => {}}
          />
          <MenuCard
            icon={User}
            label="Cá nhân"
            color="#FFFF"
            bg="#846b65"
            onPress={() => {}}
          />
        </View>
        <LinearGradient
          colors={["#38BDF8", "#2563EB"]}
          style={{ borderRadius: 10, padding: 24, marginBottom: 20 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <HStack
            justifyContent="space-between"
            alignItems="center"
            className="flex-row"
          >
            <Text className="text-white/80 text-md font-medium">
              ☁️ Hôm nay, 23/12/2024
            </Text>
            <Text className="text-white/80 text-md font-medium">
              Sơn Trà, Đà Nẵng
            </Text>
          </HStack>
          <Text className="text-white text-6xl font-black my-3">28°C</Text>
          <Text className="text-white font-semibold text-lg">
            Nhiều mây, có mưa rải rác
          </Text>
        </LinearGradient>

        <HStack justifyContent="space-between" className=" flex-row mb-8">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
            <View
              key={index}
              className={`items-center py-4 px-3 rounded-[20px] border w-[14%] ${
                index === 0
                  ? "bg-green-50 border-green-400"
                  : "bg-white border-gray-100 shadow-sm"
              }`}
            >
              <Text
                className={`text-xs font-bold mb-2 ${index === 0 ? "text-green-600" : "text-gray-400"}`}
              >
                {day}
              </Text>
              <Text className="text-xl mb-2">☀️</Text>
              <Text className="text-sm font-bold text-slate-800">29°</Text>
            </View>
          ))}
        </HStack>

        <RecentActivitySection />
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuCardProps {
  icon: any;
  label: string;
  color: string;
  bg: string;
  onPress: () => void;
}

const MenuCard = ({ icon: Icon, label, color, bg, onPress }: MenuCardProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50 mb-4 w-[48%] flex-col justify-center items-center"
  >
    <View
      style={{ backgroundColor: bg }}
      className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
    >
      <Icon size={24} color={color} />
    </View>
    <Text className="font-bold text-slate-800 text-md text-center">
      {label}
    </Text>
  </TouchableOpacity>
);

const ActivityItem = ({ title, distance, members, imageUri }: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex-row items-center mb-3"
  >
    <View className="w-14 h-14 bg-green-50 rounded-2xl items-center justify-center border border-green-100 mr-4">
      <AppImage source={{ uri: imageUri }} className="w-8 h-8" alt="htx-logo" />
    </View>
    <VStack className="flex-1" gap={4}>
      <Text className="text-[16px] font-bold text-slate-900 leading-5">
        {title}
      </Text>
      <HStack gap={12} alignItems="center" className="flex-row gap-[100px]">
        <HStack gap={4} alignItems="center">
          <MapPin size={12} color="#94a3b8" />
          <Text className="text-gray-400 text-[11px] font-medium">
            {distance}
          </Text>
        </HStack>
        <HStack gap={4} alignItems="center">
          <Users size={12} color="#94a3b8" />
          <Text className="text-gray-400 text-[11px] font-medium">
            {members} thành viên
          </Text>
        </HStack>
      </HStack>
    </VStack>
    <View className="bg-gray-50 p-2 rounded-full">
      <ChevronRight size={18} color="#cbd5e1" />
    </View>
  </TouchableOpacity>
);

const RecentActivitySection = () => (
  <View className="mt-4 mb-10">
    <HStack
      justifyContent="space-between"
      alignItems="center"
      className="flex-row mb-4"
    >
      <Text className="text-lg font-extrabold text-slate-800">
        Hoạt động gần đây
      </Text>
      <TouchableOpacity>
        <Text className="text-sky-500 font-bold text-sm">Xem tất cả</Text>
      </TouchableOpacity>
    </HStack>
    <ActivityItem
      title="HTX Nông nghiệp An Phước"
      distance="2.5 km"
      members="45"
      imageUri="https://cdn-icons-png.flaticon.com/512/2578/2578052.png"
    />
    <ActivityItem
      title="HTX Rau sạch Hòa Vang"
      distance="5.0 km"
      members="120"
      imageUri="https://cdn-icons-png.flaticon.com/512/4241/4241743.png"
    />
  </View>
);
