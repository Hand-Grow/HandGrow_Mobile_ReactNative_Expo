import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useUserStore } from "../store/user.store";
import { PRODUCE_LABELS, ProduceType } from "../constants/enums/produce.enum";
import { User } from "../type/auth.type";
import { RootStackParamList } from "../navigation/AppNavigator";

const formatAddress = (user: User | null) => {
  if (!user) return "Chưa cập nhật";

  if (typeof user.address === "string" && user.address.trim())
    return user.address;
  if (
    user.address &&
    typeof user.address === "object" &&
    typeof user.address.full === "string"
  ) {
    return user.address.full;
  }

  const byCommuneProvince = [user.commune, user.province]
    .filter(Boolean)
    .join(", ");
  return byCommuneProvince || "Chưa cập nhật";
};

const ProfileScreen = () => {
  type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<NavigationProp>();

  const user = useUserStore((state) => state.user ?? state.profiles.farmer);

  const fullName = user?.fullName ?? "Chưa xác định";
  const username = user?.username ?? "—";
  const phoneNumber = user?.phoneNumber ?? "—";
  const address = formatAddress(user);

  const produceKey = user?.produce as ProduceType | undefined;
  const produceLabel =
    produceKey && produceKey in PRODUCE_LABELS
      ? PRODUCE_LABELS[produceKey]
      : user?.produce || "—";

  const navigateBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("MainDrawer", {
      screen: "MainTabs",
      params: { screen: "HomeTab" },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#32c08a", "#1e9c6e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-12 pb-8 px-6 rounded-b-3xl"
        >
          <TouchableOpacity
            onPress={navigateBack}
            activeOpacity={0.8}
            className="absolute left-5 top-12 w-11 h-11 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View className="items-center">
            <View className="w-28 h-28 rounded-full bg-white p-1 shadow-lg mb-4">
              <View className="w-full h-full rounded-full bg-gray-200 items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={56} color="#32c08a" />
                )}
              </View>
            </View>
            <Text className="text-white text-2xl font-bold">{fullName}</Text>
            <Text className="text-white/80 text-sm mt-1">
              {user?.username ? `@${username}` : "Chưa có thông tin người dùng"}
            </Text>
          </View>
        </LinearGradient>

        <View className="px-5 -mt-5">
          <View className="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Thông tin liên hệ
            </Text>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <Ionicons name="call-outline" size={20} color="#32c08a" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-500 text-xs">Số điện thoại</Text>
                <Text className="text-gray-800 text-base font-medium">
                  {phoneNumber}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#3b82f6"
                />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-500 text-xs">Tài khoản</Text>
                <Text className="text-gray-800 text-base font-medium">
                  {username}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
                <Ionicons name="location-outline" size={20} color="#f97316" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-500 text-xs">Địa chỉ</Text>
                <Text className="text-gray-800 text-base font-medium">
                  {address}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              Thông tin nông hộ
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-base font-bold text-green-600">
                  {produceLabel}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">Nông sản</Text>
              </View>
              <View className="items-center">
                <Text className="text-base font-bold text-green-600">
                  {user?.commune || "—"}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">Xã/Phường</Text>
              </View>
              <View className="items-center">
                <Text className="text-base font-bold text-green-600">
                  {user?.province || "—"}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">Tỉnh/TP</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-primary py-4 rounded-2xl mb-8 flex-row items-center justify-center space-x-2 shadow-md"
            activeOpacity={0.8}
            onPress={() => console.log("Chỉnh sửa profile")}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              Chỉnh sửa thông tin
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
