import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { WeatherAlert } from "./WeatherAlert";

const { width } = Dimensions.get("window");

const ALERTS = [
  {
    id: 1,
    type: "warning",
    title: "Cảnh báo mưa lớn",
    description:
      "Dự báo có mưa lớn từ 16h chiều nay. Nên hoàn thành việc phun thuốc trước 14h.",
  },
  {
    id: 2,
    type: "critical",
    title: "Nguy cơ bão mạnh",
    description: "Bão cấp 10–11 có thể ảnh hưởng trực tiếp trong 24h tới.",
  },
  {
    id: 3,
    type: "info",
    title: "Thời tiết ổn định",
    description: "Trời nắng nhẹ, thích hợp cho các hoạt động ngoài trời.",
  },
];

export const WeatherAlertCarousel = () => {
  return (
    <View>
      <Carousel
        width={width}
        height={150}
        data={ALERTS}
        loop
        autoPlay
        autoPlayInterval={4000}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <View className="pe-10">
            <WeatherAlert
              type={item.type as "warning" | "critical" | "info"}
              title={item.title}
              description={item.description}
            />
          </View>
        )}
      />
    </View>
  );
};
