import {
  Button,
  ButtonText,
  Heading,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CheckCircle2, MapPin, Search } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigation/AppNavigator";

interface LocationPickerProps {
  formStep: "p" | "w";
  setFormStep: (step: "p" | "w") => void;
  filterText: string;
  setFilterText: (text: string) => void;
  tempP: any;
  tempW: any;
  displayData: any[];
  isLoadingAddr: boolean;
  isUpdating: boolean;
  onSelectProvince: (p: any) => void;
  setTempW: (w: any) => void;
  onConfirm: () => void;
}

export const LocationPicker = (props: LocationPickerProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    formStep,
    setFormStep,
    filterText,
    setFilterText,
    tempP,
    tempW,
    displayData,
    isLoadingAddr,
    isUpdating,
    onSelectProvince,
    setTempW,
    onConfirm,
  } = props;

  const handleNavigateToGroupOrder = () => {
    navigation.navigate("GroupOrder" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <VStack>
        <View className="items-center mb-2">
          <View className="bg-emerald-100 p-4 rounded-full mb-3">
            <MapPin size={32} color="primary" />
          </View>
          <Heading className="text-primary text-center text-2xl">
            Xác định vị trí
          </Heading>
          <Text className="text-gray-500 text-center text-xl mb-2 px-6">
            Vui lòng chọn{" "}
            <Text className="font-bold text-emerald-600">Tỉnh</Text> và{" "}
            <Text className="font-bold text-emerald-600">Xã</Text> để khám phá
            nhé!
          </Text>
        </View>

        <Pressable
          onPress={() => {
            setFormStep("p");
            setFilterText("");
          }}
          className={`p-4 rounded-2xl border-2 flex-row justify-between items-center mb-4 ${formStep === "p" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}
        >
          <VStack>
            <Text className="text-md font-bold text-emerald-600 uppercase">
              Tỉnh / Thành phố
            </Text>
            <Text
              className={`text-lg ${tempP ? "font-bold text-gray-800" : "text-gray-400"}`}
            >
              {tempP?.name || "Bấm chọn tỉnh thành"}
            </Text>
          </VStack>
          {tempP && <CheckCircle2 size={20} color="primary" />}
        </Pressable>

        <Pressable
          disabled={!tempP}
          onPress={() => {
            setFormStep("w");
            setFilterText("");
          }}
          className={`p-4 rounded-2xl border-2 flex-row justify-between items-center ${!tempP ? "opacity-50 bg-gray-100" : formStep === "w" ? "border-emerald-500 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}
        >
          <VStack>
            <Text className="text-md font-bold text-emerald-600 uppercase">
              Xã / Phường (Sau sáp nhập)
            </Text>
            <Text
              className={`text-lg ${tempW ? "font-bold text-gray-800" : "text-gray-400"}`}
            >
              {tempW?.name ||
                (tempP ? "Bấm chọn xã phường" : "Hãy chọn tỉnh trước")}
            </Text>
          </VStack>
          {tempW && <CheckCircle2 size={20} color="primary" />}
        </Pressable>

        <VStack className="bg-gray-50 rounded-2xl p-2 border border-gray-100">
          <View className="bg-white flex-row items-center px-4 rounded-xl h-11 border border-gray-200 mb-2">
            <Search color="primary" size={16} />
            <TextInput
              className="flex-1 ml-2 text-gray-700 h-full text-md"
              placeholder={
                formStep === "p"
                  ? "Tìm nhanh tỉnh thành..."
                  : "Tìm nhanh xã phường..."
              }
              value={filterText}
              onChangeText={setFilterText}
            />
          </View>
          <View className="h-44">
            {isLoadingAddr ? (
              <ActivityIndicator className="mt-10" color="primary" />
            ) : (
              <ScrollView nestedScrollEnabled>
                {displayData.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    className="p-3 border-b border-gray-50 flex-row justify-between"
                    onPress={() => {
                      if (formStep === "p") onSelectProvince(item);
                      else setTempW(item);
                      setFilterText("");
                    }}
                  >
                    <Text
                      className={
                        (formStep === "p" ? tempP : tempW)?.code === item.code
                          ? "text-emerald-600 font-bold"
                          : "text-gray-600"
                      }
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </VStack>

        <Button
          className={`h-14 rounded-2xl mt-4 flex-row justify-center items-center ${!tempW || isUpdating ? "bg-gray-300" : "bg-emerald-600"}`}
          disabled={!tempW || isUpdating}
          onPress={onConfirm}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText className="font-bold text-white text-center text-md">
              Bắt đầu khám phá
            </ButtonText>
          )}
        </Button>

        <Button
          className="h-14 rounded-2xl mt-2 flex-row justify-center items-center bg-blue-600"
          onPress={handleNavigateToGroupOrder}
        >
          <ButtonText className="font-bold text-white text-center text-md">
            Test: Đến trang Mua chung
          </ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
};
