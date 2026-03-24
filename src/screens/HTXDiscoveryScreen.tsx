/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, Text, VStack } from "@gluestack-ui/themed";
import { ArrowLeft, MapPin, Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { HTXCard } from "../components/common/HTXCard";
import { HTXFilter } from "../components/common/HTXFillter";
import { LocationPicker } from "../components/common/LocationPicker";

import { JoinRequestStatus } from "../constants/enums/joinRequest";
import { PRODUCE_LABELS } from "../constants/enums/produce.enum";

import { searchCooperatives, getaddressAPI } from "../services/search.api";

import { useUserStore } from "../store/user.store";
import { useMyJoinRequests } from "../hook/useMyJoinRequests";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

const HTXDiscoveryScreen = () => {
  const { user, updateProfile } = useUserStore();

  const { data: joinRequests = [], isLoading } = useMyJoinRequests();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isJoinedHTX = joinRequests.some(
    (r: any) => r.status === JoinRequestStatus.APPROVED,
  );

  /**
   * Redirect nếu đã join HTX
   */
  useEffect(() => {
    if (!isLoading && isJoinedHTX) {
      navigation.navigate("CoopFeed");
    }
  }, [isJoinedHTX, isLoading]);

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [allHTXs, setAllHTXs] = useState<any[]>([]);
  const [isFetchingHtx, setIsFetchingHtx] = useState(false);

  const [activeFilters, setActiveFilters] = useState<string[]>(["not_joined"]);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [tempP, setTempP] = useState<any>(null);
  const [tempW, setTempW] = useState<any>(null);
  const [formStep, setFormStep] = useState<"p" | "w">("p");

  const [isLoadingAddr, setIsLoadingAddr] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterText, setFilterText] = useState("");

  /**
   * SEARCH HTX
   */
  const handleSearchHTX = async (
    commune: string,
    province: string,
    produce: string,
  ) => {
    if (!commune || !province) return;

    setIsFetchingHtx(true);

    try {
      const cleanCommune = commune.trim().normalize("NFC");
      const cleanProvince = province.trim().normalize("NFC");

      let cleanProduce: string | undefined = undefined;

      const searchText = removeAccents(produce.trim().toLowerCase());

      if (searchText) {
        const entry = Object.entries(PRODUCE_LABELS).find(([key, label]) => {
          const labelNorm = removeAccents(label.toLowerCase());
          return labelNorm.includes(searchText);
        });

        cleanProduce = entry ? entry[0] : undefined;
      }

      const data = await searchCooperatives(
        cleanCommune,
        cleanProvince,
        cleanProduce,
      );

      setAllHTXs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải HTX:", err);
      setAllHTXs([]);
    } finally {
      setIsFetchingHtx(false);
    }
  };

  /**
   * SEARCH TRIGGER
   */
  useEffect(() => {
    if (user?.commune && user?.province) {
      handleSearchHTX(user.commune, user.province, submittedQuery);
    }
  }, [user?.commune, user?.province, submittedQuery]);

  const enrichedHTXs = useMemo(() => {
    return allHTXs.map((htx) => {
      const req = joinRequests.find(
        (r: any) => String(r.cooperativeId) === String(htx.id),
      );

      return {
        ...htx,
        status: req?.status || JoinRequestStatus.NOT_JOINED,
      };
    });
  }, [allHTXs, joinRequests]);

  const filteredHTXs = useMemo(() => {
    if (activeFilters.length === 0) return enrichedHTXs;

    return enrichedHTXs.filter((htx) => {
      if (
        activeFilters.includes("not_joined") &&
        htx.status === JoinRequestStatus.NOT_JOINED
      )
        return true;

      if (
        activeFilters.includes("pending") &&
        htx.status === JoinRequestStatus.PENDING
      )
        return true;

      if (
        activeFilters.includes("joined") &&
        htx.status === JoinRequestStatus.APPROVED
      )
        return true;

      return false;
    });
  }, [enrichedHTXs, activeFilters]);

  useEffect(() => {
    getaddressAPI.get("/p/").then((res) => setProvinces(res.data));
  }, []);

  const onSelectProvince = async (province: any) => {
    setTempP(province);
    setTempW(null);

    setIsLoadingAddr(true);

    try {
      const { data } = await getaddressAPI.get(`/p/${province.code}?depth=2`);

      setWards(data.wards || []);
      setFormStep("w");
    } finally {
      setIsLoadingAddr(false);
    }
  };

  const handleConfirmAddress = async () => {
    if (!tempP || !tempW || !user) return;

    setIsUpdating(true);

    try {
      await updateProfile({
        ...user,
        commune: tempW.name,
        province: tempP.name,
        address: `${tempW.name}, ${tempP.name}`,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user?.commune || !user?.province) {
    return (
      <LocationPicker
        formStep={formStep}
        setFormStep={setFormStep}
        filterText={filterText}
        setFilterText={setFilterText}
        tempP={tempP}
        tempW={tempW}
        displayData={filterAddress(
          formStep === "p" ? provinces : wards,
          filterText,
        )}
        isLoadingAddr={isLoadingAddr}
        isUpdating={isUpdating}
        onSelectProvince={onSelectProvince}
        setTempW={setTempW}
        onConfirm={handleConfirmAddress}
      />
    );
  }

  const navigateBack = () => navigation.goBack();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView stickyHeaderIndices={[0]}>
        <View className="bg-primary pt-6 pb-8 px-5 rounded-b-[30px] shadow-md">
          <HStack className="flex-row items-center mb-5">
            <ArrowLeft color="white" onPress={navigateBack} />

            <VStack className="ml-3 flex-1">
              <Text className="text-white font-bold text-lg uppercase">
                HTX gần bạn
              </Text>

              <TouchableOpacity
                onPress={() =>
                  updateProfile({ ...user!, commune: "", province: "" })
                }
              >
                <HStack className=" flex-row items-center">
                  <MapPin size={12} color="#D1FAE5" />
                  <Text className="text-emerald-100 text-md italic ml-1 underline">
                    {`${user.commune}, ${user.province}`}
                  </Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </HStack>

          <View className="bg-white flex-row items-center px-4 rounded-xl h-12">
            <Search color="#10B981" size={18} />

            <TextInput
              className="flex-1 ml-2 text-gray-700"
              placeholder="Tìm theo nông sản (Lúa, Gạo...)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => setSubmittedQuery(searchQuery)}
            />
          </View>
        </View>

        <HStack className="px-5 py-3 flex-col">
          <Text className="text-gray-500 font-medium">
            Tìm thấy {filteredHTXs.length} HTX
          </Text>

          <HTXFilter
            onFilterChange={setActiveFilters}
            selectedValues={activeFilters}
          />
        </HStack>

        <View className="p-1">
          {isFetchingHtx ? (
            <ActivityIndicator color="#10B981" size="large" className="mt-10" />
          ) : (
            <VStack>
              {filteredHTXs.map((item) => (
                <HTXCard key={item.id} item={item} />
              ))}

              {filteredHTXs.length === 0 && (
                <Text className="text-center text-gray-400 mt-20 italic">
                  Không tìm thấy HTX nào...
                </Text>
              )}
            </VStack>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * HELPERS
 */

const removeAccents = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const filterAddress = (data: any[], query: string) => {
  const search = removeAccents(query);
  return data.filter((item) => removeAccents(item.name).includes(search));
};

export default HTXDiscoveryScreen;
