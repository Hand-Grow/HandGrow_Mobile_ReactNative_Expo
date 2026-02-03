import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Text, HStack, VStack } from "@gluestack-ui/themed";
import { ArrowLeft, Search, MapPin } from "lucide-react-native";

import { useUserStore } from "../store/user.store";
import { HTXCard } from "../components/common/HTXCard";
import { searchCooperatives } from "../services/search.api";
import { getMyRequestsByStatus } from "../services/joinHTX.api"; // Import thêm API lọc
import { LocationPicker } from "../components/common/LocationPicker";
import { PRODUCE_LABELS } from "../constants/enums/produce.enum";
import { HTXFilter } from "../components/common/HTXFillter"; // Sửa lỗi chính tả Fillter -> Filter nếu cần
import { JoinRequestStatus } from "../constants/enums/joinRequest";

const addressApi = axios.create({
  baseURL: "https://provinces.open-api.vn/api/v2",
});

const HTXDiscoveryScreen = () => {
  const { user, updateProfile, joinRequests, fetchMyRequests } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const [htxList, setHtxList] = useState<any[]>([]);
  const [allHTXs, setAllHTXs] = useState<any[]>([]);
  const [isFetchingHtx, setIsFetchingHtx] = useState(false);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [tempP, setTempP] = useState<any>(null);
  const [tempW, setTempW] = useState<any>(null);
  const [formStep, setFormStep] = useState<"p" | "w">("p");
  const [isLoadingAddr, setIsLoadingAddr] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleSearchHTX = useCallback(
    async (commune: string, province: string, produce: string) => {
      if (!commune || !province) return;

      setIsFetchingHtx(true);
      try {
        const cleanCommune = commune.trim().normalize("NFC");
        const cleanProvince = province.trim().normalize("NFC");

        let cleanProduce: string | undefined = undefined;
        const searchText = produce.trim().toLowerCase();

        if (searchText) {
          const entry = Object.entries(PRODUCE_LABELS).find(([key, label]) =>
            label.toLowerCase().includes(searchText),
          );
          cleanProduce = entry ? entry[0] : undefined;
        }

        const data = await searchCooperatives(
          cleanCommune,
          cleanProvince,
          cleanProduce,
        );

        const enrichedData = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          status:
            joinRequests.find((r: any) => r.cooperativeId === item.id)
              ?.status || JoinRequestStatus.NOT_JOINED,
        }));

        setAllHTXs(enrichedData);
        setHtxList(enrichedData);
      } catch (err) {
        console.error("Lỗi tải HTX:", err);
        setHtxList([]);
      } finally {
        setIsFetchingHtx(false);
      }
    },
    [joinRequests],
  );

  const handleFilterChange = async (filters: string[]) => {
    if (filters.length === 0) {
      setHtxList(allHTXs);
      return;
    }

    setIsFetchingHtx(true);
    try {
      let results: any[] = [];

      if (filters.includes("pending") || filters.includes("joined")) {
        const statusToFetch = filters.includes("pending")
          ? "PENDING"
          : "APPROVED";
        const data = await getMyRequestsByStatus(statusToFetch);

        const mapped = (data || []).map((req: any) => ({
          ...req,
          id: req.cooperativeId || req.id,
          name: req.cooperativeName,
          status: req.status || statusToFetch,
        }));
        results = [...results, ...mapped];
      }

      if (filters.includes("not_joined")) {
        const notJoined = allHTXs.filter(
          (htx) => !joinRequests.some((r: any) => r.cooperativeId === htx.id),
        );
        results = [...results, ...notJoined];
      }

      const final = Array.from(
        new Map(results.map((item) => [item.id, item])).values(),
      );
      setHtxList(final);
    } finally {
      setIsFetchingHtx(false);
    }
  };

  useEffect(() => {
    if (user?.commune && user?.province) {
      handleSearchHTX(user.commune, user.province, submittedQuery);
    }
  }, [user?.commune, user?.province, submittedQuery, joinRequests]);

  useEffect(() => {
    addressApi.get("/p/").then((res) => setProvinces(res.data));
  }, []);

  const onSelectProvince = async (province: any) => {
    setTempP(province);
    setTempW(null);
    setIsLoadingAddr(true);
    try {
      const { data } = await addressApi.get(`/p/${province.code}?depth=2`);
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary pt-6 pb-8 px-5 rounded-b-[30px] shadow-md">
          <HStack className="flex-row items-center mb-5">
            <ArrowLeft color="white" />
            <VStack className="ml-3 flex-1">
              <Text className="text-white font-bold text-lg uppercase">
                HTX gần bạn
              </Text>
              <TouchableOpacity
                onPress={() =>
                  updateProfile({ ...user!, commune: "", province: "" })
                }
              >
                <HStack className="flex-row items-center">
                  <MapPin size={12} color="#D1FAE5" />
                  <Text className="text-emerald-100 text-md italic ml-1 underline">
                    {`${user.commune}, ${user.province}`} (Đổi)
                  </Text>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </HStack>
          <View className="bg-white flex-row items-center px-4 rounded-xl h-12">
            <Search color="#10B981" size={18} />
            <TextInput
              className="flex-1 ml-2 text-gray-700 h-full"
              placeholder="Tìm theo nông sản (Lúa, Gạo...)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => setSubmittedQuery(searchQuery)}
            />
          </View>
        </View>

        <View className="px-5 py-3 flex-row justify-between items-center">
          <Text className="text-gray-500 font-medium">
            Tìm thấy {htxList.length} HTX
          </Text>
          <HTXFilter onFilterChange={handleFilterChange} />
        </View>

        <View className="p-1">
          {isFetchingHtx ? (
            <ActivityIndicator color="#10B981" className="mt-10" size="large" />
          ) : (
            <VStack>
              {htxList.map((item) => (
                <HTXCard key={item.id} item={item} />
              ))}
              {htxList.length === 0 && (
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

// Helper function moved outside
const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
const filterAddress = (data: any[], query: string) => {
  const search = removeAccents(query);
  return data.filter((item) => removeAccents(item.name).includes(search));
};

export default HTXDiscoveryScreen;
