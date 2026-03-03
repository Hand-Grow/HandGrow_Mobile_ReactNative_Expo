import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft, Plus, MapPin } from "lucide-react-native";
import { plotApi } from "../services/plot.api";
import { PlotResponse } from "../type/plot.type";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PlotListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [plots, setPlots] = useState<PlotResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // New plot form
  const [plotName, setPlotName] = useState("");
  const [plotLocation, setPlotLocation] = useState("");
  const [plotArea, setPlotArea] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      setIsLoading(true);
      const data = await plotApi.getMyPlots();
      setPlots(data);
    } catch (error) {
      console.log("Error fetching plots", error);
      Alert.alert("Lỗi", "Không thể lấy danh sách mảnh ruộng.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlot = async () => {
    if (!plotName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên ruộng");
      return;
    }
    try {
      setIsCreating(true);
      const newPlot = await plotApi.createPlot({
        name: plotName,
        location: plotLocation || "Chưa cập nhật",
        area: Number(plotArea) || 1000,
        areaUnit: "m2",
      });
      setPlots((prev) => [...prev, newPlot]);
      setIsModalVisible(false);
      setPlotName("");
      setPlotLocation("");
      setPlotArea("");
    } catch (error) {
      console.log("Error creating plot", error);
      Alert.alert("Lỗi", "Không thể tạo mới mảnh ruộng.");
    } finally {
      setIsCreating(false);
    }
  };

  const renderPlotItem = ({ item }: { item: PlotResponse }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("Diary", { plotId: item.id, plotName: item.name })
      }
      className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100 flex-row items-center justify-between"
    >
      <View>
        <Text className="text-lg font-bold text-gray-800 mb-1">
          {item.name}
        </Text>
        <View className="flex-row items-center">
          <MapPin size={14} color="#6B7280" />
          <Text className="text-gray-500 text-sm ml-1">
            {item.location} • {item.area} {item.areaUnit}
          </Text>
        </View>
      </View>
      <View className="bg-blue-50 p-2 rounded-full">
        <ArrowLeft
          size={20}
          color="#3B82F6"
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-4 px-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 mr-2"
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1">
          Chọn mảnh ruộng
        </Text>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="p-2"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <View className="flex-1 px-4 pt-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#3B82F6" className="mt-10" />
        ) : plots.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-500 mb-4 text-center">
              Bạn chưa có mảnh ruộng nào.
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="bg-blue-500 px-6 py-2 rounded-full"
            >
              <Text className="text-white font-bold">Thêm mảnh ruộng</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={plots}
            keyExtractor={(item) => item.id}
            renderItem={renderPlotItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* Create Plot Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Thêm mảnh ruộng mới
            </Text>

            <Text className="text-gray-600 font-medium mb-1">Tên ruộng</Text>
            <TextInput
              value={plotName}
              onChangeText={setPlotName}
              placeholder="Vd: Vườn Dưa Lưới số 1"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4"
            />

            <Text className="text-gray-600 font-medium mb-1">Vị trí</Text>
            <TextInput
              value={plotLocation}
              onChangeText={setPlotLocation}
              placeholder="Vd: Khu A"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4"
            />

            <Text className="text-gray-600 font-medium mb-1">
              Diện tích (m²)
            </Text>
            <TextInput
              value={plotArea}
              onChangeText={setPlotArea}
              placeholder="Vd: 1000"
              keyboardType="numeric"
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6"
            />

            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-200 bg-gray-50 mr-2"
                disabled={isCreating}
              >
                <Text className="text-gray-600 font-medium">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePlot}
                className="px-6 py-2.5 rounded-lg bg-blue-500 flex-row items-center"
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator
                    size="small"
                    color="#fff"
                    className="mr-2"
                  />
                ) : null}
                <Text className="text-white font-medium">Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
