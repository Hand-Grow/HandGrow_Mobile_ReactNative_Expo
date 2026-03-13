import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  CheckCircle2,
  Construction,
  Scan,
  Sparkles,
  User,
} from "lucide-react-native";

import { Text } from "@/src/components/ui/text";
import type { RootStackParamList } from "@/src/navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type UpcomingRouteProp = RouteProp<RootStackParamList, "Upcoming">;

type FeatureKey = NonNullable<RootStackParamList["Upcoming"]>["feature"];

type FeatureStatus = "Planned" | "In progress" | "Later";

type FeatureItem = {
  title: string;
  description: string;
  status: FeatureStatus;
  eta?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  accent: string;
  bg: string;
};

function FeatureCard({ item }: { item: FeatureItem }) {
  const Icon = item.Icon;
  return (
    <View className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3 border"
            style={{
              backgroundColor: item.bg,
              borderColor: item.accent + "22",
            }}
          >
            <Icon size={22} color={item.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-extrabold text-slate-900">
              {item.title}
            </Text>
            <Text className="text-sm text-slate-500 mt-0.5">
              {item.description}
            </Text>
          </View>
        </View>
      </View>

      {item.eta ? (
        <View className="flex-row items-center mt-3">
          <CheckCircle2 size={14} color="#94a3b8" />
          <Text className="text-xs text-slate-400 ml-2">ETA: {item.eta}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function UpcomingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<UpcomingRouteProp>();

  const featureKey: FeatureKey = route.params?.feature ?? "generic";

  const screen = useMemo(() => {
    const baseItems: FeatureItem[] = [
      {
        title: "Disease Scan",
        description: "Camera scan + AI suggestions for plant health.",
        status: "Planned",
        eta: "Soon",
        Icon: Scan,
        accent: "#10B981",
        bg: "#ECFDF5",
      },
      {
        title: "Personal Profile",
        description: "Farmer profile, settings, and account management.",
        status: "Later",
        Icon: User,
        accent: "#F97316",
        bg: "#FFF7ED",
      },
      {
        title: "Diary Improvements",
        description: "Better audio notes, search, and reminders.",
        status: "In progress",
        Icon: BookOpen,
        accent: "#3B82F6",
        bg: "#EFF6FF",
      },
      {
        title: "Smart Notifications",
        description: "Weather, task reminders, and coop updates.",
        status: "Later",
        Icon: Bell,
        accent: "#EAB308",
        bg: "#FEFCE8",
      },
    ];

    if (featureKey === "scan") {
      return {
        title: "Disease Scan",
        subtitle: "This feature is planned. We'll add it step by step.",
        HeroIcon: Scan,
        items: baseItems,
      };
    }

    if (featureKey === "profile") {
      return {
        title: "Personal Profile",
        subtitle: "Profile & settings are coming in a future update.",
        HeroIcon: User,
        items: baseItems,
      };
    }

    if (featureKey === "diary") {
      return {
        title: "Diary",
        subtitle: "We're improving the diary experience soon.",
        HeroIcon: BookOpen,
        items: baseItems,
      };
    }

    return {
      title: "Upcoming",
      subtitle: "A placeholder screen for features we'll build later.",
      HeroIcon: Sparkles,
      items: baseItems,
    };
  }, [featureKey]);

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

  const HeroIcon = screen.HeroIcon;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 py-12 bg-primary rounded-b-[30px] shadow-md">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={navigateBack}
              className="w-11 h-11 rounded-full bg-white/20 items-center justify-center"
              activeOpacity={0.8}
            >
              <ArrowLeft size={20} color="#fff" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <Construction size={18} color="#fff" />
              <Text className="text-white/90 font-bold text-sm">
                Coming soon
              </Text>
            </View>
          </View>

          <View className="mt-6 flex-row items-center">
            <View className="w-14 h-14 rounded-3xl bg-white/20 items-center justify-center mr-4">
              <HeroIcon size={26} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-2xl font-extrabold">
                {screen.title}
              </Text>
              <Text className="text-white/90 mt-1">{screen.subtitle}</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-5 pb-10">
          <View className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm">
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 items-center justify-center mr-3">
                <Sparkles size={18} color="#0f172a" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-extrabold text-slate-900">
                  Why this screen exists
                </Text>
                <Text className="text-sm text-slate-500 mt-1">
                  Use this as a safe destination for buttons/menu items that
                  aren{"'"}t built yet. No crashes, just clear messaging.
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={navigateBack}
              className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm items-center justify-center"
            >
              <Text className="font-bold text-slate-700">Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled
              className="flex-1 bg-slate-200 rounded-2xl p-4 items-center justify-center opacity-60"
            >
              <Text className="font-bold text-slate-700">Notify me</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-extrabold text-slate-900 mt-8 mb-3">
            Planned features
          </Text>

          <View className="gap-3">
            {screen.items.map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
